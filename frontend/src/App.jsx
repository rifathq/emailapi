import React from "react";
import { motion } from "framer-motion";
import Scene3D from "./components/Scene3D.jsx";
import ContactForm from "./components/ContactForm.jsx";

export default function App() {
  return (
    <div className="relative min-h-screen w-full font-body">
      <Scene3D />

      <main className="relative z-10 flex min-h-screen w-full flex-col items-center justify-center px-4 py-16 sm:px-6">
        <motion.span
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-6 text-xs font-medium tracking-wide text-white/40"
        >
          Available for new projects
        </motion.span>

        <ContactForm />

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-8 text-xs text-white/30"
        >
          Your message goes straight to my inbox — no spam, ever.
        </motion.p>
      </main>
    </div>
  );
}
