
import { useState, useEffect, useRef } from 'react'
import { useAuth } from '../contexts/AuthContext'
import API from '../services/api'
import NoteCard from '../components/NoteCard'
import NotePanel from '../components/NotePanel'  
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import { FiSearch, FiMessageCircle } from 'react-icons/fi'  

const Home = () => {
  const { user } = useAuth()
  const [notes, setNotes] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const controllerRef = useRef(null)

 
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [chatMessages, setChatMessages] = useState([])
  const [chatLoading, setChatLoading] = useState(false)

  const fetchNotes = async () => {
    try {
      const res = await API.get("/notes/getAll")
      setNotes(res.data)
      setSearchResults(res.data)
    } catch (err) {
      toast.error("Failed to fetch notes")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user) fetchNotes()
  }, [user])

  useEffect(() => {
    const query = searchTerm.trim()

    if (!query) {
      if (controllerRef.current) {
        controllerRef.current.abort()
      }
      setSearchResults(notes)
      return
    }

    const timeout = setTimeout(async () => {
      try {
        if (controllerRef.current) {
          controllerRef.current.abort()
        }
        controllerRef.current = new AbortController()

        const res = await API.post(
          "/notes/search",
          { query },
          { signal: controllerRef.current.signal }
        )
        setSearchResults(res.data)
      } catch (err) {
        if (err.name !== "CanceledError" && err.name !== "AbortError") {
          toast.error("Search failed")
        }
      }
    }, 400)

    return () => clearTimeout(timeout)
  }, [searchTerm, notes])

  const handleDelete = async (id) => {
    try {
      await API.delete(`/notes/delete/${id}`)
      setNotes(notes.filter((note) => note._id !== id))
      setSearchResults(prev => prev.filter(note => note._id !== id))
      toast.success('Note deleted')
    } catch (err) {
      toast.error('Delete failed')
    }
  }

  const handleSendMessage = async (question) => {
    if (!question.trim()) return

    const newMessages = [...chatMessages, { role: 'user', content: question }]
    setChatMessages(newMessages)
    setChatLoading(true)

    try {
      const res = await API.post("/notes/chat", { question })
      const answer = res.data
      setChatMessages([...newMessages, { role: 'assistant', content: answer }])
    } catch (err) {
      toast.error("AI response failed")
      setChatMessages([...newMessages, { role: 'assistant', content: "Sorry, I couldn't process that." }])
    } finally {
      setChatLoading(false)
    }
  }

  if (!user) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-20"
      >
        <h1 className="text-3xl font-bold mb-4">Welcome to AI Knowledge Base</h1>
        <p className="text-gray-400">Please login to see your notes.</p>
      </motion.div>
    )
  }

  return (
    <div className={`relative transition-all duration-300 ${isChatOpen ? 'lg:mr-[28rem]' : ''}`}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">My Notes</h2>
        <div className="flex items-center gap-3">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search notes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
            />
          </div>
          <button
            onClick={() => setIsChatOpen(true)}
            className="p-2 rounded-lg bg-gray-800 border border-gray-700 hover:bg-gray-700 text-gray-400 hover:text-white transition-colors"
            title="AI Chat"
          >
            <FiMessageCircle className="text-xl" />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center mt-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : searchResults.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-16 text-gray-500"
        >
          {searchTerm ? 'No notes match your search.' : 'No notes yet. Create your first one!'}
        </motion.div>
      ) : (
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence>
            {searchResults.map((note) => (
              <NoteCard key={note._id} note={note} onDelete={handleDelete} />
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Chat Panel */}
      <NotePanel
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        messages={chatMessages}
        onSend={handleSendMessage}
        loading={chatLoading}
      />
    </div>
  )
}

export default Home




