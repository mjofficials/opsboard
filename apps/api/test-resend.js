import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

async function testEmail() {
  try {
    const data = await resend.emails.send({
      from: 'Opsboard <onboarding@opsboard.co.in>',
      to: 'manojmarimuthu1998@gmail.com',
      subject: 'You have been invited to join Opsboard (Test)',
      html: '<p>You have been invited to join an organization on Opsboard.</p>'
    });
    console.log('Success:', JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Failed:', error);
  }
}

testEmail();
