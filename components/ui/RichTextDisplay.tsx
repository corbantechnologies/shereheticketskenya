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
        let jsonContent = content;

        // If the backend sent a stringified payload, try to parse it
        if (typeof content === 'string') {
            try {
                jsonContent = JSON.parse(content);
            } catch (e) {
                // If it fails to parse as JSON, it's just a legacy plain text string
                return (
                    <div className="prose prose-sm sm:prose-base max-w-none text-gray-700 whitespace-pre-line leading-relaxed">
                        {content}
                    </div>
                );
            }
        }

        // Check if the parsed object is actually a TipTap document
        if (typeof jsonContent === 'object' && jsonContent !== null && jsonContent.type === 'doc') {
            // Generate raw HTML from TipTap JSON
            const html = generateHTML(jsonContent, [
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
        }

        // If it's pure logic fallback (e.g. a valid JSON string like '"Old text"')
        const displayText = typeof jsonContent === 'string' ? jsonContent :
            (typeof content === 'string' ? content : JSON.stringify(content));

        return (
            <div className="prose prose-sm sm:prose-base max-w-none text-gray-700 whitespace-pre-line leading-relaxed">
                {displayText}
            </div>
        );

    } catch (error) {
        console.error("Failed to parse rich text content", error);

        // Final ultimate fallback so the page never breaks
        return (
            <div className="prose prose-sm sm:prose-base max-w-none text-gray-700 whitespace-pre-line leading-relaxed">
                {typeof content === 'string' ? content : "Content format error"}
            </div>
        );
    }
}
