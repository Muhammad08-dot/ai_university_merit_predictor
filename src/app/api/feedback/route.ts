import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import fs from "fs/promises";
import path from "path";
import { checkRateLimit } from "@/lib/rate-limit";

const FeedbackSchema = z.object({
  rating: z.number().min(1).max(10),
  feedback: z.string().max(2000).optional(),
});

export async function GET() {
  const filePath = path.join(process.cwd(), "data", "feedbacks.json");
  try {
    const fileData = await fs.readFile(filePath, "utf-8");
    const feedbacks = JSON.parse(fileData);
    // Sort so newest are first
    return NextResponse.json({ feedbacks: feedbacks.reverse() });
  } catch (e) {
    return NextResponse.json({ feedbacks: [] });
  }
}

export async function POST(request: NextRequest) {
  try {
    const rateLimit = checkRateLimit(request, 5, 60000); // 5 requests per minute
    if (!rateLimit.success) {
      return NextResponse.json(
        { error: "Too many feedback requests. Please wait." },
        { status: 429 }
      );
    }
    const body = await request.json();
    const data = FeedbackSchema.parse(body);

    const newFeedback = {
      id: crypto.randomUUID(),
      rating: data.rating,
      feedbackText: data.feedback || "",
      createdAt: new Date().toISOString()
    };

    const filePath = path.join(process.cwd(), "data", "feedbacks.json");
    
    // Ensure directory exists
    await fs.mkdir(path.join(process.cwd(), "data")).catch(() => {});
    
    let feedbacks = [];
    try {
      const fileData = await fs.readFile(filePath, "utf-8");
      feedbacks = JSON.parse(fileData);
    } catch (e) {
      // File doesn't exist yet, which is fine
    }

    feedbacks.push(newFeedback);
    await fs.writeFile(filePath, JSON.stringify(feedbacks, null, 2));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Feedback submission error:", error);
    return NextResponse.json(
      { error: "Failed to submit feedback" },
      { status: 500 }
    );
  }
}
