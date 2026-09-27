// 07_RULES.md Section 5: Typed Errors Standard

export type ForensicsError =
  | { code: 'HASH_MISMATCH'; baseline: string; computed: string }
  | { code: 'WEBAUTHN_REJECTED'; reason: string }
  | { code: 'UNAUTHORIZED_CASE_ACCESS'; caseId: string }
  | { code: 'STORAGE_UPLOAD_FAILED'; status: number }
  | { code: 'INVALID_SEVARTH_ID'; sevarthId: string }
  | { code: 'CHALLENGE_FAILED'; message: string };

export function formatForensicsError(error: ForensicsError, lang: 'en' | 'mr' = 'en'): string {
  switch (error.code) {
    case 'WEBAUTHN_REJECTED':
      return lang === 'mr'
        ? `बायोमेट्रिक पडताळणी अयशस्वी: ${error.reason}`
        : `Biometric authentication rejected: ${error.reason}`;
    case 'INVALID_SEVARTH_ID':
      return lang === 'mr'
        ? `अवैध सेवायोजन आयडी: ${error.sevarthId}`
        : `Invalid Sevarth Employee ID: ${error.sevarthId}`;
    case 'HASH_MISMATCH':
      return lang === 'mr'
        ? 'डेटा फेरफार चेतावणी: मूळ हॅश जुळत नाही.'
        : `Verification Alert: Computed hash does not match baseline.`;
    default:
      return lang === 'mr'
        ? 'प्रणाली त्रुटी: कृपया पुन्हा प्रयत्न करा.'
        : 'System verification failed. Please try again.';
  }
}
