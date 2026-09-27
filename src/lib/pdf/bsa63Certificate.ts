import { jsPDF } from 'jspdf';
import QRCode from 'qrcode';
import type { CaseRow, EvidenceRow, EvidenceHashRow } from '../../services/seedData';
import type { OfficerProfile } from '../../context/AuthContext';

export interface Bsa63CertificateParams {
  caseData: CaseRow;
  evidence: EvidenceRow;
  hashRecord: EvidenceHashRow;
  officer: OfficerProfile;
}

/**
 * Generates an official statutory certificate under Section 63(4) of the
 * Bharatiya Sakshya Adhiniyam, 2023 (BSA) for digital evidence court admissibility in Mumbai Courts.
 */
export async function generateBsa63Pdf(params: {
  caseData: CaseRow;
  evidence: EvidenceRow;
  hashRecord: EvidenceHashRow;
  officer: OfficerProfile;
}): Promise<jsPDF> {
  const { caseData, evidence, hashRecord, officer } = params;
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();

  // Primary Header
  doc.setFillColor(7, 13, 30); // #070D1E Police Navy
  doc.rect(0, 0, pageWidth, 28, 'F');

  doc.setTextColor(212, 175, 55); // #D4AF37 Gold
  doc.setFontSize(10);
  doc.text('महाराष्ट्र शासन • GOVERNMENT OF MAHARASHTRA', pageWidth / 2, 8, { align: 'center' });

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(15);
  doc.setFont('helvetica', 'bold');
  doc.text('MUMBAI POLICE COMMISSIONERATE', pageWidth / 2, 16, { align: 'center' });

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(0, 180, 216); // #00B4D8 Cyan
  doc.text('सद्रक्षणाय खलनिग्रहणाय • DIGITAL FORENSICS & MUDDEMAL MANAGEMENT', pageWidth / 2, 23, { align: 'center' });

  // Certificate Title
  let y = 37;
  doc.setTextColor(17, 24, 39);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('STATUTORY CERTIFICATE OF ELECTRONIC EVIDENCE ADMISSIBILITY', pageWidth / 2, y, { align: 'center' });
  y += 5;
  doc.setFontSize(10);
  doc.setTextColor(75, 85, 99);
  doc.text('[Under Section 63(4) of the Bharatiya Sakshya Adhiniyam, 2023 (BSA)]', pageWidth / 2, y, { align: 'center' });

  // Divider
  y += 5;
  doc.setDrawColor(212, 175, 55);
  doc.setLineWidth(0.6);
  doc.line(15, y, pageWidth - 15, y);

  // Case & Police Station Particulars Table
  y += 7;
  doc.setFontSize(9);
  doc.setTextColor(17, 24, 39);

  const drawRow = (label: string, value: string, currentY: number) => {
    doc.setFont('helvetica', 'bold');
    doc.text(label, 16, currentY);
    doc.setFont('helvetica', 'normal');
    doc.text(value, 68, currentY);
    return currentY + 5.5;
  };

  y = drawRow('Crime Register (CR) No:', caseData.cr_number, y);
  y = drawRow('Police Station / Unit:', caseData.police_station, y);
  y = drawRow('Designated Court:', caseData.designated_court, y);
  y = drawRow('Penal Sections:', caseData.penal_sections.join(', '), y);
  y = drawRow('Case Title / Incident:', caseData.title, y);

  // Evidence Details Box
  y += 3;
  doc.setFillColor(243, 244, 246);
  doc.roundedRect(15, y, pageWidth - 30, 48, 2, 2, 'F');
  doc.setDrawColor(209, 213, 219);
  doc.roundedRect(15, y, pageWidth - 30, 48, 2, 2, 'S');

  const boxY = y + 6;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(7, 13, 30);
  doc.text('EXHIBIT & MUDDEMAL PARTICULARS', 20, boxY);

  let ey = boxY + 6;
  ey = drawRow('Muddemal Property No:', evidence.muddemal_number, ey);
  ey = drawRow('Evidence Category:', evidence.category, ey);
  ey = drawRow('Panchnama Reference:', evidence.panchnama_reference, ey);
  ey = drawRow('File Size & MIME Type:', `${(evidence.file_size_bytes / (1024 * 1024)).toFixed(2)} MB (${evidence.mime_type})`, ey);
  ey = drawRow('Seizure Timestamp (IST):', new Date(evidence.seizure_timestamp).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }), ey);

  y += 54;

  // Cryptographic Hash Verifications Box
  doc.setFillColor(240, 253, 244); // light green
  doc.setDrawColor(34, 197, 94);
  doc.roundedRect(15, y, pageWidth - 30, 32, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(22, 101, 52);
  doc.setFontSize(9);
  doc.text('CRYPTOGRAPHIC HASH ATTESTATION (UNBROKEN CONTINUITY)', 20, y + 6);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(55, 65, 81);
  doc.text('SHA-256 Digest:', 20, y + 13);
  doc.setFont('courier', 'bold');
  doc.setTextColor(16, 185, 129); // Monospace green
  doc.text(hashRecord.sha256_hash, 50, y + 13);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(55, 65, 81);
  doc.text('Blake3 Digest:', 20, y + 20);
  doc.setFont('courier', 'bold');
  doc.setTextColor(16, 185, 129);
  doc.text(hashRecord.blake3_hash, 50, y + 20);

  doc.setFont('helvetica', 'italic');
  doc.setFontSize(7.5);
  doc.setTextColor(107, 114, 128);
  doc.text('Hashes calculated simultaneously at scene ingestion pursuant to Rule 63(4) statutory standard.', 20, y + 27);

  y += 38;

  // Statutory Statement under Section 63(4) BSA 2023
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(17, 24, 39);
  doc.text('STATUTORY DECLARATION UNDER SECTION 63(4) BSA, 2023:', 16, y);

  y += 4.5;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(55, 65, 81);
  const declarationText = `I, ${officer.fullName}, ${officer.policeRank.replace(/_/g, ' ')}, Sevarth ID: ${officer.sevarthId}, posted at ${officer.policeStation}, do hereby state and certify that:
1. The electronic record described herein was ingested under my lawful control and supervision in the performance of official duties.
2. During the period over which the electronic record was produced, the digital capturing device/system operated properly without tampering.
3. The cryptographic SHA-256 and Blake3 checksums above identify the identical pristine state of the electronic exhibit.
4. The contents of this certificate are true and correct to the best of my knowledge and official belief.`;

  const lines = doc.splitTextToSize(declarationText, pageWidth - 32);
  doc.text(lines, 16, y);

  y += lines.length * 3.6 + 6;

  // Generate QR Code with verification payload
  const qrPayload = JSON.stringify({
    muddemal: evidence.muddemal_number,
    cr: caseData.cr_number,
    sha256: hashRecord.sha256_hash,
    io_sevarth: officer.sevarthId,
    court: caseData.designated_court,
    verified_at: new Date().toISOString(),
  });

  const qrDataUrl = await QRCode.toDataURL(qrPayload, {
    width: 120,
    margin: 1,
    color: { dark: '#070D1E', light: '#FFFFFF' },
  });

  // QR Code image
  doc.addImage(qrDataUrl, 'PNG', 16, y, 26, 26);
  doc.setFontSize(7);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(75, 85, 99);
  doc.text('SCAN TO VERIFY LEDGER', 16, y + 30);

  // Officer Signature Box on the Right
  const sigX = 85;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(17, 24, 39);
  doc.text('CERTIFYING INVESTIGATING OFFICER:', sigX, y + 4);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(55, 65, 81);
  doc.text(`Name: ${officer.fullName} (${officer.fullNameMarathi})`, sigX, y + 10);
  doc.text(`Rank: ${officer.policeRank.replace(/_/g, ' ')}`, sigX, y + 15);
  doc.text(`Badge No: ${officer.badgeNumber} | Sevarth ID: ${officer.sevarthId}`, sigX, y + 20);
  doc.text(`Police Station: ${officer.policeStation}`, sigX, y + 25);
  doc.text(`Date of Certificate: ${new Date().toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata' })}`, sigX, y + 30);

  // Footer bar
  doc.setFillColor(7, 13, 30);
  doc.rect(0, 287, pageWidth, 10, 'F');
  doc.setFontSize(7);
  doc.setTextColor(200, 200, 200);
  doc.text('INCORRUPTA • CRYPTOGRAPHIC EVIDENCE CHAIN SYSTEM • MUMBAI POLICE', pageWidth / 2, 293, { align: 'center' });

  return doc;
}

export async function downloadBsa63Certificate(params: Bsa63CertificateParams): Promise<void> {
  const doc = await generateBsa63Pdf(params);
  const cleanMuddemal = params.evidence.muddemal_number.replace(/[^a-zA-Z0-9_-]/g, '_');
  doc.save(`BSA_Section_63_Certificate_${cleanMuddemal}.pdf`);
}
