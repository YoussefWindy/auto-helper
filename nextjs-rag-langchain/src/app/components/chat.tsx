"use client";

import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useChat } from "ai/react";
import { useRef, useEffect } from "react";

export function Chat() {
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    api: "api/final",
    onError: (e) => {
      console.log(e);
    },
  });
  const chatParent = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const domNode = chatParent.current;
    if (domNode) {
      domNode.scrollTop = domNode.scrollHeight;
    }
  });

  return (
    <main className="flex flex-col w-full h-screen max-h-screen bg-background">
      {/* Header across the top of the grid */}
      <header className="p-4 border-b w-full flex justify-start items-center">
        <h1 className="text-2xl font-bold">Auto Helper</h1>
        <Image src="/logo.png" width={35} height={35} className="ml-1" />
      </header>

      {/* Grid layout below the header */}
      <div className="flex-grow grid grid-cols-2 gap-8 w-full mx-auto relative">
        {/* Column 1: Chat Interface */}
        <section className="flex flex-col gap-4 overflow-y-auto relative">
          <ul ref={chatParent} className="flex-grow bg-muted/50 rounded-lg p-4">
            {messages.map((m, index) => (
              <li
                key={index}
                className={`p-1 flex ${
                  m.role === "user" ? "flex-row" : "flex-row-reverse"
                }`}
              >
                <div className="rounded-xl bg-background shadow-md p-4 flex w-3/4">
                  <p className="text-primary">{m.content}</p>
                </div>
              </li>
            ))}
          </ul>
          <form onSubmit={handleSubmit} className="p-3 flex items-center">
            <Input
              className="flex.-1 min-h-[40px]"
              placeholder="Type your question here..."
              type="text"
              value={input}
              onChange={handleInputChange}
            />
            <Button className="ml-2" type="submit">
              Submit
            </Button>
          </form>

          {/* Centered transparent image */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <Image
              src="/logo.png"
              alt="Image"
              width={300}
              height={300}
              style={{ opacity: 0.2 }}
            />
          </div>
        </section>

        {/* Column 2: Additional Content */}
        <section className="bg-gray-100 p-4 rounded-lg">
          <h2 className="text-xl font-semibold">Additional Info</h2>
          <p>
            Place other content or components here that complement the chat
            feature.
          </p>
        </section>
      </div>
    </main>
  );
}
