import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import VDartDeliveryHomepage from './HomePage.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <VDartDeliveryHomepage />
  </StrictMode>,
)
