import { NextResponse } from "next/server";
import {
  sendOrderConfirmationNotification,
  sendStatusUpdateNotification,
} from "@/lib/notifications";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { type, payload } = body;

    if (type === "order_confirmation") {
      const result = await sendOrderConfirmationNotification(payload);
      return NextResponse.json(result);
    }

    if (type === "status_update") {
      const result = await sendStatusUpdateNotification(payload);
      return NextResponse.json(result);
    }

    return NextResponse.json({ error: "Invalid notification type" }, { status: 400 });
  } catch (error: any) {
    console.error("Notification API Error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to process notification" },
      { status: 500 }
    );
  }
}
