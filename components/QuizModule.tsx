import React, { useState } from 'react';
import { QuizQuestion } from '../types';
import { CheckCircle, XCircle, Award, ChevronRight } from 'lucide-react';

interface QuizModuleProps {
  questions: QuizQuestion[];
}

const QuizModule: React.FC<QuizModuleProps> = ({ questions }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [xp, setXp] = useState(0);

  const currentQ = questions[currentIndex];

  const handleSelect = (index: number) => {
    if (isAnswered) return;
    setSelectedOption(index);
    setIsAnswered(true);
    
    if (index === currentQ.correctAnswer) {
      setXp(prev => prev + currentQ.xpReward);
    }
  };

  const nextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    }
  };

  return (
    <div className="bg-space-800 border border-slate-700 p-6 rounded-xl relative overflow-hidden">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-display text-lg text-neon-amber flex items-center gap-2">
            <Award className="text-neon-amber" size={20} />
            OFFICER TRAINING :: SIMULATION {currentIndex + 1}/{questions.length}
        </h3>
        <div className="bg-black/40 px-3 py-1 rounded text-cyan-400 font-mono text-sm border border-cyan-900">
            XP: {xp}
        </div>
      </div>

      <div className="mb-6">
        <p className="text-lg font-medium text-slate-200 mb-4">{currentQ.question}</p>
        <div className="space-y-3">
            {currentQ.options.map((opt, idx) => {
                let btnClass = "w-full text-left p-4 rounded-lg border transition-all duration-200 flex justify-between items-center ";
                if (!isAnswered) {
                    btnClass += "border-slate-700 bg-space-900 hover:border-cyan-500/50 hover:bg-space-700";
                } else if (idx === currentQ.correctAnswer) {
                    btnClass += "border-neon-green bg-neon-green/10 text-neon-green";
                } else if (idx === selectedOption) {
                    btnClass += "border-neon-red bg-neon-red/10 text-neon-red";
                } else {
                    btnClass += "border-slate-800 bg-space-900 opacity-50";
                }

                return (
                    <button 
                        key={idx}
                        onClick={() => handleSelect(idx)}
                        className={btnClass}
                        disabled={isAnswered}
                    >
                        <span>{opt}</span>
                        {isAnswered && idx === currentQ.correctAnswer && <CheckCircle size={18} />}
                        {isAnswered && idx === selectedOption && idx !== currentQ.correctAnswer && <XCircle size={18} />}
                    </button>
                )
            })}
        </div>
      </div>

      {isAnswered && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className={`p-4 rounded-lg mb-4 ${selectedOption === currentQ.correctAnswer ? 'bg-neon-green/10 border-l-4 border-neon-green' : 'bg-neon-red/10 border-l-4 border-neon-red'}`}>
                <p className="text-slate-300 text-sm">
                    <span className="font-bold block mb-1">TACTICAL DEBRIEF:</span>
                    {currentQ.explanation}
                </p>
            </div>
            
            {currentIndex < questions.length - 1 ? (
                <button 
                    onClick={nextQuestion}
                    className="w-full py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-display font-bold tracking-wider rounded transition-colors flex justify-center items-center gap-2"
                >
                    NEXT SIMULATION <ChevronRight size={16} />
                </button>
            ) : (
                <div className="text-center py-4 text-neon-cyan font-display animate-pulse">
                    TRAINING MODULE COMPLETE
                </div>
            )}
        </div>
      )}
    </div>
  );
};

export default QuizModule;
