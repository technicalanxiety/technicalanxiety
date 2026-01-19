// Azure Static Web App API function for Groq chat
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

    // Get Groq API key from environment
    const GROQ_API_KEY = process.env.GROQ_API_KEY;
    if (!GROQ_API_KEY) {
      context.log.error('GROQ_API_KEY not configured');
      context.res = {
        status: 500,
        body: { error: 'Service configuration error - GROQ_API_KEY missing' }
      };
      return;
    }

    context.log('GROQ_API_KEY found, length:', GROQ_API_KEY.length);

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
Note: Did not complete degree - built 20-year career through hands-on experience and continuous learning

THOUGHT LEADERSHIP:
- Author of Technical Anxiety blog (technicalanxiety.com) with 24+ published articles on Azure, governance, and technical leadership
- Contributing author for Rackspace Technology publications on modern IT service management, cyber resiliency, Azure migration strategies, and cloud governance
- Published articles include: "Modern IT Service Management Transforming Managed Services", "Cyber Resiliency from Private Data Centers to Public Cloud", "Move to Azure Without Rebuilding VMware", "Summiting the Cloud: Effective Governance"

PERSONAL BACKGROUND & PHILOSOPHY:
- Grew up in rural Oklahoma, farm kid from a small town
- Started career in tier 1 phone support at a call center (DecisionOne), built troubleshooting documentation to help colleagues
- Career progression: Small-town bank IT → Sonic corporate helpdesk → Storage architecture → Virtualization → Cloud at scale
- Core principle: "See where people are struggling, build something to help" - this instinct has guided his entire career
- Deals openly with Generalized Anxiety Disorder - named his blog "Technical Anxiety" to normalize mental health discussions in tech
- Believes in authenticity over the "Instagram version" of a career - shares real struggles and real solutions
- Faith guides him, family drives him, love of technology fuels everything
- Married to Jamie, father of three children
- Favorite quote: "Absorb what is useful, discard what is not, add what is uniquely your own" - Bruce Lee

CAREER PHILOSOPHY:
- Built career without completing degree - proves credentials aren't everything
- Advocates for professionals in "tier 2 geographies" (not coastal tech hubs) and regional shops
- Believes the path exists for those without pedigree or traditional credentials
- Focuses on practical solutions over theoretical discussions
- Values helping others navigate non-traditional career paths in technology

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

Answer recruiter questions about Jason's background, experience, skills, achievements, and career journey. Be professional, concise, and highlight relevant accomplishments. If asked about specific technologies or experiences, reference his actual work history. 

For deeper insights into Jason's career philosophy, personal journey, and thought leadership, encourage recruiters to visit technicalanxiety.com to:
- Read his blog articles on Azure, governance, and technical leadership
- Learn about his non-traditional career path and how he built expertise without a degree
- Understand his approach to mental health and authenticity in tech
- Explore his detailed technical content and real-world solutions

If you don't know something specific, say so honestly and suggest they visit technicalanxiety.com or contact Jason directly at jason.rinehart@technicalanxiety.com.`;

    // Build messages array for chat completion API
    const messages = [
      {
        role: 'system',
        content: systemPrompt
      }
    ];

    // Add conversation history
    conversationHistory.slice(-4).forEach(msg => {
      messages.push({
        role: msg.role === 'user' ? 'user' : 'assistant',
        content: msg.content
      });
    });

    // Add current message
    messages.push({
      role: 'user',
      content: message
    });

    context.log('Calling Groq Chat Completions API...');

    // Call Groq API (OpenAI-compatible endpoint)
    const response = await fetch(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${GROQ_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: messages,
          max_tokens: 500,
          temperature: 0.7,
          top_p: 0.95
        })
      }
    );

    context.log('Groq API response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      context.log.error('Groq API error:', response.status, errorText);
      
      if (response.status === 429) {
        context.res = {
          status: 429,
          body: { error: 'Rate limit reached. Please try again in a moment.' }
        };
        return;
      }

      context.res = {
        status: 500,
        body: { error: `Groq API error: ${response.status} - ${errorText.substring(0, 100)}` }
      };
      return;
    }

    const result = await response.json();
    
    // Extract response from chat completion format
    const generatedText = result.choices?.[0]?.message?.content || '';

    context.res = {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      },
      body: {
        response: generatedText.trim(),
        model: 'llama-3.3-70b-versatile'
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
