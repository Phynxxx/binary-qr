'use client';

import clsx from 'clsx';

interface ScanResultProps {
  status: 'IDLE' | 'SUCCESS' | 'DUPLICATE' | 'ERROR' | 'LOADING';
  message: string;
  user?: any;
  onReset: () => void;
}

export default function ScanResult({ status, message, user, onReset }: ScanResultProps) {
  if (status === 'IDLE') return null;

  const isSuccess = status === 'SUCCESS';
  const isLoading = status === 'LOADING';
  const isError = status === 'DUPLICATE' || status === 'ERROR';

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
      <div className={`w-full max-w-lg rounded-xl border-4 p-8 text-center shadow-2xl ${
        isSuccess ? 'border-primary bg-black' : 
        isError ? 'border-destructive bg-black' : 'border-muted bg-black'
      }`}>
        <h2 className={`text-4xl font-bold mb-4 ${
          isSuccess ? 'text-primary' : 
          isError ? 'text-destructive' : 'text-muted-foreground'
        }`}>
          {isLoading ? 'PROCESSING...' : status}
        </h2>
        
        <p className="text-xl mb-8 text-foreground">{message}</p>
        
        {user && (
          <div className="mb-8 text-left border border-border p-4 rounded bg-card">
            <p className="text-muted-foreground text-sm uppercase tracking-wider mb-1">Participant</p>
            <p className="text-2xl font-mono text-primary">{user.username}</p>
          </div>
        )}

        <button 
          onClick={onReset}
          className={`w-full py-4 text-2xl font-bold rounded transition-all ${
            isSuccess ? 'bg-primary text-black hover:bg-primary/90' :
            isError ? 'bg-destructive text-white hover:bg-destructive/90' :
            'bg-muted text-muted-foreground'
          }`}
        >
          SCAN NEXT
        </button>
      </div>
    </div>
  );
}
