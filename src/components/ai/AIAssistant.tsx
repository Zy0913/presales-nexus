"use client";

import React from 'react';
import {
  PanelRightClose,
  PanelRight,
  Sparkles,
  Send,
  FileText,
  Plus,
  X,
  Copy,
  Check,
  History,
  Wand2,
  FileSearch,
  ClipboardCheck,
  Search,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { ChatSession, ChatMessage, Document } from '@/types';
import { cn, formatDateTime } from '@/lib/utils';

interface AIAssistantProps {
  isOpen: boolean;
  width: number;
  sessions: ChatSession[];
  currentSession: ChatSession | null;
  contextDocs: Document[];
  isLoading: boolean;
  onToggle: () => void;
  onSendMessage: (message: string) => void;
  onSessionSelect?: (sessionId: string) => void;
  onNewSession?: () => void;
  onApplyToDocument?: (content: string) => void;
  onRemoveContext?: (docId: string) => void;
}

export function AIAssistant({
  isOpen,
  width,
  sessions,
  currentSession,
  contextDocs,
  isLoading,
  onToggle,
  onSendMessage,
  onSessionSelect,
  onNewSession,
  onApplyToDocument,
  onRemoveContext,
}: AIAssistantProps) {
  const [inputValue, setInputValue] = React.useState('');
  const [copiedMessageId, setCopiedMessageId] = React.useState<string | null>(null);
  const [showHistory, setShowHistory] = React.useState(false);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentSession?.messages]);

  const handleSend = () => {
    if (!inputValue.trim() || isLoading) return;
    onSendMessage(inputValue);
    setInputValue('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleCopy = async (messageId: string, content: string) => {
    await navigator.clipboard.writeText(content);
    setCopiedMessageId(messageId);
    setTimeout(() => setCopiedMessageId(null), 2000);
  };

  // Collapsed state
  if (!isOpen) {
    return (
      <button
        className="fixed right-0 top-1/2 -translate-y-1/2 bg-zinc-900 text-white p-2 rounded-l-lg shadow-lg hover:bg-zinc-800 transition-colors z-50"
        onClick={onToggle}
      >
        <Sparkles className="w-5 h-5" />
      </button>
    );
  }

  const quickActions = [
    { icon: Wand2, label: '润色全文', action: 'polish' },
    { icon: FileSearch, label: '生成大纲', action: 'outline' },
    { icon: ClipboardCheck, label: '格式检查', action: 'format' },
    { icon: Search, label: '查找资料', action: 'search' },
  ];

  return (
    <div
      className="h-full bg-zinc-50 border-l border-zinc-200 flex flex-col"
      style={{ width }}
    >
      {/* Header */}
      <div className="h-12 flex-shrink-0 flex items-center justify-between px-3 border-b border-zinc-100">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-zinc-900 rounded-md flex items-center justify-center">
            <Sparkles className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="font-medium text-zinc-900 text-[13px]">AI 助手</span>
        </div>
        <div className="flex items-center gap-0.5">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={() => setShowHistory(!showHistory)}
          >
            <History className="w-4 h-4 text-zinc-500" />
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onToggle}>
            <PanelRightClose className="w-4 h-4 text-zinc-500" />
          </Button>
        </div>
      </div>

      {showHistory ? (
        // History view
        <div className="flex-1 flex flex-col">
          <div className="p-2.5 border-b border-zinc-100">
            <Button size="sm" onClick={onNewSession} className="w-full h-8 text-xs">
              <Plus className="w-3.5 h-3.5 mr-1.5" />
              新建对话
            </Button>
          </div>
          <ScrollArea className="flex-1">
            <div className="p-2">
              {sessions.map((session) => (
                <button
                  key={session.id}
                  className={cn(
                    'w-full text-left p-2.5 rounded-lg hover:bg-zinc-100 transition-colors mb-0.5',
                    currentSession?.id === session.id && 'bg-zinc-100 hover:bg-zinc-100'
                  )}
                  onClick={() => {
                    onSessionSelect?.(session.id);
                    setShowHistory(false);
                  }}
                >
                  <p className="text-[13px] font-medium text-zinc-900 truncate">
                    {session.title}
                  </p>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    {formatDateTime(session.updatedAt)}
                  </p>
                </button>
              ))}
            </div>
          </ScrollArea>
        </div>
      ) : (
        <>
          {/* Context docs */}
          {contextDocs.length > 0 && (
            <div className="p-2.5 border-b border-zinc-100">
              <p className="text-[11px] font-medium text-zinc-500 mb-1.5">已关联文档</p>
              <div className="flex flex-wrap gap-1">
                {contextDocs.map((doc) => (
                  <span
                    key={doc.id}
                    className="inline-flex items-center gap-1 px-2 py-1 bg-zinc-100 text-zinc-700 rounded text-xs"
                  >
                    <FileText className="w-3 h-3" />
                    <span className="max-w-[120px] truncate">{doc.title}</span>
                    <button
                      className="hover:bg-zinc-200 rounded p-0.5"
                      onClick={() => onRemoveContext?.(doc.id)}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Messages */}
          <ScrollArea className="flex-1">
            <div className="p-3 space-y-3">
              {(!currentSession || currentSession.messages.length === 0) && (
                <>
                  {/* Welcome message */}
                  <div className="text-center py-6">
                    <div className="w-10 h-10 bg-zinc-100 rounded-xl flex items-center justify-center mx-auto mb-2">
                      <Sparkles className="w-5 h-5 text-zinc-600" />
                    </div>
                    <h3 className="font-medium text-zinc-900 text-sm mb-1">AI 助手</h3>
                    <p className="text-xs text-zinc-500">
                      我可以帮助您编写、优化和检查文档
                    </p>
                  </div>

                  {/* Quick actions */}
                  <div className="grid grid-cols-2 gap-1.5">
                    {quickActions.map((action) => (
                      <button
                        key={action.action}
                        className="flex flex-col items-center gap-1.5 p-3 bg-white rounded-lg border border-zinc-200 hover:border-zinc-400 hover:shadow-sm transition-all"
                        onClick={() => onSendMessage(`请帮我${action.label}`)}
                      >
                        <action.icon className="w-4 h-4 text-zinc-600" />
                        <span className="text-xs text-zinc-700">{action.label}</span>
                      </button>
                    ))}
                  </div>
                </>
              )}

              {/* Chat messages */}
              {currentSession?.messages.map((message) => (
                <MessageBubble
                  key={message.id}
                  message={message}
                  isCopied={copiedMessageId === message.id}
                  onCopy={(content) => handleCopy(message.id, content)}
                  onApply={onApplyToDocument}
                />
              ))}

              {/* Loading indicator */}
              {isLoading && (
                <div className="flex items-start gap-2">
                  <div className="w-7 h-7 bg-zinc-100 rounded-lg flex items-center justify-center shrink-0">
                    <Sparkles className="w-3.5 h-3.5 text-zinc-600" />
                  </div>
                  <div className="bg-white border border-zinc-200 rounded-xl rounded-bl-md p-2.5 shadow-sm">
                    <div className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {/* Input */}
          <div className="p-2.5 border-t border-zinc-100">
            <div className="relative">
              <textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="输入消息..."
                rows={2}
                className="w-full px-3 py-2 pr-10 text-[13px] border border-zinc-200 rounded-lg resize-none focus:outline-none focus:ring-1 focus:ring-zinc-400 focus:border-zinc-400"
              />
              <Button
                size="icon"
                className="absolute right-1.5 bottom-1.5 h-7 w-7"
                onClick={handleSend}
                disabled={!inputValue.trim() || isLoading}
              >
                <Send className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

interface MessageBubbleProps {
  message: ChatMessage;
  isCopied: boolean;
  onCopy: (content: string) => void;
  onApply?: (content: string) => void;
}

function MessageBubble({ message, isCopied, onCopy, onApply }: MessageBubbleProps) {
  const isUser = message.role === 'user';

  return (
    <div className={cn('flex items-start gap-2', isUser && 'flex-row-reverse')}>
      <div
        className={cn(
          'w-7 h-7 rounded-lg flex items-center justify-center shrink-0',
          isUser ? 'bg-zinc-200' : 'bg-zinc-100'
        )}
      >
        {isUser ? (
          <span className="text-[10px] font-medium text-zinc-600">我</span>
        ) : (
          <Sparkles className="w-3.5 h-3.5 text-zinc-600" />
        )}
      </div>

      <div className="flex-1 max-w-[85%]">
        <div
          className={cn(
            'rounded-xl p-2.5 text-[13px]',
            isUser
              ? 'bg-zinc-900 text-white rounded-br-md'
              : 'bg-white border border-zinc-200 rounded-bl-md shadow-sm'
          )}
        >
          {message.attachedText && (
            <div className="mb-2 p-2 bg-zinc-800 rounded text-xs">
              <p className="text-zinc-400 mb-0.5">选中文本:</p>
              <p className="line-clamp-2 text-zinc-200">{message.attachedText}</p>
            </div>
          )}
          <div className="whitespace-pre-wrap leading-relaxed">{message.content}</div>
        </div>

        {/* Actions for AI messages */}
        {!isUser && (
          <div className="flex items-center gap-1 mt-1.5">
            <Button
              variant="ghost"
              size="sm"
              className="h-6 text-[11px] text-zinc-500"
              onClick={() => onCopy(message.content)}
            >
              {isCopied ? (
                <>
                  <Check className="w-3 h-3 mr-1" />
                  已复制
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3 mr-1" />
                  复制
                </>
              )}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 text-[11px] text-zinc-500"
              onClick={() => onApply?.(message.content)}
            >
              <FileText className="w-3 h-3 mr-1" />
              应用
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
