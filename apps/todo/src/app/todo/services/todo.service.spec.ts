import { TestBed } from '@angular/core/testing';
import { NotificationService } from '@andersen/shared-ui';
import { TranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ITodo } from '../core/todo.models';
import { TodoApiService } from './todo-api.service';
import { TodoHistoryTrackingService } from './todo-history-tracking.service';
import { TodoService } from './todo.service';
import { TodoSessionService } from './todo-session.service';

describe('TodoService', () => {
  let service: TodoService;

  const todoApiServiceMock = {
    getTodos: vi.fn(),
    createTodo: vi.fn(),
    deleteTodo: vi.fn(),
    createTask: vi.fn(),
    updateTask: vi.fn(),
    deleteTask: vi.fn(),
  };

  const todoHistoryTrackingServiceMock = {
    trackCreateTodo: vi.fn(),
    trackDeleteTodo: vi.fn(),
    trackCreateTask: vi.fn(),
    trackDeleteTask: vi.fn(),
    trackUpdateTask: vi.fn(),
  };

  const todoSessionServiceMock = {
    getToken: vi.fn(),
  };

  const notificationServiceMock = {
    success: vi.fn(),
    error: vi.fn(),
  };

  const translateServiceMock = {
    instant: vi.fn((key: string) => key),
  };

  const todo: ITodo = {
    id: 'todo-123',
    name: 'Work',
    tasks: [],
  };

  const todoWithTask: ITodo = {
    id: 'todo-123',
    name: 'Work',
    tasks: [
      {
        id: 'task-123',
        name: 'Task 1',
        completed: false,
      },
    ],
  };

  beforeEach(() => {
    vi.clearAllMocks();

    todoSessionServiceMock.getToken.mockReturnValue('token-123');

    TestBed.configureTestingModule({
      providers: [
        TodoService,
        {
          provide: TodoApiService,
          useValue: todoApiServiceMock,
        },
        {
          provide: TodoHistoryTrackingService,
          useValue: todoHistoryTrackingServiceMock,
        },
        {
          provide: TodoSessionService,
          useValue: todoSessionServiceMock,
        },
        {
          provide: NotificationService,
          useValue: notificationServiceMock,
        },
        {
          provide: TranslateService,
          useValue: translateServiceMock,
        },
      ],
    });

    service = TestBed.inject(TodoService);
  });

  it('should not load todos when token is missing', () => {
    todoSessionServiceMock.getToken.mockReturnValue(null);

    service.loadTodos().subscribe();

    expect(todoApiServiceMock.getTodos).not.toHaveBeenCalled();
  });

  it('should set todos after loading', () => {
    todoApiServiceMock.getTodos.mockReturnValue(of([todo]));

    service.loadTodos().subscribe();

    expect(service.todos()).toEqual([todo]);
  });

  it('should call create todo api with token and name', () => {
    todoApiServiceMock.createTodo.mockReturnValue(of(todo));

    service.addTodo('Work').subscribe();

    expect(todoApiServiceMock.createTodo).toHaveBeenCalledWith('token-123', {
      name: 'Work',
    });
  });

  it('should add created todo to state', () => {
    todoApiServiceMock.createTodo.mockReturnValue(of(todo));

    service.addTodo('Work').subscribe();

    expect(service.todos()).toEqual([todo]);
  });

  it('should remove deleted todo from state', () => {
    todoApiServiceMock.getTodos.mockReturnValue(of([todo]));
    todoApiServiceMock.deleteTodo.mockReturnValue(of({ deleted: true }));

    service.loadTodos().subscribe();
    service.deleteTodo('todo-123').subscribe();

    expect(service.todos()).toEqual([]);
  });

  it('should update todo after creating task', () => {
    todoApiServiceMock.getTodos.mockReturnValue(of([todo]));
    todoApiServiceMock.createTask.mockReturnValue(of(todoWithTask));

    service.loadTodos().subscribe();
    service.addTask('todo-123', 'Task 1').subscribe();

    expect(service.todos()).toEqual([todoWithTask]);
  });

  it('should update task with inverted completed value', () => {
    todoApiServiceMock.getTodos.mockReturnValue(of([todoWithTask]));
    todoApiServiceMock.updateTask.mockReturnValue(
      of({
        ...todoWithTask,
        tasks: [
          {
            id: 'task-123',
            name: 'Task 1',
            completed: true,
          },
        ],
      }),
    );

    service.loadTodos().subscribe();
    service.toggleTaskCompleted('todo-123', 'task-123').subscribe();

    expect(todoApiServiceMock.updateTask).toHaveBeenCalledWith('token-123', 'todo-123', 'task-123', {
      name: 'Task 1',
      completed: true,
    });
  });

  it('should update task name with existing completed value', () => {
    todoApiServiceMock.getTodos.mockReturnValue(of([todoWithTask]));
    todoApiServiceMock.updateTask.mockReturnValue(
      of({
        ...todoWithTask,
        tasks: [
          {
            id: 'task-123',
            name: 'Updated task',
            completed: false,
          },
        ],
      }),
    );

    service.loadTodos().subscribe();
    service.updateTaskName('todo-123', 'task-123', 'Updated task').subscribe();

    expect(todoApiServiceMock.updateTask).toHaveBeenCalledWith('token-123', 'todo-123', 'task-123', {
      name: 'Updated task',
      completed: false,
    });
  });

  it('should not update missing task', () => {
    todoApiServiceMock.getTodos.mockReturnValue(of([todo]));

    service.loadTodos().subscribe();
    service.updateTaskName('todo-123', 'missing-task', 'Updated task').subscribe();

    expect(todoApiServiceMock.updateTask).not.toHaveBeenCalled();
  });
});
