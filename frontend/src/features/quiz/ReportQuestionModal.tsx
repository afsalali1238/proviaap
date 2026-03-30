import React, { useState } from 'react';
import { Flag, X, Send, CheckCircle, Download } from 'lucide-react';

// ── Report data types ──
export interface QuestionReport {
  questionId: string;
  day: number;
  questionText: string;
  issueType: string;
  comment: string;
  suggestedAnswer: string;
  shownCorrectAnswer: string;
  allOptions: string;
  timestamp: string;
}

const STORAGE_KEY = 'provia-question-reports';

// ── Helper functions for managing reports ──
export function getReports(): QuestionReport[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveReport(report: QuestionReport): void {
  const reports = getReports();
  reports.push(report);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(reports));
}

export function getReportCount(): number {
  return getReports().length;
}

export function exportReportsAsCSV(): string {
  const reports = getReports();
  if (reports.length === 0) return '';

  const headers = ['Timestamp', 'Question ID', 'Day', 'Question Text', 'Issue Type', 'Comment', 'Suggested Answer', 'Shown Correct Answer', 'All Options'];
  const escape = (val: string) => `"${String(val).replace(/"/g, '""')}"`;

  const rows = reports.map(r => [
    r.timestamp, r.questionId, r.day, r.questionText,
    r.issueType, r.comment, r.suggestedAnswer, r.shownCorrectAnswer, r.allOptions,
  ].map(v => escape(String(v))).join(','));

  return [headers.join(','), ...rows].join('\n');
}

export function downloadReports(): void {
  const csv = exportReportsAsCSV();
  if (!csv) return;

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `provia_question_reports_${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// ── Modal Props ──
interface ReportQuestionModalProps {
  questionId: string;
  dayId: number;
  questionText: string;
  options: string[];
  correctAnswerIndex: number;
  onClose: () => void;
}

const ISSUE_TYPES = [
  'Wrong Answer',
  'Wrong Question Text',
  'Typo / Grammar Error',
  'Missing or Wrong Explanation',
  'Duplicate Question',
  'Other',
];

// ── Modal Component ──
export const ReportQuestionModal: React.FC<ReportQuestionModalProps> = ({
  questionId, dayId, questionText, options, correctAnswerIndex, onClose,
}) => {
  const [issueType, setIssueType] = useState('');
  const [comment, setComment] = useState('');
  const [suggestedAnswer, setSuggestedAnswer] = useState('');
  const [status, setStatus] = useState<'idle' | 'success'>('idle');

  const handleSubmit = () => {
    if (!issueType) return;

    saveReport({
      questionId,
      day: dayId,
      questionText: questionText.slice(0, 300),
      issueType,
      comment,
      suggestedAnswer,
      shownCorrectAnswer: options[correctAnswerIndex] || 'N/A',
      allOptions: options.join(' | '),
      timestamp: new Date().toISOString(),
    });

    setStatus('success');
    setTimeout(onClose, 1500);
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
            <p className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>Report Saved!</p>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Thank you for helping improve PROVIA.</p>
          </div>
        )}

        {/* Form */}
        {status === 'idle' && (
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
            {issueType === 'Wrong Answer' && (
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
              disabled={!issueType}
              className="w-full py-3.5 rounded-xl font-black text-xs tracking-widest text-white flex items-center justify-center gap-2 active:scale-95 transition-all disabled:opacity-40"
              style={{ backgroundColor: issueType ? '#ef4444' : 'var(--bg-secondary)' }}
            >
              <Send className="w-4 h-4" /> SUBMIT REPORT
            </button>
          </>
        )}
      </div>
    </div>
  );
};

// ── Export Button Component (for Dashboard settings) ──
export const ExportReportsButton: React.FC = () => {
  const count = getReportCount();

  if (count === 0) return null;

  return (
    <button
      onClick={downloadReports}
      className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold active:scale-[0.98] transition-transform"
      style={{
        backgroundColor: 'var(--bg-secondary)',
        border: '1px solid var(--border)',
        color: 'var(--text-primary)',
      }}
    >
      <span className="flex items-center gap-2">
        <Download className="w-4 h-4 text-orange-500" />
        Download Question Reports
      </span>
      <span className="text-xs px-2 py-0.5 rounded-full font-bold" style={{ backgroundColor: '#f9731620', color: '#f97316' }}>
        {count}
      </span>
    </button>
  );
};
