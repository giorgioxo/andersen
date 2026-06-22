import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { HISTORY_UPDATED_EVENT } from '../core/todo-events.constants';
import { TodoHistoryEventType } from '../core/todo-history-tracking.model';
import { TodoHistoryTrackingApiService } from './todo-history-tracking-api.service';
import { TodoHistoryTrackingService } from './todo-history-tracking.service';
import { TodoSessionService } from './todo-session.service';

describe('TodoHistoryTrackingService', () => {
  let service: TodoHistoryTrackingService;

  const todoSessionServiceMock = {
    getToken: vi.fn(),
  };

  const todoHistoryTrackingApiServiceMock = {
    track: vi.fn(),
  };

  beforeEach(() => {
    vi.restoreAllMocks();
    vi.clearAllMocks();

    todoSessionServiceMock.getToken.mockReturnValue('token-123');
    todoHistoryTrackingApiServiceMock.track.mockReturnValue(of({}));

    TestBed.configureTestingModule({
      providers: [
        TodoHistoryTrackingService,
        {
          provide: TodoSessionService,
          useValue: todoSessionServiceMock,
        },
        {
          provide: TodoHistoryTrackingApiService,
          useValue: todoHistoryTrackingApiServiceMock,
        },
      ],
    });

    service = TestBed.inject(TodoHistoryTrackingService);
  });

  it('should not track when token is missing', () => {
    todoSessionServiceMock.getToken.mockReturnValue(null);

    service.trackCreateTodo('todo-123', 'Work');

    expect(todoHistoryTrackingApiServiceMock.track).not.toHaveBeenCalled();
  });

  it('should track create todo event', () => {
    service.trackCreateTodo('todo-123', 'Work');

    expect(todoHistoryTrackingApiServiceMock.track).toHaveBeenCalledWith('token-123', 'todo-123', {
      event: TodoHistoryEventType.CreateTodo,
      todo_id: 'todo-123',
      data: { name: 'Work' },
    });
  });

  it('should track delete todo event', () => {
    service.trackDeleteTodo('todo-123');

    expect(todoHistoryTrackingApiServiceMock.track).toHaveBeenCalledWith('token-123', 'todo-123', {
      event: TodoHistoryEventType.DeleteTodo,
      todo_id: 'todo-123',
      data: { todoId: 'todo-123' },
    });
  });

  it('should track create task event', () => {
    service.trackCreateTask('todo-123', 'Task 1');

    expect(todoHistoryTrackingApiServiceMock.track).toHaveBeenCalledWith('token-123', 'todo-123', {
      event: TodoHistoryEventType.CreateTask,
      todo_id: 'todo-123',
      data: { name: 'Task 1' },
    });
  });

  it('should track delete task event', () => {
    service.trackDeleteTask('todo-123', 'task-123');

    expect(todoHistoryTrackingApiServiceMock.track).toHaveBeenCalledWith('token-123', 'todo-123', {
      event: TodoHistoryEventType.DeleteTask,
      todo_id: 'todo-123',
      data: { taskId: 'task-123' },
    });
  });

  it('should track update task event', () => {
    service.trackUpdateTask('todo-123', 'task-123', 'Updated task', true);

    expect(todoHistoryTrackingApiServiceMock.track).toHaveBeenCalledWith('token-123', 'todo-123', {
      event: TodoHistoryEventType.UpdateTask,
      todo_id: 'todo-123',
      data: {
        taskId: 'task-123',
        name: 'Updated task',
        completed: true,
      },
    });
  });

  it('should dispatch history updated event after successful tracking', () => {
    const dispatchEventSpy = vi.spyOn(window, 'dispatchEvent');

    service.trackCreateTodo('todo-123', 'Work');

    expect(dispatchEventSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        type: HISTORY_UPDATED_EVENT,
      }),
    );
  });
});
