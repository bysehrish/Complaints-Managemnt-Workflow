import React, { useState } from 'react';
import {
  Sparkles,
  Zap,
  AlertTriangle,
  TrendingUp,
  FileText,
  ChevronRight,
  ExternalLink,
  ShieldCheck,
  CheckCircle,
  Copy,
  Sliders,
  PanelRightClose,
  PanelRightOpen,
  HelpCircle
} from 'lucide-react';
import { AIActionItem, PerformanceInsight, DocumentTemplate, Complaint } from '../types';

interface AiAssistantPanelProps {
  actionItems: AIActionItem[];
  performanceInsights: PerformanceInsight[];
  templates: DocumentTemplate[];
  onTriggerAction: (item: AIActionItem) => void;
  onOpenTemplate: (tmpl: DocumentTemplate) => void;
  onFilterHighPriority: () => void;
  complaints: Complaint[];
  copilotActive: boolean;
}

export const AiAssistantPanel: React.FC<AiAssistantPanelProps> = ({
  actionItems,
  performanceInsights,
  templates,
  onTriggerAction,
  onOpenTemplate,
  onFilterHighPriority,
  complaints,
  copilotActive,
}) => {
  const [collapsed, setCollapsed] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const urgentCount = complaints.filter(
    (c) => c.priority === 'Critical' || c.priority === 'High'
  ).length;

  const handleCopyCode = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  if (collapsed) {
    return (
      <div className="w-12 bg-white border-l border-slate-200 flex flex-col items-center py-4 text-slate-500 shrink-0">
        <button
          onClick={() => setCollapsed(false)}
          className="p-2 rounded-lg hover:bg-slate-100 text-slate-700 transition-colors"
          title="Expand AI Assistant & Insights Panel"
        >
          <PanelRightOpen className="w-5 h-5 text-indigo-600" />
        </button>
        <div className="mt-8 [writing-mode:vertical-rl] rotate-180 text-xs font-bold tracking-wider text-slate-500 uppercase flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
          <span>AI Insights & Copilot</span>
        </div>
      </div>
    );
  }

  return (
    <aside className="w-80 bg-white border-l border-slate-200 flex flex-col shrink-0 h-[calc(100vh-65px)] overflow-y-auto select-none shadow-xs">
      {/* Panel Header */}
      <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/60 sticky top-0 z-10 backdrop-blur">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-indigo-600/10 border border-indigo-200 flex items-center justify-center text-indigo-600">
            <Sparkles className="w-4 h-4 fill-indigo-100" />
          </div>
          <div>
            <h2 className="text-xs font-bold text-slate-900 tracking-tight flex items-center gap-1.5">
              <span>AI Assistant & Insights</span>
            </h2>
            <div className="text-[10px] text-slate-500 font-medium">Real-time Copilot Governance</div>
          </div>
        </div>

        <button
          onClick={() => setCollapsed(true)}
          className="p-1.5 rounded-md hover:bg-slate-200 text-slate-400 hover:text-slate-700 transition-colors"
          title="Collapse Panel"
        >
          <PanelRightClose className="w-4 h-4" />
        </button>
      </div>

      <div className="p-4 space-y-6 text-xs">
        {/* SECTION 1: SUGGESTED NEXT ACTIONS */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-900 uppercase tracking-wide flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              Suggested Next Actions
            </span>
            <span className="text-[10px] font-mono text-slate-400">{actionItems.length} queued</span>
          </div>

          <div className="space-y-2">
            {actionItems.map((item, idx) => {
              const matchedComplaint = complaints.find((c) => c.id === item.complaintId);
              return (
                <div
                  key={item.id}
                  onClick={() => onTriggerAction(item)}
                  className="p-2.5 rounded-lg border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/40 cursor-pointer transition-all group bg-white shadow-2xs"
                >
                  <div className="flex items-start justify-between gap-1 mb-1">
                    <span className="font-semibold text-slate-800 group-hover:text-indigo-900 leading-snug">
                      {idx + 1}. {item.title}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[10px] pt-1">
                    <span className="font-mono text-slate-500 bg-slate-100 px-1.5 py-0.2 rounded">
                      {item.complaintId}
                    </span>
                    <span className={`font-semibold px-1.5 py-0.2 rounded border ${
                      item.severity === 'high'
                        ? 'bg-rose-50 text-rose-700 border-rose-200'
                        : 'bg-indigo-50 text-indigo-700 border-indigo-200'
                    }`}>
                      {item.badge}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* SECTION 2: SMART PRIORITIZATION */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-900 uppercase tracking-wide flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
              Smart Prioritization
            </span>
          </div>

          <div className="p-3 rounded-lg bg-amber-50/70 border border-amber-200 text-amber-900">
            <div className="flex items-start gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div className="text-[11px] leading-relaxed">
                <span className="font-bold">AI flagged {urgentCount} complaints</span> for immediate escalation due to repeated log-in and transfer errors.
              </div>
            </div>
            <button
              onClick={onFilterHighPriority}
              className="w-full py-1.5 px-2 bg-amber-600 hover:bg-amber-700 text-white rounded text-[11px] font-semibold transition-colors flex items-center justify-center gap-1"
            >
              <span>Filter High-Priority Queue</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* SECTION 3: PERFORMANCE INSIGHTS */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-900 uppercase tracking-wide flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-indigo-600" />
              Performance Insights
            </span>
            <span className="text-[10px] text-slate-400 font-mono">Live</span>
          </div>

          <div className="space-y-2">
            {performanceInsights.map((insight) => (
              <div
                key={insight.id}
                className={`p-2.5 rounded-lg border transition-all ${
                  insight.isAlert
                    ? 'bg-rose-50/40 border-rose-200 text-slate-800'
                    : 'bg-slate-50 border-slate-200 text-slate-700'
                }`}
              >
                <div className="text-[10px] font-semibold text-slate-500 truncate mb-0.5">
                  {insight.metric}
                </div>
                <div className="flex items-baseline justify-between">
                  <span className="text-sm font-bold text-slate-900 font-mono">
                    {insight.value}
                  </span>
                  <span className={`text-[10px] font-semibold ${
                    insight.isAlert ? 'text-rose-600' : 'text-emerald-600'
                  }`}>
                    {insight.change}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 4: RELEVANT TEMPLATES */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-900 uppercase tracking-wide flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-slate-600" />
              Relevant Templates
            </span>
          </div>

          <div className="space-y-2">
            {templates.map((tmpl) => (
              <div
                key={tmpl.id}
                className="p-2.5 rounded-lg border border-slate-200 bg-white hover:border-slate-300 transition-all flex flex-col justify-between shadow-2xs"
              >
                <div className="mb-1.5">
                  <div className="flex items-center justify-between gap-1 mb-0.5">
                    <span className="font-semibold text-slate-900 truncate">
                      {tmpl.title}
                    </span>
                    <span className="font-mono text-[9px] text-slate-400 px-1 bg-slate-100 rounded">
                      {tmpl.code}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500 line-clamp-1 leading-normal">
                    {tmpl.description}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                  <button
                    onClick={() => onOpenTemplate(tmpl)}
                    className="text-[10px] font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                  >
                    <span>Inspect Template</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>

                  <button
                    onClick={() => handleCopyCode(tmpl.id, tmpl.body)}
                    className="text-[10px] text-slate-400 hover:text-slate-700 flex items-center gap-0.5"
                    title="Copy template text"
                  >
                    {copiedId === tmpl.id ? (
                      <span className="text-emerald-600 flex items-center gap-0.5 font-semibold">
                        <CheckCircle className="w-3 h-3" /> Copied
                      </span>
                    ) : (
                      <span className="flex items-center gap-0.5">
                        <Copy className="w-3 h-3" /> Copy
                      </span>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
};
