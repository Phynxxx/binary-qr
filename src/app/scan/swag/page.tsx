'use client';

import { useState, useEffect } from 'react';
import QRScanner from '@/components/QRScanner';
import ScanResult from '@/components/ScanResult';

export default function SwagScanPage() {
  const [status, setStatus] = useState<'IDLE' | 'SUCCESS' | 'DUPLICATE' | 'ERROR' | 'LOADING'>('IDLE');
  const [message, setMessage] = useState('');
  const [user, setUser] = useState<any>(null);
  const [volunteerId, setVolunteerId] = useState('');

  useEffect(() => {
    let vid = localStorage.getItem('volunteerId');
    if (!vid) {
      vid = 'vol-' + Math.random().toString(36).substr(2, 5);
      localStorage.setItem('volunteerId', vid);
    }
    setVolunteerId(vid);
  }, []);

  const handleScan = async (qrData: string) => {
    if (status === 'LOADING' || status === 'SUCCESS' || status === 'DUPLICATE') return;

    setStatus('LOADING');
    setMessage('Verifying Swag...');

    try {
      const res = await fetch('/api/scan/swag', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ qrData, volunteerId }),
      });

      const data = await res.json();

      if (data.status === 'SUCCESS') {
        setStatus('SUCCESS');
        setMessage(data.message);
        setUser(data.user);
      } else if (data.status === 'DUPLICATE') {
        setStatus('DUPLICATE');
        setMessage(data.message);
      } else {
        setStatus('ERROR');
        setMessage(data.message || 'Unknown error');
      }
    } catch (err) {
      setStatus('ERROR');
      setMessage('Network error');
    }
  };

  const reset = () => {
    setStatus('IDLE');
    setMessage('');
    setUser(null);
  };

  return (
    <div className="min-h-screen p-4 flex flex-col items-center">
      <h1 className="text-2xl font-bold text-primary mb-8">SWAG SCANNER</h1>
      
      <div className="w-full max-w-md bg-black p-4 rounded border border-gray-800 mb-4">
        <p className="text-gray-400 text-xs uppercase">Volunteer ID</p>
        <p className="font-mono text-white">{volunteerId}</p>
      </div>

      <QRScanner onScan={handleScan} onError={(err) => console.log(err)} />
      
      <ScanResult status={status} message={message} user={user} onReset={reset} />
    </div>
  );
}
