'use client'

export default function HeroSection() {
  const skills = [
    'React', 'Next.js', 'Python', 'TailwindCSS', 'AI Integration',
    'JavaScript', 'TypeScript', 'Automation', 'Node.js'
  ];

  return (
    <div className="bg-gray-800 border-b border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mx-auto mb-6 flex items-center justify-center">
            <span className="text-2xl font-bold text-white">JC</span>
          </div>
          
          <h1 className="text-4xl font-bold text-gray-100 mb-2">
            Jeremy Clegg
          </h1>
          
          <p className="text-xl text-gray-400 mb-4">
            Front-End Developer & Automation Specialist
          </p>
          
          <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
            Columbia, TN / Nashville Area • Looking for opportunities in React, Next.js, and AI integration
          </p>
          
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {skills.map((skill) => (
              <span
                key={skill}
                className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm border border-blue-500/30 hover:bg-blue-500/30 transition-colors"
              >
                {skill}
              </span>
            ))}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400 mb-1">18</div>
              <div className="text-gray-400 text-sm">Jobs Found</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400 mb-1">3</div>
              <div className="text-gray-400 text-sm">Applications Sent</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-400 mb-1">1</div>
              <div className="text-gray-400 text-sm">Interviews Scheduled</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}