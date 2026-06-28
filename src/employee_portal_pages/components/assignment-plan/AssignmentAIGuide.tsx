import { useState, useRef, useEffect, useCallback } from "react";
import { Spin, Input, Alert } from "antd";
import {
  RobotOutlined,
  BulbOutlined,
  SendOutlined,
  CloseOutlined,
  CheckCircleOutlined,
  WarningOutlined,
  QuestionCircleOutlined,
  ReloadOutlined,
  NodeIndexOutlined,
} from "@ant-design/icons";
import {
  useGetAIGuidanceQuery,
  useAskAIQuestionMutation,
} from "@/redux/features/employee-portal-api/application/assignment";

interface Props {
  assignmentId: string;
  applicationCode?: string;
  hideHeader?: boolean;
}

interface ChatMessage {
  role: "user" | "assistant";
  text: string;
}

type Segment =
  | { type: "text"; content: string }
  | { type: "numbered"; items: string[] }
  | { type: "bullets"; items: string[] }
  | { type: "heading"; content: string }
  | { type: "divider" };

function parseResponse(text: string): Segment[] {
  const lines = text.split("\n");
  const segments: Segment[] = [];
  let i = 0;

  while (i < lines.length) {
    const raw = lines[i];
    const line = raw.trim();

    if (!line) { i++; continue; }

    if (line === "---" || line === "***") {
      segments.push({ type: "divider" });
      i++;
      continue;
    }

    if (line.startsWith("## ") || (line.startsWith("**") && line.endsWith("**") && line.length > 4)) {
      segments.push({ type: "heading", content: line.replace(/^#+\s*/, "").replace(/\*\*/g, "") });
      i++;
      continue;
    }

    if (/^\d+[\.\)]\s/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\d+[\.\)]\s/.test(lines[i].trim())) {
        items.push(lines[i].trim().replace(/^\d+[\.\)]\s+/, "").replace(/\*\*/g, ""));
        i++;
      }
      segments.push({ type: "numbered", items });
      continue;
    }

    if (/^[-*•]\s/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^[-*•]\s/.test(lines[i].trim())) {
        items.push(lines[i].trim().replace(/^[-*•]\s+/, "").replace(/\*\*/g, ""));
        i++;
      }
      segments.push({ type: "bullets", items });
      continue;
    }

    const clean = line.replace(/\*\*/g, "");
    const last = segments[segments.length - 1];
    if (last && last.type === "text") {
      last.content += " " + clean;
    } else {
      segments.push({ type: "text", content: clean });
    }
    i++;
  }

  return segments;
}

const MindMapResponse: React.FC<{ text: string }> = ({ text }) => {
  const segments = parseResponse(text);

  return (
    <div className="space-y-2.5 text-[11px]">
      {segments.map((seg, idx) => {
        if (seg.type === "divider") {
          return <div key={idx} className="border-t border-dashed border-gray-200 my-1" />;
        }

        if (seg.type === "heading") {
          return (
            <div key={idx} className="flex items-center gap-1.5 pt-1">
              <NodeIndexOutlined className="text-[#0D4A2A] text-[10px] flex-shrink-0" />
              <span className="text-[10px] font-bold text-[#0D4A2A] uppercase tracking-widest leading-tight">
                {seg.content}
              </span>
            </div>
          );
        }

        if (seg.type === "text") {
          return (
            <p key={idx} className="text-gray-700 leading-relaxed pl-1">
              {seg.content}
            </p>
          );
        }

        if (seg.type === "numbered") {
          return (
            <div key={idx} className="relative pl-1">
              <div className="absolute left-3.5 top-5 bottom-2 w-px bg-[#0D4A2A]/15" />
              <ol className="space-y-2">
                {seg.items.map((item, ii) => (
                  <li key={ii} className="flex items-start gap-2.5 relative">
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-[#0D4A2A] text-white text-[9px] font-bold flex items-center justify-center z-10 shadow-sm">
                      {ii + 1}
                    </span>
                    <div className="flex-1 bg-white border border-[#0D4A2A]/15 rounded-lg px-2.5 py-1.5 shadow-xs">
                      <span className="text-gray-700 leading-snug">{item}</span>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          );
        }

        if (seg.type === "bullets") {
          return (
            <div key={idx} className="pl-2 border-l-2 border-[#0D4A2A]/20 space-y-1.5 ml-1">
              {seg.items.map((item, ii) => (
                <div key={ii} className="flex items-start gap-2">
                  <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-[#0D4A2A]/50 mt-1.5" />
                  <span className="text-gray-600 leading-snug">{item}</span>
                </div>
              ))}
            </div>
          );
        }

        return null;
      })}
    </div>
  );
};

const AssignmentAIGuide: React.FC<Props> = ({ assignmentId, applicationCode, hideHeader = false }) => {
  const [question, setQuestion] = useState("");
  const [chat, setChat] = useState<ChatMessage[]>([]);
  const [isExpanded, setIsExpanded] = useState(true);

  const chatBottomRef = useRef<HTMLDivElement>(null);
  const chatScrollRef = useRef<HTMLDivElement>(null);

  const {
    data: guidanceData,
    isLoading: guidanceLoading,
    isFetching,
    refetch,
  } = useGetAIGuidanceQuery({ assignmentId }, { skip: !assignmentId });

  const [askQuestion, { isLoading: asking }] = useAskAIQuestionMutation();

  const guidance = guidanceData?.data;

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  const handleAsk = useCallback(async (text?: string) => {
    const q = (text ?? question).trim();
    if (!q || asking) return;
    setQuestion("");
    setChat((prev) => [...prev, { role: "user", text: q }]);
    try {
      const res = await askQuestion({ assignmentId, question: q }).unwrap();
      const answer = res.data.answer;
      setChat((prev) => [...prev, { role: "assistant" as const, text: answer }]);
    } catch {
      setChat((prev) => [
        ...prev,
        { role: "assistant", text: "I was unable to get an answer at this time. Please try again." },
      ]);
    }
  }, [question, asking, askQuestion, assignmentId]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleAsk();
    }
  };

  if (hideHeader) {
    return (
      <div className="h-full flex flex-col bg-gray-50">
        {/* Refresh row */}
        <div className="flex-shrink-0 px-4 py-2 flex justify-end border-b border-gray-100 bg-white">
          <button
            onClick={() => refetch()}
            className="flex items-center gap-1 text-[#0D4A2A] hover:text-[#0a3a21] text-[11px] font-medium"
          >
            <ReloadOutlined className={`text-[11px] ${isFetching ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>

        {/* Scrollable area: guidance + chat history */}
        <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar">
          {/* Proactive Guidance */}
          <div className="px-4 pt-4 pb-3">
            {guidanceLoading ? (
              <div className="flex items-center gap-3 py-6 justify-center">
                <Spin size="small" />
                <span className="text-gray-500 text-sm">Analysing application…</span>
              </div>
            ) : guidance ? (
              <div className="space-y-3">
                {/* Headline */}
                <div className="flex items-start gap-2 bg-[#0D4A2A]/5 border border-[#0D4A2A]/15 rounded-xl px-3 py-2.5">
                  <BulbOutlined className="text-[#0D4A2A] mt-0.5 flex-shrink-0" />
                  <p className="text-xs font-semibold text-[#0D4A2A] leading-snug">
                    {guidance.headline}
                  </p>
                </div>

                {/* What is happening */}
                <p className="text-[11px] text-gray-600 leading-relaxed px-1">
                  {guidance.whatIsHappening}
                </p>

                {/* Blockers */}
                {guidance.blockerNotes && (
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex gap-2">
                    <WarningOutlined className="text-amber-500 flex-shrink-0 mt-0.5 text-xs" />
                    <p className="text-[11px] text-amber-800 leading-relaxed">
                      {guidance.blockerNotes}
                    </p>
                  </div>
                )}

                {/* Next Actions — mind-map style */}
                {guidance.nextActions?.length > 0 && (
                  <div>
                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-2 px-1">
                      Recommended Next Steps
                    </p>
                    <div className="relative pl-1">
                      <div className="absolute left-3.5 top-5 bottom-2 w-px bg-[#0D4A2A]/15" />
                      <ol className="space-y-2">
                        {guidance.nextActions.map((action: string, i: number) => (
                          <li key={i} className="flex items-start gap-2.5 relative">
                            <span className="flex-shrink-0 w-5 h-5 rounded-full bg-[#0D4A2A] text-white text-[9px] font-bold flex items-center justify-center z-10 shadow-sm">
                              {i + 1}
                            </span>
                            <div className="flex-1 bg-white border border-[#0D4A2A]/15 rounded-xl px-2.5 py-2 shadow-sm">
                              <span className="text-[11px] text-gray-700 leading-snug">{action}</span>
                            </div>
                          </li>
                        ))}
                      </ol>
                    </div>
                  </div>
                )}

                {/* Tip */}
                {guidance.tip && (
                  <div className="bg-white border border-gray-200 rounded-xl px-3 py-2 flex gap-2 shadow-sm">
                    <CheckCircleOutlined className="text-[#0D4A2A] flex-shrink-0 mt-0.5 text-xs" />
                    <p className="text-[11px] text-gray-600 leading-relaxed italic">
                      {guidance.tip}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <Alert
                type="warning"
                showIcon
                message="Could not load guidance"
                description="Please refresh to try again."
                className="text-xs"
              />
            )}
          </div>

          {/* Chat history */}
          {chat.length > 0 && (
            <div ref={chatScrollRef} className="px-4 pb-3 space-y-3 border-t border-gray-100 pt-3">
              <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1">
                <QuestionCircleOutlined className="text-[9px]" />
                Conversation
              </p>
              {chat.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  {msg.role === "assistant" && (
                    <div className="w-5 h-5 rounded-full bg-[#0D4A2A]/10 flex items-center justify-center flex-shrink-0 mr-2 mt-1">
                      <RobotOutlined className="text-[#0D4A2A] text-[10px]" />
                    </div>
                  )}
                  <div className={`max-w-[88%] ${msg.role === "user" ? "" : "flex-1"}`}>
                    {msg.role === "user" ? (
                      <div className="bg-[#0D4A2A] text-white rounded-2xl rounded-br-sm px-3 py-2 text-[11px] leading-relaxed">
                        {msg.text}
                      </div>
                    ) : (
                      <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-sm px-3 py-2.5 shadow-sm">
                        <MindMapResponse text={msg.text} />
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {asking && (
                <div className="flex justify-start">
                  <div className="w-5 h-5 rounded-full bg-[#0D4A2A]/10 flex items-center justify-center flex-shrink-0 mr-2 mt-1">
                    <RobotOutlined className="text-[#0D4A2A] text-[10px]" />
                  </div>
                  <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-sm px-3 py-2.5 shadow-sm flex items-center gap-2">
                    <Spin size="small" />
                    <span className="text-[11px] text-gray-400">Thinking…</span>
                  </div>
                </div>
              )}
              <div ref={chatBottomRef} />
            </div>
          )}
        </div>

        {/* Pinned input — always visible */}
        <div className="flex-shrink-0 px-4 py-3 bg-white border-t border-gray-200">
          <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-1">
            <QuestionCircleOutlined className="text-[9px]" />
            Ask ARIA
          </p>
          <div className="flex gap-1.5">
            <Input
              size="small"
              placeholder="e.g. How do I generate an invoice?"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={asking || guidanceLoading}
              className="text-xs rounded-lg"
            />
            <button
              onClick={() => handleAsk()}
              disabled={!question.trim() || asking}
              className="flex-shrink-0 w-7 h-7 rounded-lg bg-[#0D4A2A] hover:bg-[#0a3a21] disabled:bg-gray-200 flex items-center justify-center transition-colors"
            >
              <SendOutlined className="text-white text-[11px]" />
            </button>
          </div>
          <p className="text-[10px] text-gray-400 mt-1.5 leading-tight">
            Ask anything about this application's current stage or next steps.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm">
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-3 bg-[#0D4A2A] cursor-pointer select-none"
        onClick={() => setIsExpanded((p) => !p)}
      >
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-white/15 flex items-center justify-center">
            <RobotOutlined className="text-white text-sm" />
          </div>
          <div>
            <p className="text-white text-sm font-semibold leading-tight">ARIA</p>
            <p className="text-green-300/70 text-[9px] leading-tight font-normal">Application Review &amp; Insight Assistant</p>
            {applicationCode && (
              <p className="text-green-300 text-[10px] leading-tight">{applicationCode}</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => { e.stopPropagation(); refetch(); }}
            className="text-white/60 hover:text-white transition-colors"
            title="Refresh guidance"
          >
            <ReloadOutlined className={`text-xs ${isFetching ? "animate-spin" : ""}`} />
          </button>
          <CloseOutlined
            className={`text-white/60 text-xs transition-transform duration-200 ${isExpanded ? "rotate-0" : "rotate-45"}`}
          />
        </div>
      </div>

      {isExpanded && (
        <div className="flex flex-col">
          {/* Guidance */}
          <div className="px-4 pt-4 pb-3 border-b border-gray-100">
            {guidanceLoading ? (
              <div className="flex items-center gap-3 py-4 justify-center">
                <Spin size="small" />
                <span className="text-gray-500 text-sm">Analysing application status…</span>
              </div>
            ) : guidance ? (
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <BulbOutlined className="text-[#0D4A2A] mt-0.5 flex-shrink-0" />
                  <p className="text-sm font-semibold text-gray-900 leading-snug">{guidance.headline}</p>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed pl-5">{guidance.whatIsHappening}</p>
                {guidance.blockerNotes && (
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex gap-2">
                    <WarningOutlined className="text-amber-600 flex-shrink-0 mt-0.5 text-xs" />
                    <p className="text-xs text-amber-800 leading-relaxed">{guidance.blockerNotes}</p>
                  </div>
                )}
                {guidance.nextActions?.length > 0 && (
                  <div>
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 pl-1">Recommended Next Steps</p>
                    <ol className="space-y-1.5">
                      {guidance.nextActions.map((action: string, i: number) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="flex-shrink-0 w-4 h-4 rounded-full bg-[#0D4A2A]/10 text-[#0D4A2A] text-[10px] font-bold flex items-center justify-center mt-0.5">{i + 1}</span>
                          <span className="text-xs text-gray-700 leading-relaxed">{action}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                )}
                {guidance.tip && (
                  <div className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 flex gap-2">
                    <CheckCircleOutlined className="text-[#0D4A2A] flex-shrink-0 mt-0.5 text-xs" />
                    <p className="text-[11px] text-gray-600 leading-relaxed italic">{guidance.tip}</p>
                  </div>
                )}
              </div>
            ) : (
              <Alert type="warning" showIcon message="Could not load guidance" description="Please refresh to try again." className="text-xs" />
            )}
          </div>

          {/* Chat */}
          <div className="px-4 pt-3 pb-2">
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 flex items-center gap-1">
              <QuestionCircleOutlined className="text-[10px]" />
              Ask a Question
            </p>
            {chat.length > 0 && (
              <div className="max-h-52 overflow-y-auto space-y-2 mb-3 pr-1">
                {chat.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                    {msg.role === "assistant" && (
                      <div className="w-5 h-5 rounded-full bg-[#0D4A2A]/10 flex items-center justify-center flex-shrink-0 mr-2 mt-0.5">
                        <RobotOutlined className="text-[#0D4A2A] text-[10px]" />
                      </div>
                    )}
                    <div className="max-w-[85%]">
                      {msg.role === "user" ? (
                        <div className="bg-[#0D4A2A] text-white rounded-xl rounded-br-sm px-3 py-2 text-xs leading-relaxed">{msg.text}</div>
                      ) : (
                        <div className="bg-gray-50 border border-gray-100 rounded-xl rounded-bl-sm px-3 py-2">
                          <MindMapResponse text={msg.text} />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {asking && (
                  <div className="flex justify-start">
                    <div className="w-5 h-5 rounded-full bg-[#0D4A2A]/10 flex items-center justify-center flex-shrink-0 mr-2 mt-0.5">
                      <RobotOutlined className="text-[#0D4A2A] text-[10px]" />
                    </div>
                    <div className="bg-gray-100 rounded-xl rounded-bl-sm px-3 py-2">
                      <Spin size="small" />
                    </div>
                  </div>
                )}
                <div ref={chatBottomRef} />
              </div>
            )}
            <div className="flex gap-1.5">
              <Input
                size="small"
                placeholder="e.g. How do I generate an invoice?"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={asking || guidanceLoading}
                className="text-xs"
              />
              <button
                onClick={() => handleAsk()}
                disabled={!question.trim() || asking}
                className="flex-shrink-0 w-7 h-7 rounded-lg bg-[#0D4A2A] hover:bg-[#0a3a21] disabled:bg-gray-300 flex items-center justify-center transition-colors"
              >
                <SendOutlined className="text-white text-[11px]" />
              </button>
            </div>
            <p className="text-[10px] text-gray-400 mt-1.5 leading-tight">
              Ask anything about this application's current stage or next steps.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssignmentAIGuide;
