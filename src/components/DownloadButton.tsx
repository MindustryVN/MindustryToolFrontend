import React from "react";
import { API_BASE_URL } from "src/config/Config";
import { cn } from "src/util/Utils";

interface DownloadButtonProps {
  className?: string;
  href: string;
  download?: string;
}

export default function DownloadButton({
  className,
  href,
  download,
}: DownloadButtonProps) {
  return (
    <a
      className={cn(
        "flex items-center justify-center rounded-lg border border-slate-500 hover:bg-blue-500",
        className,
      )}
      href={API_BASE_URL + href}
      download={download}
    >
      <img src="/assets/icons/download.png" alt="download" />
    </a>
  );
}
