"use client";

import React from 'react';
import {
  X,
  Send,
  Bot,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Loader2,
  FileText,
  User as UserIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Document, User, AICheckResult, AICheckIssue } from '@/types';
import { cn } from '@/lib/utils';

interface SubmitReviewModalProps {
  isOpen: boolean;
  document: Document | null;
  reviewers: User[];
  currentUser: User;
  onClose: () => void;
  onSubmit: (reviewerId: string, comment: string) => void;
}

export function SubmitReviewModal({
  isOpen,
  document,
  reviewers,
  currentUser,
  onClose,
  onSubmit,
}: SubmitReviewModalProps) {
  const [selectedReviewerId, setSelectedReviewerId] = React.useState<string>('');
  const [comment, setComment] = React.useState('');
  const [isChecking, setIsChecking] = React.useState(false);
  const [checkProgress, setCheckProgress] = React.useState(0);
  const [aiResult, setAiResult] = React.useState<AICheckResult | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // 默认选择第一个审核人
  React.useEffect(() => {
    if (reviewers.length > 0 && !selectedReviewerId) {
      setSelectedReviewerId(reviewers[0].id);
    }
  }, [reviewers, selectedReviewerId]);

  // 模拟 AI 预检
  React.useEffect(() => {
    if (isOpen && document) {
      setIsChecking(true);
      setCheckProgress(0);
      setAiResult(null);

      // 模拟检查进度
      const progressInterval = setInterval(() => {
        setCheckProgress(prev => {
          if (prev >= 100) {
            clearInterval(progressInterval);
            return 100;
          }
          return prev + Math.random() * 15;
        });
      }, 200);

      // 模拟检查完成
      setTimeout(() => {
        clearInterval(progressInterval);
        setCheckProgress(100);
        setIsChecking(false);

        // 生成模拟的 AI 检查结果
        const mockIssues: AICheckIssue[] = [];
        const random = Math.random();

        if (random > 0.3) {
          mockIssues.push({
            id: 'mock_1',
            type: 'format',
            severity: 'suggestion',
            title: '建议优化表格排版',
            description: '部分表格内容较长，建议适当调整列宽',
            location: '第三章',
          });
        }
        if (random > 0.5) {
          mockIssues.push({
            id: 'mock_2',
            type: 'completeness',
            severity: 'warning',
            title: '部分章节内容较为简略',
            description: '建议补充更详细的实现说明',
            location: '第五章 实施方案',
          });
        }
        if (random > 0.8) {
          mockIssues.push({
            id: 'mock_3',
            type: 'consistency',
            severity: 'warning',
            title: '术语使用不一致',
            description: '文档中同时使用了"系统"和"平台"来指代同一对象',
            location: '全文',
          });
        }

        const score = Math.floor(85 + Math.random() * 15);

        setAiResult({
          score,
          checkedAt: new Date().toISOString(),
          summary: mockIssues.length === 0
            ? '文档质量优秀，可以提交审核'
            : `发现 ${mockIssues.length} 处可优化项，建议修改后提交`,
          issues: mockIssues,
        });
      }, 2000);
    }
  }, [isOpen, document]);

  // 重置状态
  React.useEffect(() => {
    if (!isOpen) {
      setComment('');
      setAiResult(null);
      setIsChecking(false);
      setCheckProgress(0);
      setIsSubmitting(false);
    }
  }, [isOpen]);

  const handleSubmit = async () => {
    if (!selectedReviewerId) return;

    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    onSubmit(selectedReviewerId, comment);
    setIsSubmitting(false);
  };

  if (!isOpen || !document) return null;

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-emerald-600 bg-emerald-50 border-emerald-200';
    if (score >= 80) return 'text-blue-600 bg-blue-50 border-blue-200';
    if (score >= 60) return 'text-amber-600 bg-amber-50 border-amber-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-full max-w-lg mx-4 shadow-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-zinc-100 rounded-lg flex items-center justify-center">
              <Send className="w-5 h-5 text-zinc-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-zinc-900">提交审核</h2>
              <p className="text-sm text-zinc-500">文档将进入审批流程</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-zinc-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Document Info */}
          <div className="flex items-center gap-3 p-3 bg-zinc-50 rounded-lg">
            <FileText className="w-5 h-5 text-zinc-400" />
            <div>
              <p className="font-medium text-zinc-900">{document.title}</p>
              <p className="text-xs text-zinc-500">
                {document.wordCount} 字 · 版本 {document.version}
              </p>
            </div>
          </div>

          {/* AI Check */}
          <div className="border border-zinc-200 rounded-lg overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 bg-zinc-50 border-b border-zinc-200">
              <div className="flex items-center gap-2">
                <Bot className="w-4 h-4 text-zinc-600" />
                <span className="font-medium text-sm text-zinc-900">AI 智能预检</span>
              </div>
              {isChecking ? (
                <span className="text-xs text-zinc-500">检查中...</span>
              ) : aiResult && (
                <span className={cn(
                  'text-xs font-medium px-2 py-0.5 rounded border',
                  getScoreColor(aiResult.score)
                )}>
                  {aiResult.score} 分
                </span>
              )}
            </div>

            <div className="p-4">
              {isChecking ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-zinc-600">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    正在检查文档规范性...
                  </div>
                  <div className="h-2 bg-zinc-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-zinc-900 transition-all duration-300"
                      style={{ width: `${Math.min(checkProgress, 100)}%` }}
                    />
                  </div>
                  <div className="flex items-center gap-2 text-xs text-zinc-500">
                    <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                    格式规范检查
                    {checkProgress > 30 && (
                      <>
                        <span className="mx-1">·</span>
                        <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                        内容完整性检查
                      </>
                    )}
                    {checkProgress > 60 && (
                      <>
                        <span className="mx-1">·</span>
                        <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                        逻辑一致性检查
                      </>
                    )}
                  </div>
                </div>
              ) : aiResult && (
                <div className="space-y-3">
                  <p className="text-sm text-zinc-700">{aiResult.summary}</p>

                  {aiResult.issues.length > 0 && (
                    <div className="space-y-2">
                      {aiResult.issues.map(issue => (
                        <div
                          key={issue.id}
                          className={cn(
                            'flex items-start gap-2 p-2 rounded-lg text-sm',
                            issue.severity === 'error' ? 'bg-red-50' :
                            issue.severity === 'warning' ? 'bg-amber-50' : 'bg-blue-50'
                          )}
                        >
                          {issue.severity === 'error' && (
                            <XCircle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
                          )}
                          {issue.severity === 'warning' && (
                            <AlertCircle className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                          )}
                          {issue.severity === 'suggestion' && (
                            <CheckCircle2 className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
                          )}
                          <div>
                            <p className={cn(
                              'font-medium',
                              issue.severity === 'error' ? 'text-red-700' :
                              issue.severity === 'warning' ? 'text-amber-700' : 'text-blue-700'
                            )}>
                              {issue.title}
                            </p>
                            {issue.location && (
                              <p className="text-xs opacity-70 mt-0.5">{issue.location}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {aiResult.issues.length === 0 && (
                    <div className="flex items-center gap-2 p-2 bg-emerald-50 rounded-lg text-sm text-emerald-700">
                      <CheckCircle2 className="w-4 h-4" />
                      未发现问题，文档质量良好
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Reviewer Selection */}
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-2">
              选择审核人
            </label>
            <div className="space-y-2">
              {reviewers.map(reviewer => (
                <label
                  key={reviewer.id}
                  className={cn(
                    'flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-colors',
                    selectedReviewerId === reviewer.id
                      ? 'border-zinc-900 bg-zinc-50'
                      : 'border-zinc-200 hover:border-zinc-300'
                  )}
                >
                  <input
                    type="radio"
                    name="reviewer"
                    value={reviewer.id}
                    checked={selectedReviewerId === reviewer.id}
                    onChange={e => setSelectedReviewerId(e.target.value)}
                    className="sr-only"
                  />
                  <div className="w-8 h-8 bg-zinc-900 rounded-full flex items-center justify-center">
                    <span className="text-xs font-medium text-white">
                      {reviewer.name.slice(0, 1)}
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-zinc-900">{reviewer.name}</p>
                    <p className="text-xs text-zinc-500">
                      {reviewer.role === 'manager' ? '经理' : '主管'} · {reviewer.department}
                    </p>
                  </div>
                  {selectedReviewerId === reviewer.id && (
                    <CheckCircle2 className="w-5 h-5 text-zinc-900" />
                  )}
                </label>
              ))}
            </div>
          </div>

          {/* Comment */}
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-2">
              提交说明 <span className="text-zinc-400 font-normal">(可选)</span>
            </label>
            <Textarea
              value={comment}
              onChange={e => setComment(e.target.value)}
              placeholder="简要说明本次提交的内容或需要审核人关注的要点..."
              className="resize-none"
              rows={3}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-zinc-200 bg-zinc-50">
          <Button variant="secondary" onClick={onClose}>
            取消
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isChecking || isSubmitting || !selectedReviewerId}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                提交中...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                提交审核
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
