
import { NextResponse , NextRequest } from 'next/server';
import Razorpay from 'razorpay';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY,
  key_secret: process.env.RAZORPAY_SECRET
});

export async function POST(
  req: NextRequest,
) {
  if (req.method === 'POST') {
    const body = await req.json();
    const { amount, currency, receipt } = body;

    try {
      const options = {
        amount,
        currency,
        receipt,
        payment_capture: 1
      };

      const order = await razorpay.orders.create(options);
      return NextResponse.json({order} , {status : 200});
    } catch (error) {
      console.error('Order creation error:', error);
     return  NextResponse.json({ error: 'Unable to create order' }, {status: 500});
    }
  } else {
    return NextResponse.json({ error: 'Method not allowed' }, {status: 405});
  }
}

