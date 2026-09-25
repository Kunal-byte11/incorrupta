import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { App } from './App';

describe('Mumbai Police Theme & Design Tokens (T-002)', () => {
  it('renders Mumbai Police heading and state motto', () => {
    render(<App />);
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toBeInTheDocument();
    expect(heading.textContent).toContain('MUMBAI POLICE');

    const motto = screen.getByText(/सद्रक्षणाय खलनिग्रहणाय/i);
    expect(motto).toBeInTheDocument();
  });

  it('renders Bharatiya Sakshya Adhiniyam 2023 statutory card', () => {
    render(<App />);
    expect(screen.getByText(/Bharatiya Sakshya Adhiniyam, 2023/i)).toBeInTheDocument();
    expect(screen.getByText(/BNSS 2023 Section 105/i)).toBeInTheDocument();
    expect(screen.getByText(/मुद्देमाल रजिस्टर \(Muddemal\)/i)).toBeInTheDocument();
  });

  it('renders NPL-IST time synchronization badge', () => {
    render(<App />);
    expect(screen.getByText(/NPL-IST \(UTC\+05:30\) SYNCED/i)).toBeInTheDocument();
  });
});
