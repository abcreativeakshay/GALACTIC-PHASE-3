import React, { useState, useEffect, useMemo } from 'react';
import { StudyGuideData, HyperparameterDetail } from '../types';
import RadarDisplay from './RadarDisplay';
import CodeBlock from './CodeBlock';
import QuizModule from './QuizModule';
import SimulationChart from './SimulationChart';
import { MarkdownRenderer } from './Typewriter';
import { 
    Cpu, 
    Activity, 
    Terminal, 
    BookOpen, 
    ShieldAlert, 
    Zap,
    Layers,
    Clock,
    User,
    Sliders,
    Download
} from 'lucide-react';

interface StudyGuideRendererProps {
  data: StudyGuideData;
}

const parseRange = (rangeStr: string): { min: number; max: number } => {
    const match = rangeStr.match(/(\d+\.?\d*)\s*[-to]+\s*(\d+\.?\d*)/);
    if (match) {
        return { min: parseFloat(match[1]), max: parseFloat(match[2]) };
    }
    return { min: 0, max: 100 }; // Default fallback
};

const StudyGuideRenderer: React.FC<StudyGuideRendererProps> = ({ data }) => {
  const [activeTab, setActiveTab] = useState<'core' | 'tactical' | 'engine' | 'training' | 'field'>('core');
  const [isDownloading, setIsDownloading] = useState(false);
  
  // Initialize hyperparameter values
  const [paramValues, setParamValues] = useState<Record<string, number>>({});

  useEffect(() => {
    const initial: Record<string, number> = {};
    if (data.engineRoom && data.engineRoom.hyperparameters) {
        Object.entries(data.engineRoom.hyperparameters).forEach(([key, detail]) => {
            const val = detail as HyperparameterDetail; // safe cast for initial read
            const { min, max } = parseRange(val.range);
            initial[key] = min + (max - min) * 0.5; // Default to middle
        });
    }
    setParamValues(initial);
  }, [data.modelName]);

  const handleParamChange = (key: string, value: number) => {
    setParamValues(prev => ({ ...prev, [key]: value }));
  };

  const handleDownloadPDF = () => {
    setIsDownloading(true);

    // Helper to format text with Markdown and Math for the PDF
    const formatContent = (content: string) => {
        if (!content) return '';
        let html = content
            // Math $$...$$
            .replace(/\$\$([\s\S]*?)\$\$/g, (match, tex) => {
                try { return window.katex ? window.katex.renderToString(tex, { displayMode: true, throwOnError: false }) : match; } catch(e) { return match; }
            })
            // Math $...$
            .replace(/\$([^$]+?)\$/g, (match, tex) => {
                 try { return window.katex ? window.katex.renderToString(tex, { displayMode: false, throwOnError: false }) : match; } catch(e) { return match; }
            })
            // Bold **...**
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            // Code `...`
            .replace(/`([^`]+)`/g, '<code style="background:#eee;padding:2px 4px;border-radius:3px;font-family:monospace;">$1</code>')
            // Newlines
            .replace(/\n/g, '<br/>');
        return html;
    };

    // Create a temporary element to render the printable version
    const element = document.createElement('div');
    element.innerHTML = `
        <style>
            .pdf-container { font-family: 'Courier New', monospace; color: #000; background: #fff; padding: 20px; }
            .pdf-page { page-break-after: always; min-height: 900px; padding: 20px; border: 1px solid #eee; margin-bottom: 20px; }
            
            /* HEADLINES & TITLES - ORANGE */
            .pdf-header { border-bottom: 2px solid #ff6600; padding-bottom: 10px; margin-bottom: 20px; }
            .pdf-title { font-size: 24px; font-weight: bold; text-transform: uppercase; color: #ff6600; }
            .pdf-section-title { font-size: 16px; font-weight: bold; border-bottom: 1px solid #ff6600; margin: 20px 0 10px 0; padding-bottom: 5px; text-transform: uppercase; color: #ff6600; }
            
            /* METADATA & BODY - BLACK */
            .pdf-meta { font-size: 10px; margin-top: 5px; color: #000; }
            
            /* BOXES & CODE */
            .pdf-box { border: 1px solid #000; padding: 10px; margin-bottom: 10px; font-size: 12px; }
            .pdf-list { font-size: 12px; }
            .pdf-code { background: #f0f0f0; padding: 10px; font-size: 10px; white-space: pre-wrap; border: 1px solid #ccc; margin-bottom: 10px; color: #000; }
            
            /* IMPORTANT THINGS / SUBHEADINGS - ORANGE */
            strong { color: #ff6600; }
            b { color: #ff6600; }
            
            /* MATH */
            .katex { font-size: 1.1em; }

            .pdf-footer { position: fixed; bottom: 0; width: 100%; text-align: center; font-size: 8px; border-top: 1px solid #ccc; padding-top: 5px; color: #666; }
        </style>
        <div class="pdf-container">
            <!-- PAGE 1: CORE -->
            <div class="pdf-page">
                <div class="pdf-header">
                    <div class="pdf-title">NOVA-7 MISSION REPORT: ${data.modelName}</div>
                    <div class="pdf-meta">
                        CATEGORY: ${data.category} | CLEARANCE: ${data.difficultyLevel} | EST. TIME: ${data.estimatedStudyTime}<br/>
                        ARCHIVES: ${data.archives.yearIntroduced} by ${data.archives.inventors.join(', ')}
                    </div>
                </div>
                
                <div class="pdf-section-title">01 // CORE MECHANICS</div>
                <div class="pdf-box">
                    <strong>DEFINITION:</strong><br/>
                    ${formatContent(data.coreMechanics.definition)}
                </div>
                
                <div class="pdf-section-title">KEY FACTS</div>
                <ul class="pdf-list">
                    ${data.coreMechanics.keyFacts.map(f => `<li>${formatContent(f)}</li>`).join('')}
                </ul>

                <div class="pdf-section-title">ARCHITECTURE OVERVIEW</div>
                <div class="pdf-box">
                    ${formatContent(data.coreMechanics.architectureOverview)}
                </div>

                <div class="pdf-section-title">MATHEMATICAL FOUNDATION</div>
                <div class="pdf-box" style="font-style: italic;">
                    ${formatContent(data.coreMechanics.mathematicalFoundation)}
                </div>
                
                <div style="font-size: 10px; margin-top: 20px; text-align: center; color: #ff6600;">-- END OF SECTION 01 --</div>
            </div>

            <!-- PAGE 2: TACTICAL -->
            <div class="pdf-page">
                 <div class="pdf-header"><div class="pdf-title">SECTION 02 // TACTICAL ANALYSIS</div></div>
                 
                 <div class="pdf-section-title">PERFORMANCE METRICS</div>
                 <table style="width: 100%; font-size: 12px; border-collapse: collapse; margin-bottom: 20px;">
                    <tr><td style="border: 1px solid #000; padding: 5px;"><strong>SPEED</strong></td><td style="border: 1px solid #000; padding: 5px;">${data.tacticalAnalysis.radarStats.speed}/100</td></tr>
                    <tr><td style="border: 1px solid #000; padding: 5px;"><strong>ACCURACY</strong></td><td style="border: 1px solid #000; padding: 5px;">${data.tacticalAnalysis.radarStats.accuracy}/100</td></tr>
                    <tr><td style="border: 1px solid #000; padding: 5px;"><strong>SCALABILITY</strong></td><td style="border: 1px solid #000; padding: 5px;">${data.tacticalAnalysis.radarStats.scalability}/100</td></tr>
                    <tr><td style="border: 1px solid #000; padding: 5px;"><strong>INTERPRETABILITY</strong></td><td style="border: 1px solid #000; padding: 5px;">${data.tacticalAnalysis.radarStats.interpretability}/100</td></tr>
                 </table>

                 <div class="pdf-section-title">STRATEGIC ASSESSMENT</div>
                 <div style="display: flex; gap: 20px;">
                    <div style="flex: 1;">
                        <strong>PROS:</strong>
                        <ul class="pdf-list">${data.tacticalAnalysis.strategicAssessment.pros.map(p => `<li>${formatContent(p)}</li>`).join('')}</ul>
                    </div>
                    <div style="flex: 1;">
                        <strong>CONS:</strong>
                         <ul class="pdf-list">${data.tacticalAnalysis.strategicAssessment.cons.map(c => `<li>${formatContent(c)}</li>`).join('')}</ul>
                    </div>
                 </div>

                 <div class="pdf-section-title">RIVAL MODELS</div>
                 <div class="pdf-box">${data.tacticalAnalysis.rivalModels.join(', ')}</div>
            </div>

            <!-- PAGE 3: ENGINE ROOM -->
            <div class="pdf-page">
                <div class="pdf-header"><div class="pdf-title">SECTION 03 // ENGINE ROOM</div></div>
                
                <div class="pdf-section-title">PYTHON IMPLEMENTATION SKELETON</div>
                <div class="pdf-code">${data.engineRoom.pythonSkeleton.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</div>

                <div class="pdf-section-title">HYPERPARAMETERS</div>
                <ul class="pdf-list">
                    ${Object.entries(data.engineRoom.hyperparameters).map(([k, v]) => {
                        const val = v as HyperparameterDetail;
                        return `<li><strong>${k}</strong> (${val.range}): ${formatContent(val.description)}</li>`;
                    }).join('')}
                </ul>

                <div class="pdf-section-title">DEPLOYMENT STEPS</div>
                 <ul class="pdf-list">
                    ${data.engineRoom.implementationSteps.map(s => `<li><strong>${s.step}:</strong> ${formatContent(s.details)}</li>`).join('')}
                </ul>
            </div>

            <!-- PAGE 4: FIELD & TRAINING -->
             <div class="pdf-page">
                <div class="pdf-header"><div class="pdf-title">SECTION 04 // FIELD OPS & TRAINING</div></div>
                
                <div class="pdf-section-title">USE CASES</div>
                 <ul class="pdf-list">
                    ${data.fieldOperations.useCases.map(u => `<li><strong>${u.title} (${u.industry}):</strong> ${formatContent(u.description)}</li>`).join('')}
                </ul>

                <div class="pdf-section-title">OFFICER QUIZ</div>
                <ul class="pdf-list">
                    ${data.officerTraining.quiz.map((q, i) => `
                        <li style="margin-bottom: 10px;">
                            <strong>Q${i+1}: ${formatContent(q.question)}</strong><br/>
                            Answer: ${formatContent(q.options[q.correctAnswer])}
                        </li>
                    `).join('')}
                </ul>
                
                <div class="pdf-box" style="margin-top: 30px; text-align: center; border: none;">
                    <strong style="font-size: 14px;">GENERATED BY NOVA-7 TACTICAL AI</strong><br/>
                    GALACTIC ML INTERFACE
                </div>
            </div>
        </div>
    `;

    // @ts-ignore
    const opt = {
      margin: 10,
      filename: `MissionReport_${data.modelName.replace(/\s+/g, '_')}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    // @ts-ignore
    window.html2pdf().set(opt).from(element).save().then(() => setIsDownloading(false));
  };

  // Derive simulated data based on params
  const simulatedData = useMemo(() => {
    const base = data.tacticalAnalysis.trainingSimulation;
    if (!base) return { epochs: [], loss: [], accuracy: [] };

    let aggregateShift: number = 0;
    
    Object.entries(paramValues).forEach(([key, val]) => {
        // Safe access in case data structure is partial or undefined
        const detail = data.engineRoom?.hyperparameters?.[key] as HyperparameterDetail | undefined;
        if (!detail) return;
        
        const { min, max } = parseRange(detail.range);
        const rangeVal = (max - min) || 100;
        const norm = ((val as number) - min) / rangeVal; // 0 to 1
        
        // Calculate deviation from center (0.5)
        aggregateShift += (norm - 0.5); 
    });

    // Apply simulation math (pseudo-science for visualization)
    // Shift > 0: "Aggressive/High" params -> Faster initial learning but maybe unstable?
    // Shift < 0: "Conservative/Low" params -> Slower learning, smoother?
    
    return {
        epochs: base.epochs,
        loss: base.loss.map((l: number, i: number) => {
            const noise = (Math.random() - 0.5) * 0.05 * Math.abs(aggregateShift);
            const modifier = 1 - (aggregateShift * 0.2 * Math.exp(-i/10)); 
            return Math.max(0, l * modifier + noise);
        }),
        accuracy: base.accuracy.map((a: number, i: number) => {
            const modifier = 1 + (aggregateShift * 0.1 * (1 - Math.exp(-i/5)));
            return Math.min(100, Math.max(0, a * modifier));
        })
    };
  }, [paramValues, data]);


  const tabs = [
    { id: 'core', label: 'CORE MECHANICS', icon: <Cpu size={16} /> },
    { id: 'tactical', label: 'TACTICAL ANALYSIS', icon: <Activity size={16} /> },
    { id: 'engine', label: 'ENGINE ROOM', icon: <Terminal size={16} /> },
    { id: 'field', label: 'FIELD OPS', icon: <Layers size={16} /> },
    { id: 'training', label: 'OFFICER TRAINING', icon: <BookOpen size={16} /> },
  ];

  return (
    <div className="w-full max-w-5xl mx-auto bg-space-900/80 backdrop-blur-md border border-cyan-900/50 rounded-2xl shadow-[0_0_50px_rgba(6,182,212,0.1)] overflow-hidden flex flex-col h-full">
      
      {/* Header */}
      <div className="p-6 border-b border-cyan-900/50 bg-gradient-to-r from-space-800 to-space-900">
        <div className="flex justify-between items-start">
            <div>
                <h1 className="text-3xl font-display font-bold text-white tracking-widest uppercase">
                    <span className="text-neon-cyan mr-2">Target:</span>
                    {data.modelName}
                </h1>
                <div className="flex items-center gap-4 mt-2 text-sm font-mono text-cyan-300/70">
                    <span className="bg-cyan-900/30 px-2 py-0.5 rounded border border-cyan-700/50">{data.category}</span>
                    <span className="flex items-center gap-1"><User size={12}/> {data.difficultyLevel}</span>
                    <span className="flex items-center gap-1"><Clock size={12}/> {data.estimatedStudyTime}</span>
                </div>
            </div>
            <div className="flex flex-col items-end gap-2">
                <button 
                    onClick={handleDownloadPDF}
                    disabled={isDownloading}
                    className="flex items-center gap-2 px-4 py-2 bg-cyan-900/30 hover:bg-cyan-500/20 text-neon-cyan border border-cyan-500/50 rounded transition-all font-display text-xs tracking-wider uppercase disabled:opacity-50"
                >
                    <Download size={14} />
                    {isDownloading ? 'Generating...' : 'Download Report'}
                </button>
                <div className="hidden md:block text-right">
                    <div className="text-xs font-mono text-slate-500 uppercase tracking-widest mb-1">Archives Access</div>
                    <div className="text-sm text-cyan-400">{data.archives.yearIntroduced} // {data.archives.inventors[0]}</div>
                </div>
            </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex overflow-x-auto border-b border-cyan-900/30 bg-space-800/50 scrollbar-hide">
        {tabs.map(tab => (
            <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-6 py-4 text-sm font-display tracking-wider transition-all whitespace-nowrap ${
                    activeTab === tab.id 
                    ? 'text-neon-cyan border-b-2 border-neon-cyan bg-cyan-900/10' 
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                }`}
            >
                {tab.icon}
                {tab.label}
            </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar">
        
        {/* CORE MECHANICS */}
        {activeTab === 'core' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <section>
                    <h2 className="text-neon-cyan font-display text-xl mb-4 flex items-center gap-2">
                        <Zap size={20} /> DEFINITION MATRIX
                    </h2>
                    <p className="text-lg leading-relaxed text-slate-300 font-light border-l-2 border-cyan-500/50 pl-4">
                        {data.coreMechanics.definition}
                    </p>
                </section>

                <div className="grid md:grid-cols-2 gap-8">
                    <section className="bg-space-800 p-5 rounded-lg border border-slate-700">
                        <h3 className="text-slate-400 font-mono text-sm mb-3 uppercase">Key Facts</h3>
                        <ul className="space-y-2">
                            {data.coreMechanics.keyFacts.map((fact, i) => (
                                <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                                    <span className="text-neon-cyan mt-1">▹</span> {fact}
                                </li>
                            ))}
                        </ul>
                    </section>
                    <section className="bg-space-800 p-5 rounded-lg border border-slate-700">
                        <h3 className="text-slate-400 font-mono text-sm mb-3 uppercase">Architecture</h3>
                        <p className="text-sm text-slate-300">{data.coreMechanics.architectureOverview}</p>
                    </section>
                </div>

                <section>
                    <h3 className="text-slate-400 font-mono text-sm mb-3 uppercase">Mathematical Foundation</h3>
                    <div className="bg-black/30 p-4 rounded border border-slate-800 font-mono text-sm text-neon-green overflow-x-auto whitespace-pre-wrap break-words">
                        <MarkdownRenderer content={data.coreMechanics.mathematicalFoundation} />
                    </div>
                </section>
                
                {data.aiEnhancements.customAnalogy && (
                    <div className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 p-6 rounded-xl border border-purple-500/30">
                        <h3 className="text-neon-purple font-display text-sm mb-2 uppercase tracking-widest">NOVA-7 ANALOGY UPLINK</h3>
                        <p className="italic text-purple-200">"{data.aiEnhancements.customAnalogy}"</p>
                    </div>
                )}
            </div>
        )}

        {/* TACTICAL ANALYSIS */}
        {activeTab === 'tactical' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="grid md:grid-cols-2 gap-8">
                    <div className="bg-space-800 p-6 rounded-xl border border-slate-700 flex flex-col items-center">
                        <h3 className="w-full text-slate-400 font-mono text-sm mb-4 uppercase text-left">Performance Radar</h3>
                        <RadarDisplay stats={data.tacticalAnalysis.radarStats} />
                    </div>
                    <div className="space-y-6">
                        <div className="bg-space-800 p-6 rounded-xl border border-slate-700">
                            <h3 className="text-slate-400 font-mono text-sm mb-4 uppercase">Strategic Assessment</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <h4 className="text-neon-green text-xs font-bold mb-2 uppercase">Strengths</h4>
                                    <ul className="text-xs text-slate-300 space-y-1">
                                        {data.tacticalAnalysis.strategicAssessment.pros.map((p,i) => <li key={i}>+ {p}</li>)}
                                    </ul>
                                </div>
                                <div>
                                    <h4 className="text-neon-red text-xs font-bold mb-2 uppercase">Weaknesses</h4>
                                    <ul className="text-xs text-slate-300 space-y-1">
                                        {data.tacticalAnalysis.strategicAssessment.cons.map((c,i) => <li key={i}>- {c}</li>)}
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div className="bg-space-800 p-6 rounded-xl border border-slate-700">
                             <h3 className="text-slate-400 font-mono text-sm mb-2 uppercase">Rival Models</h3>
                             <div className="flex flex-wrap gap-2">
                                {data.tacticalAnalysis.rivalModels.map(m => (
                                    <span key={m} className="px-3 py-1 bg-slate-700 rounded text-xs text-slate-200 border border-slate-600">
                                        {m}
                                    </span>
                                ))}
                             </div>
                        </div>
                    </div>
                </div>
            </div>
        )}

        {/* ENGINE ROOM */}
        {activeTab === 'engine' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex justify-between items-end">
                    <h2 className="text-neon-cyan font-display text-xl flex items-center gap-2">
                        <Terminal size={24} /> IMPLEMENTATION BLUEPRINT
                    </h2>
                </div>
                
                <CodeBlock code={data.engineRoom.pythonSkeleton} />

                {/* Simulation Console */}
                <div className="bg-space-800 rounded-xl border border-cyan-900/50 overflow-hidden">
                    <div className="bg-space-900/50 p-4 border-b border-cyan-900/30 flex justify-between items-center">
                        <h3 className="text-neon-cyan font-display text-sm tracking-wider flex items-center gap-2">
                            <Sliders size={16} /> HYPERPARAMETER TUNING CONSOLE
                        </h3>
                        <span className="text-[10px] text-cyan-500 font-mono uppercase bg-cyan-900/20 px-2 py-1 rounded border border-cyan-900/50">
                            Simulation Active
                        </span>
                    </div>
                    
                    <div className="grid lg:grid-cols-12 gap-0">
                        {/* Controls Panel */}
                        <div className="lg:col-span-5 p-6 border-b lg:border-b-0 lg:border-r border-slate-700/50">
                             <div className="space-y-6">
                                {Object.entries(data.engineRoom.hyperparameters).map(([key, rawValue]) => {
                                    const value = rawValue as HyperparameterDetail;
                                    const { min, max } = parseRange(value.range);
                                    const currentVal = paramValues[key] || min;

                                    return (
                                    <div key={key} className="space-y-2">
                                        <div className="flex justify-between items-end">
                                            <label className="text-xs font-mono font-bold text-slate-300 uppercase">{key}</label>
                                            <span className="text-xs font-mono text-neon-cyan">{currentVal.toFixed(4)}</span>
                                        </div>
                                        <input 
                                            type="range" 
                                            min={min} 
                                            max={max} 
                                            step={(max - min) / 100}
                                            value={currentVal}
                                            onChange={(e) => handleParamChange(key, parseFloat(e.target.value))}
                                            className="w-full h-1.5 bg-space-950 rounded-lg appearance-none cursor-pointer accent-neon-cyan hover:accent-cyan-400"
                                        />
                                        <div className="flex justify-between text-[9px] text-slate-500 font-mono">
                                            <span>{min}</span>
                                            <span>{max}</span>
                                        </div>
                                        <p className="text-[10px] text-slate-400 leading-tight border-l border-slate-700 pl-2 mt-1">
                                            {value.impact}
                                        </p>
                                    </div>
                                )})}
                            </div>
                        </div>
                        
                        {/* Chart Panel */}
                        <div className="lg:col-span-7 p-6 bg-space-900/30 flex flex-col">
                            <h4 className="text-xs font-mono text-slate-400 uppercase mb-4 text-center">Projected Training Metrics</h4>
                            <div className="flex-1 min-h-[250px]">
                                <SimulationChart data={simulatedData} />
                            </div>
                            <div className="mt-4 grid grid-cols-2 gap-4 text-center">
                                <div className="bg-space-950 p-2 rounded border border-red-900/30">
                                    <div className="text-[10px] text-red-400 font-mono uppercase">Final Loss</div>
                                    <div className="text-lg text-white font-display">
                                        {simulatedData.loss[simulatedData.loss.length - 1]?.toFixed(4) || "0.00"}
                                    </div>
                                </div>
                                <div className="bg-space-950 p-2 rounded border border-green-900/30">
                                    <div className="text-[10px] text-green-400 font-mono uppercase">Final Accuracy</div>
                                    <div className="text-lg text-white font-display">
                                        {simulatedData.accuracy[simulatedData.accuracy.length - 1]?.toFixed(1) || "0.0"}%
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-space-800 p-5 rounded-lg border border-slate-700 h-full">
                        <h3 className="text-slate-400 font-mono text-sm mb-3 uppercase border-b border-slate-700 pb-2">Deployment Steps</h3>
                        <div className="space-y-3">
                        {data.engineRoom.implementationSteps.map((step, i) => (
                            <div key={i} className="flex gap-3">
                                <div className="flex-shrink-0 w-6 h-6 rounded bg-space-900 border border-slate-600 flex items-center justify-center text-neon-cyan text-xs font-mono font-bold">
                                {i + 1}
                                </div>
                                <div>
                                <h4 className="text-white text-sm font-bold mb-0.5">{step.step}</h4>
                                <p className="text-slate-400 text-xs leading-relaxed">{step.details}</p>
                                </div>
                            </div>
                        ))}
                        </div>
                </div>
            </div>
        )}

        {/* FIELD OPS */}
        {activeTab === 'field' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="grid md:grid-cols-3 gap-4">
                    {data.fieldOperations.useCases.map((useCase, i) => (
                        <div key={i} className="bg-space-800 p-4 rounded border border-slate-700 hover:border-cyan-500/50 transition-colors">
                            <div className="text-xs font-mono text-neon-cyan mb-1">{useCase.industry}</div>
                            <h4 className="font-bold text-white mb-2">{useCase.title}</h4>
                            <p className="text-xs text-slate-400">{useCase.description}</p>
                        </div>
                    ))}
                </div>

                {data.aiEnhancements.ethicsAlert && (
                    <div className="bg-red-950/20 border border-red-500/30 p-4 rounded flex gap-4 items-start">
                        <ShieldAlert className="text-red-500 shrink-0 mt-1" />
                        <div>
                            <h4 className="text-red-400 font-display text-sm uppercase tracking-wider">Ethics Protocol Alert</h4>
                            <p className="text-red-200/80 text-sm mt-1">{data.aiEnhancements.ethicsAlert}</p>
                        </div>
                    </div>
                )}

                 <div className="bg-space-800 p-5 rounded-lg border border-slate-700">
                    <h3 className="text-slate-400 font-mono text-sm mb-4 uppercase">Common Pitfalls & Solutions</h3>
                    <div className="space-y-4">
                        {data.fieldOperations.commonPitfalls.map((pitfall, i) => (
                             <div key={i} className="flex gap-4">
                                <div className="w-1 h-full bg-orange-500/50 rounded-full"></div>
                                <div>
                                    <div className="text-orange-400 text-sm font-bold">⚠️ {pitfall.warning}</div>
                                    <div className="text-slate-400 text-sm">Solution: {pitfall.solution}</div>
                                </div>
                             </div>
                        ))}
                    </div>
                </div>
            </div>
        )}

        {/* TRAINING */}
        {activeTab === 'training' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <QuizModule questions={data.officerTraining.quiz} />
                
                <div className="bg-space-800 p-6 rounded-xl border border-slate-700">
                    <h3 className="text-slate-400 font-mono text-sm mb-4 uppercase">Interview Prep (Classified)</h3>
                    <div className="space-y-4">
                        {data.officerTraining.interviewQuestions.map((q, i) => (
                            <div key={i} className="border-b border-slate-700 pb-4 last:border-0">
                                <div className="flex justify-between items-start mb-2">
                                    <span className="text-sm font-bold text-white">{q.question}</span>
                                    <span className={`text-xs px-2 py-0.5 rounded border ${
                                        q.difficulty === 'Easy' ? 'border-green-800 text-green-400' :
                                        q.difficulty === 'Medium' ? 'border-yellow-800 text-yellow-400' :
                                        'border-red-800 text-red-400'
                                    }`}>{q.difficulty}</span>
                                </div>
                                <p className="text-xs text-slate-400 italic">" {q.sampleAnswer} "</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        )}

      </div>
    </div>
  );
};

export default StudyGuideRenderer;