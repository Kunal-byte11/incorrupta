import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { AuthProvider } from '../../context/AuthContext';
import { LoginPage } from './LoginPage';
import App from '../../App';

describe('Sevarth ID WebAuthn Client Login UI (T-006)', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders Mumbai Police heading, crest, and State Motto', () => {
    render(
      <AuthProvider>
        <LoginPage />
      </AuthProvider>
    );

    expect(screen.getByText('सद्रक्षणाय खलनिग्रहणाय')).toBeInTheDocument();
    expect(screen.getByText(/मुंबई पोलीस • MUMBAI POLICE/i)).toBeInTheDocument();
    expect(screen.getByText(/NPL-IST SYNCED/i)).toBeInTheDocument();
  });

  it('renders Sevarth ID input field and Biometric verification button', () => {
    render(
      <AuthProvider>
        <LoginPage />
      </AuthProvider>
    );

    const input = screen.getByLabelText(/Sevarth Employee ID/i);
    expect(input).toBeInTheDocument();
    expect(input).toHaveValue('MH-POL-40211');

    const button = screen.getByRole('button', { name: /Verify Biometric Passkey/i });
    expect(button).toBeInTheDocument();
  });

  it('supports bilingual toggle to Marathi (मराठी) and English', () => {
    render(
      <AuthProvider>
        <LoginPage />
      </AuthProvider>
    );

    const langButton = screen.getByRole('button', { name: /Toggle language/i });
    expect(langButton).toHaveTextContent('मराठी');

    // Click to switch to Marathi
    fireEvent.click(langButton);
    expect(screen.getByText('डिजिटल पुरावे व मुद्देमाल अभिरक्षा व्यवस्थापन प्रणाली')).toBeInTheDocument();

    // Click to switch back to English
    fireEvent.click(langButton);
    expect(screen.getByText(/Digital Evidence & Muddemal Custody Management System/i)).toBeInTheDocument();
  });

  it('populates Sevarth ID when clicking pre-seeded Mumbai Police personas', () => {
    render(
      <AuthProvider>
        <LoginPage />
      </AuthProvider>
    );

    const rameshButton = screen.getByText(/Ramesh Patil/i);
    fireEvent.click(rameshButton);

    const input = screen.getByLabelText(/Sevarth Employee ID/i);
    expect(input).toHaveValue('MH-POL-10842');
  });

  it('authenticates officer and navigates to the station portal in App', async () => {
    render(<App />);

    // Initially on Login Page
    expect(screen.getByText(/मुंबई पोलीस • MUMBAI POLICE/i)).toBeInTheDocument();

    const submitButton = screen.getByRole('button', { name: /Verify Biometric Passkey/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/API-7721/i)).toBeInTheDocument();
      expect(screen.getByText(/BKC Cyber Crime Police Station/i)).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  it('provides 1-click test biometric login with access to all data and stations', async () => {
    render(<App />);

    expect(screen.getByText(/मुंबई पोलीस • MUMBAI POLICE/i)).toBeInTheDocument();

    const testLoginBtn = screen.getByRole('button', { name: /Test Biometric Login/i });
    expect(testLoginBtn).toBeInTheDocument();
    fireEvent.click(testLoginBtn);

    await waitFor(() => {
      expect(screen.getByText(/Full Commissionerate Access|All Mumbai Police Stations/i)).toBeInTheDocument();
    }, { timeout: 3000 });
  });
});
