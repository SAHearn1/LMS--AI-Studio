import React from 'react';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import type { KonvaEventObject } from 'konva/lib/Node';
import type { Stage } from 'konva/lib/Stage';
import { NodeType, type CanvasNode, type Connection, type NodePosition, type ModalType, type LessonPlan } from '../types';
import {
  TextNodeData,
  ImageNodeData,
  VideoNodeData as TVideoNodeData,
  VoiceNodeData,
  LinkNodeData,
  TaskNodeData,
  DrawNodeData
} from '../types';

interface CanvasState {
  nodes: Record<string, CanvasNode>;
  connections: Record<string, Connection>;
  selectedNodeIds: string[];
  stage: Stage | null;
  editingNodeId: string | null;
  modal: {
    type: ModalType;
    data?: any;
  };
  lessonPlan: LessonPlan | null;
  isLessonPanelOpen: boolean;
}

interface CanvasActions {
  setStage: (stage: Stage | null) => void;
  addNode: (node: Omit<CanvasNode, 'id'>) => CanvasNode;
  updateNode: (id: string, updatedNode: Partial<CanvasNode>) => void;
  updateNodeData: <T>(id: string, data: Partial<T>) => void;
  deleteSelectedNodes: () => void;
  selectNode: (id: string, multiSelect?: boolean) => void;
  clearSelection: () => void;
  handleDragEnd: (e: KonvaEventObject<DragEvent>, id: string) => void;
  zoomIn: () => void;
  zoomOut: () => void;
  zoomToFit: () => void;
  setEditingNodeId: (id: string | null) => void;
  openModal: (type: ModalType, data?: any) => void;
  closeModal: () => void;
  setLessonPlan: (plan: { title: string; tasks: string[] } | null) => void;
  toggleTaskCompletion: (taskIndex: number) => void;
  toggleLessonPanel: () => void;
}

const defaultNodes: Record<string, CanvasNode> = {
  'node-1': {
    id: 'node-1',
    type: NodeType.Text,
    position: { x: 150, y: 150 },
    size: { width: 250, height: 120 },
    data: { text: 'Welcome to RootWork Canvas! 🌱\n\nDouble-click to edit this note.', backgroundColor: '#A7F3D0' }
  },
  'node-2': {
    id: 'node-2',
    type: NodeType.Text,
    position: { x: 500, y: 250 },
    size: { width: 250, height: 160 },
    data: { text: "This is a visual workspace to organize your thoughts.\n\nUse the toolbar to add notes, or start a new lesson!", backgroundColor: '#FEF3C7' }
  }
};


export const useCanvasState = create<CanvasState & CanvasActions>()(
  immer((set, get) => ({
    nodes: defaultNodes,
    connections: {},
    selectedNodeIds: [],
    stage: null,
    editingNodeId: null,
    modal: { type: null, data: null },
    lessonPlan: null,
    isLessonPanelOpen: false,

    setStage: (stage) => {
      set({ stage: stage });
    },

    addNode: (node) => {
      const id = `node-${Date.now()}`;
      const newNode = { ...node, id } as CanvasNode;
      set((state) => {
        state.nodes[id] = newNode;
      });
      return newNode;
    },
    updateNode: (id, updatedNode) => {
        set((state) => {
            if (state.nodes[id]) {
                state.nodes[id] = { ...state.nodes[id], ...updatedNode };
            }
        });
    },
    updateNodeData: (id, data) => {
      set((state) => {
        if(state.nodes[id]) {
          state.nodes[id].data = { ...state.nodes[id].data, ...data };
        }
      });
    },
    deleteSelectedNodes: () => {
        set((state) => {
            state.selectedNodeIds.forEach(id => {
                delete state.nodes[id];
            });
            state.selectedNodeIds = [];
        });
    },
    selectNode: (id, multiSelect = false) => {
      set((state) => {
        if (state.editingNodeId) return; // Prevent selection while editing
        if (multiSelect) {
          if (state.selectedNodeIds.includes(id)) {
            state.selectedNodeIds = state.selectedNodeIds.filter(nodeId => nodeId !== id);
          } else {
            state.selectedNodeIds.push(id);
          }
        } else {
          state.selectedNodeIds = [id];
        }
      });
    },
    clearSelection: () => {
      if (get().editingNodeId) return;
      set({ selectedNodeIds: [] });
    },
    handleDragEnd: (e, id) => {
      set((state) => {
        if (state.nodes[id]) {
          state.nodes[id].position = { x: e.target.x(), y: e.target.y() };
        }
      });
    },
    zoomIn: () => {
      const stage = get().stage;
      if (!stage) return;
      const oldScale = stage.scaleX();
      const newScale = oldScale * 1.2;
      // TODO: zoom to center
      stage.scale({ x: newScale, y: newScale });
    },
    zoomOut: () => {
      const stage = get().stage;
      if (!stage) return;
      const oldScale = stage.scaleX();
      const newScale = oldScale / 1.2;
      // TODO: zoom to center
      stage.scale({ x: newScale, y: newScale });
    },
    zoomToFit: () => {
        const stage = get().stage;
        const nodes = Object.values(get().nodes);
        if (!stage || nodes.length === 0) return;
        
        const padding = 100;
        const { width, height } = stage.getSize();
        
        let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
        nodes.forEach((node: CanvasNode) => {
            minX = Math.min(minX, node.position.x);
            minY = Math.min(minY, node.position.y);
            maxX = Math.max(maxX, node.position.x + node.size.width);
            maxY = Math.max(maxY, node.position.y + node.size.height);
        });

        const nodesWidth = maxX - minX;
        const nodesHeight = maxY - minY;

        if (nodesWidth === 0 || nodesHeight === 0) return;

        const scaleX = (width - padding * 2) / nodesWidth;
        const scaleY = (height - padding * 2) / nodesHeight;
        const newScale = Math.min(scaleX, scaleY, 1.5);

        const newX = -minX * newScale + (width - nodesWidth * newScale) / 2;
        const newY = -minY * newScale + (height - nodesHeight * newScale) / 2;
        
        stage.scale({ x: newScale, y: newScale });
        stage.position({ x: newX, y: newY });
    },
    setEditingNodeId: (id) => {
      set({ editingNodeId: id, selectedNodeIds: id ? [id] : [] });
    },
    openModal: (type, data) => {
      set({ modal: { type, data } });
    },
    closeModal: () => {
      set({ modal: { type: null, data: undefined } });
    },
    setLessonPlan: (plan) => {
      if (plan) {
        set({
          lessonPlan: {
            title: plan.title,
            tasks: plan.tasks.map(text => ({ text, completed: false })),
          },
          isLessonPanelOpen: true,
        });
      } else {
        set({ lessonPlan: null, isLessonPanelOpen: false });
      }
    },
    toggleTaskCompletion: (taskIndex) => {
      set(state => {
        if (state.lessonPlan && state.lessonPlan.tasks[taskIndex]) {
          state.lessonPlan.tasks[taskIndex].completed = !state.lessonPlan.tasks[taskIndex].completed;
        }
      });
    },
    toggleLessonPanel: () => {
      set(state => ({ isLessonPanelOpen: !state.isLessonPanelOpen }));
    },
  }))
);