import type { Message } from "../types";
import { useEffect, useState } from "react";
import markdownit from "markdown-it";
import {
    Copy01Icon,
    Tick02Icon,
    ArrowReloadHorizontalIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

const md = markdownit();

interface MessagesContainerProps {
    messages: Message[];
    isLoading: boolean;
    error: string | null;
    retry: () => void;
}

export default function MessagesContainer({
    messages,
    isLoading,
    error,
    retry,
}: MessagesContainerProps) {
    const [copiedId, setCopiedId] = useState<string | null>(null);

    useEffect(() => {
        document
            .getElementById("messages-end")
            ?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isLoading]);

    const copyMessage = async (id: string, text: string) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopiedId(id);

            setTimeout(() => {
                setCopiedId(null);
            }, 1500);
        } catch (err) {
            console.error(err);
        }
    };

    const lastAssistantIndex = messages
        .map((m) => m.role)
        .lastIndexOf("assistant");

    return (
        <div className="flex-1 overflow-y-auto p-4">
            {messages.length === 0 ? (
                <div className="flex min-h-[50vh] items-center justify-center text-2xl text-gray-400">
                    What's on your mind today?
                </div>
            ) : (
                <div className="flex flex-col gap-4">
                    {messages.map((message, index) => (
                        <div
                            key={message.id}
                            className={`flex ${
                                message.role === "user"
                                    ? "justify-end"
                                    : "justify-start"
                            }`}
                        >
                            <div
                                className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-6 ${
                                    message.role === "user"
                                        ? "bg-[#303030] text-white"
                                        : "text-white"
                                }`}
                            >
                                <div
                                    dangerouslySetInnerHTML={{
                                        __html: md.render(message.content),
                                    }}
                                />

                                {message.role === "assistant" && (
                                    <div className="mt-3 flex items-center gap-2">
                                        {/* Copy */}
                                        <button
                                            onClick={() =>
                                                copyMessage(
                                                    message.id,
                                                    message.content
                                                )
                                            }
                                            className="rounded-full p-2 text-gray-400 transition hover:bg-gray-700 hover:text-white"
                                            title="Copy"
                                        >
                                            <HugeiconsIcon
                                                icon={
                                                    copiedId === message.id
                                                        ? Tick02Icon
                                                        : Copy01Icon
                                                }
                                                size={18}
                                                color={
                                                    copiedId === message.id
                                                        ? "#22c55e"
                                                        : undefined
                                                }
                                            />
                                        </button>

                                        {/* Retry */}
                                        {index === lastAssistantIndex && (
                                            <button
                                                onClick={retry}
                                                className="rounded-full p-2 text-gray-400 transition hover:bg-gray-700 hover:text-white"
                                                title="Retry"
                                            >
                                                <HugeiconsIcon
                                                    icon={
                                                        ArrowReloadHorizontalIcon
                                                    }
                                                    size={18}
                                                />
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {isLoading && (
                <div className="flex justify-start p-4 text-white">
                    Loading...
                </div>
            )}

            {error && (
                <div className="mt-4 flex max-w-[60%] items-center justify-between rounded-xl bg-white p-2">
                    <div className="px-4 py-2 text-red-700">
                        {error}
                    </div>

                    <button
                        onClick={retry}
                        className="rounded-full bg-black px-4 py-2 text-white"
                    >
                        Retry
                    </button>
                </div>
            )}

            <div id="messages-end" />
        </div>
    );
}
