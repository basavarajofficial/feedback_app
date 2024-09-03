import * as React from 'react';

interface EmailTemplateProps {
  username: string;
  otp: string;
}

 const VerificationsEmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({ username, otp}) => {
    return (
        `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verify Your Email Address</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                background-color: #f4f4f4;
                margin: 0;
                padding: 0;
                -webkit-font-smoothing: antialiased;
                -moz-osx-font-smoothing: grayscale;
            }
            .email-container {
                max-width: 600px;
                margin: 40px auto;
                background-color: #ffffff;
                padding: 20px;
                border-radius: 8px;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            }
            .email-header {
                text-align: center;
                padding-bottom: 20px;
                border-bottom: 1px solid #dddddd;
            }
            .email-header h1 {
                font-size: 24px;
                color: #333333;
                margin: 0;
            }
            .email-body {
                padding: 20px 0;
                text-align: center;
            }
            .email-body p {
                font-size: 16px;
                color: #555555;
                line-height: 1.5;
            }
            .email-button {
                display: inline-block;
                margin-top: 20px;
                padding: 12px 24px;
                font-size: 16px;
                color: #ffffff;
                background-color: #007bff;
                border-radius: 4px;
                text-decoration: none;
            }
            .email-footer {
                text-align: center;
                padding-top: 20px;
                border-top: 1px solid #dddddd;
                font-size: 14px;
                color: #999999;
            }
        </style>
    </head>
    <body>
        <div class="email-container">
            <div class="email-header">
                <h1>Verify Your Email Address</h1>
            </div>
            <div class="email-body">
                <p>Dear ${username},</p>
                <p>Thank you for registering. To complete your registration, please use following verification code: </p>
                <p>${otp}</p>
                <p>If you did not create an account, no further action is required.</p>
            </div>
            <div class="email-footer">
                <p>&copy; 2024 basavaraj mannangi. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
    `
    )
 }

export default VerificationsEmailTemplate;
