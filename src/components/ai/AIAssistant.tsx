"use client";

import React from 'react';
import {
  PanelRightClose,
  Sparkles,
  Send,
  FileText,
  Copy,
  Check,
  History,
  PenTool,
  ShieldCheck,
  BookOpen,
  Gavel,
  MessageSquarePlus,
  ChevronLeft,
  RotateCcw,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChatSession, ChatMessage, Document } from '@/types';
import { cn, formatDateTime } from '@/lib/utils';

interface AIAssistantProps {
  isOpen: boolean;
  width: number;
  sessions: ChatSession[];
  currentSession: ChatSession | null;
  contextDocs: Document[];
  isLoading: boolean;
  projectName?: string;
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
  projectName,
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
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentSession?.messages]);

  const handleSend = () => {
    if (!inputValue.trim() || isLoading) return;
    onSendMessage(inputValue);
    setInputValue('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
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

  // 四个智能体入口
  const agentActions = [
    {
      icon: PenTool,
      label: '文档助手',
      description: '编写、润色、生成大纲',
      action: 'document',
      color: 'text-violet-500',
      bgColor: 'bg-violet-50',
    },
    {
      icon: ShieldCheck,
      label: '校验助手',
      description: '格式检查、内容审核',
      action: 'validate',
      color: 'text-emerald-500',
      bgColor: 'bg-emerald-50',
    },
    {
      icon: BookOpen,
      label: '资料助手',
      description: '查找资料、检索案例',
      action: 'research',
      color: 'text-blue-500',
      bgColor: 'bg-blue-50',
    },
    {
      icon: Gavel,
      label: '招投标助手',
      description: '投标文件、报价建议',
      action: 'bidding',
      color: 'text-amber-500',
      bgColor: 'bg-amber-50',
    },
  ];

  // 获取当前 session 标题
  const sessionTitle = currentSession?.title || '新对话';

  return (
    <div
      className="h-full bg-white flex flex-col border-l border-zinc-200"
      style={{ width }}
    >
      {/* Header - Kiro 风格的标签式设计 */}
      <div className="flex-shrink-0 flex items-center justify-between px-3 py-2 border-b border-zinc-100">
        <div className="flex items-center gap-2">
          {showHistory ? (
            <button
              className="flex items-center gap-1.5 text-zinc-600 hover:text-zinc-900"
              onClick={() => setShowHistory(false)}
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="text-sm font-medium">历史记录</span>
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 px-2.5 py-1 bg-zinc-100 rounded-md">
                <Sparkles className="w-3.5 h-3.5 text-zinc-600" />
                <span className="text-xs font-medium text-zinc-700 max-w-[120px] truncate">
                  {sessionTitle}
                </span>
              </div>
            </div>
          )}
        </div>
        <div className="flex items-center gap-1">
          {!showHistory && (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={onNewSession}
                title="新建对话"
              >
                <MessageSquarePlus className="w-4 h-4 text-zinc-400" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={() => setShowHistory(true)}
                title="历史记录"
              >
                <History className="w-4 h-4 text-zinc-400" />
              </Button>
            </>
          )}
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onToggle}>
            <PanelRightClose className="w-4 h-4 text-zinc-400" />
          </Button>
        </div>
      </div>

      {showHistory ? (
        // History view
        <ScrollArea className="flex-1">
          <div className="p-3 space-y-1">
            {sessions.length === 0 ? (
              <div className="text-center py-12">
                <History className="w-8 h-8 text-zinc-200 mx-auto mb-2" />
                <p className="text-sm text-zinc-400">暂无历史记录</p>
              </div>
            ) : (
              sessions.map((session) => (
                <button
                  key={session.id}
                  className={cn(
                    'w-full text-left px-3 py-2.5 rounded-lg hover:bg-zinc-50 transition-colors',
                    currentSession?.id === session.id && 'bg-zinc-50'
                  )}
                  onClick={() => {
                    onSessionSelect?.(session.id);
                    setShowHistory(false);
                  }}
                >
                  <p className="text-sm font-medium text-zinc-800 truncate">
                    {session.title}
                  </p>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    {formatDateTime(session.updatedAt)}
                  </p>
                </button>
              ))
            )}
          </div>
        </ScrollArea>
      ) : (
        <>
          {/* Context bar - 简化版 */}
          {(projectName || contextDocs.length > 0) && (
            <div className="px-3 py-1.5 border-b border-zinc-50 text-[11px] text-zinc-400">
              {projectName && <span>{projectName}</span>}
              {projectName && contextDocs.length > 0 && <span className="mx-1.5">·</span>}
              {contextDocs.length > 0 && (
                <span className="text-zinc-500">
                  <FileText className="w-3 h-3 inline mr-0.5" />
                  {contextDocs[0].title}
                </span>
              )}
            </div>
          )}

          {/* Messages area */}
          <ScrollArea className="flex-1">
            <div className="p-4 space-y-4">
              {(!currentSession || currentSession.messages.length === 0) && (
                <div className="pt-6 pb-4">
                  {/* Welcome */}
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-purple-600 rounded-full flex items-center justify-center">
                      <Sparkles className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-semibold text-zinc-800">AI 助手</span>
                  </div>
                  <p className="text-sm text-zinc-600 mb-5">
                    你好！描述你的需求，我会自动调用合适的智能体来协助你。
                  </p>

                  {/* Agent actions - 2x2 grid */}
                  <div className="grid grid-cols-2 gap-2">
                    {agentActions.map((agent) => (
                      <button
                        key={agent.action}
                        className={cn(
                          "flex flex-col items-start p-3 text-left rounded-lg border border-zinc-100 hover:border-zinc-200 transition-all",
                          "hover:shadow-sm"
                        )}
                        onClick={() => onSendMessage(`请${agent.label}帮我处理当前文档`)}
                      >
                        <div className={cn("w-7 h-7 rounded-lg flex items-center justify-center mb-2", agent.bgColor)}>
                          <agent.icon className={cn("w-4 h-4", agent.color)} />
                        </div>
                        <span className="text-sm font-medium text-zinc-800">{agent.label}</span>
                        <span className="text-[11px] text-zinc-400 mt-0.5">{agent.description}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Chat messages */}
              {currentSession?.messages.map((message, index) => (
                <MessageItem
                  key={message.id}
                  message={message}
                  isCopied={copiedMessageId === message.id}
                  onCopy={(content) => handleCopy(message.id, content)}
                  onApply={onApplyToDocument}
                  isLast={index === currentSession.messages.length - 1}
                />
              ))}

              {/* Loading indicator */}
              {isLoading && (
                <div className="flex items-start gap-2">
                  <div className="w-7 h-7 bg-gradient-to-br from-violet-500 to-purple-600 rounded-full flex items-center justify-center shrink-0">
                    <Sparkles className="w-3.5 h-3.5 text-white" />
                  </div>
                  <div className="pt-1">
                    <div className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-zinc-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-1.5 h-1.5 bg-zinc-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-1.5 h-1.5 bg-zinc-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {/* Input area - Kiro 风格 */}
          <div className="p-3 border-t border-zinc-100">
            <div className="relative">
              <textarea
                ref={textareaRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="输入问题或描述任务..."
                rows={1}
                className="w-full px-3 py-2.5 pr-10 text-sm bg-zinc-50 border-0 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-zinc-200 placeholder:text-zinc-400 min-h-[42px] max-h-[120px]"
                onInput={(e) => {
                  const target = e.target as HTMLTextAreaElement;
                  target.style.height = 'auto';
                  target.style.height = Math.min(target.scrollHeight, 120) + 'px';
                }}
              />
              <button
                className={cn(
                  "absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-md transition-all",
                  inputValue.trim()
                    ? "text-zinc-600 hover:bg-zinc-200"
                    : "text-zinc-300"
                )}
                onClick={handleSend}
                disabled={!inputValue.trim() || isLoading}
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// Markdown 渲染函数 - 完整版，支持表格、列表等
function renderMarkdown(text: string): string {
  const codeBlocks: string[] = [];
  let html = text;

  // 提取并保护代码块
  html = html.replace(/```(\w*)\n([\s\S]*?)```/g, (_, lang, code) => {
    const escapedCode = code
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .trim();
    const placeholder = `__CODE_BLOCK_${codeBlocks.length}__`;
    codeBlocks.push(
      `<pre class="my-2 p-3 bg-zinc-900 text-zinc-100 rounded-lg overflow-x-auto text-xs"><code class="font-mono whitespace-pre">${escapedCode}</code></pre>`
    );
    return placeholder;
  });

  // 提取行内代码
  const inlineCodes: string[] = [];
  html = html.replace(/`([^`]+)`/g, (_, code) => {
    const escapedCode = code
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
    const placeholder = `__INLINE_CODE_${inlineCodes.length}__`;
    inlineCodes.push(
      `<code class="px-1.5 py-0.5 bg-zinc-100 text-zinc-800 rounded text-xs font-mono">${escapedCode}</code>`
    );
    return placeholder;
  });

  // 提取表格并保护 - 更精确的匹配，只匹配连续的表格行
  const tables: string[] = [];
  html = html.replace(/(?:^\|.+\|$\n?)+/gm, (match) => {
    const rows = match.trim().split('\n').filter(row => row.trim());
    if (rows.length === 0) return match;

    // 验证这确实是表格（至少有表头和分隔行）
    const hasValidRows = rows.some(row => row.includes('|'));
    if (!hasValidRows) return match;

    let tableHtml = '<table class="my-3 w-full text-xs border-collapse">';
    let isHeader = true;

    rows.forEach((row, index) => {
      const cells = row.split('|').filter(cell => cell.trim() !== '');

      // 跳过分隔行（---）
      if (cells.every(cell => /^[\s-:]+$/.test(cell))) {
        isHeader = false;
        return;
      }

      const cellTag = isHeader && index === 0 ? 'th' : 'td';
      const cellClass = isHeader && index === 0
        ? 'border border-zinc-200 px-2.5 py-1.5 bg-zinc-50 font-medium text-zinc-700 text-left'
        : 'border border-zinc-200 px-2.5 py-1.5 text-zinc-600';

      const cellsHtml = cells.map(cell =>
        `<${cellTag} class="${cellClass}">${cell.trim()}</${cellTag}>`
      ).join('');

      tableHtml += `<tr>${cellsHtml}</tr>`;
    });

    tableHtml += '</table>';
    const placeholder = `__TABLE_${tables.length}__`;
    tables.push(tableHtml);
    return placeholder;
  });

  // 转义 HTML
  html = html.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  // 标题（从多到少处理，避免误匹配）- 使用更宽松的匹配
  html = html.replace(/^######\s+(.+)$/gm, '<h6 class="text-xs font-medium text-zinc-700 mt-2 mb-1">$1</h6>');
  html = html.replace(/^#####\s+(.+)$/gm, '<h5 class="text-xs font-medium text-zinc-700 mt-2 mb-1">$1</h5>');
  html = html.replace(/^####\s+(.+)$/gm, '<h4 class="text-xs font-semibold text-zinc-800 mt-2.5 mb-1">$1</h4>');
  html = html.replace(/^###\s+(.+)$/gm, '<h3 class="text-sm font-semibold text-zinc-800 mt-3 mb-1.5">$1</h3>');
  html = html.replace(/^##\s+(.+)$/gm, '<h2 class="text-sm font-semibold text-zinc-800 mt-4 mb-2">$1</h2>');
  html = html.replace(/^#\s+(.+)$/gm, '<h1 class="text-base font-semibold text-zinc-800 mt-4 mb-2">$1</h1>');

  // 粗体和斜体
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold text-zinc-800">$1</strong>');
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');

  // 引用块
  html = html.replace(/^&gt; (.+)$/gm, '<blockquote class="border-l-2 border-zinc-300 pl-3 my-2 text-zinc-600 italic text-xs">$1</blockquote>');

  // 水平线
  html = html.replace(/^---$/gm, '<hr class="border-t border-zinc-200 my-3" />');

  // 复选框列表
  html = html.replace(/^- \[ \] (.+)$/gm, '<li class="flex items-center gap-2 mb-1"><input type="checkbox" disabled class="rounded w-3 h-3" /> <span class="text-zinc-600">$1</span></li>');
  html = html.replace(/^- \[x\] (.+)$/gm, '<li class="flex items-center gap-2 mb-1"><input type="checkbox" checked disabled class="rounded w-3 h-3" /> <span class="text-zinc-600">$1</span></li>');

  // 无序列表
  html = html.replace(/^- (.+)$/gm, '<li class="ml-4 list-disc text-zinc-600">$1</li>');

  // 有序列表
  html = html.replace(/^\d+\. (.+)$/gm, '<li class="ml-4 list-decimal text-zinc-600">$1</li>');

  // 将连续的 li 包装成 ul/ol
  html = html.replace(/(<li class="ml-4 list-disc[^>]*>.*<\/li>\n?)+/g, (match) => {
    return `<ul class="my-2 space-y-0.5 text-sm">${match}</ul>`;
  });
  html = html.replace(/(<li class="ml-4 list-decimal[^>]*>.*<\/li>\n?)+/g, (match) => {
    return `<ol class="my-2 space-y-0.5 text-sm">${match}</ol>`;
  });
  html = html.replace(/(<li class="flex items-center[^>]*>.*<\/li>\n?)+/g, (match) => {
    return `<ul class="my-2 space-y-0.5 text-sm list-none">${match}</ul>`;
  });

  // 链接
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-violet-600 hover:underline">$1</a>');

  // 段落处理
  html = html.replace(/^(?!<[hupoltb]|<li|<blockquote|<hr|__CODE_BLOCK_|__INLINE_CODE_|__TABLE_)(.+)$/gm, '<p class="my-1.5 text-sm leading-relaxed text-zinc-700">$1</p>');

  // 恢复代码块
  codeBlocks.forEach((block, i) => {
    html = html.replace(`__CODE_BLOCK_${i}__`, block);
  });
  inlineCodes.forEach((code, i) => {
    html = html.replace(`__INLINE_CODE_${i}__`, code);
  });
  tables.forEach((table, i) => {
    html = html.replace(`__TABLE_${i}__`, table);
  });

  // 清理空段落和多余换行
  html = html.replace(/<p class="[^"]*"><\/p>/g, '');
  html = html.replace(/\n{2,}/g, '\n');

  return html;
}

interface MessageItemProps {
  message: ChatMessage;
  isCopied: boolean;
  onCopy: (content: string) => void;
  onApply?: (content: string) => void;
  isLast: boolean;
}

function MessageItem({ message, isCopied, onCopy, onApply, isLast }: MessageItemProps) {
  const isUser = message.role === 'user';
  const [showActions, setShowActions] = React.useState(false);

  if (isUser) {
    // 用户消息 - 简单的右对齐灰色背景块
    return (
      <div className="flex justify-end">
        <div className="max-w-[85%] bg-zinc-100 rounded-2xl rounded-br-md px-3.5 py-2.5">
          {message.attachedText && (
            <div className="mb-2 text-xs text-zinc-500 border-l-2 border-zinc-300 pl-2">
              {message.attachedText.slice(0, 100)}...
            </div>
          )}
          <p className="text-sm text-zinc-800 whitespace-pre-wrap">{message.content}</p>
        </div>
      </div>
    );
  }

  // AI 消息 - Kiro 风格 + Markdown 渲染
  return (
    <div
      className="group"
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {/* AI 头像和名称 */}
      <div className="flex items-center gap-2 mb-2">
        <div className="w-7 h-7 bg-gradient-to-br from-violet-500 to-purple-600 rounded-full flex items-center justify-center">
          <Sparkles className="w-3.5 h-3.5 text-white" />
        </div>
        <span className="text-sm font-medium text-zinc-700">AI 助手</span>
      </div>

      {/* AI 回复内容 - Markdown 渲染 */}
      <div className="pl-9">
        <div
          className="text-sm text-zinc-700 leading-relaxed ai-markdown-content"
          dangerouslySetInnerHTML={{ __html: renderMarkdown(message.content) }}
        />

        {/* 操作按钮 - 悬浮显示 */}
        <div className={cn(
          "flex items-center gap-1 mt-2 transition-opacity",
          showActions || isLast ? "opacity-100" : "opacity-0"
        )}>
          <button
            className="flex items-center gap-1 px-2 py-1 text-xs text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 rounded transition-colors"
            onClick={() => onCopy(message.content)}
          >
            {isCopied ? (
              <>
                <Check className="w-3 h-3" />
                已复制
              </>
            ) : (
              <>
                <Copy className="w-3 h-3" />
                复制
              </>
            )}
          </button>
          <button
            className="flex items-center gap-1 px-2 py-1 text-xs text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 rounded transition-colors"
            onClick={() => onApply?.(message.content)}
          >
            <FileText className="w-3 h-3" />
            应用到文档
          </button>
          <button
            className="flex items-center gap-1 px-2 py-1 text-xs text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 rounded transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            重新生成
          </button>
        </div>
      </div>
    </div>
  );
}
