// MDX Component Whitelist
// Only components exported from this file may be used in MDX content bodies.
// New components require human approval before being added.
// Agents cannot reference components not listed here — compilation will fail.

import type { MDXComponents } from "mdx/types";

// Standard HTML element overrides — styled to match blog typography
// Classes mirror the .blog-content styles defined in globals.css
export const mdxComponents: MDXComponents = {
  // Headings
  h1: ({ children }) => (
    <h1 className="text-3xl font-bold text-hemp-green mt-10 mb-4">{children}</h1>
  ),
  h2: ({ children }) => (
    <h2 className="text-2xl font-bold text-hemp-green mt-10 mb-3 pb-2 border-b border-gray-200">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="text-xl font-semibold text-hemp-green mt-6 mb-2">{children}</h3>
  ),

  // Body
  p: ({ children }) => <p className="mb-6 leading-relaxed">{children}</p>,
  strong: ({ children }) => <strong className="font-bold text-gray-900">{children}</strong>,
  em: ({ children }) => <em className="italic">{children}</em>,

  // Lists
  ul: ({ children }) => <ul className="list-disc pl-6 mb-6 space-y-2">{children}</ul>,
  ol: ({ children }) => <ol className="list-decimal pl-6 mb-6 space-y-2">{children}</ol>,
  li: ({ children }) => <li className="text-gray-700">{children}</li>,

  // Links
  a: ({ href, children }) => (
    <a
      href={href}
      className="text-hemp-green underline hover:text-hemp-green/70 transition-colors"
      target={href?.startsWith("http") ? "_blank" : undefined}
      rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
    >
      {children}
    </a>
  ),

  // Block elements
  blockquote: ({ children }) => (
    <blockquote className="border-l-4 border-hemp-green bg-white pl-6 py-4 my-6 italic text-gray-600 rounded-r-lg">
      {children}
    </blockquote>
  ),
  hr: () => <hr className="my-8 border-gray-300" />,
  img: ({ src, alt }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt || ""} className="rounded-xl my-6 shadow-md" />
  ),

  // Custom iHemp components whitelist — empty until Phase 2 advocacy components are approved
  // Example future entry:
  // HempBanExplainer: HempBanExplainer,
};
