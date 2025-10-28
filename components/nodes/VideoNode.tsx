import React from 'react';
import { Rect, Text, Group, Image as KonvaImage } from 'react-konva';
import useImage from 'use-image';
import type { VideoNode as VideoNodeType } from '../../types';
import { useCanvasState } from '../../hooks/useCanvasState';

interface VideoNodeProps {
    node: VideoNodeType;
    isSelected: boolean;
}

const VideoNode: React.FC<VideoNodeProps> = ({ node, isSelected }) => {
    const { openModal } = useCanvasState();
    // In a real app, you would generate a thumbnail. For now, we use a placeholder.
    // const [thumbnail] = useImage(node.data.thumbnailSrc || 'https://placehold.co/480x270/047857/FFF?text=Video', 'anonymous');

    const handleClick = () => {
        openModal('VIDEO_PLAYER', { src: node.data.src });
    }

    return (
        <Group onClick={handleClick} onTap={handleClick}>
            <Rect
                width={node.size.width}
                height={node.size.height}
                fill="#1f2937"
                cornerRadius={8}
                shadowColor="rgba(0,0,0,0.2)"
                shadowBlur={10}
                shadowOffset={{ x: 0, y: 4 }}
                stroke={isSelected ? '#2563EB' : '#4b5563'}
                strokeWidth={isSelected ? 3 : 1}
            />
            {/* {thumbnail && <KonvaImage image={thumbnail} width={node.size.width} height={node.size.height} cornerRadius={8} />} */}
            <Text
                text="▶️"
                fontSize={48}
                width={node.size.width}
                height={node.size.height}
                align="center"
                verticalAlign="middle"
            />
            <Text
                text={node.data.prompt}
                fontSize={12}
                fill="white"
                fontFamily="Inter, sans-serif"
                width={node.size.width - 20}
                height={40}
                x={10}
                y={node.size.height - 45}
                align="center"
                verticalAlign="middle"
                ellipsis={true}
                listening={false}
            />
        </Group>
    );
};

export default VideoNode;
