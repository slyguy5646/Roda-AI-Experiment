"use client";

import { search } from "@/lib/actions";
import { Service } from "@prisma/client";
import Image from "next/image";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

export default function Home() {
  const [items, setItems] = useState<Service[]>([]);
  return (
    <div>
      <motion.div
        className="flex flex-col w-full justify-center items-center my-12 "
        initial={{ height: "100dvh" }}
        animate={{ height: items.length > 0 ? "auto" : "100dvh" }}
      >
        <form
          //@ts-expect-error
          action={async (formData) => {
            const searchItems = await search(formData);

            setItems(searchItems);

            console.log(searchItems);
          }}
          className="w-full flex justify-center"
        >
          <input
            name="query"
            placeholder="Search for a service..."
            className="max-w-[70%] w-full rounded-lg h-16 text-4xl outline-none px-4"
          />
        </form>
        {/* <div className="max-w-[70%] w-full mt-12 flex flex-col gap-y-2"></div> */}
      </motion.div>
      <div className="w-full flex justify-center">
        <AnimatePresence>
          {items.length > 0 && (
            <motion.div
              className="max-w-[70%] flex flex-col gap-y-2 justify-center items-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
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
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
