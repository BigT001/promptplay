import { NextResponse } from 'next/server';

interface ScriptRequest {
  prompt: string;
  parameters?: Record<string, any>;
}

export async function POST(req: Request) {
  try {
    const data: ScriptRequest = await req.json();
    console.log('Sending request to FastAPI:', data);

    // Call the Python script writing agent via FastAPI
    const response = await fetch('http://localhost:8000/api/scripts/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const responseData = await response.json();
    console.log('FastAPI response:', responseData);

    if (!response.ok) {
      throw new Error(responseData.detail || 'Failed to generate script');
    }

    return NextResponse.json(responseData);
    
  } catch (error) {
    console.error('Error generating script:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to generate script';
    return NextResponse.json(
      { 
        error: errorMessage,
        status: 'error',
        message: errorMessage
      },
      { status: 500 }
    );
  }
}
