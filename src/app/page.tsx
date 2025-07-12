"use client"
// import Image from "next/image";
// import { useState } from 'react';
// import axios from 'axios';
import { useRouter } from 'next/navigation';

export default function Home() {
  
  // const [loading, setLoading] = useState(true);
  // const [data, setData] = useState<any>(null);
  const router  = useRouter();
  // useEffect(() => {
  //   console.log("result-->", data);
  //   // setData(stationsObj);
  // }, [data])

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       // const res = await fetch('http://ec2-35-154-166-146.ap-south-1.compute.amazonaws.com:8000/getStationData?count=3');
  //       // console.log("ress--", res);
  //       // const json = await res.json();
  //       axios
  //         .get('http://ec2-35-154-166-146.ap-south-1.compute.amazonaws.com:8000/getStationData', {
  //           params: { count: 3 }
  //         })
  //         .then((response) => {
  //           console.log("response", response);
  //           setData(response.data);
  //         })
  //         .catch((err) => {
  //           console.error(err);
  //           // setError('Failed to fetch station data');
  //         });
  //       // setData(json.message);
  //     } catch (err) {
  //       console.error('Error fetching data:', err);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchData();
  // }, []);

  // if(loading){
  //   return <div>Loading</div>
  // }

  return (
    <div className="w-full min-h-screen bg-white flex flex-col items-center">
      <div className="text-black font-semibold mt-46 w-[60%] text-5xl text-center -tracking-[1px]">Find your next charging spot in minutes</div>
      <button className="px-10 py-3 mt-8 bg-black text-white rounded-[8px] text-sm hover:bg-zinc-700  transition-colors duration-200 cursor-pointer" onClick={() => router.push('/direct')}>Find your next charge</button>
    </div>
  );
}



