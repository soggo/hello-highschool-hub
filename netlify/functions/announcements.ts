
import { Handler } from '@netlify/functions';
import { Octokit } from '@octokit/rest';

// Get GitHub authentication token from environment variables
const githubToken = process.env.GITHUB_TOKEN;
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
    
    // Validating required environment variables with clear error messages
    if (!githubToken) {
      console.error('GITHUB_TOKEN environment variable is not set');
      return {
        statusCode: 500,
        body: JSON.stringify({ 
          error: 'Server configuration error: GITHUB_TOKEN missing or invalid',
          details: 'The GitHub token is missing or invalid. Please check your Netlify environment variables.'
        }),
      };
    }

    if (!owner) {
      console.error('GITHUB_OWNER environment variable is not set');
      return {
        statusCode: 500,
        body: JSON.stringify({ 
          error: 'Server configuration error: GITHUB_OWNER missing',
          details: 'Make sure to set GITHUB_OWNER to your GitHub username (not the full URL)'
        }),
      };
    }

    if (!repo) {
      console.error('GITHUB_REPO environment variable is not set');
      return {
        statusCode: 500,
        body: JSON.stringify({ 
          error: 'Server configuration error: GITHUB_REPO missing',
          details: 'Make sure to set GITHUB_REPO to your repository name (not the full URL)'
        }),
      };
    }

    console.log(`Using GitHub repo: ${owner}/${repo}, branch: ${baseBranch}`);

    // Create Octokit instance with the token
    const octokit = new Octokit({
      auth: githubToken,
    });

    // Verify token first
    try {
      await octokit.rest.users.getAuthenticated();
      console.log('GitHub token is valid');
    } catch (error) {
      console.error('GitHub token validation error:', error);
      return {
        statusCode: 401,
        body: JSON.stringify({ 
          error: 'GitHub authentication failed',
          details: 'Your GitHub token is invalid or expired. Please generate a new token with the "repo" scope and update your Netlify environment variables.'
        }),
      };
    }

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
      
      // Provide more specific error message based on status code
      if (error.status === 404) {
        return {
          statusCode: 404,
          body: JSON.stringify({ 
            error: 'File not found',
            details: `The file ${filePath} was not found in repository ${owner}/${repo} on branch ${baseBranch}. Please make sure the repository and file path are correct.`
          }),
        };
      } else if (error.status === 401 || error.status === 403) {
        return {
          statusCode: error.status,
          body: JSON.stringify({ 
            error: 'Permission denied',
            details: 'The GitHub token does not have sufficient permissions. Make sure it has the "repo" scope.'
          }),
        };
      }
      
      return {
        statusCode: 500,
        body: JSON.stringify({ 
          error: 'Failed to fetch announcements file',
          details: error.message
        }),
      };
    }

    if (!('content' in fileData)) {
      return {
        statusCode: 404,
        body: JSON.stringify({ 
          error: 'File not found or is a directory',
          details: `${filePath} is not a file or doesn't exist`
        }),
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
        body: JSON.stringify({ 
          error: 'Failed to commit changes to GitHub repository',
          details: error.message
        }),
      };
    }
  } catch (error) {
    console.error('Error processing request:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'Failed to process request', 
        details: error.message 
      }),
    };
  }
};
