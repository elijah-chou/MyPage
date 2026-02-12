import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the portfolio app with greeting', () => {
  render(<App />);
  const greetingElement = screen.getByText(/Hello, my name is Elijah!/i);
  expect(greetingElement).toBeInTheDocument();
});
