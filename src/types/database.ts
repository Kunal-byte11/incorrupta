export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      audit_logs: {
        Row: {
          action_verb: string
          actor_id: string | null
          current_log_hash: string
          id: string
          ip_address: unknown
          payload_snapshot: Json
          previous_log_hash: string
          target_entity: string
          target_id: string
          timestamp: string
          user_agent: string | null
        }
        Insert: {
          action_verb: string
          actor_id?: string | null
          current_log_hash: string
          id?: string
          ip_address?: unknown
          payload_snapshot?: Json
          previous_log_hash: string
          target_entity: string
          target_id: string
          timestamp?: string
          user_agent?: string | null
        }
        Update: {
          action_verb?: string
          actor_id?: string | null
          current_log_hash?: string
          id?: string
          ip_address?: unknown
          payload_snapshot?: Json
          previous_log_hash?: string
          target_entity?: string
          target_id?: string
          timestamp?: string
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "audit_logs_actor_id_fkey"
            columns: ["actor_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      authentication_events: {
        Row: {
          client_error: string | null
          created_at: string
          event_type: string
          id: string
          ip_address: unknown
          sign_counter_value: number | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          client_error?: string | null
          created_at?: string
          event_type: string
          id?: string
          ip_address?: unknown
          sign_counter_value?: number | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          client_error?: string | null
          created_at?: string
          event_type?: string
          id?: string
          ip_address?: unknown
          sign_counter_value?: number | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "authentication_events_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      case_assignments: {
        Row: {
          assigned_at: string
          assigned_by: string
          can_modify: boolean
          case_id: string
          id: string
          officer_id: string
        }
        Insert: {
          assigned_at?: string
          assigned_by: string
          can_modify?: boolean
          case_id: string
          id?: string
          officer_id: string
        }
        Update: {
          assigned_at?: string
          assigned_by?: string
          can_modify?: boolean
          case_id?: string
          id?: string
          officer_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "case_assignments_assigned_by_fkey"
            columns: ["assigned_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "case_assignments_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "cases"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "case_assignments_officer_id_fkey"
            columns: ["officer_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      cases: {
        Row: {
          cr_number: string
          created_at: string
          description: string | null
          designated_court: string
          fir_date: string
          id: string
          investigating_officer_id: string
          penal_sections: string[]
          police_station: string
          status: Database["public"]["Enums"]["case_status"]
          supervising_acp_id: string | null
          title: string
          updated_at: string
        }
        Insert: {
          cr_number: string
          created_at?: string
          description?: string | null
          designated_court: string
          fir_date: string
          id?: string
          investigating_officer_id: string
          penal_sections: string[]
          police_station: string
          status?: Database["public"]["Enums"]["case_status"]
          supervising_acp_id?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          cr_number?: string
          created_at?: string
          description?: string | null
          designated_court?: string
          fir_date?: string
          id?: string
          investigating_officer_id?: string
          penal_sections?: string[]
          police_station?: string
          status?: Database["public"]["Enums"]["case_status"]
          supervising_acp_id?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "cases_investigating_officer_id_fkey"
            columns: ["investigating_officer_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cases_supervising_acp_id_fkey"
            columns: ["supervising_acp_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      chain_of_custody: {
        Row: {
          current_event_hash: string
          custody_sequence_number: number
          evidence_id: string
          id: string
          movement_type: Database["public"]["Enums"]["custody_movement_type"]
          previous_event_hash: string
          purpose_memo: string
          recorded_at: string
          transferee_id: string
          transferee_signature: string
          transferor_id: string
          transferor_signature: string
          verification_hash: string
        }
        Insert: {
          current_event_hash: string
          custody_sequence_number: number
          evidence_id: string
          id?: string
          movement_type: Database["public"]["Enums"]["custody_movement_type"]
          previous_event_hash: string
          purpose_memo: string
          recorded_at?: string
          transferee_id: string
          transferee_signature: string
          transferor_id: string
          transferor_signature: string
          verification_hash: string
        }
        Update: {
          current_event_hash?: string
          custody_sequence_number?: number
          evidence_id?: string
          id?: string
          movement_type?: Database["public"]["Enums"]["custody_movement_type"]
          previous_event_hash?: string
          purpose_memo?: string
          recorded_at?: string
          transferee_id?: string
          transferee_signature?: string
          transferor_id?: string
          transferor_signature?: string
          verification_hash?: string
        }
        Relationships: [
          {
            foreignKeyName: "chain_of_custody_evidence_id_fkey"
            columns: ["evidence_id"]
            isOneToOne: false
            referencedRelation: "evidence"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chain_of_custody_transferee_id_fkey"
            columns: ["transferee_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chain_of_custody_transferor_id_fkey"
            columns: ["transferor_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      evidence: {
        Row: {
          case_id: string
          category: Database["public"]["Enums"]["evidence_category"]
          created_at: string
          current_custodian_id: string
          dfsl_kalina_acknowledgement_no: string | null
          file_size_bytes: number
          id: string
          is_sealed: boolean
          malkhana_shelf_location: string | null
          mime_type: string
          muddemal_number: string
          panch_witnesses: Json
          panchnama_reference: string
          seizing_io_id: string
          seizure_location: Json
          seizure_timestamp: string
          source_device_info: Json
          status: Database["public"]["Enums"]["muddemal_status"]
          storage_bucket: string
          storage_path: string
          title: string
          updated_at: string
        }
        Insert: {
          case_id: string
          category: Database["public"]["Enums"]["evidence_category"]
          created_at?: string
          current_custodian_id: string
          dfsl_kalina_acknowledgement_no?: string | null
          file_size_bytes: number
          id?: string
          is_sealed?: boolean
          malkhana_shelf_location?: string | null
          mime_type: string
          muddemal_number: string
          panch_witnesses?: Json
          panchnama_reference: string
          seizing_io_id: string
          seizure_location?: Json
          seizure_timestamp: string
          source_device_info?: Json
          status?: Database["public"]["Enums"]["muddemal_status"]
          storage_bucket: string
          storage_path: string
          title: string
          updated_at?: string
        }
        Update: {
          case_id?: string
          category?: Database["public"]["Enums"]["evidence_category"]
          created_at?: string
          current_custodian_id?: string
          dfsl_kalina_acknowledgement_no?: string | null
          file_size_bytes?: number
          id?: string
          is_sealed?: boolean
          malkhana_shelf_location?: string | null
          mime_type?: string
          muddemal_number?: string
          panch_witnesses?: Json
          panchnama_reference?: string
          seizing_io_id?: string
          seizure_location?: Json
          seizure_timestamp?: string
          source_device_info?: Json
          status?: Database["public"]["Enums"]["muddemal_status"]
          storage_bucket?: string
          storage_path?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "evidence_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "cases"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "evidence_current_custodian_id_fkey"
            columns: ["current_custodian_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "evidence_seizing_io_id_fkey"
            columns: ["seizing_io_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      evidence_hashes: {
        Row: {
          blake3_hash: string
          calculated_at: string
          calculated_by: string
          evidence_id: string
          hashing_event_stage: string
          id: string
          sha256_hash: string
          verification_passed: boolean
        }
        Insert: {
          blake3_hash: string
          calculated_at?: string
          calculated_by: string
          evidence_id: string
          hashing_event_stage: string
          id?: string
          sha256_hash: string
          verification_passed?: boolean
        }
        Update: {
          blake3_hash?: string
          calculated_at?: string
          calculated_by?: string
          evidence_id?: string
          hashing_event_stage?: string
          id?: string
          sha256_hash?: string
          verification_passed?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "evidence_hashes_calculated_by_fkey"
            columns: ["calculated_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "evidence_hashes_evidence_id_fkey"
            columns: ["evidence_id"]
            isOneToOne: false
            referencedRelation: "evidence"
            referencedColumns: ["id"]
          },
        ]
      }
      roles: {
        Row: {
          created_at: string
          description: string | null
          id: string
          role_name: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          role_name: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          role_name?: string
        }
        Relationships: []
      }
      users: {
        Row: {
          badge_number: string
          clearance_level: number
          created_at: string
          full_name: string
          full_name_marathi: string | null
          id: string
          is_active: boolean
          police_rank: Database["public"]["Enums"]["mumbai_police_rank"]
          police_zone: string
          posted_police_station: string
          role_id: string
          sevarth_id: string
          updated_at: string
          webauthn_credential_id: string | null
          webauthn_public_key: string | null
          webauthn_sign_counter: number | null
        }
        Insert: {
          badge_number: string
          clearance_level?: number
          created_at?: string
          full_name: string
          full_name_marathi?: string | null
          id: string
          is_active?: boolean
          police_rank: Database["public"]["Enums"]["mumbai_police_rank"]
          police_zone: string
          posted_police_station: string
          role_id: string
          sevarth_id: string
          updated_at?: string
          webauthn_credential_id?: string | null
          webauthn_public_key?: string | null
          webauthn_sign_counter?: number | null
        }
        Update: {
          badge_number?: string
          clearance_level?: number
          created_at?: string
          full_name?: string
          full_name_marathi?: string | null
          id?: string
          is_active?: boolean
          police_rank?: Database["public"]["Enums"]["mumbai_police_rank"]
          police_zone?: string
          posted_police_station?: string
          role_id?: string
          sevarth_id?: string
          updated_at?: string
          webauthn_credential_id?: string | null
          webauthn_public_key?: string | null
          webauthn_sign_counter?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "users_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      case_status:
        | "UNDER_INVESTIGATION"
        | "CHARGESHEET_FILED"
        | "PENDING_TRIAL"
        | "ADJUDICATED"
        | "COLD_CASE"
        | "EXPUNGED"
      custody_movement_type:
        | "SCENE_SEIZURE_TO_MALKHANA"
        | "MALKHANA_TO_KALINA_FSL"
        | "KALINA_FSL_TO_MALKHANA"
        | "MALKHANA_TO_COURT_EXHIBIT"
        | "INTERNAL_IO_INVESTIGATION"
        | "RETURN_TO_COMPLAINANT"
      evidence_category:
        | "SEARCH_SEIZURE_VIDEOGRAPHY_BNSS105"
        | "MOBILE_PHONE_EXTRACTION"
        | "CCTV_DVR_RECORDING"
        | "HARD_DISK_FORENSIC_IMAGE"
        | "CALL_DETAIL_RECORD_CDR"
        | "WHATSAPP_FORENSIC_EXPORT"
        | "FINANCIAL_LEDGER_PDF"
        | "NETWORK_PCAP_PACKET"
        | "OTHER"
      muddemal_status:
        | "INGESTED_PRISTINE"
        | "IN_POLICE_MALKHANA"
        | "DISPATCHED_TO_KALINA_FSL"
        | "RETURNED_FROM_FSL"
        | "PRODUCED_IN_COURT"
        | "RETURNED_TO_OWNER"
        | "SEALED_CONFIDENTIAL"
      mumbai_police_rank:
        | "COMMISSIONER_OF_POLICE"
        | "JOINT_CP"
        | "ADDITIONAL_CP"
        | "DEPUTY_CP"
        | "ASSISTANT_CP"
        | "SENIOR_POLICE_INSPECTOR"
        | "POLICE_INSPECTOR"
        | "ASSISTANT_POLICE_INSPECTOR"
        | "POLICE_SUB_INSPECTOR"
        | "HEAD_CONSTABLE"
        | "POLICE_NAIK"
        | "POLICE_CONSTABLE"
        | "PUBLIC_PROSECUTOR"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      case_status: [
        "UNDER_INVESTIGATION",
        "CHARGESHEET_FILED",
        "PENDING_TRIAL",
        "ADJUDICATED",
        "COLD_CASE",
        "EXPUNGED",
      ],
      custody_movement_type: [
        "SCENE_SEIZURE_TO_MALKHANA",
        "MALKHANA_TO_KALINA_FSL",
        "KALINA_FSL_TO_MALKHANA",
        "MALKHANA_TO_COURT_EXHIBIT",
        "INTERNAL_IO_INVESTIGATION",
        "RETURN_TO_COMPLAINANT",
      ],
      evidence_category: [
        "SEARCH_SEIZURE_VIDEOGRAPHY_BNSS105",
        "MOBILE_PHONE_EXTRACTION",
        "CCTV_DVR_RECORDING",
        "HARD_DISK_FORENSIC_IMAGE",
        "CALL_DETAIL_RECORD_CDR",
        "WHATSAPP_FORENSIC_EXPORT",
        "FINANCIAL_LEDGER_PDF",
        "NETWORK_PCAP_PACKET",
        "OTHER",
      ],
      muddemal_status: [
        "INGESTED_PRISTINE",
        "IN_POLICE_MALKHANA",
        "DISPATCHED_TO_KALINA_FSL",
        "RETURNED_FROM_FSL",
        "PRODUCED_IN_COURT",
        "RETURNED_TO_OWNER",
        "SEALED_CONFIDENTIAL",
      ],
      mumbai_police_rank: [
        "COMMISSIONER_OF_POLICE",
        "JOINT_CP",
        "ADDITIONAL_CP",
        "DEPUTY_CP",
        "ASSISTANT_CP",
        "SENIOR_POLICE_INSPECTOR",
        "POLICE_INSPECTOR",
        "ASSISTANT_POLICE_INSPECTOR",
        "POLICE_SUB_INSPECTOR",
        "HEAD_CONSTABLE",
        "POLICE_NAIK",
        "POLICE_CONSTABLE",
        "PUBLIC_PROSECUTOR",
      ],
    },
  },
} as const;

// Convenience domain entity types for Mumbai Police & Legal Workflows
export type Role = Database['public']['Tables']['roles']['Row'];
export type User = Database['public']['Tables']['users']['Row'];
export type Case = Database['public']['Tables']['cases']['Row'];
export type CaseAssignment = Database['public']['Tables']['case_assignments']['Row'];
export type Evidence = Database['public']['Tables']['evidence']['Row'];
export type EvidenceHash = Database['public']['Tables']['evidence_hashes']['Row'];
export type ChainOfCustody = Database['public']['Tables']['chain_of_custody']['Row'];
export type AuditLog = Database['public']['Tables']['audit_logs']['Row'];
export type AuthenticationEvent = Database['public']['Tables']['authentication_events']['Row'];

export type MumbaiPoliceRank = Database['public']['Enums']['mumbai_police_rank'];
export type CaseStatus = Database['public']['Enums']['case_status'];
export type EvidenceCategory = Database['public']['Enums']['evidence_category'];
export type MuddemalStatus = Database['public']['Enums']['muddemal_status'];
export type CustodyMovementType = Database['public']['Enums']['custody_movement_type'];
