import React from "react";
import { generateHTML } from "@tiptap/html";
import StarterKit from "@tiptap/starter-kit";
import parse from "html-react-parser";

interface RichTextDisplayProps {
    content: any;
}

export default function RichTextDisplay({ content }: RichTextDisplayProps) {
    if (!content) return null;

    try {
        // Generate raw HTML from TipTap JSON using the same extensions as the editor
        const html = generateHTML(content, [
            StarterKit.configure({
                heading: {
                    levels: [1, 2, 3],
                },
            }),
        ]);

        // Parse the HTML string into safe React elements
        return (
            <div className="prose prose-sm sm:prose-base max-w-none text-gray-700
                [&_p]:leading-relaxed [&_p]:mb-3 
                [&_ul]:list-disc [&_ul]:ml-5 [&_ul]:mb-4 [&_ul_li]:mb-1
                [&_ol]:list-decimal [&_ol]:ml-5 [&_ol]:mb-4 [&_ol_li]:mb-1
                [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:mb-4 [&_h1]:mt-6 [&_h1]:text-gray-900
                [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:mb-3 [&_h2]:mt-5 [&_h2]:text-gray-900
                [&_blockquote]:border-l-4 [&_blockquote]:border-gray-300 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-gray-500 [&_blockquote]:my-4"
            >
                {parse(html)}
            </div>
        );
    } catch (error) {
        console.error("Failed to parse rich text content", error);
        return null;
    }
}
