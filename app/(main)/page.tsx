/* eslint-disable @next/next/no-img-element */
"use client";

import Fieldset from "@/components/fieldset";
import ArrowRightIcon from "@/components/icons/arrow-right";
import LightningBoltIcon from "@/components/icons/lightning-bolt";
import LoadingButton from "@/components/loading-button";
import Spinner from "@/components/spinner";
import * as Select from "@radix-ui/react-select";
import assert from "assert";
import { CheckIcon, ChevronDownIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { use, useState, useRef, useTransition } from "react";
import { createChat } from "./actions";
import { Context } from "./providers";
import Header from "@/components/header";
import { useS3Upload } from "next-s3-upload";
import UploadIcon from "@/components/icons/upload-icon";
import { XCircleIcon } from "@heroicons/react/20/solid";
import { MODELS, SUGGESTED_PROMPTS } from "@/lib/constants";
import OptimaCoderLogo from "@/components/optima-coder-logo";

export default function Home() {
  const { setStreamPromise } = use(Context);
  const router = useRouter();

  const [prompt, setPrompt] = useState("");
  const [model, setModel] = useState(MODELS[0].value);
  const [quality, setQuality] = useState("high");
  const [screenshotUrl, setScreenshotUrl] = useState<string | undefined>(
    undefined,
  );
  const [screenshotLoading, setScreenshotLoading] = useState(false);
  const selectedModel = MODELS.find((m) => m.value === model);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isPending, startTransition] = useTransition();

  const { uploadToS3 } = useS3Upload();
  const handleScreenshotUpload = async (event: any) => {
    if (prompt.length === 0) setPrompt("Build this");
    setQuality("low");
    setScreenshotLoading(true);
    let file = event.target.files[0];
    const { url } = await uploadToS3(file);
    setScreenshotUrl(url);
    setScreenshotLoading(false);
  };

  const textareaResizePrompt = prompt
    .split("\n")
    .map((text) => (text === "" ? "a" : text))
    .join("\n");

  return (
    <div className="relative flex grow flex-col min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Gradient orbs */}
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/30 to-purple-600/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-indigo-400/20 to-pink-600/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-cyan-400/10 to-blue-600/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '4s'}}></div>
        
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      </div>

      <div className="relative z-10 flex h-full grow flex-col">
        <Header />

        {/* Hero Section */}
        <div className="flex grow flex-col items-center justify-center px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            {/* Badge */}
            <div className="mb-8 inline-flex">
              <div className="inline-flex items-center rounded-full bg-gradient-to-r from-blue-600/10 to-purple-600/10 px-6 py-2 text-sm font-medium text-gray-700 ring-1 ring-blue-600/20 backdrop-blur-sm">
                <OptimaCoderLogo size="sm" className="mr-2" />
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-semibold">
                  Powered by Advanced AI Models
                </span>
                <div className="ml-2 flex h-2 w-2">
                  <div className="h-2 w-2 animate-ping rounded-full bg-green-400"></div>
                  <div className="absolute h-2 w-2 rounded-full bg-green-500"></div>
                </div>
              </div>
            </div>

            {/* Main Heading */}
            <h1 className="mb-6 text-5xl font-bold tracking-tight text-gray-900 lg:text-7xl">
              <span className="block">Transform your</span>
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                ideas into code
              </span>
              <span className="block">instantly</span>
            </h1>

            {/* Subtitle */}
            <p className="mx-auto mb-10 max-w-2xl text-lg leading-8 text-gray-600 lg:text-xl">
              Experience the future of development with our AI-powered code generation platform. 
              Create full-stack applications, scripts, and prototypes with natural language prompts.
            </p>

            {/* Stats */}
            <div className="mb-12 flex items-center justify-center space-x-8 text-sm text-gray-500">
              <div className="flex items-center space-x-2">
                <div className="h-2 w-2 rounded-full bg-green-500"></div>
                <span className="font-medium">1M+ Apps Generated</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                <span className="font-medium">50k+ Developers</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="h-2 w-2 rounded-full bg-purple-500"></div>
                <span className="font-medium">99.9% Uptime</span>
              </div>
            </div>

            {/* Main Form */}
            <form
              className="relative mx-auto max-w-4xl"
              action={async (formData) => {
                startTransition(async () => {
                  const { prompt, model, quality } = Object.fromEntries(formData);

                  assert.ok(typeof prompt === "string");
                  assert.ok(typeof model === "string");
                  assert.ok(quality === "high" || quality === "low");

                  const { chatId, lastMessageId } = await createChat(
                    prompt,
                    model,
                    quality,
                    screenshotUrl,
                  );

                  const streamPromise = fetch(
                    "/api/get-next-completion-stream-promise",
                    {
                      method: "POST",
                      body: JSON.stringify({ messageId: lastMessageId, model }),
                    },
                  ).then((res) => {
                    if (!res.body) {
                      throw new Error("No body on response");
                    }
                    return res.body;
                  });

                  startTransition(() => {
                    setStreamPromise(streamPromise);
                    router.push(`/chats/${chatId}`);
                  });
                });
              }}
            >
              <Fieldset>
                <div className="relative mx-auto max-w-3xl">
                  {/* Main input card */}
                  <div className="group relative overflow-hidden rounded-2xl bg-white/80 backdrop-blur-xl border border-gray-200/50 shadow-2xl transition-all duration-300 hover:shadow-3xl hover:border-blue-300/50">
                    {/* Gradient border effect */}
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-indigo-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
                    
                    <div className="w-full p-6">
                      {/* Screenshot section */}
                      {screenshotLoading && (
                        <div className="mb-4">
                          <div className="flex items-center space-x-3 p-4 bg-blue-50 rounded-xl border border-blue-200">
                            <div className="h-12 w-16 animate-pulse items-center justify-center rounded bg-blue-200 flex">
                              <Spinner />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-blue-900">Analyzing your image...</p>
                              <p className="text-xs text-blue-600">This will help generate more accurate code</p>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {screenshotUrl && (
                        <div className={`${isPending ? "opacity-50" : ""} mb-4`}>
                          <div className="relative inline-block">
                            <img
                              alt="screenshot"
                              src={screenshotUrl}
                              className="h-20 w-28 rounded-lg object-cover border-2 border-gray-200 shadow-md"
                            />
                            <button
                              type="button"
                              className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white shadow-lg hover:bg-red-600 transition-colors"
                              onClick={() => {
                                setScreenshotUrl(undefined);
                                if (fileInputRef.current) {
                                  fileInputRef.current.value = "";
                                }
                              }}
                            >
                              <XCircleIcon className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Text input */}
                      <div className="relative mb-6">
                        <div className="absolute inset-0 p-4 text-transparent pointer-events-none">
                          <p className="whitespace-pre-wrap break-words">
                            {textareaResizePrompt}
                          </p>
                        </div>
                        <textarea
                          placeholder="Describe the app you want to build... (e.g., 'Build a modern task management app with drag & drop functionality')"
                          required
                          name="prompt"
                          rows={1}
                          className="relative w-full resize-none border-0 bg-transparent p-4 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-0 text-lg"
                          value={prompt}
                          onChange={(e) => setPrompt(e.target.value)}
                          onKeyDown={(event) => {
                            if (event.key === "Enter" && !event.shiftKey) {
                              event.preventDefault();
                              const target = event.target;
                              if (!(target instanceof HTMLTextAreaElement)) return;
                              target.closest("form")?.requestSubmit();
                            }
                          }}
                        />
                      </div>

                      {/* Controls */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          {/* Model Selection */}
                          <Select.Root name="model" value={model} onValueChange={setModel}>
                            <Select.Trigger className="inline-flex items-center space-x-2 rounded-lg bg-gray-50 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors">
                              <span>{selectedModel?.label}</span>
                              <ChevronDownIcon className="h-4 w-4" />
                            </Select.Trigger>
                            <Select.Portal>
                              <Select.Content className="overflow-hidden rounded-xl bg-white shadow-2xl ring-1 ring-black/5 border border-gray-200">
                                <Select.Viewport className="p-2">
                                  {MODELS.map((m) => (
                                    <Select.Item
                                      key={m.value}
                                      value={m.value}
                                      className="flex cursor-pointer items-center rounded-lg p-3 text-sm data-[highlighted]:bg-blue-50 data-[highlighted]:outline-none transition-colors"
                                    >
                                      <Select.ItemText className="font-medium text-gray-900">
                                        {m.label}
                                      </Select.ItemText>
                                      <Select.ItemIndicator className="ml-auto">
                                        <CheckIcon className="h-4 w-4 text-blue-600" />
                                      </Select.ItemIndicator>
                                    </Select.Item>
                                  ))}
                                </Select.Viewport>
                              </Select.Content>
                            </Select.Portal>
                          </Select.Root>

                          {/* Quality Selection */}
                          <Select.Root name="quality" value={quality} onValueChange={setQuality}>
                            <Select.Trigger className="inline-flex items-center space-x-2 rounded-lg bg-gray-50 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors">
                              <LightningBoltIcon className="h-4 w-4" />
                              <span className="hidden sm:inline">
                                {quality === "low" ? "Fast" : "High Quality"}
                              </span>
                              <ChevronDownIcon className="h-4 w-4" />
                            </Select.Trigger>
                            <Select.Portal>
                              <Select.Content className="overflow-hidden rounded-xl bg-white shadow-2xl ring-1 ring-black/5 border border-gray-200">
                                <Select.Viewport className="p-2">
                                  {[
                                    { value: "low", label: "Fast Generation", desc: "Quick results" },
                                    { value: "high", label: "High Quality", desc: "Better code, takes longer" },
                                  ].map((q) => (
                                    <Select.Item
                                      key={q.value}
                                      value={q.value}
                                      className="flex cursor-pointer flex-col rounded-lg p-3 text-sm data-[highlighted]:bg-blue-50 data-[highlighted]:outline-none transition-colors"
                                    >
                                      <div className="flex items-center justify-between w-full">
                                        <Select.ItemText className="font-medium text-gray-900">
                                          {q.label}
                                        </Select.ItemText>
                                        <Select.ItemIndicator>
                                          <CheckIcon className="h-4 w-4 text-blue-600" />
                                        </Select.ItemIndicator>
                                      </div>
                                      <p className="text-xs text-gray-500 mt-1">{q.desc}</p>
                                    </Select.Item>
                                  ))}
                                </Select.Viewport>
                              </Select.Content>
                            </Select.Portal>
                          </Select.Root>

                          {/* File Upload */}
                          <label
                            htmlFor="screenshot"
                            className="flex cursor-pointer items-center space-x-2 rounded-lg bg-gray-50 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                          >
                            <UploadIcon className="h-4 w-4" />
                            <span className="hidden sm:inline">Upload Image</span>
                          </label>
                          <input
                            id="screenshot"
                            type="file"
                            accept="image/png, image/jpeg, image/webp"
                            onChange={handleScreenshotUpload}
                            className="hidden"
                            ref={fileInputRef}
                          />
                        </div>

                        {/* Submit Button */}
                        <div className="relative">
                          <LoadingButton
                            className="flex items-center space-x-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-3 font-semibold text-white shadow-lg hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50"
                            type="submit"
                          >
                            <span>Generate App</span>
                            <ArrowRightIcon className="h-4 w-4" />
                          </LoadingButton>
                        </div>
                      </div>

                      {/* Loading overlay */}
                      {isPending && (
                        <LoadingMessage
                          isHighQuality={quality === "high"}
                          screenshotUrl={screenshotUrl}
                        />
                      )}
                    </div>
                  </div>
                </div>

                {/* Example prompts */}
                <div className="mx-auto mt-8 max-w-4xl">
                  <p className="mb-4 text-center text-sm font-medium text-gray-600">
                    Try these examples:
                  </p>
                  <div className="flex flex-wrap justify-center gap-3">
                    {SUGGESTED_PROMPTS.map((v) => (
                      <button
                        key={v.title}
                        type="button"
                        onClick={() => setPrompt(v.description)}
                        className="rounded-lg bg-white/80 backdrop-blur-sm px-4 py-2 text-sm font-medium text-gray-700 shadow-md hover:bg-white hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 border border-gray-200/50 hover:border-blue-300/50"
                      >
                        {v.title}
                      </button>
                    ))}
                  </div>
                </div>
              </Fieldset>
            </form>
          </div>
        </div>

        {/* Features Section */}
        <div className="relative py-20">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                Why choose Optima Coder?
              </h2>
              <p className="mt-4 text-lg leading-8 text-gray-600">
                Advanced AI capabilities that understand your vision and deliver production-ready code.
              </p>
            </div>
            
            <div className="mx-auto mt-16 max-w-5xl">
              <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {[
                  {
                    icon: "⚡",
                    title: "Lightning Fast",
                    description: "Generate complete applications in seconds with our optimized AI models."
                  },
                  {
                    icon: "🎨",
                    title: "Beautiful Design",
                    description: "Every generated app comes with modern, responsive UI components."
                  },
                  {
                    icon: "🔧",
                    title: "Production Ready",
                    description: "Clean, maintainable code that follows best practices and industry standards."
                  },
                  {
                    icon: "🌐",
                    title: "Full Stack",
                    description: "Generate frontend, backend, and database schemas in one go."
                  },
                  {
                    icon: "📱",
                    title: "Multi-Platform",
                    description: "Create web apps, mobile interfaces, and desktop applications."
                  },
                  {
                    icon: "🚀",
                    title: "Deploy Anywhere",
                    description: "Export code that works with Vercel, Netlify, AWS, and more."
                  }
                ].map((feature, index) => (
                  <div
                    key={index}
                    className="group relative overflow-hidden rounded-2xl bg-white/50 backdrop-blur-sm p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200/50 hover:border-blue-300/50"
                  >
                    <div className="text-4xl mb-4">{feature.icon}</div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {feature.description}
                    </p>
                    
                    {/* Hover effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="relative border-t border-gray-200/50 bg-white/80 backdrop-blur-sm">
          <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
            <div className="flex flex-col items-center justify-between space-y-4 sm:flex-row sm:space-y-0">
              <div className="flex items-center space-x-3">
                <OptimaCoderLogo size="sm" />
                <div>
                  <p className="text-sm font-semibold text-gray-900">Optima Coder</p>
                  <p className="text-xs text-gray-500">AI-Powered Development Platform</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-6">
                <Link href="#" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                  Privacy
                </Link>
                <Link href="#" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                  Terms
                </Link>
                <Link href="#" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                  Support
                </Link>
                <a
                  href="https://github.com/your-repo/optimacoder"
                  target="_blank"
                  className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                  GitHub
                </a>
              </div>
            </div>
            
            <div className="mt-8 border-t border-gray-200/50 pt-8 text-center">
              <p className="text-xs text-gray-500">
                © 2025 Optima Coder. Built with cutting-edge AI technology.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

function LoadingMessage({
  isHighQuality,
  screenshotUrl,
}: {
  isHighQuality: boolean;
  screenshotUrl: string | undefined;
}) {
  return (
    <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-white/95 backdrop-blur-sm">
      <div className="flex flex-col items-center justify-center space-y-4 text-center">
        <div className="relative">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-6 w-6 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 animate-pulse"></div>
          </div>
        </div>
        
        <div className="space-y-2">
          <p className="text-lg font-semibold text-gray-900">
            {isHighQuality
              ? "Crafting your perfect app..."
              : screenshotUrl
                ? "Analyzing your design..."
                : "Generating your application..."}
          </p>
          <p className="text-sm text-gray-600 max-w-md">
            {isHighQuality
              ? "Creating a comprehensive solution with detailed planning. This may take up to 30 seconds."
              : screenshotUrl
                ? "Processing your image to understand the design requirements."
                : "Building your application with modern best practices."}
          </p>
        </div>
        
        {/* Progress indicators */}
        <div className="flex space-x-1">
          <div className="h-2 w-2 rounded-full bg-blue-600 animate-bounce"></div>
          <div className="h-2 w-2 rounded-full bg-purple-600 animate-bounce" style={{animationDelay: '0.1s'}}></div>
          <div className="h-2 w-2 rounded-full bg-indigo-600 animate-bounce" style={{animationDelay: '0.2s'}}></div>
        </div>
      </div>
    </div>
  );
}
