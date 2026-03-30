// Azure Static Web App API function for consulting contact form
// Sends email via SendGrid API

module.exports = async function (context, req) {
  context.log('Contact API called');

  if (req.method !== 'POST') {
    context.res = { status: 405, body: { error: 'Method not allowed' } };
    return;
  }

  try {
    const { name, email, company, size, cloudState, interests, problem } = req.body;

    // Input validation
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      context.res = { status: 400, body: { error: 'Name is required' } };
      return;
    }

    if (!email || typeof email !== 'string' || !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      context.res = { status: 400, body: { error: 'Valid email is required' } };
      return;
    }

    if (name.length > 200 || email.length > 200) {
      context.res = { status: 400, body: { error: 'Input too long' } };
      return;
    }

    if (company && company.length > 200) {
      context.res = { status: 400, body: { error: 'Company name too long' } };
      return;
    }

    if (problem && problem.length > 5000) {
      context.res = { status: 400, body: { error: 'Problem description too long (max 5000 chars)' } };
      return;
    }

    const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
    if (!SENDGRID_API_KEY) {
      context.log.error('SENDGRID_API_KEY not configured');
      context.res = { status: 500, body: { error: 'Service configuration error' } };
      return;
    }

    // Build email content
    const interestList = Array.isArray(interests) && interests.length > 0
      ? interests.join(', ')
      : 'Not specified';

    const emailHtml = `
      <h2>New Consulting Inquiry</h2>
      <table style="border-collapse:collapse;width:100%;max-width:600px;">
        <tr><td style="padding:8px;font-weight:bold;border-bottom:1px solid #eee;">Name</td><td style="padding:8px;border-bottom:1px solid #eee;">${escapeHtml(name.trim())}</td></tr>
        <tr><td style="padding:8px;font-weight:bold;border-bottom:1px solid #eee;">Email</td><td style="padding:8px;border-bottom:1px solid #eee;"><a href="mailto:${escapeHtml(email.trim())}">${escapeHtml(email.trim())}</a></td></tr>
        <tr><td style="padding:8px;font-weight:bold;border-bottom:1px solid #eee;">Company</td><td style="padding:8px;border-bottom:1px solid #eee;">${escapeHtml(company || 'Not provided')}</td></tr>
        <tr><td style="padding:8px;font-weight:bold;border-bottom:1px solid #eee;">Company Size</td><td style="padding:8px;border-bottom:1px solid #eee;">${escapeHtml(size || 'Not provided')}</td></tr>
        <tr><td style="padding:8px;font-weight:bold;border-bottom:1px solid #eee;">Cloud State</td><td style="padding:8px;border-bottom:1px solid #eee;">${escapeHtml(cloudState || 'Not provided')}</td></tr>
        <tr><td style="padding:8px;font-weight:bold;border-bottom:1px solid #eee;">Areas of Interest</td><td style="padding:8px;border-bottom:1px solid #eee;">${escapeHtml(interestList)}</td></tr>
      </table>
      ${problem ? `<h3 style="margin-top:20px;">What they're trying to solve</h3><p style="white-space:pre-wrap;background:#f8f9fa;padding:16px;border-radius:8px;">${escapeHtml(problem)}</p>` : ''}
      <hr style="margin-top:24px;border:none;border-top:1px solid #eee;" />
      <p style="color:#666;font-size:12px;">Submitted from technicalanxiety.com/consulting</p>
    `;

    const emailText = [
      'New Consulting Inquiry',
      '',
      `Name: ${name.trim()}`,
      `Email: ${email.trim()}`,
      `Company: ${company || 'Not provided'}`,
      `Company Size: ${size || 'Not provided'}`,
      `Cloud State: ${cloudState || 'Not provided'}`,
      `Areas of Interest: ${interestList}`,
      '',
      problem ? `What they're trying to solve:\n${problem}` : '',
    ].join('\n');

    // Send via SendGrid v3 API
    const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SENDGRID_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        personalizations: [{ to: [{ email: 'jason.rinehart@technicalanxiety.com' }] }],
        from: { email: 'jason.rinehart@technicalanxiety.com', name: 'Technical Anxiety' },
        reply_to: { email: email.trim(), name: name.trim() },
        subject: `Consulting Inquiry: ${name.trim()}${company ? ` (${company.trim()})` : ''}`,
        content: [
          { type: 'text/plain', value: emailText },
          { type: 'text/html', value: emailHtml }
        ]
      })
    });

    context.log('SendGrid response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      context.log.error('SendGrid error:', response.status, errorText);
      context.res = { status: 500, body: { error: 'Failed to send message. Please try again.' } };
      return;
    }

    context.res = {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
      body: { success: true, message: 'Inquiry sent successfully' }
    };

  } catch (error) {
    context.log.error('Contact API error:', error);
    context.res = { status: 500, body: { error: 'Internal server error' } };
  }
};

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
