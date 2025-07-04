"use client";

import { SandpackTemplate } from "@/lib/utils";
import * as Select from "@radix-ui/react-select";
import { CheckIcon, ChevronDownIcon } from "lucide-react";

export interface TemplateSelectorProps {
  value: SandpackTemplate;
  onChange: (template: SandpackTemplate) => void;
  className?: string;
}

const TEMPLATE_OPTIONS: { value: SandpackTemplate; label: string; description: string }[] = [
  { value: 'react-ts', label: 'React + TypeScript', description: 'Modern React with TypeScript' },
  { value: 'react', label: 'React', description: 'React with JavaScript' },
  { value: 'nextjs', label: 'Next.js', description: 'Full-stack React framework' },
  { value: 'vite-react-ts', label: 'Vite + React + TypeScript', description: 'Fast build tool with React and TypeScript' },
  { value: 'vite-react', label: 'Vite + React', description: 'Fast build tool with React' },
  { value: 'astro', label: 'Astro', description: 'Static site generator' },
  { value: 'vue-ts', label: 'Vue + TypeScript', description: 'Vue.js with TypeScript' },
  { value: 'vue', label: 'Vue', description: 'Vue.js framework' },
  { value: 'svelte', label: 'Svelte', description: 'Compile-time framework' },
  { value: 'vanilla-ts', label: 'Vanilla + TypeScript', description: 'Plain TypeScript' },
  { value: 'vanilla', label: 'Vanilla', description: 'Plain JavaScript' },
];

export default function TemplateSelector({ value, onChange, className = "" }: TemplateSelectorProps) {
  const selectedOption = TEMPLATE_OPTIONS.find(option => option.value === value) || TEMPLATE_OPTIONS[0];

  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Framework Template
      </label>
      <Select.Root value={value} onValueChange={onChange}>
        <Select.Trigger className="flex h-10 w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50">
          <div className="flex flex-col items-start">
            <Select.Value>
              <span className="font-medium">{selectedOption.label}</span>
            </Select.Value>
            <span className="text-xs text-gray-500">{selectedOption.description}</span>
          </div>
          <Select.Icon>
            <ChevronDownIcon className="h-4 w-4" />
          </Select.Icon>
        </Select.Trigger>
        
        <Select.Portal>
          <Select.Content className="relative z-50 min-w-[8rem] overflow-hidden rounded-md border border-gray-200 bg-white text-gray-950 shadow-md animate-in fade-in-80">
            <Select.Viewport className="p-1">
              {TEMPLATE_OPTIONS.map((option) => (
                <Select.Item
                  key={option.value}
                  value={option.value}
                  className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-gray-100 data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                >
                  <div className="flex flex-col">
                    <div className="flex items-center">
                      <Select.ItemText className="font-medium">
                        {option.label}
                      </Select.ItemText>
                      <Select.ItemIndicator className="ml-auto">
                        <CheckIcon className="h-4 w-4" />
                      </Select.ItemIndicator>
                    </div>
                    <span className="text-xs text-gray-500">{option.description}</span>
                  </div>
                </Select.Item>
              ))}
            </Select.Viewport>
          </Select.Content>
        </Select.Portal>
      </Select.Root>
    </div>
  );
}