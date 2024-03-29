import { fireEvent } from "@testing-library/react";
import { NOTE_TYPE } from "../../const";
import { noop, render } from "../../test-utils";
import { Note } from "./Note";

describe('Note', () => {

  it('should render', () => {
    const { container } = render(<Note />);
    expect(container).toBeDefined();
  });

  it('should display title', () => {
    const testTitle = 'some random title';
    const { getAllByText } = render(<Note id="1" title={testTitle} />);

    const titles = getAllByText(testTitle);
    expect(titles).toHaveLength(2);
    expect(titles[0]).not.toBeVisible();
    expect(titles[1]).toBeVisible();
  });

  it('should be selected', () => {
    const { container } = render(<Note id="1" title="random title" selected={true} />);

    const noteEl = container.children[0];
    expect(noteEl).toBeDefined();
    expect(noteEl).toHaveClass("note--selected");
  });

  it('should be focusable', () => {
    const { container } = render(<Note id="1" focusable={true} toggleFocus={noop} markAsSelected={noop} />);

    const noteEl = container.children[0];
    noteEl.focus();
    expect(noteEl).toHaveFocus();
  });

  it('should be get focus when selected', () => {
    const { container } = render(<Note id="1" title="random title" selected={true} toggleFocus={noop} markAsSelected={noop} />);

    const noteEl = container.children[0];
    noteEl.focus();
    expect(noteEl).toHaveFocus();
  });

  it('should not get focus if not selected or not focusable', () => {
    const { container } = render(<Note id="1" selected={false} focusable={false} />);

    const noteEl = container.children[0];
    expect(noteEl).toHaveAttribute('tabindex', '-1');
  });

  it('should not be editable by default', () => {
    const testTitle = 'some random title';
    const { getAllByText } = render(<Note id="1" title={testTitle} />);

    const titles = getAllByText(testTitle);
    expect(titles).toHaveLength(2);
    expect(titles[0]).not.toBeVisible();
  });

  it('should be editable when title clicked', () => {
    const testTitle = 'some random title';
    const { getAllByText } = render(<Note id="1" title={testTitle} toggleFocus={noop} markAsSelected={noop} />);

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

    const noteEl = container.children[0];
    expect(noteEl).toHaveClass('note--epic');
  });

  it('should display feature note', () => {
    const { container } = render(<Note id="1" type={NOTE_TYPE.FEATURE} />);

    const noteEl = container.children[0];
    expect(noteEl).toHaveClass('note--feature');
  });

  it('should display story note', () => {
    const { container } = render(<Note id="1" type={NOTE_TYPE.STORY} />);

    const noteEl = container.children[0];
    expect(noteEl).toHaveClass('note--story');
  });

});