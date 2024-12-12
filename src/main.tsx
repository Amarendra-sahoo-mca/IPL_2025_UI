import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import SmoothOverlapSlider from './hero'




createRoot(document.getElementById('root')!).render(
  // <StrictMode>
    <SmoothOverlapSlider />
  // </StrictMode>,
)
