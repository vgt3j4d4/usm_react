import { ListItem } from "./ListItem.ts";

export class LinkedList<T> {
  head: ListItem<T> | null = null;
  tail: ListItem<T> | null = null;

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

  find(predicateFn: (item: ListItem<T>) => boolean): ListItem<T> | null {
    let current = this.head;
    while (current) {
      if (predicateFn(current)) return current;
      current = current.next;
    }
    return null;
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

  static fromArray(array: Array<any>): LinkedList<any> {
    const list = new LinkedList<any>();
    array.forEach((data) => {
      const item = new ListItem(data);
      item.list = list;
      list.append(item);
    });
    return list;
  }

  static toDataArray(list: LinkedList<any>): Array<any> {
    return list.toArray().map(item => item.data);
  }
}