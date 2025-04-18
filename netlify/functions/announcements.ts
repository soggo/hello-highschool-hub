
import { Handler } from '@netlify/functions';
import { Octokit } from '@octokit/rest';

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

const owner = process.env.GITHUB_OWNER;
const repo = process.env.GITHUB_REPO;
const baseBranch = process.env.GITHUB_BRANCH || 'main';

export const handler: Handler = async (event) => {
  if (!event.body) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Missing request body' }),
    };
  }

  try {
    const { action, data } = JSON.parse(event.body);
    const filePath = 'src/data/announcements.json';

    // Get current file content
    const { data: fileData } = await octokit.repos.getContent({
      owner,
      repo,
      path: filePath,
      ref: baseBranch,
    });

    if (!('content' in fileData)) {
      throw new Error('File not found or is a directory');
    }

    // Decode current content
    const currentContent = Buffer.from(fileData.content, 'base64').toString();
    const announcements = JSON.parse(currentContent);
    let updatedAnnouncements;

    switch (action) {
      case 'create':
        updatedAnnouncements = [...announcements, {
          ...data,
          id: Date.now().toString(),
          created_at: new Date().toISOString(),
        }];
        break;
      case 'update':
        updatedAnnouncements = announcements.map(ann => 
          ann.id === data.id ? { ...ann, ...data } : ann
        );
        break;
      case 'delete':
        updatedAnnouncements = announcements.filter(ann => ann.id !== data.id);
        break;
      default:
        throw new Error('Invalid action');
    }

    // Commit changes
    await octokit.repos.createOrUpdateFileContents({
      owner,
      repo,
      path: filePath,
      message: `${action} announcement ${data.id || ''}`,
      content: Buffer.from(JSON.stringify(updatedAnnouncements, null, 2)).toString('base64'),
      sha: fileData.sha,
      branch: baseBranch,
    });

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: `Announcement ${action}d successfully`,
        data: updatedAnnouncements,
      }),
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to process request' }),
    };
  }
};
