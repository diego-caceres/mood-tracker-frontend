import React, { useEffect, useState } from 'react';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
export function App() {
  const [darkMode, setDarkMode] = useState(false);
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);
  return <div className="min-h-screen bg-background">
      <Header darkMode={darkMode} setDarkMode={setDarkMode} />
      <main className="container px-4 py-6 max-w-4xl mx-auto">
        <Dashboard />
      </main>
    </div>;
}