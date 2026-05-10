import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';

export async function POST(req: Request) {
  try {
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID || '',
      key_secret: process.env.RAZORPAY_KEY_SECRET || '',
    });

    const body = await req.json();
    const { amount, currency, receipt } = body;

    // Minimum amount logic or defaults
    const options = {
      amount: amount || 50000, // default 500 INR (in paise)
      currency: currency || "INR",
      receipt: receipt || "receipt_order_1",
    };

    const order = await razorpay.orders.create(options);
    
    return NextResponse.json(order, { status: 200 });
  } catch (error: any) {
    console.error("Razorpay order creation error:", error);
    return NextResponse.json(
      { error: error.message || 'Failed to create Razorpay order' }, 
      { status: 500 }
    );
  }
}
