# Bloguer

![bloguer](https://socialify.git.ci/pulkitgarg04/bloguer/image?font=Inter&language=1&name=1&owner=1&pattern=Floating+Cogs&stargazers=1&theme=Dark)

<!-- <p align="center">
  <a href="https://hits.sh/github.com/pulkitgarg04/bloguer/">
    <img src="https://hits.sh/github.com/pulkitgarg04/bloguer.svg?style=plastic&color=0077bf" alt="Hits"/>
  </a>
</p> -->

**Bloguer** is a modern blogging platform designed to provide a seamless experience for creating, managing, and sharing blog content. Built with the latest technologies, Bloguer emphasizes speed, scalability, and a developer-friendly ecosystem.

The platform supports rich text formatting, image uploads, user authentication, and dynamic content delivery, ensuring a superior blogging experience.

### Setup and Installation
#### Pre-Requisites
- Node.js (v16 or above)
- Cloudflare Workers CLI (Wrangler)
- PostgreSQL Database
- npm or bun or yarn for package management

#### Installation
1. Clone the repository:
```bash
git clone https://github.com/pulkitgarg04/bloguer.git  
cd bloguer  
```

2. Install dependencies for both the client and server:

```bash
# Navigate to server and install
cd server
npm install

# Navigate to client and install
cd ../client
npm install
```

3. Set up Environment Variables for required variables and setup.

4. Run the server:
```bash
# In server shell
npm run dev
```

5. Run the frontend locally:
```bash
# In client shell
npm run dev  
```

### Environment Variables
The project relies on several environment variables. Create a .env file in the client directory with the following variables:

#### For Client:
```env
VITE_BACKEND_URL=https://your-cloudflare-worker-url
```

#### For Server:
- Add the environment variables to the `wrangler.toml` file.
```env
DATABASE_URL=your_postgresql_connection_string  
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_gemini_api_key_here
```

**Note**: To use the AI-powered article writing feature, you'll need to:
1. Get a Google Gemini API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Add it to your server's `wrangler.toml` file as `GEMINI_API_KEY`

### Tech Stack
#### Frontend
- **React**: For building a responsive and dynamic user interface.
- **React Router**: For handling routing in the single-page application.
- **Zustand**: Lightweight state management to handle user and session data.
- **Tailwind CSS**: For styling the application with a focus on customization and a responsive layout.
- **React Hot Toast**: For displaying user-friendly notifications.
- **TypeScript**: Ensures type safety and better developer experience.
- **Axios**: For API requests and client-server communication.

#### Backend
- **Hono**: Ultra-fast web framework for building the serverless API.
- **PostgreSQL**: Relational database for managing user and blog data.
- **Prisma**: ORM for seamless database integration with PostgreSQL.
- **JWT (JSON Web Tokens)**: For secure user authentication and session management.
- **Cloudflare Workers**: Serverless platform for deploying the backend globally.
- **Generative AI**: For AI-powered article content generation (secure backend integration).

### Features
- **Blog Management**: Create, edit, and delete blog posts.
- **AI-Powered Writing**: Generate article content using Generative AI based on title and category.
- **User Authentication**: Secure login and signup with JWT.
- **Rich Text Editor**: Enables dynamic content creation.
- **Serverless Architecture**: Ensures speed and scalability with Cloudflare Workers.

### Changelog
Refer to [CHANGELOG](CHANGELOG.md) for version history and updates.

### Contributing
We appreciate your interest in contributing to Bloguer! Your contributions help us improve and grow. Please feel free to submit pull requests, report issues, or suggest new features. Your feedback and participation are highly valued as we continue to develop and enhance the platform.

For detailed guidelines on how to contribute, please see our [CONTRIBUTING](CONTRIBUTING.md) file.

### License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.