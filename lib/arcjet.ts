import arcjet, { slidingWindow, detectBot, validateEmail } from '@arcjet/next';

export const aj = arcjet({
  key: process.env.ARCJET_KEY!,
  rules: [
    slidingWindow({
      mode: 'LIVE', // will block requests. Use "DRY_RUN" to log only
      interval: 60, // tracks requests across a 60 second sliding window
      max: 40, // allow a maximum of 10 requests
    }),
    detectBot({
      mode: 'LIVE', // will block requests. Use "DRY_RUN" to log only
      allow: [], // "allow none" will block all detected bots
    }),
  ],
});

export const ajEmail = arcjet({
  key: process.env.ARCJET_KEY!,
  rules: [
    validateEmail({
      mode: 'LIVE',
      deny: ['DISPOSABLE', 'INVALID', 'NO_MX_RECORDS', 'FREE'],
    }),
  ],
});
