import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import API from '../services/api'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import ProtectedRoute from '../components/ProtectedRoute'
import RichTextEditor from '../components/RichTextEditor'
import { useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { common, createLowlight } from "lowlight";
import { TextStyle } from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import EditorToolbar from "../components/EditorToolbar";
import {
  FiBold,
  FiItalic,
  FiUnderline,
  FiType,
  FiList,
  FiCode,
  FiRotateCcw,
  FiRotateCw,
} from "react-icons/fi";

import {
  MdFormatStrikethrough,
  MdFormatListNumbered,
} from "react-icons/md";

import { RiDoubleQuotesL } from "react-icons/ri";

const lowlight = createLowlight(common);

const NoteEditor = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEditing = Boolean(id)

  const [form, setForm] = useState({
    title: '',
    content: null,
    plainText: '',
    tags: [],
  })

  const [tagInput, setTagInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [saveStatus, setSaveStatus] = useState("Saved");
  const autoSaveTimer = useRef(null);
  const [fetchLoading, setFetchLoading] = useState(isEditing)
  const [loaded, setLoaded] = useState(false);
  const [currentNoteId, setCurrentNoteId] = useState(id);

  const editor = useEditor({
    extensions: [Underline, TaskList,
      StarterKit.configure({
        codeBlock: false,
      }),
      TextStyle,Color,
    TaskItem.configure({
        nested: true,
    }),
    CodeBlockLowlight.configure({
      lowlight,
    }),],

    content: '',

    onUpdate: ({ editor }) => {
      setForm(prev => ({
        ...prev,
        content: editor.getJSON(),
        plainText: editor.getText(),
      }))
    },
  })

  useEffect(() => {
    if (isEditing) {
      API.get(`/notes/getById/${id}`)
        .then((res) => {
          const { title, content, plainText, tags = [] } = res.data
          setForm({ title, content, plainText, tags })
          setLoaded(true);
        })
        .catch(() => toast.error('Failed to load note'))
        .finally(() => setFetchLoading(false))
    }
  }, [id, isEditing])

  useEffect(() => {
  if (
    editor &&
    isEditing &&
    form.content &&
    editor.isEmpty
  ) {
    editor.commands.setContent(form.content);
  }
}, [editor, isEditing, form.content]);

useEffect(() => {
  if (!isEditing) {
    setLoaded(true);
  }
}, [isEditing]);

useEffect(() => {
  if (!loaded) return;

  // Don't start autosave until a note is loaded
  if (!form.content) return;

  // Cancel previous timer
  if (autoSaveTimer.current) {
    clearTimeout(autoSaveTimer.current);
  }

  // Start a new 3-second timer
  autoSaveTimer.current = setTimeout(() => {
    autoSave();
  }, 3000);

  return () => {
    if (autoSaveTimer.current) {
      clearTimeout(autoSaveTimer.current);
    }
  };
}, [form,loaded]);

 

  const addTag = () => {
    const tag = tagInput.trim()

    if (!tag) return

    if (form.tags.includes(tag)) {
      toast.error('Tag already exists')
      return
    }

    setForm((prev) => ({
      ...prev,
      tags: [...prev.tags, tag],
    }))

    setTagInput('')
  }

  const removeTag = (tagToRemove) => {
    setForm((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }))
  }

const autoSave = async () => {
  try {
    setSaveStatus("Saving...");

    if (currentNoteId) {
      await API.put(`/notes/update/${currentNoteId}`, form);
    } else {
      const res = await API.post("/notes/create", form);

      setCurrentNoteId(res.data.note._id);

      navigate(`/edit/${res.data.note._id}`, { replace: true });
    }

    setSaveStatus("Saved");
  } catch {
    setSaveStatus("Failed");
  }
};

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (isEditing) {
        await API.put(`/notes/update/${id}`, form)
        toast.success('Note updated!')
        navigate(`/note/${id}`)
      } else {
        const res = await API.post('/notes/create', form)
        toast.success('Note created!')
        navigate(`/note/${res.data.note._id}`)
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Save failed')
    } finally {
      setLoading(false)
    }
  }

  if (fetchLoading) {
    return (
      <div className="flex justify-center mt-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <ProtectedRoute>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-[1600px] mx-auto px-6 py-2 "
      >
        <form onSubmit={handleSubmit}>
          <div className="h-[92vh] flex flex-col bg-gray-900/80 backdrop-blur-md border border-gray-700 rounded-3xl shadow-2xl shadow-blue-900/20 overflow-hidden">
            {/* Top Action Bar */}
            <div className="flex justify-between items-center p-5 border-b border-gray-800 bg-gray-900/95">
            
            <button
                type="button"
                onClick={() => navigate(-1)}
                className="px-5 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition"
              >
                Cancel
            </button>

            <EditorToolbar editor={editor}/>
              

              <button
                type="submit"
                disabled={loading}
                className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 transition font-medium disabled:opacity-50"
              >
                {loading ? "Saving..." : isEditing ? "Update" : "Create"}
              </button>
            </div>

            {/* Editor */}
            <div className="flex-1 overflow-y-auto p-8 md:p-10">
              {/* Title */}
              <input
                type="text"
                placeholder="Untitled"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="
                  w-full
                  bg-transparent
                  text-4xl
                  md:text-5xl
                  font-bold
                  text-white
                  outline-none
                  placeholder-gray-500
                  mb-6
                "
              />

              {/* Tags */}
              <div className="mb-8">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Add tag..."
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addTag();
                      }
                    }}
                    className="
                      px-4 py-2
                      bg-gray-800
                      border border-gray-700
                      rounded-full
                      text-sm
                      focus:outline-none
                      focus:ring-2
                      focus:ring-blue-500
                    "
                  />

                  <button
                    type="button"
                    onClick={addTag}
                    className="
                      px-4 py-2
                      bg-blue-600
                      hover:bg-blue-700
                      rounded-full
                      text-sm
                    "
                  >
                    Add
                  </button>
                </div>

                {form.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    {form.tags.map((tag) => (
                      <div
                        key={tag}
                        className="
                          flex items-center gap-2
                          px-3 py-1
                          bg-gray-800
                          border border-gray-700
                          rounded-full
                          text-blue-300
                          text-sm
                        "
                      >
                        <span>#{tag}</span>

                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="hover:text-red-400"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Content */}
              <RichTextEditor
                editor={editor}
              />
            </div>
          </div>
        </form>
      </motion.div>
    </ProtectedRoute>
  );
}

export default NoteEditor