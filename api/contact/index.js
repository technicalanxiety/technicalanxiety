// Azure Static Web App API function for consulting contact form
// Uses Node built-in https module (works on all Node versions)
const https = require('https');

function sendgridRequest(apiKey, payload) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(payload);
    const options = {
      hostname: 'api.sendgrid.com',
      path: '/v3/mail/send',
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data)
      }
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => { body += chunk; });
      res.on('end', () => resolve({ status: res.statusCode, body }));
    });

    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

module.exports = async function (context, req) {
  context.log('Contact API called');

  if (req.method !== 'POST') {
    context.res = { status: 405, headers: { 'Content-Type': 'application/json' },
      body: { error: 'Method not allowed' } };
    return;
  }

  try {
    let body = req.body;
    if (typeof body === 'string') {
      try { body = JSON.parse(body); }
      catch (e) {
        context.res = { status: 400, headers: { 'Content-Type': 'application/json' }, body: { error: 'Invalid JSON body' } };
        return;
      }
    }
    if (!body || typeof body !== 'object') {
      context.res = { status: 400, headers: { 'Content-Type': 'application/json' }, body: { error: 'Request body is required' } };
      return;
    }

    const { name, email, company, size, cloudState, interests, problem } = body;

    if (!name || typeof name !== 'string' || !name.trim()) {
      context.res = { status: 400, headers: { 'Content-Type': 'application/json' }, body: { error: 'Name is required' } };
      return;
    }
    if (!email || typeof email !== 'string' || !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      context.res = { status: 400, headers: { 'Content-Type': 'application/json' }, body: { error: 'Valid email is required' } };
      return;
    }
    if (name.length > 200 || email.length > 200) {
      context.res = { status: 400, headers: { 'Content-Type': 'application/json' }, body: { error: 'Input too long' } };
      return;
    }
    if (company && company.length > 200) {
      context.res = { status: 400, headers: { 'Content-Type': 'application/json' }, body: { error: 'Company name too long' } };
      return;
    }
    if (problem && problem.length > 5000) {
      context.res = { status: 400, headers: { 'Content-Type': 'application/json' }, body: { error: 'Problem description too long' } };
      return;
    }

    const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
    if (!SENDGRID_API_KEY) {
      context.log.error('SENDGRID_API_KEY not configured');
      context.res = { status: 500, headers: { 'Content-Type': 'application/json' }, body: { error: 'Service configuration error - SENDGRID_API_KEY missing' } };
      return;
    }
    context.log('SENDGRID_API_KEY found, length:', SENDGRID_API_KEY.length);

    const interestList = Array.isArray(interests) && interests.length > 0 ? interests.join(', ') : 'Not specified';

    const emailHtml = `<h2>New Consulting Inquiry</h2>
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
<p style="color:#666;font-size:12px;">Submitted from technicalanxiety.com/consulting</p>`;

    const emailText = `New Consulting Inquiry\n\nName: ${name.trim()}\nEmail: ${email.trim()}\nCompany: ${company || 'Not provided'}\nCompany Size: ${size || 'Not provided'}\nCloud State: ${cloudState || 'Not provided'}\nAreas of Interest: ${interestList}\n\n${problem ? 'What they\'re trying to solve:\n' + problem : ''}`;

    const sgPayload = {
      personalizations: [{ to: [{ email: 'jason.rinehart@technicalanxiety.com' }] }],
      from: { email: 'jason.rinehart@technicalanxiety.com', name: 'Technical Anxiety' },
      reply_to: { email: email.trim(), name: name.trim() },
      subject: `Consulting Inquiry: ${name.trim()}${company ? ` (${company.trim()})` : ''}`,
      content: [
        { type: 'text/plain', value: emailText },
        { type: 'text/html', value: emailHtml }
      ]
    };

    context.log('Sending to SendGrid...');
    const sgResponse = await sendgridRequest(SENDGRID_API_KEY, sgPayload);
    context.log('SendGrid response:', sgResponse.status, sgResponse.body);

    if (sgResponse.status >= 400) {
      let userMessage = 'Failed to send message. Please try again.';
      if (sgResponse.status === 403) userMessage = 'Email sender not verified. Contact site owner.';
      if (sgResponse.status === 401) userMessage = 'Email service auth failed. Contact site owner.';
      context.res = { status: 502, headers: { 'Content-Type': 'application/json' },
        body: { error: userMessage, sendgridStatus: sgResponse.status } };
      return;
    }

    context.res = { status: 200, headers: { 'Content-Type': 'application/json' },
      body: { success: true, message: 'Inquiry sent successfully' } };

  } catch (error) {
    context.log.error('Contact API error:', error.message, error.stack);
    context.res = { status: 500, headers: { 'Content-Type': 'application/json' },
      body: { error: 'Internal server error', detail: error.message } };
  }
};
