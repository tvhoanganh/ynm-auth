"use client";

import { useState, useEffect } from "react";

interface FormattedDateProps {
  dateString: string;
}

/** Client component: formats date after mount to avoid hydration mismatch */
export function FormattedDate({ dateString }: FormattedDateProps) {
  const [formatted, setFormatted] = useState<string>("");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => {
      const date = new Date(dateString);
      setFormatted(date.toLocaleString("vi-VN"));
      setIsMounted(true);
    });
    return () => cancelAnimationFrame(id);
  }, [dateString]);

  if (!isMounted) {
    return <span>{dateString}</span>;
  }

  return <span>{formatted}</span>;
}
