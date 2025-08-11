// src/pages/Unauthorized.jsx

import React from 'react';

export default function Unauthorized() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-center p-4">
      <h1 className="text-4xl font-bold text-red-600 mb-4">Access Denied</h1>
      <p className="text-lg text-gray-700 mb-6">You do not have permission to view this page.</p>
      <a
        href="/"
        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all"
      >
        Go to Login
      </a>
    </div>
  );
}
