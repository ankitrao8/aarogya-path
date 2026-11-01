'use client';

import { DISTRICT_COORDINATES, getNavigationUrl } from '@/lib/geo';
import { useTranslation } from '@/lib/i18n';
import {
  Compass,
  Crosshair,
  Filter,
  Hospital,
  Layers,
  LocateFixed,
  MapPin,
  Navigation,
  PhoneCall,
  Search,
  Sparkles,
  Stethoscope,
  Video,
} from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';

const LEAFLET_CSS_URL = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';

export interface FacilityItem {
  id: string;
  name: string;
  nameHi?: string | null;
  type: 'DISTRICT_HOSPITAL' | 'CHC' | 'PHC' | 'SUB_CENTRE' | 'TELECONSULT_PARTNER' | 'PRIVATE_CLINIC';
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

// Generate distinct SVG teardrop pin with medical emblem
function createSvgPinHtml(type: FacilityItem['type'], name: string, lang: string = 'hi') {
  let pinColor = '#0D9488';
  let labelBg = '#0D9488';
  let badgeText = 'PHC';
  let iconSvg = '';

  const isEn = lang === 'en';
  const isBho = lang === 'bho';

  switch (type) {
    case 'DISTRICT_HOSPITAL':
      pinColor = '#DC2626'; // Red
      labelBg = '#DC2626';
      badgeText = isEn ? 'HOSPITAL' : isBho ? 'अस्पताल' : 'अस्पताल';
      iconSvg = `<path d="M12 6v12m-6-6h12" stroke="#DC2626" stroke-width="3.5" stroke-linecap="round"/>`;
      break;
    case 'CHC':
      pinColor = '#2563EB'; // Royal Blue
      labelBg = '#2563EB';
      badgeText = 'CHC';
      iconSvg = `<path d="M7 18V9l5-3 5 3v9M10 18v-4h4v4M9 11h.01M15 11h.01" stroke="#2563EB" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`;
      break;
    case 'PHC':
      pinColor = '#0D9B75'; // Emerald Green
      labelBg = '#0D9B75';
      badgeText = 'PHC';
      iconSvg = `<path d="M8 6v5a4 4 0 0 0 8 0V6M6 6h4M14 6h4M12 15v2a3 3 0 0 0 6 0v-1" stroke="#0D9B75" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><circle cx="18" cy="16" r="1.5" fill="#0D9B75"/>`;
      break;
    case 'SUB_CENTRE':
      pinColor = '#D97706'; // Amber / Orange
      labelBg = '#D97706';
      badgeText = isEn ? 'AROGYA' : 'आरोग्य';
      iconSvg = `<path d="M12 4s7 2.5 7 9c0 5-7 8-7 8s-7-3-7-8c0-6.5 7-9 7-9z" fill="none" stroke="#D97706" stroke-width="2"/><path d="M12 9v4m-2-2h4" stroke="#D97706" stroke-width="2" stroke-linecap="round"/>`;
      break;
    case 'TELECONSULT_PARTNER':
      pinColor = '#059669'; // Forest Green
      labelBg = '#059669';
      badgeText = isEn ? 'TELE' : isBho ? 'संजीवनी' : 'संजीवनी';
      iconSvg = `<rect x="5" y="7" width="10" height="10" rx="2" stroke="#059669" stroke-width="2"/><polygon points="15 10 19 8 19 16 15 14" fill="#059669"/>`;
      break;
    case 'PRIVATE_CLINIC':
      pinColor = '#7C3AED'; // Purple
      labelBg = '#7C3AED';
      badgeText = isEn ? 'CLINIC' : 'क्लीनिक';
      iconSvg = `<path d="M6 12h3l2-4 2 8 2-4h3" stroke="#7C3AED" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`;
      break;
  }

  return `
    <div class="group relative flex flex-col items-center" style="transform: translate(-50%, -100%); cursor: pointer; pointer-events: auto;">
      <!-- Modern Teardrop Pin -->
      <svg width="38" height="46" viewBox="0 0 38 46" fill="none" xmlns="http://www.w3.org/2000/svg" style="filter: drop-shadow(0 4px 6px rgba(0,0,0,0.35)); transition: transform 0.15s ease-out;">
        <path d="M19 0C8.50659 0 0 8.50659 0 19C0 31.5 19 46 19 46C19 46 38 31.5 38 19C38 8.50659 29.4934 0 19 0Z" fill="${pinColor}"/>
        <circle cx="19" cy="18" r="13" fill="#FFFFFF"/>
        <g transform="translate(7, 6)">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            ${iconSvg}
          </svg>
        </g>
      </svg>
      <div style="background-color: ${labelBg}; color: white; padding: 1px 6px; border-radius: 9999px; font-weight: 800; font-size: 9px; box-shadow: 0 2px 4px rgba(0,0,0,0.25); white-space: nowrap; margin-top: -3px; letter-spacing: 0.3px; border: 1.5px solid white;">
        ${badgeText}
      </div>
    </div>
  `;
}

// User GPS radar ripple pin HTML
function createUserRadarPinHtml() {
  return `
    <div style="position: relative; width: 44px; height: 44px; transform: translate(-50%, -50%); display: flex; align-items: center; justify-content: center; pointer-events: auto;">
      <div style="position: absolute; width: 40px; height: 40px; border-radius: 50%; background: rgba(13, 148, 136, 0.35); animation: leaflet-radar-pulse 2s cubic-bezier(0, 0.2, 0.8, 1) infinite;"></div>
      <div style="position: absolute; width: 24px; height: 24px; border-radius: 50%; background: rgba(20, 184, 166, 0.6);"></div>
      <div style="position: relative; width: 14px; height: 14px; border-radius: 50%; background: #0F766E; border: 2.5px solid #FFFFFF; box-shadow: 0 0 8px rgba(0,0,0,0.4);"></div>
    </div>
  `;
}

export function FacilitiesMap({
  initialLevel,
  initialType = 'ALL',
  searchQuery = '',
  onFacilitySelect,
}: {
  initialLevel?: string;
  initialType?: string;
  searchQuery?: string;
  onFacilitySelect?: (facility: FacilityItem) => void;
}) {
  const { t, language } = useTranslation();

  const [facilities, setFacilities] = useState<FacilityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [locating, setLocating] = useState(false);
  const [selectedDistrict, setSelectedDistrict] = useState<string>('GPS_AUTO');
  const [selectedType, setSelectedType] = useState<string>(initialType);
  const [selectedRadius, setSelectedRadius] = useState<number>(25);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationStatus, setLocationStatus] = useState<string>('');
  const [activeFacilityId, setActiveFacilityId] = useState<string | null>(null);

  // Sync initialType prop when changed from parent tabs
  useEffect(() => {
    if (initialType) {
      setSelectedType(initialType);
    }
  }, [initialType]);

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersGroupRef = useRef<any>(null);
  const accuracyCircleRef = useRef<any>(null);
  const markerObjMapRef = useRef<Map<string, any>>(new Map());

  // Load Leaflet CSS and inject custom overrides
  useEffect(() => {
    if (!document.querySelector(`link[href="${LEAFLET_CSS_URL}"]`)) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = LEAFLET_CSS_URL;
      document.head.appendChild(link);
    }

    const customStyleId = 'leaflet-custom-marker-overrides';
    if (!document.getElementById(customStyleId)) {
      const style = document.createElement('style');
      style.id = customStyleId;
      style.innerHTML = `
        @keyframes leaflet-radar-pulse {
          0% { transform: scale(0.6); opacity: 0.9; }
          100% { transform: scale(2.2); opacity: 0; }
        }
        .leaflet-div-icon {
          background: transparent !important;
          border: none !important;
        }
        .leaflet-popup-content-wrapper {
          border-radius: 18px !important;
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.2), 0 8px 10px -6px rgba(0, 0, 0, 0.1) !important;
          padding: 0 !important;
          overflow: hidden !important;
          border: 1px solid #E2E8F0 !important;
        }
        .leaflet-popup-content {
          margin: 0 !important;
          line-height: 1.4 !important;
        }
        .leaflet-popup-close-button {
          top: 10px !important;
          right: 10px !important;
          color: #64748B !important;
          font-size: 18px !important;
        }
      `;
      document.head.appendChild(style);
    }
  }, []);

  // Fetch facilities from API
  const fetchFacilities = async (
    lat?: number,
    lng?: number,
    dist?: string,
    typ?: string,
    radius?: number
  ) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (dist && dist !== 'ALL' && dist !== 'GPS_AUTO') {
        params.set('district', dist);
      }
      if (typ && typ !== 'ALL') {
        params.set('type', typ);
      }
      if (lat !== undefined && lng !== undefined) {
        params.set('lat', lat.toString());
        params.set('lng', lng.toString());
      }
      if (radius && radius > 0) {
        params.set('radius', radius.toString());
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

  // Automatic GPS Geolocation on initial mount
  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationStatus(t('facilities.gpsUnavailable'));
      const fallback = DISTRICT_COORDINATES.Gorakhpur;
      fetchFacilities(fallback.lat, fallback.lng, 'Gorakhpur', selectedType, selectedRadius);
      return;
    }

    setLocating(true);
    setLocationStatus(t('facilities.searchingLocation'));

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setUserLocation(coords);
        setLocating(false);
        setLocationStatus(`${t('facilities.gpsActive')} (${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)})`);
        fetchFacilities(coords.lat, coords.lng, 'GPS_AUTO', selectedType, selectedRadius);
      },
      (err) => {
        console.warn('Geolocation access warning:', err.message);
        setLocating(false);
        setLocationStatus(t('facilities.gpsDenied'));
        const defaultCoords = DISTRICT_COORDINATES.Gorakhpur;
        setUserLocation(null);
        fetchFacilities(defaultCoords.lat, defaultCoords.lng, 'Gorakhpur', selectedType, selectedRadius);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 30000 }
    );
  }, []);

  // Update status message when language changes
  useEffect(() => {
    if (userLocation) {
      setLocationStatus(`${t('facilities.gpsActive')} (${userLocation.lat.toFixed(4)}, ${userLocation.lng.toFixed(4)})`);
    } else if (!locating) {
      setLocationStatus(t('facilities.gpsDenied'));
    }
  }, [language]);

  // Triggered when District, Type, or Radius filter changes
  useEffect(() => {
    if (selectedDistrict === 'GPS_AUTO') {
      if (userLocation) {
        fetchFacilities(userLocation.lat, userLocation.lng, 'GPS_AUTO', selectedType, selectedRadius);
      } else {
        const coords = DISTRICT_COORDINATES.Gorakhpur;
        fetchFacilities(coords.lat, coords.lng, 'Gorakhpur', selectedType, selectedRadius);
      }
    } else {
      const coords = DISTRICT_COORDINATES[selectedDistrict] || DISTRICT_COORDINATES.Gorakhpur;
      fetchFacilities(
        coords.lat,
        coords.lng,
        selectedDistrict,
        selectedType,
        selectedRadius
      );
    }
  }, [selectedDistrict, selectedType, selectedRadius]);

  // Handle Manual GPS Locate button click
  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      alert(t('facilities.gpsUnavailable'));
      return;
    }

    setLocating(true);
    setLocationStatus(t('facilities.searchingLocation'));

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setUserLocation(coords);
        setSelectedDistrict('GPS_AUTO');
        setLocating(false);
        setLocationStatus(`${t('facilities.gpsActive')} (${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)})`);

        if (mapInstanceRef.current) {
          mapInstanceRef.current.flyTo([coords.lat, coords.lng], 13, { duration: 1.5 });
        }

        fetchFacilities(coords.lat, coords.lng, 'GPS_AUTO', selectedType, selectedRadius);
      },
      (err) => {
        setLocating(false);
        console.warn('Geolocation error:', err);
        setLocationStatus(t('facilities.gpsDenied'));
      },
      { enableHighAccuracy: true, timeout: 12000 }
    );
  };

  // Center Map on current view
  const handleRecenterMap = () => {
    if (!mapInstanceRef.current) return;
    if (userLocation) {
      mapInstanceRef.current.flyTo([userLocation.lat, userLocation.lng], 13, { duration: 1.2 });
    } else {
      const coords = DISTRICT_COORDINATES[selectedDistrict] || DISTRICT_COORDINATES.Gorakhpur;
      mapInstanceRef.current.flyTo([coords.lat, coords.lng], 12, { duration: 1.2 });
    }
  };

  // Fly to and open a specific facility marker
  const handleFocusFacility = (fac: FacilityItem) => {
    setActiveFacilityId(fac.id);
    if (onFacilitySelect) onFacilitySelect(fac);

    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([fac.lat, fac.lng], 14, { duration: 1.2 });
      const marker = markerObjMapRef.current.get(fac.id);
      if (marker) {
        setTimeout(() => marker.openPopup(), 400);
      }
    }
  };

  // Filter facilities based on search query
  const filteredFacilities = facilities.filter((fac) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      fac.name.toLowerCase().includes(q) ||
      (fac.nameHi && fac.nameHi.toLowerCase().includes(q)) ||
      fac.address.toLowerCase().includes(q) ||
      fac.district.toLowerCase().includes(q) ||
      fac.type.toLowerCase().includes(q) ||
      fac.servicesList.some((s) => s.toLowerCase().includes(q))
    );
  });

  // Initialize and update Leaflet Map
  useEffect(() => {
    if (typeof window === 'undefined' || !mapContainerRef.current) return;

    let L: any;
    import('leaflet').then((leafletModule) => {
      L = leafletModule.default || leafletModule;

      const centerCoords =
        userLocation ||
        (selectedDistrict !== 'GPS_AUTO' && DISTRICT_COORDINATES[selectedDistrict]) ||
        DISTRICT_COORDINATES.Gorakhpur;

      if (!mapInstanceRef.current) {
        const map = L.map(mapContainerRef.current, {
          zoomControl: true,
          scrollWheelZoom: true,
        }).setView([centerCoords.lat, centerCoords.lng], 12);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; OpenStreetMap contributors',
          maxZoom: 19,
        }).addTo(map);

        markersGroupRef.current = L.layerGroup().addTo(map);
        mapInstanceRef.current = map;
      } else {
        mapInstanceRef.current.setView([centerCoords.lat, centerCoords.lng], mapInstanceRef.current.getZoom());
      }

      // Re-populate markers
      if (markersGroupRef.current) {
        markersGroupRef.current.clearLayers();
        markerObjMapRef.current.clear();

        // 1. User Live GPS Location Radar Marker
        if (userLocation) {
          const userIcon = L.divIcon({
            className: 'custom-leaflet-pin',
            html: createUserRadarPinHtml(),
            iconSize: [44, 44],
            iconAnchor: [22, 22],
            popupAnchor: [0, -22],
          });

          const userPopupTitle = t('facilities.youAreHere');

          const userMarker = L.marker([userLocation.lat, userLocation.lng], {
            icon: userIcon,
            zIndexOffset: 1000,
          }).bindPopup(`
            <div style="padding: 14px 16px; font-family: system-ui, sans-serif; text-align: center;">
              <div style="display: inline-flex; align-items: center; justify-content: center; width: 36px; height: 36px; border-radius: 50%; background: #CCFBF1; color: #0F766E; margin-bottom: 6px;">
                📍
              </div>
              <h4 style="margin: 0 0 2px 0; font-weight: 800; color: #0F172A; font-size: 14px;">${userPopupTitle}</h4>
              <p style="margin: 0; font-size: 12px; color: #64748B; font-weight: 600;">Live GPS</p>
            </div>
          `);

          markersGroupRef.current.addLayer(userMarker);

          if (accuracyCircleRef.current) {
            accuracyCircleRef.current.remove();
          }
          accuracyCircleRef.current = L.circle([userLocation.lat, userLocation.lng], {
            radius: 800,
            color: '#0D9488',
            weight: 1.5,
            fillColor: '#14B8A6',
            fillOpacity: 0.1,
          }).addTo(markersGroupRef.current);
        }

        // 2. Facilities Markers with Crisp SVG Pins
        filteredFacilities.forEach((fac) => {
          const pinHtml = createSvgPinHtml(fac.type, fac.name, language);

          const facIcon = L.divIcon({
            className: 'custom-leaflet-pin',
            html: pinHtml,
            iconSize: [38, 46],
            iconAnchor: [19, 46],
            popupAnchor: [0, -44],
          });

          const navUrl = getNavigationUrl(
            fac.lat,
            fac.lng,
            fac.name,
            userLocation?.lat,
            userLocation?.lng
          );

          // Localized category badge
          const badgeStyles = {
            DISTRICT_HOSPITAL: { bg: '#FEE2E2', color: '#991B1B', border: '#FCA5A5', label: t('facilities.typeHospital') },
            CHC: { bg: '#DBEAFE', color: '#1E40AF', border: '#93C5FD', label: t('facilities.typeChc') },
            PHC: { bg: '#D1FAE5', color: '#065F46', border: '#6EE7B7', label: t('facilities.typePhc') },
            SUB_CENTRE: { bg: '#FEF3C7', color: '#92400E', border: '#FCD34D', label: t('facilities.typeSubCentre') },
            TELECONSULT_PARTNER: { bg: '#DCFCE7', color: '#166534', border: '#86EFAC', label: t('facilities.typeTeleconsult') },
            PRIVATE_CLINIC: { bg: '#F3E8FF', color: '#6B21A8', border: '#D8B4FE', label: t('facilities.typeClinic') },
          }[fac.type] || { bg: '#F1F5F9', color: '#334155', border: '#CBD5E1', label: fac.type };

          const mainTitle = language === 'en' ? fac.name : fac.nameHi || fac.name;
          const secondaryTitle = language === 'en' ? (fac.nameHi && fac.nameHi !== fac.name ? fac.nameHi : '') : (fac.nameHi ? fac.name : '');
          const callText = t('facilities.call');
          const dirText = t('facilities.directions');
          const kmUnit = t('facilities.km');

          const popupContent = `
            <div style="padding: 16px; font-family: system-ui, -apple-system, sans-serif; min-width: 260px; max-width: 320px;">
              <div style="display: flex; align-items: center; justify-content: space-between; gap: 8px; margin-bottom: 8px;">
                <span style="font-size: 11px; font-weight: 800; padding: 3px 8px; border-radius: 6px; background: ${badgeStyles.bg}; color: ${badgeStyles.color}; border: 1px solid ${badgeStyles.border};">
                  ${badgeStyles.label}
                </span>
                ${
                  fac.distanceKm !== null && fac.distanceKm !== undefined
                    ? `<span style="font-size: 11px; font-weight: 800; color: #0F766E; background: #CCFBF1; padding: 2px 7px; border-radius: 9999px;">📍 ${fac.distanceKm} ${kmUnit}</span>`
                    : ''
                }
              </div>

              <h4 style="margin: 0 0 3px 0; font-size: 15px; font-weight: 800; color: #0F172A; line-height: 1.3;">
                ${mainTitle}
              </h4>
              ${
                secondaryTitle
                  ? `<p style="margin: 0 0 8px 0; font-size: 11px; color: #64748B; font-weight: 600;">${secondaryTitle}</p>`
                  : ''
              }

              <div style="font-size: 12px; color: #475569; margin-bottom: 8px; line-height: 1.4; display: flex; align-items: flex-start; gap: 5px;">
                <span style="flex-shrink: 0; margin-top: 1px;">📍</span>
                <span>${fac.address}</span>
              </div>

              <div style="display: flex; align-items: center; justify-content: space-between; font-size: 12px; font-weight: 700; color: #047857; margin-bottom: 12px; padding: 6px 10px; background: #F8FAFC; border-radius: 8px;">
                <span>⏰ ${fac.openingHours}</span>
                <span>📞 ${fac.phone}</span>
              </div>

              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
                <a href="tel:${fac.phone}" style="display: flex; align-items: center; justify-content: center; gap: 6px; background: #0D9488; color: #FFFFFF; padding: 8px 12px; border-radius: 10px; text-decoration: none; font-weight: 800; font-size: 12px; box-shadow: 0 2px 4px rgba(13,148,136,0.3); text-align: center;">
                  📞 ${callText}
                </a>
                <a href="${navUrl}" target="_blank" rel="noopener noreferrer" style="display: flex; align-items: center; justify-content: center; gap: 6px; background: #16352D; color: #FFFFFF; padding: 8px 12px; border-radius: 10px; text-decoration: none; font-weight: 800; font-size: 12px; box-shadow: 0 2px 4px rgba(22,53,45,0.3); text-align: center;">
                  🧭 ${dirText}
                </a>
              </div>
            </div>
          `;

          const marker = L.marker([fac.lat, fac.lng], { icon: facIcon })
            .bindPopup(popupContent)
            .addTo(markersGroupRef.current);

          markerObjMapRef.current.set(fac.id, marker);
        });
      }
    });
  }, [filteredFacilities, userLocation, language]);

  return (
    <div className="space-y-4">
      {/* Search & Location Bar */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200 shadow-xs space-y-3">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          {/* Filters Group */}
          <div className="flex flex-wrap items-center gap-2.5 flex-1">
            {/* District Selector */}
            <div className="flex items-center gap-1.5 flex-1 sm:flex-none">
              <span className="text-xs font-bold text-slate-600 whitespace-nowrap">
                {t('facilities.districtCityLabel')}
              </span>
              <select
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                className="w-full sm:w-auto px-3 py-2 rounded-xl border border-slate-300 font-bold text-slate-800 text-xs bg-slate-50 focus:border-teal-700 focus:outline-hidden"
              >
                <option value="GPS_AUTO">{t('facilities.myLiveGps')}</option>
                <option value="ALL">{t('facilities.allDistricts')}</option>
                {Object.keys(DISTRICT_COORDINATES).map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            {/* Type Selector */}
            <div className="flex items-center gap-1.5 flex-1 sm:flex-none">
              <span className="text-xs font-bold text-slate-600 whitespace-nowrap">
                {t('facilities.facilityTypeLabel')}
              </span>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full sm:w-auto px-3 py-2 rounded-xl border border-slate-300 font-bold text-slate-800 text-xs bg-slate-50 focus:border-teal-700 focus:outline-hidden"
              >
                <option value="ALL">{t('facilities.allTypes')}</option>
                <option value="DISTRICT_HOSPITAL">{t('facilities.typeHospital')}</option>
                <option value="CHC">{t('facilities.typeChc')}</option>
                <option value="PHC">{t('facilities.typePhc')}</option>
                <option value="SUB_CENTRE">{t('facilities.typeSubCentre')}</option>
                <option value="TELECONSULT_PARTNER">{t('facilities.typeTeleconsult')}</option>
                <option value="PRIVATE_CLINIC">{t('facilities.typeClinic')}</option>
              </select>
            </div>

            {/* Radius Selector */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-slate-600 whitespace-nowrap">
                {t('facilities.radiusLabel')}
              </span>
              <select
                value={selectedRadius}
                onChange={(e) => setSelectedRadius(Number(e.target.value))}
                className="px-2.5 py-2 rounded-xl border border-slate-300 font-bold text-slate-800 text-xs bg-slate-50 focus:border-teal-700 focus:outline-hidden"
              >
                <option value={5}>5 {t('facilities.km')}</option>
                <option value={10}>10 {t('facilities.km')}</option>
                <option value={25}>25 {t('facilities.km')}</option>
                <option value={50}>50 {t('facilities.km')}</option>
                <option value={100}>100 {t('facilities.km')}</option>
              </select>
            </div>
          </div>

          {/* GPS Live Locate Button */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleGetLocation}
              disabled={locating}
              className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-black text-xs transition-all active:scale-95 shadow-xs w-full lg:w-auto ${
                locating
                  ? 'bg-teal-100 text-teal-800 border border-teal-300 cursor-wait'
                  : 'bg-[#0D9B75] hover:bg-[#0A8262] text-white shadow-teal-700/25'
              }`}
            >
              <LocateFixed className={`w-4 h-4 ${locating ? 'animate-spin' : ''}`} />
              <span>{locating ? t('facilities.searchingLocation') : t('facilities.useMyGps')}</span>
            </button>
          </div>
        </div>

        {/* Live Status indicator */}
        <div className="flex items-center justify-between text-xs pt-1">
          <p className="font-semibold text-slate-600 flex items-center gap-1.5">
            <span
              className={`w-2 h-2 rounded-full ${
                userLocation ? 'bg-emerald-500 animate-pulse' : 'bg-amber-400'
              }`}
            />
            <span>{locationStatus}</span>
          </p>
          <span className="text-slate-500 font-bold hidden sm:inline">
            {t('facilities.totalCenters')} {filteredFacilities.length}
          </span>
        </div>
      </div>

      {/* Interactive Map Box */}
      <div className="bg-white rounded-3xl overflow-hidden border-2 border-slate-200 shadow-sm relative">
        {/* Floating Quick Action Button: Re-center on My Location */}
        <button
          type="button"
          onClick={handleRecenterMap}
          className="absolute top-3 right-3 z-1000 bg-white/95 hover:bg-white text-slate-800 p-2.5 rounded-2xl shadow-md border border-slate-200 transition-all hover:scale-105 active:scale-95 flex items-center gap-1.5 text-xs font-extrabold backdrop-blur-xs"
          title={t('facilities.recenterMap')}
        >
          <Crosshair className="w-4 h-4 text-teal-700" />
          <span className="hidden sm:inline">{t('facilities.recenterMap')}</span>
        </button>

        <div
          ref={mapContainerRef}
          className="w-full h-84 sm:h-96 z-0"
          style={{ minHeight: '380px' }}
        />

        {/* Map Legend */}
        <div className="bg-slate-50/95 backdrop-blur-xs px-4 py-2.5 text-xs text-slate-700 font-bold border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-red-600 border border-white shadow-xs"></span>
              <span>{t('facilities.legendHospital')}</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-blue-600 border border-white shadow-xs"></span>
              <span>{t('facilities.legendChc')}</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-emerald-600 border border-white shadow-xs"></span>
              <span>{t('facilities.legendPhc')}</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-amber-500 border border-white shadow-xs"></span>
              <span>{t('facilities.legendSubCentre')}</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-purple-600 border border-white shadow-xs"></span>
              <span>{t('facilities.legendClinic')}</span>
            </span>
          </div>

          <span className="text-[11px] text-slate-500 font-semibold">
            {t('facilities.legendTip')}
          </span>
        </div>
      </div>

      {/* Facilities Cards List */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between">
          <h3 className="font-extrabold text-slate-900 text-lg sm:text-xl">
            {t('facilities.availableCenters')} ({filteredFacilities.length}):
          </h3>
          {initialLevel && (
            <span className="text-xs font-bold uppercase px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
              {t('facilities.triageLevel')} {initialLevel}
            </span>
          )}
        </div>

        {loading ? (
          <div className="text-center py-12 text-slate-500 font-semibold bg-white rounded-3xl border border-slate-200">
            <div className="w-8 h-8 border-3 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            {t('facilities.loadingCenters')}
          </div>
        ) : filteredFacilities.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 text-center border border-slate-200 text-slate-600 font-medium">
            {t('facilities.noCentersFound')}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredFacilities.map((fac) => {
              const navUrl = getNavigationUrl(
                fac.lat,
                fac.lng,
                fac.name,
                userLocation?.lat,
                userLocation?.lng
              );

              const typeBadge = {
                DISTRICT_HOSPITAL: 'bg-red-50 text-red-800 border-red-200',
                CHC: 'bg-blue-50 text-blue-800 border-blue-200',
                PHC: 'bg-emerald-50 text-emerald-800 border-emerald-200',
                SUB_CENTRE: 'bg-amber-50 text-amber-800 border-amber-200',
                TELECONSULT_PARTNER: 'bg-teal-50 text-teal-800 border-teal-200',
                PRIVATE_CLINIC: 'bg-purple-50 text-purple-800 border-purple-200',
              }[fac.type] || 'bg-slate-50 text-slate-800 border-slate-200';

              const typeLabel = {
                DISTRICT_HOSPITAL: t('facilities.typeHospital'),
                CHC: t('facilities.typeChc'),
                PHC: t('facilities.typePhc'),
                SUB_CENTRE: t('facilities.typeSubCentre'),
                TELECONSULT_PARTNER: t('facilities.typeTeleconsult'),
                PRIVATE_CLINIC: t('facilities.typeClinic'),
              }[fac.type] || fac.type;

              const isFocused = activeFacilityId === fac.id;
              const mainTitle = language === 'en' ? fac.name : fac.nameHi || fac.name;
              const subTitle = language === 'en' ? (fac.nameHi && fac.nameHi !== fac.name ? fac.nameHi : '') : (fac.nameHi ? fac.name : '');

              return (
                <div
                  key={fac.id}
                  onClick={() => handleFocusFacility(fac)}
                  className={`bg-white rounded-2xl p-5 border transition-all shadow-xs flex flex-col justify-between cursor-pointer group ${
                    isFocused
                      ? 'border-[#0D9B75] ring-2 ring-[#0D9B75]/20 shadow-md'
                      : 'border-slate-200 hover:border-teal-600 hover:shadow-md'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-md text-[11px] font-extrabold border mb-1.5 ${typeBadge}`}
                        >
                          {typeLabel}
                        </span>
                        <h4 className="font-extrabold text-slate-900 text-base leading-snug group-hover:text-teal-800 transition-colors">
                          {mainTitle}
                        </h4>
                        {subTitle && (
                          <p className="text-xs text-slate-500 font-semibold">{subTitle}</p>
                        )}
                      </div>

                      {fac.distanceKm !== null && fac.distanceKm !== undefined && (
                        <div className="shrink-0 bg-teal-50 border border-teal-200 text-teal-900 font-extrabold text-xs px-2.5 py-1 rounded-xl text-center">
                          <div className="text-sm font-black">{fac.distanceKm}</div>
                          <div className="text-[10px] font-bold text-teal-700">{t('facilities.km')}</div>
                        </div>
                      )}
                    </div>

                    <p className="text-xs text-slate-600 font-medium flex items-start gap-1.5">
                      <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                      <span>{fac.address}</span>
                    </p>

                    <div className="text-xs text-slate-700 font-semibold flex flex-wrap items-center gap-3 pt-1">
                      <span className="text-emerald-700 font-bold">⏰ {fac.openingHours}</span>
                      <span>📞 {fac.phone}</span>
                    </div>

                    {fac.servicesList && fac.servicesList.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-2">
                        {fac.servicesList.slice(0, 4).map((srv, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md"
                          >
                            {srv.replace(/_/g, ' ')}
                          </span>
                        ))}
                        {fac.servicesList.length > 4 && (
                          <span className="text-[10px] font-bold text-slate-500 py-0.5">
                            +{fac.servicesList.length - 4} {t('facilities.andMoreServices')}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Action Buttons: Show on map, Call, Directions */}
                  <div className="grid grid-cols-2 gap-2 pt-4 mt-3 border-t border-slate-100">
                    <a
                      href={`tel:${fac.phone}`}
                      onClick={(e) => e.stopPropagation()}
                      className="flex items-center justify-center gap-1.5 bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs py-2.5 px-3 rounded-xl shadow-xs transition-transform active:scale-95"
                    >
                      <PhoneCall className="w-3.5 h-3.5" />
                      <span>{t('facilities.call')}</span>
                    </a>

                    <a
                      href={navUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="flex items-center justify-center gap-1.5 bg-[#16352D] hover:bg-[#0F2520] text-white font-bold text-xs py-2.5 px-3 rounded-xl shadow-xs transition-transform active:scale-95"
                    >
                      <Navigation className="w-3.5 h-3.5" />
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
