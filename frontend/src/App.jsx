import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import NoteDetail from './pages/NoteDetail'
import NoteEditor from './pages/NoteEditor'
import { Toaster } from 'react-hot-toast'

function AppContent() {
  const location = useLocation()

  const hideNavbar =
    location.pathname === '/new' ||
    location.pathname.startsWith('/edit/')

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      {!hideNavbar && <Navbar />}

      <main
        className={
          hideNavbar
            ? 'px-4 py-4'
            : 'container mx-auto px-4 py-8'
        }
      >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/note/:id" element={<NoteDetail />} />
          <Route path="/new" element={<NoteEditor />} />
          <Route path="/edit/:id" element={<NoteEditor />} />
        </Routes>
      </main>

      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#1f2937',
            color: '#f3f4f6',
            border: '1px solid #374151',
          },
        }}
      />
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  )
}

export default App