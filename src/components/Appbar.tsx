"use client"
import Image from "next/image";
import { useRouter } from "next/navigation";


export function Appbar() {
    const router  = useRouter();
    return (
        <nav className="flex px-9 py-0 fixed top-4 w-full z-20">
            <div className="nav-bar relative flex items-center bg-white w-full rounded-xl p-[5px] text-black shadow-[0px_5px_22px_4px_rgba(171,_217,_220,_0.25)] h-[65px]" >
                <div className="w-full h-full rounded-[7px] flex shadow-[inset_0px_3px_17px_-2px_rgba(180,_231,_234,_0.40)]"  style={{ background: 'linear-gradient(to bottom, #C0ECE9 0%, #d5dada40 100%)', opacity: 0.4667}}>
                </div>
                <div className="absolute left-0 rounded-[12px] p-[5px] w-full h-full flex items-center justify-between">
                    <div className="logo ml-12 flex gap-3 items-center cursor-pointer">
                        <Image 
                            src="/logo.svg"
                            alt="logo"
                            width={18}
                            height={29}
                        />
                        <div className="app-name text-xl font-semibold">WaitX</div>
                    </div>

                    <div className="flex gap-[34px]">
                        <div className="cursor-pointer hover:text-zinc-700 transition-colors duration-200">Home</div>
                        <div className="cursor-pointer hover:text-zinc-700 transition-colors duration-200">Pricing</div>
                        <div className="cursor-pointer hover:text-zinc-700 transition-colors duration-200">Product</div>
                        <div className="cursor-pointer hover:text-zinc-700 transition-colors duration-200">About</div>
                        <div className="cursor-pointer hover:text-zinc-700 transition-colors duration-200">Contact</div>
                    </div>
                    <div className="mr-3">
                        <button className="px-6 py-2 bg-black text-white rounded-lg text-sm hover:bg-zinc-700  transition-colors duration-200 cursor-pointer" onClick={() => router.push('/signin')}>Signin</button>
                    </div>
                </div>
            </div>
        </nav>
    );
}