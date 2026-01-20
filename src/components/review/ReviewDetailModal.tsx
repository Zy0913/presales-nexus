"use client";

import React from 'react';
import {
  X,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Clock,
  Bot,
  ChevronRight,
  Building2,
  User as UserIcon,
  Eye,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ReviewRecord, User } from '@/types';
import { cn } from '@/lib/utils';

interface ReviewDetailModalProps {
  isOpen: boolean;
  review: ReviewRecord | null;
  currentUser: User;
  onClose: () => void;
  onApprove: (comment: string) => void;
  onReject: (comment: string) => void;
  onTransfer: (targetUserId: string, comment: string) => void;
  onOpenDocument: (documentId: string) => void;
}

export function ReviewDetailModal({
  isOpen,
  review,
  currentUser,
  onClose,
  onApprove,
  onReject,
  onTransfer,
  onOpenDocument,
}: ReviewDetailModalProps) {
  const [comment, setComment] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  React.useEffect(() => {
    if (!isOpen) {
      setComment('');
      setIsSubmitting(false);
    }
  }, [isOpen]);

  const canReview = React.useMemo(() => {
    if (!review) return false;
    if (review.finalStatus !== 'pending') return false;

    if (currentUser.role === 'supervisor' && review.currentStage === 'supervisor_review') {
      return review.supervisor?.decision === 'pending';
    }

    if (currentUser.role === 'manager') {
      if (review.currentStage === 'manager_review') {
        return review.manager?.decision === 'pending';
      }
    }

    return false;
  }, [review, currentUser]);

  if (!isOpen || !review) return null;

  const handleApprove = async () => {
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    onApprove(comment);
    setIsSubmitting(false);
  };

  const handleReject = async () => {
    if (!comment.trim()) {
      alert('请填写驳回原因');
      return;
    }
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    onReject(comment);
    setIsSubmitting(false);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleString('zh-CN', {
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl shadow-lg flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-zinc-200 shrink-0">
          <div>
            <h2 className="text-base font-medium text-zinc-900">审核详情</h2>
            <p className="text-sm text-zinc-500">{review.documentTitle}</p>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-zinc-600 transition-colors p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {/* Document Info */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-sm text-zinc-500">
              <span className="flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5" />
                {review.projectName}
              </span>
              <span className="flex items-center gap-1">
                <UserIcon className="w-3.5 h-3.5" />
                {review.submitterName}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {formatDate(review.submittedAt)}
              </span>
            </div>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => onOpenDocument(review.documentId)}
            >
              <Eye className="w-3.5 h-3.5 mr-1.5" />
              预览
            </Button>
          </div>

          {/* Submit Comment */}
          {review.submitComment && (
            <div className="text-sm text-zinc-600 pl-3 border-l-2 border-zinc-200">
              "{review.submitComment}"
            </div>
          )}

          {/* AI Check Result */}
          {review.aiCheck && (
            <div className="border border-zinc-200 rounded-lg">
              <div className="flex items-center justify-between px-4 py-2.5 bg-zinc-50 border-b border-zinc-200">
                <div className="flex items-center gap-2 text-sm">
                  <Bot className="w-4 h-4 text-zinc-500" />
                  <span className="font-medium text-zinc-700">AI 智能预检</span>
                </div>
                <span className="text-sm font-medium text-zinc-700">
                  {review.aiCheck.score} 分
                </span>
              </div>

              <div className="p-4 space-y-3">
                <p className="text-sm text-zinc-600">{review.aiCheck.summary}</p>

                {review.aiCheck.issues.length > 0 ? (
                  <div className="space-y-2">
                    {review.aiCheck.issues.map(issue => (
                      <div
                        key={issue.id}
                        className="flex items-start gap-2 text-sm"
                      >
                        {issue.severity === 'error' && (
                          <XCircle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
                        )}
                        {issue.severity === 'warning' && (
                          <AlertCircle className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                        )}
                        {issue.severity === 'suggestion' && (
                          <AlertCircle className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-zinc-700">{issue.title}</p>
                          <p className="text-zinc-500">{issue.description}</p>
                          {issue.location && (
                            <p className="text-xs text-zinc-400 mt-0.5">位置: {issue.location}</p>
                          )}
                          {issue.suggestion && (
                            <p className="text-xs text-zinc-400">建议: {issue.suggestion}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-sm text-zinc-600">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    未发现问题，文档质量良好
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Review Flow */}
          <div className="border border-zinc-200 rounded-lg">
            <div className="px-4 py-2.5 bg-zinc-50 border-b border-zinc-200">
              <span className="text-sm font-medium text-zinc-700">审核流程</span>
            </div>
            <div className="p-4">
              <div className="flex items-center gap-2">
                <FlowStep
                  title="AI预检"
                  subtitle={review.aiCheck ? `${review.aiCheck.score}分` : ''}
                  status="completed"
                />
                <ChevronRight className="w-4 h-4 text-zinc-300 shrink-0" />
                <FlowStep
                  title="主管初审"
                  subtitle={review.supervisor?.name || ''}
                  status={
                    review.supervisor?.decision === 'approved' ? 'completed' :
                    review.supervisor?.decision === 'rejected' ? 'rejected' :
                    review.currentStage === 'supervisor_review' ? 'current' : 'pending'
                  }
                />
                <ChevronRight className="w-4 h-4 text-zinc-300 shrink-0" />
                <FlowStep
                  title="经理终审"
                  subtitle={review.manager?.name || '待定'}
                  status={
                    review.manager?.decision === 'approved' ? 'completed' :
                    review.manager?.decision === 'rejected' ? 'rejected' :
                    review.currentStage === 'manager_review' ? 'current' : 'pending'
                  }
                />
              </div>
            </div>
          </div>

          {/* Review Actions */}
          {canReview && (
            <div className="border border-zinc-200 rounded-lg">
              <div className="px-4 py-2.5 bg-zinc-50 border-b border-zinc-200">
                <span className="text-sm font-medium text-zinc-700">审核意见</span>
              </div>
              <div className="p-4 space-y-3">
                <Textarea
                  value={comment}
                  onChange={e => setComment(e.target.value)}
                  placeholder="请输入审核意见...（驳回时必填）"
                  className="resize-none text-sm"
                  rows={2}
                />
                <div className="flex items-center justify-end gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={handleReject}
                    disabled={isSubmitting}
                  >
                    <XCircle className="w-3.5 h-3.5 mr-1.5" />
                    驳回
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleApprove}
                    disabled={isSubmitting}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" />
                    {review.currentStage === 'manager_review' ? '通过发布' : '通过'}
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Completed Status */}
          {review.finalStatus === 'approved' && (
            <div className="flex items-center gap-2 p-3 bg-zinc-50 rounded-lg text-sm">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span className="text-zinc-700">
                审核已通过
                {review.completedAt && `，于 ${formatDate(review.completedAt)} 发布`}
              </span>
            </div>
          )}

          {review.finalStatus === 'rejected' && (
            <div className="p-3 bg-zinc-50 rounded-lg text-sm">
              <div className="flex items-center gap-2 mb-1">
                <XCircle className="w-4 h-4 text-red-500" />
                <span className="font-medium text-zinc-700">审核已驳回</span>
              </div>
              <p className="text-zinc-600 ml-6">
                {review.supervisor?.decision === 'rejected'
                  ? review.supervisor.comment
                  : review.manager?.comment}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end px-5 py-3 border-t border-zinc-200 shrink-0">
          <Button variant="secondary" size="sm" onClick={onClose}>
            关闭
          </Button>
        </div>
      </div>
    </div>
  );
}

// 流程步骤
interface FlowStepProps {
  title: string;
  subtitle: string;
  status: 'pending' | 'current' | 'completed' | 'rejected';
}

function FlowStep({ title, subtitle, status }: FlowStepProps) {
  return (
    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-1.5">
        {status === 'completed' && <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />}
        {status === 'rejected' && <XCircle className="w-4 h-4 text-red-500 shrink-0" />}
        {status === 'current' && <div className="w-4 h-4 rounded-full border-2 border-zinc-400 bg-zinc-100 shrink-0" />}
        {status === 'pending' && <div className="w-4 h-4 rounded-full border-2 border-zinc-300 bg-white shrink-0" />}
        <div className="min-w-0">
          <p className={cn(
            'text-xs font-medium truncate',
            status === 'completed' ? 'text-emerald-600' :
            status === 'rejected' ? 'text-red-600' :
            status === 'current' ? 'text-zinc-700' : 'text-zinc-400'
          )}>
            {title}
          </p>
          {subtitle && (
            <p className="text-[11px] text-zinc-500 truncate">{subtitle}</p>
          )}
        </div>
      </div>
    </div>
  );
}
