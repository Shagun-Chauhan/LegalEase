import API from "../api";

const documentService = {
  upload: (formData) =>
    API.post("/document/documents/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  list: () => API.get("/document/documents"),
  getStats: () => API.get("/document/dashboard/stats"),
  get: (id) => API.get(`/document/documents/${id}`),
  delete: (id) => API.delete(`/document/documents/${id}`),
};

export default documentService;
