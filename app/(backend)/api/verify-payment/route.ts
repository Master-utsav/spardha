
import crypto from 'crypto';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(
  req: NextRequest,
) {
  if (req.method === 'POST') {
    const body = await req.json();
    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature,
      plan 
    } = body;

    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET!;

    if (!webhookSecret) {
        console.error('Webhook secret is not configured');
        return NextResponse.json({ 
          success: false, 
          message: 'Webhook secret not configured' 
        }, {status : 500});
      }
    const generatedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (generatedSignature === razorpay_signature) {
      // Payment is valid
      // Here you would typically:
      // 1. Save payment details to your database
      // 2. Update user's subscription
      // 3. Send confirmation email etc.

      return NextResponse.json({ 
        status: 'success', 
        message: 'Payment verified',
        plan 
      }, {status: 200});
    } else {
      return NextResponse.json({ 
        status: 'failed', 
        message: 'Payment verification failed' 
      } , {status: 400});
    }
  } else {
    return NextResponse.json({ error: 'Method not allowed' }, {status: 405});
  }
}