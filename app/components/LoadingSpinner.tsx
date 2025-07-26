import React from 'react';

interface LoadingSpinnerProps {
  message?: string;
  className?: string;
}

export default function LoadingSpinner({ 
  message = '로딩 중...',
  className = ''
}: LoadingSpinnerProps) {
  return (
    <div className={`flex flex-col justify-center items-center ${className}`}>
      <div className="flex space-x-2">
        <div 
          className="w-4 h-4 rounded-full bg-blue-400 animate-bounce" 
          style={{ animationDelay: '0s' }}
        />
        <div 
          className="w-4 h-4 rounded-full bg-purple-400 animate-bounce" 
          style={{ animationDelay: '0.2s' }}
        />
        <div 
          className="w-4 h-4 rounded-full bg-pink-400 animate-bounce" 
          style={{ animationDelay: '0.4s' }}
        />
      </div>
      {message && (
        <p className="text-slate-600 font-medium mt-4">
          {message}
        </p>
      )}
    </div>
  );
}
