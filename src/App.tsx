import Composer from "./components/Composer";
import MessagesContainer from "./components/MessagesContainer";
import useChat from "./hooks/useChat";

function App() {

  const {
        messages,
        input,
        setInput,
        sendMessage,
        isLoading,
        error,
        retry,
        model,
        setModel
    } = useChat();

  return (
    <div className="flex h-dvh flex-col bg-black text-white">
      <h1 className="py-4 text-left ml-5 text-xl font-bold">
        <span className="text-4xl">֍</span> 
        ChatGPT-Clone
      </h1>
      <MessagesContainer messages={messages} isLoading={isLoading} error={error} retry={retry} />
      <Composer value={input} onChange={setInput} onSend={sendMessage} model={model} onModelChange={setModel} />
    </div>
  )
}

export default App
