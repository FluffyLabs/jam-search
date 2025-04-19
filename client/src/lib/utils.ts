import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function formatJamChatName(roomId: string | null) {
  if (!roomId) return null;

  const rooms = {
    "!ddsEwXlCWnreEGuqXZ:polkadot.io": "Gray Paper",
    "!wBOJlzaOULZOALhaRh:polkadot.io": "Let's JAM",
    "!KKOmuUpvYKPcniwOzw:matrix.org": "JAM Implementers Room",
  };

  return rooms[roomId as keyof typeof rooms] || roomId;
}
