import SignupForm from "@/components/forms/signup-form";

export default function SignupPage() {
  return (
    <div className="bg-white inset-0 flex justify-center items-center min-h-screen" >
      <div className="form-container mx-auto mt-30 bg-white border border-gray-300  w-[80%] sm:w-[60%] md:w-[40%] lg:w-[30%] max-w-[25rem] px-6 py-8 my-14 rounded-xl">
        <div className="space-y-2 text-center mb-4">
            <h1 className="text-2xl font-semibold text-black tracking-tight">Create Your Account.</h1>
            <p className="text-sm text-gray-400">Enter your detals to get started.</p>
        </div>
        <div className="">
            <SignupForm />
        </div>
      </div>
    </div>
  );
}