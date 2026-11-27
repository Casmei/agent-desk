import { render, screen } from '@testing-library/react';
import { expect, it } from 'vitest';
import App from './app.tsx';

it('renders the product codename', () => {
  render(<App />);

  expect(screen.getByRole('heading', { level: 1 }).textContent).toBe(
    'agent-desk',
  );
});
