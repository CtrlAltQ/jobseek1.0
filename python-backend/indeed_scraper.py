"""
Indeed RSS feed scraper for real job data
"""

import requests
import xml.etree.ElementTree as ET
from datetime import datetime
import uuid
import re

def scrape_indeed_jobs(search_term="developer", location="remote", limit=20):
    """Scrape jobs from Indeed RSS feeds"""
    try:
        # Indeed RSS feed URLs
        search_query = search_term.replace(' ', '+')
        location_query = location.replace(' ', '+')
        
        base_urls = [
            f"https://rss.indeed.com/rss?q={search_query}&l={location_query}",
            f"https://rss.indeed.com/rss?q=react+developer&l=remote",
            f"https://rss.indeed.com/rss?q=frontend+developer&l=remote",
            f"https://rss.indeed.com/rss?q=javascript+developer&l=remote"
        ]
        
        all_jobs = []
        
        for url in base_urls[:2]:  # Try first 2 URLs to avoid rate limits
            print(f"Fetching Indeed RSS: {url}")
            
            headers = {
                'User-Agent': 'JobSeek/1.0 RSS Reader',
                'Accept': 'application/rss+xml, application/xml, text/xml'
            }
            
            try:
                response = requests.get(url, headers=headers, timeout=10)
                if response.status_code != 200:
                    print(f"Indeed RSS error: {response.status_code}")
                    continue
                
                # Parse XML
                root = ET.fromstring(response.content)
                
                # Find all job items
                items = root.findall('.//item')
                print(f"Found {len(items)} jobs in Indeed RSS")
                
                for item in items:
                    if len(all_jobs) >= limit:
                        break
                        
                    title = item.find('title')
                    title_text = title.text if title is not None else 'Developer'
                    
                    description = item.find('description')
                    description_text = description.text if description is not None else ''
                    
                    link = item.find('link')
                    link_url = link.text if link is not None else '#'
                    
                    pub_date = item.find('pubDate')
                    pub_date_text = pub_date.text if pub_date is not None else ''
                    
                    # Extract company name from title (format: "Job Title at Company Name")
                    company_match = re.search(r' at (.+?)(?:$| - | in )', title_text)
                    company = company_match.group(1) if company_match else 'Company'
                    
                    # Clean up job title (remove "at Company" part)
                    clean_title = re.sub(r' at .+', '', title_text)
                    
                    # Extract location from description or use search location
                    location_match = re.search(r'Location: ([^<\n]+)', description_text)
                    job_location = location_match.group(1).strip() if location_match else location.title()
                    
                    # Determine if remote
                    is_remote = 'remote' in job_location.lower() or 'remote' in description_text.lower()
                    
                    job = {
                        "id": str(uuid.uuid4()),
                        "title": clean_title.strip(),
                        "company": company.strip(),
                        "location": "Remote" if is_remote else job_location,
                        "salary": extract_salary_from_description(description_text),
                        "postedDate": parse_indeed_date(pub_date_text),
                        "source": "Indeed",
                        "description": clean_html_description(description_text)[:500],
                        "requirements": extract_skills_from_description(description_text),
                        "isRemote": is_remote,
                        "relevanceScore": calculate_indeed_relevance(title_text, description_text, search_term),
                        "applicationStatus": "not_applied",
                        "tags": extract_job_tags(title_text, description_text),
                        "url": link_url
                    }
                    
                    all_jobs.append(job)
                    
            except ET.ParseError as e:
                print(f"XML parse error for {url}: {e}")
                continue
            except Exception as e:
                print(f"Error fetching {url}: {e}")
                continue
        
        print(f"Total Indeed jobs found: {len(all_jobs)}")
        return all_jobs[:limit]
        
    except Exception as e:
        print(f"Indeed scraping error: {e}")
        return []

def extract_salary_from_description(description):
    """Extract salary information from job description"""
    # Look for salary patterns
    salary_patterns = [
        r'\$(\d{2,3}),?(\d{3})\s*-\s*\$(\d{2,3}),?(\d{3})',  # $80,000 - $120,000
        r'\$(\d{2,3})k\s*-\s*\$(\d{2,3})k',                   # $80k - $120k
        r'(\d{2,3}),?(\d{3})\s*-\s*(\d{2,3}),?(\d{3})',      # 80,000 - 120,000
        r'\$(\d{2,3}),?(\d{3})',                              # $80,000
    ]
    
    for pattern in salary_patterns:
        match = re.search(pattern, description, re.IGNORECASE)
        if match:
            return match.group(0)
    
    return "Salary not specified"

def clean_html_description(description):
    """Clean HTML tags from description"""
    # Remove HTML tags
    clean_text = re.sub(r'<[^>]+>', '', description)
    # Clean up extra whitespace
    clean_text = ' '.join(clean_text.split())
    return clean_text

def extract_skills_from_description(description):
    """Extract technical skills from job description"""
    skills = [
        'React', 'JavaScript', 'TypeScript', 'Python', 'Node.js', 'Next.js',
        'HTML', 'CSS', 'Vue', 'Angular', 'AWS', 'Docker', 'Git', 'SQL',
        'MongoDB', 'PostgreSQL', 'Redis', 'GraphQL', 'REST', 'API'
    ]
    
    found_skills = []
    description_lower = description.lower()
    
    for skill in skills:
        if skill.lower() in description_lower:
            found_skills.append(skill)
    
    return found_skills[:8]  # Limit to 8 skills

def extract_job_tags(title, description):
    """Extract job tags from title and description"""
    tags = []
    
    text = (title + ' ' + description).lower()
    
    # Experience level
    if any(word in text for word in ['senior', 'sr.', 'lead']):
        tags.append('Senior')
    elif any(word in text for word in ['junior', 'jr.', 'entry']):
        tags.append('Junior')
    else:
        tags.append('Mid-Level')
    
    # Job type
    if any(word in text for word in ['full time', 'full-time', 'permanent']):
        tags.append('Full-Time')
    elif any(word in text for word in ['part time', 'part-time']):
        tags.append('Part-Time')
    elif any(word in text for word in ['contract', 'contractor', 'freelance']):
        tags.append('Contract')
    
    # Remote
    if 'remote' in text:
        tags.append('Remote')
    
    return tags

def parse_indeed_date(date_string):
    """Parse Indeed RSS date format"""
    try:
        # Indeed uses RFC 2822 format: "Wed, 06 Aug 2025 12:00:00 GMT"
        dt = datetime.strptime(date_string, '%a, %d %b %Y %H:%M:%S %Z')
        return dt.isoformat()
    except:
        return datetime.now().isoformat()

def calculate_indeed_relevance(title, description, search_term):
    """Calculate job relevance score"""
    score = 60  # Base score
    
    title_lower = title.lower()
    description_lower = description.lower()
    search_lower = search_term.lower()
    
    # Search term in title
    if search_lower in title_lower:
        score += 20
    
    # Search term in description
    if search_lower in description_lower:
        score += 10
    
    # Tech skills
    tech_skills = ['react', 'javascript', 'typescript', 'python', 'node.js']
    for skill in tech_skills:
        if skill in title_lower or skill in description_lower:
            score += 3
    
    # Remote bonus
    if 'remote' in title_lower or 'remote' in description_lower:
        score += 8
    
    return min(95, score)

if __name__ == "__main__":
    # Test the scraper
    jobs = scrape_indeed_jobs("react developer", "remote", 5)
    print(f"Found {len(jobs)} Indeed jobs")
    
    if jobs:
        import json
        print(json.dumps(jobs[0], indent=2))