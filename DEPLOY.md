# Deployment Guide - AI Job Finder

## Quick Deploy to Vercel (Recommended)

### Method 1: Vercel CLI (Fastest)
```bash
# Install Vercel CLI if you don't have it
npm i -g vercel

# Deploy from your project directory
vercel

# Follow the prompts:
# - Set up and deploy? Y
# - Which scope? (select your account)
# - Link to existing project? N
# - Project name: job-seek-jeremy (or custom name)
# - Directory: ./ 
# - Override settings? N

# Your app will be live at: https://job-seek-jeremy.vercel.app
```

### Method 2: GitHub + Vercel (Most Common)
1. **Push to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit: AI Job Finder MVP"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/job-seek.git
   git push -u origin main
   ```

2. **Deploy via Vercel Dashboard:**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import from GitHub
   - Select your repository
   - Click "Deploy"

3. **Automatic Settings:**
   - Framework: Next.js (auto-detected)
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm install`

### Method 3: Direct Upload
1. Zip your project folder (exclude node_modules)
2. Go to vercel.com → New Project → Upload
3. Drop your zip file
4. Deploy

## Custom Domain (Optional)
After deployment:
1. Go to your project dashboard on Vercel
2. Click "Settings" → "Domains"
3. Add your custom domain
4. Follow DNS setup instructions

## Environment Variables (Future)
When you add real APIs later:
1. Go to Project Settings → Environment Variables
2. Add variables like:
   - `INDEED_API_KEY`
   - `OPENAI_API_KEY`
   - `DATABASE_URL`

## Post-Deployment Checklist
- [ ] Test all features work on live site
- [ ] Check mobile responsiveness
- [ ] Verify search and filtering
- [ ] Test job application status changes
- [ ] Confirm error boundaries work
- [ ] Add live URL to your resume/portfolio

## Typical Live URLs
- `https://job-seek-jeremy.vercel.app`
- `https://jeremy-clegg-jobs.vercel.app`
- `https://ai-job-finder-mvp.vercel.app`

Choose a professional URL that you can share with employers!