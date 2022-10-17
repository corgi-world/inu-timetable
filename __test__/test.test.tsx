import { render, screen } from '@testing-library/react';
import Home from '@/pages/index';

describe('Home', () => {
  it('renders a heading', () => {
    render(<Home />);

    const text = screen.getByText('Hello World');

    expect(text).toBeInTheDocument();
  });
});
