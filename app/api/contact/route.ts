
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { name, message } = await request.json();

    if (
      typeof name !== "string" ||
      typeof message !== "string" ||
      !name.trim() ||
      !message.trim() ||
      name.length > 100 ||
      message.length > 5000
    ) {
      return Response.json(
        { error: "Please enter a valid name and message." },
        { status: 400 }
      );
    }

    
const { error } = await resend.emails.send({
  from: "Website Contact <contact@ciinformation.co.uk>",
  to: [process.env.CONTACT_EMAIL!],
  replyTo: undefined,
  subject: `New website message from ${name.trim()}`,
  text: `Name: ${name.trim()}\n\nMessage:\n${message.trim()}`,
});


    if (error) {
      console.error(error);
      return Response.json(
        { error: "Email could not be sent." },
        { status: 500 }
      );
    }

    return Response.json({ success: true });
  } catch {
    return Response.json(
      { error: "Something went wrong." },
      { status: 500 }
    );
  }
}
