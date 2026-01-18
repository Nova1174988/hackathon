# 🏥 Hamro Health - Telehealth Platform

A production-ready, low-bandwidth telehealth platform optimized for 2G/3G connections with multilingual support (English & Nepali).

## ✨ Features

- 🤖 **AI-Powered Symptom Checker** - Claude 3.5 Sonnet integration via OpenRouter
- 👨‍⚕️ **Live Doctor Consultation** - Real-time chat with qualified doctors
- 📢 **Health Announcements** - Important health news and alerts
- 🌐 **Multilingual Support** - English and Nepali (नेपाली)
- 📱 **PWA Support** - Works offline and installable
- ⚡ **Optimized for Low Bandwidth** - Works on 2G/3G connections
- 🔐 **Secure Authentication** - JWT-based auth with refresh tokens

## 🛠️ Tech Stack

### Frontend
- React 18.2 + TypeScript
- Vite (build tool)
- TailwindCSS (styling)
- Zustand (state management)
- React Router v6 (routing)
- Socket.io-client (real-time chat)
- React Hook Form (forms)
- i18next (internationalization)
- Lucide React (icons)

### Backend
- Node.js 20+ with Express
- TypeScript
- Prisma ORM
- PostgreSQL (database)
- Socket.io (WebSocket)
- JWT + bcrypt (authentication)
- Zod (validation)
- OpenRouter AI API (Claude 3.5 Sonnet)

## 📦 Installation

### Prerequisites
- Node.js 20+ LTS
- PostgreSQL 14+
- npm or yarn

### 1. Clone the repository
```bash
git clone <repository-url>
cd hamro-health
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env and add your database URL and secrets
# DATABASE_URL=postgresql://user:password@localhost:5432/hamrohealth
# JWT_SECRET=your-secret-key
# JWT_REFRESH_SECRET=your-refresh-secret
# OPENROUTER_API_KEY=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

# Generate Prisma client
npm run prisma:generate

# Run database migrations
npm run prisma:migrate

# Seed the database with sample data
npm run prisma:seed

# Start development server
npm run dev
```

Backend will run on `http://localhost:5000`

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env if needed (defaults should work)
# VITE_API_URL=http://localhost:5000
# VITE_SOCKET_URL=http://localhost:5000

# Start development server
npm run dev
```

Frontend will run on `http://localhost:5173`

## 🚀 Running the Application

### Development Mode

1. Start backend: `cd backend && npm run dev`
2. Start frontend: `cd frontend && npm run dev`
3. Open browser: `http://localhost:5173`

### Production Build

**Frontend:**
```bash
cd frontend
npm run build
# Build output in dist/
```

**Backend:**
```bash
cd backend
npm run build
npm start
```

## 👥 Test Credentials

After running the seed script, you can login with:

- **Admin:** admin@hamrohealth.com / Admin@123
- **Patient:** patient1@example.com / Patient@123
- **Doctor:** dr.rajesh@hamrohealth.com / Doctor@123

## 📚 API Documentation

### Authentication
- `POST /api/auth/signup` - Create new account
- `POST /api/auth/login` - Login
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - Logout

### Doctors
- `GET /api/doctors` - Get all doctors (with filters)
- `GET /api/doctors/:id` - Get doctor by ID
- `PATCH /api/doctors/profile` - Update doctor profile (auth required)
- `PATCH /api/doctors/availability` - Update availability (auth required)

### Consultations
- `POST /api/consultations` - Create consultation (auth required)
- `GET /api/consultations` - Get user consultations (auth required)
- `GET /api/consultations/:id` - Get consultation details (auth required)
- `PATCH /api/consultations/:id/status` - Update status (auth required)
- `POST /api/consultations/:id/rate` - Rate consultation (auth required)

### Announcements
- `GET /api/announcements` - Get all announcements (with filters)
- `GET /api/announcements/:id` - Get announcement by ID
- `POST /api/announcements` - Create announcement (admin only)
- `PATCH /api/announcements/:id` - Update announcement (admin only)
- `DELETE /api/announcements/:id` - Delete announcement (admin only)
- `POST /api/announcements/:id/share` - Increment share count

### Symptoms
- `POST /api/symptoms/check` - Check symptoms with AI
- `GET /api/symptoms/history` - Get symptom history (auth required)

## 🎨 Features Overview

### 1. AI Symptom Checker
- Multi-step conversation flow
- AI analysis using Claude 3.5 Sonnet
- Response caching for common symptoms
- Save conversation history (authenticated users)
- Works in both English and Nepali

### 2. Doctor Consultation
- Filter doctors by specialization, availability
- Real-time chat using Socket.io
- File upload support
- Doctor notes and prescription
- Rating and review system

### 3. Health Announcements
- Category-based filtering (Vaccination, Outbreak, General, Emergency)
- Priority levels (High, Medium, Low)
- Language-specific content
- Share functionality
- View tracking

### 4. Multilingual Support
- Instant language switching
- Persistent language preference
- Nepali (Devanagari) font support
- Complete UI translation

## 🔒 Security Features

- Password hashing with bcrypt
- JWT access tokens (15min expiry)
- Refresh tokens (7 days expiry)
- HTTP-only cookies
- CORS protection
- Rate limiting
- Input validation with Zod
- SQL injection prevention (Prisma)

## ⚡ Performance Optimizations

- Code splitting with React.lazy()
- Image lazy loading
- API response caching
- Service Worker (PWA)
- Compression middleware
- Database indexing
- Connection pooling
- Debounced search inputs

## 🌐 Deployment

### Frontend (Vercel)
```bash
cd frontend
npm run build
# Deploy dist/ folder to Vercel
```

### Backend (Railway/Render)
```bash
cd backend
# Set environment variables in Railway/Render dashboard
# Deploy from GitHub repository
```

### Environment Variables (Production)
- Set all variables from `.env.example`
- Use HTTPS URLs for CORS_ORIGIN
- Enable production mode: `NODE_ENV=production`

## 📱 PWA Features

- Installable on mobile devices
- Offline support for cached pages
- Background sync for messages
- Service Worker caching strategy
- Manifest.json configuration

## 🧪 Testing

```bash
# Backend (if tests are added)
cd backend
npm test

# Frontend (if tests are added)
cd frontend
npm test
```

## 📝 Database Schema

Key models:
- **User** - Patient/Doctor/Admin accounts
- **Doctor** - Doctor profiles and availability
- **Consultation** - Doctor-patient consultations
- **Message** - Real-time chat messages
- **Announcement** - Health announcements
- **SymptomCheck** - AI symptom check history

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License.

## 📞 Contact

For support or inquiries, please contact:
- Email: support@hamrohealth.com
- Website: https://hamrohealth.com

## 🙏 Acknowledgments

- OpenRouter for AI API access
- Claude 3.5 Sonnet by Anthropic
- Prisma for excellent ORM
- Tailwind CSS for utility-first styling
- Socket.io for real-time communication

---

Built with ❤️ for accessible healthcare
