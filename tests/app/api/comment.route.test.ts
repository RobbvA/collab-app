import { vi, describe, it, expect, beforeEach } from 'vitest';

// Mock NextAuth. Provide a default export (NextAuth) because the auth route
// calls `NextAuth(authOptions)` when it is imported.
vi.mock('next-auth', () => ({
  default: vi.fn(() => ({ GET: () => {}, POST: () => {} })),
  getServerSession: vi.fn(),
}));

// Mock the postComment helper so we don't call GitHub during tests
vi.mock('../../../lib/github/comments', () => ({
  default: vi.fn(async () => ({ id: 42, body: { body: 'ok' } })),
}));

import { POST } from '../../../app/api/github/comment/route';
import { getServerSession } from 'next-auth';
import postComment from '../../../lib/github/comments';

describe('POST /api/github/comment route', () => {
  beforeEach(() => {
    (getServerSession as unknown as ReturnType<typeof vi.fn>).mockReset?.();
    (postComment as unknown as ReturnType<typeof vi.fn>).mockReset?.();
  });

  it('returns 401 when no session', async () => {
    (getServerSession as unknown as ReturnType<typeof vi.fn>).mockResolvedValue(null);

    const req = { json: async () => ({ owner: 'o', repo: 'r', number: 1, body: 'hi' }) } as unknown as Request;
    const res = await POST(req);

    expect((res as any).status).toBe(401);
    const body = await (res as any).json();
    expect(body).toHaveProperty('error');
  });

  it('posts comment when session present', async () => {
    (getServerSession as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({ accessToken: 'tok' });

    const payload = { owner: 'o', repo: 'r', number: 5, body: 'hello' };
    const req = { json: async () => payload } as unknown as Request;

    const res = await POST(req);
    expect((res as any).status).toBe(200);
    const body = await (res as any).json();
    expect(body).toHaveProperty('success', true);
    expect(postComment).toHaveBeenCalledWith({ owner: 'o', repo: 'r', number: 5 }, 'hello', 'tok');
  });
});
