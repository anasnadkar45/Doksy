import Link from "next/link"

export default function Footer() {
  return (
    <footer className="relative bg-[#F0F0F0] border-t border-dashed dark:border-[#d0d0d0] py-12 px-6 overflow-hidden">
      {/* Decorative doodles */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Squiggly line top left */}
        <svg className="absolute top-4 left-8 w-16 h-12 text-muted-foreground/20" viewBox="0 0 64 48" fill="none">
          <path
            d="M8 24C16 16 24 32 32 24C40 16 48 32 56 24"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>

        {/* Circle doodle top right */}
        <svg className="absolute top-6 right-12 w-12 h-12 text-muted-foreground/15" viewBox="0 0 48 48" fill="none">
          <circle cx="24" cy="24" r="16" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" />
          <circle cx="24" cy="24" r="8" stroke="currentColor" strokeWidth="1.5" />
        </svg>

        {/* Star doodle bottom left */}
        <svg className="absolute bottom-8 left-16 w-8 h-8 text-muted-foreground/25" viewBox="0 0 32 32" fill="none">
          <path
            d="M16 4L18 12L26 10L20 16L28 18L20 20L26 26L18 20L16 28L14 20L6 26L12 20L4 18L12 16L6 10L14 12L16 4Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
        </svg>

        {/* Arrow doodle bottom right */}
        <svg className="absolute bottom-6 right-8 w-14 h-10 text-muted-foreground/20" viewBox="0 0 56 40" fill="none">
          <path
            d="M8 20C16 12 24 28 32 20C40 12 48 20 48 20M44 16L48 20L44 24"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>

        {/* Zigzag pattern center */}
        <svg
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-6 text-muted-foreground/10"
          viewBox="0 0 80 24"
          fill="none"
        >
          <path
            d="M4 12L12 4L20 12L28 4L36 12L44 4L52 12L60 4L68 12L76 4"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      <div className="relative max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Left side - Built by */}
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">Built by</span>
            <Link
              href="https://x.com/NadkarAnas45"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-foreground hover:text-primary transition-colors group"
            >
              <span className="font-medium text-[#333333]">Anas Nadkar</span>
              <svg
                className="w-4 h-4 group-hover:scale-110 transition-transform"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </Link>
          </div>

          {/* Right side - Copyright */}
          <div className="text-sm text-muted-foreground">© 2025 Doksy. All rights reserved.</div>
        </div>
      </div>
    </footer>
  )
}
