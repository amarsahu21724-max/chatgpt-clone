import { useState } from "react";
import type { Message } from "../types";
import { getChatStreamResponse } from "../api/chat";

export default function useChat() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [model, setModel] = useState("llama-3.3-70b-versatile");

    const streamAssistantResponse = async (history: Message[]) => {
        setIsLoading(true);
        setError(null);

        try {
            await getChatStreamResponse(history, model, (data: string) => {
                setMessages((current) => {
                    const last = current[current.length - 1];

                    // First chunk
                    if (!last || last.role !== "assistant") {
                        return [
                            ...current,
                            {
                                id: crypto.randomUUID(),
                                role: "assistant",
                                content: data,
                            },
                        ];
                    }

                    // Next chunks
                    return [
                        ...current.slice(0, -1),
                        {
                            ...last,
                            content: last.content + data,
                        },
                    ];
                });
            });
        } catch (err) {
            console.error(err);
            setError("Failed to get response.");
        } finally {
            setIsLoading(false);
        }
    };

    const sendMessage = async (text?: string) => {
        const content = (text ?? input).trim();

        if (!content) return;

        const userMessage: Message = {
            id: crypto.randomUUID(),
            role: "user",
            content,
        };

        const history = [...messages, userMessage];

        setMessages(history);
        setInput("");

        await streamAssistantResponse(history);
    };

    const retry = async () => {
        let history = [...messages];

        // Remove last assistant response
        if (
            history.length > 0 &&
            history[history.length - 1].role === "assistant"
        ) {
            history.pop();
        }

        // Update UI immediately
        setMessages(history);

        await streamAssistantResponse(history);
    };

    return {
        messages,
        input,
        setInput,
        sendMessage,
        isLoading,
        error,
        retry,
        model,
        setModel,
    };
}
