import type { Message } from "../types";

const BASE = "http://localhost:3000";

const getChatResponse = async(messages: Message[]) => {

    const response = await fetch(`${BASE}/chat`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ messages: messages })
    });

    const content = await response.json();
    console.log("response", content);
    console.log("content", content.response);

    return content.response;
}

export { getChatResponse };