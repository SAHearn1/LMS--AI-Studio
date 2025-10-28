import React, { useState } from 'react';
import { Rect, Text, Group } from 'react-konva';
import type { TextNode as TextNodeType } from '../../types';
import { useCanvasState } from '../../hooks/useCanvasState';
import { generateSpeech, playAudio } from '../../services/geminiService';

interface TextNodeProps {
  node: TextNodeType;
  isSelected: boolean;
}

const TextNode: React.FC<TextNodeProps> = ({ node, isSelected }) => {
  const { setEditingNodeId } = useCanvasState();
  const [isReading, setIsReading] = useState(false);

  const handleDblClick = () => {
    setEditingNodeId(node.id);
  };
  
  const handleReadAloud = async (e: any) => {
    e.evt.stopPropagation();
    if(isReading) return;
    setIsReading(true);
    try {
      const audioBuffer = await generateSpeech(node.data.text);
      playAudio(audioBuffer);
    } catch(err) {
      console.error("Failed to generate speech", err);
      alert("Sorry, I couldn't read that aloud right now.");
    } finally {
      setIsReading(false);
    }
  }

  return (
    <Group>
      <Rect
        width={node.size.width}
        height={node.size.height}
        fill={node.data.backgroundColor}
        cornerRadius={8}
        shadowColor="rgba(0,0,0,0.1)"
        shadowBlur={10}
        shadowOffset={{ x: 0, y: 4 }}
        onDblClick={handleDblClick}
        onDblTap={handleDblClick}
      />
      <Text
        text={node.data.text}
        width={node.size.width}
        height={node.size.height}
        padding={16}
        fontSize={16}
        fontFamily="Inter, sans-serif"
        fill="#1f2937"
        verticalAlign="top"
        onDblClick={handleDblClick}
        onDblTap={handleDblClick}
        listening={false}
      />
      {isSelected && (
          <Group x={node.size.width - 32} y={8} onClick={handleReadAloud} onTap={handleReadAloud}>
            <Rect width={24} height={24} cornerRadius={4} fill="rgba(0,0,0,0.1)" />
            <Text 
              text={isReading ? '...' : '🔊'}
              fontSize={14}
              width={24}
              height={24}
              align="center"
              verticalAlign="middle"
              />
          </Group>
      )}
    </Group>
  );
};
export default TextNode;