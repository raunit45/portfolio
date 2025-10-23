import nodemailer from "nodemailer";

export async function POST(req: Request) {
  const { name, email, message } = await req.json();

  if (!name || !email || !message)
    return new Response("Missing fields", { status: 400 });

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER, // your gmail
        pass: process.env.GMAIL_PASS, // app password
      },
    });

    await transporter.sendMail({
      from: `"Portfolio Contact" <${process.env.GMAIL_USER}>`,
      to: "raunitraj06@gmail.com",
      subject: `New message from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
    });

    return new Response("Email sent successfully!", { status: 200 });
  } catch (err) {
    console.error("Error sending mail:", err);
    return new Response("Failed to send email", { status: 500 });
  }
}
