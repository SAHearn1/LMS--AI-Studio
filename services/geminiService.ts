import type { CanvasNode, ImageNodeData } from "../types";
import { decode, decodeAudioData } from "../utils/helpers";
import { genAI, geminiApiKey } from "../src/lib/gemini";
import { Modality } from "@google/generative-ai";

if (!geminiApiKey) {
  console.error("Gemini API key not found. Please set the VITE_GEMINI_API_KEY environment variable.");
}

const getAi = () => genAI;

function serializeCanvasContent(nodes: Record<string, CanvasNode>, selectedNodeIds: string[]): string {
  if (Object.keys(nodes).length === 0) {
    return "The canvas is currently empty.";
  }

  const serializedNodes = Object.values(nodes).map(node => {
    let content = `Type: ${node.type}, Position: {x: ${Math.round(node.position.x)}, y: ${Math.round(node.position.y)}}`;
    if (selectedNodeIds.includes(node.id)) {
      content += ` (Currently Selected)`;
    }
    switch (node.type) {
      case 'text':
        content += `, Content: "${node.data.text}"`;
        break;
      case 'image':
        content += `, Alt Text: "${node.data.alt}"`;
        if (node.data.prompt) content += `, Original Prompt: "${node.data.prompt}"`;
        break;
      case 'video':
        content += `, Title: "${node.data.prompt}"`;
        break;
      case 'task':
        const tasks = node.data.tasks.map(t => `${t.text} (${t.completed ? 'completed' : 'pending'})`).join(', ');
        content += `, Title: "${node.data.title}", Tasks: [${tasks}]`;
        break;
      default:
        content += `, Title: "${(node.data as any).title || (node.data as any).url || 'Untitled'}"`;
    }
    return `- A node with ID ${node.id}. ${content}`;
  }).join('\n');

  return `Here is the current state of the user's canvas:\n${serializedNodes}`;
}

export const getAiAssistance = async (nodes: Record<string, CanvasNode>, selectedNodeIds: string[], userQuery: string, useThinkingMode: boolean): Promise<string> => {
  if (!geminiApiKey) {
    return "Error: Gemini API key is not configured.";
  }
  const ai = getAi();
  const canvasContext = serializeCanvasContent(nodes, selectedNodeIds);
  
  const fullPrompt = `You are an AI assistant in 'RootWork Canvas', a visual learning tool for K-12 students with trauma and neurodivergence. Your tone should be encouraging, patient, and supportive. Act as a gentle guide or a curious learning partner.

    **Canvas Context:**
    ${canvasContext}

    **Student's Request:**
    "${userQuery}"

    Based on the canvas context and the student's request, provide a helpful and encouraging response. If the request is about a selected node, focus on that.`;

  try {
    const model = useThinkingMode ? 'gemini-2.5-pro' : 'gemini-2.5-flash';
    const config = useThinkingMode ? { thinkingConfig: { thinkingBudget: 32768 } } : {};

    const response = await ai.models.generateContent({
      model,
      contents: fullPrompt,
      config,
    });
    return response.text;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return "I'm sorry, I'm having trouble connecting right now. Please try again in a moment.";
  }
};

export const generateImage = async (prompt: string, aspectRatio: '1:1' | '16:9' | '9:16' | '4:3' | '3:4'): Promise<string> => {
  if (!geminiApiKey) throw new Error("API key not configured");
  const ai = getAi();
  const response = await ai.models.generateImages({
    model: 'imagen-4.0-generate-001',
    prompt,
    config: {
      numberOfImages: 1,
      outputMimeType: 'image/jpeg',
      aspectRatio,
    },
  });
  return response.generatedImages[0].image.imageBytes;
};

export const analyzeImage = async (image: ImageNodeData, prompt: string): Promise<string> => {
  if (!geminiApiKey) throw new Error("API key not configured");
  if (!image.base64) throw new Error("Image data is missing");
  const ai = getAi();

  const imagePart = {
    inlineData: {
      data: image.base64,
      mimeType: 'image/jpeg',
    },
  };
  const textPart = { text: prompt };

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: { parts: [imagePart, textPart] },
  });
  return response.text;
};

export const editImage = async (image: ImageNodeData, prompt: string): Promise<string> => {
  if (!geminiApiKey) throw new Error("API key not configured");
  if (!image.base64) throw new Error("Image data is missing");
  const ai = getAi();

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [
        { inlineData: { data: image.base64, mimeType: 'image/jpeg' } },
        { text: prompt },
      ],
    },
    config: { responseModalities: [Modality.IMAGE] },
  });

  for (const part of response.candidates[0].content.parts) {
    if (part.inlineData) {
      return part.inlineData.data;
    }
  }
  throw new Error("No image was generated");
};

export const generateVideo = async (prompt: string, aspectRatio: '16:9' | '9:16', image?: ImageNodeData) => {
  if (!geminiApiKey) throw new Error("API key not configured");

  if (window.aistudio && !await window.aistudio.hasSelectedApiKey()) {
    await window.aistudio.openSelectKey();
  }

  const ai = getAi();

  let operation = await ai.models.generateVideos({
    model: 'veo-3.1-fast-generate-preview',
    prompt,
    ...(image && image.base64 && { image: { imageBytes: image.base64, mimeType: 'image/jpeg' } }),
    config: {
      numberOfVideos: 1,
      resolution: '720p',
      aspectRatio,
    }
  });

  while (!operation.done) {
    await new Promise(resolve => setTimeout(resolve, 5000));
    operation = await ai.operations.getVideosOperation({ operation: operation });
  }

  const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
  if (!downloadLink) throw new Error("Video generation failed.");
  
  const response = await fetch(`${downloadLink}&key=${geminiApiKey}`);
  if (!response.ok) {
    throw new Error(`Failed to download video: ${response.status} ${response.statusText}`);
  }
  const blob = await response.blob();
  return URL.createObjectURL(blob);
};

export const generateSpeech = async (text: string): Promise<AudioBuffer> => {
  if (!geminiApiKey) throw new Error("API key not configured");
  const ai = getAi();
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-preview-tts",
    contents: [{ parts: [{ text: `Say calmly and clearly: ${text}` }] }],
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: { voiceName: 'Kore' },
        },
      },
    },
  });

  const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  if (!base64Audio) throw new Error("No audio data returned");

  // Use standard AudioContext (avoid deprecated webkitAudioContext)
  const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
  if (!AudioContextClass) {
    throw new Error("AudioContext is not supported in this browser");
  }
  const outputAudioContext = new AudioContextClass({ sampleRate: 24000 });
  const audioBuffer = await decodeAudioData(
    decode(base64Audio),
    outputAudioContext,
    24000,
    1,
  );
  return audioBuffer;
};

export const playAudio = (buffer: AudioBuffer) => {
    // Use standard AudioContext (avoid deprecated webkitAudioContext)
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) {
      throw new Error("AudioContext is not supported in this browser");
    }
    const context = new AudioContextClass();
    const source = context.createBufferSource();
    source.buffer = buffer;
    source.connect(context.destination);
    source.start(0);
}
