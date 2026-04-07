import React, { useState } from "react";
import axios from "axios";
import { X, Send } from "lucide-react";
import chatService from "../services/chatService";


export default function AIChat({ onClose }) {
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hi! Describe your issue and I’ll guide you." }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

const sendMessage = async () => {
  if (!input.trim()) return;

  const userMsg = { role: "user", content: input };
  setMessages(prev => [...prev, userMsg]);
  setInput("");
  setLoading(true);

  try {
    const res = await chatService.sendMessage(input);

    const reply = res.data?.data?.reply;

    setMessages(prev => [
      ...prev,
      { role: "assistant", content: reply }
    ]);

  } catch (err) {
    console.error(err);

    setMessages(prev => [
      ...prev,
      { role: "assistant", content: "⚠️ Error getting response" }
    ]);
  }

  setLoading(false);
};

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      
      <div className="w-full max-w-2xl h-[80vh] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl flex flex-col">
        
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b dark:border-slate-700">
          <h2 className="font-bold text-lg">AI Legal Assistant</h2>
          <button onClick={onClose}><X /></button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`p-3 rounded-xl text-sm max-w-[80%] ${
                msg.role === "user"
                  ? "bg-navy-600 text-white ml-auto"
                  : "bg-slate-200 dark:bg-slate-800"
              }`}
            >
              {msg.content}
            </div>
          ))}

          {loading && <p className="text-xs">Typing...</p>}
        </div>

        {/* Input */}
        <div className="p-4 border-t dark:border-slate-700 flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Describe your issue..."
            className="flex-1 px-4 py-2 rounded-lg border dark:bg-slate-800"
          />
          <button
            onClick={sendMessage}
            className="bg-navy-600 text-white px-4 py-2 rounded-lg"
          >
            <Send size={16} />
          </button>
        </div>

      </div>
    </div>
  );
}