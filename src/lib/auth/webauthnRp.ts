import {
  generateRegistrationOptions,
  verifyRegistrationResponse,
  generateAuthenticationOptions,
  verifyAuthenticationResponse,
  type GenerateRegistrationOptionsOpts,
  type GenerateAuthenticationOptionsOpts,
  type VerifyRegistrationResponseOpts,
  type VerifyAuthenticationResponseOpts,
  type VerifiedRegistrationResponse,
  type VerifiedAuthenticationResponse,
} from '@simplewebauthn/server';

export interface WebAuthnConfig {
  rpName: string;
  rpID: string;
  expectedOrigin: string | string[];
}

export const DEFAULT_WEBAUTHN_CONFIG: WebAuthnConfig = {
  rpName: 'Mumbai Police INCORRUPTA',
  rpID: 'localhost',
  expectedOrigin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
};

/**
 * ChallengeStore provides in-memory caching for active authentication ceremonies with TTL.
 */
export class ChallengeStore {
  private challenges = new Map<string, { challenge: string; expiresAt: number }>();

  set(sevarthId: string, challenge: string, ttlSeconds = 300): void {
    this.challenges.set(sevarthId, {
      challenge,
      expiresAt: Date.now() + ttlSeconds * 1000,
    });
  }

  get(sevarthId: string): string | null {
    const entry = this.challenges.get(sevarthId);
    if (!entry) return null;
    if (Date.now() > entry.expiresAt) {
      this.challenges.delete(sevarthId);
      return null;
    }
    return entry.challenge;
  }

  delete(sevarthId: string): void {
    this.challenges.delete(sevarthId);
  }

  clear(): void {
    this.challenges.clear();
  }
}

export const globalChallengeStore = new ChallengeStore();

/**
 * Generate FIDO2 WebAuthn registration options for a Mumbai Police officer.
 */
export async function createOfficerRegistrationOptions(
  sevarthId: string,
  fullName: string,
  config: WebAuthnConfig = DEFAULT_WEBAUTHN_CONFIG
) {
  const encoder = new TextEncoder();
  const userIdBytes = encoder.encode(sevarthId);

  const opts: GenerateRegistrationOptionsOpts = {
    rpName: config.rpName,
    rpID: config.rpID,
    userID: userIdBytes,
    userName: sevarthId,
    userDisplayName: `${fullName} (${sevarthId})`,
    attestationType: 'none',
    authenticatorSelection: {
      userVerification: 'required',
      residentKey: 'preferred',
    },
  };

  const options = await generateRegistrationOptions(opts);
  globalChallengeStore.set(sevarthId, options.challenge);
  return options;
}

/**
 * Verify WebAuthn registration response and return credential public key.
 */
export async function verifyOfficerRegistration(
  sevarthId: string,
  response: VerifyRegistrationResponseOpts['response'],
  config: WebAuthnConfig = DEFAULT_WEBAUTHN_CONFIG
): Promise<VerifiedRegistrationResponse> {
  const expectedChallenge = globalChallengeStore.get(sevarthId);
  if (!expectedChallenge) {
    throw new Error('CHALLENGE_EXPIRED_OR_NOT_FOUND');
  }

  const verification = await verifyRegistrationResponse({
    response,
    expectedChallenge,
    expectedOrigin: config.expectedOrigin,
    expectedRPID: config.rpID,
    requireUserVerification: true,
  });

  if (verification.verified) {
    globalChallengeStore.delete(sevarthId);
  }

  return verification;
}

/**
 * Generate WebAuthn authentication assertion options for login.
 */
export async function createOfficerAuthenticationOptions(
  sevarthId: string,
  credentialId?: string,
  config: WebAuthnConfig = DEFAULT_WEBAUTHN_CONFIG
) {
  const opts: GenerateAuthenticationOptionsOpts = {
    rpID: config.rpID,
    userVerification: 'required',
    allowCredentials: credentialId
      ? [
          {
            id: credentialId,
          },
        ]
      : undefined,
  };

  const options = await generateAuthenticationOptions(opts);
  globalChallengeStore.set(sevarthId, options.challenge);
  return options;
}

/**
 * Verify WebAuthn authentication assertion response.
 * Enforces sign counter monotonic check to prevent cloned key replay attacks.
 */
export async function verifyOfficerAuthentication(
  sevarthId: string,
  response: VerifyAuthenticationResponseOpts['response'],
  authenticator: {
    credentialPublicKey: Uint8Array;
    credentialID: string;
    counter: number;
  },
  config: WebAuthnConfig = DEFAULT_WEBAUTHN_CONFIG
): Promise<VerifiedAuthenticationResponse> {
  const expectedChallenge = globalChallengeStore.get(sevarthId);
  if (!expectedChallenge) {
    throw new Error('CHALLENGE_EXPIRED_OR_NOT_FOUND');
  }

  const verification = await verifyAuthenticationResponse({
    response,
    expectedChallenge,
    expectedOrigin: config.expectedOrigin,
    expectedRPID: config.rpID,
    authenticator,
    requireUserVerification: true,
  });

  if (verification.verified) {
    globalChallengeStore.delete(sevarthId);
  }

  return verification;
}
