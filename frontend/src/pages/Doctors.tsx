import { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';
import { doctorService } from '../services/doctor.service';
import { Card } from '../components/shared/Card';
import { Button } from '../components/shared/Button';
import { Loading } from '../components/shared/Loading';

export function Doctors() {
  const { t, isNepali } = useLanguage();
  const [doctors, setDoctors] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const data = await doctorService.getAllDoctors();
      setDoctors(data.doctors || []);
    } catch (error) {
      console.error('Failed to fetch doctors:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'AVAILABLE':
        return 'bg-green-500';
      case 'BUSY':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  if (isLoading) return <Loading />;

  return (
    <div className={`container mx-auto px-4 py-8 ${isNepali ? 'font-nepali' : ''}`}>
      <h1 className="text-3xl font-bold mb-6">{t('doctors.title')}</h1>

      <div className="mb-6">
        <input
          type="text"
          placeholder={t('doctors.search')}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
        />
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {doctors
          .filter((doctor) =>
            doctor.user.name.toLowerCase().includes(search.toLowerCase()) ||
            doctor.specialization.toLowerCase().includes(search.toLowerCase())
          )
          .map((doctor) => (
            <Card key={doctor.id} className="hover:shadow-lg transition-shadow">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center text-2xl font-bold text-gray-600">
                  {doctor.user.name.charAt(0)}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{doctor.user.name}</h3>
                  <p className="text-sm text-gray-600">{doctor.specialization}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <div className={`w-2 h-2 rounded-full ${getStatusColor(doctor.availabilityStatus)}`} />
                    <span className="text-xs text-gray-500">{t(`doctors.${doctor.availabilityStatus.toLowerCase()}`)}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-sm mb-4">
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  <span>{doctor.rating.toFixed(1)} ({doctor.totalConsultations} {isNepali ? 'परामर्श' : 'consultations'})</span>
                </div>
                <p className="text-gray-600">{doctor.experienceYears} {t('doctors.experience')}</p>
                <p className="font-semibold text-primary">NPR {doctor.consultationFee}</p>
              </div>

              <Button className="w-full" disabled={doctor.availabilityStatus !== 'AVAILABLE'}>
                {t('doctors.bookNow')}
              </Button>
            </Card>
          ))}
      </div>
    </div>
  );
}
