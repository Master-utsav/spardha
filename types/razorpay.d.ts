// types/razorpay.d.ts
export interface RazorpayOptions {
    key: string;
    amount: number;
    currency: string;
    name: string;
    description?: string;
    image?: string;
    order_id: string;
    handler: (response: RazorpayPaymentResponse) => void;
    prefill?: {
      name?: string;
      email?: string;
      contact?: string;
    };
    notes?: Record<string, string>;
    theme?: {
      color?: string;
    };
  }
  
  export interface RazorpayPaymentResponse {
    razorpay_payment_id: string;
    razorpay_order_id: string;
    razorpay_signature: string;
  }
  
  export interface RazorpayInstance {
    new (options: RazorpayOptions): RazorpayCheckout;
  }
  
  export interface RazorpayCheckout {
    open(): void;
    close(): void;
  }
  
  declare global {
    interface Window {
      Razorpay: RazorpayInstance;
    }
  }