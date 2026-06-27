import { useState } from "react";
import type { Message } from "../types";
import { getChatResponse } from "../api/chat";

export default function useChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  // const [error, setError] = useState(null);
  // const [model, setModel] = useState("gpt-4");

  const sendMessage = async () => {
    try {
      // create the userMessage
      const userMessage: Message = {
        id: crypto.randomUUID(),
        role: "user",
        content: input,
      };

      const updatedMessages = [...messages, userMessage];

      setMessages(updatedMessages);

      setInput("");

      setIsLoading(true);

      // call the Gemini API.
      const groqResponse: string = await getChatResponse(updatedMessages);

      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: groqResponse,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    messages,
    input,
    setInput,
    sendMessage,
    isLoading,
  };
}
