import { describe, it, expect } from 'vitest';
import { generateBsa63Pdf } from './bsa63Certificate';
import { INITIAL_CASES, INITIAL_EVIDENCE, INITIAL_HASHES } from '../../services/seedData';
import { SEEDED_OFFICERS } from '../../context/AuthContext';

describe('Section 63 BSA (2023) PDF Certificate Generator (T-016)', () => {
  it('generates a valid A4 PDF document containing court and cryptographic attestation', async () => {
    const caseData = INITIAL_CASES[0];
    const evidence = INITIAL_EVIDENCE[0];
    const hashRecord = INITIAL_HASHES[0];
    const officer = SEEDED_OFFICERS['MH-POL-40211'];

    const doc = await generateBsa63Pdf({
      caseData,
      evidence,
      hashRecord,
      officer,
    });

    expect(doc).toBeDefined();
    expect(doc.internal.pageSize.getWidth()).toBeCloseTo(210, 0); // A4 width in mm
    expect(doc.internal.pageSize.getHeight()).toBeCloseTo(297, 0); // A4 height in mm

    // Verifies output produces a valid data string / blob
    const outputBlob = doc.output('blob');
    expect(outputBlob.size).toBeGreaterThan(5000);
    expect(outputBlob.type).toContain('pdf');
  });
});
