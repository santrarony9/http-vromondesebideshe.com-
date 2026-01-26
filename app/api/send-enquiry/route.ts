import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const body = await request.json();

        // In a real application, you would use Resend, SendGrid, or Nodemailer here.
        // For now, we just log the enquiry and return success.
        console.log("New Enquiry Received:", body);

        return NextResponse.json({ success: true, message: "Enquiry logged successfully" });
    } catch (error) {
        console.error("Error processing enquiry:", error);
        return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
    }
}
