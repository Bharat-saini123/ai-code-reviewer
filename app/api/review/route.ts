import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { code, language } = await req.json();

    if (!code?.trim()) {
      return NextResponse.json({ error: "Code is required" }, { status: 400 });
    }

    const prompt = `You are an expert code reviewer. Analyze the following ${language} code and provide a detailed review.

Return ONLY a valid JSON object (no markdown, no explanation outside JSON) with this exact structure:
{
  "score": <number 0-100>,
  "summary": "<2-3 sentence overall assessment>",
  "issues": [
    {
      "type": "bug" | "security" | "performance" | "style" | "improvement",
      "severity": "critical" | "warning" | "info",
      "title": "<short title>",
      "description": "<detailed explanation>",
      "line": "<line number or range if identifiable, else null>",
      "fix": "<suggested fix or improved code snippet>"
    }
  ],
  "positives": ["<thing done well>"],
  "bestPractices": ["<suggestion>"]
}

Code to review:
\`\`\`${language}
${code}
\`\`\``;

    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [
            {
              role: "user",
              content: prompt,
            },
          ],
          temperature: 0.3,
          max_tokens: 2000,
        }),
      },
    );

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err?.error?.message || "Groq API error");
    }

    const data = await response.json();
    const raw = data?.choices?.[0]?.message?.content || "";
    const cleaned = raw.replace(/```json|```/g, "").trim();
    const result = JSON.parse(cleaned);

    return NextResponse.json(result);
  } catch (err: unknown) {
    console.error(err);
    if (err instanceof SyntaxError) {
      return NextResponse.json(
        { error: "Failed to parse AI response" },
        { status: 500 },
      );
    }
    return NextResponse.json(
      {
        error:
          err instanceof Error
            ? err.message
            : "Review failed. Check your Groq API key.",
      },
      { status: 500 },
    );
  }
}
