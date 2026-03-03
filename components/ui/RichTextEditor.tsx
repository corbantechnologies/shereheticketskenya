"use client";

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { Button } from './button';
import { Bold, Italic, Strikethrough, Heading1, Heading2, List, ListOrdered, Quote, Undo, Redo } from 'lucide-react';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils'; // Assuming they have cn utility like a standard shadcn project, if not we can use clsx or just template strings.

interface RichTextEditorProps {
    value: any;
    onChange: (value: any) => void;
}

// A helper for toolbar buttons to keep them consistent and clean
const ToolbarButton = ({
    isActive,
    onClick,
    disabled,
    children
}: {
    isActive?: boolean;
    onClick: () => void;
    disabled?: boolean;
    children: React.ReactNode
}) => (
    <Button
        type="button"
        variant="ghost"
        onClick={onClick}
        disabled={disabled}
        className={`h-8 w-8 p-0 text-gray-500 hover:text-gray-900 transition-colors ${isActive ? 'bg-gray-200/80 text-gray-900 shadow-sm' : ''
            }`}
    >
        {children}
    </Button>
);

const MenuBar = ({ editor }: { editor: any }) => {
    if (!editor) {
        return null;
    }

    return (
        <div className="flex flex-wrap items-center gap-1 p-2 bg-gray-50/80 border-b border-gray-200">
            <ToolbarButton
                onClick={() => editor.chain().focus().toggleBold().run()}
                disabled={!editor.can().chain().focus().toggleBold().run()}
                isActive={editor.isActive('bold')}
            >
                <Bold className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton
                onClick={() => editor.chain().focus().toggleItalic().run()}
                disabled={!editor.can().chain().focus().toggleItalic().run()}
                isActive={editor.isActive('italic')}
            >
                <Italic className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton
                onClick={() => editor.chain().focus().toggleStrike().run()}
                disabled={!editor.can().chain().focus().toggleStrike().run()}
                isActive={editor.isActive('strike')}
            >
                <Strikethrough className="h-4 w-4" />
            </ToolbarButton>

            <div className="w-[1px] h-5 bg-gray-300 mx-1.5" />

            <ToolbarButton
                onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                isActive={editor.isActive('heading', { level: 1 })}
            >
                <Heading1 className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                isActive={editor.isActive('heading', { level: 2 })}
            >
                <Heading2 className="h-4 w-4" />
            </ToolbarButton>

            <div className="w-[1px] h-5 bg-gray-300 mx-1.5" />

            <ToolbarButton
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                isActive={editor.isActive('bulletList')}
            >
                <List className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                isActive={editor.isActive('orderedList')}
            >
                <ListOrdered className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
                isActive={editor.isActive('blockquote')}
            >
                <Quote className="h-4 w-4" />
            </ToolbarButton>

            <div className="w-[1px] h-5 bg-gray-300 mx-1.5" />

            <ToolbarButton
                onClick={() => editor.chain().focus().undo().run()}
                disabled={!editor.can().chain().focus().undo().run()}
            >
                <Undo className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton
                onClick={() => editor.chain().focus().redo().run()}
                disabled={!editor.can().chain().focus().redo().run()}
            >
                <Redo className="h-4 w-4" />
            </ToolbarButton>
        </div>
    );
};

export function RichTextEditor({ value, onChange }: RichTextEditorProps) {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: {
                    levels: [1, 2, 3],
                }
            }),
            Placeholder.configure({
                placeholder: 'Write the exciting details for your event...',
            })
        ],
        content: value || { type: 'doc', content: [] }, // Provide a default empty doc if value is null
        immediatelyRender: false,
        editorProps: {
            attributes: {
                className: `prose prose-sm sm:prose-base max-w-none focus:outline-none min-h-[220px] p-5 bg-white text-gray-700
                [&_p]:leading-relaxed [&_p]:mb-3 
                [&_ul]:list-disc [&_ul]:ml-5 [&_ul]:mb-4 [&_ul_li]:mb-1
                [&_ol]:list-decimal [&_ol]:ml-5 [&_ol]:mb-4 [&_ol_li]:mb-1
                [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:mb-4 [&_h1]:mt-6 [&_h1]:text-gray-900
                [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:mb-3 [&_h2]:mt-5 [&_h2]:text-gray-900
                [&_blockquote]:border-l-4 [&_blockquote]:border-gray-300 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-gray-500 [&_blockquote]:my-4
                [&_.is-empty::before]:content-[attr(data-placeholder)] [&_.is-empty::before]:text-gray-400 [&_.is-empty::before]:float-left [&_.is-empty::before]:pointer-events-none [&_.is-empty::before]:h-0`,
            },
        },
        onUpdate: ({ editor }) => {
            onChange(editor.getJSON());
        },
    });

    if (!isMounted) {
        return null;
    }

    return (
        <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm transition-all duration-200 focus-within:ring-2 focus-within:ring-[var(--mainRed)] focus-within:border-[var(--mainRed)] focus-within:shadow-md bg-white">
            <MenuBar editor={editor} />
            <div className="max-h-[450px] overflow-y-auto cursor-text" onClick={() => editor?.chain().focus().run()}>
                <EditorContent editor={editor} />
            </div>
        </div>
    );
}
