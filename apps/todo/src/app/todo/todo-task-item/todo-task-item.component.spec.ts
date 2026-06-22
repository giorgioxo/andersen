import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ITodoTask } from '../core/todo.models';
import { TodoTaskItemComponent } from './todo-task-item.component';

describe('TodoTaskItemComponent', () => {
  let fixture: ComponentFixture<TodoTaskItemComponent>;
  let component: TodoTaskItemComponent;

  const task: ITodoTask = {
    id: 'task-123',
    name: 'Task 1',
    completed: false,
  };

  beforeEach(async () => {
    vi.clearAllMocks();

    await TestBed.configureTestingModule({
      imports: [TodoTaskItemComponent],
    })
      .overrideComponent(TodoTaskItemComponent, {
        set: {
          imports: [],
          template: '',
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(TodoTaskItemComponent);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('task', task);
    fixture.componentRef.setInput('isLoading', false);

    fixture.detectChanges();
  });

  it('should emit delete task id', () => {
    const emitSpy = vi.spyOn(component.deleteTask, 'emit');

    component['onDeleteTask']();

    expect(emitSpy).toHaveBeenCalledWith('task-123');
  });

  it('should emit completed change task id', () => {
    const emitSpy = vi.spyOn(component.completedChange, 'emit');

    component['onCompletedChange']();

    expect(emitSpy).toHaveBeenCalledWith('task-123');
  });

  it('should enable edit mode', () => {
    component['startEdit']();

    expect(component['isEditing']()).toBe(true);
  });

  it('should set task name when edit starts', () => {
    component['startEdit']();

    expect(component['editForm'].getRawValue().name).toBe('Task 1');
  });

  it('should emit update task payload', () => {
    const emitSpy = vi.spyOn(component.updateTask, 'emit');

    component['editForm'].setValue({
      name: 'Updated task',
    });

    component['saveEdit']();

    expect(emitSpy).toHaveBeenCalledWith({
      taskId: 'task-123',
      name: 'Updated task',
    });
  });

  it('should not emit update task payload when edit form is invalid', () => {
    const emitSpy = vi.spyOn(component.updateTask, 'emit');

    component['saveEdit']();

    expect(emitSpy).not.toHaveBeenCalled();
  });

  it('should disable edit mode after saving', () => {
    component['startEdit']();

    component['editForm'].setValue({
      name: 'Updated task',
    });

    component['saveEdit']();

    expect(component['isEditing']()).toBe(false);
  });

  it('should not emit delete task id while loading', () => {
    const emitSpy = vi.spyOn(component.deleteTask, 'emit');

    fixture.componentRef.setInput('isLoading', true);
    fixture.detectChanges();

    component['onDeleteTask']();

    expect(emitSpy).not.toHaveBeenCalled();
  });

  it('should not enable edit mode while loading', () => {
    fixture.componentRef.setInput('isLoading', true);
    fixture.detectChanges();

    component['startEdit']();

    expect(component['isEditing']()).toBe(false);
  });
});
