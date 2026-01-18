import { Languages } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';

export function LanguageToggle() {
  const { language, toggleLanguage } = useLanguage();

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors touch-target"
      aria-label="Toggle Language"
    >
      <Languages className="w-5 h-5" />
      <span className="font-medium">{language === 'en' ? 'EN' : 'नेपाली'}</span>
    </button>
  );
}
