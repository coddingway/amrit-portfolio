import { createBrowserRouter } from 'react-router-dom'
import Layout from './components/Layout'
import Landing from './pages/Landing'
import About from './pages/About'
import Work from './pages/Work'
import WorkDetail from './pages/WorkDetail'
import Football from './pages/Football'
import ContactPage from './pages/ContactPage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true,          element: <Landing /> },
      { path: 'about',        element: <About /> },
      { path: 'work',         element: <Work /> },
      { path: 'work/:slug',   element: <WorkDetail /> },
      { path: 'football',     element: <Football /> },
      { path: 'contact',      element: <ContactPage /> },
    ],
  },
])
