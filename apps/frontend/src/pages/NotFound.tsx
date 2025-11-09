import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="text-center text-white animate-fade-in">
        <div className="mb-8">
          <h1 className="text-9xl font-extrabold mb-4 bg-gradient-to-r from-white via-purple-100 to-pink-100 bg-clip-text text-transparent">
            404
          </h1>
          <div className="h-1 w-32 bg-gradient-to-r from-purple-400 to-pink-400 mx-auto rounded-full mb-6"></div>
        </div>
        <p className="text-2xl font-semibold mb-2 text-white/95">Page not found</p>
        <p className="text-white/70 mb-8 text-sm">
          The page you're looking for doesn't exist
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105 active:scale-95"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <span>Go Home</span>
        </Link>
      </div>
    </div>
  );
}

