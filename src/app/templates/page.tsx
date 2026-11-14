'use client';

import React, { useState, useEffect } from 'react';
import {
  FileCode,
  Plus,
  RefreshCw,
  Layout,
  Eye,
  CheckCircle,
  XCircle,
  Sparkles,
  Layers,
  X,
  ExternalLink,
  ZoomIn,
} from 'lucide-react';
import { TemplateService } from '../../services/templateService';
import { Template } from '../../types';
import { Toast } from '../../components/common/Toast';
import { CardSkeleton } from '../../components/common/SkeletonLoader';
import { EmptyState } from '../../components/common/EmptyState';

// Pre-defined real resume layout presets matching the mobile app
const PRESET_STYLES = [
  {
    name: 'ATS Standard Format',
    thumbnail: '/templates/ats.png',
    layout: 'SINGLE_COLUMN' as const,
    category: 'ATS Optimized',
    desc: 'Clean single-column ATS formatted layout for automated scanners.',
  },
  {
    name: 'Modern Two-Column',
    thumbnail: '/templates/modern.png',
    layout: 'TWO_COLUMN' as const,
    category: 'Modern / Tech',
    desc: 'Dual-column layout with accented sidebar for technical skills.',
  },
  {
    name: 'Professional Executive',
    thumbnail: '/templates/resume-template.png',
    layout: 'SINGLE_COLUMN' as const,
    category: 'Executive',
    desc: 'Structured corporate resume for mid-to-senior professionals.',
  },
  {
    name: 'Basic Minimalist',
    thumbnail: '/templates/basic.png',
    layout: 'SINGLE_COLUMN' as const,
    category: 'Minimalist',
    desc: 'Crisp minimalist typography emphasizing work history.',
  },
  {
    name: 'Enterprise Corporate',
    thumbnail: '/templates/enterprise.png',
    layout: 'TWO_COLUMN' as const,
    category: 'Enterprise',
    desc: 'Enterprise CV layout with detailed project breakdowns.',
  },
  {
    name: 'Pro Technical Developer',
    thumbnail: '/templates/pro.png',
    layout: 'TWO_COLUMN' as const,
    category: 'Engineering',
    desc: 'Dense technical resume highlighting repositories and frameworks.',
  },
];

export default function TemplatesManagementPage() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('ATS Optimized');
  const [layoutType, setLayoutType] = useState<'SINGLE_COLUMN' | 'TWO_COLUMN'>('SINGLE_COLUMN');
  const [isPremium, setIsPremium] = useState(false);
  const [thumbnailUrl, setThumbnailUrl] = useState('/templates/ats.png');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchTemplates = async () => {
    setLoading(true);
    try {
      const res = await TemplateService.getAllTemplates();
      if (res && res.templates) {
        setTemplates(res.templates);
      }
    } catch (err: any) {
      setToastMessage({ text: err.message || 'Failed to load templates', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  const handleToggleStatus = async (id: string) => {
    try {
      const res = await TemplateService.toggleStatus(id);
      setToastMessage({ text: res.message || 'Template status updated', type: 'success' });
      setTemplates((prev) =>
        prev.map((t) => (t.id === id ? { ...t, isActive: !t.isActive } : t))
      );
    } catch (err: any) {
      setToastMessage({ text: err.message || 'Failed to update template', type: 'error' });
    }
  };

  const handleSelectPreset = (preset: typeof PRESET_STYLES[0]) => {
    setName(preset.name);
    setDescription(preset.desc);
    setCategory(preset.category);
    setLayoutType(preset.layout);
    setThumbnailUrl(preset.thumbnail);
  };

  const handleCreateTemplate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !description) {
      setToastMessage({ text: 'Please fill in the template name and description.', type: 'error' });
      return;
    }

    setIsSubmitting(true);
    try {
      await TemplateService.createTemplate({
        name,
        description,
        category,
        layoutType,
        isPremium,
        thumbnailUrl: thumbnailUrl || '/templates/ats.png',
      });
      setToastMessage({ text: 'New template published successfully!', type: 'success' });
      setIsAddModalOpen(false);
      setName('');
      setDescription('');
      fetchTemplates();
    } catch (err: any) {
      setToastMessage({ text: err.message || 'Failed to create template', type: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resolveThumbnailSrc = (url?: string | null) => {
    if (!url) return '/templates/ats.png';
    // If backend returns /public/templates/xyz.png, point to Next.js local static /templates/xyz.png
    if (url.includes('/public/templates/')) {
      return url.substring(url.indexOf('/templates/'));
    }
    return url;
  };

  return (
    <div className="space-y-6">
      {toastMessage && (
        <Toast
          message={toastMessage.text}
          type={toastMessage.type}
          onClose={() => setToastMessage(null)}
        />
      )}

      {/* 1. Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Resume Templates</h1>
          <p className="text-sm text-gray-500 mt-1">
            Real resume layouts and thumbnail previews served dynamically to the mobile application
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchTemplates}
            className="p-2 text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 shadow-sm transition"
            title="Refresh"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              handleSelectPreset(PRESET_STYLES[0]);
              setIsAddModalOpen(true);
            }}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 shadow-sm transition"
          >
            <Plus className="w-4 h-4" />
            + New Template
          </button>
        </div>
      </div>

      {/* 2. Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => <CardSkeleton key={i} />)
        ) : templates.length === 0 ? (
          <div className="col-span-full">
            <EmptyState
              title="No templates configured"
              description="No resume styles found in the catalog. Add a new template to display in the mobile app."
              icon={FileCode}
              actionText="+ Create First Template"
              onAction={() => setIsAddModalOpen(true)}
            />
          </div>
        ) : (
          templates.map((tpl) => {
            const imageSrc = resolveThumbnailSrc(tpl.thumbnailUrl);

            return (
              <div
                key={tpl.id}
                className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:border-gray-300 hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div>
                  {/* Real Resume Thumbnail Container */}
                  <div
                    onClick={() => setPreviewTemplate(tpl)}
                    className="h-64 bg-slate-100 relative overflow-hidden flex items-center justify-center p-3 cursor-pointer group-hover:bg-slate-200/60 transition-colors"
                  >
                    {/* Floating document mockup frame */}
                    <div className="relative w-44 h-56 bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden group-hover:scale-105 transition-transform duration-200">
                      <img
                        src={imageSrc}
                        alt={tpl.name}
                        className="w-full h-full object-cover object-top"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                      {/* Hover Overlay with Preview Icon */}
                      <div className="absolute inset-0 bg-blue-900/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="p-2 bg-white/95 rounded-full text-blue-600 shadow-lg">
                          <Eye className="w-5 h-5" />
                        </span>
                      </div>
                    </div>

                    {/* Top Badges */}
                    <div className="absolute top-3 left-3 flex items-center gap-1.5 z-10">
                      <span className="px-2 py-0.5 text-[11px] font-semibold bg-white/95 text-gray-800 rounded-md shadow-sm border border-gray-100">
                        {tpl.layoutType === 'TWO_COLUMN' ? '2-Column Modern' : '1-Column ATS'}
                      </span>
                      {tpl.isPremium && (
                        <span className="px-2 py-0.5 text-[11px] font-bold bg-purple-600 text-white rounded-md shadow-sm">
                          PRO
                        </span>
                      )}
                    </div>

                    <div className="absolute top-3 right-3 z-10">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-semibold rounded-md shadow-sm border ${
                          tpl.isActive
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-gray-100 text-gray-600 border-gray-200'
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${tpl.isActive ? 'bg-emerald-500' : 'bg-gray-400'}`} />
                        {tpl.isActive ? 'Active' : 'Draft'}
                      </span>
                    </div>
                  </div>

                  {/* Content Details */}
                  <div className="p-5">
                    <div className="flex items-center justify-between text-xs text-blue-600 font-semibold mb-1">
                      <span>{tpl.category}</span>
                      <button
                        onClick={() => setPreviewTemplate(tpl)}
                        className="text-[11px] text-gray-400 hover:text-blue-600 flex items-center gap-1 font-medium transition"
                      >
                        <Eye className="w-3.5 h-3.5" /> Preview
                      </button>
                    </div>
                    <h3 className="text-base font-bold text-gray-900 leading-tight mb-1.5">{tpl.name}</h3>
                    <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">{tpl.description}</p>
                  </div>
                </div>

                {/* Card Footer Controls */}
                <div className="p-4 border-t border-gray-100 bg-gray-50/50 flex items-center justify-between">
                  <span className="text-[11px] text-gray-400">
                    Slug: <code className="font-mono text-gray-600">{tpl.slug}</code>
                  </span>

                  <button
                    onClick={() => handleToggleStatus(tpl.id)}
                    className={`text-xs font-semibold px-3 py-1.5 rounded-xl border transition-colors ${
                      tpl.isActive
                        ? 'border-gray-200 text-gray-700 bg-white hover:bg-gray-100'
                        : 'border-blue-200 text-blue-700 bg-blue-50 hover:bg-blue-100'
                    }`}
                  >
                    {tpl.isActive ? 'Deactivate' : 'Publish Template'}
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* 3. Full Resume Document Preview Modal */}
      {previewTemplate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-gray-100 overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50">
              <div>
                <h3 className="text-base font-bold text-gray-900">{previewTemplate.name}</h3>
                <p className="text-xs text-gray-500">
                  {previewTemplate.category} • {previewTemplate.layoutType === 'TWO_COLUMN' ? '2-Column Modern' : '1-Column ATS'}
                </p>
              </div>
              <button
                onClick={() => setPreviewTemplate(null)}
                className="text-gray-400 hover:text-gray-600 p-1.5 rounded-xl hover:bg-gray-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Resume Document Viewer */}
            <div className="flex-1 overflow-y-auto p-6 bg-slate-100 flex items-center justify-center">
              <div className="bg-white rounded-xl shadow-2xl border border-gray-200 p-2 max-w-lg w-full">
                <img
                  src={resolveThumbnailSrc(previewTemplate.thumbnailUrl)}
                  alt={previewTemplate.name}
                  className="w-full h-auto rounded-lg object-contain"
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3.5 border-t border-gray-100 bg-white flex items-center justify-between">
              <span className="text-xs text-gray-500">
                Status: <strong className={previewTemplate.isActive ? 'text-emerald-600' : 'text-gray-500'}>
                  {previewTemplate.isActive ? 'Active (Live in Mobile App)' : 'Draft (Hidden)'}
                </strong>
              </span>
              <button
                onClick={() => setPreviewTemplate(null)}
                className="px-4 py-2 text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. Add Template Modal with Real Resume Presets */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-[2px]">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-gray-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5 border-b border-gray-100 pb-3">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Add New Resume Template</h3>
                <p className="text-xs text-gray-500">Select a real resume style preset or customize layout settings</p>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Preset Selector */}
            <div className="mb-5">
              <label className="block text-xs font-semibold text-gray-700 mb-2">
                Choose Real Resume Style Preset:
              </label>
              <div className="grid grid-cols-3 gap-2.5">
                {PRESET_STYLES.map((preset) => {
                  const isSelected = thumbnailUrl === preset.thumbnail;
                  return (
                    <button
                      type="button"
                      key={preset.thumbnail}
                      onClick={() => handleSelectPreset(preset)}
                      className={`p-2 rounded-xl border text-left flex flex-col items-center gap-1.5 transition ${
                        isSelected
                          ? 'border-blue-600 bg-blue-50/50 ring-2 ring-blue-500/20'
                          : 'border-gray-200 hover:border-gray-300 bg-white'
                      }`}
                    >
                      <div className="w-16 h-20 bg-slate-50 rounded border border-gray-200 overflow-hidden shadow-xs">
                        <img
                          src={preset.thumbnail}
                          alt={preset.name}
                          className="w-full h-full object-cover object-top"
                        />
                      </div>
                      <span className="text-[10px] font-semibold text-gray-800 text-center line-clamp-1">
                        {preset.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <form onSubmit={handleCreateTemplate} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Template Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. ATS Standard Format"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Target candidate persona and format specifications..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="ATS Optimized">ATS Optimized</option>
                    <option value="Modern / Tech">Modern / Tech</option>
                    <option value="Executive">Executive</option>
                    <option value="Minimalist">Minimalist</option>
                    <option value="Enterprise">Enterprise</option>
                    <option value="Engineering">Engineering</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Layout Architecture</label>
                  <select
                    value={layoutType}
                    onChange={(e: any) => setLayoutType(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="SINGLE_COLUMN">1-Column Classic ATS</option>
                    <option value="TWO_COLUMN">2-Column Modern Sidebar</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Thumbnail Asset URL / Path</label>
                <input
                  type="text"
                  required
                  placeholder="/templates/ats.png"
                  value={thumbnailUrl}
                  onChange={(e) => setThumbnailUrl(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="premiumCheck"
                  checked={isPremium}
                  onChange={(e) => setIsPremium(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                />
                <label htmlFor="premiumCheck" className="text-xs font-medium text-gray-700">
                  Require Premium / Pro subscription to unlock
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition shadow-sm flex items-center gap-2"
                >
                  {isSubmitting && <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                  Save & Publish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
