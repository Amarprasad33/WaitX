"use client"
import SigninForm from "@/components/forms/signin-form";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();
  return (
    <div className="bg-white inset-0 flex justify-center flex-col items-center min-h-screen" >
      <div className="form-container mx-auto mt-30 bg-white border border-gray-300  w-[90%] sm:w-[60%] md:w-[40%] lg:w-[30%] max-w-[25rem] px-6 py-8 rounded-xl">
        <div className="space-y-2 text-center mb-4">
            <h1 className="text-2xl font-semibold text-black tracking-tight">Sign in</h1>
            <p className="text-sm text-gray-400">Enter your detals to log in.</p>
        </div>
        <div className="flex flex-col items-center">
            <SigninForm />
            <div className='flex gap-2 mt-6'>
              <span>Don&apos;t have an account?</span>
              <span className="text-indigo-600 hover:text-indigo-500 cursor-pointer" onClick={() => router.push("/signup")}>Sign Up</span>
            </div>
        </div>
      </div>

      <div className="mt-4 flex gap-2">
        <span>Sign up as a charging station owner</span>
        <span className="text-indigo-600 hover:text-indigo-500 cursor-pointer" onClick={() => router.push("/station_signup")}>click here.</span>
      </div>
    </div>
  );
}