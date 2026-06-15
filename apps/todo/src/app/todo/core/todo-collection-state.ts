import { ITodoCollectionItem, ITodoNamedCollectionItem } from './todo.models';

export abstract class TodoCollectionState {
  protected addItem<TItem extends ITodoCollectionItem>(items: TItem[], item: TItem): TItem[] {
    return [...items, item];
  }

  protected deleteItem<TItem extends ITodoCollectionItem>(items: TItem[], itemId: string): TItem[] {
    return items.filter(({ id }) => id !== itemId);
  }

  protected updateItem<TItem extends ITodoCollectionItem>(
    items: TItem[],
    itemId: string,
    updater: (item: TItem) => TItem,
  ): TItem[] {
    return items.map((item) => (item.id === itemId ? updater(item) : item));
  }

  protected createNamedItem<TItem extends ITodoNamedCollectionItem>(item: Omit<TItem, 'id'>): TItem {
    return {
      id: crypto.randomUUID(),
      ...item,
    } as TItem;
  }

  protected withNormalizedName(name: string, action: (normalizedName: string) => void): void {
    const normalizedName = name.trim();

    if (!normalizedName) {
      return;
    }

    action(normalizedName);
  }
}
