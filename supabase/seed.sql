-- ============================================================================
-- INCORRUPTA: Mumbai Police Initial Seed Data for Supabase
-- Run this in Supabase SQL Editor to populate sample officers, cases & exhibits
-- ============================================================================

-- 1. Insert Default Roles
INSERT INTO public.roles (id, role_name, description)
VALUES 
    ('10000000-0000-0000-0000-000000000001', 'INVESTIGATING_OFFICER', 'Field Investigating Officer (API/PSI)'),
    ('10000000-0000-0000-0000-000000000002', 'MALKHANA_INCHARGE', 'Police Station Malkhana Custodian (Head Constable)'),
    ('10000000-0000-0000-0000-000000000003', 'FORENSIC_SCIENTIST', 'FSL Kalina Cyber Forensic Examiner'),
    ('10000000-0000-0000-0000-000000000004', 'PUBLIC_PROSECUTOR', 'Sessions Court Public Prosecutor')
ON CONFLICT (role_name) DO NOTHING;

-- 2. Insert Pre-seeded Mumbai Police Officers
INSERT INTO public.users (
    id, sevarth_id, badge_number, full_name, full_name_marathi, 
    police_rank, posted_police_station, police_zone, clearance_level, role_id, is_active
)
VALUES 
    (
        '11111111-1111-4111-a111-111111111111', 
        'MH-MUM-2024-IO-0941', 
        'MH-MUM-8492', 
        'Sachin Kadam', 
        'सचिन कदम', 
        'ASSISTANT_POLICE_INSPECTOR'::public.police_rank, 
        'BKC Cyber Crime Police Station', 
        'Zone 8 (Cyber)', 
        2, 
        '10000000-0000-0000-0000-000000000001', 
        true
    ),
    (
        '22222222-2222-4222-a222-222222222222', 
        'MH-MUM-2024-MAL-0312', 
        'MH-MUM-1204', 
        'Ramesh Patil', 
        'रमेश पाटील', 
        'HEAD_CONSTABLE'::public.police_rank, 
        'Azad Maidan Police Station', 
        'Zone 1', 
        1, 
        '10000000-0000-0000-0000-000000000002', 
        true
    ),
    (
        '33333333-3333-4333-a333-333333333333', 
        'MH-FSL-2024-SCI-0078', 
        'MH-FSL-0078', 
        'Dr. Sneha Chitre', 
        'डॉ. स्नेहा चित्रे', 
        'SENIOR_POLICE_INSPECTOR'::public.police_rank, 
        'Kalina Forensic Science Laboratory', 
        'State FSL HQ', 
        3, 
        '10000000-0000-0000-0000-000000000003', 
        true
    ),
    (
        '44444444-4444-4444-a444-444444444444', 
        'MH-JUD-2024-PROS-0105', 
        'MH-BAR-9902', 
        'Adv. Rajeshwar Rao', 
        'अ‍ॅड. राजेश्वर राव', 
        'PUBLIC_PROSECUTOR'::public.police_rank, 
        'City Civil & Sessions Court, Mumbai', 
        'Judicial Division', 
        4, 
        '10000000-0000-0000-0000-000000000004', 
        true
    )
ON CONFLICT (sevarth_id) DO NOTHING;

-- 3. Insert Initial Cases
INSERT INTO public.cases (
    id, cr_number, police_station, fir_date, title, penal_sections, 
    status, investigating_officer_id, designated_court, description
)
VALUES 
    (
        'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
        'CR No. 142/2026 of BKC Cyber PS',
        'BKC Cyber Crime Police Station',
        '2026-08-14T10:30:00+05:30',
        'Corporate Ransomware & Unauthorized Data Exfiltration',
        ARRAY['BNS 316(2)', 'BNS 318(4)', 'IT Act 66D', 'IT Act 43'],
        'UNDER_INVESTIGATION'::public.case_status,
        '11111111-1111-4111-a111-111111111111',
        'City Civil & Sessions Court, Fort, Mumbai',
        'Ransomware deployment on banking infrastructure with server disk encryption and extortive cryptocurrency demands.'
    ),
    (
        'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
        'CR No. 89/2026 of Azad Maidan PS',
        'Azad Maidan Police Station',
        '2026-09-02T14:15:00+05:30',
        'Bank Vault Robbery & Surveillance Video Tampering',
        ARRAY['BNS 303(2)', 'BNS 331(4)', 'BNS 61(2)'],
        'UNDER_INVESTIGATION'::public.case_status,
        '22222222-2222-4222-a222-222222222222',
        'Esplanade Court (Killa Court), Mumbai',
        'Physical vault entry with severed alarm connections and recovered DVR drive containing damaged footage.'
    ),
    (
        'cccccccc-cccc-cccc-cccc-cccccccccccc',
        'CR No. 205/2026 of BKC Cyber PS',
        'BKC Cyber Crime Police Station',
        '2026-09-18T09:00:00+05:30',
        'AI Deepfake Impersonation & Executive Wire Fraud',
        ARRAY['BNS 318(2)', 'IT Act 66C', 'IT Act 66E'],
        'UNDER_INVESTIGATION'::public.case_status,
        '11111111-1111-4111-a111-111111111111',
        'City Civil & Sessions Court, Fort, Mumbai',
        'Synthetic audio and video generation cloning CEO biometric identity to execute unauthorized RTGS transfers.'
    )
ON CONFLICT (cr_number) DO NOTHING;

-- 4. Insert Initial Exhibits
INSERT INTO public.evidence (
    id, case_id, muddemal_number, title, category, status,
    panchnama_reference, panchnama_witnesses, seizure_location,
    seizure_timestamp, source_device_info, seizing_io_id, current_custodian_id,
    storage_bucket, storage_path, file_size_bytes, mime_type, is_sealed
)
VALUES 
    (
        'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee',
        'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
        'MDL-142/26-01',
        'Dell PowerEdge R750 Enterprise Server Primary SSD Image',
        'HARD_DISK_FORENSIC_IMAGE'::public.evidence_category,
        'IN_POLICE_MALKHANA'::public.muddemal_status,
        'PN-BKC-2026-0814-01',
        '[]'::jsonb,
        '{"lat": 19.0657, "lng": 72.8687, "address": "BKC Server Room, Bandra Kurla Complex, Mumbai"}'::jsonb,
        '2026-08-14T11:45:00+05:30',
        '{"make": "Dell", "model": "PowerEdge R750", "serial": "SN-DELL-8849201"}'::jsonb,
        '11111111-1111-4111-a111-111111111111',
        '11111111-1111-4111-a111-111111111111',
        'evidence-vault',
        'cases/bkc-142/raw-image.e01',
        2147483648,
        'application/octet-stream',
        true
    )
ON CONFLICT (muddemal_number) DO NOTHING;
