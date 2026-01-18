import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Heart } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';
import { useAuth } from '../../hooks/useAuth';
import { LanguageToggle } from '../shared/LanguageToggle';
import { Button } from '../shared/Button';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { t } = useLanguage();
  const { isAuthenticated, logout, user } = useAuth();

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-40">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <Heart className="w-8 h-8 text-primary fill-primary" />
            <span className="text-xl font-bold text-gray-900">{t('app.name')}</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/symptom-checker" className="text-gray-700 hover:text-primary transition">
              {t('nav.symptomChecker')}
            </Link>
            <Link to="/doctors" className="text-gray-700 hover:text-primary transition">
              {t('nav.doctors')}
            </Link>
            <Link to="/announcements" className="text-gray-700 hover:text-primary transition">
              {t('nav.announcements')}
            </Link>
            {isAuthenticated && (
              <Link to="/dashboard" className="text-gray-700 hover:text-primary transition">
                {t('nav.dashboard')}
              </Link>
            )}
          </nav>

          {/* Right Section */}
          <div className="hidden md:flex items-center gap-4">
            <LanguageToggle />
            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600">Hello, {user?.name}</span>
                <Button onClick={handleLogout} variant="outline" size="sm">
                  {t('nav.logout')}
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login">
                  <Button variant="outline" size="sm">{t('nav.login')}</Button>
                </Link>
                <Link to="/signup">
                  <Button variant="primary" size="sm">{t('nav.signup')}</Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <nav className="flex flex-col gap-4">
              <Link
                to="/symptom-checker"
                className="text-gray-700 hover:text-primary transition px-2 py-1"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t('nav.symptomChecker')}
              </Link>
              <Link
                to="/doctors"
                className="text-gray-700 hover:text-primary transition px-2 py-1"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t('nav.doctors')}
              </Link>
              <Link
                to="/announcements"
                className="text-gray-700 hover:text-primary transition px-2 py-1"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t('nav.announcements')}
              </Link>
              {isAuthenticated && (
                <Link
                  to="/dashboard"
                  className="text-gray-700 hover:text-primary transition px-2 py-1"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t('nav.dashboard')}
                </Link>
              )}
              <div className="border-t pt-4 mt-2">
                <LanguageToggle />
              </div>
              {isAuthenticated ? (
                <Button onClick={handleLogout} variant="outline" className="mt-2">
                  {t('nav.logout')}
                </Button>
              ) : (
                <div className="flex flex-col gap-2 mt-2">
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="outline" className="w-full">{t('nav.login')}</Button>
                  </Link>
                  <Link to="/signup" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="primary" className="w-full">{t('nav.signup')}</Button>
                  </Link>
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
