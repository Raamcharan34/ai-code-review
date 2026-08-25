import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { code } = await request.json();

    if (!code || !code.trim()) {
      return Response.json(
        { error: "Please provide code to review." },
        { status: 400 }
      );
    }

    const prompt = `
You are an expert software engineer, security reviewer, and code optimization specialist.

You are reviewing code for a developer.

Your job is to:
1. Find real bugs and errors.
2. Find real security vulnerabilities.
3. Find meaningful performance problems.
4. Review code quality.
5. Suggest practical improvements.
6. Provide a corrected version ONLY when meaningful changes are required.

VERY IMPORTANT RULE:

DO NOT OVER-ENGINEER THE SOLUTION.

The improved code must remain as close as reasonably possible to the original code.

If the input is a small code snippet, the improved code MUST also be a small code snippet.

DO NOT turn a small example into a complete application.

DO NOT introduce:
- new frameworks
- unnecessary libraries
- databases
- authentication systems
- configuration systems
- production infrastructure
- unnecessary classes
- unnecessary architecture
- unrelated functionality

unless they already exist in the original code or are absolutely required to fix the identified problem.

Only make changes necessary to fix the actual problems.

STRICT MINIMAL FIX RULE:

When fixing a small code snippet, make the smallest possible change that directly fixes the identified problem.

Do NOT create a completely new implementation when a small correction is sufficient.

Do NOT introduce infrastructure, dependencies, or functionality that was not present in the original code.

Do NOT assume that a database, framework, API, authentication system, configuration system, or external service exists unless it is already present in the original code.

If the original code does not contain a database connection, DO NOT create a database connection just to demonstrate a database-related fix.

If the original code only demonstrates query construction, keep the correction at the same level of abstraction.

For small snippets:
- Prefer changing only the necessary lines.
- Keep the improved code close to the original line count.
- Do not add unnecessary imports.
- Do not add unnecessary libraries.
- Do not add classes or architecture.
- Do not add production infrastructure.
- Do not add unrelated functionality.
- Do not add explanatory comments to the improved code.

The improved code should normally remain similar in size and complexity to the original.

For example, if the original code has 15 lines and only needs a small bug fix, the improved version should normally remain around the same size.

PRESERVE:
- the original programming language
- the original functionality
- the original structure where possible
- the original variables and functions where practical
- the original level of abstraction

Do NOT rewrite working code unnecessarily.

DO NOT invent missing requirements.

If the original code does not provide enough context for a complete implementation of a particular fix, make the safest minimal correction possible without inventing infrastructure.

IMPORTANT:

The Improved Code is not a place to demonstrate a completely different architecture.

It is a corrected version of the user's original code.

CODE TO REVIEW:
${code}

Return your answer using EXACTLY these sections and NOTHING ELSE:

## Overall Assessment

Give a concise assessment in 2-4 sentences.

## Bugs & Errors

List only real bugs, logical errors, runtime errors, syntax errors, or meaningful edge cases.

If none exist, write exactly:

No major bugs found.

## Security Issues

List only real security vulnerabilities or unsafe practices.

For each important security issue, briefly explain:
- What it is
- Why it matters
- How to fix it

If none exist, write exactly:

No major security issues found.

## Performance

Mention only meaningful performance concerns.

If there are none, write exactly:

No significant performance issues found.

## Code Quality

Briefly review:
- readability
- naming
- structure
- maintainability
- error handling
- best practices

Keep this concise.

## Suggested Improvements

Give a short list of practical improvements.

## Improved Code

CRITICAL RULES FOR THIS SECTION:

This section must contain ONLY the corrected code.

DO NOT write:
- explanations
- analysis
- "Identify Issues"
- "Draft Review"
- "Explanation of Changes"
- "Here is the corrected code"
- "Let's refine"
- "The corrected version is"
- discussion before the code
- discussion after the code
- Markdown headings inside the code
- review-related comments inside the code
- comments explaining why a vulnerability exists
- comments explaining how the review was performed

Put ONLY the corrected code inside ONE appropriate Markdown code block.

The code block must contain code only.

The Improved Code must look like code that can be copied directly into a code editor.

DO NOT include explanatory comments such as:
- "# In a real application..."
- "# Example..."
- "# This fixes..."
- "# To prevent SQL injection..."
- "# Using a placeholder..."
- "# For demonstration purposes..."

The corrected code must:
- preserve the original functionality
- fix the actual problems found
- use the same language as the original
- remain similar in size and complexity to the original
- avoid unnecessary dependencies
- avoid unnecessary architecture
- avoid rewriting working portions
- never use placeholders such as "rest of code here"
- not introduce undefined variables
- not introduce undefined functions
- not introduce undefined classes
- not introduce unavailable libraries
- not introduce unnecessary external dependencies

SMALL CODE RULE:

If the original code is small, the corrected code must also be small.

Do not expand a small snippet into a production-level implementation.

A small correction should normally require only a few changed lines.

IMPROVED CODE VALIDATION:

Before returning the Improved Code, perform a final self-check.

Verify that:
- the code has valid syntax
- all variables used are defined
- all functions used are defined or properly imported
- all required imports are present
- no undefined libraries or modules are introduced
- no undefined classes or APIs are introduced
- no unnecessary dependencies are introduced
- function calls match the functions that are defined
- variable names are consistent
- the corrected code does not create a new obvious runtime error
- the corrected code does not introduce a new syntax error
- the corrected code preserves the original execution flow where possible
- the corrected code remains consistent with the original language and context

NEVER return an improved version that fixes one problem but introduces another obvious syntax, runtime, dependency, or undefined-reference error.

If you cannot safely implement a larger change because required context is missing, prefer a smaller valid correction rather than inventing missing infrastructure.

If no meaningful correction is required, write exactly:

No changes required.

## Explanation of Changes

Give a SHORT explanation of the important changes.

IMPORTANT:
This section comes AFTER the Improved Code section.

Never put the explanation inside the Improved Code section.

FINAL QUALITY RULES:

- Be accurate.
- Do not invent bugs.
- Do not invent vulnerabilities.
- Do not overstate minor style issues.
- Do not rewrite correct code unnecessarily.
- Prefer the smallest practical fix.
- Small input = small output.
- Large input = complete corrected version of similar scope.
- Never turn a simple code example into a production system.
- Never introduce a new error while fixing an existing error.
- Never invent infrastructure that is not present in the original code.
- The Improved Code must be internally consistent and reasonably runnable as provided.
`;

    const response = await groq.chat.completions.create({
      model: "qwen/qwen3.6-27b",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.1,
      max_tokens: 6000,
      reasoning_effort: "none",
    });

    const result = response.choices[0]?.message?.content;

    return Response.json({
      result: result || "No review was generated.",
    });
  } catch (error: unknown) {
    console.error("Code review error:", error);

    return Response.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to review the code.",
      },
      { status: 500 }
    );
  }
}