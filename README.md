# College Event Management

A TypeScript-based web application for managing college events. This project includes functionality for event management, user authentication, and more.

## Table of Contents

- [Installation](#installation)
- [Running the Project](#running-the-project)
- [Building the Project](#building-the-project)
- [Deployment](#deployment)
- [License](#license)

## Installation

1. **Clone the Repository**

   ```bash
   git clone https://github.com/vishdev-git/typescript-event-management.git
   cd typescript-event-management
   ```

2. **Install Dependencies**

   Ensure you have Node.js and npm installed. Then run:

   ```bash
   npm install
   ```

## Running the Project

1. **Start the Development Server**

   To run the project in development mode with automatic recompilation, use:

   ```bash
   npm run dev
   ```

   This command will start the server and watch for file changes.

2. **Access the Application**

   Open your web browser and navigate to `http://localhost:3000` (or the port specified in your configuration).

## Building the Project

1. **Compile TypeScript to JavaScript**

   To compile the TypeScript files into JavaScript, use:

   ```bash
   npm run build
   ```

   This will generate the JavaScript files in the `dist` folder.

2. **Build CSS**

   If you have any CSS processing steps (like PostCSS with Tailwind), run:

   ```bash
   npm run build:css
   ```

3. **Build Validation Scripts**

   If you have validation scripts in TypeScript that need compilation, run:

   ```bash
   npm run build:validation
   ```

## Deployment

To deploy your project to GitHub Pages, follow these steps:

1. **Compile and Prepare Files**

   Ensure all your files are compiled and ready. Run the build commands:

   ```bash
   npm run build
   npm run build:css
   ```

2. **Deploy to GitHub Pages**

   Make sure you have the `gh-pages` package installed:

   ```bash
   npm install --save-dev gh-pages
   ```

   Add a deploy script to your `package.json` if you haven't already:

   ```json
   "scripts": {
     "deploy": "gh-pages -d dist"
   }
   ```

   Deploy the project:

   ```bash
   npm run deploy
   ```

   Your site will be available at `https://your-username.github.io/typescript-event-management/`.

## License

This project is licensed under the MIT License.

