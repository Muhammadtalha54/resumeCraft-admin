import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json({ success: true, message: 'Logged out successfully' });

  // Clear httpOnly admin session cookies
  response.cookies.delete('rc_admin_token');
  response.cookies.delete('rc_admin_refresh');

  return response;
}
