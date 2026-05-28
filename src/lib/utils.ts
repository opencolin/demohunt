import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Demo, VideoProvider } from "./data";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function thumbnailFor(demo: Pick<Demo, "videoProvider" | "videoId" | "thumbnailUrl">) {
  if (demo.thumbnailUrl) return demo.thumbnailUrl;
  if (demo.videoProvider === "youtube") {
    return `https://i.ytimg.com/vi/${demo.videoId}/mqdefault.jpg`;
  }
  if (demo.videoProvider === "loom") {
    return `https://cdn.loom.com/sessions/thumbnails/${demo.videoId}-with-play.gif`;
  }
  // mp4 — Mux serves a thumbnail at this path
  return `https://image.mux.com/${demo.videoId}/thumbnail.jpg?time=2`;
}

export function videoSrcFor(
  provider: VideoProvider,
  videoId: string,
): string {
  if (provider === "mp4") {
    return `https://stream.mux.com/${videoId}/high.mp4`;
  }
  // Fallback to embed URL — shouldn't be called for youtube/loom
  return embedUrlFor(provider, videoId, { autoplay: false });
}

export function embedUrlFor(
  provider: VideoProvider,
  videoId: string,
  opts: { autoplay: boolean; muted?: boolean; loop?: boolean } = { autoplay: false },
): string {
  const { autoplay, muted = true, loop = true } = opts;
  if (provider === "youtube") {
    const params = new URLSearchParams({
      autoplay: autoplay ? "1" : "0",
      mute: muted ? "1" : "0",
      loop: loop ? "1" : "0",
      playlist: videoId,
      controls: "0",
      modestbranding: "1",
      playsinline: "1",
      rel: "0",
      enablejsapi: "1",
    });
    return `https://www.youtube-nocookie.com/embed/${videoId}?${params.toString()}`;
  }
  if (provider === "loom") {
    const params = new URLSearchParams({
      autoplay: autoplay ? "1" : "0",
      muted: muted ? "true" : "false",
      hide_owner: "true",
      hide_share: "true",
      hide_title: "true",
      hideEmbedTopBar: "true",
    });
    if (loop) params.set("loop", "true");
    return `https://www.loom.com/embed/${videoId}?${params.toString()}`;
  }
  // mp4 — return the direct video URL (used by <video> element, not <iframe>)
  return videoSrcFor(provider, videoId);
}

export function formatCount(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

export function timeAgo(iso: string): string {
  const then = new Date(iso).getTime();
  const now = Date.now();
  const seconds = Math.max(1, Math.floor((now - then) / 1000));
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d`;
  const weeks = Math.floor(days / 7);
  if (weeks < 5) return `${weeks}w`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo`;
  const years = Math.floor(days / 365);
  return `${years}y`;
}
