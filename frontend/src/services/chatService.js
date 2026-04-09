import API from "../api";

const chatService = {
  sendMessage: (message) =>
    API.post("/ai/chat", {
      message,
    }),
};

export default chatService;