import { useTranslation } from 'react-i18next';
import { useLanguageStore } from '../store/languageStore';

export function useLanguage() {
  const { t } = useTranslation();
  const { language, setLanguage } = useLanguageStore();

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ne' : 'en');
  };

  const isNepali = language === 'ne';

  return {
    t,
    language,
    setLanguage,
    toggleLanguage,
    isNepali,
  };
}
