import { INITIAL_CASES, type CaseRow } from './seedData';

const STORAGE_KEY = 'incorrupta_cases_registry';

function loadStoredCases(): CaseRow[] {
  if (typeof window === 'undefined') return INITIAL_CASES;
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_CASES));
    return INITIAL_CASES;
  }
  try {
    return JSON.parse(data);
  } catch {
    return INITIAL_CASES;
  }
}

function saveCases(cases: CaseRow[]): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cases));
  }
}

export class CasesService {
  /**
   * Retrieves cases filtered by police station isolation rules (T-008).
   * Officers with clearance level >= 4 (Public Prosecutor, Commissioner) can view cross-station cases.
   */
  static getCases(officerStation?: string, clearanceLevel: number = 1): CaseRow[] {
    const cases = loadStoredCases();
    if (!officerStation || clearanceLevel >= 4) {
      return cases;
    }
    return cases.filter((c) => c.police_station === officerStation);
  }

  static getCaseById(id: string): CaseRow | null {
    const cases = loadStoredCases();
    return cases.find((c) => c.id === id || c.cr_number === id) || null;
  }

  static createCase(newCase: {
    cr_number: string;
    police_station: string;
    fir_date: string;
    title: string;
    penal_sections: string[];
    investigating_officer_id: string;
    designated_court: string;
    description?: string | null;
  }): CaseRow {
    const cases = loadStoredCases();

    // Check duplicate CR Number
    if (cases.some((c) => c.cr_number.toLowerCase() === newCase.cr_number.trim().toLowerCase())) {
      throw new Error(`CR Number ${newCase.cr_number} already exists in the station registry.`);
    }

    const timestamp = new Date().toISOString();
    const created: CaseRow = {
      id: `case-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      cr_number: newCase.cr_number.trim(),
      police_station: newCase.police_station,
      fir_date: newCase.fir_date || timestamp,
      title: newCase.title.trim(),
      penal_sections: newCase.penal_sections,
      status: 'UNDER_INVESTIGATION',
      investigating_officer_id: newCase.investigating_officer_id,
      supervising_acp_id: null,
      designated_court: newCase.designated_court.trim(),
      description: newCase.description || null,
      created_at: timestamp,
      updated_at: timestamp,
    };

    const updated = [created, ...cases];
    saveCases(updated);
    return created;
  }

  static resetToSeed(): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_CASES));
    }
  }
}
