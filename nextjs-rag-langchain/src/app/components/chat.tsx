"use client";

import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useChat } from "ai/react";
import { useRef, useEffect, useState } from "react";

export function Chat() {
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    api: "api/final",
    onError: (e) => {
      console.log(e);
    },
  });
  const chatParent = useRef<HTMLUListElement>(null);
  const [popularCars, setPopularCars] = useState([]); // Array to store popular cars
  const [currentCarIndex, setCurrentCarIndex] = useState(0); // Index of the current car being displayed

  useEffect(() => {
    const domNode = chatParent.current;
    if (domNode) {
      domNode.scrollTop = domNode.scrollHeight;
    }
  });

  const popularCarsData = [
    {
      Name: "2024 Toyota RAV4 Hybrid SE",
      Price: "$37,375",
      URL: "https://cars.com/vehicledetail/4abe9d12-111a-4fb4-bf49-d12427870083/",
      "Image URL":
        "https://www.cars.com/i/large/in/v2/3239affa-3db8-4139-ac0a-1ce11e5a60fc/66c62d5b-d972-45a3-97c3-7e4a1ca8fc6c/eUhzEKQ7y7fKR8oKHJw5qeH9iO4.jpg",
    },
    {
      Name: "2024 Jeep Wagoneer L Series II",
      Price: "$70,000",
      URL: "https://cars.com/vehicledetail/e7ee36f6-c49f-4478-85e8-de5388261d33/",
      "Image URL":
        "https://www.cars.com/i/large/in/v2/3df6a95b-4179-51f2-8802-2c8750cc3977/6d5abb58-070e-4af2-8de7-60e43cb1aab4/_k1exIfRtm0Bl5EioD206jOXT-c.jpg",
    },
  ];

  useEffect(() => {
    const domNode = chatParent.current;
    if (domNode) {
      domNode.scrollTop = domNode.scrollHeight;
    }
  });

  useEffect(() => {
    setPopularCars(popularCarsData);
  }, []);

  // Function to go to next car
  const handleNextCar = () => {
    setCurrentCarIndex((prevIndex) => (prevIndex + 1) % popularCars.length);
  };

  // Function to go to previous car
  const handlePreviousCar = () => {
    setCurrentCarIndex((prevIndex) =>
      prevIndex === 0 ? popularCars.length - 1 : prevIndex - 1
    );
  };

  return (
    <main className="flex flex-col w-full h-screen max-h-screen bg-background">
      {/* Header */}
      <header className="p-4 border-b w-full flex justify-start items-center">
        <h1 className="text-2xl font-bold">Auto Helper</h1>
        <Image
          src="/logo.png"
          alt="Logo"
          width={35}
          height={35}
          className="ml-1"
        />
      </header>
      <div className="flex-grow grid grid-cols-2 gap-8 w-full overflow-y-auto mx-auto relative">
        {/* Chat Interface */}
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
          {/* Logo in middle of chatbox */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <Image
              src="/logo.png"
              alt="Image"
              width={300}
              height={300}
              style={{ opacity: 0.07 }}
            />
          </div>
        </section>
        {/* Display Cars */}
        <section className="bg-gray-100 p-4 rounded-lg">
          {/* Popular car details */}
          {popularCars.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold">Our recommendations</h2>
              <div className="mt-4">
                <h3 className="text-lg font-medium">
                  {popularCars[currentCarIndex].Name}
                </h3>
                <img
                  src={popularCars[currentCarIndex]["Image URL"]}
                  alt={popularCars[currentCarIndex].Name}
                  className="mt-2 w-full"
                />
                <p className="mt-2">{popularCars[currentCarIndex].Price}</p>
                {/* Render additional details */}
                <a
                  href={popularCars[currentCarIndex].URL}
                  className="text-blue-600"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View Details
                </a>
                {/* Buttons for navigation */}
                <div className="mt-4 flex justify-between items-center">
                  <button
                    onClick={handlePreviousCar}
                    className="bg-blue-500 text-white p-6 rounded-full focus:outline-none"
                  ></button>
                  <button
                    onClick={handleNextCar}
                    className="bg-blue-500 text-white p-6 rounded-full focus:outline-none"
                  ></button>
                </div>
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
