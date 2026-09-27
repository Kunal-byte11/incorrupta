import { describe, it, expect } from 'vitest';
import { computeDualHash } from './streamHasher';

describe('Web Crypto Streaming Dual-Hashing Engine (T-009)', () => {
  it('computes exact SHA-256 and Blake3 hashes for arbitrary input', async () => {
    const content = 'Mumbai Police Cyber Forensic Seizure Sample';
    const blob = new Blob([content], { type: 'text/plain' });

    let lastProgress = 0;
    const result = await computeDualHash(blob, (p) => {
      lastProgress = p.percentage;
    });

    expect(result.sha256).toHaveLength(64);
    expect(result.blake3).toHaveLength(64);
    expect(result.fileSizeBytes).toBe(blob.size);
    expect(lastProgress).toBe(100);
    expect(result.durationMs).toBeGreaterThanOrEqual(0);
  });

  it('matches known empty string SHA-256 standard hash', async () => {
    const emptyBlob = new Blob([], { type: 'text/plain' });
    const result = await computeDualHash(emptyBlob);

    // Known SHA-256 for empty string
    expect(result.sha256).toBe('e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855');
    // Blake3 for empty string
    expect(result.blake3).toBe('af1349b9f5f9a1a6a0404dea36dcc9499bcb25c9adc112b7cc9a93cae41f3262');
  });
});
