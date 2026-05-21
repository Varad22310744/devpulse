# DevPulse 🚀

> AI-powered developer productivity tracker that analyzes your GitHub activity and delivers weekly insights.

## Live Demo
- **Frontend:** [your-vercel-link]
- **Backend:** [your-render-link]

## Features

- 🔐 **GitHub OAuth** — one click login, no passwords
- 📊 **Activity Dashboard** — commits, streaks, active days, PRs
- 🟩 **Contribution Heatmap** — GitHub style activity grid
- 📈 **Commit Chart** — 30 day commit history line graph
- 🥧 **Language Breakdown** — pie chart of languages used
- 🏆 **Top Repos** — most active repositories ranked
- 🤖 **AI Weekly Report** — Gemini AI analyzes your week and generates productivity insights
- 📧 **Email Digest** — weekly report delivered to your inbox via Nodemailer
- ⏰ **Auto Fetch** — cron job fetches GitHub stats every night automatically

## Tech Stack

**Frontend**
- React.js, Chart.js, Recharts, TailwindCSS, Axios

**Backend**
- Node.js, Express.js, Passport.js, node-cron, Nodemailer

**Database**
- MongoDB Atlas, Mongoose

**APIs & Services**
- GitHub REST API — activity data
- Gemini AI API — weekly report generation
- Cloudinary — (extendable)
- Vercel — frontend deployment
- Render — backend deployment

## Architecture
User → GitHub OAuth → Passport.js → MongoDB
↓
Cron Job (11:59 PM daily)
↓
GitHub API → Stats saved
↓
Dashboard ← REST API ← MongoDB
↓
Gemini AI → Weekly Report
↓
Nodemailer → Email Digest

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB Atlas account
- GitHub OAuth App
- Gemini API key
- Gmail App Password

### Installation

**Clone repo**
```bash
git clone https://github.com/Varad22310744/devpulse
cd devpulse
```

**Backend setup**
```bash
cd server
npm install
cp .env.example .env
# fill in your .env values
node index.js
```

**Frontend setup**
```bash
cd client
npm install
npm run dev
```

### Environment Variables

Create `server/.env` using `server/.env.example`:
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
GITHUB_CALLBACK_URL=
MONGODB_URI=
JWT_SECRET=
GEMINI_API_KEY=
EMAIL_USER=
EMAIL_PASS=
CLIENT_URL=
PORT=

## API Endpoints
Auth:
GET  /api/auth/github           → GitHub OAuth login
GET  /api/auth/github/callback  → OAuth callback
GET  /api/auth/logout           → logout
GET  /api/auth/me               → current user
Stats:
GET  /api/stats/dashboard       → full dashboard data
GET  /api/stats/commits         → commit history
GET  /api/stats/languages       → language breakdown
POST /api/stats/fetch           → manual GitHub fetch
Report:
GET  /api/report/weekly         → AI weekly summary
POST /api/report/email          → send email digest

## Screenshots

> Add screenshots here after deployment

## Author

**Varad Bhatagalikar**
- GitHub: [@Varad22310744](https://github.com/Varad22310744)
- LinkedIn: [varad-bhatagalikar](https://linkedin.com/in/varad-bhatagalikar-66b692318)