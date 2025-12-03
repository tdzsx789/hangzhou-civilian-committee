import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './app.tsx'

const rootElement = document.getElementById('app')
if (rootElement) {
  createRoot(rootElement).render(<App />)
} else {
  console.error('Failed to find the root element')
}
