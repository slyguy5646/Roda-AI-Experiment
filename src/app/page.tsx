"use client";

import { search } from "@/lib/actions";
import { Service } from "@prisma/client";
import Image from "next/image";
import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const suggestions = [
  "My car isn't stopping like it's supposed to",
  "Some fluid is leaking from my car",
  "My tire is flat",
];

export default function Home() {
  const [items, setItems] = useState<Service[]>([]);
  const [query, setQuery] = useState<string | null>("");

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
          //@ts-expect-error
          action={async (formData) => {
            const searchItems = await search(formData);

            setItems(searchItems);

            console.log(searchItems);
          }}
          className="w-full flex flex-col justify-center items-center gap-y-4"
        >
          <input
            name="query"
            value={query || ""}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask something, like you would a mechanic..."
            className="max-w-[70%] w-full rounded-lg h-16 text-4xl outline-none px-4 placeholder-xl"
          />
          {items.length <= 0 && (
            <>
              <div className="text-white">Try...</div>
              {suggestions.map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => {
                    setQuery(suggestion);
                  }}
                  className="text-roda-yellow"
                  type="submit"
                >
                  {suggestion}
                </button>
              ))}
            </>
          )}
        </form>
      </motion.div>
      <AnimatePresence>
        {items.length > 0 && (
          <div className="w-full flex justify-center overflow-scroll mb-12">
            <motion.div
              className="max-w-[70%] flex flex-col gap-y-2 justify-center items-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="text-left w-full text-white">
                Here's what we'd recommend...
              </div>
              {items.map((e) => (
                <div key={e.id} className="w-full bg-white rounded-lg p-4">
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
