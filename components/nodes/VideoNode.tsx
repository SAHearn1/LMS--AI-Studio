import React from 'react';
import { Rect, Text, Group } from 'react-konva';
import type { VideoNode as VideoNodeType } from '../../types';
import { useCanvasState } from '../../hooks/useCanvasState';

interface VideoNodeProps {
    node: VideoNodeType;
    isSelected: boolean;
}

const VideoNode: React.FC<VideoNodeProps> = ({ node, isSelected }) => {
    const openModal = useCanvasState(state => state.openModal);

    const handleClick = () => {
        openModal('VIDEO_PLAYER', { src: node.data.src });
    }

    return (
        <Group 
            onClick={handleClick} 
            onTap={handleClick}
            onMouseEnter={e => {
                const stage = e.target.getStage();
                if (stage) stage.container().style.cursor = 'pointer';
            }}
            onMouseLeave={e => {
                const stage = e.target.getStage();
                if (stage) stage.container().style.cursor = 'default';
            }}
        >
            <Rect
                width={node.size.width}
                height={node.size.height}
                fill="#1f2937"
                cornerRadius={8}
                shadowColor="rgba(0,0,0,0.1)"
                shadowBlur={10}
                shadowOffset={{ x: 0, y: 4 }}
                stroke={isSelected ? '#2563EB' : '#4b5563'}
                strokeWidth={isSelected ? 2 : 1}
            />
            {/* Play Icon */}
            <Text
                text="▶"
                fontSize={48}
                fill="white"
                width={node.size.width}
                height={node.size.height}
                align="center"
                verticalAlign="middle"
                opacity={0.8}
                listening={false}
            />
             <Text
                text={node.data.prompt}
                fontSize={12}
                fill="white"
                width={node.size.width}
                height={40}
                padding={10}
                y={node.size.height - 40}
                align="center"
                verticalAlign="middle"
                fontFamily="Inter, sans-serif"
                fontStyle="italic"
                wrap="char"
                ellipsis={true}
                listening={false}
            />
        </Group>
    );
};

export default VideoNode;
