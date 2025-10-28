import React, { useRef, useEffect } from 'react';
import { Group, Transformer } from 'react-konva';
import type Konva from 'konva';
import { NodeType, type CanvasNode } from '../types';
import { useCanvasState } from '../hooks/useCanvasState';
import TextNode from './nodes/TextNode';
import ImageNode from './nodes/ImageNode';
import VideoNode from './nodes/VideoNode';

interface NodeComponentProps {
  node: CanvasNode;
  isSelected: boolean;
}

const NodeComponent: React.FC<NodeComponentProps> = ({ node, isSelected }) => {
  const shapeRef = useRef<Konva.Group>(null);
  const trRef = useRef<Konva.Transformer>(null);
  
  const selectNode = useCanvasState(state => state.selectNode);
  const handleDragEnd = useCanvasState(state => state.handleDragEnd);
  const updateNode = useCanvasState(state => state.updateNode);
  const editingNodeId = useCanvasState(state => state.editingNodeId);

  const isEditing = editingNodeId === node.id;

  useEffect(() => {
    if (isSelected && !isEditing && trRef.current) {
      trRef.current.nodes([shapeRef.current!]);
      trRef.current.getLayer()?.batchDraw();
    }
  }, [isSelected, isEditing]);

  const onSelect = (e: Konva.KonvaEventObject<MouseEvent>) => {
    e.evt.stopPropagation();
    selectNode(node.id, e.evt.shiftKey);
  };

  const renderNode = () => {
    switch (node.type) {
      case 'text':
        return <TextNode node={node} isSelected={isSelected} />;
      case 'image':
        return <ImageNode node={node} isSelected={isSelected} />;
      case 'video':
        return <VideoNode node={node} isSelected={isSelected} />;
      default:
        // FIX: Use NodeType.Text to match the expected type for the TextNode component's node prop.
        return <TextNode isSelected={false} node={{...node, type: NodeType.Text, data: {text: `Unsupported: ${node.type}`, backgroundColor: '#fecaca'}}} />;
    }
  };

  return (
    <React.Fragment>
      <Group
        ref={shapeRef}
        id={node.id}
        x={node.position.x}
        y={node.position.y}
        width={node.size.width}
        height={node.size.height}
        draggable={!isEditing}
        onClick={onSelect}
        onTap={onSelect}
        onDragEnd={(e) => handleDragEnd(e, node.id)}
        onTransformEnd={() => {
          const transformedNode = shapeRef.current;
          if (transformedNode) {
            const scaleX = transformedNode.scaleX();
            const scaleY = transformedNode.scaleY();
            transformedNode.scaleX(1);
            transformedNode.scaleY(1);
            updateNode(node.id, {
                position: {x: transformedNode.x(), y: transformedNode.y()},
                size: {
                    width: Math.max(50, transformedNode.width() * scaleX),
                    height: Math.max(50, transformedNode.height() * scaleY),
                },
                rotation: transformedNode.rotation()
            });
          }
        }}
      >
        {renderNode()}
      </Group>
      {isSelected && !isEditing && (
        <Transformer
          ref={trRef}
          boundBoxFunc={(oldBox, newBox) => {
            if (newBox.width < 50 || newBox.height < 50) {
              return oldBox;
            }
            return newBox;
          }}
        />
      )}
    </React.Fragment>
  );
};

export default NodeComponent;