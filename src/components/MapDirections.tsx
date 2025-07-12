"use client"

// components/MapDirections.tsx
import React, { useEffect, useRef, useState } from 'react';
import { GoogleMap, useLoadScript, Marker, Autocomplete, InfoWindow, DirectionsRenderer } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '100%',
};

// Default center, used if no user location or stations are available
const defaultCenter = {
  lat: 20.294922380321612, 
  lng: 85.82492085426732,
};

// Define the structure for a single station
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

// Define the props for the component
interface Props {
    stations: Station[];
    userLocation: { lat: number; lng: number } | null;
}

export default function MapDirections({ stations, userLocation }: Props) {
    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
        libraries: ['places'] // Ensure 'places' library is loaded for Autocomplete
    });

    const [center, setCenter] = useState(defaultCenter);
    const [selectedStation, setSelectedStation] = useState<Station | null>(null);
    const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);
    const [directionsError, setDirectionsError] = useState<string | null>(null);
    const [isLoadingDirections, setIsLoadingDirections] = useState(false);
    const autoCompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

    const handleGetDirections = async () => {
        if (!selectedStation || !userLocation) {
            setDirectionsError("User location or station not available");
            return;
        }

        setIsLoadingDirections(true);
        setDirectionsError(null);
        setDirections(null);

        try {
            const directionsService = new google.maps.DirectionsService();
            
            directionsService.route(
                {
                    origin: new google.maps.LatLng(userLocation.lat, userLocation.lng),
                    destination: new google.maps.LatLng(selectedStation.location_lat, selectedStation.location_lon),
                    travelMode: google.maps.TravelMode.DRIVING,
                },
                (result, status) => {
                    setIsLoadingDirections(false);
                    
                    if (status === google.maps.DirectionsStatus.OK && result) {
                        setDirections(result);
                        setSelectedStation(null); // Close the info window
                        setDirectionsError(null);
                    } else {
                        let errorMessage = "Failed to get directions";
                        
                        switch (status) {
                            case google.maps.DirectionsStatus.NOT_FOUND:
                                errorMessage = "At least one of the origin, destination, or waypoints could not be geocoded";
                                break;
                            case google.maps.DirectionsStatus.ZERO_RESULTS:
                                errorMessage = "No route could be found between the origin and destination";
                                break;
                            case google.maps.DirectionsStatus.MAX_WAYPOINTS_EXCEEDED:
                                errorMessage = "Too many waypoints were provided";
                                break;
                            case google.maps.DirectionsStatus.INVALID_REQUEST:
                                errorMessage = "The DirectionsRequest provided was invalid";
                                break;
                            case google.maps.DirectionsStatus.OVER_QUERY_LIMIT:
                                errorMessage = "The webpage has gone over the requests limit";
                                break;
                            case google.maps.DirectionsStatus.REQUEST_DENIED:
                                errorMessage = "The webpage is not allowed to use the directions service. Please check your API key permissions.";
                                break;
                            case google.maps.DirectionsStatus.UNKNOWN_ERROR:
                                errorMessage = "A directions request could not be processed due to a server error";
                                break;
                            default:
                                errorMessage = `Directions request failed with status: ${status}`;
                        }
                        
                        setDirectionsError(errorMessage);
                        console.error(`Directions error: ${errorMessage}`, { status, result });
                    }
                }
            );
        } catch (error) {
            setIsLoadingDirections(false);
            setDirectionsError("An unexpected error occurred while getting directions");
            console.error("Directions service error:", error);
        }
    };

    const clearDirections = () => {
        setDirections(null);
        setDirectionsError(null);
    };
    
    useEffect(() => {
        // Center the map on the user's location if available
        if (userLocation) {
            setCenter(userLocation);
        } 
        // Otherwise, center on the average location of the stations
        else if (stations && stations.length > 0) {
            const avgLat = stations.reduce((sum, s) => sum + s.location_lat, 0) / stations.length;
            const avgLng = stations.reduce((sum, s) => sum + s.location_lon, 0) / stations.length;
            setCenter({ lat: avgLat, lng: avgLng });
        }
    }, [stations, userLocation]); // Re-run this effect if stations or userLocation change

    const onPlaceChanged = () => {
        if (autoCompleteRef.current) {
            const place = autoCompleteRef.current.getPlace();
            const location = place.geometry?.location;
            if (location) {
                setCenter({ lat: location.lat(), lng: location.lng() });
            }
        }
    };

    if (loadError) return <div>Error loading maps</div>;
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
                        placeholder="Search for a location..."
                        className="w-full p-2 border border-[#d1d1d1] text-black rounded"
                    />
                </Autocomplete>
                
                {/* Controls for directions */}
                {(directions || directionsError) && (
                    <div className="mt-2 flex gap-2">
                        <button
                            onClick={clearDirections}
                            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-700"
                        >
                            Clear Directions
                        </button>
                    </div>
                )}
                
                {/* Error message display */}
                {directionsError && (
                    <div className="mt-2 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                        <strong>Directions Error:</strong> {directionsError}
                        <div className="mt-1 text-sm">
                            Make sure the Directions API is enabled in your Google Cloud Console.
                        </div>
                    </div>
                )}
            </div>
            
            <GoogleMap 
                mapContainerStyle={containerStyle} 
                center={center} 
                zoom={14} // Increased zoom for a better view
            >
                {/* Marker for the user's current location */}
                {userLocation && (
                    <Marker
                        position={userLocation}
                        title="Your Location"
                        icon={{
                            url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
                        }}
                    />
                )}

                {/* Markers for the charging stations */}
                {stations.map((station: Station) => (
                    <Marker
                        key={station.station_id}
                        position={{ lat: station.location_lat, lng: station.location_lon }}
                        icon={{
                            url: station.last_known_status === 'free'
                                ? 'http://maps.google.com/mapfiles/ms/icons/green-dot.png'
                                : 'http://maps.google.com/mapfiles/ms/icons/red-dot.png',
                        }}
                        onClick={() => setSelectedStation(station)}
                    />
                ))}

                {/* InfoWindow for the selected station */}
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
                            <p><strong>Status:</strong> {selectedStation.last_known_status}</p>
                            <p><strong>Type:</strong> {selectedStation.charger_type}</p>
                            <p><strong>Power:</strong> {selectedStation.port_capacity_kw} kW</p>
                            <p><strong>Hours:</strong> {selectedStation.availability_hours}</p>
                            <p><strong>Operator:</strong> {selectedStation.operator_type}</p>
                            <button 
                                onClick={handleGetDirections}
                                disabled={isLoadingDirections || !userLocation}
                                className={`mt-2 px-4 py-2 text-white rounded w-full ${
                                    isLoadingDirections || !userLocation 
                                        ? 'bg-gray-400 cursor-not-allowed' 
                                        : 'bg-blue-500 hover:bg-blue-700'
                                }`}
                            >
                                {isLoadingDirections ? 'Loading...' : 'Get Directions'}
                            </button>
                            {userLocation && (
                                <a
                                    href={`https://www.google.com/maps/dir/?api=1&origin=${userLocation.lat},${userLocation.lng}&destination=${selectedStation.location_lat},${selectedStation.location_lon}&travelmode=driving`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="mt-2 px-4 py-2 text-white rounded bg-green-500 hover:bg-green-700 block text-center"
                                    style={{ marginTop: '8px' }}
                                >
                                    Open in Google Maps
                                </a>
                            )}
                            {!userLocation && (
                                <p className="text-sm text-red-600 mt-1">
                                    User location required for directions
                                </p>
                            )}
                        </div>
                    </InfoWindow>
                )}

                {/* Render directions if available */}
                {directions && (
                    <DirectionsRenderer 
                        directions={directions}
                        options={{
                            suppressMarkers: false,
                            polylineOptions: {
                                strokeColor: '#1976d2',
                                strokeWeight: 4,
                                strokeOpacity: 0.8,
                            },
                        }}
                    />
                )}
            </GoogleMap>
        </div>
    );
}