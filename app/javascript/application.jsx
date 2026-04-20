import React from 'react'
import { createRoot } from 'react-dom/client'
import BoardApp from './pages/Board/BoardApp'
import './application.css'

const root = createRoot(document.getElementById('app'))
root.render(<BoardApp />)
