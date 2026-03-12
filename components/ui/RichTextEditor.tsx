"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Link from "@tiptap/extension-link";
import { Extension } from "@tiptap/core";
import type { CommandProps } from "@tiptap/core";

import {
    Bold,
    Italic,
    Strikethrough,
    Underline as UnderlineIcon,
    Heading1,
    Heading2,
    List,
    ListOrdered,
    Quote,
    Undo,
    Redo,
    AlignLeft,
    AlignCenter,
    AlignRight,
    AlignJustify,
    Link as LinkIcon,
    Indent as IndentIcon,
    Outdent as OutdentIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

declare module "@tiptap/core" {
    interface Commands<ReturnType> {
        indent: {
            indent: () => ReturnType;
            outdent: () => ReturnType;
        };
    }
}

interface RichTextEditorProps {
    value: any;
    onChange: (value: any) => void;
    placeholder?: string;
    minHeight?: string;
}

const ToolbarButton = ({
    isActive = false,
    onClick,
    disabled = false,
    children,
    title,
}: {
    isActive?: boolean;
    onClick: () => void;
    disabled?: boolean;
    children: React.ReactNode;
    title?: string;
}) => (
    <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={onClick}
        disabled={disabled}
        title={title}
        className={cn(
            "h-9 w-9 p-0 transition-colors",
            isActive
                ? "bg-muted text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/70",
            disabled && "opacity-40 cursor-not-allowed"
        )}
    >
        {children}
    </Button>
);

const Indent = Extension.create({
    name: "indent",

    addOptions() {
        return {
            types: ["paragraph", "heading", "blockquote"],
            indentClasses: ["pl-4", "pl-8", "pl-12", "pl-16"],
        };
    },

    addGlobalAttributes() {
        return [
            {
                types: this.options.types,
                attributes: {
                    indent: {
                        default: 0,
                        parseHTML: (element) => {
                            const cls = this.options.indentClasses.find((c: string) =>
                                element.classList.contains(c)
                            );
                            return cls ? this.options.indentClasses.indexOf(cls) : 0;
                        },
                        renderHTML: (attributes) => {
                            if (attributes.indent === 0) return {};
                            return { class: this.options.indentClasses[attributes.indent] };
                        },
                    },
                },
            },
        ];
    },

    addCommands() {
        return {
            indent:
                () =>
                    ({ tr, state, dispatch }: CommandProps) => {
                        let changed = false;
                        const { selection } = state;

                        tr.doc.nodesBetween(selection.from, selection.to, (node, pos) => {
                            if (this.options.types.includes(node.type.name)) {
                                const indent = (node.attrs.indent || 0) + 1;
                                if (indent < this.options.indentClasses.length) {
                                    tr.setNodeMarkup(pos, undefined, {
                                        ...node.attrs,
                                        indent,
                                    });
                                    changed = true;
                                }
                            }
                        });

                        if (changed) {
                            dispatch?.(tr);
                            return true;
                        }
                        return false;
                    },

            outdent:
                () =>
                    ({ tr, state, dispatch }: CommandProps) => {
                        let changed = false;
                        const { selection } = state;

                        tr.doc.nodesBetween(selection.from, selection.to, (node, pos) => {
                            if (this.options.types.includes(node.type.name)) {
                                const indent = (node.attrs.indent || 0) - 1;
                                if (indent >= 0) {
                                    tr.setNodeMarkup(pos, undefined, {
                                        ...node.attrs,
                                        indent,
                                    });
                                    changed = true;
                                }
                            }
                        });

                        if (changed) {
                            dispatch?.(tr);
                            return true;
                        }
                        return false;
                    },
        };
    },
});

function MenuBar({ editor }: { editor: any }) {
    if (!editor) return null;

    return (
        <div className="sticky top-0 z-10 flex flex-wrap items-center gap-0.5 gap-y-1 px-3 py-2 bg-muted/40 border-b backdrop-blur-sm">
            {/* Formatting */}
            <div className="flex items-center gap-0.5">
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    isActive={editor.isActive("bold")}
                    title="Bold"
                >
                    <Bold className="h-[18px] w-[18px]" />
                </ToolbarButton>

                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    isActive={editor.isActive("italic")}
                    title="Italic"
                >
                    <Italic className="h-[18px] w-[18px]" />
                </ToolbarButton>

                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleStrike().run()}
                    isActive={editor.isActive("strike")}
                    title="Strikethrough"
                >
                    <Strikethrough className="h-[18px] w-[18px]" />
                </ToolbarButton>

                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleUnderline().run()}
                    isActive={editor.isActive("underline")}
                    title="Underline"
                >
                    <UnderlineIcon className="h-[18px] w-[18px]" />
                </ToolbarButton>
            </div>

            <div className="w-px h-6 bg-border mx-2" />

            {/* Headings */}
            <div className="flex items-center gap-0.5">
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                    isActive={editor.isActive("heading", { level: 1 })}
                    title="Heading 1"
                >
                    <Heading1 className="h-[18px] w-[18px]" />
                </ToolbarButton>

                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    isActive={editor.isActive("heading", { level: 2 })}
                    title="Heading 2"
                >
                    <Heading2 className="h-[18px] w-[18px]" />
                </ToolbarButton>
            </div>

            <div className="w-px h-6 bg-border mx-2" />

            {/* Lists & Quote */}
            <div className="flex items-center gap-0.5">
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    isActive={editor.isActive("bulletList")}
                    title="Bullet List"
                >
                    <List className="h-[18px] w-[18px]" />
                </ToolbarButton>

                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    isActive={editor.isActive("orderedList")}
                    title="Numbered List"
                >
                    <ListOrdered className="h-[18px] w-[18px]" />
                </ToolbarButton>

                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleBlockquote().run()}
                    isActive={editor.isActive("blockquote")}
                    title="Quote"
                >
                    <Quote className="h-[18px] w-[18px]" />
                </ToolbarButton>
            </div>

            <div className="w-px h-6 bg-border mx-2" />

            {/* Alignment */}
            <div className="flex items-center gap-0.5">
                <ToolbarButton
                    onClick={() => editor.chain().focus().setTextAlign("left").run()}
                    isActive={editor.isActive({ textAlign: "left" })}
                    title="Align Left"
                >
                    <AlignLeft className="h-[18px] w-[18px]" />
                </ToolbarButton>

                <ToolbarButton
                    onClick={() => editor.chain().focus().setTextAlign("center").run()}
                    isActive={editor.isActive({ textAlign: "center" })}
                    title="Align Center"
                >
                    <AlignCenter className="h-[18px] w-[18px]" />
                </ToolbarButton>

                <ToolbarButton
                    onClick={() => editor.chain().focus().setTextAlign("right").run()}
                    isActive={editor.isActive({ textAlign: "right" })}
                    title="Align Right"
                >
                    <AlignRight className="h-[18px] w-[18px]" />
                </ToolbarButton>

                <ToolbarButton
                    onClick={() => editor.chain().focus().setTextAlign("justify").run()}
                    isActive={editor.isActive({ textAlign: "justify" })}
                    title="Justify"
                >
                    <AlignJustify className="h-[18px] w-[18px]" />
                </ToolbarButton>
            </div>

            <div className="w-px h-6 bg-border mx-2" />

            {/* Indent */}
            <div className="flex items-center gap-0.5">
                <ToolbarButton
                    onClick={() => editor.chain().focus().indent().run()}
                    title="Increase indent"
                >
                    <IndentIcon className="h-[18px] w-[18px]" />
                </ToolbarButton>

                <ToolbarButton
                    onClick={() => editor.chain().focus().outdent().run()}
                    title="Decrease indent"
                >
                    <OutdentIcon className="h-[18px] w-[18px]" />
                </ToolbarButton>
            </div>

            <div className="w-px h-6 bg-border mx-2" />

            {/* Link + History */}
            <div className="flex items-center gap-0.5">
                <ToolbarButton
                    onClick={() => {
                        const prev = editor.getAttributes("link").href;
                        const url = window.prompt("Enter URL", prev || "https://");
                        if (url === null) return;
                        if (url === "") {
                            editor.chain().focus().extendMarkRange("link").unsetLink().run();
                            return;
                        }
                        editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
                    }}
                    isActive={editor.isActive("link")}
                    title="Link"
                >
                    <LinkIcon className="h-[18px] w-[18px]" />
                </ToolbarButton>

                <ToolbarButton
                    onClick={() => editor.chain().focus().undo().run()}
                    disabled={!editor.can().chain().focus().undo().run()}
                    title="Undo"
                >
                    <Undo className="h-[18px] w-[18px]" />
                </ToolbarButton>

                <ToolbarButton
                    onClick={() => editor.chain().focus().redo().run()}
                    disabled={!editor.can().chain().focus().redo().run()}
                    title="Redo"
                >
                    <Redo className="h-[18px] w-[18px]" />
                </ToolbarButton>
            </div>
        </div>
    );
}

export function RichTextEditor({
    value,
    onChange,
    placeholder = "Start writing the event details...",
    minHeight = "min-h-[260px]",
}: RichTextEditorProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: { levels: [1, 2, 3] },
                bulletList: { HTMLAttributes: { class: "list-disc ml-5 mb-4" } },
                orderedList: { HTMLAttributes: { class: "list-decimal ml-5 mb-4" } },
            }),
            Placeholder.configure({ placeholder }),
            Underline,
            TextAlign.configure({ types: ["heading", "paragraph"] }),
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: "text-primary underline underline-offset-2 hover:text-primary/80",
                },
            }),
            Indent,
        ],

        content: value || "<p></p>",

        immediatelyRender: false,

        editorProps: {
            attributes: {
                class: cn(
                    "prose prose-neutral prose-sm sm:prose-base max-w-none focus:outline-none px-5 py-6",
                    "min-h-[220px] flex-1",
                    "[&_p]:leading-7 [&_p]:mb-4",
                    "[&_h1]:text-3xl [&_h1]:font-bold [&_h1]:mb-6 [&_h1]:mt-8",
                    "[&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:mb-5 [&_h2]:mt-7",
                    "[&_h3]:text-xl  [&_h3]:font-semibold [&_h3]:mb-4 [&_h3]:mt-6",
                    "[&_blockquote]:border-l-4 [&_blockquote]:border-muted-foreground/40 [&_blockquote]:pl-5 [&_blockquote]:italic [&_blockquote]:text-muted-foreground [&_blockquote]:my-6",
                    "[&_li]:mb-1.5",
                    "caret-primary"
                ),
            },
        },

        onUpdate: ({ editor }) => {
            onChange(editor.getJSON());
        },
    });

    if (!mounted) return null;

    return (
        <div
            className={cn(
                "border border-input rounded-xl overflow-hidden bg-background shadow-sm",
                "focus-within:border-primary/60 focus-within:ring-1 focus-within:ring-primary/30",
                "transition-all duration-200"
            )}
        >
            <MenuBar editor={editor} />

            <div
                className={cn("cursor-text", minHeight)}
                onClick={() => editor?.chain().focus().run()}
            >
                <EditorContent editor={editor} className="h-full" />
            </div>
        </div>
    );
}