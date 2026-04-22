import { createRoot } from 'react-dom/client'
import { Router } from './Router'
import './style.css'
import './pages.css'

const container = document.getElementById('app')
if (!container) throw new Error('Root element #app not found')
createRoot(container).render(<Router />)
