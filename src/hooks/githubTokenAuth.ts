import type { CollectionBeforeLoginHook } from 'payload'

export const githubTokenBeforeLogin: CollectionBeforeLoginHook = async ({ user }) => {
  const token = (user as any)?.githubToken as string | undefined

  if (!token) {
    throw new Error('A GitHub Personal Access Token is required on your account to log in. Please contact an administrator.')
  }

  let valid = false
  try {
    const res = await fetch('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${token}`,
        'User-Agent': 'amj-cms-auth/1.0',
        Accept: 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
      },
    })

    if (res.status === 200) {
      const data = (await res.json()) as { login?: string }
      const allowedUser = process.env.GITHUB_ALLOWED_USER
      valid = allowedUser ? data.login === allowedUser : true
    } else if (res.status === 401) {
      throw new Error('GitHub token is invalid or expired. Please update your token in account settings.')
    } else {
      throw new Error(`GitHub API returned unexpected status ${res.status}.`)
    }
  } catch (err: any) {
    if (err.message.includes('GitHub')) throw err
    throw new Error('Could not verify GitHub token — network error. Please try again.')
  }

  if (!valid) {
    throw new Error('Your GitHub token does not belong to the permitted account. Access denied.')
  }

  return user
}
