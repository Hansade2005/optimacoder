import Link from "next/link";
import OptimaCoderLogo from "@/components/optima-coder-logo";
import GithubIcon from "@/components/icons/github-icon";

export default function Header() {
  return (
    <header className="relative mx-auto flex w-full shrink-0 items-center justify-between py-6 px-6">
      {/* Logo and Brand */}
      <Link href="/" className="flex items-center space-x-3 group">
        <OptimaCoderLogo size="md" className="transition-transform group-hover:scale-105" />
        <div className="flex flex-col">
          <span className="text-xl font-bold bg-gradient-to-r from-slate-900 via-gray-800 to-slate-900 bg-clip-text text-transparent">
            Optima Coder
          </span>
          <span className="text-xs text-gray-500 font-medium tracking-wide">
            AI-Powered Development
          </span>
        </div>
      </Link>

      {/* Navigation */}
      <div className="hidden md:flex items-center space-x-8">
        <nav className="flex items-center space-x-6">
          <a href="#features" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">
            Features
          </a>
          <a href="#examples" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">
            Examples
          </a>
          <a href="#pricing" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">
            Pricing
          </a>
        </nav>
        
        <div className="w-px h-6 bg-gray-300"></div>
        
        <a
          href="https://github.com/Hansade2005/optimacoder"
          target="_blank"
          className="flex items-center space-x-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          <GithubIcon className="h-4 w-4" />
          <span className="font-medium">Star on GitHub</span>
        </a>
      </div>

      {/* Mobile menu button */}
      <button className="md:hidden p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
    </header>
  );
}
