import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByText(/대림대학교 포토존/i);
  expect(linkElement).toBeInTheDocument();
});