import Link from 'next/link';

export default function ScanLanding() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 space-y-8">
      <h1 className="text-4xl font-bold text-primary tracking-widest">VOLUNTEER PORTAL</h1>
      
      <div className="grid grid-cols-1 gap-6 w-full max-w-md">
        <Link href="/scan/meal" className="block">
          <div className="card hover:bg-gray-900 transition-colors cursor-pointer text-center py-12 border-2 border-primary group">
            <span className="text-6xl mb-4 block group-hover:scale-110 transition-transform">🍔</span>
            <h2 className="text-2xl font-bold text-white group-hover:text-primary">SCAN MEAL</h2>
            <p className="text-gray-400 mt-2">Distribute food based on active phase</p>
          </div>
        </Link>

        <Link href="/scan/swag" className="block">
          <div className="card hover:bg-gray-900 transition-colors cursor-pointer text-center py-12 border-2 border-primary group">
            <span className="text-6xl mb-4 block group-hover:scale-110 transition-transform">🎒</span>
            <h2 className="text-2xl font-bold text-white group-hover:text-primary">SCAN SWAG</h2>
            <p className="text-gray-400 mt-2">Distribute swag kits (One-time)</p>
          </div>
        </Link>
      </div>
      
      <div className="text-gray-500 text-sm mt-8">
        <p>Ensure you have camera permissions enabled.</p>
      </div>
    </div>
  );
}
