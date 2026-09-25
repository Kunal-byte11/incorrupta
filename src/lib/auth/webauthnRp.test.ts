import { describe, it, expect, beforeEach } from 'vitest';
import {
  createOfficerRegistrationOptions,
  createOfficerAuthenticationOptions,
  ChallengeStore,
  globalChallengeStore,
  DEFAULT_WEBAUTHN_CONFIG,
} from './webauthnRp';

describe('WebAuthn Relying Party Engine (T-005)', () => {
  const mockOfficer = {
    sevarthId: 'MH-POL-40211',
    fullName: 'Sachin Kadam',
  };

  beforeEach(() => {
    globalChallengeStore.clear();
  });

  describe('createOfficerRegistrationOptions', () => {
    it('generates cryptographic challenge and registration parameters for Mumbai Police officer', async () => {
      const options = await createOfficerRegistrationOptions(
        mockOfficer.sevarthId,
        mockOfficer.fullName
      );

      expect(options.challenge).toBeDefined();
      expect(options.challenge.length).toBeGreaterThan(16);
      expect(options.rp.name).toBe(DEFAULT_WEBAUTHN_CONFIG.rpName);
      expect(options.rp.id).toBe(DEFAULT_WEBAUTHN_CONFIG.rpID);
      expect(options.user.name).toBe(mockOfficer.sevarthId);
      expect(options.user.displayName).toContain(mockOfficer.fullName);
      expect(options.authenticatorSelection?.userVerification).toBe('required');

      // Verifies challenge was cached
      const cached = globalChallengeStore.get(mockOfficer.sevarthId);
      expect(cached).toBe(options.challenge);
    });
  });

  describe('createOfficerAuthenticationOptions', () => {
    it('generates authentication options with specified credential ID for passkey login', async () => {
      const mockCredentialId = 'test-credential-id-123';
      const options = await createOfficerAuthenticationOptions(
        mockOfficer.sevarthId,
        mockCredentialId
      );

      expect(options.challenge).toBeDefined();
      expect(options.rpId).toBe(DEFAULT_WEBAUTHN_CONFIG.rpID);
      expect(options.allowCredentials).toHaveLength(1);
      expect(options.allowCredentials?.[0]?.id).toBe(mockCredentialId);

      const cached = globalChallengeStore.get(mockOfficer.sevarthId);
      expect(cached).toBe(options.challenge);
    });

    it('generates authentication options without credentials for discoverable passkeys', async () => {
      const options = await createOfficerAuthenticationOptions(mockOfficer.sevarthId);

      expect(options.challenge).toBeDefined();
      expect(options.allowCredentials).toBeUndefined();
    });
  });

  describe('ChallengeStore (Replay Attack & TTL Protection)', () => {
    it('stores and retrieves challenge within valid TTL', () => {
      const store = new ChallengeStore();
      store.set('MH-POL-99999', 'secure-random-challenge', 10);

      expect(store.get('MH-POL-99999')).toBe('secure-random-challenge');
    });

    it('expires and deletes challenge after TTL elapses', () => {
      const store = new ChallengeStore();
      store.set('MH-POL-99999', 'expired-challenge', -1); // Negative TTL = already expired

      expect(store.get('MH-POL-99999')).toBeNull();
    });

    it('deletes challenge upon single-use consumption', () => {
      const store = new ChallengeStore();
      store.set('MH-POL-11111', 'single-use-challenge', 60);

      store.delete('MH-POL-11111');
      expect(store.get('MH-POL-11111')).toBeNull();
    });
  });
});
