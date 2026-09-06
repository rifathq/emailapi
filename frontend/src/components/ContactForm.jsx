import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const initialForm = { name: "", email: "", message: "" };

function ErrorText({ children }) {
  if (!children) return null;
  return (
    <p className="mt-1.5 text-xs text-red-300/90" role="alert">
      {children}
    </p>
  );
}

export default function ContactForm() {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [serverError, setServerError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validateClientSide = () => {
    const next = {};
    if (!form.name.trim()) next.name = "Name is required.";
    if (!form.email.trim()) {
      next.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      next.email = "Enter a valid email address.";
    }
    if (!form.message.trim()) {
      next.message = "Message is required.";
    } else if (form.message.trim().length < 10) {
      next.message = "Message should be at least 10 characters.";
    }
    return next;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");

    const clientErrors = validateClientSide();
    if (Object.keys(clientErrors).length > 0) {
      setErrors(clientErrors);
      return;
    }

    setStatus("loading");

    try {
      const res = await fetch(`${API_URL}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok || !data.success) {
        if (data.errors) setErrors(data.errors);
        setServerError(
          data.message || "Something went wrong. Please try again."
        );
        setStatus("error");
        return;
      }

      setStatus("success");
      setForm(initialForm);
      setTimeout(() => setStatus("idle"), 4500);
    } catch (err) {
      setServerError(
        "Couldn't reach the server. Check your connection and try again."
      );
      setStatus("error");
    }
  };

  const isLoading = status === "loading";

  return (
    <motion.div
      initial={{ opacity: 0, y: 32, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="glass-card relative w-full max-w-md rounded-3xl p-8 shadow-glow sm:p-10"
    >
      <div className="mb-8">
        <h1 className="font-display text-2xl font-semibold text-white sm:text-3xl">
          Let's start a conversation
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-white/50">
          Send a message and I'll get back to you within a day or two.
        </p>
      </div>

      <AnimatePresence mode="wait">
        {status === "success" ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center justify-center py-10 text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1, type: "spring", stiffness: 200, damping: 14 }}
              className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-aqua-500/15 shadow-glow-aqua"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#4fd1c5"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-8 w-8"
              >
                <motion.path
                  d="M5 13l4 4L19 7"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ delay: 0.25, duration: 0.5, ease: "easeOut" }}
                />
              </svg>
            </motion.div>
            <h2 className="font-display text-lg font-semibold text-white">
              Message sent successfully
            </h2>
            <p className="mt-2 max-w-xs text-sm text-white/50">
              Thanks for reaching out — your note is on its way to my inbox.
            </p>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onSubmit={handleSubmit}
            noValidate
            className="flex flex-col gap-5"
          >
            <div>
              <label
                htmlFor="name"
                className="mb-1.5 block text-xs font-medium text-white/60"
              >
                Name
              </label>
              <div
                className={`field-shell rounded-xl ${
                  errors.name ? "field-error" : ""
                }`}
              >
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  placeholder="Jane Doe"
                  value={form.name}
                  onChange={handleChange}
                  disabled={isLoading}
                  className="w-full bg-transparent px-4 py-3 text-sm text-white placeholder-white/25 outline-none disabled:opacity-50"
                />
              </div>
              <ErrorText>{errors.name}</ErrorText>
            </div>

            <div>
              <label
                htmlFor="email"
                className="mb-1.5 block text-xs font-medium text-white/60"
              >
                Email
              </label>
              <div
                className={`field-shell rounded-xl ${
                  errors.email ? "field-error" : ""
                }`}
              >
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="jane@example.com"
                  value={form.email}
                  onChange={handleChange}
                  disabled={isLoading}
                  className="w-full bg-transparent px-4 py-3 text-sm text-white placeholder-white/25 outline-none disabled:opacity-50"
                />
              </div>
              <ErrorText>{errors.email}</ErrorText>
            </div>

            <div>
              <label
                htmlFor="message"
                className="mb-1.5 block text-xs font-medium text-white/60"
              >
                Message
              </label>
              <div
                className={`field-shell rounded-xl ${
                  errors.message ? "field-error" : ""
                }`}
              >
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  placeholder="Tell me a bit about what you have in mind..."
                  value={form.message}
                  onChange={handleChange}
                  disabled={isLoading}
                  className="w-full resize-none bg-transparent px-4 py-3 text-sm text-white placeholder-white/25 outline-none disabled:opacity-50"
                />
              </div>
              <ErrorText>{errors.message}</ErrorText>
            </div>

            <AnimatePresence>
              {status === "error" && serverError && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden rounded-xl border border-red-400/25 bg-red-400/10 px-4 py-2.5 text-xs text-red-200"
                >
                  {serverError}
                </motion.div>
              )}
            </AnimatePresence>

            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: isLoading ? 1 : 1.015 }}
              whileTap={{ scale: isLoading ? 1 : 0.98 }}
              className="relative mt-1 flex items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-violet-500 to-aqua-500 px-6 py-3.5 text-sm font-semibold text-white shadow-glow transition-opacity disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isLoading ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                  Sending...
                </>
              ) : (
                <>Send Message</>
              )}
            </motion.button>
          </motion.form>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
