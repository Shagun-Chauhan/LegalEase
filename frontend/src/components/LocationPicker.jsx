import React, { useState, useRef, useEffect } from 'react';
import {
  MapPin, Navigation, Search, X, ChevronRight,
  Building2, Shield, Scale, Phone, Clock, Star,
  AlertCircle, Loader2, ExternalLink, RefreshCw
} from 'lucide-react';

// Dummy nearby places by city
const nearbyPlacesData = {
  'Mumbai': [
    { id: 1, type: 'court', name: 'Bombay High Court', address: 'Fort, Mumbai – 400032', distance: '2.1 km', phone: '022-22670891', hours: 'Mon–Sat, 10:30 AM – 4:30 PM', rating: 4.2, open: true },
    { id: 2, type: 'court', name: 'City Civil Court', address: 'Dhobi Talao, Mumbai – 400002', distance: '3.4 km', phone: '022-22620735', hours: 'Mon–Sat, 10:00 AM – 5:00 PM', rating: 3.8, open: true },
    { id: 3, type: 'police', name: 'Colaba Police Station', address: 'Colaba, Mumbai – 400005', distance: '1.8 km', phone: '022-22152200', hours: '24/7', rating: 3.5, open: true },
    { id: 4, type: 'legalaid', name: 'Maharashtra Legal Aid', address: 'Fort, Mumbai – 400001', distance: '2.6 km', phone: '022-22693982', hours: 'Mon–Fri, 10 AM – 5 PM', rating: 4.0, open: true },
    { id: 5, type: 'police', name: 'Cyber Crime Cell Mumbai', address: 'Crawford Market, Mumbai', distance: '3.0 km', phone: '022-24938400', hours: 'Mon–Sat, 9 AM – 6 PM', rating: 4.1, open: false },
  ],
  'Bangalore': [
    { id: 1, type: 'court', name: 'Karnataka High Court', address: 'Ambedkar Veedhi, Bengaluru – 560001', distance: '1.9 km', phone: '080-22212550', hours: 'Mon–Sat, 10:30 AM – 4:30 PM', rating: 4.3, open: true },
    { id: 2, type: 'court', name: 'City Civil Court Bangalore', address: 'Mayo Hall, Bengaluru – 560025', distance: '2.7 km', phone: '080-25320600', hours: 'Mon–Sat, 10:00 AM – 5:00 PM', rating: 3.9, open: true },
    { id: 3, type: 'police', name: 'Cubbon Park Police Station', address: 'Cubbon Park, Bengaluru', distance: '1.2 km', phone: '080-22942222', hours: '24/7', rating: 3.7, open: true },
    { id: 4, type: 'legalaid', name: 'Karnataka State Legal Aid', address: 'Palace Road, Bengaluru – 560001', distance: '2.3 km', phone: '080-22253913', hours: 'Mon–Fri, 9:30 AM – 5:30 PM', rating: 4.1, open: true },
    { id: 5, type: 'police', name: 'Cyber Crime Police Station', address: 'CID Office, Carlton House, Bengaluru', distance: '3.5 km', phone: '080-22094498', hours: 'Mon–Sat, 9 AM – 6 PM', rating: 4.2, open: true },
  ],
  'Delhi': [
    { id: 1, type: 'court', name: 'Delhi High Court', address: 'Sher Shah Road, New Delhi – 110003', distance: '2.4 km', phone: '011-23382820', hours: 'Mon–Sat, 10:30 AM – 4:30 PM', rating: 4.4, open: true },
    { id: 2, type: 'court', name: 'Saket District Court', address: 'Saket, New Delhi – 110017', distance: '4.1 km', phone: '011-29563700', hours: 'Mon–Sat, 10:00 AM – 5:00 PM', rating: 4.0, open: false },
    { id: 3, type: 'police', name: 'Connaught Place Police', address: 'Connaught Place, New Delhi', distance: '1.6 km', phone: '011-23414000', hours: '24/7', rating: 3.6, open: true },
    { id: 4, type: 'legalaid', name: 'Delhi Legal Services Auth.', address: 'Patiala House Courts, New Delhi', distance: '2.0 km', phone: '011-23384897', hours: 'Mon–Fri, 9 AM – 5 PM', rating: 4.2, open: true },
    { id: 5, type: 'police', name: 'Cyber Crime Cell Delhi', address: 'ITO, New Delhi – 110002', distance: '2.8 km', phone: '011-23490097', hours: 'Mon–Sat, 9 AM – 6 PM', rating: 4.0, open: true },
  ],
  'default': [
    { id: 1, type: 'court', name: 'District & Sessions Court', address: 'Court Road, City Centre', distance: '2.5 km', phone: 'N/A', hours: 'Mon–Sat, 10:00 AM – 5:00 PM', rating: 3.8, open: true },
    { id: 2, type: 'police', name: 'City Police Station', address: 'Main Road, City Centre', distance: '1.5 km', phone: '100', hours: '24/7', rating: 3.5, open: true },
    { id: 3, type: 'legalaid', name: 'District Legal Aid Centre', address: 'Court Complex, City Centre', distance: '2.6 km', phone: 'N/A', hours: 'Mon–Fri, 10 AM – 5 PM', rating: 3.9, open: true },
  ],
};

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

export default function LocationPicker({ onClose }) {
  const [step, setStep] = useState('choose'); // 'choose' | 'detecting' | 'manual' | 'results'
  const [location, setLocation] = useState(null); // { city, lat, lng, display }
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [gpsError, setGpsError] = useState('');
  const [selectedPlace, setSelectedPlace] = useState(null);
  const searchRef = useRef(null);

  useEffect(() => {
    if (step === 'manual' && searchRef.current) searchRef.current.focus();
  }, [step]);

  const detectGPS = () => {
    setStep('detecting');
    setGpsError('');
    if (!navigator.geolocation) {
      setGpsError('Geolocation is not supported by your browser.');
      setStep('choose');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        // Simulate reverse geocoding to a city
        const simulatedCity = 'Mumbai';
        setLocation({
          city: simulatedCity,
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          display: `${simulatedCity} (GPS detected)`,
        });
        setStep('results');
      },
      (err) => {
        setGpsError(err.code === 1 ? 'Location access denied. Please allow location or enter manually.' : 'Unable to detect location. Try again.');
        setStep('choose');
      },
      { timeout: 8000 }
    );
  };

  const selectCity = (city) => {
    setLocation({ city, display: city });
    setSearchQuery('');
    setStep('results');
  };

  const filteredSearch = popularCities.filter(c =>
    c.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const places = (nearbyPlacesData[location?.city] || nearbyPlacesData['default']).filter(p =>
    filter === 'all' || p.type === filter
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
          {(step === 'choose' || step === 'detecting') && (
            <div className="p-5 space-y-4">
              {gpsError && (
                <div className="flex items-start gap-2.5 p-3.5 bg-red-50 border border-red-100 rounded-xl">
                  <AlertCircle size={15} className="text-red-500 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-red-600 leading-relaxed">{gpsError}</p>
                </div>
              )}

              {/* GPS button */}
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

              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-slate-200" />
                <span className="text-xs text-slate-400 font-medium">or</span>
                <div className="flex-1 h-px bg-slate-200" />
              </div>

              {/* Manual search */}
              <div>
                <div className="relative mb-3">
                  <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    ref={searchRef}
                    type="text"
                    value={searchQuery}
                    onChange={e => { setSearchQuery(e.target.value); setStep('manual'); }}
                    onFocus={() => setStep('manual')}
                    placeholder="Search your city (e.g. Pune, Chennai)"
                    className="input-field pl-10"
                  />
                  {searchQuery && (
                    <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2">
                      <X size={13} className="text-slate-400" />
                    </button>
                  )}
                </div>

                {/* City suggestions when searching */}
                {step === 'manual' && (
                  <div className="card-base overflow-hidden">
                    {filteredSearch.length === 0 ? (
                      <div className="p-4 text-center text-sm text-slate-400">No city found for "{searchQuery}"</div>
                    ) : (
                      filteredSearch.map(city => (
                        <button
                          key={city}
                          onClick={() => selectCity(city)}
                          className="w-full flex items-center gap-3 px-4 py-3 hover:bg-navy-50 transition-colors border-b border-slate-50 last:border-0"
                        >
                          <MapPin size={14} className="text-navy-500 flex-shrink-0" />
                          <span className="text-sm font-medium text-slate-700">{city}</span>
                          <ChevronRight size={13} className="ml-auto text-slate-300" />
                        </button>
                      ))
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
            <div>
              {/* Filter tabs */}
              <div className="flex gap-1 px-5 py-3 border-b border-slate-100 overflow-x-auto">
                {filterTabs.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setFilter(tab.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all
                      ${filter === tab.id ? 'bg-navy-700 text-white' : 'text-slate-500 hover:bg-slate-100'}`}
                  >
                    {tab.label}
                  </button>
                ))}
                <div className="ml-auto flex items-center gap-1 text-xs text-slate-400 whitespace-nowrap pl-2">
                  <MapPin size={11} /> {places.length} found
                </div>
              </div>

              {/* Places list */}
              <div className="divide-y divide-slate-50">
                {places.map(place => {
                  const cfg = typeConfig[place.type];
                  const Icon = cfg.icon;
                  return (
                    <div
                      key={place.id}
                      onClick={() => setSelectedPlace(place)}
                      className="px-5 py-4 hover:bg-slate-50 transition-colors cursor-pointer group"
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-9 h-9 rounded-xl ${cfg.bg} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                          <Icon size={16} className={cfg.color} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-0.5">
                            <p className="font-semibold text-slate-900 text-sm">{place.name}</p>
                            <span className={`badge ${cfg.badge} text-[10px]`}>{cfg.label}</span>
                            {place.open
                              ? <span className="badge badge-green text-[10px]">Open</span>
                              : <span className="badge badge-red text-[10px]">Closed</span>
                            }
                          </div>
                          <p className="text-xs text-slate-500 truncate">{place.address}</p>
                          <div className="flex items-center gap-3 mt-1.5">
                            <span className="text-xs text-navy-600 font-semibold flex items-center gap-1">
                              <Navigation size={10} /> {place.distance}
                            </span>
                            <span className="text-xs text-amber-600 font-semibold flex items-center gap-1">
                              <Star size={10} className="fill-amber-400 text-amber-400" /> {place.rating}
                            </span>
                            <span className="text-xs text-slate-400 flex items-center gap-1">
                              <Clock size={10} /> {place.hours}
                            </span>
                          </div>
                        </div>
                        <ChevronRight size={15} className="text-slate-300 group-hover:text-navy-500 flex-shrink-0 mt-1 transition-colors" />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Map CTA */}
              <div className="p-5 border-t border-slate-100">
                <button className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-dashed border-slate-300 text-sm text-slate-500 hover:border-navy-400 hover:text-navy-600 hover:bg-navy-50 transition-all">
                  <ExternalLink size={14} /> Open in Google Maps
                </button>
              </div>
            </div>
          )}

          {/* ── STEP: PLACE DETAIL ── */}
          {step === 'results' && selectedPlace && (() => {
            const cfg = typeConfig[selectedPlace.type];
            const Icon = cfg.icon;
            return (
              <div className="animate-fade-in">
                {/* Back */}
                <button
                  onClick={() => setSelectedPlace(null)}
                  className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-navy-700 transition-colors px-5 py-3 border-b border-slate-100 w-full"
                >
                  <ChevronRight size={14} className="rotate-180" /> Back to results
                </button>

                <div className="p-5 space-y-4">
                  {/* Place header */}
                  <div className="flex items-start gap-3">
                    <div className={`w-12 h-12 rounded-xl ${cfg.bg} flex items-center justify-center flex-shrink-0`}>
                      <Icon size={22} className={cfg.color} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap mb-0.5">
                        <h3 className="font-display font-semibold text-slate-900">{selectedPlace.name}</h3>
                        {selectedPlace.open
                          ? <span className="badge badge-green">Open Now</span>
                          : <span className="badge badge-red">Closed</span>
                        }
                      </div>
                      <p className="text-sm text-slate-500">{selectedPlace.address}</p>
                    </div>
                  </div>

                  {/* Info grid */}
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { icon: Navigation, label: 'Distance', value: selectedPlace.distance },
                      { icon: Star, label: 'Rating', value: `${selectedPlace.rating} / 5.0` },
                      { icon: Phone, label: 'Phone', value: selectedPlace.phone },
                      { icon: Clock, label: 'Hours', value: selectedPlace.hours },
                    ].map(({ icon: I, label, value }) => (
                      <div key={label} className="p-3 bg-slate-50 rounded-xl">
                        <div className="flex items-center gap-1.5 mb-1">
                          <I size={12} className="text-slate-400" />
                          <span className="text-[10px] font-bold uppercase tracking-wide text-slate-400">{label}</span>
                        </div>
                        <p className="text-sm font-semibold text-slate-800 leading-tight">{value}</p>
                      </div>
                    ))}
                  </div>

                  {/* Map placeholder */}
                  <div className="rounded-xl overflow-hidden border border-slate-200 bg-slate-100 h-36 flex items-center justify-center relative">
                    <div className="absolute inset-0 opacity-30"
                      style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%2394a3b8' fill-opacity='0.4' fill-rule='evenodd'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E")`,
                      }}
                    />
                    <div className="relative text-center">
                      <MapPin size={28} className="text-navy-600 mx-auto mb-1 animate-pulse-soft" />
                      <p className="text-xs text-slate-500 font-medium">{selectedPlace.distance} away</p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="grid grid-cols-2 gap-2">
                    <a
                      href={`tel:${selectedPlace.phone}`}
                      className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-sm font-semibold text-slate-700 transition-colors"
                    >
                      <Phone size={14} /> Call
                    </a>
                    <button className="flex items-center justify-center gap-2 py-2.5 rounded-xl btn-primary text-sm">
                      <ExternalLink size={14} /> Directions
                    </button>
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
