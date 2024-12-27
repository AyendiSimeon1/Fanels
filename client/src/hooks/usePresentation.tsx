import { useState, useEffect } from 'react'

export interface Template {
  id: string
  name: string
  description: string
  category: 'business' | 'educational' | 'creative'
  thumbnailUrl: string
  promptSuggestions: string[]
}

interface PresentationState {
  selectedTemplate: Template | null
  prompt: string
  generating: boolean
  recentPresentations: Array<{
    id: string
    name: string
    createdAt: Date
    template: string
    status: 'completed' | 'failed' | 'generating'
  }>
}

export const usePresentation = () => {
  const [state, setState] = useState<PresentationState>({
    selectedTemplate: null,
    prompt: '',
    generating: false,
    recentPresentations: []
  })

  const [templates, setTemplates] = useState<Template[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Simulate fetching templates
    const fetchTemplates = async () => {
      try {
        setLoading(true)
        // Mock data - replace with actual API call
        const mockTemplates: Template[] = [
          {
            id: '1',
            name: 'Business Pitch',
            description: 'Professional template for startup pitches',
            category: 'business',
            thumbnailUrl: '/api/placeholder/300/200',
            promptSuggestions: [
              'Create a pitch deck for a sustainable tech startup',
              'Generate an investor presentation for a SaaS product'
            ]
          },
          {
            id: '2',
            name: 'Educational Course',
            description: 'Perfect for course materials and lectures',
            category: 'educational',
            thumbnailUrl: '/api/placeholder/300/200',
            promptSuggestions: [
              'Create a presentation about machine learning basics',
              'Generate slides for a history lesson'
            ]
          }
        ]
        setTemplates(mockTemplates)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch templates')
      } finally {
        setLoading(false)
      }
    }

    fetchTemplates()
  }, [])

  const generatePresentation = async (template: Template, prompt: string) => {
    setState(prev => ({ ...prev, generating: true }))
    try {
      // Simulate API call to AI service
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const newPresentation = {
        id: Math.random().toString(36).substr(2, 9),
        name: prompt.slice(0, 30) + '...',
        createdAt: new Date(),
        template: template.name,
        status: 'completed' as const
      }

      setState(prev => ({
        ...prev,
        generating: false,
        recentPresentations: [newPresentation, ...prev.recentPresentations]
      }))

      return newPresentation
    } catch (err) {
      setError('Failed to generate presentation')
      setState(prev => ({ ...prev, generating: false }))
      throw err
    }
  }

  return {
    ...state,
    templates,
    loading,
    error,
    setSelectedTemplate: (template: Template | null) => 
      setState(prev => ({ ...prev, selectedTemplate: template })),
    setPrompt: (prompt: string) => 
      setState(prev => ({ ...prev, prompt })),
    generatePresentation
  }
}