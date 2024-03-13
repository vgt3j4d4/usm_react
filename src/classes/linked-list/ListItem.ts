import { LinkedList } from "./LinkedList";

export class ListItem<T> {
  data: T;
  next: ListItem<T> | null = null;
  prev: ListItem<T> | null = null;
  list: LinkedList<T>;

  constructor(data: T) {
    this.data = data;
  }

  prepend(item: ListItem<T>) {
    item.list = this.list;
    item.next = this;
    item.prev = this.prev;
    this.prev = item;
    if (this === this.list.head) { this.list.head = item; }
  };

  append(item: ListItem<T>) {
    item.list = this.list;
    item.prev = this;
    item.next = this.next;
    this.next = item;
    if (this === this.list.tail) { this.list.tail = item; }
  };

  detach() {
    if (this.prev) this.prev.next = this.next;
    if (this.next) this.next.prev = this.prev;
    if (this.list.head === this) this.list.head = this.next;
    if (this.list.tail === this) this.list.tail = this.prev;
  };

}