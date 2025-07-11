"use client"
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import axios from 'axios';


// const Map = dynamic(() => import('@/components/Map'), { ssr: false });
const MapWithStations = dynamic(() => import('@/components/MapWithStations'), { ssr: false });


export default function Find() {

    const [data, setData] = useState<any>(null);

    useEffect(() => {
        console.log("result-->", data);
        // axios
        //     .get('http://ec2-35-154-166-146.ap-south-1.compute.amazonaws.com:8000/getStationData', {
        //         params: { count: 3 }
        //     })
        //     .then((response) => {
        //         console.log("response", response);
        //         if(response?.data)
        //             setData(response.data);
        //     })
        //     .catch((err) => {
        //         console.error(err);
        //         // setError('Failed to fetch station data');
        //     });
        setData(stationsObj);
    }, [data])

    if(!data){
        return <div>Loadinggggg</div>
    }
    return (
        <div className='w-full min-h-[150vh] bg-white flex flex-col items-center'>
            <div className="map-container w-[80%] h-[40rem] rounded-lg mt-32">

                <MapWithStations stations={data?.stationCounts} />
            </div>
        </div>
    );
}



const stationsObj = {
    "stationCounts": [
      {
        "station_id": 101,
        "location_lat": 20.35411540651478,
        "location_lon": 85.82661814241807,
        "charger_type": "Level_2",
        "number_of_ports": 6,
        "port_capacity_kw": 22,
        "availability_hours": "8:00-22:00",
        "operator_type": "franchise",
        "requested_time": "2025-08-14 05:00:00",
        "day_of_week": "Thursday",
        "is_weekend": 0,
        "hour_of_day": 5,
        "is_holiday": 0,
        "current_location_lat": 28.590733,
        "current_location_lon": 77.179722,
        "estimated_arrival_time": "2025-08-14 05:03:00",
        "trip_distance_km": 2.04,
        "trip_duration_min": 3,
        "battery_level_percent": 25,
        "charging_needed_kw": 37.5,
        "average_occupancy_rate_at_time": 0.46,
        "avg_duration_per_charge_session": 49,
        "sessions_last_7_days_at_time": 68,
        "avg_wait_time_at_hour": 15,
        "peak_hours": 0,
        "last_known_status": "free",
        "weather_conditions": "Clear",
        "temperature_celsius": 36,
        "traffic_congestion_level": "Low",
        "local_events_density": "High",
        "air_quality_index": 230,
        "is_available_at_arrival_time": 1
      },
      {
        "station_id": 103,
        "location_lat": 20.313961440910397,
        "location_lon": 85.82774668202393,
        "charger_type": "DC_Fast",
        "number_of_ports": 6,
        "port_capacity_kw": 22,
        "availability_hours": "9:00-23:00",
        "operator_type": "private",
        "requested_time": "2025-09-17 15:00:00",
        "day_of_week": "Wednesday",
        "is_weekend": 0,
        "hour_of_day": 15,
        "is_holiday": 0,
        "current_location_lat": 28.593154,
        "current_location_lon": 77.184549,
        "estimated_arrival_time": "2025-09-17 15:55:00",
        "trip_distance_km": 26.5,
        "trip_duration_min": 55,
        "battery_level_percent": 81,
        "charging_needed_kw": 9.5,
        "average_occupancy_rate_at_time": 0.43,
        "avg_duration_per_charge_session": 18,
        "sessions_last_7_days_at_time": 71,
        "avg_wait_time_at_hour": 12,
        "peak_hours": 0,
        "last_known_status": "occupied",
        "weather_conditions": "Cloudy",
        "temperature_celsius": 21.5,
        "traffic_congestion_level": "Medium",
        "local_events_density": "Medium",
        "air_quality_index": 176,
        "is_available_at_arrival_time": 0
      },
      {
        "station_id": 102,
        "location_lat": 20.300575521219614,
        "location_lon": 85.82352453037566,
        "charger_type": "Level_1",
        "number_of_ports": 6,
        "port_capacity_kw": 22,
        "availability_hours": "5:00-23:00",
        "operator_type": "government",
        "requested_time": "2025-10-05 12:00:00",
        "day_of_week": "Sunday",
        "is_weekend": 1,
        "hour_of_day": 12,
        "is_holiday": 0,
        "current_location_lat": 28.565138,
        "current_location_lon": 77.289127,
        "estimated_arrival_time": "2025-10-05 12:54:00",
        "trip_distance_km": 26.05,
        "trip_duration_min": 54,
        "battery_level_percent": 47,
        "charging_needed_kw": 26.5,
        "average_occupancy_rate_at_time": 0.59,
        "avg_duration_per_charge_session": 22,
        "sessions_last_7_days_at_time": 48,
        "avg_wait_time_at_hour": 20,
        "peak_hours": 0,
        "last_known_status": "occupied",
        "weather_conditions": "Storm",
        "temperature_celsius": 36.8,
        "traffic_congestion_level": "Low",
        "local_events_density": "Medium",
        "air_quality_index": 232,
        "is_available_at_arrival_time": 0
      }
    ]
  }