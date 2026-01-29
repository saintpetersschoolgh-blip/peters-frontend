'use client';

import React, { useMemo, useState } from 'react';
import { ICONS } from '../../../../constants';
import { MOCK_ACADEMIC_YEARS, MOCK_CLASSES, MOCK_TERMS, MOCK_SYLLABUS_SUBJECTS } from '../mock-data';
import { SyllabusNav } from '../components/SyllabusNav';
import { ConfirmationModal } from '../components/ConfirmationModal';
import { useToasts } from '../components/ToastHost';
import type { SyllabusSubject, SyllabusUnit, SyllabusTopicContent } from '../types';
import { SYLLABUS_SUBJECTS_KEY, mergeSyllabusSubjects, useLocalStorageState } from '../lib';

function SelectField({
  label,
  value,
  onChange,
  options,
  placeholder = 'Select…',
}: {
  label: string;
  value: string;
  onChange: (next: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-2">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
      >
        <option value="">{placeholder}</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function TextField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (next: string) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-2">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}

function LinesTextarea({
  label,
  value,
  onChange,
  placeholder,
  helper,
}: {
  label: string;
  value: string;
  onChange: (next: string) => void;
  placeholder?: string;
  helper?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-2">{label}</label>
      <textarea
        rows={4}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      {helper ? <div className="text-xs text-slate-500 mt-1">{helper}</div> : null}
    </div>
  );
}

function parseLines(value: string): string[] {
  return value
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean);
}

type TopicDraft = {
  title: string;
  teachingPeriods: number;
  subTopicsText: string;
  objectivesText: string;
  keyConceptsText: string;
  teachingMaterialsText: string;
  referenceMaterialsText: string;
};

type UnitDraft = {
  title: string;
  topics: TopicDraft[];
};

function newTopicDraft(): TopicDraft {
  return {
    title: '',
    teachingPeriods: 2,
    subTopicsText: '',
    objectivesText: '',
    keyConceptsText: '',
    teachingMaterialsText: '',
    referenceMaterialsText: '',
  };
}

function newUnitDraft(): UnitDraft {
  return { title: '', topics: [newTopicDraft()] };
}

export default function CreateSubjectSyllabusPage() {
  const pathname = '/teachers/syllabus/create';
  const { ToastHost, pushToast } = useToasts();
  const [created, setCreated] = useLocalStorageState<SyllabusSubject[]>(SYLLABUS_SUBJECTS_KEY, []);

  const [academicYearId, setAcademicYearId] = useState('ay-2025-2026');
  const [termId, setTermId] = useState('t2-2025-2026');
  const [classId, setClassId] = useState('c-10a');
  const [subjectName, setSubjectName] = useState('');

  const [units, setUnits] = useState<UnitDraft[]>([newUnitDraft()]);
  const [showConfirm, setShowConfirm] = useState(false);
  const [busy, setBusy] = useState(false);

  const termsForYear = useMemo(() => MOCK_TERMS.filter((t) => t.academicYearId === academicYearId), [academicYearId]);
  const termEnded = useMemo(() => termsForYear.find((t) => t.id === termId)?.ended ?? false, [termsForYear, termId]);

  const allSubjects = useMemo(() => mergeSyllabusSubjects(MOCK_SYLLABUS_SUBJECTS, created), [created]);
  const duplicateExists = useMemo(() => {
    const name = subjectName.trim().toLowerCase();
    if (!name) return false;
    return allSubjects.some((s) => s.academicYearId === academicYearId && s.termId === termId && s.classId === classId && s.name.toLowerCase() === name);
  }, [allSubjects, academicYearId, termId, classId, subjectName]);

  const canSave = useMemo(() => {
    if (!academicYearId || !termId || !classId) return false;
    if (!subjectName.trim()) return false;
    if (duplicateExists) return false;
    if (!units.length) return false;
    if (units.some((u) => !u.title.trim())) return false;
    if (units.some((u) => !u.topics.length || u.topics.some((t) => !t.title.trim() || !t.teachingPeriods || t.teachingPeriods <= 0))) return false;
    return true;
  }, [academicYearId, termId, classId, subjectName, duplicateExists, units]);

  const buildSubject = (): SyllabusSubject => {
    const id = `custom-${academicYearId}-${termId}-${classId}-${subjectName.trim().toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`;
    const builtUnits: SyllabusUnit[] = units.map((u, ui) => {
      const unitId = `unit-${id}-${ui + 1}`;
      const topics: SyllabusTopicContent[] = u.topics.map((t, ti) => {
        const topicId = `topic-${id}-${ui + 1}-${ti + 1}`;
        return {
          id: topicId,
          title: t.title.trim(),
          teachingPeriods: Number(t.teachingPeriods) || 1,
          subTopics: parseLines(t.subTopicsText),
          learningObjectives: parseLines(t.objectivesText),
          keyConcepts: parseLines(t.keyConceptsText),
          teachingMaterials: parseLines(t.teachingMaterialsText),
          referenceMaterials: parseLines(t.referenceMaterialsText),
        };
      });
      return { id: unitId, title: u.title.trim(), topics };
    });

    return {
      id,
      academicYearId,
      termId,
      classId,
      name: subjectName.trim(),
      units: builtUnits,
    };
  };

  const doSave = async () => {
    if (!canSave) {
      pushToast({ tone: 'error', title: 'Fix required fields', message: 'Please complete all required fields before saving.' });
      return;
    }
    if (termEnded) {
      pushToast({ tone: 'error', title: 'Term ended', message: 'You cannot add a new syllabus for an ended term (demo rule).' });
      return;
    }
    setBusy(true);
    await new Promise((r) => setTimeout(r, 300));
    const subject = buildSubject();
    setCreated([subject, ...created]);
    setBusy(false);
    setShowConfirm(false);
    pushToast({ tone: 'success', title: 'Syllabus created', message: 'You can now view it in Overview/Progress/Submit.' });
    // Navigate to overview filtered by the new subject (user can pick it)
    window.location.hash = '#/teachers/syllabus';
  };

  return (
    <div className="space-y-6">
      <ToastHost />

      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Add Subject Syllabus</h1>
          <p className="text-slate-600 mt-1">Create Units and Topics for a subject syllabus (demo UI).</p>
          <div className="mt-3">
            <SyllabusNav pathname={pathname} />
          </div>
        </div>
      </div>

      {termEnded ? (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm text-amber-900">
          <div className="flex items-start gap-2">
            <span className="text-amber-700 mt-0.5">{ICONS.AlertTriangle}</span>
            <div>
              <div className="font-medium">Selected term is ended</div>
              <div className="mt-1">In this demo, creating a new syllabus is disabled for ended terms.</div>
            </div>
          </div>
        </div>
      ) : null}

      <div className="bg-white rounded-lg shadow p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <SelectField
            label="Academic Year"
            value={academicYearId}
            onChange={setAcademicYearId}
            options={MOCK_ACADEMIC_YEARS.map((y) => ({ value: y.id, label: y.name }))}
            placeholder="Select year"
          />
          <SelectField
            label="Term / Semester"
            value={termId}
            onChange={setTermId}
            options={termsForYear.map((t) => ({ value: t.id, label: `${t.name}${t.ended ? ' (Ended)' : ''}` }))}
            placeholder="Select term"
          />
          <SelectField
            label="Class"
            value={classId}
            onChange={setClassId}
            options={MOCK_CLASSES.map((c) => ({ value: c.id, label: c.name }))}
            placeholder="Select class"
          />
          <TextField label="Subject name" value={subjectName} onChange={setSubjectName} placeholder="e.g. Integrated Science" />
        </div>

        {duplicateExists ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-900">
            A syllabus already exists for this Year/Term/Class with the same subject name.
          </div>
        ) : null}
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-xl font-semibold text-slate-900">Units & Topics</h2>
          <button
            type="button"
            onClick={() => setUnits((prev) => [...prev, newUnitDraft()])}
            className="px-3 py-2 text-sm font-medium bg-blue-600 text-white rounded-md hover:bg-blue-700"
            disabled={termEnded}
          >
            {ICONS.Add} Add Unit
          </button>
        </div>

        {units.map((u, ui) => (
          <div key={ui} className="bg-white rounded-lg shadow border border-slate-200 p-6 space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <TextField
                  label={`Unit ${ui + 1} title *`}
                  value={u.title}
                  onChange={(next) =>
                    setUnits((prev) => prev.map((x, idx) => (idx === ui ? { ...x, title: next } : x)))
                  }
                  placeholder="e.g. Unit 1: Algebra Foundations"
                />
              </div>
              <button
                type="button"
                onClick={() => setUnits((prev) => prev.filter((_, idx) => idx !== ui))}
                className="mt-7 px-3 py-2 text-sm font-medium text-red-700 bg-red-50 rounded-md hover:bg-red-100 disabled:opacity-60"
                disabled={termEnded || units.length === 1}
                title={units.length === 1 ? 'At least one unit is required' : ''}
              >
                Remove
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-sm font-semibold text-slate-900">Topics</div>
              <button
                type="button"
                onClick={() =>
                  setUnits((prev) =>
                    prev.map((x, idx) => (idx === ui ? { ...x, topics: [...x.topics, newTopicDraft()] } : x)),
                  )
                }
                className="px-3 py-2 text-sm font-medium bg-slate-900 text-white rounded-md hover:bg-slate-800 disabled:opacity-60"
                disabled={termEnded}
              >
                {ICONS.Add} Add Topic
              </button>
            </div>

            <div className="space-y-4">
              {u.topics.map((t, ti) => (
                <div key={ti} className="border border-slate-200 rounded-lg p-4 space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3">
                      <TextField
                        label={`Topic ${ti + 1} title *`}
                        value={t.title}
                        onChange={(next) =>
                          setUnits((prev) =>
                            prev.map((x, idx) =>
                              idx === ui
                                ? {
                                    ...x,
                                    topics: x.topics.map((tt, tIdx) => (tIdx === ti ? { ...tt, title: next } : tt)),
                                  }
                                : x,
                            ),
                          )
                        }
                        placeholder="e.g. Linear Equations"
                      />
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Teaching periods *</label>
                        <input
                          type="number"
                          min={1}
                          value={t.teachingPeriods}
                          onChange={(e) => {
                            const next = Number(e.target.value) || 1;
                            setUnits((prev) =>
                              prev.map((x, idx) =>
                                idx === ui
                                  ? {
                                      ...x,
                                      topics: x.topics.map((tt, tIdx) =>
                                        tIdx === ti ? { ...tt, teachingPeriods: next } : tt,
                                      ),
                                    }
                                  : x,
                              ),
                            );
                          }}
                          className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div className="flex items-end justify-end">
                        <button
                          type="button"
                          onClick={() =>
                            setUnits((prev) =>
                              prev.map((x, idx) =>
                                idx === ui ? { ...x, topics: x.topics.filter((_, tIdx) => tIdx !== ti) } : x,
                              ),
                            )
                          }
                          className="px-3 py-2 text-sm font-medium text-red-700 bg-red-50 rounded-md hover:bg-red-100 disabled:opacity-60"
                          disabled={termEnded || u.topics.length === 1}
                          title={u.topics.length === 1 ? 'At least one topic is required' : ''}
                        >
                          Remove topic
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <LinesTextarea
                      label="Sub-topics"
                      value={t.subTopicsText}
                      onChange={(next) =>
                        setUnits((prev) =>
                          prev.map((x, idx) =>
                            idx === ui
                              ? {
                                  ...x,
                                  topics: x.topics.map((tt, tIdx) => (tIdx === ti ? { ...tt, subTopicsText: next } : tt)),
                                }
                              : x,
                          ),
                        )
                      }
                      placeholder="One per line"
                      helper="Enter each sub-topic on a new line"
                    />
                    <LinesTextarea
                      label="Learning objectives"
                      value={t.objectivesText}
                      onChange={(next) =>
                        setUnits((prev) =>
                          prev.map((x, idx) =>
                            idx === ui
                              ? {
                                  ...x,
                                  topics: x.topics.map((tt, tIdx) => (tIdx === ti ? { ...tt, objectivesText: next } : tt)),
                                }
                              : x,
                          ),
                        )
                      }
                      placeholder="One per line"
                    />
                    <LinesTextarea
                      label="Key concepts"
                      value={t.keyConceptsText}
                      onChange={(next) =>
                        setUnits((prev) =>
                          prev.map((x, idx) =>
                            idx === ui
                              ? {
                                  ...x,
                                  topics: x.topics.map((tt, tIdx) => (tIdx === ti ? { ...tt, keyConceptsText: next } : tt)),
                                }
                              : x,
                          ),
                        )
                      }
                      placeholder="One per line"
                    />
                    <LinesTextarea
                      label="Teaching materials"
                      value={t.teachingMaterialsText}
                      onChange={(next) =>
                        setUnits((prev) =>
                          prev.map((x, idx) =>
                            idx === ui
                              ? {
                                  ...x,
                                  topics: x.topics.map((tt, tIdx) =>
                                    tIdx === ti ? { ...tt, teachingMaterialsText: next } : tt,
                                  ),
                                }
                              : x,
                          ),
                        )
                      }
                      placeholder="One per line"
                    />
                    <LinesTextarea
                      label="Reference materials"
                      value={t.referenceMaterialsText}
                      onChange={(next) =>
                        setUnits((prev) =>
                          prev.map((x, idx) =>
                            idx === ui
                              ? {
                                  ...x,
                                  topics: x.topics.map((tt, tIdx) =>
                                    tIdx === ti ? { ...tt, referenceMaterialsText: next } : tt,
                                  ),
                                }
                              : x,
                          ),
                        )
                      }
                      placeholder="One per line"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow border border-slate-200 p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="text-sm text-slate-600">
          <div className="font-semibold text-slate-900">Rules</div>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>This is a demo builder to show how a teacher can add a subject syllabus.</li>
            <li>After creation, the syllabus content is treated as read-only (progress/notes are editable elsewhere).</li>
          </ul>
        </div>
        <button
          type="button"
          onClick={() => setShowConfirm(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-60"
          disabled={!canSave || termEnded || busy}
          title={!canSave ? 'Fill in required fields' : ''}
        >
          Save syllabus
        </button>
      </div>

      {showConfirm ? (
        <ConfirmationModal
          title="Save syllabus?"
          message={
            <div className="space-y-2">
              <p>This will create a new syllabus for the selected Year/Term/Class and make it available everywhere.</p>
              <div className="text-xs text-slate-600 bg-slate-50 border border-slate-200 rounded-md p-3">
                <div><span className="font-medium text-slate-900">Subject:</span> {subjectName || '—'}</div>
                <div className="mt-1"><span className="font-medium text-slate-900">Units:</span> {units.length}</div>
              </div>
            </div>
          }
          confirmLabel="Save"
          onConfirm={doSave}
          onClose={() => setShowConfirm(false)}
          busy={busy}
        />
      ) : null}
    </div>
  );
}

