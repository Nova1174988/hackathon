import { useState } from 'react';
import { Send, AlertTriangle, RefreshCw } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';
import { symptomService } from '../services/symptom.service';
import { Button } from '../components/shared/Button';
import { Card } from '../components/shared/Card';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

export function SymptomChecker() {
  const { t, isNepali, language } = useLanguage();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: t('symptomChecker.symptoms'),
      sender: 'ai',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversation, setConversation] = useState({
    symptoms: '',
    duration: '',
    severity: '',
    medicalHistory: '',
    medications: '',
  });
  const [step, setStep] = useState(0);

  const questions = [
    'symptoms',
    'duration',
    'severity',
    'medicalHistory',
    'medications',
  ];

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);

    const currentField = questions[step];
    const updatedConversation = { ...conversation, [currentField]: input };
    setConversation(updatedConversation);

    setInput('');

    if (step < questions.length - 1) {
      // Ask next question
      setStep(step + 1);
      setTimeout(() => {
        const nextQuestion = questions[step + 1];
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: t(`symptomChecker.${nextQuestion}`),
          sender: 'ai',
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, aiMessage]);
      }, 500);
    } else {
      // Final step - analyze symptoms
      setIsLoading(true);
      try {
        const response = await symptomService.checkSymptoms({
          symptoms: updatedConversation.symptoms,
          duration: updatedConversation.duration,
          severity: parseInt(updatedConversation.severity) || 5,
          medicalHistory: updatedConversation.medicalHistory,
          medications: updatedConversation.medications,
          language: language.toUpperCase(),
        });

        const aiMessage: Message = {
          id: (Date.now() + 2).toString(),
          text: response.response,
          sender: 'ai',
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, aiMessage]);
      } catch (error: any) {
        const errorMessage: Message = {
          id: (Date.now() + 2).toString(),
          text: isNepali
            ? 'माफ गर्नुहोस्, त्रुटि भयो। कृपया पुन: प्रयास गर्नुहोस्।'
            : 'Sorry, an error occurred. Please try again.',
          sender: 'ai',
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, errorMessage]);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleStartOver = () => {
    setMessages([
      {
        id: '1',
        text: t('symptomChecker.symptoms'),
        sender: 'ai',
        timestamp: new Date(),
      },
    ]);
    setInput('');
    setStep(0);
    setConversation({
      symptoms: '',
      duration: '',
      severity: '',
      medicalHistory: '',
      medications: '',
    });
  };

  return (
    <div className={`container mx-auto px-4 py-8 ${isNepali ? 'font-nepali' : ''}`}>
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold mb-2">{t('symptomChecker.title')}</h1>
          <p className="text-gray-600">{t('symptomChecker.subtitle')}</p>
        </div>

        {/* Disclaimer */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-amber-800">{t('symptomChecker.disclaimer')}</p>
        </div>

        {/* Chat Container */}
        <Card className="h-[500px] flex flex-col">
          <div className="flex-1 overflow-y-auto space-y-4 mb-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] px-4 py-2 rounded-lg ${
                    message.sender === 'user'
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{message.text}</p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 px-4 py-2 rounded-lg">
                  <p className="text-gray-600">{t('symptomChecker.analyzing')}</p>
                  <div className="flex gap-1 mt-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="border-t pt-4 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder={t('symptomChecker.placeholder')}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
              disabled={isLoading}
            />
            <Button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="px-6"
            >
              <Send className="w-5 h-5" />
            </Button>
          </div>

          {step >= questions.length - 1 && (
            <Button
              onClick={handleStartOver}
              variant="outline"
              className="mt-4 w-full"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              {t('symptomChecker.startOver')}
            </Button>
          )}
        </Card>
      </div>
    </div>
  );
}
