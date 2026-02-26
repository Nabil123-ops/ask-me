import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'

/**
 * Ask Me — Premium AI Assistant
 * React 18 entry point using the new createRoot API
 */

const container = document.getElementById('root')

if (!container) {
  throw new Error(
    '[Ask Me] Root element #root not found. Check your index.html.'
  )
}

const root = createRoot(container)

root.render(
  <StrictMode>
    <App />
  </StrictMode>
)
