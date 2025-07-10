"use client"

// components/Map.js
import React, { useRef, useState } from 'react';
import { GoogleMap, useLoadScript, Marker, Autocomplete } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '100%',
};

const defaultCenter = {
  lat: 20.294922380321612, // Default to San Francisco
  lng: 85.82492085426732,
};

export default function Map() {
  const { isLoaded, loadError } = useLoadScript({
      googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
      libraries: ['places']
  });

  const [center, setCenter] = useState(defaultCenter);
  const [markerPos, setMarkerPos] = useState(defaultCenter);
  const autoCompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  const onPlaceChanged = () => {
    if (autoCompleteRef.current) {
      const place = autoCompleteRef.current.getPlace();
      const location = place.geometry?.location;

      if (location) {
        const lat = location.lat();
        const lng = location.lng();
        setCenter({ lat, lng });
        setMarkerPos({ lat, lng });
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
        zoom={10}
      >
        <Marker position={markerPos} />
      </GoogleMap>
    </div>
  );
}
