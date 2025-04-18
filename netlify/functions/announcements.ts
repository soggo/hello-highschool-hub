
import { Handler } from '@netlify/functions';
import { Octokit } from '@octokit/rest';

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

const owner = process.env.GITHUB_OWNER;
const repo = process.env.GITHUB_REPO;
const baseBranch = process.env.GITHUB_BRANCH || 'main';
const filePath = 'src/data/announcements.json';

export const handler: Handler = async (event) => {
  if (!event.body) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Missing request body' }),
    };
  }

  try {
    console.log('Processing request with body:', event.body);
    const { action, data } = JSON.parse(event.body);
    
    // Validating required environment variables
    if (!process.env.GITHUB_TOKEN) {
      console.error('GITHUB_TOKEN environment variable is not set');
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Server configuration error: GITHUB_TOKEN missing' }),
      };
    }

    if (!owner) {
      console.error('GITHUB_OWNER environment variable is not set');
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Server configuration error: GITHUB_OWNER missing' }),
      };
    }

    if (!repo) {
      console.error('GITHUB_REPO environment variable is not set');
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Server configuration error: GITHUB_REPO missing' }),
      };
    }

    console.log(`Using GitHub repo: ${owner}/${repo}, branch: ${baseBranch}`);

    // Get current file content
    let fileData;
    try {
      const response = await octokit.repos.getContent({
        owner,
        repo,
        path: filePath,
        ref: baseBranch,
      });
      
      fileData = response.data;
      console.log('Retrieved file data successfully');
    } catch (error) {
      console.error('Error fetching file content:', error);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Failed to fetch announcements file' }),
      };
    }

    if (!('content' in fileData)) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: 'File not found or is a directory' }),
      };
    }

    // Decode current content
    const currentContent = Buffer.from(fileData.content, 'base64').toString();
    const announcements = JSON.parse(currentContent);
    let updatedAnnouncements;
    let commitMessage;

    switch (action) {
      case 'create':
        updatedAnnouncements = [...announcements, {
          ...data,
          id: Date.now().toString(),
          created_at: new Date().toISOString(),
        }];
        commitMessage = `Create announcement`;
        break;
      case 'update':
        updatedAnnouncements = announcements.map(ann => 
          ann.id === data.id ? { ...ann, ...data } : ann
        );
        commitMessage = `Update announcement ${data.id}`;
        break;
      case 'delete':
        console.log(`Attempting to delete announcement with ID: ${data.id}`);
        console.log('Current announcements:', announcements.map(a => a.id));
        updatedAnnouncements = announcements.filter(ann => ann.id !== data.id);
        commitMessage = `Delete announcement ${data.id}`;
        console.log(`Filtered announcements: ${updatedAnnouncements.length} (was ${announcements.length})`);
        break;
      default:
        return {
          statusCode: 400,
          body: JSON.stringify({ error: 'Invalid action' }),
        };
    }

    // Commit changes
    try {
      await octokit.repos.createOrUpdateFileContents({
        owner,
        repo,
        path: filePath,
        message: commitMessage,
        content: Buffer.from(JSON.stringify(updatedAnnouncements, null, 2)).toString('base64'),
        sha: fileData.sha,
        branch: baseBranch,
      });
      
      console.log(`Successfully committed changes for action: ${action}`);

      return {
        statusCode: 200,
        body: JSON.stringify({
          message: `Announcement ${action}d successfully`,
          data: action === 'create' ? updatedAnnouncements[updatedAnnouncements.length - 1] : updatedAnnouncements,
        }),
      };
    } catch (error) {
      console.error('Error committing changes to GitHub:', error);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Failed to commit changes to GitHub repository' }),
      };
    }
  } catch (error) {
    console.error('Error processing request:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to process request', details: error.message }),
    };
  }
};
