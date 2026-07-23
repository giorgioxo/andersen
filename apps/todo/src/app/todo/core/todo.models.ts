export interface ITodoCollectionItem {
  id: string;
}

export interface ITodoNamedCollectionItem extends ITodoCollectionItem {
  name: string;
}

export interface ITodoTask extends ITodoNamedCollectionItem {
  completed: boolean;
}

export interface ITodo extends ITodoNamedCollectionItem {
  tasks: ITodoTask[];
}

export interface ITodoTaskNameEvent {
  todoId: string;
  name: string;
}

export interface ITodoTaskTargetEvent {
  todoId: string;
  taskId: string;
}

export interface ITodoTaskFullEvent extends ITodoTaskTargetEvent {
  name: string;
}

export interface ITodoTaskItemUpdateEvent {
  taskId: string;
  name: string;
}
