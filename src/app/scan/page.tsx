import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function ScanLanding() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 space-y-8 bg-background">
      <h1 className="text-4xl font-bold text-primary tracking-widest">VOLUNTEER PORTAL</h1>
      
      <div className="grid grid-cols-1 gap-6 w-full max-w-md">
        <Link href="/scan/meal" className="block">
          <Card className="hover:bg-accent transition-colors cursor-pointer border-2 border-primary group">
            <CardContent className="flex flex-col items-center py-12">
              <span className="text-6xl mb-4 block group-hover:scale-110 transition-transform">🍔</span>
              <CardTitle className="text-2xl font-bold text-foreground group-hover:text-primary">SCAN MEAL</CardTitle>
              <CardDescription className="mt-2">Distribute food based on active phase</CardDescription>
            </CardContent>
          </Card>
        </Link>

        <Link href="/scan/swag" className="block">
          <Card className="hover:bg-accent transition-colors cursor-pointer border-2 border-primary group">
            <CardContent className="flex flex-col items-center py-12">
              <span className="text-6xl mb-4 block group-hover:scale-110 transition-transform">🎒</span>
              <CardTitle className="text-2xl font-bold text-foreground group-hover:text-primary">SCAN SWAG</CardTitle>
              <CardDescription className="mt-2">Distribute swag kits (One-time)</CardDescription>
            </CardContent>
          </Card>
        </Link>
      </div>
      
      <div className="text-muted-foreground text-sm mt-8">
        <p>Ensure you have camera permissions enabled.</p>
      </div>
    </div>
  );
}
