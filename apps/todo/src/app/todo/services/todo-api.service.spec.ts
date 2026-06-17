import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { environment } from '../../../environments/environment';
import { TodoApiService } from './todo-api.service';

describe('TodoApiService', () => {
  let service: TodoApiService;
  let httpTestingController: HttpTestingController;

  const token = 'token-123';
  const todoId = 'todo-123';
  const taskId = 'task-123';

  const todoUrl = `${environment.todoApiBaseUrl}/todo`;
  const taskUrl = `${environment.todoApiBaseUrl}/todo/task`;
  const editTaskUrl = `${environment.todoApiBaseUrl}/todo/edit-task`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TodoApiService, provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(TodoApiService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  const expectGetTodosRequest = () => {
    service.getTodos(token).subscribe();

    return httpTestingController.expectOne(todoUrl);
  };

  const expectCreateTodoRequest = () => {
    service.createTodo(token, { name: 'Work' }).subscribe();

    return httpTestingController.expectOne(todoUrl);
  };

  const expectDeleteTodoRequest = () => {
    service.deleteTodo(token, todoId).subscribe();

    return httpTestingController.expectOne((request) => request.url === todoUrl && request.params.get('id') === todoId);
  };

  const expectCreateTaskRequest = () => {
    service.createTask(token, todoId, { name: 'Task 1' }).subscribe();

    return httpTestingController.expectOne((request) => request.url === taskUrl && request.params.get('id') === todoId);
  };

  const expectUpdateTaskRequest = () => {
    service.updateTask(token, todoId, taskId, { name: 'Task 1', completed: true }).subscribe();

    return httpTestingController.expectOne(
      (request) => request.url === editTaskUrl && request.params.get('id') === todoId && request.params.get('task-id') === taskId,
    );
  };

  const expectDeleteTaskRequest = () => {
    service.deleteTask(token, todoId, taskId).subscribe();

    return httpTestingController.expectOne(
      (request) => request.url === taskUrl && request.params.get('id') === todoId && request.params.get('task-id') === taskId,
    );
  };

  it('should get todos with get method', () => {
    const request = expectGetTodosRequest();

    expect(request.request.method).toBe('GET');

    request.flush([]);
  });

  it('should get todos with auth token header', () => {
    const request = expectGetTodosRequest();

    expect(request.request.headers.get('T-Auth')).toBe(token);

    request.flush([]);
  });

  it('should create todo with post method', () => {
    const request = expectCreateTodoRequest();

    expect(request.request.method).toBe('POST');

    request.flush({ id: todoId, name: 'Work', tasks: [] });
  });

  it('should create todo with name payload', () => {
    const request = expectCreateTodoRequest();

    expect(request.request.body).toEqual({ name: 'Work' });

    request.flush({ id: todoId, name: 'Work', tasks: [] });
  });

  it('should delete todo with delete method', () => {
    const request = expectDeleteTodoRequest();

    expect(request.request.method).toBe('DELETE');

    request.flush({ deleted: true });
  });

  it('should create task with post method', () => {
    const request = expectCreateTaskRequest();

    expect(request.request.method).toBe('POST');

    request.flush({ id: todoId, name: 'Work', tasks: [] });
  });

  it('should create task with name payload', () => {
    const request = expectCreateTaskRequest();

    expect(request.request.body).toEqual({ name: 'Task 1' });

    request.flush({ id: todoId, name: 'Work', tasks: [] });
  });

  it('should update task with post method', () => {
    const request = expectUpdateTaskRequest();

    expect(request.request.method).toBe('POST');

    request.flush({ id: todoId, name: 'Work', tasks: [] });
  });

  it('should update task with task payload', () => {
    const request = expectUpdateTaskRequest();

    expect(request.request.body).toEqual({
      name: 'Task 1',
      completed: true,
    });

    request.flush({ id: todoId, name: 'Work', tasks: [] });
  });

  it('should delete task with delete method', () => {
    const request = expectDeleteTaskRequest();

    expect(request.request.method).toBe('DELETE');

    request.flush({ id: todoId, name: 'Work', tasks: [] });
  });

  it('should delete task with auth token header', () => {
    const request = expectDeleteTaskRequest();

    expect(request.request.headers.get('T-Auth')).toBe(token);

    request.flush({ id: todoId, name: 'Work', tasks: [] });
  });
});
