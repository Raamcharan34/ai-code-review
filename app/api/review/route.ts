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

Your task is to perform a complete AI-powered code review of the code provided below.

CODE TO REVIEW:
${code}

Analyze the code carefully and return the review using EXACTLY this structure:

## Overall Assessment

Give a short summary of the overall quality of the code.

## Bugs & Errors

Identify:
- Syntax errors
- Logical errors
- Runtime errors
- Incorrect calculations
- Edge cases that can cause failures

If there are no major bugs, write:
"No major bugs found."

## Security Issues

Look for security vulnerabilities such as:
- SQL injection
- Command injection
- Cross-site scripting
- Hardcoded secrets
- Unsafe input handling
- Authentication or authorization problems
- Insecure file handling
- Other exploitable vulnerabilities

If there are no major security issues, write:
"No major security issues found."

For every security issue found, explain:
1. What the vulnerability is.
2. Why it is dangerous.
3. How to fix it.

## Performance

Identify inefficient algorithms, unnecessary operations, excessive loops, memory problems, or other performance concerns.

If there are no significant performance problems, say:
"No significant performance issues found."

## Code Quality

Review:
- Readability
- Naming
- Structure
- Maintainability
- Duplication
- Error handling
- Best practices

## Suggested Improvements

Give practical improvements that would make the code more reliable, secure, readable, and efficient.

## Improved Code

IMPORTANT:
If the original code contains ANY real bug, security vulnerability, performance problem, or meaningful code-quality problem, provide a COMPLETE corrected version of the code.

The improved code MUST:

- Fix all identified bugs.
- Fix identified security vulnerabilities.
- Apply important performance improvements.
- Improve code quality where appropriate.
- Preserve the original intended functionality.
- Include all required imports.
- Include the COMPLETE code.
- Be directly usable by the developer.
- Never use placeholders such as "rest of code here".
- Never omit important sections of the original program.

Put the corrected code inside an appropriate Markdown code block.

If the original code is already correct and does not require meaningful changes, write:

"No changes required."

## Explanation of Changes

After the improved code, briefly explain the important changes you made and why they were necessary.

IMPORTANT RULES:

- Be accurate.
- Do not invent bugs or vulnerabilities.
- Do not claim something is insecure without explaining why.
- Do not rewrite working code unnecessarily.
- When a real problem exists, provide the complete corrected code.
- Keep explanations understandable for a student developer.
`;

    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.2,
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