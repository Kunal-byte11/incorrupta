import { describe, it, expect } from 'vitest';
import {
  Constants,
  User,
  Case,
  Evidence,
  EvidenceHash,
  ChainOfCustody,
  AuditLog,
  MumbaiPoliceRank,
  CaseStatus,
  EvidenceCategory,
  MuddemalStatus,
  CustodyMovementType,
} from './database';

describe('Database Schema & Type Definitions (T-004)', () => {
  it('defines all required Mumbai Police ranks', () => {
    const ranks = Constants.public.Enums.mumbai_police_rank;
    expect(ranks).toContain('ASSISTANT_POLICE_INSPECTOR');
    expect(ranks).toContain('POLICE_SUB_INSPECTOR');
    expect(ranks).toContain('HEAD_CONSTABLE');
    expect(ranks).toContain('PUBLIC_PROSECUTOR');
    expect(ranks).toContain('COMMISSIONER_OF_POLICE');
  });

  it('defines statutory case statuses under BNS / BNSS criminal procedure', () => {
    const statuses = Constants.public.Enums.case_status;
    expect(statuses).toContain('UNDER_INVESTIGATION');
    expect(statuses).toContain('CHARGESHEET_FILED');
    expect(statuses).toContain('PENDING_TRIAL');
    expect(statuses).toContain('ADJUDICATED');
  });

  it('defines Section 105 BNSS seizure and digital evidence categories', () => {
    const categories = Constants.public.Enums.evidence_category;
    expect(categories).toContain('SEARCH_SEIZURE_VIDEOGRAPHY_BNSS105');
    expect(categories).toContain('MOBILE_PHONE_EXTRACTION');
    expect(categories).toContain('CCTV_DVR_RECORDING');
    expect(categories).toContain('HARD_DISK_FORENSIC_IMAGE');
    expect(categories).toContain('CALL_DETAIL_RECORD_CDR');
    expect(categories).toContain('WHATSAPP_FORENSIC_EXPORT');
  });

  it('defines Muddemal property statuses from scene seizure to Kalina FSL', () => {
    const statuses = Constants.public.Enums.muddemal_status;
    expect(statuses).toContain('INGESTED_PRISTINE');
    expect(statuses).toContain('IN_POLICE_MALKHANA');
    expect(statuses).toContain('DISPATCHED_TO_KALINA_FSL');
    expect(statuses).toContain('RETURNED_FROM_FSL');
    expect(statuses).toContain('PRODUCED_IN_COURT');
  });

  it('defines chained custody movement types for Mumbai Police stations', () => {
    const movements = Constants.public.Enums.custody_movement_type;
    expect(movements).toContain('SCENE_SEIZURE_TO_MALKHANA');
    expect(movements).toContain('MALKHANA_TO_KALINA_FSL');
    expect(movements).toContain('KALINA_FSL_TO_MALKHANA');
    expect(movements).toContain('MALKHANA_TO_COURT_EXHIBIT');
  });

  it('validates sample user entity matches Mumbai Police schema', () => {
    const sampleOfficer: Partial<User> = {
      id: '550e8400-e29b-41d4-a716-446655440000',
      sevarth_id: 'MH-POL-40211',
      badge_number: 'API-7721',
      full_name: 'Sachin Kadam',
      full_name_marathi: 'सचिन कदम',
      police_rank: 'ASSISTANT_POLICE_INSPECTOR' as MumbaiPoliceRank,
      posted_police_station: 'BKC Cyber Police Station',
      police_zone: 'Zone VIII',
      clearance_level: 3,
      is_active: true,
    };

    expect(sampleOfficer.sevarth_id).toBe('MH-POL-40211');
    expect(sampleOfficer.police_rank).toBe('ASSISTANT_POLICE_INSPECTOR');
  });

  it('validates sample case and evidence entities', () => {
    const sampleCase: Partial<Case> = {
      cr_number: 'CR No. 142/2026',
      police_station: 'BKC Cyber Police Station',
      status: 'UNDER_INVESTIGATION' as CaseStatus,
      penal_sections: ['BNS 316(2)', 'BNS 318(4)', 'IT Act 66D'],
      designated_court: 'City Civil & Sessions Court, Fort, Mumbai',
    };

    const sampleEvidence: Partial<Evidence> = {
      muddemal_number: 'MDL-142/26-01',
      category: 'SEARCH_SEIZURE_VIDEOGRAPHY_BNSS105' as EvidenceCategory,
      status: 'INGESTED_PRISTINE' as MuddemalStatus,
      panchnama_reference: 'PAN-BKC-2026-089',
      is_sealed: true,
    };

    expect(sampleCase.cr_number).toContain('142/2026');
    expect(sampleEvidence.muddemal_number).toBe('MDL-142/26-01');
  });

  it('validates evidence hashes, chain of custody, and audit log entities', () => {
    const sampleHash: Partial<EvidenceHash> = {
      sha256_hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      blake3_hash: 'af1349b4f53f132e4d0d0f507b9a52de0c20a4b13a7c64c1f19638707e7b6d19',
      hashing_event_stage: 'SCENE_SEIZURE_PANCHNAMA',
      verification_passed: true,
    };

    const sampleCustody: Partial<ChainOfCustody> = {
      movement_type: 'SCENE_SEIZURE_TO_MALKHANA' as CustodyMovementType,
      purpose_memo: 'Seized hard drive deposited to Azad Maidan Malkhana Shelf #4',
      verification_hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      custody_sequence_number: 1,
    };

    const sampleAudit: Partial<AuditLog> = {
      action_verb: 'EXPORT_SEC63_CERT',
      target_entity: 'evidence',
      current_log_hash: 'b5a2c94f2e1d7a8b3c6e9f1a4d7b2c5e8a1f4d7b2c5e8a1f4d7b2c5e8a1f4d7b',
    };

    expect(sampleHash.sha256_hash).toHaveLength(64);
    expect(sampleCustody.movement_type).toBe('SCENE_SEIZURE_TO_MALKHANA');
    expect(sampleAudit.action_verb).toBe('EXPORT_SEC63_CERT');
  });
});
