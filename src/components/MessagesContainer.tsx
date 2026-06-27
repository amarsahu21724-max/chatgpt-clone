import { useEffect } from "react";
import type { Message } from "../types";


interface MessagesContainerProps {
    messages: Message[];
    isLoading: boolean;
    error: string | null;
    retry: () => void;
}

export default function MessagesContainer( { messages, isLoading, error, retry }: MessagesContainerProps ) {


    useEffect(() => {
        console.log("error", error);
    }, [messages, error, isLoading]);

    return (
        <div className="flex-1 overflow-y-auto p-4">
            {messages.length === 0 ? (
                <div className="flex min-h-[50vh] items-center justify-center text-sm text-slate-500">
                    What can i help you with?
                </div>
            ) : <div className="flex flex-col gap-4">
                {
                    messages.map((message) => (
                        <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                            <div className={`max-w-[85%] rounded-full px-4 py-3 text-sm leading-6 ${message.role === "user" ? "bg-white text-slate-950" : "text-black"}`}>
                                {message.content}
                            </div>
                        </div>
                    ))
                }
                </div>
            }

            {isLoading && <div className="flex justify-start p-4 text-black"> Loading... </div> }
            
            {error && (
                <div className="flex items-center justify-between p-4 bg-white ">
                    <div className="text-red-700 px-4 py-2">
                        {error}
                    </div>
                    <button 
                        onClick={retry} 
                        className="ml-2 bg-black text-white px-4 py-2 rounded-full"
                    >
                        Retry
                    </button>
                </div>
            )}
        </div>
    )
}