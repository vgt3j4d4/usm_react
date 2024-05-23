import { ListItem } from "../linked-list/ListItem.ts";
import { LinkedList } from "../linked-list/LinkedList.ts";

describe('ListItem', () => {

  it('should initialize without list', () => {
    const item = new ListItem('item');

    expect(item.list).not.toBe(undefined);
    expect(item.list.head).toBe(item);
    expect(item.list.tail).toBe(item);
  });

  it('should initialize existing list', () => {
    const list = LinkedList.fromArray(['first', 'second']);

    const item = new ListItem('third', list);

    expect(item.list).toBe(list);
    expect(list.size()).toBe(3);
    expect(list.tail).toBe(item);
  });

  it('should return data', () => {
    const item = new ListItem('item');
    expect(item.data).toBe('item');
  });

  it('should prepend item', () => {
    const item = new ListItem('item');
    const toPrepend = new ListItem('toPrepend');

    item.prepend(toPrepend);

    expect(item.prev).toBe(toPrepend);
  });

  it('should append item', () => {
    const item = new ListItem('item');
    const toAppend = new ListItem('toAppend');

    item.append(toAppend);

    expect(item.next).toBe(toAppend);
  });

  it('should detach', () => {
    const list = LinkedList.fromArray(['first', 'second', 'third']);
    const first = list.findFirst((item) => item.data === 'first');
    const second = list.findFirst((item) => item.data === 'second');
    const third = list.findFirst((item) => item.data === 'third');
    expect(first).toBeDefined();
    expect(second).toBeDefined();
    expect(third).toBeDefined();

    second.detach();

    expect(list.size()).toBe(2);
    expect(first.next).toBe(third);
    expect(third.prev).toBe(first);
  });

  it('should swap', () => {
    const list = LinkedList.fromArray(['first', 'second', 'third']);
    const first = list.findFirst((item) => item.data === 'first');
    const third = list.findFirst((item) => item.data === 'third');

    first.swap(third);

    expect(list.size()).toBe(3);
    expect(list.findIndex((item) => item.data === 'first')).toBe(2);
    expect(list.findIndex((item) => item.data === 'third')).toBe(0);
  });

});