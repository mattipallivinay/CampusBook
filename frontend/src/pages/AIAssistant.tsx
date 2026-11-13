import axios from "axios";
import { useEffect, useRef, useState } from "react";
import {
  Bot,
  Send,
  FileText,
  Sparkles,
  Plus,
  MessageSquare,
  Trash2,
  Loader2,
} from "lucide-react";

import {
  uploadDocument,
  getDocuments,
  createConversation,
  getConversations,
  getConversationById,
  sendConversationMessage,
  deleteConversation,
} from "../services/ai/aiService";

interface DocumentItem {
  document_id: string;
  filename: string;
}

interface Message {
  id: string;
  role: "USER" | "ASSISTANT";
  content: string;
  sources?: { page_number: number }[];
}

interface Conversation {
  id: string;
  title: string | null;
  documentId: string | null;
  updatedAt: string;
  messages: Message[];
}

const AIAssistant = () => {
  const [question, setQuestion] = useState("");
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [selectedDocumentId, setSelectedDocumentId] = useState("");

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState("");

  const [messages, setMessages] = useState<Message[]>([]);

  const [uploading, setUploading] = useState(false);
  const [asking, setAsking] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(true);

  const [error, setError] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load documents and saved conversations
  useEffect(() => {
    const initialize = async () => {
      try {
        const [documentsResponse, conversationsResponse] =
          await Promise.all([
            getDocuments(),
            getConversations(),
          ]);

        setDocuments(documentsResponse.documents || []);

        const savedConversations =
          conversationsResponse.conversations || [];

        setConversations(savedConversations);
      } catch (err) {
        console.error("Failed to initialize AI assistant:", err);
        setError("Unable to load chat history. Please log in again if your session expired.");
      } finally {
        setLoadingHistory(false);
      }
    };

    initialize();
  }, []);

  // Keep the latest message visible
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, asking]);

  // Upload PDF
  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (file.type !== "application/pdf") {
      setError("Please select a PDF file.");
      return;
    }

    setUploading(true);
    setError("");

    try {
      const response = await uploadDocument(file);

      const documentsResponse = await getDocuments();

      setDocuments(documentsResponse.documents || []);
      setSelectedDocumentId(response.document_id);

      // Start a fresh chat for the newly uploaded document
      setActiveConversationId("");
      setMessages([]);
    } catch (err) {
      console.error("PDF upload failed:", err);
      setError("Unable to upload PDF. Please try again.");
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  };

  // Start a new chat
  const handleNewChat = () => {
    setActiveConversationId("");
    setMessages([]);
    setQuestion("");
    setError("");
  };

  // Open an existing conversation
  const handleOpenConversation = async (conversationId: string) => {
    setError("");

    try {
      const response = await getConversationById(conversationId);
      const conversation = response.conversation;

      setActiveConversationId(conversation.id);
      setSelectedDocumentId(conversation.documentId || "");
      setMessages(conversation.messages || []);
    } catch (err) {
      console.error("Failed to open conversation:", err);
      setError("Unable to open this conversation.");
    }
  };

  // Delete a conversation
  const handleDeleteConversation = async (
    conversationId: string
  ) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this conversation?"
    );

    if (!confirmed) return;

    try {
      await deleteConversation(conversationId);

      setConversations((previous) =>
        previous.filter((chat) => chat.id !== conversationId)
      );

      if (activeConversationId === conversationId) {
        handleNewChat();
      }
    } catch (err) {
      console.error("Delete conversation failed:", err);
      setError("Unable to delete conversation.");
    }
  };

  // Send a message
  const handleAskQuestion = async () => {
    const currentQuestion = question.trim();

    if (!currentQuestion || asking) return;

    if (!selectedDocumentId) {
      setError("Please select a study document first.");
      return;
    }

    setAsking(true);
    setError("");
    setQuestion("");

    const temporaryMessage: Message = {
      id: `temp-${Date.now()}`,
      role: "USER",
      content: currentQuestion,
    };

    setMessages((previous) => [
      ...previous,
      temporaryMessage,
    ]);

    try {
      let conversationId = activeConversationId;

      // Create a conversation when starting a new chat
      if (!conversationId) {
        const createResponse = await createConversation(
          selectedDocumentId,
          "New Chat"
        );

        conversationId = createResponse.conversation.id;

        setActiveConversationId(conversationId);
      }

      const response = await sendConversationMessage(
        conversationId,
        currentQuestion
      );

      const savedMessages: Message[] = response.messages || [];

      const userMessage = savedMessages.find(
        (message) => message.role === "USER"
      );

      const assistantMessage = savedMessages.find(
        (message) => message.role === "ASSISTANT"
      );

      setMessages((previous) => {
        const withoutTemporary = previous.filter(
          (message) => message.id !== temporaryMessage.id
        );

        const updated = userMessage
          ? [...withoutTemporary, userMessage]
          : withoutTemporary;

        return assistantMessage
          ? [
              ...updated,
              {
                ...assistantMessage,
                sources: response.sources || [],
              },
            ]
          : updated;
      });

      // Refresh sidebar with updated title and timestamp
      const historyResponse = await getConversations();

      setConversations(historyResponse.conversations || []);
    } catch (err: unknown) {
        console.error("AI question failed:", err);
  
        const errorData = axios.isAxiosError<{
          userMessage?: Message;
          message?: string;
        }>(err)
          ? err.response?.data
          : undefined;
  
        // Keep the saved user question if the AI service failed
        const savedUserMessage = errorData?.userMessage;
  
        if (savedUserMessage) {
          setMessages((previous) => [
            ...previous.filter(
              (message) => message.id !== temporaryMessage.id
            ),
            savedUserMessage,
          ]);
        } else {
          setMessages((previous) =>
            previous.filter(
              (message) => message.id !== temporaryMessage.id
            )
          );
          setQuestion(currentQuestion);
        }
  
        setError(
          errorData?.message ||
            "Unable to get an answer. Please try again."
        );
      } finally {
        setAsking(false);
      }
  };

  return (
    <div className="flex h-[calc(100vh-120px)] min-h-[600px] overflow-hidden rounded-2xl border border-white/10 bg-[#0B1220]">

      {/* Conversation Sidebar */}
      <aside className="flex w-64 shrink-0 flex-col border-r border-white/10 bg-[#111827]">

        <div className="border-b border-white/10 p-4">
          <h2 className="mb-4 flex items-center gap-2 font-bold text-white">
            <Bot className="h-5 w-5 text-blue-400" />
            CampusBook AI
          </h2>

          <button
            onClick={handleNewChat}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-blue-500"
          >
            <Plus className="h-4 w-4" />
            New Chat
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-3">
          <p className="mb-3 px-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
            Recent Conversations
          </p>

          {loadingHistory ? (
            <div className="flex justify-center py-6">
              <Loader2 className="h-5 w-5 animate-spin text-blue-400" />
            </div>
          ) : conversations.length === 0 ? (
            <p className="px-2 py-4 text-sm text-gray-500">
              No conversations yet.
            </p>
          ) : (
            <div className="space-y-1">
              {conversations.map((conversation) => (
                <div
                  key={conversation.id}
                  className={`group flex items-center gap-2 rounded-lg px-3 py-3 transition ${
                    activeConversationId === conversation.id
                      ? "bg-blue-500/15 text-blue-400"
                      : "text-gray-400 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <button
                    onClick={() =>
                      handleOpenConversation(conversation.id)
                    }
                    className="flex min-w-0 flex-1 items-center gap-2 text-left"
                  >
                    <MessageSquare className="h-4 w-4 shrink-0" />

                    <span className="truncate text-sm">
                      {conversation.title || "New Chat"}
                    </span>
                  </button>

                  <button
                    onClick={() =>
                      handleDeleteConversation(conversation.id)
                    }
                    title="Delete conversation"
                    className="rounded p-1 opacity-0 transition hover:bg-red-500/20 hover:text-red-400 group-hover:opacity-100"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="border-t border-white/10 p-3 text-xs text-gray-500">
          CampusBook AI Study Assistant
        </div>
      </aside>

      {/* Main Chat Area */}
      <main className="flex min-w-0 flex-1 flex-col">

        {/* Header */}
        <header className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 px-5 py-4">
          <div>
            <h1 className="font-semibold text-white">
              AI Study Assistant
            </h1>
            <p className="text-xs text-gray-400">
              Powered by Gemini and RAG
            </p>
          </div>

          <Sparkles className="h-5 w-5 text-purple-400" />
        </header>

        {/* Document Selection */}
        <div className="flex flex-wrap items-center gap-3 border-b border-white/10 px-5 py-3">

          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,application/pdf"
            onChange={handleFileUpload}
            className="hidden"
          />

          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-500 disabled:opacity-50"
          >
            {uploading ? "Uploading..." : "Upload PDF"}
          </button>

          <select
            value={selectedDocumentId}
            onChange={(event) => {
              setSelectedDocumentId(event.target.value);
              setActiveConversationId("");
              setMessages([]);
            }}
            className="max-w-full rounded-lg border border-white/10 bg-[#111827] px-3 py-2 text-sm text-white outline-none"
          >
            <option value="">Select study document</option>

            {documents.map((document) => (
              <option
                key={document.document_id}
                value={document.document_id}
              >
                {document.filename}
              </option>
            ))}
          </select>
        </div>

        {/* Messages */}
        <div className="flex-1 space-y-6 overflow-y-auto p-5">

          {messages.length === 0 && !asking && (
            <div className="flex h-full min-h-64 flex-col items-center justify-center text-center">
              <div className="mb-4 rounded-2xl bg-blue-500/10 p-5">
                <FileText className="h-10 w-10 text-blue-400" />
              </div>

              <h2 className="text-xl font-semibold text-white">
                Your AI study assistant is ready
              </h2>

              <p className="mt-2 max-w-md text-sm text-gray-400">
                Upload or select a study PDF and ask questions.
                Your conversations will be saved automatically.
              </p>
            </div>
          )}

          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${
                message.role === "USER"
                  ? "justify-end"
                  : "justify-start"
              }`}
            >
              {message.role === "ASSISTANT" && (
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-500/20">
                  <Bot className="h-5 w-5 text-blue-400" />
                </div>
              )}

              <div
                className={`max-w-[85%] rounded-2xl p-4 ${
                  message.role === "USER"
                    ? "bg-blue-600 text-white"
                    : "border border-white/10 bg-[#111827] text-gray-200"
                }`}
              >
                {message.role === "ASSISTANT" && (
                  <p className="mb-2 text-xs font-semibold text-blue-400">
                    CampusBook AI
                  </p>
                )}

                <div className="whitespace-pre-wrap text-sm leading-7">
                  {message.content}
                </div>

                {message.role === "ASSISTANT" &&
                  message.sources &&
                  message.sources.length > 0 && (
                    <div className="mt-4 border-t border-white/10 pt-3">
                      <p className="mb-2 text-xs font-semibold text-gray-400">
                        Reference Pages
                      </p>

                      <div className="flex flex-wrap gap-2">
                        {[...new Set(
                          message.sources.map(
                            (source) => source.page_number
                          )
                        )]
                          .sort((a, b) => a - b)
                          .map((pageNumber) => (
                            <span
                              key={pageNumber}
                              className="rounded-lg bg-blue-500/10 px-3 py-1 text-xs text-blue-400"
                            >
                              Page {pageNumber}
                            </span>
                          ))}
                      </div>
                    </div>
                  )}
              </div>
            </div>
          ))}

          {asking && (
            <div className="flex items-center gap-3 text-blue-400">
              <Bot className="h-6 w-6" />
              <p className="text-sm">
                CampusBook AI is thinking...
              </p>
              <Loader2 className="h-4 w-4 animate-spin" />
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Error */}
        {error && (
          <p className="px-5 pb-2 text-sm text-red-400">
            {error}
          </p>
        )}

        {/* Message Input */}
        <div className="border-t border-white/10 p-4">
          <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-[#111827] p-2">

            <input
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              onKeyDown={(event) => {
                if (
                  event.key === "Enter" &&
                  !event.shiftKey
                ) {
                  event.preventDefault();
                  handleAskQuestion();
                }
              }}
              placeholder="Ask something about your study material..."
              disabled={asking}
              className="min-w-0 flex-1 bg-transparent px-3 py-2 text-sm text-white outline-none placeholder:text-gray-500"
            />

            <button
              onClick={handleAskQuestion}
              disabled={
                !question.trim() ||
                !selectedDocumentId ||
                asking
              }
              className="rounded-lg bg-blue-600 p-3 text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-40"
              title="Send message"
            >
              <Send className="h-5 w-5" />
            </button>
          </div>

          <p className="mt-2 text-center text-xs text-gray-600">
            CampusBook AI can make mistakes. Verify important academic information.
          </p>
        </div>
      </main>
    </div>
  );
};

export default AIAssistant;
