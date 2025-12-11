import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { NOVA_SYSTEM_PROMPT, MODEL_NAME } from '../constants';
import { StudyGuideData } from '../types';

// Initialize the API client
const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const generateResponse = async (
  prompt: string, 
  history: { role: 'user' | 'model'; content: string }[]
): Promise<{ text: string; studyGuide: StudyGuideData | null }> => {
  
  if (!apiKey) {
    throw new Error("Uplink Failure: API Key not detected in environment variables.");
  }

  try {
    const isSearchQuery = prompt.toLowerCase().startsWith('search') || 
                         prompt.toLowerCase().includes('study') || 
                         prompt.toLowerCase().includes('analyze') ||
                         prompt.length < 50; 

    const model = MODEL_NAME;
    
    const response = await ai.models.generateContent({
      model: model,
      contents: [
        ...history.map(h => ({ role: h.role, parts: [{ text: h.content }] })),
        { role: 'user', parts: [{ text: prompt }] }
      ],
      config: {
        systemInstruction: NOVA_SYSTEM_PROMPT,
        temperature: 0.7,
      }
    });

    const responseText = response.text || "";

    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    let studyGuide: StudyGuideData | null = null;

    if (jsonMatch) {
      try {
        const potentialJson = jsonMatch[0];
        const parsed = JSON.parse(potentialJson);
        if (parsed.modelName && parsed.coreMechanics) {
          studyGuide = parsed as StudyGuideData;
        }
      } catch (e) {
        console.warn("Detected JSON structure but failed to parse:", e);
      }
    }

    return {
      text: responseText,
      studyGuide
    };

  } catch (error) {
    console.error("Gemini Uplink Error:", error);
    throw error;
  }
};

export const fetchDashboardMissions = async (): Promise<any[]> => {
  if (!apiKey) return [];
  
  const prompt = `Generate 6 diverse, high-tech, and distinct Machine Learning study missions for a sci-fi interface.
  Return strictly a JSON array (no markdown formatting) of objects with this exact schema:
  {
    "title": "string (Max 3-4 words, e.g., 'Quantum Neural Networks')",
    "desc": "string (Max 10 words, sci-fi military style description)",
    "query": "string (The search query, e.g., 'Search Quantum ML')",
    "icon": "string (one of: 'zap', 'cpu', 'shield', 'globe', 'database', 'search', 'brain', 'eye', 'network', 'lock')"
  }
  
  Ensure varied topics (e.g., Vision, NLP, RL, Ethics, Hardware, Generative).`;

  try {
     const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      config: { 
        responseMimeType: 'application/json',
        temperature: 0.9 
      }
    });
    
    const text = response.text;
    if (!text) return [];
    
    // Clean up if markdown is present despite instructions
    const cleanText = text.replace(/```json|```/g, '');
    return JSON.parse(cleanText);
  } catch (e) {
    console.error("Mission uplink failed", e);
    return [];
  }
};