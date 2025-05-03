import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { fetchApi } from "@/lib/api";
import { useState } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { OpenAI } from "openai";

const Header = () => {
  return (
    <>
      <h1 className="text-4xl font-bold mb-2 flex items-center flex-col sm:flex-row">
        Learn together with an AI assistant
      </h1>

      <p className="text-center text-muted-foreground mb-8">
        Connecting you to the right answers from GrayPaper, JAM Chat, JAM0 and
        others sources
      </p>
    </>
  );
};

export const ChatPage = () => {
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [messages, setMessages] = useState<any[]>([]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    setIsLoading(true);
    setPrompt("");

    setMessages((prevState) => [
      ...prevState,
      { role: "user", content: prompt },
    ]);

    const result = await fetchApi<{ result: OpenAI.Responses.Response }>(
      "/chat",
      {
        method: "POST",
        body: JSON.stringify({ message: prompt }),
      }
    );

    setMessages((prevState) => [
      ...prevState,
      { role: "assistant", content: result.result.output_text },
    ]);
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center rounded-xl w-full bg-card text-foreground dark:text-white p-4 relative overflow-hidden min-h-full">
      <div className="max-w-3xl w-full flex flex-col items-center mt-16 relative z-10">
        <Header />
      </div>
      <div className="flex flex-col gap-4 w-full max-w-2xl">
        <div className="flex flex-col gap-4">
          {messages.map((message, index) => (
            <div key={index}>
              {message.role === "user" ? "User: " : "AI: "}
              <div className="bg-secondary p-4 rounded-lg">
                <Markdown remarkPlugins={[remarkGfm]}>
                  {message.content}
                </Markdown>
              </div>
            </div>
          ))}
        </div>

        {isLoading && <p>Loading...</p>}

        <form onSubmit={handleSubmit} className="flex gap-4">
          <Input
            type="content"
            value={prompt}
            placeholder="Ask me anything..."
            className="w-full"
            onChange={(event) => setPrompt(event.target.value)}
          />

          <Button type="submit">Submit</Button>
        </form>
      </div>
    </div>
  );
};
