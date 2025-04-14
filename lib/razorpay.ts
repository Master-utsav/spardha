// lib/razorpay.ts

declare global {
    interface Window {
      Razorpay: any;  
    }
  }
  
  export const loadRazorpay = (): Promise<any> => {
    return new Promise((resolve, reject) => {
      if (window.Razorpay) {
        resolve(window.Razorpay);
        return;
      }
  
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => {
        if (window.Razorpay) {
          resolve(window.Razorpay);
        } else {
          reject(new Error('Razorpay SDK not loaded'));
        }
      };
      script.onerror = () => {
        reject(new Error('Razorpay SDK failed to load'));
      };
      document.body.appendChild(script);
    });
  };
  
  // Export to ensure it can be imported
  export default loadRazorpay;