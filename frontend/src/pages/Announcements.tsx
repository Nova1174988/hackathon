import { useState, useEffect } from 'react';
import { Calendar, Eye, Share2 } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';
import { announcementService } from '../services/announcement.service';
import { Card } from '../components/shared/Card';
import { Loading } from '../components/shared/Loading';
import { format } from 'date-fns';

export function Announcements() {
  const { t, isNepali, language } = useLanguage();
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchAnnouncements();
  }, [language]);

  const fetchAnnouncements = async () => {
    try {
      const data = await announcementService.getAllAnnouncements({
        language: language.toUpperCase(),
      });
      setAnnouncements(data.announcements || []);
    } catch (error) {
      console.error('Failed to fetch announcements:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'HIGH':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'MEDIUM':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'EMERGENCY':
        return 'bg-red-500';
      case 'OUTBREAK':
        return 'bg-orange-500';
      case 'VACCINATION':
        return 'bg-blue-500';
      default:
        return 'bg-green-500';
    }
  };

  const handleShare = async (id: string) => {
    await announcementService.incrementShares(id);
    if (navigator.share) {
      navigator.share({
        title: 'Hamro Health',
        text: 'Check this health announcement',
        url: window.location.href,
      });
    }
  };

  if (isLoading) return <Loading />;

  return (
    <div className={`container mx-auto px-4 py-8 ${isNepali ? 'font-nepali' : ''}`}>
      <h1 className="text-3xl font-bold mb-6">{t('announcements.title')}</h1>

      <div className="mb-6">
        <input
          type="text"
          placeholder={t('announcements.search')}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
        />
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {announcements
          .filter((announcement) =>
            announcement.title.toLowerCase().includes(search.toLowerCase()) ||
            announcement.content.toLowerCase().includes(search.toLowerCase())
          )
          .map((announcement) => (
            <Card key={announcement.id} className="flex flex-col">
              <div className="flex items-center gap-2 mb-3">
                <span className={`px-2 py-1 rounded text-xs font-medium border ${getPriorityColor(announcement.priority)}`}>
                  {t(`announcements.priority.${announcement.priority.toLowerCase()}`)}
                </span>
                <span className={`px-2 py-1 rounded text-xs font-medium text-white ${getCategoryColor(announcement.category)}`}>
                  {t(`announcements.${announcement.category.toLowerCase()}`)}
                </span>
              </div>

              <h3 className="font-semibold text-lg mb-2">{announcement.title}</h3>
              <p className="text-gray-600 text-sm mb-4 flex-1 line-clamp-3">
                {announcement.content}
              </p>

              <div className="flex items-center justify-between text-xs text-gray-500 pt-4 border-t">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {format(new Date(announcement.publishedAt), 'MMM d, yyyy')}
                  </div>
                  <div className="flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    {announcement.views}
                  </div>
                </div>
                <button
                  onClick={() => handleShare(announcement.id)}
                  className="flex items-center gap-1 hover:text-primary transition"
                >
                  <Share2 className="w-3 h-3" />
                  {t('announcements.share')}
                </button>
              </div>
            </Card>
          ))}
      </div>
    </div>
  );
}
