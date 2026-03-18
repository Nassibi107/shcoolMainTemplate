'use client';

import { useState } from 'react';
import { Save, Plus, Search } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Select } from '@/components/ui/Select';
import { Modal } from '@/components/ui/Modal';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/components/ui/Toast';

interface GradeEntry {
  studentId: string;
  name: string;
  code: string;
  scores: Record<string, number | null>;
}

const ASSESSMENTS = ['Quiz 1', 'Quiz 2', 'Midterm', 'Project', 'Final'];

const INITIAL_GRADES: GradeEntry[] = [
  { studentId: '1', name: 'Ahmed Hassan', code: 'STU-001', scores: { 'Quiz 1': 17, 'Quiz 2': 18, Midterm: 16, Project: 18, Final: null } },
  { studentId: '2', name: 'Sara Ali', code: 'STU-002', scores: { 'Quiz 1': 18, 'Quiz 2': 17, Midterm: 19, Project: 19, Final: null } },
  { studentId: '3', name: 'Mohamed Saad', code: 'STU-003', scores: { 'Quiz 1': 14, 'Quiz 2': 15, Midterm: 13, Project: 16, Final: null } },
  { studentId: '4', name: 'Fatima Omar', code: 'STU-004', scores: { 'Quiz 1': 19, 'Quiz 2': 18, Midterm: 19, Project: 20, Final: null } },
  { studentId: '5', name: 'Youssef Malik', code: 'STU-005', scores: { 'Quiz 1': 12, 'Quiz 2': 13, Midterm: 11, Project: 14, Final: null } },
];

const MAX_SCORES: Record<string, number> = { 'Quiz 1': 20, 'Quiz 2': 20, Midterm: 20, Project: 20, Final: 20 };
const WEIGHTS: Record<string, number> = { 'Quiz 1': 10, 'Quiz 2': 10, Midterm: 25, Project: 15, Final: 40 };

function calcAverage(scores: Record<string, number | null>): number | null {
  const entries = Object.entries(scores).filter(([, v]) => v !== null);
  if (entries.length === 0) return null;
  let totalWeight = 0;
  let weightedSum = 0;
  entries.forEach(([key, val]) => {
    const w = WEIGHTS[key] ?? 0;
    totalWeight += w;
    weightedSum += ((val as number) / (MAX_SCORES[key] ?? 100)) * 100 * w;
  });
  return totalWeight > 0 ? Math.round(weightedSum / totalWeight) : null;
}

function letterGrade(pct: number | null): { letter: string; variant: 'success' | 'secondary' | 'warning' | 'danger' | 'muted' } {
  if (pct === null) return { letter: '—', variant: 'muted' };
  if (pct >= 90) return { letter: 'A', variant: 'success' };
  if (pct >= 80) return { letter: 'B', variant: 'secondary' };
  if (pct >= 70) return { letter: 'C', variant: 'warning' };
  if (pct >= 60) return { letter: 'D', variant: 'warning' };
  return { letter: 'F', variant: 'danger' };
}

export default function TeacherGradebookPage() {
  const { user, loading } = useAuth();
  const [selectedClass, setSelectedClass] = useState('3A');
  const [selectedTerm, setSelectedTerm] = useState('T2');
  const toast = useToast();
  const [grades, setGrades] = useState<GradeEntry[]>(INITIAL_GRADES);
  const [editingCell, setEditingCell] = useState<{ studentId: string; assessment: string } | null>(null);
  const [cellValue, setCellValue] = useState('');
  const [search, setSearch] = useState('');
  const [saved, setSaved] = useState(false);

  const filtered = grades.filter((g) => !search || g.name.toLowerCase().includes(search.toLowerCase()));

  function startEdit(studentId: string, assessment: string, current: number | null) {
    setEditingCell({ studentId, assessment });
    setCellValue(current !== null ? String(current) : '');
  }

  function commitEdit() {
    if (!editingCell) return;
    const val = cellValue.trim() === '' ? null : Math.min(MAX_SCORES[editingCell.assessment] ?? 100, Math.max(0, Number(cellValue)));
    setGrades((prev) => prev.map((g) =>
      g.studentId === editingCell.studentId
        ? { ...g, scores: { ...g.scores, [editingCell.assessment]: isNaN(val as number) ? null : val } }
        : g
    ));
    setEditingCell(null);
    setSaved(false);
  }

  if (loading || !user) return null;

  return (
    <DashboardLayout user={user} pageTitle="Gradebook">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3 flex-wrap">
          <Select options={['3A', '3B', '4B', '2C', '5A'].map((c) => ({ value: c, label: `Class ${c}` }))} value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)} className="w-36" />
          <Select options={[{ value: 'T1', label: 'Term 1' }, { value: 'T2', label: 'Term 2' }, { value: 'T3', label: 'Term 3' }]} value={selectedTerm} onChange={(e) => setSelectedTerm(e.target.value)} className="w-32" />
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
            <input type="text" placeholder="Search student…" value={search} onChange={(e) => setSearch(e.target.value)} className="input-field pl-9 w-48" />
          </div>
        </div>
        <Button leftIcon={<Save className="w-4 h-4" />} size="sm" onClick={() => { setSaved(true); toast.success('Grades saved successfully'); }} disabled={saved}>
          {saved ? 'Saved!' : 'Save Grades'}
        </Button>
      </div>

      {/* Assessment weights info */}
      <div className="flex flex-wrap gap-2 mb-4">
        {ASSESSMENTS.map((a) => (
          <span key={a} className="text-xs bg-surface border border-border rounded-full px-3 py-1 text-muted">
            {a} <span className="font-semibold text-app-text">{WEIGHTS[a]}%</span>
          </span>
        ))}
      </div>

      <Card className="overflow-x-auto">
        <table className="w-full text-sm min-w-[700px]">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-3 px-4 text-muted font-medium">Student</th>
              {ASSESSMENTS.map((a) => (
                <th key={a} className="text-center py-3 px-3 text-muted font-medium">
                  {a}
                  <span className="block text-[10px] font-normal text-muted/70">/{MAX_SCORES[a]}</span>
                </th>
              ))}
              <th className="text-center py-3 px-3 text-muted font-medium">Avg</th>
              <th className="text-center py-3 px-3 text-muted font-medium">Grade</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((entry) => {
              const avg = calcAverage(entry.scores);
              const { letter, variant } = letterGrade(avg);
              return (
                <tr key={entry.studentId} className="border-t border-border/40 hover:bg-surface/60">
                  <td className="py-3 px-4">
                    <p className="font-medium">{entry.name}</p>
                    <p className="text-xs text-muted font-mono">{entry.code}</p>
                  </td>
                  {ASSESSMENTS.map((a) => {
                    const isEditing = editingCell?.studentId === entry.studentId && editingCell?.assessment === a;
                    const val = entry.scores[a];
                    return (
                      <td key={a} className="py-2 px-3 text-center">
                        {isEditing ? (
                          <input
                            type="number"
                            autoFocus
                            value={cellValue}
                            onChange={(e) => setCellValue(e.target.value)}
                            onBlur={commitEdit}
                            onKeyDown={(e) => { if (e.key === 'Enter') commitEdit(); if (e.key === 'Escape') setEditingCell(null); }}
                            className="w-16 text-center input-field text-sm py-1"
                            min="0"
                            max={MAX_SCORES[a]}
                          />
                        ) : (
                          <button
                            onClick={() => startEdit(entry.studentId, a, val)}
                            className={`w-14 text-center text-sm rounded-lg py-1 border transition-all hover:border-accent hover:bg-accent/5 ${
                              val === null ? 'text-muted border-dashed border-border' :
                              val >= 90 ? 'text-success bg-success/5 border-success/20' :
                              val >= 70 ? 'text-warning bg-warning/5 border-warning/20' :
                              val >= 60 ? 'text-orange-500 bg-orange-50 border-orange-200' :
                              'text-danger bg-danger/5 border-danger/20'
                            }`}
                          >
                            {val !== null ? val : '—'}
                          </button>
                        )}
                      </td>
                    );
                  })}
                  <td className="py-2 px-3 text-center font-mono font-semibold">{avg !== null ? `${avg}%` : '—'}</td>
                  <td className="py-2 px-3 text-center">
                    <Badge variant={variant}>{letter}</Badge>
                  </td>
                </tr>
              );
            })}
          </tbody>
          {/* Footer averages */}
          <tfoot>
            <tr className="border-t-2 border-border bg-surface/60">
              <td className="py-2.5 px-4 text-xs font-semibold text-muted">Class Average</td>
              {ASSESSMENTS.map((a) => {
                const vals = filtered.map((g) => g.scores[a]).filter((v) => v !== null) as number[];
                const avg = vals.length > 0 ? Math.round(vals.reduce((s, v) => s + v, 0) / vals.length) : null;
                return (
                  <td key={a} className="py-2.5 px-3 text-center text-xs font-mono font-semibold text-muted">
                    {avg !== null ? avg : '—'}
                  </td>
                );
              })}
              <td className="py-2.5 px-3 text-center text-xs font-mono font-semibold text-primary">
                {(() => {
                  const avgs = filtered.map((g) => calcAverage(g.scores)).filter((v) => v !== null) as number[];
                  return avgs.length > 0 ? `${Math.round(avgs.reduce((s, v) => s + v, 0) / avgs.length)}%` : '—';
                })()}
              </td>
              <td />
            </tr>
          </tfoot>
        </table>
      </Card>
      <p className="text-xs text-muted mt-3">Click any cell to edit. Press Enter to confirm, Escape to cancel.</p>
    </DashboardLayout>
  );
}
