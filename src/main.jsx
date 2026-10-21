import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './styles/base.css'
import './styles/chrome.css'
import './styles/home.css'
import './styles/pages.css'
import './styles/polish.css'
import App from './App'

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
    <App />
  </BrowserRouter>
)
