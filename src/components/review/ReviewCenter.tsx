"use client";

import React from 'react';
import {
  FileCheck,
  Send,
  History,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ChevronRight,
  Bot,
  User as UserIcon,
  Building2,
  Eye,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ReviewRecord, User } from '@/types';
import { cn } from '@/lib/utils';

type TabType = 'pending' | 'submitted' | 'history';

interface ReviewCenterProps {
  reviews: ReviewRecord[];
  currentUser: User;
  onOpenDetail: (review: ReviewRecord) => void;
  onOpenDocument: (documentId: string) => void;
}

export function ReviewCenter({
  reviews,
  currentUser,
  onOpenDetail,
  onOpenDocument,
}: ReviewCenterProps) {
  const [activeTab, setActiveTab] = React.useState<TabType>('pending');

  const pendingReviews = React.useMemo(() => {
    return reviews.filter(r => {
      if (r.finalStatus !== 'pending') return false;

      if (currentUser.role === 'supervisor' && r.currentStage === 'supervisor_review') {
        return r.supervisor?.decision === 'pending';
      }

      if (currentUser.role === 'manager') {
        if (r.currentStage === 'manager_review') {
          return r.manager?.decision === 'pending';
        }
        if (r.currentStage === 'supervisor_review') {
          return r.supervisor?.decision === 'pending';
        }
      }

      return false;
    });
  }, [reviews, currentUser]);

  const submittedReviews = React.useMemo(() => {
    return reviews.filter(r => r.submitterId === currentUser.id);
  }, [reviews, currentUser.id]);

  const historyReviews = React.useMemo(() => {
    return reviews.filter(r => r.finalStatus !== 'pending');
  }, [reviews]);

  const tabs = [
    {
      id: 'pending' as TabType,
      label: '待我审核',
      count: pendingReviews.length,
    },
    {
      id: 'submitted' as TabType,
      label: '我提交的',
      count: submittedReviews.filter(r => r.finalStatus === 'pending').length,
    },
    {
      id: 'history' as TabType,
      label: '历史记录',
      count: 0,
    },
  ];

  const currentReviews = React.useMemo(() => {
    switch (activeTab) {
      case 'pending':
        return pendingReviews;
      case 'submitted':
        return submittedReviews;
      case 'history':
        return historyReviews;
      default:
        return [];
    }
  }, [activeTab, pendingReviews, submittedReviews, historyReviews]);

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Tabs */}
      <div className="border-b border-zinc-200 px-4">
        <div className="flex items-center gap-1">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'flex items-center gap-1.5 px-3 py-2.5 text-sm font-medium border-b-2 transition-colors',
                activeTab === tab.id
                  ? 'border-zinc-900 text-zinc-900'
                  : 'border-transparent text-zinc-500 hover:text-zinc-700'
              )}
            >
              {tab.label}
              {tab.count > 0 && (
                <span className={cn(
                  'px-1.5 py-0.5 text-xs font-medium rounded',
                  activeTab === tab.id
                    ? 'bg-zinc-900 text-white'
                    : 'bg-zinc-100 text-zinc-600'
                )}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <ScrollArea className="flex-1">
        <div className="p-4">
          {currentReviews.length === 0 ? (
            <EmptyState type={activeTab} />
          ) : (
            <div className="space-y-3">
              {currentReviews.map(review => (
                <ReviewCard
                  key={review.id}
                  review={review}
                  showSubmitter={activeTab === 'pending'}
                  onOpenDetail={() => onOpenDetail(review)}
                  onOpenDocument={() => onOpenDocument(review.documentId)}
                />
              ))}
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}

interface ReviewCardProps {
  review: ReviewRecord;
  showSubmitter?: boolean;
  onOpenDetail: () => void;
  onOpenDocument: () => void;
}

function ReviewCard({
  review,
  showSubmitter = false,
  onOpenDetail,
  onOpenDocument,
}: ReviewCardProps) {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (hours < 1) return '刚刚';
    if (hours < 24) return `${hours}小时前`;
    if (days < 7) return `${days}天前`;
    return date.toLocaleDateString('zh-CN');
  };

  const getStatusBadge = () => {
    if (review.finalStatus === 'approved') {
      return (
        <Badge variant="success" className="text-xs">
          <CheckCircle2 className="w-3 h-3 mr-1" />
          已通过
        </Badge>
      );
    }
    if (review.finalStatus === 'rejected') {
      return (
        <Badge variant="error" className="text-xs">
          <XCircle className="w-3 h-3 mr-1" />
          已驳回
        </Badge>
      );
    }

    if (review.currentStage === 'supervisor_review') {
      return (
        <Badge variant="warning" className="text-xs">
          <Clock className="w-3 h-3 mr-1" />
          待主管审核
        </Badge>
      );
    }
    if (review.currentStage === 'manager_review') {
      return (
        <Badge variant="primary" className="text-xs">
          <Clock className="w-3 h-3 mr-1" />
          待经理终审
        </Badge>
      );
    }

    return (
      <Badge variant="default" className="text-xs">
        <Clock className="w-3 h-3 mr-1" />
        处理中
      </Badge>
    );
  };

  return (
    <div className="border border-zinc-200 rounded-lg p-4 hover:bg-zinc-50 transition-colors">
      {/* Header */}
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-sm font-medium text-zinc-900 truncate">
              {review.documentTitle}
            </h3>
            {getStatusBadge()}
          </div>
          <div className="flex items-center gap-3 text-xs text-zinc-500">
            <span className="flex items-center gap-1">
              <Building2 className="w-3 h-3" />
              {review.projectName}
            </span>
            {showSubmitter && (
              <span className="flex items-center gap-1">
                <UserIcon className="w-3 h-3" />
                {review.submitterName}
              </span>
            )}
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {formatDate(review.submittedAt)}
            </span>
          </div>
        </div>

        {/* AI Score */}
        {review.aiCheck && (
          <div className="flex items-center gap-1 text-xs text-zinc-600">
            <Bot className="w-3.5 h-3.5" />
            <span className="font-medium">{review.aiCheck.score}分</span>
          </div>
        )}
      </div>

      {/* Submit Comment */}
      {review.submitComment && (
        <p className="text-xs text-zinc-500 mb-2 pl-2 border-l-2 border-zinc-200">
          "{review.submitComment}"
        </p>
      )}

      {/* AI Issues Summary */}
      {review.aiCheck && review.aiCheck.issues.length > 0 && (
        <div className="flex items-center gap-2 mb-2">
          {review.aiCheck.issues.filter(i => i.severity === 'warning').length > 0 && (
            <span className="flex items-center gap-1 text-xs text-zinc-500">
              <AlertCircle className="w-3 h-3" />
              {review.aiCheck.issues.filter(i => i.severity === 'warning').length} 个警告
            </span>
          )}
          {review.aiCheck.issues.filter(i => i.severity === 'suggestion').length > 0 && (
            <span className="flex items-center gap-1 text-xs text-zinc-500">
              {review.aiCheck.issues.filter(i => i.severity === 'suggestion').length} 个建议
            </span>
          )}
        </div>
      )}

      {/* Review Progress */}
      {review.finalStatus === 'pending' && (
        <div className="flex items-center gap-1.5 mb-3 py-2 px-2 bg-zinc-50 rounded text-xs">
          <ReviewProgressStep
            label="AI预检"
            status="completed"
          />
          <ChevronRight className="w-3 h-3 text-zinc-300" />
          <ReviewProgressStep
            label="主管"
            status={
              review.supervisor?.decision === 'approved'
                ? 'completed'
                : review.supervisor?.decision === 'rejected'
                  ? 'rejected'
                  : review.currentStage === 'supervisor_review'
                    ? 'current'
                    : 'pending'
            }
          />
          <ChevronRight className="w-3 h-3 text-zinc-300" />
          <ReviewProgressStep
            label="经理"
            status={
              review.manager?.decision === 'approved'
                ? 'completed'
                : review.manager?.decision === 'rejected'
                  ? 'rejected'
                  : review.currentStage === 'manager_review'
                    ? 'current'
                    : 'pending'
            }
          />
        </div>
      )}

      {/* Rejection Reason */}
      {review.finalStatus === 'rejected' && review.supervisor?.decision === 'rejected' && (
        <div className="mb-3 p-2 bg-zinc-50 rounded text-xs">
          <span className="font-medium text-zinc-700">驳回原因: </span>
          <span className="text-zinc-600">{review.supervisor.comment}</span>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between pt-2 border-t border-zinc-100">
        <Button
          variant="ghost"
          size="sm"
          className="h-7 text-xs text-zinc-600"
          onClick={onOpenDocument}
        >
          <Eye className="w-3 h-3 mr-1" />
          查看文档
        </Button>
        <Button size="sm" className="h-7 text-xs" onClick={onOpenDetail}>
          {review.finalStatus === 'pending' ? '处理' : '详情'}
          <ChevronRight className="w-3 h-3 ml-0.5" />
        </Button>
      </div>
    </div>
  );
}

interface ReviewProgressStepProps {
  label: string;
  status: 'pending' | 'current' | 'completed' | 'rejected';
}

function ReviewProgressStep({ label, status }: ReviewProgressStepProps) {
  return (
    <div className="flex items-center gap-1">
      {status === 'completed' && (
        <CheckCircle2 className="w-3 h-3 text-emerald-500" />
      )}
      {status === 'rejected' && (
        <XCircle className="w-3 h-3 text-red-500" />
      )}
      {status === 'current' && (
        <div className="w-3 h-3 rounded-full border-2 border-zinc-400 bg-zinc-100" />
      )}
      {status === 'pending' && (
        <div className="w-3 h-3 rounded-full border border-zinc-300 bg-white" />
      )}
      <span className={cn(
        'text-xs',
        status === 'completed' ? 'text-emerald-600' :
        status === 'rejected' ? 'text-red-600' :
        status === 'current' ? 'text-zinc-700' : 'text-zinc-400'
      )}>
        {label}
      </span>
    </div>
  );
}

function EmptyState({ type }: { type: TabType }) {
  const config = {
    pending: {
      icon: <FileCheck className="w-10 h-10 text-zinc-300" />,
      title: '暂无待审核文档',
      description: '当有团队成员提交审核时会显示在这里',
    },
    submitted: {
      icon: <Send className="w-10 h-10 text-zinc-300" />,
      title: '暂无提交记录',
      description: '完成文档后点击"提交审核"发起审批',
    },
    history: {
      icon: <History className="w-10 h-10 text-zinc-300" />,
      title: '暂无审核历史',
      description: '已完成的审核记录会显示在这里',
    },
  };

  const { icon, title, description } = config[type];

  return (
    <div className="flex flex-col items-center justify-center py-12">
      {icon}
      <h3 className="mt-3 text-sm font-medium text-zinc-700">{title}</h3>
      <p className="mt-1 text-xs text-zinc-500">{description}</p>
    </div>
  );
}
