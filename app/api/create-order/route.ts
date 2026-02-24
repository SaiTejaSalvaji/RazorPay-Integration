import { NextResponse } from "next/server";
import Razorpay from "razorpay";

/**
 * Backend Route: /api/create-order
 * 
 * WHY SERVER-SIDE?
 * We must never generate orders on the frontend because it would require 
 * exposing the `RAZORPAY_KEY_SECRET`. Generating on the server keeps the 
 * secret secure, allowing us to dictate the exact conditions under which an order 
 * is made, preventing client-side tampering (e.g., arbitrarily lowering the price).
 */

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { amount } = body; // Price in INR (e.g., 999 for ₹999)

        // Validate inputs
        if (!amount || typeof amount !== "number") {
            return NextResponse.json({ error: "Invalid amount provided" }, { status: 400 });
        }

        // Initialize Razorpay securely with environment variables
        // process.env prevents secrets from being hardcoded in version control.
        const razorpay = new Razorpay({
            key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
            key_secret: process.env.RAZORPAY_KEY_SECRET!,
        });

        // Create the order options
        const options = {
            // Amount must be in the smallest currency unit (paise for INR). 
            // i.e., ₹999 -> 99900 paise.
            amount: amount * 100,
            currency: "INR",
            receipt: `receipt_order_${Math.floor(Math.random() * 10000)}`, // Optional unique ID
            payment_capture: 1, // Auto capture payment directly
        };

        // Generate the order via Razorpay API
        const order = await razorpay.orders.create(options);

        // Return safely to client
        return NextResponse.json({
            orderId: order.id,
            amount: order.amount,
            currency: order.currency,
        });

    } catch (error) {
        console.error("Error creating Razorpay order:", error);
        return NextResponse.json(
            { error: "Internal Server Error while creating order." },
            { status: 500 }
        );
    }
}
