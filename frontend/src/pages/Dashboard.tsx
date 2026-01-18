import { useLanguage } from '../hooks/useLanguage';
import { useAuth } from '../hooks/useAuth';
import { Card } from '../components/shared/Card';

export function Dashboard() {
  const { t, isNepali } = useLanguage();
  const { user } = useAuth();

  return (
    <div className={`container mx-auto px-4 py-8 ${isNepali ? 'font-nepali' : ''}`}>
      <h1 className="text-3xl font-bold mb-6">{t('dashboard.title')}</h1>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <h2 className="text-xl font-semibold mb-4">{t('dashboard.profile')}</h2>
          <div className="space-y-2">
            <p><strong>{t('auth.name')}:</strong> {user?.name}</p>
            <p><strong>{t('auth.email')}:</strong> {user?.email}</p>
            {user?.phone && <p><strong>{t('auth.phone')}:</strong> {user.phone}</p>}
            <p><strong>Role:</strong> {user?.role}</p>
          </div>
        </Card>

        <Card>
          <h2 className="text-xl font-semibold mb-4">{t('dashboard.consultations')}</h2>
          <p className="text-gray-600">{isNepali ? 'कुनै परामर्श भेटिएन' : 'No consultations found'}</p>
        </Card>
      </div>
    </div>
  );
}
