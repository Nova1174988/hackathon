import { Heart } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-gray-900 text-white py-8 mt-auto">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Heart className="w-6 h-6 text-primary fill-primary" />
            <span className="font-bold">{t('app.name')}</span>
          </div>
          <p className="text-gray-400 text-sm text-center">
            © 2024 {t('app.name')}. All rights reserved. | {t('app.tagline')}
          </p>
        </div>
      </div>
    </footer>
  );
}
