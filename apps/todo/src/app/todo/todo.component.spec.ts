import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormGroupDirective } from '@angular/forms';
import { UiDialogService } from '@andersen/shared-ui';
import { of } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { TodoComponent } from './todo.component';
import { TodoService } from './services/todo.service';
import { TodoSessionService } from './services/todo-session.service';

describe('TodoComponent', () => {
  let fixture: ComponentFixture<TodoComponent>;
  let component: TodoComponent;

  const todoServiceMock = {
    todos: () => [],
    loadTodos: vi.fn(),
    addTodo: vi.fn(),
    deleteTodo: vi.fn(),
    addTask: vi.fn(),
    deleteTask: vi.fn(),
    toggleTaskCompleted: vi.fn(),
    updateTaskName: vi.fn(),
  };

  const todoSessionServiceMock = {
    setToken: vi.fn(),
  };

  const dialogServiceMock = {
    open: vi.fn(),
  };

  const formGroupDirectiveMock = {
    resetForm: vi.fn(),
  } as unknown as FormGroupDirective;

  beforeEach(async () => {
    vi.clearAllMocks();

    todoServiceMock.loadTodos.mockReturnValue(of([]));
    todoServiceMock.addTodo.mockReturnValue(of({ id: 'todo-123', name: 'Work', tasks: [] }));
    todoServiceMock.deleteTodo.mockReturnValue(of({ deleted: true }));
    todoServiceMock.addTask.mockReturnValue(of({ id: 'todo-123', name: 'Work', tasks: [] }));
    todoServiceMock.deleteTask.mockReturnValue(of({ id: 'todo-123', name: 'Work', tasks: [] }));
    todoServiceMock.toggleTaskCompleted.mockReturnValue(of({ id: 'todo-123', name: 'Work', tasks: [] }));
    todoServiceMock.updateTaskName.mockReturnValue(of({ id: 'todo-123', name: 'Work', tasks: [] }));
    dialogServiceMock.open.mockReturnValue(of(true));

    await TestBed.configureTestingModule({
      imports: [TodoComponent],
      providers: [
        {
          provide: TodoService,
          useValue: todoServiceMock,
        },
        {
          provide: TodoSessionService,
          useValue: todoSessionServiceMock,
        },
        {
          provide: UiDialogService,
          useValue: dialogServiceMock,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TodoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should load todos on init', () => {
    expect(todoServiceMock.loadTodos).toHaveBeenCalled();
  });

  it('should not add todo when form is invalid', () => {
    component['addTodo'](formGroupDirectiveMock);

    expect(todoServiceMock.addTodo).not.toHaveBeenCalled();
  });

  it('should add todo with trimmed name', () => {
    component['todoForm'].setValue({
      name: ' Work ',
    });

    component['addTodo'](formGroupDirectiveMock);

    expect(todoServiceMock.addTodo).toHaveBeenCalledWith('Work');
  });

  it('should delete todo when dialog is confirmed', () => {
    component['deleteTodo']('todo-123');

    expect(todoServiceMock.deleteTodo).toHaveBeenCalledWith('todo-123');
  });

  it('should not delete todo when dialog is cancelled', () => {
    dialogServiceMock.open.mockReturnValue(of(false));

    component['deleteTodo']('todo-123');

    expect(todoServiceMock.deleteTodo).not.toHaveBeenCalled();
  });

  it('should add task with trimmed name', () => {
    component['addTask']({
      todoId: 'todo-123',
      name: ' Task 1 ',
    });

    expect(todoServiceMock.addTask).toHaveBeenCalledWith('todo-123', 'Task 1');
  });

  it('should not add task while todo is loading', () => {
    component['loadingTodoId'].set('todo-123');

    component['addTask']({
      todoId: 'todo-123',
      name: 'Task 1',
    });

    expect(todoServiceMock.addTask).not.toHaveBeenCalled();
  });
});
