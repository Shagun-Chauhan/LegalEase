import React, { useState, useRef, useEffect } from 'react';
import {
  MapPin, Navigation, Search, X, ChevronRight,
  Building2, Shield, Scale, Phone, Clock, Star,
  AlertCircle, Loader2, ExternalLink, RefreshCw
} from 'lucide-react';

import MapView from './MapView';
const popularCities = ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Hyderabad', 'Pune', 'Kolkata', 'Ahmedabad'];

const typeConfig = {
  court: { icon: Scale, color: 'text-navy-600', bg: 'bg-navy-100', label: 'Court', badge: 'badge-blue' },
  police: { icon: Shield, color: 'text-red-600', bg: 'bg-red-100', label: 'Police', badge: 'badge-red' },
  legalaid: { icon: Building2, color: 'text-emerald-600', bg: 'bg-emerald-100', label: 'Legal Aid', badge: 'badge-green' },
};

const filterTabs = [
  { id: 'all', label: 'All' },
  { id: 'court', label: 'Courts' },
  { id: 'police', label: 'Police' },
  { id: 'legalaid', label: 'Legal Aid' },
];

export default function LocationPicker({ onClose, onCitySelect }) {
  const [step, setStep] = useState('choose'); // 'choose' | 'detecting' | 'manual' | 'results'
  const [location, setLocation] = useState(null); // { city, lat, lng, display }
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [gpsError, setGpsError] = useState('');
  const [selectedPlace, setSelectedPlace] = useState(null);
  const searchRef = useRef(null);
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [placeSearchQuery, setPlaceSearchQuery] = useState('');

  const fetchPlaces = async (lat, lng, type = "all") => {
    try {
      setLoading(true);
      setError('');
      setPlaceSearchQuery('');
      const res = await fetch(
        `http://localhost:5000/api/location/nearby?lat=${lat}&lng=${lng}&type=${type}`
      );
      
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Search service is temporarily busy");
      }

      if (data.places) {
        setPlaces(data.places);
        setStep("results");
        if (data.places.length === 0) {
          setError("No legal resources found in this 10km area.");
        }
      }
    } catch (err) {
      console.error("Error fetching places:", err);
      setError(err.message || "Failed to connect to location service");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (step === 'manual' && searchRef.current) searchRef.current.focus();
  }, [step]);

  useEffect(() => {
    if (location?.lat) {
      fetchPlaces(location.lat, location.lng, filter);
    }
  }, [filter]); // Only re-fetch on filter change; location change handled by select/detect

  const detectGPS = () => {
    setGpsError('');
    setStep('detecting');
  
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
  
        const newLoc = {
          lat,
          lng,
          display: "Current Location",
        };
        setLocation(newLoc);
        if (onCitySelect) onCitySelect("Current Location");
        fetchPlaces(lat, lng, filter);
      },
      (err) => {
        console.error("GPS Error:", err);
        setGpsError(err.code === 1 ? "Location permission denied" : "Could not detect location");
        setStep("choose");
      },
      { enableHighAccuracy: true, timeout: 5000 }
    );
  };

  const selectCity = async (city) => {
    try {
      setLoading(true);
      setError('');
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${city}&limit=1`
      );
    
      const data = await res.json();
      if (data && data.length > 0) {
        const lat = parseFloat(data[0].lat);
        const lng = parseFloat(data[0].lon);
      
        const newLoc = { city, lat, lng, display: city };
        setLocation(newLoc);
        if (onCitySelect) onCitySelect(city);
        fetchPlaces(lat, lng, filter);
      } else {
        setGpsError(`Could not find location for ${city}`);
        setStep("choose");
      }
    } catch (err) {
      console.error("Error selecting city:", err);
      setError("Failed to resolve city coordinates");
    } finally {
      setLoading(false);
    }
  };

  const filteredSearch = popularCities.filter(c =>
    c.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredPlaces = places.filter(p => 
    p.name.toLowerCase().includes(placeSearchQuery.toLowerCase()) ||
    p.address.toLowerCase().includes(placeSearchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={onClose} />

      {/* Panel */}
      <div className="relative w-full sm:max-w-lg bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl max-h-[90vh] flex flex-col animate-slide-up overflow-hidden">

        {/* Handle (mobile) */}
        <div className="flex justify-center pt-3 pb-1 sm:hidden">
          <div className="w-10 h-1 bg-slate-200 rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-navy-100 rounded-lg flex items-center justify-center">
              <MapPin size={16} className="text-navy-700" />
            </div>
            <div>
              <h2 className="font-semibold text-slate-900 text-sm leading-tight">Nearby Legal Resources</h2>
              {location && (
                <p className="text-xs text-slate-400 leading-tight">{location.display}</p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {step === 'results' && (
              <button
                onClick={() => { setStep('choose'); setLocation(null); setFilter('all'); }}
                className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
                title="Change location"
              >
                <RefreshCw size={14} />
              </button>
            )}
            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors">
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1">

          {/* ── STEP: CHOOSE ── */}
          {(step === 'choose' || step === 'detecting' || step === 'manual') && (
            <div className="p-5 space-y-4">
              {gpsError && (
                <div className="flex items-start gap-2.5 p-3.5 bg-red-50 border border-red-100 rounded-xl">
                  <AlertCircle size={15} className="text-red-500 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-red-600 leading-relaxed">{gpsError}</p>
                </div>
              )}

              {/* GPS button */}
              {(step === 'choose' || step === 'detecting') && (
                <button
                  onClick={detectGPS}
                  disabled={step === 'detecting'}
                  className="w-full flex items-center gap-3 p-4 rounded-xl border-2 border-navy-200 bg-navy-50
                             hover:bg-navy-100 hover:border-navy-400 transition-all group
                             disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <div className="w-10 h-10 bg-navy-700 rounded-xl flex items-center justify-center flex-shrink-0 shadow-navy">
                    {step === 'detecting'
                      ? <Loader2 size={18} className="text-white animate-spin" />
                      : <Navigation size={18} className="text-white" />
                    }
                  </div>
                  <div className="text-left flex-1">
                    <p className="font-semibold text-navy-800 text-sm">
                      {step === 'detecting' ? 'Detecting your location...' : 'Use my current location'}
                    </p>
                    <p className="text-xs text-navy-500 mt-0.5">Auto-detect via GPS for best results</p>
                  </div>
                  {step !== 'detecting' && <ChevronRight size={16} className="text-navy-400 group-hover:text-navy-600" />}
                </button>
              )}

              {(step === 'choose' || step === 'detecting') && (
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-px bg-slate-200" />
                  <span className="text-xs text-slate-400 font-medium">or</span>
                  <div className="flex-1 h-px bg-slate-200" />
                </div>
              )}

              {/* Manual search */}
              <div className="animate-fade-in">
                <div className="relative mb-3">
                  <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    ref={searchRef}
                    type="text"
                    value={searchQuery}
                    onChange={e => { setSearchQuery(e.target.value); if (step !== 'manual') setStep('manual'); }}
                    onKeyDown={e => e.key === 'Enter' && selectCity(searchQuery)}
                    placeholder="Search your city (e.g. Pune, Kharadi)"
                    className="input-field pl-10"
                  />
                  {searchQuery && (
                    <button onClick={() => { setSearchQuery(''); setStep('choose'); }} className="absolute right-3 top-1/2 -translate-y-1/2">
                      <X size={13} className="text-slate-400" />
                    </button>
                  )}
                </div>

                {/* City suggestions when searching */}
                {step === 'manual' && (
                  <div className="card-base overflow-hidden animate-slide-up shadow-lg border-navy-100">
                    {filteredSearch.map(city => (
                      <button
                        key={city}
                        onClick={() => selectCity(city)}
                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-navy-50 transition-colors border-b border-slate-50 last:border-0"
                      >
                        <MapPin size={14} className="text-navy-500 flex-shrink-0" />
                        <span className="text-sm font-medium text-slate-700">{city}</span>
                        <ChevronRight size={13} className="ml-auto text-slate-300" />
                      </button>
                    ))}
                    {searchQuery.length > 2 && (
                      <button
                        onClick={() => selectCity(searchQuery)}
                        className="w-full flex items-center gap-3 px-4 py-3 bg-navy-50/50 hover:bg-navy-100 transition-colors text-navy-700"
                      >
                        <Search size={14} className="flex-shrink-0" />
                        <span className="text-sm font-bold">Search for "{searchQuery}"...</span>
                        {loading && <Loader2 size={13} className="ml-auto animate-spin" />}
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Popular cities */}
              {step === 'choose' && (
                <div>
                  <p className="section-label mb-2.5">Popular Cities</p>
                  <div className="flex flex-wrap gap-2">
                    {popularCities.map(city => (
                      <button
                        key={city}
                        onClick={() => selectCity(city)}
                        className="px-3 py-1.5 rounded-lg border border-slate-200 text-sm text-slate-600 font-medium
                                   hover:border-navy-400 hover:text-navy-700 hover:bg-navy-50 transition-all"
                      >
                        {city}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── STEP: RESULTS ── */}
          {step === 'results' && !selectedPlace && (
            <div className="flex flex-col h-full bg-slate-50/50">
               {location?.lat && (
                  <div className="h-48 w-full flex-shrink-0 border-b border-slate-200 shadow-inner">
                    <MapView
                      center={[location.lat, location.lng]}
                      places={filteredPlaces}
                    />
                  </div>
                )}
              
              {/* Error/Feedback Message */}
              {error && (
                <div className="p-4 bg-amber-50 border-b border-amber-100 flex items-start gap-2.5">
                  <AlertCircle size={15} className="text-amber-500 mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-amber-700 leading-relaxed font-medium">{error}</p>
                </div>
              )}

              {loading && (
                <div className="absolute inset-0 z-50 p-8 flex flex-col items-center justify-center bg-white/60 backdrop-blur-[2px]">
                  <Loader2 className="animate-spin text-navy-600 mb-2" size={32} />
                  <p className="text-sm text-navy-800 font-bold">Updating nearby resources...</p>
                  <p className="text-xs text-slate-500">Checking multiple servers for accuracy</p>
                </div>
              )}

              {/* Search & Filter Bar */}
              <div className="sticky top-0 bg-white border-b border-slate-200 z-10 shadow-sm">
                <div className="px-5 py-3 flex items-center gap-3">
                  <div className="relative flex-1">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input 
                      type="text"
                      value={placeSearchQuery}
                      onChange={e => setPlaceSearchQuery(e.target.value)}
                      placeholder="Search places by name..."
                      className="w-full pl-9 pr-4 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:ring-1 focus:ring-navy-500 outline-none"
                    />
                  </div>
                </div>
                <div className="flex gap-1 px-5 pb-3 overflow-x-auto scrollbar-none">
                  {filterTabs.map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setFilter(tab.id)}
                      className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all
                        ${filter === tab.id ? 'bg-navy-700 text-white shadow-sm' : 'text-slate-500 hover:bg-slate-100 bg-slate-50'}`}
                    >
                      {tab.label}
                    </button>
                  ))}
                  <div className="ml-auto flex items-center gap-1 text-[10px] font-bold text-slate-400 whitespace-nowrap pl-2 uppercase tracking-wide">
                    <MapPin size={11} /> {filteredPlaces.length} results
                  </div>
                </div>
              </div>

              {/* Places list */}
              <div className="divide-y divide-slate-100 bg-white">
                {filteredPlaces.length === 0 ? (
                  <div className="p-10 text-center text-slate-400">
                    <Search size={32} className="mx-auto mb-2 opacity-20" />
                    <p className="text-sm">No matches found for "{placeSearchQuery}"</p>
                  </div>
                ) : (
                  filteredPlaces.map(place => {
                    const cfg = typeConfig[place.type];
                    const Icon = cfg.icon;
                    return (
                      <div
                        key={place.id}
                        onClick={() => setSelectedPlace(place)}
                        className="px-5 py-4 hover:bg-slate-50 transition-colors cursor-pointer group border-l-4 border-transparent hover:border-navy-500"
                      >
                        <div className="flex items-start gap-4">
                          <div className={`w-10 h-10 rounded-xl ${cfg.bg} flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm`}>
                            <Icon size={18} className={cfg.color} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap mb-1">
                              <p className="font-bold text-slate-900 text-sm leading-tight">{place.name}</p>
                              <span className={`badge ${cfg.badge} text-[10px] font-bold`}>{cfg.label}</span>
                            </div>
                            <p className="text-xs text-slate-500 truncate leading-relaxed">{place.address}</p>
                            <div className="flex items-center gap-4 mt-2">
                              <span className="text-[11px] text-navy-700 font-bold flex items-center gap-1">
                                <Navigation size={11} /> {place.distance}
                              </span>
                              <span className="text-[11px] text-amber-600 font-bold flex items-center gap-1">
                                <Star size={11} className="fill-amber-400 text-amber-400" /> {place.rating}
                              </span>
                              <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                                <Clock size={11} /> {place.hours}
                              </span>
                            </div>
                          </div>
                          <ChevronRight size={16} className="text-slate-300 group-hover:text-navy-500 flex-shrink-0 mt-2 transition-colors" />
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Map CTA */}
              <div className="p-5 bg-white border-t border-slate-100">
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${location.lat},${location.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-dashed border-slate-300 text-sm text-slate-500 hover:border-navy-400 hover:text-navy-600 hover:bg-navy-50 transition-all font-semibold"
                >
                  <ExternalLink size={14} /> View full area on Google Maps
                </a>
              </div>
            </div>
          )}

          {/* ── STEP: PLACE DETAIL ── */}
          {step === 'results' && selectedPlace && (() => {
            const cfg = typeConfig[selectedPlace.type];
            const Icon = cfg.icon;
            return (
              <div className="animate-fade-in pb-8">
                {/* Back */}
                <button
                  onClick={() => setSelectedPlace(null)}
                  className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-navy-700 transition-colors px-5 py-4 border-b border-slate-100 w-full bg-white"
                >
                  <ChevronRight size={14} className="rotate-180" /> Back to list
                </button>

                <div className="p-5 space-y-6 bg-white">
                  {/* Place header */}
                  <div className="flex items-start gap-4">
                    <div className={`w-14 h-14 rounded-2xl ${cfg.bg} flex items-center justify-center flex-shrink-0 shadow-sm`}>
                      <Icon size={28} className={cfg.color} />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <h3 className="font-display font-bold text-xl text-slate-900 leading-tight">{selectedPlace.name}</h3>
                        {selectedPlace.open
                          ? <span className="badge badge-green font-bold text-[11px]">Open Now</span>
                          : <span className="badge badge-red font-bold text-[11px]">Temporarily Closed</span>
                        }
                      </div>
                      <p className="text-sm text-slate-500 leading-relaxed">{selectedPlace.address}</p>
                    </div>
                  </div>

                  {/* Info grid */}
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { icon: Navigation, label: 'Distance', value: selectedPlace.distance },
                      { icon: Star, label: 'Rating', value: `${selectedPlace.rating} / 5.0` },
                      { icon: Phone, label: 'Contact', value: selectedPlace.phone },
                      { icon: Clock, label: 'Schedule', value: selectedPlace.hours },
                    ].map(({ icon: I, label, value }) => (
                      <div key={label} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 shadow-sm">
                        <div className="flex items-center gap-1.5 mb-2">
                          <I size={13} className="text-slate-400" />
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{label}</span>
                        </div>
                        <p className="text-sm font-bold text-slate-800 leading-tight truncate">{value}</p>
                      </div>
                    ))}
                  </div>

                  <div className="h-44 rounded-2xl overflow-hidden border border-slate-100 shadow-lg relative isolate">
                    <MapView
                      center={[selectedPlace.lat, selectedPlace.lng]}
                      places={[selectedPlace]}
                      zoom={15}
                    />
                  </div>

                  {/* Actions */}
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <a
                      href={`tel:${selectedPlace.phone}`}
                      className="flex items-center justify-center gap-2 py-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-sm font-bold text-slate-700 transition-colors shadow-sm"
                    >
                      <Phone size={16} /> Call Now
                    </a>
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${selectedPlace.lat},${selectedPlace.lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 py-3.5 rounded-xl btn-primary text-sm font-bold shadow-navy group"
                    >
                      <ExternalLink size={16} className="group-hover:scale-110 transition-transform" /> Directions
                    </a>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      </div>
    </div>
  );
}
