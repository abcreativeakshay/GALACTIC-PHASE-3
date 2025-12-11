import React, { useState, useEffect, useRef } from 'react';

// Declare KaTeX on window for TypeScript
declare global {
  interface Window {
    katex: any;
  }
}

interface TypewriterProps {
  text: string;
  speed?: number;
  onComplete?: () => void;
}

// Separate component to handle the parsing and rendering of the content
export const MarkdownRenderer: React.FC<{ content: string }> = ({ content }) => {
  // Regex to split by:
  // 1. Double dollar math $$...$$
  // 2. Inline math $...$ (Capture strictly between single $ excluding those starting with $$)
  // 3. Bold **...**
  // 4. Code `...`
  // 5. Newlines (implicit in split)
  const parts = content.split(/(\$\$[\s\S]*?\$\$|\$[^$]+?\$|\*\*[\s\S]*?\*\*|`[\s\S]*?`)/g);

  return (
    <span>
      {parts.map((part, index) => {
        // Math Block (Display Mode)
        if (part.startsWith('$$') && part.endsWith('$$')) {
          const math = part.slice(2, -2);
          try {
            if (window.katex) {
                const html = window.katex.renderToString(math, { throwOnError: false, displayMode: true });
                return <span key={index} dangerouslySetInnerHTML={{ __html: html }} className="my-2 block" />;
            }
          } catch (e) {
              console.error(e);
          }
          return <span key={index} className="text-neon-green font-mono block my-2 p-2 bg-black/30 border border-slate-800 rounded">{math}</span>;
        }

        // Inline Math (Inline Mode)
        if (part.startsWith('$') && part.endsWith('$') && !part.startsWith('$$')) {
          const math = part.slice(1, -1);
          try {
            if (window.katex) {
                const html = window.katex.renderToString(math, { throwOnError: false, displayMode: false });
                return <span key={index} dangerouslySetInnerHTML={{ __html: html }} className="inline-block mx-1" />;
            }
          } catch (e) {
              console.error(e);
          }
          return <span key={index} className="text-neon-green font-mono mx-1">{math}</span>;
        }
        
        // Bold
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={index} className="text-cyan-300 font-bold">{part.slice(2, -2)}</strong>;
        }

        // Inline Code
        if (part.startsWith('`') && part.endsWith('`')) {
          return <code key={index} className="bg-slate-800 px-1 py-0.5 rounded text-neon-amber font-mono text-xs">{part.slice(1, -1)}</code>;
        }

        // Standard Text (Handle newlines)
        return <span key={index}>{part}</span>;
      })}
    </span>
  );
};

const Typewriter: React.FC<TypewriterProps> = ({ text, speed = 5, onComplete }) => {
  const [displayedLength, setDisplayedLength] = useState(0);
  const requestRef = useRef<number>();
  const startTimeRef = useRef<number | null>(null);

  useEffect(() => {
    // Reset state when text changes
    setDisplayedLength(0);
    startTimeRef.current = null;
    
    const animate = (time: number) => {
      if (startTimeRef.current === null) {
        startTimeRef.current = time;
      }
      
      const elapsed = time - startTimeRef.current;
      // Calculate chars based on speed (ms per char)
      // speed 5 = very fast (5ms per char)
      const charsToShow = Math.floor(elapsed / speed);
      
      if (charsToShow <= text.length) {
        setDisplayedLength(charsToShow);
        requestRef.current = requestAnimationFrame(animate);
      } else {
        setDisplayedLength(text.length);
        if (onComplete) onComplete();
      }
    };

    requestRef.current = requestAnimationFrame(animate);

    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [text, speed, onComplete]);

  const content = text.slice(0, displayedLength);

  return (
    <div className="whitespace-pre-wrap leading-relaxed break-words">
      <MarkdownRenderer content={content} />
      <span className="animate-pulse inline-block w-1.5 h-4 bg-cyan-500 ml-0.5 align-middle"></span>
    </div>
  );
};

export default Typewriter;