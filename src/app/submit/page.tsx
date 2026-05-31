"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

function SubmitForm() {
  const searchParams = useSearchParams();
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    title: "",
    url: "",
    tagline: "",
    category: "",
    author: "",
  });

  // Prefill from share-target / query params on mount (e.g. a YouTube
  // share-sheet hitting /submit?url=...&text=...&title=...).
  useEffect(() => {
    const url = searchParams.get("url") ?? "";
    const text = searchParams.get("text") ?? "";
    const title = searchParams.get("title") ?? "";
    if (!url && !text && !title) return;
    setForm((f) => ({
      ...f,
      title: title || f.title,
      url: url || f.url,
      tagline: text || f.tagline,
    }));
  }, [searchParams]);

  function update(field: string, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      setSubmitted(true);
    }
  }

  if (submitted) {
    return (
      <main className="mx-auto max-w-2xl px-4 py-16 text-center">
        <div className="text-5xl mb-4">🎉</div>
        <h1 className="text-2xl font-bold mb-2">Submitted!</h1>
        <p className="text-neutral-400 mb-6">
          Thanks for adding to Demo Hunt. We&apos;ll review it shortly.
        </p>
        <Link href="/" className="text-[#ff5a3c] hover:underline">
          ← Back to the feed
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-2xl px-4 py-10">
      <Link
        href="/"
        className="text-sm text-neutral-400 hover:text-white mb-6 inline-block"
      >
        ← Back
      </Link>
      <h1 className="text-3xl font-bold mb-2">Submit a demo</h1>
      <p className="text-neutral-400 mb-8">
        Share a great product demo with the community.
      </p>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium mb-1.5">Title</label>
          <input
            type="text"
            required
            value={form.title}
            onChange={(e) => update("title", e.target.value)}
            className="w-full rounded-lg bg-neutral-900 border border-neutral-800 px-3 py-2 outline-none focus:border-[#ff5a3c]"
            placeholder="What's the demo called?"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5">URL</label>
          <input
            type="url"
            required
            value={form.url}
            onChange={(e) => update("url", e.target.value)}
            className="w-full rounded-lg bg-neutral-900 border border-neutral-800 px-3 py-2 outline-none focus:border-[#ff5a3c]"
            placeholder="https://..."
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5">Tagline</label>
          <input
            type="text"
            value={form.tagline}
            onChange={(e) => update("tagline", e.target.value)}
            className="w-full rounded-lg bg-neutral-900 border border-neutral-800 px-3 py-2 outline-none focus:border-[#ff5a3c]"
            placeholder="One line that sells it"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5">Category</label>
          <input
            type="text"
            value={form.category}
            onChange={(e) => update("category", e.target.value)}
            className="w-full rounded-lg bg-neutral-900 border border-neutral-800 px-3 py-2 outline-none focus:border-[#ff5a3c]"
            placeholder="AI, Dev Tools, Consumer..."
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5">
            Your name
          </label>
          <input
            type="text"
            value={form.author}
            onChange={(e) => update("author", e.target.value)}
            className="w-full rounded-lg bg-neutral-900 border border-neutral-800 px-3 py-2 outline-none focus:border-[#ff5a3c]"
            placeholder="Who's submitting?"
          />
        </div>
        <button
          type="submit"
          className="w-full rounded-lg bg-[#ff5a3c] text-white font-semibold py-2.5 hover:bg-[#ff6f54] transition-colors"
        >
          Submit demo
        </button>
      </form>
    </main>
  );
}

export default function SubmitPage() {
  return (
    <Suspense
      fallback={
        <main className="mx-auto max-w-2xl px-4 py-10">
          <h1 className="text-3xl font-bold mb-2">Submit a demo</h1>
          <p className="text-neutral-400">Loading…</p>
        </main>
      }
    >
      <SubmitForm />
    </Suspense>
  );
}
