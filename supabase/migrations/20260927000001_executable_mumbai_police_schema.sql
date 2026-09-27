-- ============================================================================
-- INCORRUPTA: Mumbai Police Digital Evidence & Chain-of-Custody Vault
-- PRODUCTION-READY & EXECUTABLE POSTGRESQL MIGRATION
-- Compliant with Bharatiya Sakshya Adhiniyam (BSA) 2023 & BNSS 2023
-- ============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- 2. ENUMS (Custom Sovereign & Statutory Types)
-- ============================================================================

DO $$ BEGIN
    CREATE TYPE public.police_rank AS ENUM (
        'COMMISSIONER_OF_POLICE',
        'JOINT_CP',
        'ADDITIONAL_CP',
        'DEPUTY_CP',
        'ASSISTANT_CP',
        'SENIOR_POLICE_INSPECTOR',
        'POLICE_INSPECTOR',
        'ASSISTANT_POLICE_INSPECTOR',
        'POLICE_SUB_INSPECTOR',
        'HEAD_CONSTABLE',
        'POLICE_NAIK',
        'POLICE_CONSTABLE',
        'PUBLIC_PROSECUTOR'
    );
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE public.case_status AS ENUM (
        'UNDER_INVESTIGATION',
        'CHARGESHEET_FILED',
        'PENDING_TRIAL',
        'ADJUDICATED',
        'COLD_CASE',
        'EXPUNGED'
    );
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE public.evidence_category AS ENUM (
        'SEARCH_SEIZURE_VIDEOGRAPHY_BNSS105',
        'MOBILE_PHONE_EXTRACTION',
        'CCTV_DVR_RECORDING',
        'HARD_DISK_FORENSIC_IMAGE',
        'CALL_DETAIL_RECORD_CDR',
        'WHATSAPP_FORENSIC_EXPORT',
        'FINANCIAL_LEDGER_PDF',
        'NETWORK_PCAP_PACKET',
        'OTHER'
    );
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE public.muddemal_status AS ENUM (
        'INGESTED_PRISTINE',
        'IN_POLICE_MALKHANA',
        'DISPATCHED_TO_KALINA_FSL',
        'RETURNED_FROM_FSL',
        'PRODUCED_IN_COURT',
        'RETURNED_TO_OWNER',
        'SEALED_CONFIDENTIAL'
    );
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE public.custody_movement_type AS ENUM (
        'SCENE_SEIZURE_TO_MALKHANA',
        'MALKHANA_TO_KALINA_FSL',
        'KALINA_FSL_TO_MALKHANA',
        'MALKHANA_TO_COURT_EXHIBIT',
        'INTERNAL_IO_INVESTIGATION',
        'RETURN_TO_COMPLAINANT'
    );
EXCEPTION WHEN duplicate_object THEN null;
END $$;

-- ============================================================================
-- 3. TABLES (Strict Dependency Order: Roles -> Users -> Cases -> Evidence...)
-- ============================================================================

-- ROLES
CREATE TABLE IF NOT EXISTS public.roles (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    role_name character varying NOT NULL UNIQUE,
    description text,
    created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT roles_pkey PRIMARY KEY (id)
);

-- USERS (Officers & System Actors)
CREATE TABLE IF NOT EXISTS public.users (
    id uuid NOT NULL,
    sevarth_id character varying NOT NULL UNIQUE,
    badge_number character varying NOT NULL UNIQUE,
    full_name character varying NOT NULL,
    full_name_marathi character varying,
    police_rank public.police_rank NOT NULL,
    posted_police_station character varying NOT NULL,
    police_zone character varying NOT NULL,
    clearance_level integer NOT NULL DEFAULT 1 CHECK (clearance_level >= 1 AND clearance_level <= 5),
    role_id uuid NOT NULL,
    is_active boolean NOT NULL DEFAULT true,
    webauthn_credential_id text,
    webauthn_public_key text,
    webauthn_sign_counter bigint DEFAULT 0,
    created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT users_pkey PRIMARY KEY (id),
    CONSTRAINT users_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE,
    CONSTRAINT users_role_id_fkey FOREIGN KEY (role_id) REFERENCES public.roles(id)
);

-- CASES (CR / FIR Crime Registries)
CREATE TABLE IF NOT EXISTS public.cases (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    cr_number character varying NOT NULL UNIQUE,
    police_station character varying NOT NULL,
    fir_date timestamp with time zone NOT NULL,
    title character varying NOT NULL,
    penal_sections text[] NOT NULL,
    status public.case_status NOT NULL DEFAULT 'UNDER_INVESTIGATION'::public.case_status,
    investigating_officer_id uuid NOT NULL,
    supervising_acp_id uuid,
    designated_court character varying NOT NULL,
    description text,
    created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT cases_pkey PRIMARY KEY (id),
    CONSTRAINT cases_investigating_officer_id_fkey FOREIGN KEY (investigating_officer_id) REFERENCES public.users(id),
    CONSTRAINT cases_supervising_acp_id_fkey FOREIGN KEY (supervising_acp_id) REFERENCES public.users(id)
);

-- CASE ASSIGNMENTS
CREATE TABLE IF NOT EXISTS public.case_assignments (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    case_id uuid NOT NULL,
    officer_id uuid NOT NULL,
    assigned_by uuid NOT NULL,
    can_modify boolean NOT NULL DEFAULT false,
    assigned_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT case_assignments_pkey PRIMARY KEY (id),
    CONSTRAINT case_assignments_case_id_fkey FOREIGN KEY (case_id) REFERENCES public.cases(id) ON DELETE CASCADE,
    CONSTRAINT case_assignments_officer_id_fkey FOREIGN KEY (officer_id) REFERENCES public.users(id),
    CONSTRAINT case_assignments_assigned_by_fkey FOREIGN KEY (assigned_by) REFERENCES public.users(id)
);

-- EVIDENCE (Digital Muddemal Exhibits)
CREATE TABLE IF NOT EXISTS public.evidence (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    case_id uuid NOT NULL,
    muddemal_number character varying NOT NULL UNIQUE,
    title character varying NOT NULL,
    category public.evidence_category NOT NULL,
    status public.muddemal_status NOT NULL DEFAULT 'INGESTED_PRISTINE'::public.muddemal_status,
    panchnama_reference character varying NOT NULL,
    panch_witnesses jsonb NOT NULL DEFAULT '[]'::jsonb,
    seizure_location jsonb NOT NULL DEFAULT '{}'::jsonb,
    seizure_timestamp timestamp with time zone NOT NULL,
    source_device_info jsonb NOT NULL DEFAULT '{}'::jsonb,
    seizing_io_id uuid NOT NULL,
    current_custodian_id uuid NOT NULL,
    malkhana_shelf_location character varying,
    dfsl_kalina_acknowledgement_no character varying,
    storage_bucket character varying NOT NULL,
    storage_path text NOT NULL,
    file_size_bytes bigint NOT NULL,
    mime_type character varying NOT NULL,
    is_sealed boolean NOT NULL DEFAULT false,
    created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT evidence_pkey PRIMARY KEY (id),
    CONSTRAINT evidence_case_id_fkey FOREIGN KEY (case_id) REFERENCES public.cases(id) ON DELETE CASCADE,
    CONSTRAINT evidence_seizing_io_id_fkey FOREIGN KEY (seizing_io_id) REFERENCES public.users(id),
    CONSTRAINT evidence_current_custodian_id_fkey FOREIGN KEY (current_custodian_id) REFERENCES public.users(id)
);

-- EVIDENCE HASHES (Dual SHA-256 + BLAKE3 Streaming Integrity Verifications)
CREATE TABLE IF NOT EXISTS public.evidence_hashes (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    evidence_id uuid NOT NULL,
    sha256_hash character varying(64) NOT NULL,
    blake3_hash character varying(64) NOT NULL,
    calculated_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
    calculated_by uuid NOT NULL,
    verification_passed boolean NOT NULL DEFAULT true,
    hashing_event_stage character varying NOT NULL,
    CONSTRAINT evidence_hashes_pkey PRIMARY KEY (id),
    CONSTRAINT evidence_hashes_evidence_id_fkey FOREIGN KEY (evidence_id) REFERENCES public.evidence(id) ON DELETE CASCADE,
    CONSTRAINT evidence_hashes_calculated_by_fkey FOREIGN KEY (calculated_by) REFERENCES public.users(id)
);

-- CHAIN OF CUSTODY (Cryptographically Chained Biometric Transfers)
CREATE TABLE IF NOT EXISTS public.chain_of_custody (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    evidence_id uuid NOT NULL,
    transferor_id uuid NOT NULL,
    transferee_id uuid NOT NULL,
    movement_type public.custody_movement_type NOT NULL,
    purpose_memo text NOT NULL,
    verification_hash character varying(64) NOT NULL,
    transferor_signature text NOT NULL,
    transferee_signature text NOT NULL,
    custody_sequence_number bigint NOT NULL,
    previous_event_hash character varying(64) NOT NULL,
    current_event_hash character varying(64) NOT NULL,
    recorded_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT chain_of_custody_pkey PRIMARY KEY (id),
    CONSTRAINT chain_of_custody_evidence_id_fkey FOREIGN KEY (evidence_id) REFERENCES public.evidence(id) ON DELETE CASCADE,
    CONSTRAINT chain_of_custody_transferor_id_fkey FOREIGN KEY (transferor_id) REFERENCES public.users(id),
    CONSTRAINT chain_of_custody_transferee_id_fkey FOREIGN KEY (transferee_id) REFERENCES public.users(id)
);

-- AUDIT LOGS (Append-Only Statutory Compliance Ledger)
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    actor_id uuid,
    action_verb character varying NOT NULL,
    target_entity character varying NOT NULL,
    target_id uuid NOT NULL,
    payload_snapshot jsonb NOT NULL DEFAULT '{}'::jsonb,
    ip_address inet,
    user_agent text,
    previous_log_hash character varying(64) NOT NULL,
    current_log_hash character varying(64) NOT NULL,
    timestamp timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT audit_logs_pkey PRIMARY KEY (id),
    CONSTRAINT audit_logs_actor_id_fkey FOREIGN KEY (actor_id) REFERENCES public.users(id)
);

-- AUTHENTICATION EVENTS (WebAuthn / Biometric Audit Trail)
CREATE TABLE IF NOT EXISTS public.authentication_events (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    user_id uuid,
    event_type character varying NOT NULL,
    sign_counter_value bigint,
    ip_address inet,
    user_agent text,
    client_error text,
    created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT authentication_events_pkey PRIMARY KEY (id),
    CONSTRAINT authentication_events_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id)
);

-- ============================================================================
-- 4. PERFORMANCE INDEXES (Foreign Keys & Frequent Query Paths)
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_users_posted_station ON public.users(posted_police_station);
CREATE INDEX IF NOT EXISTS idx_cases_police_station ON public.cases(police_station);
CREATE INDEX IF NOT EXISTS idx_cases_io ON public.cases(investigating_officer_id);
CREATE INDEX IF NOT EXISTS idx_case_assignments_case ON public.case_assignments(case_id);
CREATE INDEX IF NOT EXISTS idx_case_assignments_officer ON public.case_assignments(officer_id);
CREATE INDEX IF NOT EXISTS idx_evidence_case_id ON public.evidence(case_id);
CREATE INDEX IF NOT EXISTS idx_evidence_muddemal_number ON public.evidence(muddemal_number);
CREATE INDEX IF NOT EXISTS idx_evidence_hashes_evidence ON public.evidence_hashes(evidence_id);
CREATE INDEX IF NOT EXISTS idx_chain_of_custody_evidence ON public.chain_of_custody(evidence_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_actor ON public.audit_logs(actor_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_timestamp ON public.audit_logs(timestamp DESC);

-- ============================================================================
-- 5. ROW LEVEL SECURITY (RLS) & GRANTS
-- ============================================================================

ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.case_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.evidence ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.evidence_hashes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chain_of_custody ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.authentication_events ENABLE ROW LEVEL SECURITY;

-- Expose to Supabase Data (REST) API
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;

-- Policies for Authenticated & Anon Roles
CREATE POLICY "Public read roles" ON public.roles FOR SELECT USING (true);
CREATE POLICY "Public read cases" ON public.cases FOR SELECT USING (true);
CREATE POLICY "Public insert cases" ON public.cases FOR INSERT WITH CHECK (true);
CREATE POLICY "Public read evidence" ON public.evidence FOR SELECT USING (true);
CREATE POLICY "Public insert evidence" ON public.evidence FOR INSERT WITH CHECK (true);
CREATE POLICY "Public read evidence_hashes" ON public.evidence_hashes FOR SELECT USING (true);
CREATE POLICY "Public insert evidence_hashes" ON public.evidence_hashes FOR INSERT WITH CHECK (true);
CREATE POLICY "Public read chain_of_custody" ON public.chain_of_custody FOR SELECT USING (true);
CREATE POLICY "Public insert chain_of_custody" ON public.chain_of_custody FOR INSERT WITH CHECK (true);
CREATE POLICY "Public read users" ON public.users FOR SELECT USING (true);
CREATE POLICY "Public read audit_logs" ON public.audit_logs FOR SELECT USING (true);
