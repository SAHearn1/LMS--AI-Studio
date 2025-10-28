import React from 'react';
import { Rect, Text, Image as KonvaImage, Group } from 'react-konva';
import type { KonvaEventObject } from 'konva/lib/Node';
import type { ImageNode as ImageNodeType } from '../../types';
import { useCanvasState } from '../../hooks/useCanvasState';
import { analyzeImage } from '../../services/geminiService';
import { fileToBase64 } from '../../utils/helpers';
import useImage from 'use-image';

interface ImageNodeProps {
    node: ImageNodeType;
    isSelected: boolean;
}

interface KonvaButtonProps {
    text: string;
    x: number;
    y: number;
    onClick: (e: KonvaEventObject<MouseEvent | PointerEvent>) => void;
}

// Moved outside ImageNode component to prevent re-creation on every render.
const KonvaButton: React.FC<KonvaButtonProps> = ({ text, x, y, onClick }) => (
    <Group 
        x={x} 
        y={y} 
        onClick={onClick} 
        onTap={onClick} 
        onMouseEnter={e => {
            const stage = e.target.getStage();
            if (stage) stage.container().style.cursor = 'pointer';
        }}
        onMouseLeave={e => {
            const stage = e.target.getStage();
            if (stage) stage.container().style.cursor = 'default';
        }}
    >
        <Rect width={60} height={24} fill="rgba(0,0,0,0.5)" cornerRadius={12}/>
        <Text text={text} fill="white" fontSize={10} width={60} height={24} align="center" verticalAlign="middle" fontFamily="Inter, sans-serif"/>
    </Group>
);

const ImageNode: React.FC<ImageNodeProps> = ({ node, isSelected }) => {
    const { openModal, addNode, updateNodeData } = useCanvasState();
    const [image, status] = useImage(node.data.src, 'anonymous');

    React.useEffect(() => {
        if (status === 'loaded' && image && !node.data.base64) {
             fileToBase64(node.data.src).then(base64 => {
                 updateNodeData<ImageNodeType['data']>(node.id, { base64 });
             }).catch(err => console.error("Failed to convert image to base64", err));
        }
    }, [status, image, node.id, node.data.src, node.data.base64]);

    const handleAnalyze = async (e: KonvaEventObject<MouseEvent | PointerEvent>) => {
        e.evt.stopPropagation();
        if (!node.data.base64) {
            alert("Image data not ready yet, please wait.");
            return;
        }
        try {
            const description = await analyzeImage(node.data, "Describe this image for a K-12 student. What is happening here?");
            addNode({
                type: 'text',
                position: { x: node.position.x, y: node.position.y + node.size.height + 20 },
                size: { width: 250, height: 120 },
                data: { text: description, backgroundColor: '#E0E7FF' }
            });
        } catch (error) {
            console.error(error);
            alert("Sorry, I couldn't analyze the image.");
        }
    };
    
    const handleEdit = (e: KonvaEventObject<MouseEvent | PointerEvent>) => {
        e.evt.stopPropagation();
        if (!node.data.base64) {
            alert("Image data not ready yet, please wait.");
            return;
        }
        openModal('IMAGE_EDIT', { node });
    };

    const handleAnimate = (e: KonvaEventObject<MouseEvent | PointerEvent>) => {
        e.evt.stopPropagation();
        if (!node.data.base64) {
            alert("Image data not ready yet, please wait.");
            return;
        }
        openModal('VIDEO_GEN', { imageNode: node });
    };

    return (
        <Group>
            <Rect
                width={node.size.width}
                height={node.size.height}
                fill="#fff"
                cornerRadius={8}
                shadowColor="rgba(0,0,0,0.1)"
                shadowBlur={10}
                shadowOffset={{ x: 0, y: 4 }}
                stroke="#e5e7eb"
                strokeWidth={1}
            />
            {status === 'loaded' ? (
                <KonvaImage
                    image={image}
                    width={node.size.width}
                    height={node.size.height}
                    cornerRadius={8}
                />
            ) : (
                <Text
                    text={status === 'loading' ? "Loading..." : "Error"}
                    width={node.size.width}
                    height={node.size.height}
                    align="center"
                    verticalAlign="middle"
                    fontFamily="Inter, sans-serif"
                />
            )}
            {isSelected && (
                <Group y={node.size.height - 34}>
                    <KonvaButton text="Analyze" x={10} y={0} onClick={handleAnalyze} />
                    <KonvaButton text="Edit" x={80} y={0} onClick={handleEdit} />
                    <KonvaButton text="Animate" x={150} y={0} onClick={handleAnimate} />
                </Group>
            )}
        </Group>
    );
};

export default ImageNode;