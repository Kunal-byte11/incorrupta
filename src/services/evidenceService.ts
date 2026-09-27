import {
  INITIAL_EVIDENCE,
  INITIAL_HASHES,
  INITIAL_CUSTODY_EVENTS,
  type EvidenceRow,
  type EvidenceHashRow,
  type ChainOfCustodyRow,
} from './seedData';

const EVIDENCE_STORAGE_KEY = 'incorrupta_evidence_registry';
const HASHES_STORAGE_KEY = 'incorrupta_hashes_registry';
const CUSTODY_STORAGE_KEY = 'incorrupta_custody_registry';

function loadStored<T>(key: string, initial: T[]): T[] {
  if (typeof window === 'undefined') return initial;
  const data = localStorage.getItem(key);
  if (!data) {
    localStorage.setItem(key, JSON.stringify(initial));
    return initial;
  }
  try {
    return JSON.parse(data);
  } catch {
    return initial;
  }
}

function saveStored<T>(key: string, items: T[]): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(key, JSON.stringify(items));
  }
}

import type { Json } from '../types/database';

export interface IngestionPayload {
  caseId: string;
  title: string;
  category: EvidenceRow['category'];
  panchnamaReference: string;
  panchWitnesses: { name: string; address: string; phone: string }[];
  seizureLocation: { address: string; latitude?: number; longitude?: number };
  seizureTimestamp: string;
  sourceDeviceInfo: Json;
  seizingIoId: string;
  fileSizeBytes: number;
  mimeType: string;
  storagePath: string;
  sha256Hash: string;
  blake3Hash: string;
}

export class EvidenceService {
  static getEvidenceForCase(caseId: string): EvidenceRow[] {
    const list = loadStored<EvidenceRow>(EVIDENCE_STORAGE_KEY, INITIAL_EVIDENCE);
    return list.filter((e) => e.case_id === caseId);
  }

  static getAllEvidence(): EvidenceRow[] {
    return loadStored<EvidenceRow>(EVIDENCE_STORAGE_KEY, INITIAL_EVIDENCE);
  }

  static getEvidenceById(id: string): EvidenceRow | null {
    const list = loadStored<EvidenceRow>(EVIDENCE_STORAGE_KEY, INITIAL_EVIDENCE);
    return list.find((e) => e.id === id || e.muddemal_number === id) || null;
  }

  static getHashesForEvidence(evidenceId: string): EvidenceHashRow[] {
    const list = loadStored<EvidenceHashRow>(HASHES_STORAGE_KEY, INITIAL_HASHES);
    return list.filter((h) => h.evidence_id === evidenceId);
  }

  static getCustodyEventsForEvidence(evidenceId: string): ChainOfCustodyRow[] {
    const list = loadStored<ChainOfCustodyRow>(CUSTODY_STORAGE_KEY, INITIAL_CUSTODY_EVENTS);
    return list
      .filter((c) => c.evidence_id === evidenceId)
      .sort((a, b) => a.custody_sequence_number - b.custody_sequence_number);
  }

  static ingestEvidence(payload: IngestionPayload): {
    evidence: EvidenceRow;
    hashRecord: EvidenceHashRow;
    initialCustody: ChainOfCustodyRow;
  } {
    const evidenceList = loadStored<EvidenceRow>(EVIDENCE_STORAGE_KEY, INITIAL_EVIDENCE);
    const hashesList = loadStored<EvidenceHashRow>(HASHES_STORAGE_KEY, INITIAL_HASHES);
    const custodyList = loadStored<ChainOfCustodyRow>(CUSTODY_STORAGE_KEY, INITIAL_CUSTODY_EVENTS);

    const now = new Date().toISOString();
    const countForCase = evidenceList.filter((e) => e.case_id === payload.caseId).length + 1;
    const muddemalNumber = `MDL-${Date.now().toString().slice(-4)}/${new Date().getFullYear().toString().slice(-2)}-0${countForCase}`;
    const evidenceId = `evi-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;

    const newEvidence: EvidenceRow = {
      id: evidenceId,
      case_id: payload.caseId,
      muddemal_number: muddemalNumber,
      title: payload.title.trim(),
      category: payload.category,
      status: 'INGESTED_PRISTINE',
      panchnama_reference: payload.panchnamaReference.trim(),
      panch_witnesses: payload.panchWitnesses,
      seizure_location: payload.seizureLocation,
      seizure_timestamp: payload.seizureTimestamp || now,
      source_device_info: payload.sourceDeviceInfo,
      seizing_io_id: payload.seizingIoId,
      current_custodian_id: payload.seizingIoId,
      malkhana_shelf_location: null,
      dfsl_kalina_acknowledgement_no: null,
      storage_bucket: 'evidence-vault',
      storage_path: payload.storagePath,
      file_size_bytes: payload.fileSizeBytes,
      mime_type: payload.mimeType,
      is_sealed: true,
      created_at: now,
      updated_at: now,
    };

    const newHash: EvidenceHashRow = {
      id: `hash-${Date.now()}`,
      evidence_id: evidenceId,
      sha256_hash: payload.sha256Hash,
      blake3_hash: payload.blake3Hash,
      calculated_at: now,
      calculated_by: payload.seizingIoId,
      verification_passed: true,
      hashing_event_stage: 'SCENE_SEIZURE_PANCHNAMA',
    };

    const initialCustody: ChainOfCustodyRow = {
      id: `cust-${Date.now()}`,
      evidence_id: evidenceId,
      transferor_id: payload.seizingIoId,
      transferee_id: payload.seizingIoId,
      movement_type: 'SCENE_SEIZURE_TO_MALKHANA',
      purpose_memo: `Initial seizure under Section 105 BNSS 2023 with Panchnama ${payload.panchnamaReference}`,
      verification_hash: payload.sha256Hash,
      transferor_signature: `WEBAUTHN_SIG_IO_${payload.seizingIoId.substring(0, 8)}`,
      transferee_signature: `WEBAUTHN_SIG_IO_${payload.seizingIoId.substring(0, 8)}`,
      custody_sequence_number: 1,
      previous_event_hash: '0000000000000000000000000000000000000000000000000000000000000000',
      current_event_hash: payload.blake3Hash.padEnd(64, '0').slice(0, 64),
      recorded_at: now,
    };

    saveStored(EVIDENCE_STORAGE_KEY, [newEvidence, ...evidenceList]);
    saveStored(HASHES_STORAGE_KEY, [newHash, ...hashesList]);
    saveStored(CUSTODY_STORAGE_KEY, [...custodyList, initialCustody]);

    return { evidence: newEvidence, hashRecord: newHash, initialCustody };
  }

  static transferCustody(params: {
    evidenceId: string;
    transferorId: string;
    transfereeId: string;
    movementType: ChainOfCustodyRow['movement_type'];
    purposeMemo: string;
    malkhanaShelfLocation?: string;
    dfslAcknowledgementNo?: string;
  }): ChainOfCustodyRow {
    const evidenceList = loadStored<EvidenceRow>(EVIDENCE_STORAGE_KEY, INITIAL_EVIDENCE);
    const custodyList = loadStored<ChainOfCustodyRow>(CUSTODY_STORAGE_KEY, INITIAL_CUSTODY_EVENTS);
    const hashesList = loadStored<EvidenceHashRow>(HASHES_STORAGE_KEY, INITIAL_HASHES);

    const targetEvidence = evidenceList.find((e) => e.id === params.evidenceId);
    if (!targetEvidence) {
      throw new Error(`Evidence ${params.evidenceId} not found`);
    }

    const baselineHash = hashesList.find((h) => h.evidence_id === params.evidenceId)?.sha256_hash || '';
    const existingEvents = custodyList.filter((c) => c.evidence_id === params.evidenceId);
    const nextSeq = existingEvents.length + 1;
    const lastEvent = existingEvents[existingEvents.length - 1];
    const prevHash = lastEvent ? lastEvent.current_event_hash : '0000000000000000000000000000000000000000000000000000000000000000';

    const now = new Date().toISOString();
    // Simulate chained event hash
    const currentHash = Math.random().toString(16).substring(2).padEnd(64, 'a').slice(0, 64);

    const newCustody: ChainOfCustodyRow = {
      id: `cust-${Date.now()}`,
      evidence_id: params.evidenceId,
      transferor_id: params.transferorId,
      transferee_id: params.transfereeId,
      movement_type: params.movementType,
      purpose_memo: params.purposeMemo,
      verification_hash: baselineHash,
      transferor_signature: `WEBAUTHN_SIG_${params.transferorId.substring(0, 8)}`,
      transferee_signature: `WEBAUTHN_SIG_${params.transfereeId.substring(0, 8)}`,
      custody_sequence_number: nextSeq,
      previous_event_hash: prevHash,
      current_event_hash: currentHash,
      recorded_at: now,
    };

    // Update evidence status and custodian
    let newStatus = targetEvidence.status;
    if (params.movementType === 'SCENE_SEIZURE_TO_MALKHANA') {
      newStatus = 'IN_POLICE_MALKHANA';
    } else if (params.movementType === 'MALKHANA_TO_KALINA_FSL') {
      newStatus = 'DISPATCHED_TO_KALINA_FSL';
    } else if (params.movementType === 'KALINA_FSL_TO_MALKHANA') {
      newStatus = 'RETURNED_FROM_FSL';
    } else if (params.movementType === 'MALKHANA_TO_COURT_EXHIBIT') {
      newStatus = 'PRODUCED_IN_COURT';
    }

    const updatedEvidenceList = evidenceList.map((e) => {
      if (e.id === params.evidenceId) {
        return {
          ...e,
          status: newStatus,
          current_custodian_id: params.transfereeId,
          malkhana_shelf_location: params.malkhanaShelfLocation || e.malkhana_shelf_location,
          dfsl_kalina_acknowledgement_no: params.dfslAcknowledgementNo || e.dfsl_kalina_acknowledgement_no,
          updated_at: now,
        };
      }
      return e;
    });

    saveStored(EVIDENCE_STORAGE_KEY, updatedEvidenceList);
    saveStored(CUSTODY_STORAGE_KEY, [...custodyList, newCustody]);

    return newCustody;
  }

  static verifyIntegrity(evidenceId: string, currentSha256: string): {
    match: boolean;
    baselineHash: string;
    computedHash: string;
    timestamp: string;
  } {
    const hashes = this.getHashesForEvidence(evidenceId);
    const baseline = hashes[0]?.sha256_hash || '';
    const match = baseline.toLowerCase() === currentSha256.trim().toLowerCase();
    return {
      match,
      baselineHash: baseline,
      computedHash: currentSha256.trim(),
      timestamp: new Date().toISOString(),
    };
  }
}
