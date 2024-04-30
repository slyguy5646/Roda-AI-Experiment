"use client";

import { Service } from "@prisma/client";
import Image from "next/image";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FindSchema } from "./api/find/route";

const suggestions = [
  "My car isn't stopping like it's supposed to",
  "My tire is flat",
  "Some fluid is leaking from my car",
];

export default function Home() {
  const [items, setItems] = useState<Service[]>([]);
  const [query, setQuery] = useState<string | null>("");

  async function fetchItems(searchQuery?: string) {
    const res = await fetch("/api/find", {
      method: "POST",
      body: JSON.stringify({
        query: searchQuery || query || "",
      } satisfies FindSchema),
    });

    if (res.ok) {
      const body = await res.json();

      setItems(body.closest);
      console.log(body.closest);
    }
  }

  return (
    <div className="overflow-hidden">
      <motion.div
        className="flex flex-col w-full justify-center items-center"
        initial={{ height: "100dvh" }}
        animate={{
          height: items.length > 0 ? "auto" : "100dvh",
          marginTop: items.length > 0 ? "3rem" : "auto",
          marginBottom: items.length > 0 ? "2.5rem" : "auto",
        }}
      >
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            await fetchItems();
          }}
          className="w-full flex flex-col justify-center items-center gap-y-4"
        >
          <div className="flex items-center gap-x-2 w-full justify-center md:max-w-[70%] max-w-[95%]">
            {items.length > 0 && (
              <button
                onClick={() => {
                  setQuery("");
                  setItems([]);
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6 text-roda-yellow"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
                  />
                </svg>
              </button>
            )}

            <input
              name="query"
              value={query || ""}
              onChange={(e) => {
                setQuery(e.target.value);
                setItems([]);
              }}
              placeholder="Ask something, like you would a mechanic..."
              className=" w-full rounded-lg h-16 text-xl md:text-4xl outline-none px-4 placeholder-xl"
            />
          </div>
        </form>
        {items.length <= 0 && (
          <div className="flex flex-col justify-center items-center gap-y-4 mt-6">
            <div className="text-white">Try...</div>
            <div className="flex md:flex-row flex-col items-center md:items-start justify-evenly w-full gap-y-2">
              {suggestions.map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={async () => {
                    setQuery(suggestion);
                    fetchItems(suggestion);
                  }}
                  className="text-roda-yellow flex-[0.33]"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}
      </motion.div>
      <AnimatePresence>
        {items.length > 0 && (
          <div className="w-full flex justify-center overflow-scroll mb-12">
            <motion.div
              className="max-w-[95%] md:max-w-[70%] w-full flex flex-col gap-y-2 justify-center items-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="text-left w-full text-white">
                Here's what we'd recommend...
              </div>
              {items.map((e) => (
                <div
                  key={e.id}
                  className="w-full bg-white rounded-lg p-4 min-w-full"
                >
                  <div className="flex gap-x-2 items-center bg-roda-yellow w-fit px-2">
                    <div className="text-2xl">{e.title}</div>
                    {e.icon && (
                      <Image
                        src={e.icon}
                        alt={e.title + " icon"}
                        width={25}
                        height={25}
                      />
                    )}
                  </div>
                  <div>{e.description}</div>
                </div>
              ))}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
