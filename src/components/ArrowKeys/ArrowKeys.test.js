import { render } from "../../test-utils";
import { ArrowKeys } from "./ArrowKeys";

describe('ArrowKeys', () => {

  it('should render', () => {
    const { container } = render(<ArrowKeys />);
    expect(container).toBeDefined();
  });

  it('should be fixed to the bottom left corner', () => {
    const { container } = render(<ArrowKeys />);
    expect(container).toBeDefined();
    expect(container.firstChild).toHaveClass('fixed', 'bottom-0', 'left-0');
  });

  it('should display the arrow keys image', () => {
    const { getByAltText } = render(<ArrowKeys />);
    const image = getByAltText('keyboard arrow keys');
    expect(image).toBeDefined();
    expect(image).toHaveAttribute('src', '/images/black_keys.png');
  });

});