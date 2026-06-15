export interface ITodo {
  id: string;
  name: string;
  tasks: ITodoTask[];
}

export interface ITodoTask {
  id: string;
  name: string;
  completed: boolean;
}
