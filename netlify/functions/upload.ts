
import { Context } from "@netlify/functions";
import { Octokit } from "octokit";
import { createReadStream } from 'fs';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import * as crypto from 'crypto';
import * as multiparty from 'multiparty';

export default async (req: Request, context: Context) => {
  // Only accept POST requests
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  try {
    // Parse the multipart/form-data for file upload
    const formData = await req.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return new Response("No file uploaded", { status: 400 });
    }

    const folder = formData.get('folder') as string || '';
    
    // Generate a unique filename to avoid collisions
    const fileName = generateUniqueFileName(file.name || 'image');
    
    // Convert file to buffer
    const fileArrayBuffer = await file.arrayBuffer();
    const fileBuffer = Buffer.from(fileArrayBuffer);
    
    // Convert to base64 for GitHub API
    const fileContent = fileBuffer.toString('base64');
    
    // Get GitHub credentials from environment variables
    const token = process.env.GITHUB_TOKEN;
    const repo = process.env.GITHUB_REPO;
    const owner = process.env.GITHUB_OWNER;
    
    if (!token || !repo || !owner) {
      return new Response("GitHub configuration missing", { status: 500 });
    }
    
    // Create Octokit instance
    const octokit = new Octokit({ auth: token });
    
    // Define the upload path in the public folder
    const uploadPath = folder ? `public/${folder}/${fileName}` : `public/${fileName}`;
    
    // Upload file to GitHub repository
    const response = await octokit.rest.repos.createOrUpdateFileContents({
      owner,
      repo,
      path: uploadPath,
      message: `Upload ${fileName}`,
      content: fileContent,
      committer: {
        name: "Netlify Function",
        email: "netlify@function.com"
      }
    });
    
    // Return path to use for the image
    const imagePath = folder ? `/${folder}/${fileName}` : `/${fileName}`;
    
    return new Response(
      JSON.stringify({ 
        path: imagePath,
        success: true
      }),
      { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );
    
  } catch (error) {
    console.error("Error uploading file:", error);
    return new Response(
      JSON.stringify({ 
        error: "Failed to upload file",
        details: error.message 
      }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
};

// Helper function to generate a unique filename
function generateUniqueFileName(originalName: string): string {
  const timestamp = Date.now();
  const randomString = crypto.randomBytes(8).toString('hex');
  const extension = path.extname(originalName);
  const baseName = path.basename(originalName, extension);
  
  return `${baseName}-${timestamp}-${randomString}${extension}`.toLowerCase();
}
