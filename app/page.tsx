"use client";

import { useState } from "react";

export default function Home() {
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("Python");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [reviewed, setReviewed] = useState(false);
  const [error, setError] = useState("");

  const reviewCode = async () => {
    if (!code.trim()) {
      setError("Please enter some code to review.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/review", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to review code.");
      }

      setResult(data.result || "");
      setReviewed(true);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while reviewing the code."
      );
    } finally {
      setLoading(false);
    }
  };

  // Extract individual sections from the AI response
  const getSection = (title: string) => {
    if (!result) return "";

    const escapedTitle = title.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    const regex = new RegExp(
      `##\\s*${escapedTitle}\\s*([\\s\\S]*?)(?=\\n##\\s|$)`,
      "i"
    );

    const match = result.match(regex);

    return match ? match[1].trim() : "";
  };

  const bugsSection = getSection("Bugs & Errors");
  const securitySection = getSection("Security Issues");
  const performanceSection = getSection("Performance");
  const qualitySection = getSection("Code Quality");
  const improvementsSection = getSection("Suggested Improvements");
  const improvedCodeSection = getSection("Improved Code");

  // Check whether AI actually found a problem
  const hasBugs =
    bugsSection &&
    !/no (major )?(bugs|errors)|no major issues found|no issues found/i.test(
      bugsSection
    );

  const hasSecurityIssues =
    securitySection &&
    !/no (major )?security issues found|no security issues|none found/i.test(
      securitySection
    );

  const formatSection = (text: string) => {
    if (!text) {
      return "No information was provided.";
    }

    return text;
  };

  return (
    <main className="min-h-screen bg-[#08080a] text-white">
      {/* HEADER */}
      <header className="border-b border-white/10">
        <div className="mx-auto flex max-w-[1200px] items-center justify-between px-6 py-5">
          <div className="flex items-center gap-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-purple-500/40 bg-purple-500/10 text-xl">
              ◇
            </div>

            <div>
              <h1 className="text-lg font-semibold">Code Review AI</h1>
              <p className="text-sm text-gray-500">
                Intelligent Code Analysis
              </p>
            </div>
          </div>

          <div className="rounded-lg border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-gray-400">
            <span className="mr-2 text-green-400">●</span>
            AI ENGINE ONLINE
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="mx-auto max-w-[1200px] px-6 pb-12 pt-14">
        <div className="mb-6 inline-flex rounded-full border border-purple-500/40 bg-purple-500/10 px-4 py-2 text-sm text-purple-300">
          ✦ AI Powered Developer Tool
        </div>

        <div className="flex flex-col justify-between gap-6 md:flex-row">
          <div>
            <h2 className="text-5xl font-bold tracking-tight md:text-6xl">
              Review code.{" "}
              <span className="bg-gradient-to-r from-purple-400 to-fuchsia-500 bg-clip-text text-transparent">
                Find problems.
              </span>
            </h2>

            <p className="mt-5 max-w-3xl text-lg leading-8 text-gray-400">
              Analyze your code with AI to detect bugs, security
              vulnerabilities, performance issues and improvement
              opportunities.
            </p>
          </div>

          <div className="pt-4 text-sm text-gray-500">
            Powered by{" "}
            <span className="font-semibold text-purple-400">Groq AI</span>
          </div>
        </div>

        {/* MAIN REVIEW AREA */}
        <div className="mt-10 grid gap-5 lg:grid-cols-2">
          {/* CODE EDITOR */}
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#101014]">
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
              <div className="flex items-center gap-3">
                <div className="flex gap-2">
                  <span className="h-3 w-3 rounded-full bg-red-500" />
                  <span className="h-3 w-3 rounded-full bg-yellow-500" />
                  <span className="h-3 w-3 rounded-full bg-green-500" />
                </div>

                <span className="text-sm text-gray-400">
                  code-input.py
                </span>
              </div>

              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="bg-transparent text-sm text-gray-400 outline-none"
              >
                <option className="bg-[#101014]">Python</option>
                <option className="bg-[#101014]">JavaScript</option>
                <option className="bg-[#101014]">TypeScript</option>
                <option className="bg-[#101014]">Java</option>
                <option className="bg-[#101014]">C++</option>
              </select>
            </div>

            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              spellCheck={false}
              placeholder="Paste your code here..."
              className="min-h-[480px] w-full resize-none bg-[#0c0c0f] p-6 font-mono text-sm leading-7 text-gray-200 outline-none"
            />

            <div className="flex items-center justify-between border-t border-white/10 px-5 py-4">
              <span className="text-sm text-gray-500">
                {language} • {code.length} characters
              </span>

              <button
                onClick={reviewCode}
                disabled={loading}
                className="rounded-xl bg-purple-600 px-7 py-3 font-semibold transition hover:bg-purple-500 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? "Analyzing..." : "✦ Review Code"}
              </button>
            </div>
          </div>

          {/* AI SUMMARY */}
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#101014]">
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
              <div>
                <h3 className="font-semibold">✦ AI Analysis</h3>
                <p className="text-sm text-gray-500">
                  Automated code review
                </p>
              </div>

              {reviewed && (
                <span className="rounded-full border border-green-500/30 bg-green-500/10 px-3 py-1 text-xs text-green-400">
                  Analysis Complete
                </span>
              )}
            </div>

            {reviewed ? (
              <div className="p-5">
                {/* DYNAMIC SUMMARY CARDS */}
                <div className="grid grid-cols-3 gap-3">
                  <div
                    className={`rounded-xl border p-4 ${
                      hasBugs
                        ? "border-orange-500/30 bg-orange-500/10"
                        : "border-green-500/30 bg-green-500/10"
                    }`}
                  >
                    <p className="text-xs text-gray-400">Bugs</p>

                    <p
                      className={`mt-2 font-semibold ${
                        hasBugs ? "text-orange-400" : "text-green-400"
                      }`}
                    >
                      {hasBugs ? "Issues Found" : "No Issues"}
                    </p>
                  </div>

                  <div
                    className={`rounded-xl border p-4 ${
                      hasSecurityIssues
                        ? "border-red-500/30 bg-red-500/10"
                        : "border-green-500/30 bg-green-500/10"
                    }`}
                  >
                    <p className="text-xs text-gray-400">Security</p>

                    <p
                      className={`mt-2 font-semibold ${
                        hasSecurityIssues
                          ? "text-red-400"
                          : "text-green-400"
                      }`}
                    >
                      {hasSecurityIssues ? "Issues Found" : "No Issues"}
                    </p>
                  </div>

                  <div className="rounded-xl border border-purple-500/30 bg-purple-500/10 p-4">
                    <p className="text-xs text-gray-400">AI Review</p>

                    <p className="mt-2 font-semibold text-purple-400">
                      Complete
                    </p>
                  </div>
                </div>

                {/* OVERALL ASSESSMENT */}
                <div className="mt-5 rounded-xl border border-white/10 bg-[#0c0c0f] p-5">
                  <h4 className="mb-3 font-semibold text-purple-300">
                    Overall Assessment
                  </h4>

                  <p className="whitespace-pre-wrap text-sm leading-7 text-gray-300">
                    {formatSection(getSection("Overall Assessment"))}
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex min-h-[520px] flex-col items-center justify-center px-8 text-center">
                <div className="text-6xl">◇</div>

                <h3 className="mt-6 text-2xl font-semibold">
                  Ready for Review
                </h3>

                <p className="mt-4 max-w-lg leading-7 text-gray-500">
                  Paste your code into the editor and run an AI-powered review
                  to identify bugs, security risks and performance
                  improvements.
                </p>

                <div className="mt-7 flex gap-3">
                  <span className="rounded-lg border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-gray-400">
                    🐛 Bug Detection
                  </span>

                  <span className="rounded-lg border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-gray-400">
                    🔐 Security
                  </span>

                  <span className="rounded-lg border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-gray-400">
                    ⚡ Performance
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {error && (
          <div className="mt-5 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400">
            {error}
          </div>
        )}

        {/* DETAILED ANALYSIS */}
        {reviewed && result && (
          <section className="mt-16">
            <div className="mb-7">
              <p className="text-sm font-medium text-purple-400">
                AI CODE REVIEW
              </p>

              <h2 className="mt-2 text-3xl font-bold">
                Detailed Analysis
              </h2>

              <p className="mt-2 text-gray-500">
                A complete breakdown of the issues and improvements found in
                your code.
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              {/* BUGS */}
              <AnalysisCard
                icon="🐛"
                title="Bugs & Errors"
                subtitle="Logical, syntax and runtime problems"
                content={bugsSection}
                emptyText="No major bugs found."
              />

              {/* SECURITY */}
              <AnalysisCard
                icon="🔐"
                title="Security Issues"
                subtitle="Security vulnerabilities and unsafe practices"
                content={securitySection}
                emptyText="No major security issues found."
              />

              {/* PERFORMANCE */}
              <AnalysisCard
                icon="⚡"
                title="Performance"
                subtitle="Efficiency and optimization opportunities"
                content={performanceSection}
                emptyText="No significant performance issues found."
              />

              {/* CODE QUALITY */}
              <AnalysisCard
                icon="📊"
                title="Code Quality"
                subtitle="Readability, structure and maintainability"
                content={qualitySection}
                emptyText="No code quality issues found."
              />
            </div>

            {/* SUGGESTED IMPROVEMENTS */}
            <div className="mt-5 rounded-2xl border border-white/10 bg-[#101014]">
              <div className="border-b border-white/10 p-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-purple-500/30 bg-purple-500/10 text-xl">
                    💡
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold">
                      Suggested Improvements
                    </h3>

                    <p className="text-sm text-gray-500">
                      Practical recommendations for your code
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <p className="whitespace-pre-wrap text-sm leading-8 text-gray-300">
                  {formatSection(improvementsSection)}
                </p>
              </div>
            </div>

            {/* IMPROVED CODE */}
            {improvedCodeSection && (
              <div className="mt-5 overflow-hidden rounded-2xl border border-purple-500/30 bg-[#101014]">
                <div className="flex items-center justify-between border-b border-white/10 p-6">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-purple-500/30 bg-purple-500/10 text-xl">
                      ✨
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold">
                        Improved Code
                      </h3>

                      <p className="text-sm text-gray-500">
                        AI-generated corrected version
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(
                        cleanCode(improvedCodeSection)
                      );
                    }}
                    className="rounded-lg border border-white/10 px-4 py-2 text-sm text-gray-300 transition hover:bg-white/5"
                  >
                    Copy Code
                  </button>
                </div>

                <pre className="overflow-x-auto bg-[#08080a] p-6 text-sm leading-7 text-gray-200">
                  <code>{cleanCode(improvedCodeSection)}</code>
                </pre>
              </div>
            )}
          </section>
        )}
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/10 py-8">
        <div className="mx-auto flex max-w-[1200px] justify-between px-6 text-sm text-gray-600">
          <span>Code Review AI • Analyze • Improve • Secure</span>
          <span>Built with Next.js + Groq AI</span>
        </div>
      </footer>
    </main>
  );
}

function AnalysisCard({
  icon,
  title,
  subtitle,
  content,
  emptyText,
}: {
  icon: string;
  title: string;
  subtitle: string;
  content: string;
  emptyText: string;
}) {
  const isEmpty =
    !content ||
    new RegExp(
      `^\\s*(no .*${emptyText
        .replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
        .replace(/no .*?found/i, ".*")}.*|none found)`,
      "i"
    ).test(content);

  return (
    <div className="rounded-2xl border border-white/10 bg-[#101014]">
      <div className="border-b border-white/10 p-6">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-purple-500/30 bg-purple-500/10 text-xl">
            {icon}
          </div>

          <div>
            <h3 className="text-xl font-semibold">{title}</h3>

            <p className="text-sm text-gray-500">{subtitle}</p>
          </div>
        </div>
      </div>

      <div className="p-6">
        {isEmpty ? (
          <p className="text-sm leading-7 text-green-400">{emptyText}</p>
        ) : (
          <p className="whitespace-pre-wrap text-sm leading-7 text-gray-300">
            {content}
          </p>
        )}
      </div>
    </div>
  );
}

function cleanCode(text: string) {
  return text
    .replace(/^```[a-zA-Z0-9+#.-]*\s*/i, "")
    .replace(/```$/i, "")
    .trim();
}