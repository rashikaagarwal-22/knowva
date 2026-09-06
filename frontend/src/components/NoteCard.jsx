import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiEdit2, FiTrash2 } from 'react-icons/fi'

const NoteCard = ({ note, onDelete }) => {
  // Truncate content for preview
  const preview = note.plainText?.length > 100 ? note.plainText.substring(0, 100) + '...' : note.plainText;

  const handleDelete = (e) => {
    e.preventDefault()
    if (window.confirm('Are you sure you want to delete this note?')) {
      onDelete(note._id)
    }
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ scale: 1.02 }}
      className="bg-gray-800 rounded-xl p-5 shadow-lg border border-gray-700 flex flex-col justify-between"
    >
      <Link to={`/note/${note._id}`} className="block h-full">
        <h3 className="text-xl font-semibold text-blue-300 mb-2">{note.title}</h3>
        <p className="text-gray-400 text-sm flex-grow">{preview || 'No content'}</p>
        <p className="text-gray-400 text-sm flex-grow">Tags: {note.tags.join(' | ') || 'No content'}</p>
        <div className="flex justify-between items-center mt-4 text-xs text-gray-500">
          <span>Updated: {new Date(note.updatedAt).toLocaleDateString()}</span>
          <div className="flex gap-2" onClick={(e) => e.preventDefault()}>
            <Link
              to={`/edit/${note._id}`}
              className="text-yellow-400 hover:text-yellow-300 p-1"
              title="Edit"
            >
              <FiEdit2 />
            </Link>
            <button
              onClick={handleDelete}
              className="text-red-400 hover:text-red-300 p-1"
              title="Delete"
            >
              <FiTrash2 />
            </button>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

export default NoteCard