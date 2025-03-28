import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders learn react link', () => {
  render(<App />);
  expect(screen.getByText(/employee list/i)).toBeInTheDocument();
  expect(screen.getByText(/dependent list/i)).toBeInTheDocument();
});
