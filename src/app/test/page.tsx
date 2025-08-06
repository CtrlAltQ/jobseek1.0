'use client'

export default function TestPage() {
  return (
    <div className="p-8 bg-blue-500 text-white">
      <h1 className="text-4xl font-bold">Test Page</h1>
      <p>If you can see this styled content, React and TailwindCSS are working!</p>
      <button 
        onClick={() => alert('JavaScript is working!')}
        className="mt-4 px-4 py-2 bg-green-500 rounded hover:bg-green-600"
      >
        Click me to test JavaScript
      </button>
    </div>
  )
}