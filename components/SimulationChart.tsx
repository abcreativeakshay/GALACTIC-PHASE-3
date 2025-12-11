import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface SimulationData {
  epochs: number[];
  loss: number[];
  accuracy: number[];
}

const SimulationChart: React.FC<{ data: SimulationData }> = ({ data }) => {
  const chartData = data.epochs.map((epoch, i) => ({
    epoch,
    loss: data.loss[i],
    accuracy: data.accuracy[i]
  }));

  return (
    <div className="w-full h-64 bg-space-900/50 rounded-lg p-4 border border-slate-800">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
          <XAxis 
            dataKey="epoch" 
            stroke="#64748b" 
            tick={{ fontSize: 10, fontFamily: 'monospace' }}
            label={{ value: 'EPOCHS', position: 'insideBottom', offset: -5, fill: '#64748b', fontSize: 10 }}
          />
          <YAxis 
            yAxisId="left" 
            stroke="#ef4444" 
            tick={{ fontSize: 10, fontFamily: 'monospace' }}
            domain={[0, 'auto']}
            label={{ value: 'LOSS', angle: -90, position: 'insideLeft', fill: '#ef4444', fontSize: 10 }}
          />
          <YAxis 
            yAxisId="right" 
            orientation="right" 
            stroke="#10b981" 
            tick={{ fontSize: 10, fontFamily: 'monospace' }}
            domain={[0, 100]}
            label={{ value: 'ACCURACY', angle: 90, position: 'insideRight', fill: '#10b981', fontSize: 10 }}
          />
          <Tooltip 
            contentStyle={{ backgroundColor: '#0B1221', borderColor: '#334155', fontSize: '12px' }}
          />
          <Legend wrapperStyle={{ fontSize: '10px', paddingTop: '10px' }} />
          <Line 
            yAxisId="left" 
            type="monotone" 
            dataKey="loss" 
            stroke="#ef4444" 
            strokeWidth={2} 
            dot={false} 
            activeDot={{ r: 4 }} 
            name="Loss Function"
          />
          <Line 
            yAxisId="right" 
            type="monotone" 
            dataKey="accuracy" 
            stroke="#10b981" 
            strokeWidth={2} 
            dot={false} 
            activeDot={{ r: 4 }} 
            name="Model Accuracy"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SimulationChart;