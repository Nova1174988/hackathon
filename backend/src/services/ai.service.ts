import axios from 'axios';
import { logger } from '../utils/logger.utils.js';

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || '';
const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';

interface SymptomInput {
  symptoms: string;
  duration: string;
  severity: number;
  medicalHistory?: string;
  medications?: string;
  language: string;
}

const createPrompt = (input: SymptomInput): string => {
  const lang = input.language === 'NEPALI' ? 'Nepali (नेपाली)' : 'English';
  
  return `You are a helpful medical assistant for Hamro Health, a telehealth platform in Nepal.

User Information:
- Symptoms: ${input.symptoms}
- Duration: ${input.duration}
- Severity (1-10): ${input.severity}
- Medical History: ${input.medicalHistory || 'None provided'}
- Current Medications: ${input.medications || 'None provided'}
- Language: ${lang}

Provide a clear, concise response in ${lang} with:
1. Top 3 possible conditions (in order of likelihood)
2. Severity assessment (Low/Medium/High)
3. Recommended next steps
4. When to seek immediate medical care
5. General health tips

Keep response under 200 words. Always include disclaimer that this is not a diagnosis.`;
};

export const analyzeSymptoms = async (input: SymptomInput): Promise<string> => {
  try {
    const response = await axios.post(
      OPENROUTER_URL,
      {
        model: 'anthropic/claude-3.5-sonnet',
        messages: [
          {
            role: 'user',
            content: createPrompt(input),
          },
        ],
        max_tokens: 500,
        temperature: 0.7,
      },
      {
        headers: {
          Authorization: `Bearer ${OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://hamrohealth.com',
          'X-Title': 'Hamro Health',
        },
        timeout: 30000,
      }
    );

    return response.data.choices[0].message.content;
  } catch (error: any) {
    logger.error('AI Service Error:', error.message);
    
    // Fallback response
    const fallback = input.language === 'NEPALI' 
      ? `माफ गर्नुहोस्, हाम्रो AI सेवा अहिले उपलब्ध छैन। कृपया डाक्टरसँग परामर्श लिनुहोस्।

यो चिकित्सा निदान होइन। गम्भीर लक्षणहरूको लागि तुरुन्त चिकित्सा सहायता लिनुहोस्।`
      : `Sorry, our AI service is currently unavailable. Please consult with a doctor directly.

This is not a medical diagnosis. For severe symptoms, seek immediate medical attention.`;
    
    return fallback;
  }
};

// Simple cache for common responses
const responseCache = new Map<string, { response: string; timestamp: number }>();
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

export const getCachedOrAnalyze = async (input: SymptomInput): Promise<string> => {
  const cacheKey = `${input.symptoms}-${input.duration}-${input.severity}`;
  const cached = responseCache.get(cacheKey);
  
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    logger.info('Returning cached AI response');
    return cached.response;
  }
  
  const response = await analyzeSymptoms(input);
  responseCache.set(cacheKey, { response, timestamp: Date.now() });
  
  return response;
};
