import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx'
import ProfileUpdate from './pages/ProfileUpdate.jsx'

createRoot(document.getElementById('root')).render(
<BrowserRouter>
<ErrorBoundary>
 
 <App/>
</ErrorBoundary>
</BrowserRouter>
)


