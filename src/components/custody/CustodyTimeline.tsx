import React from 'react';
import { ArrowRight, ShieldCheck, Clock, KeyRound } from 'lucide-react';
import type { ChainOfCustodyRow } from '../../services/seedData';
import { SEEDED_OFFICERS } from '../../context/AuthContext';

interface CustodyTimelineProps {
  events: ChainOfCustodyRow[];
  language: 'en' | 'mr';
}

function resolveOfficerName(id: string, language: 'en' | 'mr'): string {
  const match = Object.values(SEEDED_OFFICERS).find((o) => o.id === id);
  if (match) {
    return language === 'mr' ? match.fullNameMarathi : `${match.fullName} (${match.badgeNumber})`;
  }
  return id.substring(0, 8);
}

export const CustodyTimeline: React.FC<CustodyTimelineProps> = ({ events, language }) => {
  if (events.length === 0) {
    return (
      <div className="p-8 text-center text-slate-500 text-xs font-mono">
        {language === 'mr'
          ? 'कोणतीही ताबा साखळी नोंद आढळली नाही.'
          : 'No custody movement events recorded for this property yet.'}
      </div>
    );
  }

  return (
    <div className="relative pl-6 space-y-5 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
      {events.map((evt) => (
        <div key={evt.id} className="relative group">
          {/* Node Dot */}
          <div className="absolute -left-6 top-1.5 h-5 w-5 rounded-full bg-white border-2 border-sovereign-navy flex items-center justify-center text-[10px] font-bold text-sovereign-navy shadow-sm">
            {evt.custody_sequence_number}
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 shadow-xs text-xs hover:border-sovereign-navy transition-colors">
            {/* Header: Movement Type & Timestamp */}
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
              <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-900 font-bold border border-amber-300 text-[11px] font-mono">
                {evt.movement_type.replace(/_/g, ' ')}
              </span>

              <div className="flex items-center gap-1.5 text-slate-500 text-[11px] font-mono">
                <Clock size={12} className="text-slate-400" />
                <span>
                  {new Date(evt.recorded_at).toLocaleString('en-IN', {
                    timeZone: 'Asia/Kolkata',
                    dateStyle: 'medium',
                    timeStyle: 'short',
                  })}{' '}
                  (IST)
                </span>
              </div>
            </div>

            {/* Transferor -> Transferee */}
            <div className="flex items-center gap-2 text-slate-900 font-medium my-2 bg-white p-2.5 rounded border border-slate-200 shadow-xs">
              <span className="text-slate-700">{resolveOfficerName(evt.transferor_id, language)}</span>
              <ArrowRight size={14} className="text-amber-700 shrink-0" />
              <span className="text-sovereign-navy font-bold">{resolveOfficerName(evt.transferee_id, language)}</span>
            </div>

            {/* Purpose Memo */}
            <p className="text-slate-600 text-xs mt-1 mb-3 italic">
              &ldquo;{evt.purpose_memo}&rdquo;
            </p>

            {/* Chained Cryptographic Hashes */}
            <div className="pt-2 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-2 text-[10px] font-mono text-slate-600">
              <div className="truncate">
                <span className="text-slate-400 font-medium">Prev Hash: </span>
                <span className="text-slate-700">{evt.previous_event_hash.substring(0, 16)}...</span>
              </div>
              <div className="truncate">
                <span className="text-slate-400 font-medium">Block Hash: </span>
                <span className="text-emerald-700 font-bold">{evt.current_event_hash.substring(0, 16)}...</span>
              </div>
            </div>

            {/* Signatures */}
            <div className="mt-2 flex flex-wrap gap-2 text-[9px] font-mono">
              <span className="px-2 py-0.5 rounded bg-white text-slate-700 border border-slate-200 flex items-center gap-1 shadow-xs">
                <KeyRound size={10} className="text-sovereign-navy" />
                Signer 1: {evt.transferor_signature.substring(0, 18)}...
              </span>
              <span className="px-2 py-0.5 rounded bg-white text-slate-700 border border-slate-200 flex items-center gap-1 shadow-xs">
                <ShieldCheck size={10} className="text-amber-700" />
                Signer 2: {evt.transferee_signature.substring(0, 18)}...
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
