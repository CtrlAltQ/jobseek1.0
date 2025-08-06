# 🚀 AI Job Finder MVP - Jeremy Clegg

[![Vercel](https://img.shields.io/badge/Deploy-Vercel-000000?style=for-the-badge&logo=vercel)](https://vercel.com)
[![Next.js](https://img.shields.io/badge/Next.js-14-000000?style=for-the-badge&logo=nextdotjs)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react)](https://react.dev)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-3.3-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com)

> **Live Demo:** [🔗 https://jobseek1-0.vercel.app](https://jobseek1-0.vercel.app)

A modern, AI-powered job search dashboard built with Next.js 14, React, and TailwindCSS. This MVP showcases a professional job finder application with intelligent job matching and application tracking - perfect for demonstrating React/Next.js skills to potential employers.

![AI Job Finder Preview](https://via.placeholder.com/800x400/0f172a/60a5fa?text=AI+Job+Finder+Dashboard)

## ✨ Key Features

- **🤖 AI-Powered Job Matching** - Relevance scoring based on skills and preferences (70-96% range)
- **🔍 Smart Search & Filtering** - Real-time search by keywords, location, salary, and job type
- **📊 Application Tracking** - Visual status management (Not Applied → Applied → Interview → Rejected)
- **🎨 Professional Design** - Linear.app inspired dark theme with smooth animations
- **📱 Mobile-First Responsive** - Perfect experience on all devices
- **⚡ Performance Optimized** - Loading states, error boundaries, and smooth transitions
- **🔄 Interactive UI** - Hover effects, button animations, and staggered card loading

## 🛠 Tech Stack

- **Framework**: Next.js 14 with App Router
- **Frontend**: React 18, TypeScript
- **Styling**: TailwindCSS with custom dark theme
- **State Management**: React useState/useEffect
- **Data**: Mock job listings (18 realistic entries)

## 📊 Job Data

The MVP includes 18 carefully crafted job listings featuring:
- Frontend Developer positions (React, Next.js, TypeScript)
- Full-stack opportunities (Python, Node.js, APIs)
- Automation roles (matching Jeremy's automation expertise)
- Mix of remote and Nashville area positions
- Salary ranges from $60k-$100k
- Various experience levels (Entry, Junior, Mid-level)

## 🧠 AI Relevance Scoring

Each job is scored based on:
- **Skills Match** (40%): React, JavaScript, Python, Next.js, TailwindCSS
- **Location Preference** (15%): Remote preferred, Nashville area
- **Salary Alignment** (15%): Target range $65k+
- **Industry Match** (10%): Tech, AI, Automation, Startups
- **Experience Level** (10%): Junior to Mid-level roles
- **Job Recency** (10%): Recently posted positions

## 🎨 Design Features

- **Professional Hero Section**: Jeremy's profile with skills and quick stats
- **Smart Filter Bar**: Search, location, sorting with collapsible advanced filters
- **Job Cards**: Company logos, relevance scores, status badges, quick actions
- **Responsive Grid**: 1-3 columns based on screen size
- **Interactive Modals**: Detailed job view with application tracking
- **Loading States**: Skeleton screens for better UX
- **Empty States**: Helpful messaging when no results found

## 🚦 Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 🌐 Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_USERNAME/job-seek)

**Quick Deploy:**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Your app will be live at: https://job-seek-jeremy.vercel.app
```

**Or deploy via GitHub:**
1. Push to GitHub repository
2. Connect to Vercel
3. Auto-deploy on every commit

See [DEPLOY.md](./DEPLOY.md) for detailed deployment instructions.

## 📁 Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout with dark theme
│   ├── page.tsx            # Main dashboard page
│   ├── globals.css         # Global styles and Tailwind
│   └── api/
│       └── jobs/route.ts   # API endpoint for job data
├── components/
│   ├── HeroSection.tsx     # Profile header with stats
│   ├── FilterBar.tsx       # Search and filter controls
│   ├── JobCard.tsx         # Individual job listing
│   ├── JobGrid.tsx         # Grid container with loading states
│   └── JobDetail.tsx       # Modal for detailed job view
├── lib/
│   ├── mockJobs.ts         # Sample job data (18 entries)
│   ├── jobUtils.ts         # Filtering and utility functions
│   └── aiScoring.ts        # AI relevance scoring logic
└── types/
    └── job.ts              # TypeScript job interface
```

## 🎯 Key Components

### HeroSection
- Jeremy's professional profile
- Skills showcase with badges
- Application statistics dashboard
- Location and availability info

### JobCard
- Company branding placeholder
- Relevance score with color coding
- Status tracking with badges
- Quick action buttons
- Salary and location display

### FilterBar
- Real-time search input
- Location dropdown (Remote, Nashville, Both)
- Sort options (Relevance, Date, Salary, Company)
- Collapsible advanced filters
- Clear filters functionality

### JobDetail Modal
- Comprehensive job information
- AI relevance analysis with progress bar
- Application status management
- External link to original posting
- Requirements and tags display

## 🔮 Future Enhancements

This MVP provides a solid foundation for adding:

1. **Real Job Scraping**: Indeed, RemoteOK, LinkedIn APIs
2. **Advanced AI**: OpenAI integration for better job matching
3. **User Authentication**: Personal profiles and saved jobs
4. **Application Tracking**: Email integration and calendar sync
5. **Job Alerts**: Notifications for new relevant positions
6. **Analytics Dashboard**: Application success rates and insights
7. **Cover Letter Generator**: AI-powered personalized cover letters
8. **Interview Preparation**: Company research and question suggestions

## 🌟 Showcase Value

This project demonstrates key skills employers want to see:

### 🏗️ **Technical Skills**
- **Modern React/Next.js Development** - App Router, Server Components, Client Components
- **TypeScript Integration** - Type safety and professional development practices  
- **State Management** - React hooks, local state, and data flow
- **Component Architecture** - Reusable, maintainable component design
- **Responsive Design** - Mobile-first approach with TailwindCSS
- **Performance Optimization** - Loading states, lazy loading, error boundaries
- **API Development** - RESTful endpoints and data handling

### 🎨 **Design & UX Skills**
- **Professional UI Design** - Clean, modern interface inspired by Linear.app
- **Dark Theme Implementation** - Consistent color system and theming
- **Interactive Animations** - Smooth transitions and micro-interactions
- **Accessibility Considerations** - Semantic HTML and ARIA compliance
- **Mobile-First Responsive** - Perfect experience across all devices

### 🚀 **DevOps & Deployment**
- **Production Builds** - Optimized for performance and SEO
- **Deployment Ready** - Vercel integration and CI/CD setup
- **Version Control** - Git workflow and professional commit messages
- **Documentation** - Comprehensive README and deployment guides

**Perfect portfolio piece for job applications** - demonstrates full-stack capabilities, modern tooling, and production-ready development practices that employers value.

---

**Created by Jeremy Clegg**  
*Front-End Developer & Automation Specialist*  
Columbia, TN / Nashville Area