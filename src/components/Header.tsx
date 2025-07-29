import React from 'react';
import { Moon, Sun } from 'lucide-react';
interface HeaderProps {
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
}
const Header: React.FC<HeaderProps> = ({
  darkMode,
  setDarkMode
}) => {
  return <header className="border-b border-border">
      <div className="container max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
            <span className="text-primary-foreground font-bold">M</span>
          </div>
          <h1 className="text-xl font-bold">MoodTrack</h1>
        </div>
        <button onClick={() => setDarkMode(!darkMode)} className="p-2 rounded-full hover:bg-muted transition-colors" aria-label={darkMode ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}>
          {darkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>
    </header>;
};
export default Header;