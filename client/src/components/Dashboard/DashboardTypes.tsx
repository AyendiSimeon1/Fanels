'use client'

import { useState } from 'react'
// import { Card } from '@/components/ui/card'
import { usePresentation, Template } from '@/hooks/usePresentation'
import { Wand2, File, Clock, AlertCircle } from 'lucide-react'

export function DashboardView() {
  const {
    templates,
    selectedTemplate,
    prompt,
    generating,
    recentPresentations,
    loading,
    error,
    setSelectedTemplate,
    setPrompt,
    generatePresentation
  } = usePresentation()

  const handleGenerate = async () => {
    if (!selectedTemplate || !prompt) return
    try {
      await generatePresentation(selectedTemplate, prompt)
    } catch (err) {
      // Error is handled in the hook
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center h-96">Loading templates...</div>
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">AI Presentation Generator</h1>
        <button 
          className="inline-flex items-center justify-center rounded-md bg-[#27AE60] px-4 py-2 text-sm font-medium text-white hover:bg-[#219653] focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
          onClick={handleGenerate}
          disabled={!selectedTemplate || !prompt || generating}
        >
          {generating ? 'Generating...' : 'Generate Presentation'}
          <Wand2 className="ml-2 h-4 w-4" />
        </button>
      </div>

      {/* Template Selection */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {templates.map((template) => (
          <div 
            key={template.id}
            className={`cursor-pointer transition-all hover:shadow-lg ${
              selectedTemplate?.id === template.id ? 'ring-2 ring-[#27AE60]' : ''
            }`}
            onClick={() => setSelectedTemplate(template)}
          >
            <div className="p-4">
              <img 
                src={template.thumbnailUrl} 
                alt={template.name}
                className="w-full h-40 object-cover rounded-md mb-4"
              />
              <h3 className="font-semibold text-lg">{template.name}</h3>
              <p className="text-sm text-gray-500">{template.description}</p>
              <div className="mt-4">
                <span className="inline-flex items-center rounded-full bg-[#27AE60] bg-opacity-10 px-2.5 py-0.5 text-xs font-medium text-[#27AE60]">
                  {template.category}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Prompt Input */}
      <div className="p-6">
        <h3 className="text-lg font-semibold mb-4">Presentation Prompt</h3>
        <textarea
          className="w-full h-32 p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#27AE60]"
          placeholder="Describe the presentation you want to generate..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          disabled={generating}
        />
        {selectedTemplate && (
          <div className="mt-4">
            <h4 className="text-sm font-medium mb-2">Suggested prompts:</h4>
            <div className="flex flex-wrap gap-2">
              {selectedTemplate.promptSuggestions.map((suggestion, index) => (
                <button
                  key={index}
                  className="text-sm px-3 py-1 bg-gray-100 rounded-full hover:bg-gray-200"
                  onClick={() => setPrompt(suggestion)}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Recent Generations */}
      <div className="p-6">
        <h3 className="text-lg font-semibold mb-4">Recent Presentations</h3>
        <div className="space-y-4">
          {recentPresentations.map((presentation) => (
            <div 
              key={presentation.id}
              className="flex items-center justify-between p-4 border rounded-lg"
            >
              <div className="flex items-center gap-4">
                <File className="h-6 w-6 text-[#27AE60]" />
                <div>
                  <h4 className="font-medium">{presentation.name}</h4>
                  <p className="text-sm text-gray-500">
                    {presentation.template} • {presentation.createdAt.toLocaleDateString()}
                  </p>
                </div>
              </div>
              <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                presentation.status === 'completed' 
                  ? 'bg-green-100 text-green-800'
                  : presentation.status === 'generating'
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-red-100 text-red-800'
              }`}>
                {presentation.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}