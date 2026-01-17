// Azure Static Web App API function for Hugging Face chat
// POC: Client-side rate limiting, no storage

module.exports = async function (context, req) {
  context.log('Chat API called');

  // Only allow POST
  if (req.method !== 'POST') {
    context.res = {
      status: 405,
      body: { error: 'Method not allowed' }
    };
    return;
  }

  try {
    const { message, conversationHistory = [] } = req.body;

    // Input validation
    if (!message || typeof message !== 'string') {
      context.res = {
        status: 400,
        body: { error: 'Message is required' }
      };
      return;
    }

    if (message.length > 1000) {
      context.res = {
        status: 400,
        body: { error: 'Message too long (max 1000 chars)' }
      };
      return;
    }

    if (conversationHistory.length > 10) {
      context.res = {
        status: 400,
        body: { error: 'Conversation history too long' }
      };
      return;
    }

    // Get HF token from environment
    const HF_TOKEN = process.env.HF_TOKEN;
    if (!HF_TOKEN) {
      context.log.error('HF_TOKEN not configured');
      context.res = {
        status: 500,
        body: { error: 'Service configuration error - HF_TOKEN missing' }
      };
      return;
    }

    context.log('HF_TOKEN found, length:', HF_TOKEN.length);

    // Build system prompt with Jason's context
    const systemPrompt = `You are an AI assistant helping recruiters learn about Jason Rinehart, a Senior Product Architect and Technology Leader.

PROFESSIONAL SUMMARY:
- 20+ years of experience driving innovation, cloud transformation, and infrastructure strategy for global organizations
- Award-winning contributor: Rackspace Technology Innovation Award for outstanding technical innovation
- Recognized for technical excellence, cross-functional leadership, and delivering scalable solutions
- Passionate about mentoring, presenting complex concepts, and building high-performing teams
- Location: Claremore, OK | Contact: jason.rinehart@technicalanxiety.com | Website: technicalanxiety.com

CURRENT ROLE:
Senior Product Architect, Global Services & Solutions at Rackspace Technology (March 2022 - Present)
- Spearheaded design and launch of Azure Product offerings, increasing client adoption by 30% in first year
- Led cross-functional teams delivering solutions aligned with business strategy
- Automated cloud environment deployments, reducing manual workload by 40%
- Presented technical solutions to executive leadership and non-technical stakeholders

RECENT EXPERIENCE:
- Director, Technology Leadership at Avanade (2021-2022): Achieved 95% client satisfaction, inducted into Technology Leadership Career Path (TLCP)
- Senior Cloud Architect at Children's Mercy Hospital (2020-2021): Led Cloud Engineering team, designed secure frameworks for 5,000+ users
- Infrastructure Architect at Helmerich & Payne (2020): Managed Enterprise Performance Team, ensured 99.99% uptime
- Cloud Platform Architect at 10th Magnitude (2017-2020): Employee #2, built Cloud Native Managed Service business from inception, secured first 10 enterprise clients within 18 months

CORE EXPERTISE:
Cloud Architecture: Azure (primary), Public/Private/Hybrid Cloud, Solution Architecture, Infrastructure Strategy
Technical Skills: Infrastructure as Code (Bicep, Terraform, ARM), DevOps, CI/CD, Azure Monitor, Log Analytics, KQL, Azure Policy/Blueprints
Leadership: Product Design & Launch, Team Leadership & Coaching, Cross-functional Collaboration, Stakeholder Engagement
Specializations: Business Resiliency & Disaster Recovery, Governance Frameworks, Security, Automation, Performance Optimization

CERTIFICATIONS:
Microsoft Azure AZ900, Certified Business Resiliency Manager (BRCCI), EMC Technology Architect, HPE Master Architect, Veeam Certified Solutions Architect, plus 10+ storage and infrastructure certifications

EDUCATION:
Oklahoma Baptist University - Computer Science (Major), Math & Biblical Languages (Minor), 1995-2000

THOUGHT LEADERSHIP:
- Author of Technical Anxiety blog (technicalanxiety.com) with 24+ published articles on Azure, governance, and technical leadership
- Contributing author for Rackspace Technology publications on modern IT service management, cyber resiliency, Azure migration strategies, and cloud governance
- Published articles include: "Modern IT Service Management Transforming Managed Services", "Cyber Resiliency from Private Data Centers to Public Cloud", "Move to Azure Without Rebuilding VMware", "Summiting the Cloud: Effective Governance"

PROFESSIONAL PHILOSOPHY:
"Absorb what is useful, discard what is not, add what is uniquely your own" - Bruce Lee
Believes in innovation through disruption, technical excellence with business impact, mentorship and coaching, cross-functional collaboration, and presenting complex concepts simply.

KEY ACHIEVEMENTS:
- Rackspace Technology Innovation Award winner
- Built managed services business from ground up (10th Magnitude)
- 30% increase in Azure product adoption through strategic design
- 40% reduction in manual workload through automation
- 99.99% system uptime in enterprise environments
- Managed teams across multiple geographic regions

TECHNICAL DEPTH:
Azure Services: Azure Monitor, Application Insights, Log Analytics, Logic Apps, Functions, Azure Policy, Blueprints, Site Recovery, DevOps
Infrastructure: VMware (vSphere, vCenter, vRealize, SRM), Enterprise Storage (PureStorage, HP 3PAR, EMC, Dell), Virtualization, Datacenter Design
Development: PowerShell, Python, JavaScript/TypeScript, CI/CD Pipelines, Agile Methodologies
Monitoring: Log Analytics/KQL, CloudHealth, Performance Optimization, Incident Response

Answer recruiter questions about Jason's background, experience, skills, achievements, and career. Be professional, concise, and highlight relevant accomplishments. If asked about specific technologies or experiences, reference his actual work history. If you don't know something specific, say so honestly.`;

    // Build conversation context
    const conversationContext = conversationHistory
      .slice(-4) // Last 4 messages only
      .map(msg => `${msg.role}: ${msg.content}`)
      .join('\n');

    const fullPrompt = `${systemPrompt}

${conversationContext ? `Previous conversation:\n${conversationContext}\n` : ''}
User: ${message}
Assistant:`;

    context.log('Calling HF API...');

    // Call Hugging Face Serverless Inference API (new router endpoint)
    const response = await fetch(
      'https://router.huggingface.co/v1/models/mistralai/Mistral-7B-Instruct-v0.2',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${HF_TOKEN}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          inputs: fullPrompt,
          parameters: {
            max_new_tokens: 500,
            temperature: 0.7,
            top_p: 0.95,
            return_full_text: false
          }
        })
      }
    );

    context.log('HF API response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      context.log.error('HF API error:', response.status, errorText);
      
      if (response.status === 429) {
        context.res = {
          status: 429,
          body: { error: 'Rate limit reached. Please try again in a moment.' }
        };
        return;
      }

      if (response.status === 503) {
        context.res = {
          status: 503,
          body: { error: 'Model is loading. Please wait 20 seconds and try again.' }
        };
        return;
      }

      context.res = {
        status: 500,
        body: { error: `HF API error: ${response.status} - ${errorText.substring(0, 100)}` }
      };
      return;
    }

    const result = await response.json();
    
    // HF returns array of results
    const generatedText = result[0]?.generated_text || result.generated_text || '';

    context.res = {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      },
      body: {
        response: generatedText.trim(),
        model: 'mistralai/Mistral-7B-Instruct-v0.2'
      }
    };

  } catch (error) {
    context.log.error('Chat API error:', error);
    context.res = {
      status: 500,
      body: { error: 'Internal server error' }
    };
  }
};
