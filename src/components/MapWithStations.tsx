"use client"

// components/Map.js
import React, { useEffect, useRef, useState } from 'react';
import { GoogleMap, useLoadScript, Marker, Autocomplete, InfoWindow } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '100%',
};

const defaultCenter = {
  lat: 20.294922380321612, // Default to San Francisco
  lng: 85.82492085426732,
};

interface Station {
    station_id: number;
    location_lat: number;
    location_lon: number;
    last_known_status: string;
    charger_type: string;
    port_capacity_kw: number;
    availability_hours: string;
    operator_type: string;
}

// interface Props {
//     stationCounts: Station[];
// }

export default function Map({stations}: {stations: any}) {
    useEffect(() => {
        console.log("stations", stations);
        if (stations.length > 0) {
            const avgLat =
              stations.reduce((sum: number, s: Station) => sum + s.location_lat, 0) /
              stations.length;
            const avgLng =
              stations.reduce((sum: number, s: Station) => sum + s.location_lon, 0) /
              stations.length;
            setCenter({ lat: avgLat, lng: avgLng });
        }
    }, [stations])
  const { isLoaded, loadError } = useLoadScript({
      googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
      libraries: ['places']
  });

  const [center, setCenter] = useState(defaultCenter);
  const [selectedStation, setSelectedStation] = useState<Station | null>(null);
  const [markerPos, setMarkerPos] = useState(defaultCenter);
  const autoCompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

//   const onPlaceChanged = () => {
//     if (autoCompleteRef.current) {
//       const place = autoCompleteRef.current.getPlace();
//       const location = place.geometry?.location;

//       if (location) {
//         const lat = location.lat();
//         const lng = location.lng();
//         setCenter({ lat, lng });
//         setMarkerPos({ lat, lng });
//       }
//     }
//   };
    const onPlaceChanged = () => {
        if (autoCompleteRef.current) {
            const place = autoCompleteRef.current.getPlace();
            const location = place.geometry?.location;
            if (location) {
                setCenter({ lat: location.lat(), lng: location.lng() });
            }
        }
    };

  if (loadError) return (
      <div>Error loading maps</div>
  );
  if (!isLoaded) return <div>Loading Maps...</div>;

  return (
    <div className='h-full w-full'>
      <div className="mb-4">
        <Autocomplete
          onLoad={(autocomplete) => {
            autoCompleteRef.current = autocomplete;
          }}
          onPlaceChanged={onPlaceChanged}
        >
          <input
            type="text"
            placeholder="Search places..."
            className="w-full p-2 border border-[#d1d1d1] text-black rounded"
          />
        </Autocomplete>
      </div>
      <GoogleMap 
        mapContainerStyle={containerStyle} 
        center={center} 
        zoom={12}
      >
        {stations.map((station: any) => (
          <Marker
            key={station.station_id}
            position={{ lat: station.location_lat, lng: station.location_lon }}
            icon={{
              url:
                station.last_known_status === 'free'
                  ? 'http://maps.google.com/mapfiles/ms/icons/green-dot.png'
                  : 'http://maps.google.com/mapfiles/ms/icons/red-dot.png',
            }}
            onClick={() => setSelectedStation(station)}
          />
        ))}

        {selectedStation && (
          <InfoWindow
            position={{
              lat: selectedStation.location_lat,
              lng: selectedStation.location_lon,
            }}
            onCloseClick={() => setSelectedStation(null)}
          >
            <div className="max-w-xs text-black">
              <h2 className="font-bold mb-1">Station ID: {selectedStation.station_id}</h2>
              <p>Status: {selectedStation.last_known_status}</p>
              <p>Type: {selectedStation.charger_type}</p>
              <p>Power: {selectedStation.port_capacity_kw} kW</p>
              <p>Hours: {selectedStation.availability_hours}</p>
              <p>Operator: {selectedStation.operator_type}</p>
            </div>
          </InfoWindow>
        )}
        {/* <Marker position={markerPos} /> */}
      </GoogleMap>
    </div>
  );
}
