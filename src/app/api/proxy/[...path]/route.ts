import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const BACKEND_URL = process.env.BACKEND_API_URL || 'http://localhost:5000/api';

async function handleProxy(request: NextRequest, { params }: { params: { path: string[] } }) {
  const targetPath = (params.path || []).join('/');
  const searchParams = request.nextUrl.searchParams.toString();
  const url = `${BACKEND_URL}/${targetPath}${searchParams ? '?' + searchParams : ''}`;

  // Read the secure httpOnly cookie on the Next.js server side
  const token = request.cookies.get('rc_admin_token')?.value;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  let body = undefined;
  if (['POST', 'PUT', 'PATCH'].includes(request.method)) {
    try {
      body = await request.json();
    } catch {
      body = undefined;
    }
  }

  try {
    const response = await axios({
      method: request.method,
      url,
      data: body,
      headers,
      timeout: 15000,
    });

    return NextResponse.json(response.data);
  } catch (error: any) {
    const status = error.response?.status || 500;
    const data = error.response?.data || { success: false, message: error.message || 'BFF Gateway Error' };
    return NextResponse.json(data, { status });
  }
}

export const GET = handleProxy;
export const POST = handleProxy;
export const PATCH = handleProxy;
export const PUT = handleProxy;
export const DELETE = handleProxy;
