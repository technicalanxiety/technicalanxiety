// Mock API endpoint for local development
// Real implementation is in /api/chat.js for Azure SWA

export const prerender = false;

export async function POST({ request }: { request: Request }) {
  try {
    const { message } = await request.json();

    // Mock response for local testing
    const mockResponse = `Thanks for asking about Jason! This is a mock response for local development. 

In production, I would answer: "${message}"

Jason Rinehart is a Solutions Architect specializing in Azure, Infrastructure as Code, and cloud modernization. He has deep expertise in:
- Azure architecture and governance
- Bicep and Terraform
- DevOps and automation
- Log Analytics and KQL
- Security-first approaches

The real chat will use Hugging Face AI when deployed to Azure.`;

    return new Response(
      JSON.stringify({
        response: mockResponse,
        model: 'mock-local-dev'
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  }
}
