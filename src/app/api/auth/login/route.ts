import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const BACKEND_URL = (process.env.BACKEND_API_URL || 'http://localhost:5000/api').replace(/\/+$/, '');

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Call Express Backend Login
    const response = await axios.post(`${BACKEND_URL}/auth/login`, {
      email,
      password,
    });

    const data = response.data;

    // Verify user is an ADMIN
    if (data.user?.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, message: 'Access denied. You do not have Administrator privileges.' },
        { status: 403 }
      );
    }

    const nextResponse = NextResponse.json({
      success: true,
      message: 'Admin authentication successful',
      user: data.user,
    });

    // BFF Security: Store JWT token in an httpOnly, Secure, SameSite=Strict cookie
    // JavaScript running in the browser CANNOT read this cookie, blocking XSS token theft!
    nextResponse.cookies.set('rc_admin_token', data.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    if (data.refreshToken) {
      nextResponse.cookies.set('rc_admin_refresh', data.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 30, // 30 days
      });
    }

    return nextResponse;
  } catch (error: any) {
    const status = error.response?.status || 500;
    const message = error.response?.data?.message || error.message || 'Authentication failed';
    return NextResponse.json({ success: false, message }, { status });
  }
}
