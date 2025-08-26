import React from 'react';
import { render, screen } from '@testing-library/react';
import App from '../App';
import '@testing-library/jest-dom';

test('renders app title and welcome message', () => {
  render(<App />);
  expect(screen.getByText(/Certificate Generator Web App/i)).toBeInTheDocument();
  expect(screen.getByText(/Welcome! Start building your certificate generator workflow./i)).toBeInTheDocument();
});
