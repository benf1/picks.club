// 1. Create lib/github.ts
// Click "Add file" → "Create new file"
// Path: lib/github.ts
// Paste this code:

import { Octokit } from '@octokit/rest';

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN
});

export async function saveToGithub(username: string, pages: any[]) {
  const content = Buffer.from(JSON.stringify(pages)).toString('base64');
  
  try {
    await octokit.repos.createOrUpdateFileContents({
      owner: process.env.GITHUB_OWNER!,
      repo: process.env.GITHUB_REPO!,
      path: `users/${username}.json`,
      message: `Update picks for ${username}`,
      content,
      sha: await getFileSha(username)
    });
    return true;
  } catch (error) {
    console.error('GitHub save error:', error);
    return false;
  }
}

async function getFileSha(username: string) {
  try {
    const { data } = await octokit.repos.getContent({
      owner: process.env.GITHUB_OWNER!,
      repo: process.env.GITHUB_REPO!,
      path: `users/${username}.json`
    });
    return 'sha' in data ? data.sha : null;
  } catch (error) {
    return null;
  }
}

export async function getFromGithub(username: string) {
  try {
    const { data } = await octokit.repos.getContent({
      owner: process.env.GITHUB_OWNER!,
      repo: process.env.GITHUB_REPO!,
      path: `users/${username}.json`
    });
    if ('content' in data) {
      const content = Buffer.from(data.content, 'base64').toString();
      return JSON.parse(content);
    }
    return null;
  } catch (error) {
    return null;
  }
}

// 2. Create app/api/publish/route.ts
// Click "Add file" → "Create new file"
// Path: app/api/publish/route.ts
// Paste this code:

import { NextResponse } from 'next/server';
import { saveToGithub } from '@/lib/github';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const success = await saveToGithub(body.username, body.pages);
    
    return NextResponse.json({ success });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to save' }, { status: 500 });
  }
}

// 3. Create app/[username]/page.tsx
// Click "Add file" → "Create new file"
// Path: app/[username]/page.tsx
// Paste this code:

import { getFromGithub } from '@/lib/github';

export default async function UserPage({ params }: { params: { username: string } }) {
  const picks = await getFromGithub(params.username);
  
  if (!picks) {
    return (
      <div className="min-h-screen bg-black text-white p-10">
        <h1 className="text-2xl mb-5">No picks found</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-10">
      <h1 className="text-2xl mb-5">Picks by {params.username}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {picks.map((pick: any, index: number) => (
          <div key={index} className="bg-gray-900 rounded-lg overflow-hidden">
            <img 
              src={`data:image/png;base64,${pick.image}`}
              alt={pick.name}
              className="w-full h-auto"
            />
            <div className="p-4">
              <h2 className="text-lg font-medium">{pick.name}</h2>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// 4. Create package.json (if it doesn't exist)
// Click "Add file" → "Create new file"
// Path: package.json
// Paste this code:

{
  "name": "picks-club",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start"
  },
  "dependencies": {
    "next": "14.0.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "@octokit/rest": "^20.0.0",
    "autoprefixer": "^10.0.1",
    "postcss": "^8",
    "tailwindcss": "^3.3.0"
  },
  "devDependencies": {
    "@types/node": "^20",
    "@types/react": "^18",
    "@types/react-dom": "^18",
    "typescript": "^5"
  }
}
