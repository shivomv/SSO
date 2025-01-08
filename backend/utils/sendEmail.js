const nodeMailer = require("nodemailer");

const sendEmail = async (email, subject, message) => {
    try {
        const transporter = nodeMailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            service: process.env.SMTP_SERVICE,
            secure: false, // true for 465, false for other ports
            auth: {
                user: process.env.SMTP_MAIL,
                pass: process.env.SMTP_PASSWORD,
            },
        });

        const mailOptions = {
            from: process.env.SMTP_MAIL,
            to: email,
            subject: subject,
            html: message,
            isBodyHtml: true
        };

        const result = await transporter.sendMail(mailOptions);
        return "email sent";
        
    } catch (error) {
        console.log(error);
        return error.message;
    }
};

module.exports = sendEmail;