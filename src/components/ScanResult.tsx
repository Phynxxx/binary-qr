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

  const bgColor = clsx({
    'bg-black/90': status === 'LOADING',
    'bg-green-900/90': status === 'SUCCESS',
    'bg-red-900/90': status === 'DUPLICATE' || status === 'ERROR',
  });

  const borderColor = clsx({
    'border-primary': status === 'SUCCESS' || status === 'LOADING',
    'border-red-500': status === 'DUPLICATE' || status === 'ERROR',
  });

  const textColor = clsx({
    'text-primary': status === 'SUCCESS' || status === 'LOADING',
    'text-red-500': status === 'DUPLICATE' || status === 'ERROR',
  });

  return (
    <div className={clsx("fixed inset-0 z-50 flex flex-col items-center justify-center p-4", bgColor)}>
      <div className={clsx("card w-full max-w-lg text-center p-8 border-4", borderColor)}>
        <h2 className={clsx("text-4xl font-bold mb-4", textColor)}>
          {status === 'LOADING' ? 'PROCESSING...' : status}
        </h2>
        <p className="text-xl mb-6 text-white">{message}</p>
        
        {user && (
          <div className="mb-6 text-left border border-gray-700 p-4 rounded bg-black">
            <p className="text-gray-400 text-sm">User:</p>
            <p className="text-xl font-mono text-white">{user.username}</p>
          </div>
        )}

        <button 
          onClick={onReset}
          className="btn-primary w-full text-2xl py-4"
        >
          SCAN NEXT
        </button>
      </div>
    </div>
  );
}
