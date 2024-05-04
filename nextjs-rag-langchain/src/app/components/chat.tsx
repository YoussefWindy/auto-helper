"use client";

import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useChat } from "ai/react";
import { useRef, useEffect, useState } from "react";

export function Chat() {
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    api: "api/chat_wrapper",
    onError: (e) => {
      console.log(e);
    },
  });
  const chatParent = useRef<HTMLUListElement>(null);
  // Set initial view to highest rated cars
  const [currentView, setCurrentView] = useState("highestRated");

  useEffect(() => {
    const domNode = chatParent.current;
    if (domNode) {
      domNode.scrollTop = domNode.scrollHeight;
    }
  });

  const highestRatedCar = {
    Name: "2024 Toyota RAV4 Hybrid SE",
    Price: "$37,375",
    URL: "https://cars.com/vehicledetail/4abe9d12-111a-4fb4-bf49-d12427870083/",
    Mileage: null,
    "Stock-Type": "New",
    "Dealer Details": {
      Name: "Modern Toyota of Asheboro",
      Rating: "4.9",
      "Review Count": "730 reviews",
      Location: "Asheboro, NC",
    },
    Specifications: {
      "Exterior color": "Silver Sky Metallic",
      "Interior color": "Black",
      Drivetrain: "All-wheel Drive",
      MPG: "41–38 Based on EPA mileage ratings. Use for comparison purposes only. Actual mileage will vary depending on driving conditions, driving habits, vehicle maintenance, and other factors.",
      "Fuel type": "Hybrid",
      Transmission: "Automatic",
      Engine:
        "Dynamic Force 2.5L I-4 port/direct injection, DOHC, VVT-i variab",
      VIN: "JTM16RFV7RD131782",
      "Stock #": "16N3425",
      Mileage: "6 mi.",
    },
    "Image URL":
      "https://www.cars.com/i/large/in/v2/3239affa-3db8-4139-ac0a-1ce11e5a60fc/66c62d5b-d972-45a3-97c3-7e4a1ca8fc6c/eUhzEKQ7y7fKR8oKHJw5qeH9iO4.jpg",
  };

  const [closestMatches, setClosestMatches] = useState([]);

  const fetchClosestMatches = async () => {
    {
      /* Implement your logic to search for closest matches
    and fetch additional details and images
    For demonstration purposes, let's assume closestMatchesData
  is an array of objects containing details of closest matches */
    }

    setClosestMatches(closestMatchesData);
  };

  useEffect(() => {
    if (currentView === "highestRated") {
      // Fetch highest-rated cars when the component mounts
      fetchHighestRatedCars();
    } else {
      fetchClosestMatches(); // Fetch closest matches when the view changes
    }
  }, [currentView]); // Re-run effect when currentView changes

  const fetchHighestRatedCars = async () => {
    // Set highest rated car data directly
    setClosestMatches([highestRatedCar]);
  };

  return (
    <main className="flex flex-col w-full h-screen max-h-screen bg-background">
      {/* Header */}
      <header className="p-4 border-b w-full flex justify-start items-center">
        <h1 className="text-2xl font-bold">Auto Helper</h1>
        <Image src="/logo.png" width={35} height={35} className="ml-1" />
      </header>
      <div className="flex-grow grid grid-cols-2 gap-8 w-full mx-auto relative">
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
              style={{ opacity: 0.2 }}
            />
          </div>
        </section>
        {/* Display Cars */}
        <section className="bg-gray-100 p-4 rounded-lg">
          {currentView === "highestRated" ? (
            <>
              <h2 className="text-xl font-semibold">Highest Rated Cars</h2>
              <div className="mt-4">
                <h3 className="text-lg font-medium">{highestRatedCar.Name}</h3>
                <img
                  src={highestRatedCar["Image URL"]}
                  alt={highestRatedCar.Name}
                  className="mt-2 w-full"
                />
                <p className="mt-2">{highestRatedCar.Price}</p>
                {/* Render additional details */}
                <a
                  href={highestRatedCar.URL}
                  className="text-blue-600"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View Details
                </a>
              </div>
              <Button
                onClick={() => setCurrentView("closestMatches")}
                className="mt-4"
              >
                View Closest Matches
              </Button>
            </>
          ) : (
            <>
              <h2 className="text-xl font-semibold">Closest Matches</h2>
              {/* Render closest matches */}
              {closestMatches.map((match, index) => (
                <div key={index} className="mt-4">
                  {/* Render closest match details */}
                </div>
              ))}
              <Button
                onClick={() => setCurrentView("highestRated")}
                className="mt-4"
              >
                View Highest Rated Cars
              </Button>
            </>
          )}
        </section>
      </div>
    </main>
  );
}
