const nodemailer = require('nodemailer');

// Create transporter — Gmail SMTP
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    family: 4,
    tls: {
        rejectUnauthorized: false
    },
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
    dnsTimeout: 10000,
    socketTimeout: 10000
});

const sendWeeklyDigest = async (toEmail, username, aiReport, stats) => {
    try {
        // Calculate weekly totals for email summary
        const totalCommits = stats.reduce((sum, day) => sum + day.commits, 0);
        const totalPRs = stats.reduce((sum, day) => sum + day.prsOpened, 0);
        const activeDays = stats.filter(day => day.commits > 0).length;
        const bestDay = stats.reduce((best, day) =>
            day.commits > best.commits ? day : best, stats[0]
        );

        const mailOptions = {
            from: `DevPulse <${process.env.EMAIL_USER}>`,
            to: toEmail,
            subject: `Your Weekly DevPulse Report — ${username}`,
            html: `
        <!DOCTYPE html>
        <html>
          <body style="font-family: Arial, sans-serif; max-width: 600px; 
                       margin: 0 auto; padding: 20px; background: #f5f5f5;">
            
            <!-- Header -->
            <div style="background: #24292e; padding: 30px; 
                        border-radius: 10px 10px 0 0; text-align: center;">
              <h1 style="color: white; margin: 0;">
                DevPulse Weekly Report
              </h1>
              <p style="color: #8b949e; margin: 10px 0 0 0;">
                Week ending ${new Date().toDateString()}
              </p>
            </div>

            <!-- Stats Cards -->
            <div style="background: white; padding: 30px;">
              <h2 style="color: #24292e;">Hey ${username} 👋</h2>
              <p style="color: #57606a;">Here's your GitHub activity this week:</p>

              <!-- Numbers Row -->
              <div style="display: flex; gap: 15px; margin: 20px 0;">
                
                <div style="flex: 1; background: #f0f6ff; padding: 20px; 
                            border-radius: 8px; text-align: center;">
                  <h2 style="color: #0969da; margin: 0;">
                    ${totalCommits}
                  </h2>
                  <p style="color: #57606a; margin: 5px 0 0 0;">
                    Total Commits
                  </p>
                </div>

                <div style="flex: 1; background: #f0fff4; padding: 20px; 
                            border-radius: 8px; text-align: center;">
                  <h2 style="color: #1a7f37; margin: 0;">
                    ${activeDays}/7
                  </h2>
                  <p style="color: #57606a; margin: 5px 0 0 0;">
                    Active Days
                  </p>
                </div>

                <div style="flex: 1; background: #fff8e6; padding: 20px; 
                            border-radius: 8px; text-align: center;">
                  <h2 style="color: #9a6700; margin: 0;">
                    ${totalPRs}
                  </h2>
                  <p style="color: #57606a; margin: 5px 0 0 0;">
                    PRs Opened
                  </p>
                </div>

              </div>

              <!-- Best Day -->
              <div style="background: #f6f8fa; padding: 15px; 
                          border-radius: 8px; margin: 15px 0;">
                <p style="margin: 0; color: #57606a;">
                  🏆 Best day: 
                  <strong>${new Date(bestDay.date).toDateString()}</strong> 
                  with <strong>${bestDay.commits} commits</strong>
                </p>
              </div>

              <!-- AI Report Section -->
              <div style="margin: 25px 0;">
                <h3 style="color: #24292e;">
                  🤖 AI Productivity Insights
                </h3>
                <div style="background: #f6f8fa; padding: 20px; 
                            border-radius: 8px; border-left: 4px solid #0969da;">
                  <p style="color: #24292e; line-height: 1.6; margin: 0;">
                    ${aiReport.replace(/\n/g, '<br>')}
                  </p>
                </div>
              </div>

              <!-- Footer -->
              <div style="text-align: center; margin-top: 30px; 
                          padding-top: 20px; border-top: 1px solid #d0d7de;">
                <p style="color: #57606a; font-size: 12px;">
                  Sent by DevPulse — Your Developer Productivity Tracker
                </p>
              </div>

            </div>
          </body>
        </html>
      `
        };

        await transporter.sendMail(mailOptions);
        console.log(`Weekly digest sent to ${toEmail}`);
        return true;

    } catch (error) {
        console.error('Email error full:', JSON.stringify(error, null, 2));
        console.error('Email error message:', error.message);
        console.error('Email error code:', error.code);
        return false;
    }
};

module.exports = { sendWeeklyDigest };