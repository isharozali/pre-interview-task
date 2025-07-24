"use server";

import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

/**
 * Type for the result of the addClientAndSendEmail action.
 */
export interface AddClientResult {
  error?: string;
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ""
);

const resend = new Resend(process.env.RESEND_API_KEY ?? "");

/**
 * Adds a client to Supabase and sends a welcome email via Resend.
 * @param name - Client's name
 * @param email - Client's email
 * @param businessName - Client's business name
 * @returns An object with an optional error property
 */
export async function addClientAndSendEmail(
  name: string,
  email: string,
  businessName: string
): Promise<AddClientResult> {
  // Add to Supabase

  const { error: dbError } = await supabase
    .from("clients")
    .insert([{ name, email, business_name: businessName }]);
  if (dbError) return { error: dbError.message };

  // Send email
  try {
    const response = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL ?? "",
      to: [email],
      subject: "Welcome to Our Accountancy Firm!",
      html: `<p>Hello ${name},</p><p>Welcome to our accountancy firm. We're excited to work with your business, ${businessName}!</p>`,
    });
    console.log("Resend response:", response);
  } catch (e: unknown) {
    if (e && typeof e === "object" && "response" in e && e.response && typeof e.response === "object" && "data" in e.response) {
      // e.response.data is not typed, but we log it if present
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      console.error("Error sending email:", (e.response as { data?: unknown })?.data);
    } else if (e instanceof Error) {
      console.error("Error sending email:", e.message);
    } else {
      console.error("Error sending email:", e);
    }
  }

  return {};
}
