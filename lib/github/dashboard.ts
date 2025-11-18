/**
 * /lib/github/dashboard.ts
 *
 * Temporary mock implementation of getPullsToReview().
 * Later this will be replaced with a real GitHub API search.
 */

export type GitUser = {
    login: string
    id: number
    avatarUrl?: string
    htmlUrl?: string
}

export type PullRequest = {
    id: string
    number: number
    title: string
    body?: string
    repo: string // repo name, e.g. "repo-name"
    owner: string // owner/org, e.g. "owner"
    htmlUrl: string
    createdAt: string
    updatedAt: string
    author: GitUser
    reviewers: GitUser[]
    labels: string[]
    state: 'open' | 'closed' | 'merged'
    isDraft: boolean
    commentsCount: number
    reviewCommentsCount: number
    additions?: number
    deletions?: number
}

const mockPulls: PullRequest[] = [
    {
        id: 'PR_1',
        number: 342,
        title: 'Fix: handle nil pointer in payment processor',
        body: 'This PR fixes a nil pointer that can occur when the payment gateway returns an empty payload.',
        repo: 'payments-service',
        owner: 'acme-corp',
        htmlUrl: 'https://github.com/acme-corp/payments-service/pull/342',
        createdAt: '2025-11-10T09:21:00.000Z',
        updatedAt: '2025-11-11T14:02:00.000Z',
        author: { login: 'alice', id: 101, avatarUrl: 'https://avatars.example/alice.png', htmlUrl: 'https://github.com/alice' },
        reviewers: [
            { login: 'bob', id: 102, avatarUrl: 'https://avatars.example/bob.png', htmlUrl: 'https://github.com/bob' },
            { login: 'carol', id: 103, avatarUrl: 'https://avatars.example/carol.png', htmlUrl: 'https://github.com/carol' }
        ],
        labels: ['bug', 'high-priority'],
        state: 'open',
        isDraft: false,
        commentsCount: 4,
        reviewCommentsCount: 2,
        additions: 18,
        deletions: 6
    },
    {
        id: 'PR_2',
        number: 87,
        title: 'Feat: add team settings UI',
        body: 'Introduces the new team settings page and related API endpoints.',
        repo: 'web-app',
        owner: 'acme-corp',
        htmlUrl: 'https://github.com/acme-corp/web-app/pull/87',
        createdAt: '2025-11-08T16:45:00.000Z',
        updatedAt: '2025-11-10T08:00:00.000Z',
        author: { login: 'dan', id: 110, avatarUrl: 'https://avatars.example/dan.png', htmlUrl: 'https://github.com/dan' },
        reviewers: [{ login: 'erin', id: 111, avatarUrl: 'https://avatars.example/erin.png', htmlUrl: 'https://github.com/erin' }],
        labels: ['enhancement', 'ui'],
        state: 'open',
        isDraft: true,
        commentsCount: 1,
        reviewCommentsCount: 0,
        additions: 240,
        deletions: 32
    },
    {
        id: 'PR_3',
        number: 12,
        title: 'Chore: bump deps',
        body: 'Bumps various dependencies to address audit warnings.',
        repo: 'infra',
        owner: 'acme-corp',
        htmlUrl: 'https://github.com/acme-corp/infra/pull/12',
        createdAt: '2025-11-01T10:00:00.000Z',
        updatedAt: '2025-11-03T11:30:00.000Z',
        author: { login: 'dependabot', id: 0, avatarUrl: undefined, htmlUrl: 'https://github.com/dependabot' },
        reviewers: [],
        labels: ['maintenance'],
        state: 'open',
        isDraft: false,
        commentsCount: 0,
        reviewCommentsCount: 0,
        additions: 5,
        deletions: 2
    }
]

/**
 * getPullsToReview
 *
 * Returns a list of pull requests that need review. This is a mock implementation
 * that resolves with static data. Replace with a real GitHub API search later.
 */
export async function getPullsToReview(): Promise<PullRequest[]> {
    // simulate small network delay
    await new Promise((resolve) => setTimeout(resolve, 50))
    return mockPulls
}