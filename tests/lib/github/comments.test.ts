import { vi, describe, it, expect, beforeEach } from 'vitest';

// Mock the githubFetch default export. Don't assume `init.body` is a string — the
// real code sometimes passes an object (and `lib/github/client` stringifies it).
vi.mock('../../../lib/github/client', () => ({
  default: vi.fn(async (path: string, init: RequestInit, token?: string) => {
    return { path, body: init?.body ?? null, token };
  }),
}));

import postComment, { CommentTarget } from '../../../lib/github/comments';
import githubFetch from '../../../lib/github/client';

describe('lib/github/comments', () => {
  beforeEach(() => {
    // clear the mock between tests
    (githubFetch as unknown as { mockClear?: () => void }).mockClear?.();
  });

  it('posts a comment successfully using the provided access token', async () => {
    const target: CommentTarget = { owner: 'octocat', repo: 'hello-world', number: 1 };

    const result = await postComment(target, 'Hello from tests', 'user-token-123');

    // result is the object returned by our mock
    expect((result as any).path).toBe('/repos/octocat/hello-world/issues/1/comments');
    expect((result as any).body).toEqual({ body: 'Hello from tests' });
    expect((result as any).token).toBe('user-token-123');
  });

  it('throws when comment body is empty', async () => {
    const target: CommentTarget = { owner: 'octocat', repo: 'hello-world', number: 1 };

    await expect(postComment(target, '', 'token')).rejects.toThrow('Comment body is required');
  });
});
