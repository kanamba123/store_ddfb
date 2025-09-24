// utils/getInitials.ts
export function getInitials(name: string): string {
  if (!name) return "";

  const words = name.trim().split(/\s+/);
  const firstInitial = words[0]?.[0] || "";
  const secondInitial = words[1]?.[0] || "";

  return (firstInitial + secondInitial).toUpperCase();
}
