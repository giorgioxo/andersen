import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { INITIAL_HISTORY_QUERY } from './core/history.constants';
import { HistoryComponent } from './history.component';
import { HistoryEventBridgeService } from './services/history-event-bridge.service';
import { HistoryService } from './services/history.service';

describe('HistoryComponent', () => {
  let fixture: ComponentFixture<HistoryComponent>;
  let component: HistoryComponent;

  const historyServiceMock = {
    historyEvents: () => [],
    historyTotal: () => 0,
    historyQuery: () => INITIAL_HISTORY_QUERY,
    isLoading: () => false,
    updateQuery: vi.fn(),
    loadHistory: vi.fn(),
  };

  const historyEventBridgeServiceMock = {
    init: vi.fn(),
  };

  beforeEach(async () => {
    vi.clearAllMocks();
    historyServiceMock.loadHistory.mockReturnValue(of([]));

    await TestBed.configureTestingModule({
      imports: [HistoryComponent],
      providers: [
        provideRouter([]),
        { provide: HistoryService, useValue: historyServiceMock },
        { provide: HistoryEventBridgeService, useValue: historyEventBridgeServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should initialize history event bridge on init', () => {
    expect(historyEventBridgeServiceMock.init).toHaveBeenCalled();
  });

  it('should update query when query changes', () => {
    component['onQueryChange'](INITIAL_HISTORY_QUERY);

    expect(historyServiceMock.updateQuery).toHaveBeenCalledWith(INITIAL_HISTORY_QUERY);
  });

  it('should load history when query changes', () => {
    component['onQueryChange'](INITIAL_HISTORY_QUERY);

    expect(historyServiceMock.loadHistory).toHaveBeenCalled();
  });
});
