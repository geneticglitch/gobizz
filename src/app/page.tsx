import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#000214] text-white">
      <header className="text-center">
        <h1 className="text-5xl font-bold mb-4">GoBizz</h1>
        <p className="text-lg text-gray-300">Manage your products, inventory, and orders efficiently.</p>
      </header>
      <button className="mt-6 px-6 py-3 bg-white text-[#000214] font-semibold rounded-lg hover:bg-gray-200 transition">
        Get Started
      </button>
    </div>
  );
}


