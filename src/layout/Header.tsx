import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Mail } from 'lucide-react';
import { cn } from '../lib/utils';

interface HeaderProps {
  title?: string;
  tabs?: string[];
  activeTab?: string;
  onTabChange?: (tab: string) => void;
  onMenuClick: () => void;
}

export function Header({
  title,
  tabs = ['Home', 'Explore', 'Live', 'Predictions'],
  activeTab = 'Home',
  onTabChange,
  onMenuClick,
}: HeaderProps) {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={cn(
      'sticky top-0 z-40 backdrop-blur-md transition-all duration-300',
      scrolled ? 'bg-black/95 border-b border-[#ef4444]/20' : 'bg-black/70'
    )}>
      <div className="border-b border-[#2f3336]">
        <div className="flex items-center justify-between px-4 h-14">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onMenuClick}
              className="p-2 rounded-full hover:bg-white/10 transition-colors"
            >
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            {title ? (
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-white">{title}</h1>
                {title === 'Sports' && (
                  <span className="text-xs text-[#ef4444] bg-[#ef4444]/10 px-2 py-0.5 rounded-full">LIVE</span>
                )}
              </div>
            ) : null}
          </div>

          <div className="hidden sm:flex items-center gap-3">
            {tabs.map(tab => (
              <button
                key={tab}
                type="button"
                onClick={() => onTabChange?.(tab)}
                className={cn(
                  'px-4 py-2 rounded-full text-sm font-semibold transition-all',
                  activeTab === tab ? 'bg-[#ef4444] text-white shadow-lg shadow-[#ef4444]/20' : 'text-[#71767b] hover:text-white hover:bg-white/5'
                )}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button onClick={() => navigate('/messages')}
              className="relative p-2 rounded-full hover:bg-white/10 transition-colors text-white">
              <Mail className="w-5 h-5" />
              <span className="absolute top-0 right-0 w-4 h-4 bg-[#ef4444] text-white text-[10px] font-bold rounded-full flex items-center justify-center">2</span>
            </button>
            <button onClick={() => navigate('/notifications')}
              className="relative p-2 rounded-full hover:bg-white/10 transition-colors text-white">
              <Bell className="w-5 h-5" />
              <span className="absolute top-0 right-0 w-4 h-4 bg-[#ef4444] text-white text-[10px] font-bold rounded-full flex items-center justify-center">9+</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
