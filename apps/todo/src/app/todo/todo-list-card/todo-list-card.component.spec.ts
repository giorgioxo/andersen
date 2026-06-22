import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormGroupDirective } from '@angular/forms';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ITodo } from '../core/todo.models';
import { TodoListCardComponent } from './todo-list-card.component';

describe('TodoListCardComponent', () => {
  let fixture: ComponentFixture<TodoListCardComponent>;
  let component: TodoListCardComponent;

  const todo: ITodo = {
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

  const formGroupDirectiveMock = {
    resetForm: vi.fn(),
  } as unknown as FormGroupDirective;

  beforeEach(async () => {
    vi.clearAllMocks();

    await TestBed.configureTestingModule({
      imports: [TodoListCardComponent],
    })
      .overrideComponent(TodoListCardComponent, {
        set: {
          imports: [],
          template: '',
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(TodoListCardComponent);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('todo', todo);
    fixture.componentRef.setInput('isLoading', false);

    fixture.detectChanges();
  });

  it('should emit add task payload when task form is valid', () => {
    const emitSpy = vi.spyOn(component.addTask, 'emit');

    component['taskForm'].setValue({
      name: 'Task 1',
    });

    component['onAddTask'](formGroupDirectiveMock);

    expect(emitSpy).toHaveBeenCalledWith({
      todoId: 'todo-123',
      name: 'Task 1',
    });
  });

  it('should not emit add task payload when task form is invalid', () => {
    const emitSpy = vi.spyOn(component.addTask, 'emit');

    component['onAddTask'](formGroupDirectiveMock);

    expect(emitSpy).not.toHaveBeenCalled();
  });

  it('should not emit add task payload while loading', () => {
    const emitSpy = vi.spyOn(component.addTask, 'emit');

    fixture.componentRef.setInput('isLoading', true);
    fixture.detectChanges();

    component['taskForm'].setValue({
      name: 'Task 1',
    });

    component['onAddTask'](formGroupDirectiveMock);

    expect(emitSpy).not.toHaveBeenCalled();
  });

  it('should emit delete todo id', () => {
    const emitSpy = vi.spyOn(component.deleteTodo, 'emit');

    component['onDeleteTodo']();

    expect(emitSpy).toHaveBeenCalledWith('todo-123');
  });

  it('should not emit delete todo id while loading', () => {
    const emitSpy = vi.spyOn(component.deleteTodo, 'emit');

    fixture.componentRef.setInput('isLoading', true);
    fixture.detectChanges();

    component['onDeleteTodo']();

    expect(emitSpy).not.toHaveBeenCalled();
  });

  it('should emit delete task payload', () => {
    const emitSpy = vi.spyOn(component.deleteTask, 'emit');

    component['onDeleteTask']('task-123');

    expect(emitSpy).toHaveBeenCalledWith({
      todoId: 'todo-123',
      taskId: 'task-123',
    });
  });

  it('should emit toggle task completed payload', () => {
    const emitSpy = vi.spyOn(component.toggleTaskCompleted, 'emit');

    component['onToggleTaskCompleted']('task-123');

    expect(emitSpy).toHaveBeenCalledWith({
      todoId: 'todo-123',
      taskId: 'task-123',
    });
  });

  it('should emit update task payload', () => {
    const emitSpy = vi.spyOn(component.updateTask, 'emit');

    component['onUpdateTask']({
      taskId: 'task-123',
      name: 'Updated task',
    });

    expect(emitSpy).toHaveBeenCalledWith({
      todoId: 'todo-123',
      taskId: 'task-123',
      name: 'Updated task',
    });
  });
});
