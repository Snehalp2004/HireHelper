import nodemailer from 'nodemailer';

let transporter: nodemailer.Transporter;

// Create a reusable Ethereal test account (auto-generated, no signup needed)
async function createTransporter() {
    if (transporter) return transporter;

    // Generate a fresh Ethereal test account
    const testAccount = await nodemailer.createTestAccount();

    console.log('📧 Ethereal Test Account Created:');
    console.log(`   User: ${testAccount.user}`);
    console.log(`   Pass: ${testAccount.pass}`);
    console.log(`   View emails at: https://ethereal.email/login`);
    console.log(`   Login with the above credentials to see sent emails.`);

    transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
            user: testAccount.user,
            pass: testAccount.pass,
        },
    });

    return transporter;
}

export async function getTransporter() {
    return createTransporter();
}

export const clientUrl = process.env.CLIENT_URL || 'http://localhost:4200';
