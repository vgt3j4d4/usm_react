import { LinkedList } from "./LinkedList.ts";

export class ListItem<T> {
  data: T;
  next: ListItem<T> | null = null;
  prev: ListItem<T> | null = null;
  list: LinkedList<T>;

  constructor(data: T, list?: LinkedList<T>) {
    this.data = data;
    this.list = list || new LinkedList();
    this.list.append(this);
  }

  /**
   * Inserts the specified item at the beginning of the list.
   * @param item - The item to prepend to the list.
   */
  prepend(item: ListItem<T>) {
    item.list = this.list;
    item.next = this;
    item.prev = this.prev;
    this.prev = item;
    if (this === this.list.head) this.list.head = item;
  };

  /**
   * Appends a new item to the linked list after the current item.
   * @param item - The item to be appended.
   */
  append(item: ListItem<T>) {
    item.list = this.list;
    item.prev = this;
    item.next = this.next;
    this.next = item;
    if (this === this.list.tail) this.list.tail = item;
  };


  /**
   * Detaches the current list item from its linked list.
   */
  detach() {
    if (this.prev) this.prev.next = this.next;
    if (this.next) this.next.prev = this.prev;
    if (this.list.head === this) this.list.head = this.next;
    if (this.list.tail === this) this.list.tail = this.prev;
  };

  /**
   * Swaps the data of the current list item with the data of the specified list item.
   * 
   * @param item - The list item to swap data with.
   * @throws {Error} - If the current list item and the specified list item belong to different lists.
   */
  swap(item: ListItem<T>) {
    if (this === item) return;
    if (this.list !== item.list) throw new Error("Cannot swap items from different lists");

    const tempItemData = item.data;
    const tempThisData = this.data;

    item.data = tempThisData;
    this.data = tempItemData;
  };

  toString(): string {
    return this.data + '';
  }

}