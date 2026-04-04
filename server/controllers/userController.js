import ErrorHandler from "../middlewares/error.js"
import { catchAsyncError } from "../middlewares/catchAsyncError.js"
import { User } from "../models/userModel.js"

export const register = catchAsyncError(async (req, res, next) => {
    try {
        const { name, email, phone, password, verificationMethod } = req.body;
        if (!name || !email || !phone || !password || !verificationMethod) {
            return next(new ErrorHandler("All fields are required", 400));
        }

        function validatePhoneNumber(phone) {
            const phoneRegex = /^[6-9]\d{9}$/;
            return phoneRegex.test(phone);
        }

        if (!validatePhoneNumber(phone)) {
            return await (new ErrorHandler("Invalid phone number", 400));
        }

        const existingUser = await User.findOne({
            $or: [
                {
                    email,
                    accountVerified: true,
                },
                {
                    phone,
                    accountVerified: true,
                },
            ],
        });

        if (existingUser) {
            return next(new ErrorHandler("Phone or email already used", 400));
        }

        const registerationAttemptsByUser = await User.find({
            $or: [
                { phone, accountVerified: false },
                { email, accountVerified: false },
            ],
        });

        if (registerationAttemptsByUser.length > 3) {
            return next(new ErrorHandler("You have extended maximum number of attempts (3). Please try again hour.", 404));
        }

        const userData = {
            name,
            email,
            phone,
            password
        };

        const user = await User.create(userData);

        const verificationCode = await user.generateVerificationCode();
        await user.save();
        sendVerificationCode(verificationMethod, verificationCode, email, phone);
        res.status(200).json({
            success: true
        });

    } catch (error) {
        next(error)
    }
})

async function sendVerificationCode(verificationMethod, verificationCode, email, phone) {
    if (verificationMethod == 'email') {
        const message = generateEmailTemplate(verificationCode);
        sendEmail({ email, subject: 'Your Verification Code', message })
    }
}

function generateEmailTemplate(verificationCode) {
    return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Email Verification</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f4f4f4;
          padding: 20px;
        }
        .container {
          max-width: 500px;
          background: #ffffff;
          margin: auto;
          padding: 20px;
          border-radius: 8px;
          text-align: center;
          box-shadow: 0 0 10px rgba(0,0,0,0.1);
        }
        .code {
          font-size: 24px;
          font-weight: bold;
          color: #4CAF50;
          margin: 20px 0;
          letter-spacing: 3px;
        }
        .footer {
          font-size: 12px;
          color: #777;
          margin-top: 20px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h2>Email Verification</h2>
        <p>Use the verification code below to verify your email:</p>
        <div class="code">${verificationCode}</div>
        <p>This code will expire in 10 minutes.</p>
        <div class="footer">
          If you did not request this, please ignore this email.
        </div>
      </div>
    </body>
    </html>
  `;
}
