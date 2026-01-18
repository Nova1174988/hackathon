import { Link } from 'react-router-dom';
import { Stethoscope, Bot, Bell, ArrowRight } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';
import { Button } from '../components/shared/Button';
import { Card } from '../components/shared/Card';

export function Home() {
  const { t, isNepali } = useLanguage();

  const features = [
    {
      icon: Bot,
      title: t('nav.symptomChecker'),
      description: isNepali
        ? 'AI प्रविधिद्वारा लक्षण जाँच गर्नुहोस्'
        : 'Check your symptoms with AI technology',
      link: '/symptom-checker',
      color: 'bg-blue-500',
    },
    {
      icon: Stethoscope,
      title: t('nav.doctors'),
      description: isNepali
        ? 'योग्य डाक्टरहरूसँग अनलाइन परामर्श लिनुहोस्'
        : 'Consult with qualified doctors online',
      link: '/doctors',
      color: 'bg-green-500',
    },
    {
      icon: Bell,
      title: t('nav.announcements'),
      description: isNepali
        ? 'महत्वपूर्ण स्वास्थ्य समाचार प्राप्त गर्नुहोस्'
        : 'Stay updated with health news',
      link: '/announcements',
      color: 'bg-amber-500',
    },
  ];

  return (
    <div className={isNepali ? 'font-nepali' : ''}>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary to-green-600 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              {isNepali ? 'सबैको लागि, जताततै स्वास्थ्य सेवा' : 'Healthcare for Everyone, Everywhere'}
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-green-50">
              {isNepali
                ? 'धेरै कम इन्टरनेट भए पनि काम गर्छ'
                : 'Works even on slow connections'}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/symptom-checker">
                <Button size="lg" className="bg-white text-primary hover:bg-gray-100 w-full sm:w-auto">
                  {t('nav.symptomChecker')} <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link to="/doctors">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary w-full sm:w-auto">
                  {t('nav.doctors')}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Link key={index} to={feature.link}>
                <Card className="h-full hover:shadow-xl transition-shadow cursor-pointer">
                  <div className={`${feature.color} w-12 h-12 rounded-lg flex items-center justify-center mb-4`}>
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <h3 className="text-4xl font-bold text-primary mb-2">5+</h3>
              <p className="text-gray-600">{isNepali ? 'विशेषज्ञ डाक्टरहरू' : 'Expert Doctors'}</p>
            </div>
            <div>
              <h3 className="text-4xl font-bold text-primary mb-2">24/7</h3>
              <p className="text-gray-600">{isNepali ? 'उपलब्धता' : 'Availability'}</p>
            </div>
            <div>
              <h3 className="text-4xl font-bold text-primary mb-2">100%</h3>
              <p className="text-gray-600">{isNepali ? 'सुरक्षित र निजी' : 'Secure & Private'}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
