
"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const handleGetStarted = () => {
    if (status === "authenticated") {
      // If user is logged in, redirect to dashboard
      router.push("/dashboard");
    } else {
      // If user is not logged in, redirect to login page
      router.push("/auth/signin");
    }
  };

  return (
    <div className="ocean flex flex-col items-center justify-center text-white relative">
      {/* Three animated wave layers */}
      <div className="wave"></div>
      <div className="wave"></div>
      <div className="wave"></div>

      {/* Main content (above the waves, hence z-10) */}
      <header className="text-center z-10">
        <h1 className="text-5xl font-bold mb-4">Welcome to Our Business</h1>
        <p className="text-lg text-gray-300">
          Manage your products, inventory, and orders efficiently.
        </p>
      </header>
      <button
        onClick={handleGetStarted}
        className="z-10 mt-6 px-6 py-3 bg-white text-[#000214] font-semibold rounded-lg hover:bg-gray-200 transition"
      >
        Get Started
      </button>
    </div>
  );
}


