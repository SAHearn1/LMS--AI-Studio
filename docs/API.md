# API Documentation

## Overview

This document provides comprehensive API documentation for the RootWork Canvas application, including the Canvas State API, Gemini AI Service API, Type Definitions, and HTTP API endpoints.

## Table of Contents

- [Canvas State API](#canvas-state-api)
- [Gemini AI Service API](#gemini-ai-service-api)
- [Type Definitions](#type-definitions)
- [HTTP API Routes](#http-api-routes)
- [Component APIs](#component-apis)
- [Utility Functions](#utility-functions)

---

## Canvas State API

The Canvas State API is managed by Zustand and provides all state management functionality for the canvas.

### Hook Usage

```typescript
import { useCanvasState } from './hooks/useCanvasState';

// Select specific state
const nodes = useCanvasState(state => state.nodes);

// Select multiple properties
const { addNode, deleteSelectedNodes } = useCanvasState(state => ({
  addNode: state.addNode,
  deleteSelectedNodes: state.deleteSelectedNodes,
}));
```

### State Interface

```typescript
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
```

### Actions

#### Node Management

##### `addNode(node: Omit<CanvasNode, 'id'>): CanvasNode`

Adds a new node to the canvas.

**Parameters:**
- `node`: Node object without an ID (ID is auto-generated)

**Returns:** The created node with generated ID

**Example:**
```typescript
const newNode = addNode({
  type: NodeType.Text,
  position: { x: 100, y: 100 },
  size: { width: 200, height: 100 },
  data: {
    text: 'Hello World',
    backgroundColor: '#ffffff',
  },
});
```

##### `updateNode(id: string, updatedNode: Partial<CanvasNode>): void`

Updates an existing node's properties.

**Parameters:**
- `id`: Node ID
- `updatedNode`: Partial node object with properties to update

**Example:**
```typescript
updateNode('node-123', {
  position: { x: 150, y: 150 },
  rotation: 45,
});
```

##### `updateNodeData<T>(id: string, data: Partial<T>): void`

Updates a node's data field.

**Parameters:**
- `id`: Node ID
- `data`: Partial data object to merge with existing data

**Example:**
```typescript
updateNodeData<TextNodeData>('node-123', {
  text: 'Updated text',
});
```

##### `deleteSelectedNodes(): void`

Deletes all currently selected nodes.

**Example:**
```typescript
deleteSelectedNodes();
```

#### Selection Management

##### `selectNode(id: string, multiSelect?: boolean): void`

Selects a node on the canvas.

**Parameters:**
- `id`: Node ID to select
- `multiSelect`: If true, adds to selection; if false, replaces selection (default: false)

**Example:**
```typescript
// Single select
selectNode('node-123');

// Multi-select (add to selection)
selectNode('node-456', true);
```

##### `clearSelection(): void`

Clears all node selections.

**Example:**
```typescript
clearSelection();
```

#### Canvas Operations

##### `setStage(stage: Stage | null): void`

Sets the Konva stage reference.

**Parameters:**
- `stage`: Konva Stage instance or null

**Example:**
```typescript
setStage(stageRef.current);
```

##### `handleDragEnd(e: KonvaEventObject<DragEvent>, id: string): void`

Handles node drag end events and updates position.

**Parameters:**
- `e`: Konva drag event object
- `id`: Node ID being dragged

**Example:**
```typescript
<Group
  onDragEnd={(e) => handleDragEnd(e, node.id)}
/>
```

##### `zoomIn(): void`

Zooms in on the canvas.

**Example:**
```typescript
<button onClick={zoomIn}>Zoom In</button>
```

##### `zoomOut(): void`

Zooms out on the canvas.

**Example:**
```typescript
<button onClick={zoomOut}>Zoom Out</button>
```

##### `zoomToFit(): void`

Fits all nodes within the visible canvas area.

**Example:**
```typescript
<button onClick={zoomToFit}>Fit to Screen</button>
```

#### Editing State

##### `setEditingNodeId(id: string | null): void`

Sets the currently editing node.

**Parameters:**
- `id`: Node ID being edited, or null to clear

**Example:**
```typescript
setEditingNodeId('node-123');
```

#### Modal Management

##### `openModal(type: ModalType, data?: any): void`

Opens a modal dialog.

**Parameters:**
- `type`: Type of modal to open
- `data`: Optional data to pass to the modal

**Modal Types:**
- `'IMAGE_GEN'`: Image generation modal
- `'VIDEO_GEN'`: Video generation modal
- `'IMAGE_EDIT'`: Image editing modal
- `'VIDEO_PLAYER'`: Video player modal
- `'LESSON_LOADER'`: Lesson loader modal

**Example:**
```typescript
openModal('IMAGE_GEN', {
  nodeId: 'node-123',
});
```

##### `closeModal(): void`

Closes the currently open modal.

**Example:**
```typescript
<button onClick={closeModal}>Close</button>
```

#### Lesson Plan Management

##### `setLessonPlan(plan: { title: string; tasks: string[] } | null): void`

Sets or clears the lesson plan.

**Parameters:**
- `plan`: Lesson plan object with title and tasks array, or null to clear

**Example:**
```typescript
setLessonPlan({
  title: 'Introduction to Photosynthesis',
  tasks: [
    'Define photosynthesis',
    'Explain the role of chlorophyll',
    'Describe the process steps',
  ],
});
```

##### `toggleTaskCompletion(taskIndex: number): void`

Toggles the completion status of a lesson plan task.

**Parameters:**
- `taskIndex`: Index of the task to toggle

**Example:**
```typescript
toggleTaskCompletion(0); // Toggle first task
```

##### `toggleLessonPanel(): void`

Toggles the visibility of the lesson plan panel.

**Example:**
```typescript
<button onClick={toggleLessonPanel}>Toggle Panel</button>
```

---

## Gemini AI Service API

The Gemini AI Service provides AI-powered functionality through Google's Generative AI.

### Import

```typescript
import {
  generateImage,
  editImage,
  generateVideo,
  sendMessage,
} from './services/geminiService';
```

### Functions

#### `generateImage(prompt: string, nodes: Record<string, CanvasNode>, selectedNodeIds: string[]): Promise<string>`

Generates an image based on a text prompt with canvas context.

**Parameters:**
- `prompt`: Text description of the image to generate
- `nodes`: Current canvas nodes for context
- `selectedNodeIds`: Currently selected node IDs

**Returns:** Promise resolving to image URL (data URL)

**Example:**
```typescript
const imageUrl = await generateImage(
  'A serene mountain landscape at sunset',
  nodes,
  selectedNodeIds
);
```

**Error Handling:**
```typescript
try {
  const imageUrl = await generateImage(prompt, nodes, selectedNodeIds);
} catch (error) {
  console.error('Image generation failed:', error);
}
```

#### `editImage(prompt: string, imageNode: ImageNode, nodes: Record<string, CanvasNode>, selectedNodeIds: string[]): Promise<string>`

Edits an existing image based on a text prompt.

**Parameters:**
- `prompt`: Text description of the desired edits
- `imageNode`: The image node to edit
- `nodes`: Current canvas nodes for context
- `selectedNodeIds`: Currently selected node IDs

**Returns:** Promise resolving to edited image URL

**Example:**
```typescript
const editedImageUrl = await editImage(
  'Add a rainbow to the sky',
  imageNode,
  nodes,
  selectedNodeIds
);
```

#### `generateVideo(prompt: string, nodes: Record<string, CanvasNode>, selectedNodeIds: string[]): Promise<{ videoUrl: string; thumbnailUrl: string }>`

Generates a video based on a text prompt.

**Parameters:**
- `prompt`: Text description of the video to generate
- `nodes`: Current canvas nodes for context
- `selectedNodeIds`: Currently selected node IDs

**Returns:** Promise resolving to object with videoUrl and thumbnailUrl

**Example:**
```typescript
const { videoUrl, thumbnailUrl } = await generateVideo(
  'Animated explanation of the water cycle',
  nodes,
  selectedNodeIds
);
```

#### `sendMessage(message: string, nodes: Record<string, CanvasNode>, selectedNodeIds: string[]): Promise<string>`

Sends a message to the AI assistant with canvas context.

**Parameters:**
- `message`: User's message/question
- `nodes`: Current canvas nodes for context
- `selectedNodeIds`: Currently selected node IDs

**Returns:** Promise resolving to AI response text

**Example:**
```typescript
const response = await sendMessage(
  'Suggest improvements for this lesson',
  nodes,
  selectedNodeIds
);
```

---

## Type Definitions

### Node Types

#### `NodeType` Enum

```typescript
enum NodeType {
  Text = 'text',
  Image = 'image',
  Video = 'video',
  Voice = 'voice',
  Link = 'link',
  Task = 'task',
  Draw = 'draw',
}
```

#### Base Interfaces

##### `NodePosition`

```typescript
interface NodePosition {
  x: number;  // X coordinate on canvas
  y: number;  // Y coordinate on canvas
}
```

##### `NodeSize`

```typescript
interface NodeSize {
  width: number;   // Width in pixels
  height: number;  // Height in pixels
}
```

##### `BaseNode<T>`

```typescript
interface BaseNode<T> {
  id: string;              // Unique identifier
  type: NodeType;          // Node type
  position: NodePosition;  // Position on canvas
  size: NodeSize;          // Size dimensions
  rotation?: number;       // Rotation angle in degrees
  data: T;                 // Type-specific data
}
```

#### Node Data Types

##### `TextNodeData`

```typescript
interface TextNodeData {
  text: string;              // Text content
  backgroundColor: string;    // Background color (hex)
}
```

##### `ImageNodeData`

```typescript
interface ImageNodeData {
  src: string;           // Image URL
  alt: string;           // Alt text description
  prompt?: string;       // Original generation prompt
  base64?: string | null; // Base64 encoded image for AI operations
}
```

##### `VideoNodeData`

```typescript
interface VideoNodeData {
  src: string;           // Video URL
  thumbnailSrc: string;  // Thumbnail image URL
  prompt: string;        // Video description/prompt
}
```

##### `VoiceNodeData`

```typescript
interface VoiceNodeData {
  title: string;         // Voice note title
  transcript?: string;   // Optional transcript
}
```

##### `LinkNodeData`

```typescript
interface LinkNodeData {
  url: string;   // Link URL
  title: string; // Link title/description
}
```

##### `TaskNodeData`

```typescript
interface TaskItem {
  id: string;          // Task item ID
  text: string;        // Task text
  completed: boolean;  // Completion status
}

interface TaskNodeData {
  title: string;        // Task list title
  tasks: TaskItem[];    // Array of tasks
}
```

##### `DrawNodeData`

```typescript
interface DrawNodeData {
  points: number[][];  // Array of lines, each line is array of points [x1, y1, x2, y2, ...]
  stroke: string;      // Stroke color (hex)
  strokeWidth: number; // Line width in pixels
}
```

#### Node Type Aliases

```typescript
type TextNode = BaseNode<TextNodeData> & { type: NodeType.Text };
type ImageNode = BaseNode<ImageNodeData> & { type: NodeType.Image };
type VideoNode = BaseNode<VideoNodeData> & { type: NodeType.Video };
type VoiceNode = BaseNode<VoiceNodeData> & { type: NodeType.Voice };
type LinkNode = BaseNode<LinkNodeData> & { type: NodeType.Link };
type TaskNode = BaseNode<TaskNodeData> & { type: NodeType.Task };
type DrawNode = BaseNode<DrawNodeData> & { type: NodeType.Draw };

// Union type of all node types
type CanvasNode = TextNode | ImageNode | VideoNode | VoiceNode | LinkNode | TaskNode | DrawNode;
```

### Connection Types

#### `Connection`

```typescript
interface Connection {
  id: string;          // Unique identifier
  fromNodeId: string;  // Source node ID
  toNodeId: string;    // Target node ID
  label?: string;      // Optional connection label
  color?: string;      // Optional connection color (hex)
}
```

### Lesson Plan Types

#### `LessonTask`

```typescript
interface LessonTask {
  text: string;        // Task description
  completed: boolean;  // Completion status
}
```

#### `LessonPlan`

```typescript
interface LessonPlan {
  title: string;         // Lesson title
  tasks: LessonTask[];   // Array of lesson tasks
}
```

### Modal Types

#### `ModalType`

```typescript
type ModalType = 
  | 'IMAGE_GEN'      // Image generation modal
  | 'VIDEO_GEN'      // Video generation modal
  | 'IMAGE_EDIT'     // Image editing modal
  | 'VIDEO_PLAYER'   // Video player modal
  | 'LESSON_LOADER'  // Lesson loader modal
  | null;            // No modal open
```

---

## HTTP API Routes

### Deployments API

Base path: `/api/v1/dashboard/deployments`

#### Get Deployment

```http
GET /api/v1/dashboard/deployments/:id
```

**Parameters:**
- `id` (path): Deployment ID

**Response (200 OK):**
```json
{
  "id": "1",
  "name": "Initial Deployment",
  "status": "active",
  "createdAt": "2024-01-10T12:00:00.000Z"
}
```

**Error Response (404 Not Found):**
```json
{
  "message": "Deployment not found"
}
```

**Example:**
```typescript
const response = await fetch('/api/v1/dashboard/deployments/1');
const deployment = await response.json();
```

#### Update Deployment

```http
PUT /api/v1/dashboard/deployments/:id
```

**Parameters:**
- `id` (path): Deployment ID

**Request Body:**
```json
{
  "name": "Updated Deployment",
  "status": "pending"
}
```

**Response (200 OK):**
```json
{
  "id": "1",
  "name": "Updated Deployment",
  "status": "pending",
  "createdAt": "2024-01-10T12:00:00.000Z"
}
```

**Error Response (404 Not Found):**
```json
{
  "message": "Deployment not found"
}
```

**Example:**
```typescript
const response = await fetch('/api/v1/dashboard/deployments/1', {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    status: 'active',
  }),
});
const updatedDeployment = await response.json();
```

#### Delete Deployment

```http
DELETE /api/v1/dashboard/deployments/:id
```

**Parameters:**
- `id` (path): Deployment ID

**Response (200 OK):**
```json
{
  "message": "Deployment removed"
}
```

**Error Response (404 Not Found):**
```json
{
  "message": "Deployment not found"
}
```

**Example:**
```typescript
const response = await fetch('/api/v1/dashboard/deployments/1', {
  method: 'DELETE',
});
const result = await response.json();
```

#### Deployment Type

```typescript
type Deployment = {
  id: string;
  name: string;
  status: "pending" | "active" | "failed";
  createdAt: string; // ISO 8601 timestamp
};
```

---

## Component APIs

### Common Component Props

#### Node Component Props

All node components receive these common props:

```typescript
interface NodeComponentProps<T extends CanvasNode> {
  node: T;                    // The node data
  isSelected: boolean;        // Selection state
  onSelect: () => void;       // Selection handler
  onEdit?: () => void;        // Edit handler (optional)
}
```

**Example:**
```typescript
const TextNode: React.FC<NodeComponentProps<TextNode>> = ({
  node,
  isSelected,
  onSelect,
  onEdit,
}) => {
  // Component implementation
};
```

#### Modal Props

```typescript
interface ModalProps {
  isOpen: boolean;           // Modal visibility
  onClose: () => void;       // Close handler
  title?: string;            // Optional title
  children: React.ReactNode; // Modal content
}
```

---

## Utility Functions

### Helper Functions

Located in `utils/helpers.ts`

#### `decode(base64: string): ArrayBuffer`

Decodes a base64 string to ArrayBuffer.

**Parameters:**
- `base64`: Base64 encoded string

**Returns:** ArrayBuffer

**Example:**
```typescript
const buffer = decode(base64String);
```

#### `decodeAudioData(audioContext: AudioContext, arrayBuffer: ArrayBuffer): Promise<AudioBuffer>`

Decodes audio data from ArrayBuffer.

**Parameters:**
- `audioContext`: Web Audio API AudioContext
- `arrayBuffer`: Audio data as ArrayBuffer

**Returns:** Promise resolving to AudioBuffer

**Example:**
```typescript
const audioContext = new AudioContext();
const arrayBuffer = decode(base64Audio);
const audioBuffer = await decodeAudioData(audioContext, arrayBuffer);
```

---

## Error Handling

### API Errors

All API functions should be wrapped in try-catch blocks:

```typescript
try {
  const result = await apiFunction();
  // Handle success
} catch (error) {
  console.error('API call failed:', error);
  // Handle error (show user message, retry, etc.)
}
```

### Common Error Types

- **Network Errors**: Connection issues, timeouts
- **Authentication Errors**: Missing or invalid API keys
- **Validation Errors**: Invalid input data
- **Not Found Errors**: Resource doesn't exist
- **Rate Limit Errors**: Too many requests

---

## Best Practices

### Performance

1. **Selective State Subscription**: Only subscribe to needed state slices
   ```typescript
   // Good: Only subscribe to nodes
   const nodes = useCanvasState(state => state.nodes);
   
   // Avoid: Subscribe to entire state
   const state = useCanvasState();
   ```

2. **Memoization**: Use React.memo() for expensive node components
   ```typescript
   export default React.memo(TextNode);
   ```

3. **Debouncing**: Debounce expensive operations
   ```typescript
   const debouncedSave = debounce(saveCanvas, 1000);
   ```

### Type Safety

1. **Use Discriminated Unions**: TypeScript will narrow types
   ```typescript
   if (node.type === NodeType.Text) {
     // TypeScript knows node is TextNode
     console.log(node.data.text);
   }
   ```

2. **Avoid Type Assertions**: Let TypeScript infer when possible
   ```typescript
   // Avoid
   const node = data as TextNode;
   
   // Prefer
   if (isTextNode(data)) {
     const node = data; // TypeScript knows it's TextNode
   }
   ```

### Error Messages

Provide clear, actionable error messages:

```typescript
throw new Error(
  'Failed to generate image. Please check your API key and try again.'
);
```

---

## Versioning

**Current Version:** 0.0.0

This API documentation follows semantic versioning. Breaking changes will increment the major version.

---

## Support

For questions or issues:
1. Check the [Development Guide](./DEVELOPMENT.md)
2. Review the [Architecture Documentation](./ARCHITECTURE.md)
3. Search existing GitHub issues
4. Create a new issue with detailed information

---

Last updated: 2025-11-10
