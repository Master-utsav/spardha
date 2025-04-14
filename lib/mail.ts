import nodemailer from 'nodemailer';

export async function sendVerificationEmail(email: string, otp: string) {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_SERVER_HOST,
    port: Number(process.env.EMAIL_SERVER_PORT),
    auth: {
      user: process.env.EMAIL_SERVER_USER,
      pass: process.env.EMAIL_SERVER_PASSWORD,
    },
    secure: false,
  });

  const mailOptions = {
    from: `"Code-spradha" <${process.env.EMAIL_FROM}>`,
    to: email,
    subject: 'Verify your email for Spardha',
    html: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: black; border-radius: 8px; text-align: center; color: #cce7ff; position: relative; overflow: hidden;">
    <!-- Blue Overlay -->
    <div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(5, 68, 94, 0.2); z-index: 0;"></div>

    <!-- Content Wrapper -->
    <div style="position: relative; z-index: 1; padding: 20px; border: 2px solid #05445e; border-radius: 8px; background-color: rgba(255, 255, 255, 0.05);">
        <!-- Logo and Title -->
        <div style="display: flex; align-items: center; justify-content: center; gap: 10px; margin-bottom: 20px; flex-wrap: wrap;">
            <img src="${process.env.domain}/img/logo.png" alt="Spardha Logo" style="height: 30px; max-width: 100%;" />
            <h2 style="color: #cce7ff; font-weight: bold; margin: 0;">Spardha</h2>
        </div>

        <div style="background:linear-gradient(to right, transparent, rgba(5, 68, 94, 0.8), transparent); height:2px; width:100%; margin-bottom: 20px;"></div>

        <h3 style="margin-bottom: 10px; font-size: 22px; font-weight: bold;">Verify Your Email</h3>
        <p style="font-size: 16px; max-width: 100%; margin: 0 auto;">Thank you for registering with Spardha. Please use the following OTP to verify your email address:</p>

        <!-- OTP Box -->
        <div style="background-color: rgba(255, 255, 255, 0.1); padding: 15px; border: 2px solid #05445e; border-radius: 8px; font-size: clamp(18px, 5vw, 26px); font-weight: bold; letter-spacing: 5px; margin: 20px auto; display: inline-block; color: rgba(44, 94, 245, 0.9); word-break: break-all; max-width: 100%;">
            ${otp}
        </div>

        <p style="font-size: 14px;">Please verify your email by entering the OTP. If you did not request this verification, please ignore this email.</p>

        <!-- Footer -->
        <p style="margin-top: 30px; font-size: 12px; color: #99c1de; display: flex; flex-direction: column; gap: 2px;">
            <a href="${process.env.domain}" target="_blank" style="color: #cce7ff; text-decoration: none; font-weight: bold;">Contact Us</a>
            &copy; ${new Date().getFullYear()} Spardha. All rights reserved.
            <a href="https://masterutsav.in" style="color: #cce7ff; text-decoration: none; font-weight: bold;">Developer: Master Utsav</a>
        </p>
    </div>
</div>`,
  };

  await transporter.sendMail(mailOptions);
}

export async function sendTokenToTheUserEmail(
  email: string,
  token: string,
  quizName: string,
  password: string,
  username: string
) {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_SERVER_HOST,
    port: Number(process.env.EMAIL_SERVER_PORT),
    auth: {
      user: process.env.EMAIL_SERVER_USER,
      pass: process.env.EMAIL_SERVER_PASSWORD,
    },
    secure: false,
  });

  const mailOptions = {
    from: `"Code-spradha" <${process.env.EMAIL_FROM}>`,
    to: email,
    subject: `Token for you quiz ${quizName}`,
    html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: black; border-radius: 8px; text-align: center; color: #cce7ff; position: relative; overflow: hidden;">
    <!-- Blue Overlay -->
    <div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(5, 68, 94, 0.2); z-index: 0;"></div>

    <!-- Content Wrapper -->
    <div style="position: relative; z-index: 1; padding: 20px; border: 2px solid #05445e; border-radius: 8px; background-color: rgba(255, 255, 255, 0.05);">
        
        <!-- Logo and Title -->
        <table align="center" style="margin-bottom: 20px; width: 100%;" cellpadding="0" cellspacing="0">
            <tr>
                <td style="text-align: center;">
                    <table align="center" style="display: inline-block;" cellpadding="5" cellspacing="0">
                        <tr>
                            <td><img src="${process.env.domain}/img/logo.png" alt="Spardha Logo" style="height: 30px; max-width: 100%; display: block;"></td>
                            <td><h2 style="color: #cce7ff; font-weight: bold; margin: 0; font-size: clamp(18px, 5vw, 24px);">Spardha</h2></td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>

        <!-- Divider -->
        <div style="background: linear-gradient(to right, transparent, rgba(5, 68, 94, 0.8), transparent); height: 2px; width: 100%; margin-bottom: 20px;"></div>

        <h3 style="margin-bottom: 10px; font-size: clamp(18px, 5vw, 22px); font-weight: bold; word-wrap: break-word;">Hi, ${username}! Token for Your ${quizName}</h3>
        <p style="font-size: 16px; max-width: 100%; margin: 0 auto;">Thank you for registering with <strong>Spardha</strong>. Please keep your token and password safe.</p>

        <!-- Token & Password Section -->
        <table align="center" width="100%" style="margin: 20px 0;" cellpadding="0" cellspacing="0">
            <tr>
                <td style="text-align: center; padding: 10px;">
                    <div style="background-color: rgba(255, 255, 255, 0.1); padding: 15px; border: 2px solid #05445e; border-radius: 8px; font-size: clamp(16px, 4vw, 22px); font-weight: bold; display: inline-block; max-width: 100%; word-break: break-all;">
                        Token: <span style="background: rgba(44, 94, 245, 0.2); padding: 5px; border: 1px solid rgba(44, 94, 245, 0.4); border-radius: 5px; color: rgba(44, 94, 245, 0.9); display: inline-block; margin-top: 5px; word-break: break-all;">${token}</span> 
                    </div>
                </td>
            </tr>
            <tr>
                <td style="text-align: center; padding: 10px;">
                    <div style="background-color: rgba(255, 255, 255, 0.1); padding: 15px; border: 2px solid #05445e; border-radius: 8px; font-size: clamp(16px, 4vw, 22px); font-weight: bold; display: inline-block; margin-top: 10px; max-width: 100%; word-break: break-all;">
                        Password: <span style="background: rgba(252, 53, 53, 0.2); padding: 5px; border: 1px solid rgba(252, 53, 53, 0.4); border-radius: 5px; color: rgba(252, 53, 53, 0.9); display: inline-block; margin-top: 5px; word-break: break-all;">${password}</span>
                    </div>
                </td>
            </tr>
        </table>

        <p style="font-size: 14px;">Please do not share this with anyone. This is a token required at the time of login to the quiz.</p>

        <!-- Footer -->
        <p style="margin-top: 30px; font-size: 12px; color: #99c1de; text-align: center;">
            <a href="${process.env.domain}" target="_blank" style="color: #cce7ff; text-decoration: none; font-weight: bold;">Contact Us</a><br>
            &copy; ${new Date().getFullYear()} Spardha. All rights reserved.<br>
            <a href="https://masterutsav.in" style="color: #cce7ff; text-decoration: none; font-weight: bold;">Developer: Master Utsav</a>
        </p>
    </div>
</div>

    `,
  };
  await transporter.sendMail(mailOptions);
}

export async function sendUserTokenForEnrolledQuiz(
  email: string,
  username: string,
  quizName: string,
  token: string
) {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_SERVER_HOST,
    port: Number(process.env.EMAIL_SERVER_PORT),
    auth: {
      user: process.env.EMAIL_SERVER_USER,
      pass: process.env.EMAIL_SERVER_PASSWORD,
    },
    secure: false,
  });

  const mailOptions = {
    from: `"Code-spradha" <${process.env.EMAIL_FROM}>`,
    to: email,
    subject: `Token for you quiz ${quizName}`,
    html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 20px auto; padding: 20px; background-color: black; border-radius: 8px; text-align: center; color: #cce7ff; position: relative; overflow: hidden;">
    <!-- Blue Overlay -->
    <div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(5, 68, 94, 0.2); z-index: 0;"></div>
    
    <!-- Content Wrapper -->
    <div style="position: relative; z-index: 1; padding: 20px; border: 2px solid #05445e; border-radius: 8px; background-color: rgba(255, 255, 255, 0.05);">
        
        <!-- Logo and Title -->
        <div style="margin-bottom: 20px; text-align: center;">
            <img src="${process.env.domain}/img/logo.png" alt="Spardha Logo" style="height: 30px; max-height: 30px; display: inline-block; vertical-align: middle; margin-right: 10px; max-width: 100%;" />
            <h2 style="color: #cce7ff; font-weight: bold; margin: 0; display: inline-block; vertical-align: middle; font-size: clamp(18px, 5vw, 24px);">Spardha</h2>
        </div>
        
        <div style="background: linear-gradient(to right, transparent, rgba(5, 68, 94, 0.8), transparent); height: 2px; width: 100%; margin-bottom: 20px;"></div>
        
        <h3 style="margin-bottom: 10px; font-size: clamp(18px, 5vw, 22px); font-weight: bold; word-wrap: break-word;">Hi, ${username}! Token for Your ${quizName}</h3>
        <p style="font-size: 16px; max-width: 100%; margin: 0 auto;">Thank you for registering with <strong>Spardha</strong>. Please keep your token safe.</p>
        
        <!-- Token Box -->
        <div style="margin: 20px 0;">
            <div style="background-color: rgba(255, 255, 255, 0.1); padding: 15px; border: 2px solid #05445e; border-radius: 8px; font-size: clamp(16px, 4vw, 22px); font-weight: bold; display: inline-block; max-width: 100%;">
                Token: <span style="background: rgba(44, 94, 245, 0.2); padding: 5px; border: 1px solid rgba(44, 94, 245, 0.4); border-radius: 5px; color: rgba(44, 94, 245, 0.9); display: inline-block; word-break: break-all; margin-top: 5px;">${token}</span>
            </div>
        </div>

        <p style="font-size: 14px;">Please do not share this with anyone. This is a token required at the time of login to the quiz.</p>
        
        <!-- Footer -->
        <p style="margin-top: 30px; font-size: 12px; color: #99c1de; text-align: center;">
            <a href="${process.env.domain}" target="_blank" style="color: #cce7ff; text-decoration: none; font-weight: bold;">Contact Us</a><br />
            &copy; ${new Date().getFullYear()} Spardha. All rights reserved.<br />
            <a href="https://masterutsav.in" style="color: #cce7ff; text-decoration: none; font-weight: bold;">Developer: Master Utsav</a>
        </p>
    </div>
</div>

    `,
  };

  await transporter.sendMail(mailOptions);
}
