import type { ReactNode } from 'react';

interface CardProps {
  title: string;
  icon?: string;
  children: ReactNode;
}

export function Card({ title, children }: CardProps) {
  return (
    <div className="rounded-lg border border-zinc-700 bg-zinc-800/50 p-4">
      <h3 className="mb-2 text-lg font-semibold text-white">{title}</h3>
      <div className="text-sm text-zinc-400">{children}</div>
    </div>
  );
}

interface CardGridProps {
  children: ReactNode;
  stagger?: boolean;
}

export function CardGrid({ children }: CardGridProps) {
  return <div className="grid gap-4 md:grid-cols-2">{children}</div>;
}

interface LinkCardProps {
  title: string;
  description: string;
  href: string;
}

export function LinkCard({ title, description, href }: LinkCardProps) {
  return (
    <a
      href={href}
      className="block rounded-lg border border-zinc-700 bg-zinc-800/50 p-4 transition-colors hover:border-blue-500 hover:bg-zinc-800"
    >
      <h3 className="mb-1 font-semibold text-white">{title}</h3>
      <p className="text-sm text-zinc-400">{description}</p>
    </a>
  );
}
