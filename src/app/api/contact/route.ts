// /api/contact/route.ts
import { EMAIL, RESEND_API_KEY } from "@/backend/lib/config";
import { Resend } from "resend";
import { NextRequest, NextResponse } from "next/server";

const resend = new Resend(RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const { name, email, subject, message } = await req.json();

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { success: false, message: "All fields are required." },
        { status: 400 }
      );
    }

    const { data, error } = await resend.emails.send({
      from: "Curated Crate <onboarding@resend.dev>",
      to: EMAIL,
      subject: `New Contact Form Submission: ${subject}`,
      html: `
        <h1>New Message from Curated Crate Contact Form</h1>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, "<br>")}</p>
      `,
    });

    if (error) {
      console.error("Error sending email:", error);
      return NextResponse.json(
        { success: false, message: "Error sending message." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Message sent successfully! We'll be in touch soon.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json(
      { success: false, message: "An error occurred." },
      { status: 500 }
    );
  }
}
