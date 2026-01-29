import React, { useMemo, useState } from 'react';
import { ICONS } from '../../../../constants';
import type { SyllabusUnit, TopicProgressMap, TopicStatus } from '../types';
import { StatusBadge } from './StatusBadge';
import { ProgressBar } from './ProgressBar';

function statusForTopic(topicId: string, progress: TopicProgressMap, fallback: TopicStatus): TopicStatus {
  return progress[topicId]?.status || fallback;
}

function progressPercentForTopicIds(topicIds: string[], progress: TopicProgressMap, fallbackStatuses: Record<string, TopicStatus>) {
  const total = topicIds.length;
  if (!total) return { percent: 0, completed: 0, total: 0 };
  const completed = topicIds.filter((id) => statusForTopic(id, progress, fallbackStatuses[id]) === 'COMPLETED').length;
  const percent = Math.round((completed / total) * 100);
  return { percent, completed, total };
}

export function UnitAccordion({
  unit,
  progress,
  fallbackStatuses,
  onViewTopic,
}: {
  unit: SyllabusUnit;
  progress: TopicProgressMap;
  fallbackStatuses: Record<string, TopicStatus>;
  onViewTopic: (topicId: string) => void;
}) {
  const [open, setOpen] = useState(true);
  const topicIds = useMemo(() => unit.topics.map((t) => t.id), [unit.topics]);
  const unitProgress = useMemo(
    () => progressPercentForTopicIds(topicIds, progress, fallbackStatuses),
    [topicIds, progress, fallbackStatuses],
  );

  return (
    <div className="border border-slate-200 rounded-lg overflow-hidden bg-white">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full px-4 py-3 bg-slate-50 hover:bg-slate-100 transition-colors flex items-center justify-between"
      >
        <div className="min-w-0 text-left">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-900 truncate">{unit.title}</span>
            <span className="text-xs text-slate-600">
              ({unitProgress.completed}/{unitProgress.total} completed)
            </span>
          </div>
          <div className="mt-2 max-w-md">
            <ProgressBar value={unitProgress.percent} label={`${unitProgress.percent}%`} />
          </div>
        </div>
        <span className="text-slate-500">{open ? ICONS.ChevronDown : ICONS.ChevronRight}</span>
      </button>

      {open ? (
        <div className="divide-y divide-slate-200">
          {unit.topics.map((topic) => {
            const status = statusForTopic(topic.id, progress, (fallbackStatuses[topic.id] || 'NOT_STARTED') as TopicStatus);
            const isIncomplete = status !== 'COMPLETED';
            return (
              <div
                key={topic.id}
                className={`px-4 py-3 flex flex-col sm:flex-row sm:items-center gap-3 ${
                  isIncomplete ? 'bg-white' : 'bg-green-50/30'
                }`}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="font-medium text-slate-900 truncate">{topic.title}</div>
                      <div className="text-xs text-slate-600 mt-1">
                        Teaching periods: <span className="font-medium">{topic.teachingPeriods}</span>
                        {isIncomplete ? <span className="ml-2 text-amber-700">• Incomplete</span> : null}
                      </div>
                    </div>
                    <StatusBadge status={status} />
                  </div>
                  <div className="mt-2 text-xs text-slate-500 line-clamp-1">
                    Sub-topics: {topic.subTopics.join(', ') || '—'}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onViewTopic(topic.id)}
                    className="px-3 py-2 text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors"
                  >
                    View Details
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

