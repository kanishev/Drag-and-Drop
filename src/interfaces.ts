export interface Validatable {
  value: string;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
}

export interface Draggable {
  dragStartHandler(event: DragEvent): void;
  dragStopHandler(event: DragEvent): void;
}

export interface DroppableTarget {
  dragOverHandler(event: DragEvent): void;
  dragLeaveHandler(event: DragEvent): void;
  dropHandler(event: DragEvent): void;
}
