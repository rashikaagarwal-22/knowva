// import { EditorContent, useEditor } from '@tiptap/react'
// import StarterKit from '@tiptap/starter-kit'
// import { useEffect } from 'react'

// export default function RichTextEditor({
//   content,
//   onChange
// }) {
//   const editor = useEditor({
//     extensions: [StarterKit],
//     content: content || '',
//     onUpdate: ({ editor }) => {
//       onChange({
//         content: editor.getJSON(),
//         plainText: editor.getText(),
//       })
//     },
//   })

//   useEffect(() => {
//     if (editor && content) {
//       editor.commands.setContent(content)
//     }
//   }, [content])

//   if (!editor) return null

//   return (
//     <>
//       <div className="flex gap-2 mb-4">
//         <button
//           type="button"
//           onClick={() =>
//             editor.chain().focus().toggleBold().run()
//           }
//         >
//           Bold
//         </button>

//         <button
//           type="button"
//           onClick={() =>
//             editor.chain().focus().toggleItalic().run()
//           }
//         >
//           Italic
//         </button>

//         <button
//           type="button"
//           onClick={() =>
//             editor.chain().focus().toggleBulletList().run()
//           }
//         >
//           List
//         </button>
//       </div>

//       <EditorContent
//         editor={editor}
//         className="text-gray-300 min-h-[500px] outline-none"
//       />
//     </>
//   )
// }



import { EditorContent } from '@tiptap/react'

export default function RichTextEditor({ editor }) {
  if (!editor) return null

  return (
    <div className="py-2">
      <EditorContent
        editor={editor}
        className="
          min-h-[400px]
          text-lg
          leading-8
          text-gray-300
        "
      />
    </div>
  )
}