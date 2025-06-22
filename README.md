# Para Summarizer

This project is a AI text summarizer application built with React and Vite, and also packaged as a Chrome extension.

## Getting Started

To get started with this project locally, follow these steps:

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository.
git clone https://github.com/Spectual/para-summarizer

# Step 2: Navigate to the project directory.
cd para-summarizer

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server.
npm run dev
```

## Building the Chrome Extension

To build the Chrome extension, run the following command:

```sh
npm run build:extension
```

This will create a `dist` directory with the production build of the React app, and then create an `extension` directory containing all the necessary files for the Chrome extension.

You can then load the `extension` directory as an unpacked extension in Chrome.

## Technologies Used

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
