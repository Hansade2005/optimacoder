"use client";

import { useState } from "react";

import { TEMPLATES } from "@/lib/constants";

type SandpackTemplate = "react-ts" | "react" | "vue" | "angular" | "svelte" | "solid" | "vanilla";

export default function TemplateSelector({
  value,
  onChange,
}: {
  value: string;
  onChange: (template: SandpackTemplate) => void;
}) {
  return (
    <div className="flex items-center gap-1">
      <label className="text-xs font-medium text-gray-500">Template:</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as SandpackTemplate)}
        className="rounded border border-gray-300 bg-white px-1.5 py-0.5 text-xs min-w-[60px] max-w-[110px] truncate focus:border-blue-500 focus:outline-none"
        aria-label="Project template"
      >
        {TEMPLATES.map((template) => (
          <option key={template.value} value={template.value} className="truncate">
            {template.label}
          </option>
        ))}
      </select>
    </div>
  );
}