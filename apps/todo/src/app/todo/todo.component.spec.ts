import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormGroupDirective } from '@angular/forms';
import { UiDialogService } from '@andersen/shared-ui';
import { TranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { TodoComponent } from './todo.component';
import { TodoEventBridgeService } from './services/todo-event-bridge.service';
import { TodoService } from './services/todo.service';

describe('TodoComponent', () => {
  let fixture: ComponentFixture<TodoComponent>;
  let component: TodoComponent;

  const todoServiceMock = {
    todos: () => [],
    addTodo: vi.fn(),
    deleteTodo: vi.fn(),
    addTask: vi.fn(),
    deleteTask: vi.fn(),
    toggleTaskCompleted: vi.fn(),
    updateTaskName: vi.fn(),
  };

  const todoEventBridgeServiceMock = {
    init: vi.fn(),
    dispatchLogout: vi.fn(),
  };

  const dialogServiceMock = {
    open: vi.fn(),
  };

  const translateServiceMock = {
    instant: vi.fn((key: string) => key),
  };

  const formGroupDirectiveMock = {
    resetForm: vi.fn(),
  } as unknown as FormGroupDirective;

  beforeEach(async () => {
    vi.clearAllMocks();

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
          provide: TodoEventBridgeService,
          useValue: todoEventBridgeServiceMock,
        },
        {
          provide: UiDialogService,
          useValue: dialogServiceMock,
        },
        {
          provide: TranslateService,
          useValue: translateServiceMock,
        },
      ],
    })
      .overrideComponent(TodoComponent, {
        set: {
          imports: [],
          template: '',
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(TodoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should initialize todo event bridge on init', () => {
    expect(todoEventBridgeServiceMock.init).toHaveBeenCalled();
  });

  it('should not add todo when form is invalid', () => {
    component['addTodo'](formGroupDirectiveMock);

    expect(todoServiceMock.addTodo).not.toHaveBeenCalled();
  });

  it('should add todo with trimmed name', () => {
    component['todoForm'].setValue({ name: ' Work ' });

    component['addTodo'](formGroupDirectiveMock);

    expect(todoServiceMock.addTodo).toHaveBeenCalledWith('Work');
  });

  it('should not add todo while pending', () => {
    component['isAddTodoPending'].set(true);
    component['todoForm'].setValue({ name: 'Work' });

    component['addTodo'](formGroupDirectiveMock);

    expect(todoServiceMock.addTodo).not.toHaveBeenCalled();
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

  it('should not open delete todo dialog while todo is loading', () => {
    component['loadingTodoId'].set('todo-123');

    component['deleteTodo']('todo-123');

    expect(dialogServiceMock.open).not.toHaveBeenCalled();
  });

  it('should add task with trimmed name', () => {
    component['addTask']({ todoId: 'todo-123', name: ' Task 1 ' });

    expect(todoServiceMock.addTask).toHaveBeenCalledWith('todo-123', 'Task 1');
  });

  it('should not add task while todo is loading', () => {
    component['loadingTodoId'].set('todo-123');

    component['addTask']({ todoId: 'todo-123', name: 'Task 1' });

    expect(todoServiceMock.addTask).not.toHaveBeenCalled();
  });

  it('should delete task when dialog is confirmed', () => {
    component['deleteTask']({ todoId: 'todo-123', taskId: 'task-123' });

    expect(todoServiceMock.deleteTask).toHaveBeenCalledWith('todo-123', 'task-123');
  });

  it('should toggle task completed', () => {
    component['toggleTaskCompleted']({ todoId: 'todo-123', taskId: 'task-123' });

    expect(todoServiceMock.toggleTaskCompleted).toHaveBeenCalledWith('todo-123', 'task-123');
  });

  it('should update task with trimmed name', () => {
    component['updateTask']({
      todoId: 'todo-123',
      taskId: 'task-123',
      name: ' Updated task ',
    });

    expect(todoServiceMock.updateTaskName).toHaveBeenCalledWith('todo-123', 'task-123', 'Updated task');
  });

  it('should dispatch logout event', () => {
    component['logout']();

    expect(todoEventBridgeServiceMock.dispatchLogout).toHaveBeenCalled();
  });
});
