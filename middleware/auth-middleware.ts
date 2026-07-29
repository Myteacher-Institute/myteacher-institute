import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function authMiddleware(request: NextRequest) {
  const authStorage = request.cookies.get('auth-storage')?.value;
  
  if (!authStorage) {
    return false; // Not authenticated
  }

  try {
    const authData = JSON.parse(authStorage);
    return !!authData.token; // Has token = authenticated
  } catch {
    return false;
  }
}

export function getUserRole(request: NextRequest): 'student' | 'instructor' | 'admin' | null {
  const authStorage = request.cookies.get('auth-storage')?.value;
  
  if (!authStorage) {
    return null;
  }

  try {
    const authData = JSON.parse(authStorage);
    return authData.user?.role || null;
  } catch {
    return null;
  }
}
