import React from 'react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip
} from 'recharts';
import { RadarStats } from '../types';

interface RadarDisplayProps {
  stats: RadarStats;
}

const RadarDisplay: React.FC<RadarDisplayProps> = ({ stats }) => {
  const data = [
    { subject: 'Speed', A: stats.speed, fullMark: 100 },
    { subject: 'Accuracy', A: stats.accuracy, fullMark: 100 },
    { subject: 'Scalability', A: stats.scalability, fullMark: 100 },
    { subject: 'Interpretability', A: stats.interpretability, fullMark: 100 },
    { subject: 'Training Diff.', A: stats.trainingDifficulty, fullMark: 100 },
    { subject: 'Cost', A: stats.resourceCost, fullMark: 100 },
  ];

  return (
    <div className="h-64 w-full relative">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
            <PolarGrid stroke="#1e293b" />
            <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 10, fontFamily: 'Orbitron' }} />
            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
            <Radar
              name="Tactical Stats"
              dataKey="A"
              stroke="#06b6d4"
              strokeWidth={2}
              fill="#06b6d4"
              fillOpacity={0.3}
            />
            <Tooltip 
                contentStyle={{ backgroundColor: '#0B1221', borderColor: '#06b6d4', color: '#fff' }}
                itemStyle={{ color: '#06b6d4' }}
            />
          </RadarChart>
        </ResponsiveContainer>
        {/* Sci-fi Overlay Lines */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none border border-cyan-500/10 rounded-full opacity-20 animate-pulse-slow"></div>
    </div>
  );
};

export default RadarDisplay;
