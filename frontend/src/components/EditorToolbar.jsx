import ToolbarButton from "./ToolbarButton";
import { useEffect, useState } from "react";
import { FiRotateCcw, FiRotateCw } from "react-icons/fi";

import {
  FiBold,
  FiItalic,
  FiUnderline,
  FiList,
  FiCode,
} from "react-icons/fi";

import {
  MdFormatStrikethrough,
  MdFormatListNumbered,
  MdCheckBox,
} from "react-icons/md";

const COLORS = [
  // White & Gray
  "#FFFFFF",
  "#E5E7EB",
  "#9CA3AF",
  "#6B7280",
  "#374151",
  "#111827",

  // Red
  "#FEE2E2",
  "#FCA5A5",
  "#EF4444",
  "#DC2626",
  "#991B1B",

  // Orange
  "#FED7AA",
  "#FB923C",
  "#F97316",
  "#EA580C",
  "#9A3412",

  // Yellow
  "#FEF3C7",
  "#FCD34D",
  "#EAB308",
  "#CA8A04",
  "#854D0E",

  // Green
  "#DCFCE7",
  "#86EFAC",
  "#22C55E",
  "#16A34A",
  "#166534",

  // Cyan
  "#CFFAFE",
  "#67E8F9",
  "#06B6D4",
  "#0891B2",
  "#164E63",

  // Blue
  "#DBEAFE",
  "#93C5FD",
  "#3B82F6",
  "#2563EB",
  "#1E3A8A",

  // Purple
  "#E9D5FF",
  "#C084FC",
  "#8B5CF6",
  "#7C3AED",
  "#4C1D95",

  // Pink
  "#FBCFE8",
  "#F472B6",
  "#EC4899",
  "#DB2777",
  "#831843",
];



const EditorToolbar = ({ editor }) => {

    const [showColors, setShowColors] = useState(false);

    if (!editor) return null;

    const [, forceUpdate] = useState(0);

useEffect(() => {
  if (!editor) return;

  const update = () => forceUpdate(v => v + 1);

  editor.on("selectionUpdate", update);
  editor.on("transaction", update);

  return () => {
    editor.off("selectionUpdate", update);
    editor.off("transaction", update);
  };
}, [editor]);

    return (

        <div className="flex items-center gap-3 flex-wrap">

            {/* Text */}

            <div className="flex items-center gap-1 bg-gray-800 rounded-lg px-2 py-1">
                <ToolbarButton
                    title="Bold"
                    active={editor.isActive("bold")}
                    onClick={() =>
                        editor.chain().focus().toggleBold().run()
                    }
                >
                    <FiBold size={18}/>
                </ToolbarButton>

                <ToolbarButton
                    title="Italic"
                    active={editor.isActive("italic")}
                    onClick={() =>
                        editor.chain().focus().toggleItalic().run()
                    }
                >
                    <FiItalic size={18}/>
                </ToolbarButton>

                <ToolbarButton
                    title="Underline"
                    active={editor.isActive("underline")}
                    onClick={() =>
                        editor.chain().focus().toggleUnderline().run()
                    }
                >
                    <FiUnderline size={18}/>
                </ToolbarButton>

                <ToolbarButton
                    title="Strike"
                    active={editor.isActive("strike")}
                    onClick={() =>
                        editor.chain().focus().toggleStrike().run()
                    }
                >
                    <MdFormatStrikethrough size={18}/>
                </ToolbarButton>

                  </div>

                  <div className="flex items-center gap-1 bg-gray-800 rounded-lg px-2 py-1">

                    <ToolbarButton
                        title="Heading 1"
                        active={editor.isActive("heading", { level: 1 })}
                        onClick={() =>
                        editor.chain().focus().toggleHeading({ level: 1 }).run()
                        }
                    >
                        H1
                    </ToolbarButton>

                    <ToolbarButton
                        title="Heading 2"
                        active={editor.isActive("heading", { level: 2 })}
                        onClick={() =>
                        editor.chain().focus().toggleHeading({ level: 2 }).run()
                        }
                    >
                        H2
                    </ToolbarButton>

                    <ToolbarButton
                        title="Heading 3"
                        active={editor.isActive("heading", { level: 3 })}
                        onClick={() =>
                        editor.chain().focus().toggleHeading({ level: 3 }).run()
                        }
                    >
                        H3
                    </ToolbarButton>

                    </div>

                    <div className="flex items-center gap-1 bg-gray-800 rounded-lg px-2 py-1">

                    <ToolbarButton
                        title="Bullet List"
                        active={editor.isActive("bulletList")}
                        onClick={() =>
                        editor.chain().focus().toggleBulletList().run()
                        }
                    >
                        <FiList size={18}/>
                    </ToolbarButton>

                    <ToolbarButton
                        title="Numbered List"
                        active={editor.isActive("orderedList")}
                        onClick={() =>
                        editor.chain().focus().toggleOrderedList().run()
                        }
                    >
                        <MdFormatListNumbered size={18}/>
                    </ToolbarButton>

                    <ToolbarButton
                        title="Task List"
                        active={editor.isActive("taskList")}
                        onClick={() =>
                        editor.chain().focus().toggleTaskList().run()
                        }
                    >
                        <MdCheckBox size={18}/>
                    </ToolbarButton>

                    </div>

                    <div className="flex items-center gap-1 bg-gray-800 rounded-lg px-2 py-1">

                    <ToolbarButton
                        title="Code Block"
                        active={editor.isActive("codeBlock")}
                        onClick={() =>
                        editor.chain().focus().toggleCodeBlock().run()
                        }
                    >
                        <FiCode size={18}/>
                    </ToolbarButton>

                    <ToolbarButton
                        title="Inline Code"
                        active={editor.isActive("code")}
                        onClick={() =>
                        editor.chain().focus().toggleCode().run()
                        }
                    >
                        {"</>"}
                    </ToolbarButton>

                    </div>

                    <div className="flex items-center gap-2 bg-gray-800 rounded-lg px-2 py-1">

                    <div className="relative">

                        <ToolbarButton
                            title="Text Color"
                            onClick={() => setShowColors(v => !v)}
                        >
                            🎨
                        </ToolbarButton>

                        {showColors && (
                            <div
                            className="
                                absolute
                                top-12
                                left-0
                                z-50
                                w-44
                                p-3
                                bg-gray-900
                                border
                                border-gray-700
                                rounded-xl
                                shadow-2xl
                                grid
                                grid-cols-4
                                gap-3
                            "
                            >
                            {COLORS.map((color) => (
                                <button
                                key={color}
                                type="button"
                                onClick={() => {
                                    editor.chain().focus().setColor(color).run();
                                    setShowColors(false);
                                }}
                                className="
                                    w-7
                                    h-7
                                    rounded-full
                                    border-2
                                    border-gray-500
                                    hover:scale-110
                                    transition
                                    flex
                                    items-center
                                    justify-center
                                "
                                style={{ backgroundColor: color }}
                                />
                            ))}
                            </div>
                        )}

                        </div>

                    <ToolbarButton
                        title="Reset Color"
                        onClick={() =>
                        editor
                            .chain()
                            .focus()
                            .unsetColor()
                            .run()
                        }
                    >
                        A
                    </ToolbarButton>

                    </div>

                    <ToolbarButton
                    title="Undo"
                    disabled={!editor.can().chain().focus().undo().run()}
                    onClick={() =>
                        editor.chain().focus().undo().run()
                    }
                    >
                    <FiRotateCcw size={18}/>
                    </ToolbarButton>

                    <ToolbarButton
                    title="Redo"
                    disabled={!editor.can().chain().focus().redo().run()}
                    onClick={() =>
                        editor.chain().focus().redo().run()
                    }
                    >
                    <FiRotateCw size={18}/>
                    </ToolbarButton>


            </div>
        );
};

export default EditorToolbar;