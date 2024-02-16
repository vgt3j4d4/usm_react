import { fireEvent } from "@testing-library/react";
import { noop, render } from "../../test-utils";
import { Note } from "./Note";
import { NOTE_TYPE } from "../../const";

describe('Note', () => {

  it('should display title', () => {
    const testTitle = 'some random title';
    const { container, getAllByText } = render(<Note id="1" title={testTitle} />);
    expect(container).toBeDefined();

    const titles = getAllByText(testTitle);
    expect(titles).toHaveLength(2);
    expect(titles[0]).not.toBeVisible();
    expect(titles[1]).toBeVisible();
  });

  it('should be selected', () => {
    const { container } = render(<Note id="1" title="random title" selected={true} />);
    expect(container).toBeDefined();

    const noteEl = container.children[0];
    expect(noteEl).toBeDefined();
    expect(noteEl).toHaveClass("note--selected");
  });

  it('should be focusable when selected', () => {
    const { container } = render(<Note id="1" title="random title" selected={true} toggleFocus={noop} markAsSelected={noop} />);
    expect(container).toBeDefined();

    const noteEl = container.children[0];
    noteEl.focus();
    expect(noteEl).toHaveFocus();
  });

  it('should be focusable if is first note', () => {
    const { container } = render(<Note id="1" isFirst={true} toggleFocus={noop} markAsSelected={noop} />);
    expect(container).toBeDefined();

    const noteEl = container.children[0];
    noteEl.focus();
    expect(noteEl).toHaveFocus();
  });

  it('should not focusable if not selected or not is first note', () => {
    const { container } = render(<Note id="1" selected={false} isFirst={false} />);
    expect(container).toBeDefined();

    const noteEl = container.children[0];
    expect(noteEl).toHaveAttribute('tabindex', '-1');
  });

  it('should not be editable by default', () => {
    const testTitle = 'some random title';
    const { container, getAllByText } = render(<Note id="1" title={testTitle} />);
    expect(container).toBeDefined();

    const titles = getAllByText(testTitle);
    expect(titles).toHaveLength(2);
    expect(titles[0]).not.toBeVisible();
  });

  it('should be editable when title clicked', () => {
    const testTitle = 'some random title';
    const { container, getAllByText } = render(<Note id="1" title={testTitle} toggleFocus={noop} markAsSelected={noop} />);
    expect(container).toBeDefined();

    let titles = getAllByText(testTitle);
    expect(titles).toHaveLength(2);
    expect(titles[0]).not.toBeVisible();
    expect(titles[1]).toBeVisible();

    fireEvent.click(titles[1]);

    titles = getAllByText(testTitle);
    expect(titles[0]).toBeVisible();
    expect(titles[1]).not.toBeVisible();
  });

  it('should display epic note', () => {
    const { container } = render(<Note id="1" type={NOTE_TYPE.EPIC} />);
    expect(container).toBeDefined();

    const noteEl = container.children[0];
    expect(noteEl).toHaveClass('note--epic');
  });

  it('should display feature note', () => {
    const { container } = render(<Note id="1" type={NOTE_TYPE.FEATURE} />);
    expect(container).toBeDefined();

    const noteEl = container.children[0];
    expect(noteEl).toHaveClass('note--feature');
  });

  it('should display story note', () => {
    const { container } = render(<Note id="1" type={NOTE_TYPE.STORY} />);
    expect(container).toBeDefined();

    const noteEl = container.children[0];
    expect(noteEl).toHaveClass('note--story');
  });

});