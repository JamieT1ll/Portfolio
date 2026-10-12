
"use client";

import { useState, type FormEvent } from "react";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<
    "idle" | "sending" | "success" | "error"
  >("idle");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, message }),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      setStatus("success");
      setName("");
      setMessage("");
    } catch {
      setStatus("error");
    }
  }

  return (
    <main className="mx-auto max-w-5xl overflow-hidden px-6 py-16 md:px-12">
      <p className="animate-fade-up font-semibold uppercase tracking-[0.2em] text-[#028090]">
        Contact
      </p>

      <h1 className="animate-fade-up animation-delay-100 mt-3 max-w-2xl font-heading text-4xl font-bold text-[#05668D] md:text-6xl">
        Let&apos;s make something useful.
      </h1>

      <div className="mt-10 grid gap-8 md:grid-cols-[0.8fr_1.2fr]">
        <section className="animate-slide-left animation-delay-200">
          <p className="leading-7 text-[#05668D]">
            Have a project, question, or idea? Send a message and I&apos;ll
            get back to you.
          </p>

          <a
            className="mt-6 inline-block font-semibold text-[#028090] underline decoration-[#02C39A] decoration-2 underline-offset-4 transition-transform duration-200 hover:-translate-y-1"
            href="mailto:JamieIainTill@gmail.com"
          >
            JamieIainTill@gmail.com
          </a>
        </section>

        <form
          onSubmit={handleSubmit}
          className="animate-slide-right animation-delay-300 rounded-2xl bg-white/75 p-8 shadow-sm"
        >
          <label
            className="block text-sm font-semibold text-[#05668D]"
            htmlFor="name"
          >
            Name
          </label>

          <input
            className="mt-2 w-full rounded-md border border-[#028090]/30 bg-white px-4 py-3 outline-none transition duration-200 focus:border-[#00A896] focus:ring-2 focus:ring-[#02C39A]/20"
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            maxLength={100}
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <label
            className="mt-5 block text-sm font-semibold text-[#05668D]"
            htmlFor="message"
          >
            Message
          </label>

          <textarea
            className="mt-2 min-h-32 w-full rounded-md border border-[#028090]/30 bg-white px-4 py-3 outline-none transition duration-200 focus:border-[#00A896] focus:ring-2 focus:ring-[#02C39A]/20"
            id="message"
            name="message"
            maxLength={5000}
            required
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />

          <button
            className="mt-5 rounded-md bg-[#00A896] px-5 py-3 font-semibold text-white transition-all duration-200 hover:-translate-y-1 hover:bg-[#028090] hover:shadow-md active:translate-y-0 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
            type="submit"
            disabled={status === "sending"}
          >
            {status === "sending" ? "Sending..." : "Send message"}
          </button>

          {status === "success" && (
            <p role="status" className="mt-4 text-sm text-[#028090]">
              Thanks! Your message has been sent.
            </p>
          )}

          {status === "error" && (
            <p role="alert" className="mt-4 text-sm text-red-600">
              Sorry, something went wrong. Please try again or email me directly.
            </p>
          )}
        </form>
      </div>
    </main>
  );
}
