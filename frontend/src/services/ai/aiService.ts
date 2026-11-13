
import axios from "axios";

// FastAPI AI service
const AI_API_URL = "http://localhost:8000/api/ai";

// Node.js backend
const BACKEND_API_URL = "http://localhost:5000/api";

const aiApi = axios.create({
  baseURL: AI_API_URL,
});

const backendApi = axios.create({
  baseURL: BACKEND_API_URL,
});

// Attach JWT token to authenticated backend requests
backendApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// PDF operations

export const uploadDocument = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await aiApi.post("/upload", formData);
  return response.data;
};

export const getDocuments = async () => {
  const response = await aiApi.get("/documents");
  return response.data;
};

export const deleteDocument = async (documentId: string) => {
  const response = await aiApi.delete(`/documents/${documentId}`);
  return response.data;
};

// Conversation operations

export const createConversation = async (
  documentId: string,
  title = "New Chat"
) => {
  const response = await backendApi.post("/conversations", {
    documentId,
    title,
  });

  return response.data;
};

export const getConversations = async () => {
  const response = await backendApi.get("/conversations");
  return response.data;
};

export const getConversationById = async (conversationId: string) => {
  const response = await backendApi.get(
    `/conversations/${conversationId}`
  );

  return response.data;
};

export const sendConversationMessage = async (
  conversationId: string,
  question: string
) => {
  const response = await backendApi.post(
    `/conversations/${conversationId}/messages`,
    { question }
  );

  return response.data;
};

export const deleteConversation = async (conversationId: string) => {
  const response = await backendApi.delete(
    `/conversations/${conversationId}`
  );

  return response.data;
};
