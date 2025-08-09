# Welcome to your Lovable project

## Firebase Setup Instructions

To enable real trip creation and chat functionality, you need to set up Firebase:

1. **Create a Firebase Project**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Click "Create a project"
   - Follow the setup wizard

2. **Enable Authentication**
   - In your Firebase project, go to Authentication
   - Click "Get started"
   - Enable "Anonymous" sign-in method

3. **Set up Firestore Database**
   - Go to Firestore Database
   - Click "Create database"
   - Choose "Start in test mode" for development
   - Select a location for your database

4. **Get your Firebase Configuration**
   - Go to Project Settings (gear icon)
   - Scroll down to "Your apps" section
   - Click "Add app" and select Web
   - Register your app and copy the config object

5. **Update Firebase Configuration**
   - Open `src/lib/firebase.ts`
   - Replace the placeholder config with your actual Firebase config:
   ```typescript
   const firebaseConfig = {
     apiKey: "your-actual-api-key",
     authDomain: "your-project.firebaseapp.com",
     projectId: "your-actual-project-id",
     storageBucket: "your-project.appspot.com",
     messagingSenderId: "your-sender-id",
     appId: "your-app-id"
   };
   ```

6. **Set up Firestore Security Rules** (Optional for production)
   - In Firestore Database, go to Rules tab
   - Update rules to secure your data appropriately

## Features

- **Real Trip Creation**: Users can create actual trips stored in Firebase
- **Trip Discovery**: Browse and filter real trips from other users
- **Real-time Chat**: Chat with trip creators using Firebase real-time messaging
- **Anonymous Authentication**: Users are automatically signed in anonymously
- **Responsive Design**: Works on all device sizes

## Project info

**URL**: https://lovable.dev/projects/f8dc81dd-9ac6-4373-948c-fea864149826

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/f8dc81dd-9ac6-4373-948c-fea864149826) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/f8dc81dd-9ac6-4373-948c-fea864149826) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
