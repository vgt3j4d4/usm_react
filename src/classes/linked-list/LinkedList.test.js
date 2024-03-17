import exp from "constants";
import { LinkedList } from "./LinkedList.ts";
import { ListItem } from "./ListItem.ts";

describe('LinkedList', () => {

  it('should add item to list', () => {
    const list1 = new LinkedList();
    const list2 = new LinkedList();
    list1.prepend(new ListItem('item1'));
    list2.append(new ListItem('item2'));

    expect(list1.size()).toBe(1);
    expect(list2.size()).toBe(1);
  });

  it('should update head when prepending', () => {
    const list = new LinkedList();
    const item = new ListItem('item');
    list.prepend(item);

    expect(list.head).toBe(item);
  });

  it('should update tail when appending', () => {
    const list = new LinkedList();
    const item = new ListItem('item');
    list.append(item);

    expect(list.tail).toBe(item);
  });

  it('should return the right size when the list is updated', () => {
    const size = Math.floor(Math.random() * 10);
    const list = new LinkedList();

    for (let i = 0; i < size; i++) { list.append(new ListItem(`item${i}`)); }

    expect(list.size()).toBe(size);
  });

  it('should create list from array', () => {
    const array = ['A', 'B', 'C'];
    const list = LinkedList.fromArray(array);

    expect(list.size()).toBe(array.length);
    list.toArray().forEach((item, index) => {
      expect(item.data).toBe(array[index]);
    });
  });

  it('should findFirst', () => {
    const list = LinkedList.fromArray(['X', 'Y', 'X', 'X', 'Y', 'X']);

    const first = list.findFirst((item) => item.data === 'Y');

    expect(first.data).toBe('Y');
    let current = list.head;
    let index = 0;
    while (current && current.data !== 'Y') {
      current = current.next;
      index++;
    }
    expect(index).toBe(1);
  });

  it('should findLast', () => {
    const list = LinkedList.fromArray(['X', 'Y', 'X', 'X', 'Y', 'X']);

    const last = list.findLast((item) => item.data === 'Y');

    expect(last.data).toBe('Y');
    let current = list.tail;
    let index = list.size() - 1;
    while (current && current.data !== 'Y') {
      current = current.prev;
      index--;
    }
    expect(index).toBe(4);
  });

  it('should findAll', () => {
    const list = LinkedList.fromArray(['X', 'Y', 'X', 'X', 'Y', 'X']);

    const allY = list.findAll((item) => item.data === 'Y');

    expect(allY.length).toBe(2);
  });

  it('should return array', () => {
    const list = LinkedList.fromArray(['X', 'Y', 'X', 'X', 'Y', 'X']);

    const array = list.toArray();

    expect(array.length).toBe(6);
  });

  it('should return string', () => {
    const list = LinkedList.fromArray(['X', 'Y', 'X', 'X', 'Y', 'X']);

    const string = list.toString();

    expect(string).toBe('X,Y,X,X,Y,X');
  });

  it('should return data array', () => {
    const list = LinkedList.fromArray(['X', 'Y', 'X', 'X', 'Y', 'X']);

    const array = list.toDataArray();

    expect(array.length).toBe(6);
    expect(array.toString()).toBe('X,Y,X,X,Y,X');
  });

});