
import { Context } from "@netlify/functions";
import { Octokit } from "octokit";
import { createReadStream } from 'fs';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import * as crypto from 'crypto';
import * as multiparty from 'multiparty';
import * as util from 'util';

export default async (req: Request, context: Context) => {
  // Only accept POST requests
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  try {
    // Parse the multipart/form-data for file upload
    const { fields, files } = await parseFormData(req);
    
    if (!files.file || !files.file[0]) {
      return new Response("No file uploaded", { status: 400 });
    }

    const file = files.file[0];
    const folder = fields.folder?.[0] || '';

    // Generate a unique filename to avoid collisions
    const fileName = generateUniqueFileName(file.originalFilename || 'image');
    
    // Read file as buffer
    const fileBuffer = fs.readFileSync(file.path);
    
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

// Helper function to parse multipart form data
async function parseFormData(request: Request): Promise<{fields: any, files: any}> {
  // Create a temporary directory for files
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'upload-'));
  
  // Get the request body as a buffer
  const buffer = await request.arrayBuffer();
  const bodyBuffer = Buffer.from(buffer);
  
  // Write the body to a temporary file
  const tempFilePath = path.join(tempDir, 'upload-body');
  fs.writeFileSync(tempFilePath, bodyBuffer);
  
  // Create a readable stream from the file
  const fileStream = createReadStream(tempFilePath);
  
  return new Promise((resolve, reject) => {
    const form = new multiparty.Form({
      uploadDir: tempDir,
      autoFiles: true,
    });
    
    form.parse(fileStream, function(err: any, fields: any, files: any) {
      if (err) {
        reject(err);
        return;
      }
      
      // Need to reformat the Content-Type header for multiparty
      const contentType = request.headers.get('content-type');
      if (contentType) {
        fileStream.headers = { 'content-type': contentType };
      }
      
      resolve({ fields, files });
      
      // Clean up temp files
      try {
        fs.unlinkSync(tempFilePath);
      } catch (e) {
        console.error("Error cleaning up temp file:", e);
      }
    });
  });
}

// Helper function to generate a unique filename
function generateUniqueFileName(originalName: string): string {
  const timestamp = Date.now();
  const randomString = crypto.randomBytes(8).toString('hex');
  const extension = path.extname(originalName);
  const baseName = path.basename(originalName, extension);
  
  return `${baseName}-${timestamp}-${randomString}${extension}`.toLowerCase();
}
