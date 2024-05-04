'use client'

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useChat } from "ai/react";
import { useRef, useEffect } from 'react';
import image1 from './images/car-logo-removebg-preview.png'

export function Chat() {

    const { messages, input, handleInputChange, handleSubmit } = useChat({
        api: 'api/final',
        onError: (e) => {
            console.log(e);
        }
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
            <header className="p-4 border-b w-full justify-start">
                <img src={image1} alt=""/>
                <h1 className="text-2xl font-bold">Auto Helper</h1>
            </header>

            {/* Grid layout below the header */}
            <div className="flex-grow grid grid-cols-2 gap-8 w-full mx-auto">  
                {/* Column 1: Chat Interface */}
                <section className="flex flex-col gap-4 overflow-y-auto">
                    <ul ref={chatParent} className="flex-grow bg-muted/50 rounded-lg p-4">
                        {messages.map((m, index) => (
                            <li key={index} className={`p-1 flex ${m.role === 'user' ? 'flex-row' : 'flex-row-reverse'}`}>
                                <div className="rounded-xl bg-background shadow-md p-4 flex w-3/4">
                                    <p className="text-primary">{m.content}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                    <form onSubmit={handleSubmit} className="p-3 flex items-center">
                        <Input className="flex.-1 min-h-[40px]" placeholder="Type your question here..." type="text" value={input} onChange={handleInputChange} />
                        <Button className="ml-2" type="submit">Submit</Button>
                    </form>
                </section>

                {/* Column 2: Additional Content */}
                <section className="bg-gray-100 p-4 rounded-lg">
                    <h2 className="text-xl font-semibold">Additional Info</h2>
                    <p>Place other content or components here that complement the chat feature.</p>
                </section>
            </div>
        </main>
    );
}
