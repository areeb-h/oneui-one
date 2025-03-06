"use client";
import { motion, AnimatePresence } from "framer-motion";
import { Navbar } from "./navbar";
import { Sidebar } from "./sidebar";
import { auth } from "@/lib/auth";

interface ShellProps {
  children: React.ReactNode;
}

export async function Shell({ children }: { children: React.ReactNode }) {
  const variants = {
    hidden: { opacity: 0, y: 20 },
    enter: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 20 },
  };

  const session = await auth();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 antialiased">
      {/* <Navbar /> */}
      <div className="flex">
        <Sidebar session={session} />
        <main className="flex-1 overflow-y-auto bg-white dark:bg-gray-900 md:rounded-tl-2xl md:border-l border-gray-100 dark:border-gray-800 shadow-sm">
          <div className="p-6 max-w-6xl mx-auto">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={Math.random()}
                variants={variants}
                initial="hidden"
                animate="enter"
                exit="exit"
                transition={{ type: "spring", duration: 0.5 }}
                className="space-y-6"
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
}
