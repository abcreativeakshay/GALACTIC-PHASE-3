import React from 'react';
import { Copy, Terminal } from 'lucide-react';

interface CodeBlockProps {
  code: string;
  language?: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ code, language = 'python' }) => {
  const copyToClipboard = () => {
    navigator.clipboard.writeText(code);
  };

  return (
    <div className="bg-space-900 border border-slate-700 rounded-lg overflow-hidden my-4 font-mono text-sm relative group">
      <div className="bg-slate-800 px-4 py-2 flex items-center justify-between border-b border-slate-700">
        <div className="flex items-center space-x-2 text-slate-400">
            <Terminal size={14} />
            <span className="text-xs uppercase tracking-wider">{language} EXECUTION MODULE</span>
        </div>
        <button 
            onClick={copyToClipboard}
            className="text-slate-400 hover:text-cyan-400 transition-colors"
            title="Copy to clipboard"
        >
            <Copy size={14} />
        </button>
      </div>
      <div className="p-4 overflow-x-auto text-slate-300">
        <pre><code>{code}</code></pre>
      </div>
    </div>
  );
};

export default CodeBlock;
