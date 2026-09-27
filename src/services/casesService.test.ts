import { describe, it, expect, beforeEach } from 'vitest';
import { CasesService } from './casesService';
import { EvidenceService } from './evidenceService';

describe('CasesService & Station Isolation RLS (T-007, T-008)', () => {
  beforeEach(() => {
    localStorage.clear();
    CasesService.resetToSeed();
  });

  it('filters cases strictly by officer police station (Station Isolation)', () => {
    // API Sachin Kadam posted at BKC Cyber Crime Police Station
    const bkcCases = CasesService.getCases('BKC Cyber Crime Police Station', 3);
    expect(bkcCases.length).toBeGreaterThan(0);
    expect(bkcCases.every((c) => c.police_station === 'BKC Cyber Crime Police Station')).toBe(true);

    // HC Ramesh Patil posted at Azad Maidan Police Station
    const azadCases = CasesService.getCases('Azad Maidan Police Station', 2);
    expect(azadCases.length).toBe(1);
    expect(azadCases[0].cr_number).toBe('CR No. 89/2026 of Azad Maidan PS');
  });

  it('allows Public Prosecutor or Commissioner (Clearance >= 4) cross-station jurisdiction', () => {
    // Public Prosecutor Meera Deshmukh has clearance level 4
    const allCases = CasesService.getCases('City Civil & Sessions Court, Fort', 4);
    expect(allCases.length).toBe(3);
    const stations = new Set(allCases.map((c) => c.police_station));
    expect(stations.has('BKC Cyber Crime Police Station')).toBe(true);
    expect(stations.has('Azad Maidan Police Station')).toBe(true);
  });

  it('registers a new FIR / CR case with BNS penal sections', () => {
    const newCase = CasesService.createCase({
      cr_number: 'CR No. 301/2026 of BKC Cyber PS',
      police_station: 'BKC Cyber Crime Police Station',
      fir_date: '2026-09-25T11:00:00+05:30',
      title: 'Crypto Hawala & Offshore Identity Theft',
      penal_sections: ['BNS 318(4)', 'IT Act 66D'],
      investigating_officer_id: '11111111-1111-4111-a111-111111111111',
      designated_court: 'City Civil & Sessions Court, Fort, Mumbai',
      description: 'Illegal routing of cross-border financial tokens using compromised KYC records.',
    });

    expect(newCase.id).toBeDefined();
    expect(newCase.status).toBe('UNDER_INVESTIGATION');

    const retrieved = CasesService.getCaseById(newCase.id);
    expect(retrieved?.cr_number).toBe('CR No. 301/2026 of BKC Cyber PS');
  });

  it('rejects duplicate CR numbers to prevent evidence tampering', () => {
    expect(() => {
      CasesService.createCase({
        cr_number: 'CR No. 142/2026 of BKC Cyber PS', // duplicate
        police_station: 'BKC Cyber Crime Police Station',
        fir_date: '2026-09-25T11:00:00+05:30',
        title: 'Duplicate Attempt',
        penal_sections: ['BNS 316(2)'],
        investigating_officer_id: '11111111-1111-4111-a111-111111111111',
        designated_court: 'Sessions Court',
      });
    }).toThrow(/already exists/i);
  });
});

describe('EvidenceService & Muddemal Management (T-011, T-013, T-014)', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('fetches evidence items and baseline hashes for a specific CR case', () => {
    const evidenceList = EvidenceService.getEvidenceForCase('case-bkc-142');
    expect(evidenceList.length).toBe(3);

    const hashes = EvidenceService.getHashesForEvidence('evi-142-01');
    expect(hashes.length).toBe(1);
    expect(hashes[0].sha256_hash).toBe('9f83c605d4c82b3e925b139d404100e2ee196e0ab9a0280ec5738c611f12019e');
  });

  it('records custody transfer from IO to Station Malkhana with signature', () => {
    const transfer = EvidenceService.transferCustody({
      evidenceId: 'evi-142-01',
      transferorId: '11111111-1111-4111-a111-111111111111', // API Kadam
      transfereeId: '22222222-2222-4222-a222-222222222222', // HC Ramesh Patil
      movementType: 'SCENE_SEIZURE_TO_MALKHANA',
      purposeMemo: 'Deposit into secure Malkhana safe locker',
      malkhanaShelfLocation: 'Vault 2, Safe 08',
    });

    expect(transfer.custody_sequence_number).toBe(2);
    expect(transfer.transferor_signature).toContain('WEBAUTHN_SIG');

    const updated = EvidenceService.getEvidenceById('evi-142-01');
    expect(updated?.status).toBe('IN_POLICE_MALKHANA');
    expect(updated?.malkhana_shelf_location).toBe('Vault 2, Safe 08');
  });

  it('verifies cryptographic integrity against stored baseline hash', () => {
    const valid = EvidenceService.verifyIntegrity(
      'evi-142-01',
      '9f83c605d4c82b3e925b139d404100e2ee196e0ab9a0280ec5738c611f12019e'
    );
    expect(valid.match).toBe(true);

    const tampered = EvidenceService.verifyIntegrity(
      'evi-142-01',
      '0000000000000000000000000000000000000000000000000000000000000000'
    );
    expect(tampered.match).toBe(false);
  });
});
