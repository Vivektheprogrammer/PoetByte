# Deploying PoetByte to Vercel

This guide will help you deploy your PoetByte application to Vercel.

## Prerequisites

1. A [Vercel account](https://vercel.com/signup)
2. A [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register) account for database hosting

## Step 1: Set Up MongoDB Atlas

1. Create a MongoDB Atlas cluster if you don't have one
2. Create a database user with read/write permissions
3. Add your IP address to the network access list (or allow access from anywhere for development)
4. Get your MongoDB connection string from Atlas

## Step 2: Deploy to Vercel

### Option 1: Deploy via GitHub

1. Push your code to a GitHub repository
2. Log in to your Vercel account
3. Click "Add New" → "Project"
4. Import your GitHub repository
5. Configure the project:
   - Framework Preset: Next.js
   - Root Directory: ./poetbyte (if your repository contains the poetbyte folder)
6. Add the following environment variables:
   - `MONGODB_URI`: Your MongoDB Atlas connection string
   - `NEXTAUTH_SECRET`: A secure random string for session encryption
   - `NEXTAUTH_URL`: Your production URL (e.g., https://your-app.vercel.app)
7. Click "Deploy"

### Option 2: Deploy via Vercel CLI

1. Install Vercel CLI: `npm i -g vercel`
2. Navigate to your project directory
3. Run `vercel login` and follow the prompts
4. Run `vercel` to deploy
5. Follow the CLI prompts to configure your project
6. Set the required environment variables when prompted

## Step 3: Verify Deployment

1. Once deployed, Vercel will provide a URL to your application
2. Visit the URL to ensure everything is working correctly
3. Test the admin login functionality
4. Verify that poems and feedback are being stored in your MongoDB database

## Troubleshooting

- If you encounter database connection issues, verify your MongoDB URI is correct
- For authentication problems, check that your NEXTAUTH_SECRET and NEXTAUTH_URL are properly set
- If you need to update environment variables, go to your project settings in the Vercel dashboard

## Updating Your Deployment

Any changes pushed to your main branch will automatically trigger a new deployment if you used the GitHub integration.

For manual updates using the CLI, run `vercel --prod` to deploy changes to production.