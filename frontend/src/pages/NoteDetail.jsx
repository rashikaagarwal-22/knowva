import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import API from '../services/api'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { FiEdit2, FiTrash2, FiArrowLeft } from 'react-icons/fi'
import ProtectedRoute from '../components/ProtectedRoute'
import { generateHTML } from '@tiptap/html'
import StarterKit from '@tiptap/starter-kit'
import Underline from "@tiptap/extension-underline";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { common, createLowlight } from "lowlight";
import { TextStyle } from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";

const lowlight = createLowlight(common);

const NoteDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [note, setNote] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      API.get(`/notes/getById/${id}`)
        .then((res) => setNote(res.data))
        .catch(() => toast.error('Note not found'))
        .finally(() => setLoading(false))
    }
  }, [id, user])

  const handleDelete = async () => {
    if (!window.confirm('Delete this note?')) return

    try {
      await API.delete(`/notes/delete/${id}`)
      toast.success('Note deleted')
      navigate('/')
    } catch (err) {
      toast.error('Delete failed')
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center mt-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (!note) {
    return (
      <div className="text-center py-20 text-gray-400">
        Note not found.
        <Link to="/" className="text-blue-400 ml-2">
          Go home
        </Link>
      </div>
    )
  }

  const htmlContent = note?.content
  ? generateHTML(note.content, [
      StarterKit.configure({
        codeBlock: false,
      }),
      Underline,
      TextStyle,
      Color,
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
      CodeBlockLowlight.configure({
        lowlight,
      }),
    ])
  : '';

  return (
    <ProtectedRoute>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl mx-auto"
      >
        <div className="flex justify-between items-center mb-6">
          <Link
            to="/"
            className="text-gray-400 hover:text-white flex items-center gap-1"
          >
            <FiArrowLeft /> Back
          </Link>

          <div className="flex gap-3">
            <Link
              to={`/edit/${note._id}`}
              className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg flex items-center gap-1"
            >
              <FiEdit2 /> Edit
            </Link>

            <button
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-1"
            >
              <FiTrash2 /> Delete
            </button>
          </div>
        </div>

        <h1 className="text-3xl font-bold text-blue-300 mb-4">
          {note.title}
        </h1>

        {note.tags?.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {note.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-gray-700 border border-gray-600 text-blue-300 text-sm rounded-full"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        <p className="text-gray-500 text-sm mb-6">
          Last updated: {new Date(note.updatedAt).toLocaleString()}
        </p>

        <div
          className="bg-gray-800 border border-gray-700 rounded-xl p-6  tiptap-content"
          dangerouslySetInnerHTML={{
            __html: htmlContent,
          }}
        />
      </motion.div>
    </ProtectedRoute>
  )
}

export default NoteDetail