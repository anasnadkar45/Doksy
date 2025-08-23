import LoginForm from "@/components/auth/LoginForm"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Link from "next/link"

export default function HomePage() {

  return (
    <div className="min-h-screen ">
      <div className="w-full h-10 border-b bg-card">
        <LoginForm />
      </div>
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold   mb-6">
            Transform Your README into
            <span className="text-blue-600 dark:text-blue-400"> Beautiful Documentation</span>
          </h1>
          <p className="text-xl  mb-8 leading-relaxed">
            Connect your GitHub repository and automatically convert your README file into a professional, multi-page
            documentation website with an intuitive editor.
          </p>
          <div className="flex gap-4 justify-center">
            <Button asChild size="lg" className="px-8">
              <Link href="/login">Get Started</Link>
            </Button>
            <Button variant="outline" size="lg" className="px-8 bg-transparent">
              View Demo
            </Button>
          </div>
        </div>

        <div className="mt-16 grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <Card className="text-center p-6 bg-violet-600 rounded-lg shadow-sm">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-6 h-6 text-blue-600 dark:text-blue-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold   mb-2">Auto-Parse README</h3>
            <p className="">
              Automatically convert your README sections into organized documentation pages
            </p>
          </Card>

          <Card className="text-center p-6 bg-emerald-600 rounded-lg shadow-sm">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-6 h-6 text-green-600 dark:text-green-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold   mb-2">Rich Text Editor</h3>
            <p className="">
              Edit your documentation with a powerful WYSIWYG editor powered by TipTap
            </p>
          </Card>

          <Card className="text-center p-6 bg-rose-600 rounded-lg shadow-sm">
            <div className="w-12 h-12  rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-6 h-6 "
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold   mb-2">Publish & Share</h3>
            <p className="">
              Publish your documentation and share it with the world with a beautiful URL
            </p>
          </Card>
        </div>
      </div>
    </div>
  )
}
