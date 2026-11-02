
import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-server-admin";

export const runtime = "nodejs";

const allowedServices = [
  "Website Design and Development",
  "Custom Software Development",
  "Education Technology",
  "Business Digital Solutions",
  "Graphics and Digital Content",
  "IT Consulting",
  "Other",
];

const allowedBudgets = [
  "",
  "Below ₦100,000",
  "₦100,000 - ₦500,000",
  "₦500,000 - ₦1,000,000",
  "Above ₦1,000,000",
  "Not yet decided",
];

function cleanText(value: unknown, maxLength: number): string {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, maxLength);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const full_name = cleanText(body.full_name, 120);
    const email = cleanText(body.email, 254).toLowerCase();
    const phone = cleanText(body.phone, 30);
    const company = cleanText(body.company, 150);
    const service = cleanText(body.service, 100);
    const budget = cleanText(body.budget, 50);
    const description = cleanText(body.description, 5000);

    if (
      !full_name ||
      !email ||
      !phone ||
      !service ||
      !description
    ) {
      return NextResponse.json(
        { error: "Please complete all required fields." },
        { status: 400 }
      );
    }

    if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    ) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    if (phone.length < 7) {
      return NextResponse.json(
        { error: "Please enter a valid phone number." },
        { status: 400 }
      );
    }

    if (description.length < 10) {
      return NextResponse.json(
        { error: "Please provide more details about your project." },
        { status: 400 }
      );
    }

    if (!allowedServices.includes(service)) {
      return NextResponse.json(
        { error: "Please select a valid service." },
        { status: 400 }
      );
    }

    if (!allowedBudgets.includes(budget)) {
      return NextResponse.json(
        { error: "Please select a valid budget option." },
        { status: 400 }
      );
    }

    const { error } = await supabaseAdmin
      .from("project_enquiries")
      .insert({
        full_name,
        email,
        phone,
        company: company || null,
        service,
        budget: budget || null,
        description,
      });

    if (error) {
      console.error("Enquiry database error:", error);

      return NextResponse.json(
        { error: "We could not save your enquiry. Please try again later." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Your project enquiry has been submitted successfully. We will contact you soon.",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Enquiry submission error:", error);

    return NextResponse.json(
      { error: "Unable to process your enquiry. Please try again." },
      { status: 500 }
    );
  }
      }
