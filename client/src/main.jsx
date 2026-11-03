import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import { DataProvider } from './DataContext.jsx'
import './styles.css'
createRoot(document.getElementById('root')).render(<BrowserRouter><DataProvider><App /></DataProvider></BrowserRouter>)
