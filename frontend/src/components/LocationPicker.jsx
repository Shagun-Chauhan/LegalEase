import React, { useState, useRef, useEffect } from 'react';
import {
  MapPin, Navigation, Search, X, ChevronRight,
  Building2, Shield, Scale, Phone, Clock, Star,
  AlertCircle, Loader2, ExternalLink, RefreshCw
} from 'lucide-react';

import MapView from './MapView';
const popularCities = ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Hyderabad', 'Pune', 'Kolkata', 'Ahmedabad'];

const typeConfig = {
  court: { icon: Scale, color: 'text-navy-600 dark:text-navy-400', bg: 'bg-navy-50 dark:bg-navy-950/40', label: 'Court', badge: 'badge-blue' },
  police: { icon: Shield, color: 'text-red-500 dark:text-red-400', bg: 'bg-red-50 dark:bg-red-950/40', label: 'Police', badge: 'badge-red' },
  legalaid: { icon: Building2, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-950/40', label: 'Legal Aid', badge: 'badge-green' },
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
  }, [filter]);

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
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={onClose} />

      {/* Panel */}
      <div className="relative w-full sm:max-w-xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl max-h-[85vh] flex flex-col animate-slide-up overflow-hidden border border-slate-200 dark:border-white/10">

        {/* Handle (mobile) */}
        <div className="flex justify-center pt-3 pb-1 sm:hidden">
          <div className="w-12 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-navy-900 dark:bg-navy-950/30 rounded-2xl flex items-center justify-center border border-navy-800/30 shadow-xl shadow-navy">
              <MapPin size={22} className="text-white" strokeWidth={2.5} />
            </div>
            <div>
              <h2 className="font-display font-black text-slate-900 dark:text-white text-xl uppercase tracking-tighter">Nearby Jurisdictions</h2>
              {location && (
                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-navy-600 dark:text-navy-400 mt-1">{location.display} Sector</p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3">
            {step === 'results' && (
              <button
                onClick={() => { setStep('choose'); setLocation(null); setFilter('all'); }}
                className="p-3 rounded-2xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-400 hover:text-navy-600 transition-all active:scale-95 border border-slate-100 dark:border-white/5"
                title="Change location"
              >
                <RefreshCw size={18} strokeWidth={2.5} />
              </button>
            )}
            <button onClick={onClose} className="p-3 rounded-2xl bg-white dark:bg-slate-800 hover:bg-red-50 dark:hover:bg-red-950/20 text-slate-400 hover:text-red-500 transition-all active:scale-95 border border-slate-100 dark:border-white/5">
              <X size={20} strokeWidth={2.5} />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 bg-white dark:bg-slate-900">

          {/* ── STEP: CHOOSE ── */}
          {(step === 'choose' || step === 'detecting' || step === 'manual') && (
            <div className="p-6 space-y-6">
              {gpsError && (
                <div className="flex items-start gap-3 p-4 bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30 rounded-2xl animate-fade-in">
                  <AlertCircle size={18} className="text-red-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm font-semibold text-red-600 dark:text-red-400 leading-relaxed">{gpsError}</p>
                </div>
              )}

              {/* GPS button */}
              {(step === 'choose' || step === 'detecting') && (
                <button
                  onClick={detectGPS}
                  disabled={step === 'detecting'}
                  className="w-full flex items-center gap-5 p-6 rounded-3xl border-2 border-navy-100 dark:border-navy-900/50 shadow-2xl shadow-navy bg-navy-50/30 dark:bg-navy-950/10
                             hover:bg-navy-50 dark:hover:bg-navy-950/20 hover:border-navy-400 dark:hover:border-navy-700 transition-all group
                             disabled:opacity-60 disabled:cursor-not-allowed relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-navy-500/5 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-1000" />
                  <div className="w-14 h-14 bg-navy-900 dark:bg-navy-950 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-2xl shadow-navy active:scale-95 transition-all group-hover:rotate-3 relative z-10 border border-navy-800">
                    {step === 'detecting'
                      ? <Loader2 size={24} className="text-white animate-spin" />
                      : <Navigation size={24} className="text-white" strokeWidth={2.5} />
                    }
                  </div>
                  <div className="text-left flex-1 relative z-10">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-navy-600 dark:text-navy-400 mb-1">Local Network Search</p>
                    <p className="font-display font-black text-slate-900 dark:text-white text-lg uppercase tracking-tight">
                      {step === 'detecting' ? 'Analyzing coordinates...' : 'Current Location Access'}
                    </p>
                  </div>
                  {step !== 'detecting' && <ChevronRight size={20} className="text-navy-300 group-hover:text-navy-600 group-hover:translate-x-1 transition-all" strokeWidth={3} />}
                </button>
              )}

              {(step === 'choose' || step === 'detecting') && (
                <div className="flex items-center gap-4">
                  <div className="flex-1 h-px bg-slate-100 dark:bg-white/5" />
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">or search manually</span>
                  <div className="flex-1 h-px bg-slate-100 dark:bg-white/5" />
                </div>
              )}

              {/* Manual search */}
              <div className="animate-fade-in">
                <div className="relative mb-4 group/search">
                  <Search size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within/search:text-navy-500 transition-colors" strokeWidth={2.5} />
                  <input
                    ref={searchRef}
                    type="text"
                    value={searchQuery}
                    onChange={e => { setSearchQuery(e.target.value); if (step !== 'manual') setStep('manual'); }}
                    onKeyDown={e => e.key === 'Enter' && selectCity(searchQuery)}
                    placeholder="Enter sector or municipal district..."
                    className="w-full pl-14 pr-6 py-5 rounded-3xl border border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-slate-900 text-xs font-black uppercase tracking-widest focus:bg-white dark:focus:bg-slate-900 focus:ring-4 focus:ring-navy-500/5 focus:border-navy-500/20 outline-none transition-all"
                  />
                  {searchQuery && (
                    <button onClick={() => { setSearchQuery(''); setStep('choose'); }} className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
                      <X size={14} className="text-slate-400" />
                    </button>
                  )}
                </div>

                {/* City suggestions when searching */}
                {step === 'manual' && (
                  <div className="card-base overflow-hidden animate-slide-up shadow-xl shadow-slate-200 dark:shadow-none border-slate-200 dark:border-white/10">
                    {filteredSearch.map(city => (
                      <button
                        key={city}
                        onClick={() => selectCity(city)}
                        className="w-full flex items-center gap-4 px-5 py-4 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors border-b border-slate-50 dark:border-white/5 last:border-0 group"
                      >
                        <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-900 flex items-center justify-center flex-shrink-0 group-hover:bg-white dark:group-hover:bg-slate-800 transition-colors">
                          <MapPin size={16} className="text-slate-400 dark:text-slate-500 group-hover:text-navy-600" />
                        </div>
                        <span className="text-sm font-bold text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">{city}</span>
                        <ChevronRight size={14} className="ml-auto text-slate-300 group-hover:text-navy-400 transition-colors" />
                      </button>
                    ))}
                    {searchQuery.length > 2 && (
                      <button
                        onClick={() => selectCity(searchQuery)}
                        className="w-full flex items-center gap-4 px-5 py-4 bg-navy-50/30 dark:bg-navy-950/10 hover:bg-navy-50 dark:hover:bg-navy-950/20 transition-colors text-navy-700 dark:text-navy-400"
                      >
                        <div className="w-8 h-8 rounded-lg bg-navy-200/50 dark:bg-navy-900/50 flex items-center justify-center flex-shrink-0">
                          <Search size={16} />
                        </div>
                        <span className="text-sm font-bold">Search results for "{searchQuery}"</span>
                        {loading && <Loader2 size={16} className="ml-auto animate-spin" />}
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Popular cities */}
              {step === 'choose' && (
                <div className="animate-fade-in">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 mb-6 px-1">Major Hubs</p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {popularCities.map(city => (
                      <button
                        key={city}
                        onClick={() => selectCity(city)}
                        className="px-4 py-3 rounded-2xl border border-slate-100 dark:border-white/5 text-[9px] text-slate-500 dark:text-slate-400 font-black uppercase tracking-[0.2em]
                                   hover:border-navy-300 dark:hover:border-navy-800 hover:text-navy-700 dark:hover:text-navy-400 hover:bg-navy-50 dark:hover:bg-navy-950/20 transition-all shadow-sm active:scale-95"
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
            <div className="flex flex-col h-full bg-slate-50/30 dark:bg-slate-950/20">
               {location?.lat && (
                  <div className="h-56 w-full flex-shrink-0 border-b border-slate-200 dark:border-white/10 shadow-inner relative isolate">
                    <MapView
                      center={[location.lat, location.lng]}
                      places={filteredPlaces}
                    />
                    <div className="absolute top-4 left-4 p-2 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-xl shadow-lg border border-slate-200 dark:border-white/10 flex items-center gap-2 z-[45]">
                      <div className="w-2 h-2 rounded-full bg-navy-500 animate-pulse" />
                      <span className="text-[10px] font-bold text-slate-800 dark:text-slate-200 uppercase tracking-widest">{location.display}</span>
                    </div>
                  </div>
                )}
              
              {/* Error/Feedback Message */}
              {error && (
                <div className="m-4 p-4 bg-amber-50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/30 rounded-2xl flex items-start gap-3 shadow-sm animate-fade-in">
                  <AlertCircle size={18} className="text-amber-500 mt-0.5 flex-shrink-0" />
                  <p className="text-sm font-semibold text-amber-800 dark:text-amber-300 leading-relaxed">{error}</p>
                </div>
              )}

              {loading && (
                <div className="absolute inset-0 z-[55] flex flex-col items-center justify-center bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm transition-all duration-300">
                  <div className="w-12 h-12 bg-navy-700 rounded-2xl flex items-center justify-center shadow-lg shadow-navy mb-4 animate-bounce">
                    <Loader2 className="animate-spin text-white" size={24} />
                  </div>
                  <p className="text-base font-bold text-slate-900 dark:text-white">Scanning area...</p>
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1 uppercase tracking-widest">Finding legal resources</p>
                </div>
              )}

              {/* Search & Filter Bar */}
              <div className="sticky top-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-100 dark:border-white/5 z-10 shadow-sm px-6 py-4 space-y-4">
                <div className="relative group">
                  <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-navy-500 transition-colors" />
                  <input 
                    type="text"
                    value={placeSearchQuery}
                    onChange={e => setPlaceSearchQuery(e.target.value)}
                    placeholder="Search by name or keyword..."
                    className="w-full pl-11 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-2xl text-sm font-medium focus:ring-4 focus:ring-navy-500/10 focus:border-navy-500 outline-none transition-all dark:text-white"
                  />
                </div>
                <div className="flex gap-2 pb-1 overflow-x-auto scrollbar-none">
                  {filterTabs.map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setFilter(tab.id)}
                      className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all whitespace-nowrap border
                        ${filter === tab.id 
                          ? 'bg-navy-700 border-navy-700 text-white shadow-lg shadow-navy' 
                          : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400 hover:border-navy-400 dark:hover:border-navy-800 hover:text-navy-700 dark:hover:text-navy-400'}`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Places list */}
              <div className="divide-y divide-slate-100 dark:divide-white/5 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-white/5">
                {filteredPlaces.length === 0 && !loading ? (
                  <div className="p-16 text-center animate-fade-in">
                    <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-200 dark:border-white/10">
                      <Search size={28} className="text-slate-300 dark:text-slate-700" />
                    </div>
                    <h4 className="font-bold text-slate-900 dark:text-white mb-1">No matches found</h4>
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">Try searching for something else</p>
                  </div>
                ) : (
                  filteredPlaces.map(place => {
                    const cfg = typeConfig[place.type] || typeConfig.court;
                    const Icon = cfg.icon;
                    return (
                      <div
                        key={place.id}
                        onClick={() => setSelectedPlace(place)}
                        className="px-6 py-5 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all cursor-pointer group border-l-4 border-transparent hover:border-navy-500"
                      >
                        <div className="flex items-start gap-4">
                          <div className={`w-12 h-12 rounded-2xl ${cfg.bg} flex items-center justify-center flex-shrink-0 mt-0.5 border dark:border-transparent transition-transform group-hover:scale-105 active:scale-95`}>
                            <Icon size={20} className={cfg.color} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap mb-1.5">
                              <p className="font-bold text-slate-900 dark:text-white text-[15px] leading-tight group-hover:text-navy-700 dark:group-hover:text-navy-400 transition-colors uppercase tracking-tight">{place.name}</p>
                              <span className={`badge ${cfg.badge} scale-90 origin-left`}>{cfg.label}</span>
                            </div>
                            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 truncate leading-relaxed">{place.address}</p>
                            <div className="flex items-center gap-4 mt-3">
                              <span className="text-[11px] text-navy-700 dark:text-navy-400 font-bold flex items-center gap-1.5 bg-navy-50 dark:bg-navy-950/30 px-2 py-0.5 rounded-lg border border-navy-100 dark:border-navy-900/30">
                                <Navigation size={11} strokeWidth={2.5} /> {place.distance}
                              </span>
                              <span className="text-[11px] text-amber-600 dark:text-amber-400 font-bold flex items-center gap-1.5 bg-amber-50 dark:bg-amber-950/30 px-2 py-0.5 rounded-lg border border-amber-100 dark:border-amber-900/30">
                                <Star size={11} className="fill-amber-400 text-amber-400 dark:fill-amber-500 dark:text-amber-500" strokeWidth={2.5} /> {place.rating}
                              </span>
                              <span className="text-[11px] text-slate-500 dark:text-slate-500 font-bold flex items-center gap-1.5 uppercase tracking-wide">
                                <Clock size={11} strokeWidth={2.5} /> {place.hours}
                              </span>
                            </div>
                          </div>
                          <div className="w-8 h-8 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center ml-2 border border-slate-100 dark:border-white/5 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0">
                            <ChevronRight size={16} className="text-navy-500" />
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Map CTA */}
              <div className="p-6 bg-slate-50/50 dark:bg-slate-900/50">
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${location.lat},${location.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl border-2 border-dashed border-slate-200 dark:border-white/10 text-sm font-bold text-slate-500 dark:text-slate-400 hover:border-navy-400 dark:hover:border-navy-800 hover:text-navy-700 dark:hover:text-navy-400 hover:bg-white dark:hover:bg-slate-800 transition-all uppercase tracking-widest shadow-sm"
                >
                  <ExternalLink size={16} /> full Area Map
                </a>
              </div>
            </div>
          )}

          {/* ── STEP: PLACE DETAIL ── */}
          {step === 'results' && selectedPlace && (() => {
            const cfg = typeConfig[selectedPlace.type] || typeConfig.court;
            const Icon = cfg.icon;
            return (
              <div className="animate-fade-in h-full flex flex-col bg-white dark:bg-slate-900">
                {/* Back */}
                <div className="p-4 bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-white/5">
                  <button
                    onClick={() => setSelectedPlace(null)}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800 hover:text-navy-700 dark:hover:text-navy-400 transition-all border border-transparent hover:border-slate-200 dark:hover:border-white/10"
                  >
                    <ChevronRight size={14} className="rotate-180" strokeWidth={2.5} /> Back to Results
                  </button>
                </div>

                <div className="p-6 space-y-8 flex-1">
                  {/* Place header */}
                  <div className="flex items-start gap-5">
                    <div className={`w-16 h-16 rounded-2xl ${cfg.bg} flex items-center justify-center flex-shrink-0 shadow-lg border dark:border-transparent transition-transform hover:rotate-3`}>
                      <Icon size={32} className={cfg.color} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-3 flex-wrap mb-2">
                        <h3 className="font-bold text-2xl text-slate-900 dark:text-white leading-tight uppercase tracking-tight">{selectedPlace.name}</h3>
                        {selectedPlace.open
                          ? <span className="badge badge-green shadow-sm">Open Now</span>
                          : <span className="badge badge-red shadow-sm">Closed</span>
                        }
                      </div>
                      <p className="text-sm font-medium text-slate-500 dark:text-slate-400 leading-relaxed bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-white/5">{selectedPlace.address}</p>
                    </div>
                  </div>

                  {/* Info grid */}
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { icon: Navigation, label: 'Distance', value: selectedPlace.distance, color: 'text-navy-600 dark:text-navy-400' },
                      { icon: Star, label: 'Rating', value: `${selectedPlace.rating} / 5.0`, color: 'text-amber-600 dark:text-amber-500' },
                      { icon: Phone, label: 'Contact', value: selectedPlace.phone || 'N/A', color: 'text-slate-600 dark:text-slate-300' },
                      { icon: Clock, label: 'Schedule', value: selectedPlace.hours || 'N/A', color: 'text-slate-600 dark:text-slate-300' },
                    ].map(({ icon: I, label, value, color }) => (
                      <div key={label} className="p-5 bg-slate-50/50 dark:bg-slate-800/30 rounded-2xl border border-slate-100 dark:border-white/5 shadow-sm group hover:border-navy-200 dark:hover:border-navy-900 transition-all">
                        <div className="flex items-center gap-2 mb-3">
                          <I size={15} className="text-slate-400" />
                          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{label}</span>
                        </div>
                        <p className={`text-sm font-bold leading-tight truncate ${color}`}>{value}</p>
                      </div>
                    ))}
                  </div>

                  <div className="h-48 rounded-3xl overflow-hidden border border-slate-200 dark:border-white/10 shadow-xl relative isolate group">
                    <MapView
                      center={[selectedPlace.lat, selectedPlace.lng]}
                      places={[selectedPlace]}
                      zoom={15}
                    />
                    <div className="absolute inset-0 bg-navy-900/5 group-hover:bg-transparent transition-colors pointer-events-none" />
                  </div>

                  {/* Actions */}
                  <div className="grid grid-cols-2 gap-4 pt-4">
                    <a
                      href={`tel:${selectedPlace.phone}`}
                      className="flex items-center justify-center gap-3 py-4 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-sm font-bold text-slate-700 dark:text-white transition-all uppercase tracking-widest active:scale-95 border border-transparent dark:border-white/5"
                    >
                      <Phone size={18} /> Call
                    </a>
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${selectedPlace.lat},${selectedPlace.lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-3 py-4 rounded-2xl bg-navy-700 hover:bg-navy-800 text-sm font-bold text-white transition-all uppercase tracking-widest shadow-lg shadow-navy active:scale-95 group"
                    >
                      <Navigation size={18} className="group-hover:rotate-12 transition-transform" /> Navigate
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
