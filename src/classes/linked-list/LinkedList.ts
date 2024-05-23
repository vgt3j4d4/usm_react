import { ListItem } from "./ListItem.ts";

export class LinkedList<T> {
  head: ListItem<T> | null = null;
  tail: ListItem<T> | null = null;

  constructor(initialItems?: T[]) {
    if (!initialItems || initialItems.length === 0) return;
    initialItems.forEach(item => this.append(new ListItem(item)));
  }

  prepend(item: ListItem<T>) {
    item.list = this;
    if (this.head) {
      this.head.prepend(item);
      this.head = item;
    } else {
      this.head = item;
      this.tail = item;
    }
  }

  append(item: ListItem<T>) {
    item.list = this;
    if (this.tail) {
      this.tail.append(item);
      this.tail = item;
    } else {
      this.head = item;
      this.tail = item;
    }
  }

  size(): number {
    let size = 0;
    let current = this.head;
    while (current) {
      size++;
      current = current.next;
    }
    return size;
  }

  findFirst(predicateFn: (item: ListItem<T>) => boolean): ListItem<T> | null {
    let current = this.head;
    while (current) {
      if (predicateFn(current)) return current;
      current = current.next;
    }
    return null;
  }

  findLast(predicateFn: (item: ListItem<T>) => boolean): ListItem<T> | null {
    let current = this.tail;
    while (current) {
      if (predicateFn(current)) return current;
      current = current.prev;
    }
    return null;
  }

  findIndex(predicateFn: (item: ListItem<T>) => boolean): number {
    let index = 0;
    let current = this.head;
    while (current) {
      if (predicateFn(current)) return index;
      index++;
      current = current.next;
    }
    return -1;
  }

  findAll(predicateFn: (item: ListItem<T>) => boolean): Array<ListItem<T>> {
    const items: Array<ListItem<T>> = [];
    let current = this.head;
    while (current) {
      if (predicateFn(current)) items.push(current);
      current = current.next;
    }
    return items;
  }

  toArray(): Array<ListItem<T>> {
    const array: Array<ListItem<T>> = [];
    let current = this.head;
    while (current) {
      array.push(current);
      current = current.next;
    }
    return array;
  }

  toDataArray(): Array<T> {
    return this.toArray().map(item => item.data);
  }

  toString(): string {
    return this.toDataArray().join(",");
  }

  static fromArray(array: Array<any>): LinkedList<any> {
    return new LinkedList<any>(array);
  }
}