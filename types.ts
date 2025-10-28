export enum NodeType {
  Text = 'text',
  Image = 'image',
  Video = 'video',
  Voice = 'voice',
  Link = 'link',
  Task = 'task',
  Draw = 'draw',
}

export interface NodePosition {
  x: number;
  y: number;
}

export interface NodeSize {
  width: number;
  height: number;
}

export interface BaseNode<T> {
  id: string;
  type: NodeType;
  position: NodePosition;
  size: NodeSize;
  rotation?: number;
  data: T;
}

export interface TextNodeData {
  text: string;
  backgroundColor: string;
}

export interface ImageNodeData {
  src: string;
  alt: string;
  prompt?: string;
  base64?: string | null; // Store base64 for AI operations
}

export interface VideoNodeData {
  src: string;
  thumbnailSrc: string;
  prompt: string;
}

export interface VoiceNodeData {
  title: string;
  transcript?: string;
}

export interface LinkNodeData {
  url: string;
  title: string;
}

export interface TaskItem {
  id: string;
  text: string;
  completed: boolean;
}
export interface TaskNodeData {
  title: string;
  tasks: TaskItem[];
}

export interface DrawNodeData {
  points: number[][]; // Array of lines, where each line is an array of points [x1, y1, x2, y2, ...]
  stroke: string;
  strokeWidth: number;
}


export type TextNode = BaseNode<TextNodeData> & { type: NodeType.Text };
export type ImageNode = BaseNode<ImageNodeData> & { type: NodeType.Image };
export type VideoNode = BaseNode<VideoNodeData> & { type: NodeType.Video };
export type VoiceNode = BaseNode<VoiceNodeData> & { type: NodeType.Voice };
export type LinkNode = BaseNode<LinkNodeData> & { type: NodeType.Link };
export type TaskNode = BaseNode<TaskNodeData> & { type: NodeType.Task };
export type DrawNode = BaseNode<DrawNodeData> & { type: NodeType.Draw };


export type CanvasNode = TextNode | ImageNode | VideoNode | VoiceNode | LinkNode | TaskNode | DrawNode;

export interface Connection {
  id: string;
  fromNodeId: string;
  toNodeId: string;
  label?: string;
  color?: string;
}

export interface LessonTask {
  text: string;
  completed: boolean;
}

export interface LessonPlan {
  title: string;
  tasks: LessonTask[];
}


export type ModalType = 'IMAGE_GEN' | 'VIDEO_GEN' | 'IMAGE_EDIT' | 'VIDEO_PLAYER' | 'LESSON_LOADER' | null;