'use client';

import { DISTRICT_COORDINATES, getNavigationUrl } from '@/lib/geo';
import { useTranslation } from '@/lib/i18n';
import {
  Building2,
  Filter,
  Info,
  LocateFixed,
  MapPin,
  Navigation,
  PhoneCall,
  Search,
  Stethoscope,
} from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';

// Leaflet dynamic styling injection
const LEAFLET_CSS_URL = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';

interface FacilityItem {
  id: string;
  name: string;
  nameHi?: string | null;
  type: string;
  district: string;
  block?: string | null;
  address: string;
  phone: string;
  lat: number;
  lng: number;
  openingHours: string;
  servicesList: string[];
  distanceKm?: number | null;
  isSampleData: boolean;
}

export function FacilitiesMap({ initialLevel }: { initialLevel?: string }) {
  const { t, language } = useTranslation();

  const [facilities, setFacilities] = useState<FacilityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDistrict, setSelectedDistrict] = useState<string>('Sitapur');
  const [selectedType, setSelectedType] = useState<string>('ALL');
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationStatus, setLocationStatus] = useState<string>('');

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersGroupRef = useRef<any>(null);

  // Load Leaflet CSS
  useEffect(() => {
    if (!document.querySelector(`link[href="${LEAFLET_CSS_URL}"]`)) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = LEAFLET_CSS_URL;
      document.head.appendChild(link);
    }
  }, []);

  // Fetch facilities
  const fetchFacilities = async (lat?: number, lng?: number, dist?: string, typ?: string) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (dist && dist !== 'ALL') params.set('district', dist);
      if (typ && typ !== 'ALL') params.set('type', typ);
      if (lat !== undefined && lng !== undefined) {
        params.set('lat', lat.toString());
        params.set('lng', lng.toString());
      }

      const res = await fetch(`/api/facilities?${params.toString()}`);
      const data = await res.json();
      if (data.facilities) {
        setFacilities(data.facilities);
      }
    } catch (e) {
      console.error('Failed to load facilities:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const coords = DISTRICT_COORDINATES[selectedDistrict] || DISTRICT_COORDINATES.Sitapur;
    fetchFacilities(
      userLocation ? userLocation.lat : coords.lat,
      userLocation ? userLocation.lng : coords.lng,
      selectedDistrict,
      selectedType
    );
  }, [selectedDistrict, selectedType, userLocation]);

  // Handle Geolocation
  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setLocationStatus('ब्राउज़र में GPS उपलब्ध नहीं है');
      return;
    }

    setLocationStatus('स्थान खोजा जा रहा है...');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setUserLocation(coords);
        setLocationStatus('GPS स्थान प्राप्त हुआ');
        fetchFacilities(coords.lat, coords.lng, selectedDistrict, selectedType);
      },
      (err) => {
        console.warn('Geolocation error:', err);
        setLocationStatus('GPS अनुमति नहीं मिली, डिफ़ॉल्ट जिला उपयोग कर रहे हैं');
        // Fallback to district center
        const defaultCoords = DISTRICT_COORDINATES[selectedDistrict] || DISTRICT_COORDINATES.Sitapur;
        setUserLocation(defaultCoords);
      },
      { timeout: 8000 }
    );
  };

  // Initialize and update Leaflet Map
  useEffect(() => {
    if (typeof window === 'undefined' || !mapContainerRef.current) return;

    let L: any;
    import('leaflet').then((leafletModule) => {
      L = leafletModule.default || leafletModule;

      const centerCoords = userLocation ||
        DISTRICT_COORDINATES[selectedDistrict] ||
        DISTRICT_COORDINATES.Sitapur;

      if (!mapInstanceRef.current) {
        const map = L.map(mapContainerRef.current).setView([centerCoords.lat, centerCoords.lng], 11);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; OpenStreetMap contributors',
          maxZoom: 18,
        }).addTo(map);

        markersGroupRef.current = L.layerGroup().addTo(map);
        mapInstanceRef.current = map;
      } else {
        mapInstanceRef.current.setView([centerCoords.lat, centerCoords.lng], 11);
      }

      // Clear existing markers
      if (markersGroupRef.current) {
        markersGroupRef.current.clearLayers();

        // User location marker
        if (userLocation) {
          const userIcon = L.divIcon({
            className: 'custom-user-marker',
            html: `<div style="background-color: #0f766e; width: 18px; height: 18px; border-radius: 50%; border: 3px solid #ffffff; box-shadow: 0 0 10px rgba(0,0,0,0.5);"></div>`,
            iconSize: [18, 18],
          });
          L.marker([userLocation.lat, userLocation.lng], { icon: userIcon })
            .bindPopup('<b>आपका वर्तमान स्थान (Your Location)</b>')
            .addTo(markersGroupRef.current);
        }

        // Add facility markers
        facilities.forEach((fac) => {
          const isHospital = fac.type === 'DISTRICT_HOSPITAL';
          const isChc = fac.type === 'CHC';
          const isTele = fac.type === 'TELECONSULT_PARTNER';

          const markerColor = isHospital ? '#dc2626' : isChc ? '#2563eb' : isTele ? '#16a34a' : '#0d9488';

          const facIcon = L.divIcon({
            className: 'custom-fac-marker',
            html: `<div style="background-color: ${markerColor}; color: white; padding: 4px 7px; border-radius: 8px; font-weight: bold; font-size: 11px; box-shadow: 0 2px 6px rgba(0,0,0,0.3); border: 2px solid white; white-space: nowrap;">${fac.type}</div>`,
            iconSize: [40, 24],
          });

          const popupContent = `
            <div style="font-family: inherit; font-size: 14px; min-width: 200px;">
              <h4 style="margin: 0 0 4px 0; font-weight: bold; color: #0f172a;">${fac.nameHi || fac.name}</h4>
              <p style="margin: 0 0 6px 0; font-size: 12px; color: #64748b;">${fac.address}</p>
              <div style="margin-bottom: 6px; font-size: 12px; font-weight: 600; color: #0f766e;">📞 ${fac.phone}</div>
              <div style="font-size: 12px; color: #475569;">⏰ ${fac.openingHours}</div>
              <a href="tel:${fac.phone}" style="display: block; margin-top: 8px; background: #0f766e; color: white; text-align: center; padding: 6px; border-radius: 6px; text-decoration: none; font-weight: bold;">फ़ोन करें</a>
            </div>
          `;

          L.marker([fac.lat, fac.lng], { icon: facIcon })
            .bindPopup(popupContent)
            .addTo(markersGroupRef.current);
        });
      }
    });

    return () => {
      // Cleanup on unmount handled gracefully
    };
  }, [facilities, userLocation, selectedDistrict]);

  return (
    <div className="space-y-6">
      {/* Search & Location Bar */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
            {/* District Filter */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-slate-700 whitespace-nowrap">
                {t('facilities.filterDistrict')}
              </span>
              <select
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                className="px-3.5 py-2.5 rounded-xl border border-slate-300 font-bold text-slate-800 text-sm bg-slate-50 focus:border-teal-700"
              >
                {Object.keys(DISTRICT_COORDINATES).map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            {/* Type Filter */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-slate-700 whitespace-nowrap">
                {t('facilities.filterType')}
              </span>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="px-3.5 py-2.5 rounded-xl border border-slate-300 font-bold text-slate-800 text-sm bg-slate-50 focus:border-teal-700"
              >
                <option value="ALL">सभी प्रकार (All Types)</option>
                <option value="PHC">PHC - प्राथमिक स्वास्थ्य केंद्र</option>
                <option value="CHC">CHC - सामुदायिक स्वास्थ्य केंद्र</option>
                <option value="DISTRICT_HOSPITAL">जिला संयुक्त चिकित्सालय (DH)</option>
                <option value="SUB_CENTRE">आरोग्य मंदिर / उप-केंद्र</option>
                <option value="TELECONSULT_PARTNER">टेलीकंसल्टेशन केंद्र</option>
                <option value="PRIVATE_CLINIC">निजी / चेरिटेबल क्लीनिक</option>
              </select>
            </div>
          </div>

          {/* GPS Locate Button */}
          <div className="flex items-center gap-3 w-full lg:w-auto justify-end">
            <button
              type="button"
              onClick={handleGetLocation}
              className="flex items-center gap-2 bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-300 font-bold px-4 py-2.5 rounded-xl transition-all active:scale-95 text-sm"
            >
              <LocateFixed className="w-4 h-4 text-teal-700 animate-pulse" />
              <span>मेरा GPS स्थान खोजें (Use My GPS)</span>
            </button>
          </div>
        </div>

        {locationStatus && (
          <p className="text-xs font-semibold text-teal-700 mt-2 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-teal-600"></span>
            {locationStatus}
          </p>
        )}
      </div>

      {/* Interactive Leaflet Map Container */}
      <div className="bg-white rounded-3xl overflow-hidden border-2 border-slate-200 shadow-sm relative">
        <div
          ref={mapContainerRef}
          className="w-full h-80 sm:h-96 z-0"
          style={{ minHeight: '340px' }}
        />
        <div className="bg-slate-50/95 backdrop-blur-xs px-4 py-2 text-xs text-slate-600 font-medium border-t border-slate-200 flex flex-wrap items-center justify-between gap-2">
          <span>{t('facilities.sampleNotice')}</span>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-red-600"></span> जिला अस्पताल
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span> CHC
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-teal-600"></span> PHC
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-green-600"></span> टेलीकंसल्ट
            </span>
          </div>
        </div>
      </div>

      {/* Facilities Cards List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-extrabold text-slate-900 text-xl">
            उपलब्ध स्वास्थ्य केंद्र ({facilities.length}):
          </h3>
          {initialLevel && (
            <span className="text-xs font-bold uppercase px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
              ट्रायज स्तर: {initialLevel}
            </span>
          )}
        </div>

        {loading ? (
          <div className="text-center py-12 text-slate-500 font-semibold">
            स्वास्थ्य केंद्र लोड हो रहे हैं...
          </div>
        ) : facilities.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 text-center border border-slate-200 text-slate-600 font-medium">
            इस जिले या श्रेणी में कोई केंद्र नहीं मिला। कृपया फ़िल्टर बदलें।
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {facilities.map((fac) => {
              const navUrl = getNavigationUrl(fac.lat, fac.lng, fac.name);

              const typeBadge = {
                DISTRICT_HOSPITAL: 'bg-red-100 text-red-900 border-red-300',
                CHC: 'bg-blue-100 text-blue-900 border-blue-300',
                PHC: 'bg-teal-100 text-teal-900 border-teal-300',
                SUB_CENTRE: 'bg-slate-100 text-slate-800 border-slate-300',
                TELECONSULT_PARTNER: 'bg-emerald-100 text-emerald-900 border-emerald-300',
                PRIVATE_CLINIC: 'bg-purple-100 text-purple-900 border-purple-300',
              }[fac.type] || 'bg-slate-100 text-slate-800';

              return (
                <div
                  key={fac.id}
                  className="bg-white rounded-2xl p-5 border border-slate-200 hover:border-teal-600 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-md text-xs font-extrabold uppercase border mb-1.5 ${typeBadge}`}
                        >
                          {fac.type.replace('_', ' ')}
                        </span>
                        <h4 className="font-extrabold text-slate-900 text-lg leading-snug">
                          {fac.nameHi || fac.name}
                        </h4>
                        {fac.nameHi && (
                          <p className="text-xs text-slate-500 font-semibold">{fac.name}</p>
                        )}
                      </div>

                      {fac.distanceKm !== null && fac.distanceKm !== undefined && (
                        <div className="shrink-0 bg-teal-50 border border-teal-200 text-teal-900 font-extrabold text-sm px-2.5 py-1 rounded-xl text-center">
                          <div>{fac.distanceKm}</div>
                          <div className="text-[10px] font-bold text-teal-700">किमी (km)</div>
                        </div>
                      )}
                    </div>

                    <p className="text-xs text-slate-600 font-medium flex items-start gap-1.5">
                      <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                      <span>{fac.address}</span>
                    </p>

                    <div className="text-xs text-slate-700 font-semibold flex items-center gap-4 pt-1">
                      <span>⏰ {fac.openingHours}</span>
                      <span>📞 {fac.phone}</span>
                    </div>

                    {fac.servicesList && fac.servicesList.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-2">
                        {fac.servicesList.map((srv, idx) => (
                          <span
                            key={idx}
                            className="text-[11px] font-medium bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md"
                          >
                            {srv.replace(/_/g, ' ')}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Call & Directions Action Links */}
                  <div className="grid grid-cols-2 gap-2 pt-4 mt-2 border-t border-slate-100">
                    <a
                      href={`tel:${fac.phone}`}
                      className="flex items-center justify-center gap-1.5 bg-teal-700 hover:bg-teal-800 text-white font-bold text-sm py-2.5 px-3 rounded-xl shadow-xs transition-transform active:scale-95"
                    >
                      <PhoneCall className="w-4 h-4" />
                      <span>{t('facilities.call')}</span>
                    </a>

                    <a
                      href={navUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-1.5 bg-[#16352D] hover:bg-[#0F2520] text-white font-bold text-sm py-2.5 px-3 rounded-xl shadow-xs transition-transform active:scale-95"
                    >
                      <Navigation className="w-4 h-4" />
                      <span>{t('facilities.directions')}</span>
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
