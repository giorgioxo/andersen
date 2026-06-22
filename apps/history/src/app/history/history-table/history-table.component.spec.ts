import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { DEFAULT_HISTORY_SORT_DIRECTION, HISTORY_EVENT_OPTIONS, INITIAL_HISTORY_QUERY } from '../core/history.constants';
import { HistoryEventType, IHistoryEvent } from '../core/history.model';
import { HistoryTableComponent } from './history-table.component';

describe('HistoryTableComponent', () => {
  let fixture: ComponentFixture<HistoryTableComponent>;
  let component: HistoryTableComponent;

  const events: IHistoryEvent[] = [
    {
      id: 'history-1',
      type: HistoryEventType.CreateTodo,
      createdAt: '2026-06-18T10:00:00.000Z',
      additionalInfo: 'name: Work',
    },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HistoryTableComponent],
      providers: [provideNoopAnimations()],
    })
      .overrideComponent(HistoryTableComponent, {
        set: {
          template: '<div #tableContent></div>',
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(HistoryTableComponent);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('events', events);
    fixture.componentRef.setInput('totalItems', 1);
    fixture.componentRef.setInput('query', INITIAL_HISTORY_QUERY);
    fixture.componentRef.setInput('isLoading', false);

    fixture.detectChanges();

    component['tableContent']().nativeElement.scrollTo = vi.fn();

    vi.spyOn(component['queryChange'], 'emit');
  });

  it('should emit first page when filter changes', () => {
    component['selectedEventTypes'] = [HistoryEventType.CreateTodo];

    component['applyEventTypeFilter']();

    expect(component['queryChange'].emit).toHaveBeenCalledWith(expect.objectContaining({ page: 1 }));
  });

  it('should emit selected event types when filter changes', () => {
    component['selectedEventTypes'] = [HistoryEventType.CreateTodo];

    component['applyEventTypeFilter']();

    expect(component['queryChange'].emit).toHaveBeenCalledWith(
      expect.objectContaining({
        event: [HistoryEventType.CreateTodo],
      }),
    );
  });

  it('should emit next page query when page changes', () => {
    component['onPageChange']({ pageIndex: 1, pageSize: 20 } as PageEvent);

    expect(component['queryChange'].emit).toHaveBeenCalledWith(expect.objectContaining({ page: 2 }));
  });

  it('should emit selected page size when page changes', () => {
    component['onPageChange']({ pageIndex: 0, pageSize: 10 } as PageEvent);

    expect(component['queryChange'].emit).toHaveBeenCalledWith(expect.objectContaining({ limit: 10 }));
  });

  it('should reset page when sort changes', () => {
    component['onSortChange']({ active: 'createdAt', direction: 'asc' } as Sort);

    expect(component['queryChange'].emit).toHaveBeenCalledWith(expect.objectContaining({ page: 1 }));
  });

  it('should emit sort direction when sort changes', () => {
    component['onSortChange']({ active: 'createdAt', direction: 'asc' } as Sort);

    expect(component['queryChange'].emit).toHaveBeenCalledWith(expect.objectContaining({ sort: 'asc' }));
  });

  it('should emit default sort direction when sort is cleared', () => {
    component['onSortChange']({ active: 'createdAt', direction: '' } as Sort);

    expect(component['queryChange'].emit).toHaveBeenCalledWith(
      expect.objectContaining({
        sort: DEFAULT_HISTORY_SORT_DIRECTION,
      }),
    );
  });

  it('should not emit while loading', () => {
    fixture.componentRef.setInput('isLoading', true);
    fixture.detectChanges();

    component['applyEventTypeFilter']();

    expect(component['queryChange'].emit).not.toHaveBeenCalled();
  });

  it('should calculate row index from current page', () => {
    expect(component['getRowIndex'](0)).toBe(1);
  });

  it('should return event translation key', () => {
    const expectedTranslationKey = HISTORY_EVENT_OPTIONS.find(({ value }) => value === events[0].type)?.translationKey ?? events[0].type;

    expect(component['getEventTranslationKey'](events[0])).toBe(expectedTranslationKey);
  });
});
