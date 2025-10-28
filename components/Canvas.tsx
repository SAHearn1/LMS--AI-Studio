import React, { useEffect, useRef } from 'react';
import { Stage, Layer } from 'react-konva';
import type Konva from 'konva';
import { useCanvasState } from '../hooks/useCanvasState';
import NodeComponent from './NodeComponent';
import TextEditor from './TextEditor';
import type { CanvasNode } from '../types';

const Canvas: React.FC = () => {
  const stageRef = useRef<Konva.Stage>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { nodes, selectedNodeIds, stage, setStage, setStageRef, clearSelection, deleteSelectedNodes, editingNodeId } = useCanvasState(state => ({
      nodes: state.nodes,
      selectedNodeIds: state.selectedNodeIds,
      stage: state.stage,
      setStage: state.setStage,
      setStageRef: state.setStageRef,
      clearSelection: state.clearSelection,
      deleteSelectedNodes: state.deleteSelectedNodes,
      editingNodeId: state.editingNodeId,
  }));

  const editingNode = editingNodeId ? nodes[editingNodeId] : null;

  useEffect(() => {
    setStageRef(stageRef);
  }, [setStageRef]);

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        stageRef.current?.width(containerRef.current.offsetWidth);
        stageRef.current?.height(containerRef.current.offsetHeight);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    const handleKeyDown = (e: KeyboardEvent) => {
        if((e.key === 'Delete' || e.key === 'Backspace') && selectedNodeIds.length > 0 && !editingNodeId) {
            deleteSelectedNodes();
        }
    }
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedNodeIds, deleteSelectedNodes, editingNodeId]);

  const handleWheel = (e: Konva.KonvaEventObject<WheelEvent>) => {
    e.evt.preventDefault();
    const scaleBy = 1.1;
    const stage = e.target.getStage();
    if (!stage) return;

    const oldScale = stage.scaleX();
    const pointer = stage.getPointerPosition();
    if (!pointer) return;

    const mousePointTo = {
      x: (pointer.x - stage.x()) / oldScale,
      y: (pointer.y - stage.y()) / oldScale,
    };

    let direction = e.evt.deltaY > 0 ? -1 : 1;
    const newScale = direction > 0 ? oldScale * scaleBy : oldScale / scaleBy;

    const newPos = {
      x: pointer.x - mousePointTo.x * newScale,
      y: pointer.y - mousePointTo.y * newScale,
    };
    
    stage.scale({ x: newScale, y: newScale });
    stage.position(newPos);
    setStage(newScale, newPos);
  };
  
  const handleStageClick = (e: Konva.KonvaEventObject<MouseEvent>) => {
    if (e.target === e.target.getStage()) {
      clearSelection();
    }
  };

  return (
    <div ref={containerRef} className="w-full h-full bg-stone-50 cursor-grab active:cursor-grabbing relative">
      <Stage
        ref={stageRef}
        width={window.innerWidth}
        height={window.innerHeight}
        draggable={!editingNodeId}
        onWheel={handleWheel}
        onDragEnd={(e) => setStage(stage.scale, e.target.position())}
        onClick={handleStageClick}
        scaleX={stage.scale}
        scaleY={stage.scale}
        x={stage.position.x}
        y={stage.position.y}
      >
        <Layer>
          {Object.values(nodes).map((node: CanvasNode) => (
            <NodeComponent key={node.id} node={node} isSelected={selectedNodeIds.includes(node.id)} />
          ))}
        </Layer>
      </Stage>
      {editingNode && editingNode.type === 'text' && (
          <TextEditor node={editingNode} />
      )}
    </div>
  );
};

export default Canvas;
