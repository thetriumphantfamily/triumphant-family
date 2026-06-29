// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// EMPTY STATE — Shown when no data is available
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import { ReactNode } from "react";
import { Inbox } from "lucide-react";
import Button from "./Button";

interface EmptyStateProps {
  icon?:        ReactNode;
  title:        string;
  description?: string;
  actionLabel?: string;
  actionHref?:  string;
  onAction?:    () => void;
}

export default function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  actionHref,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-6">
      {/* ━━━ Icon ━━━ */}
      <div className="w-20 h-20 rounded-full bg-brand-purple-50 flex items-center justify-center mb-5 text-brand-purple-400">
        {icon || <Inbox className="w-10 h-10" />}
      </div>

      {/* ━━━ Title ━━━ */}
      <h3 className="text-xl font-heading font-bold text-brand-purple-900 mb-2">
        {title}
      </h3>

      {/* ━━━ Description ━━━ */}
      {description && (
        <p className="text-gray-600 max-w-md mb-6 leading-relaxed">
          {description}
        </p>
      )}

      {/* ━━━ Action Button ━━━ */}
      {actionLabel && (
        <Button
          variant="primary"
          href={actionHref}
          onClick={onAction}
        >
          {actionLabel}
        </Button>
      )}
    </div>
  );
}