import React, { useState } from 'react';
import { Flag, X, Send, CheckCircle, AlertTriangle } from 'lucide-react';

interface ReportQuestionModalProps {
  questionId: string;
  dayId: number;
  questionText: string;
  options: string[];
  correctAnswerIndex: number;
  onClose: () => void;
}

export interface QuestionReport {
  timestamp: string;
  questionId: string;
  day: number;
  questionText: string;
  issueType: string;
  comment: string;
  suggestedAnswer: string;
  shownCorrectAnswer: string;
  allOptions: string;
}

const ISSUE_TYPES = [
  'Wrong Answer',
  'Wrong Question Text',
  'Typo / Grammar Error',
  'Missing or Wrong Explanation',
  'Duplicate Question',
  'Other',
];

const STORAGE_KEY = 'provia-question-reports';

// Google Apps Script URL (optional - will try to send but not required)
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbz6_PXewl21Nh7FviBikqHQ4powPGXdGZIG7Tssy3wVcEqyP5QdWmYm2Ay-3oHamBLK/exec';

/** Get all stored reports */
export function getStoredReports(): QuestionReport[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/** Save a report to localStorage */
function saveReport(report: QuestionReport) {
  const reports = getStoredReports();
  reports.push(report);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(reports));
}

/** Export all reports as CSV and download */
export function exportReportsCSV() {
  const reports = getStoredReports();
  if (reports.length === 0) return;

  const headers = ['Timestamp', 'Question ID', 'Day', 'Question Text', 'Issue Type', 'Comment', 'Suggested Answer', 'Shown Correct Answer', 'All Options'];
  const csvRows = [headers.join(',')];

  for (const r of reports) {
    const row = [
      r.timestamp,
      r.questionId,
      r.day,
      `"${(r.questionText || '').replace(/"/g, '""')}"`,
      r.issueType,
      `"${(r.comment || '').replace(/"/g, '""')}"`,
      `"${(r.suggestedAnswer || '').replace(/"/g, '""')}"`,
      `"${(r.shownCorrectAnswer || '').replace(/"/g, '""')}"`,
      `"${(r.allOptions || '').replace(/"/g, '""')}"`,
    ];
    csvRows.push(row.join(','));
  }

  const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `provia_reports_${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

/** Send report to Google Sheets via fetch POST */
function trySendToSheet(report: QuestionReport) {
  try {
    fetch(APPS_SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(report),
    }).catch(() => { /* silently fail — report already in localStorage */ });
  } catch {
    // Silently fail
  }
}

export const ReportQuestionModal: React.FC<ReportQuestionModalProps> = ({
  questionId, dayId, questionText, options, correctAnswerIndex, onClose,
}) => {
  const [issueType, setIssueType] = useState('');
  const [comment, setComment] = useState('');
  const [suggestedAnswer, setSuggestedAnswer] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  const handleSubmit = () => {
    if (!issueType) return;
    setStatus('sending');

    const report: QuestionReport = {
      timestamp: new Date().toISOString(),
      questionId: String(questionId),
      day: dayId,
      questionText: questionText.slice(0, 200),
      issueType,
      comment,
      suggestedAnswer,
      shownCorrectAnswer: options[correctAnswerIndex] || 'N/A',
      allOptions: options.join(' | '),
    };

    // Always save locally (guaranteed)
    saveReport(report);

    // Try to send to Google Sheets (best-effort)
    trySendToSheet(report);

    setStatus('success');
    setTimeout(onClose, 1800);
  };

  return (
    <div
      className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center"
      style={{ backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="w-full max-w-md rounded-t-2xl sm:rounded-2xl p-6 space-y-5 max-h-[90vh] overflow-y-auto"
        style={{
          backgroundColor: 'var(--bg-primary)',
          border: '1px solid var(--border)',
          boxShadow: '0 -8px 30px rgba(0,0,0,0.15)',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="text-base font-black flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
            <Flag className="w-4 h-4 text-orange-500" /> Report Question
          </h3>
          <button onClick={onClose} className="p-1 rounded-lg active:scale-90" style={{ color: 'var(--text-muted)' }}>
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success State */}
        {status === 'success' && (
          <div className="text-center py-8 space-y-3">
            <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto" />
            <p className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>Report Submitted!</p>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Thank you for helping improve PROVIA.</p>
          </div>
        )}

        {/* Error State */}
        {status === 'error' && (
          <div className="text-center py-6 space-y-3">
            <AlertTriangle className="w-12 h-12 text-red-500 mx-auto" />
            <p className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>Failed to send report</p>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Please try again later.</p>
            <button onClick={() => setStatus('idle')} className="text-xs font-bold px-4 py-2 rounded-lg" style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>
              Try Again
            </button>
          </div>
        )}

        {/* Form */}
        {(status === 'idle' || status === 'sending') && (
          <>
            {/* Question Preview */}
            <div className="rounded-xl p-3 text-xs" style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
              <span className="font-bold text-[10px] uppercase tracking-wider block mb-1" style={{ color: 'var(--text-muted)' }}>
                Q{questionId} · Day {dayId}
              </span>
              <p className="leading-relaxed line-clamp-3" style={{ color: 'var(--text-secondary)' }}>
                {questionText}
              </p>
            </div>

            {/* Issue Type */}
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider mb-2 block" style={{ color: 'var(--text-muted)' }}>
                What's wrong? *
              </label>
              <div className="grid grid-cols-2 gap-2">
                {ISSUE_TYPES.map((type) => (
                  <button
                    key={type}
                    onClick={() => setIssueType(type)}
                    className="text-xs font-semibold px-3 py-2.5 rounded-xl transition-all active:scale-95 text-left"
                    style={{
                      backgroundColor: issueType === type ? 'var(--accent-blue)' : 'var(--bg-secondary)',
                      color: issueType === type ? '#fff' : 'var(--text-secondary)',
                      border: `1.5px solid ${issueType === type ? 'var(--accent-blue)' : 'var(--border)'}`,
                    }}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Suggested Correct Answer */}
            {(issueType === 'Wrong Answer') && (
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider mb-2 block" style={{ color: 'var(--text-muted)' }}>
                  What should the correct answer be?
                </label>
                <div className="space-y-1.5">
                  {options.map((opt, i) => (
                    <button
                      key={i}
                      onClick={() => setSuggestedAnswer(opt)}
                      className="w-full text-left text-xs px-3 py-2.5 rounded-lg flex items-center gap-2 transition-all"
                      style={{
                        backgroundColor: suggestedAnswer === opt ? '#10b98115' : 'var(--bg-secondary)',
                        border: `1.5px solid ${suggestedAnswer === opt ? '#10b981' : 'var(--border)'}`,
                        color: 'var(--text-primary)',
                      }}
                    >
                      <span className="font-bold w-5 text-center" style={{ color: suggestedAnswer === opt ? '#10b981' : 'var(--text-muted)' }}>
                        {String.fromCharCode(65 + i)}
                      </span>
                      <span className="line-clamp-2">{opt}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Comment */}
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider mb-2 block" style={{ color: 'var(--text-muted)' }}>
                Additional Details (Optional)
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Describe the issue in detail..."
                rows={3}
                className="w-full text-sm rounded-xl px-4 py-3 resize-none focus:outline-none"
                style={{
                  backgroundColor: 'var(--bg-secondary)',
                  border: '1.5px solid var(--border)',
                  color: 'var(--text-primary)',
                }}
              />
            </div>

            {/* Submit */}
            <button
              onClick={handleSubmit}
              disabled={!issueType || status === 'sending'}
              className="w-full py-3.5 rounded-xl font-black text-xs tracking-widest text-white flex items-center justify-center gap-2 active:scale-95 transition-all disabled:opacity-40"
              style={{ backgroundColor: issueType ? '#ef4444' : 'var(--bg-secondary)' }}
            >
              {status === 'sending' ? (
                <span className="animate-pulse">SENDING...</span>
              ) : (
                <>
                  <Send className="w-4 h-4" /> SUBMIT REPORT
                </>
              )}
            </button>
          </>
        )}
      </div>
    </div>
  );
};
