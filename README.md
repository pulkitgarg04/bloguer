# Bloguer

![bloguer](https://socialify.git.ci/pulkitgarg04/bloguer/image?font=Inter&language=1&name=1&owner=1&pattern=Floating+Cogs&stargazers=1&theme=Dark)

<!-- <p align="center">
  <a href="https://hits.sh/github.com/pulkitgarg04/bloguer/">
    <img src="https://hits.sh/github.com/pulkitgarg04/bloguer.svg?style=plastic&color=0077bf" alt="Hits"/>
  </a>
</p> -->

**Bloguer** is a modern blogging platform designed to provide a seamless experience for creating, managing, and sharing blog content. Built with the latest technologies, Bloguer emphasizes speed, scalability, and a developer-friendly ecosystem.

The platform supports rich text formatting, image uploads, user authentication, and dynamic content delivery, ensuring a superior blogging experience.

### System Architecture:
```mermaid
flowchart TD
    User[User] -->|Accesses as| GuestUser[Guest User]
    User -->|Accesses as| RegisteredUser[Registered User]

    subgraph GuestUser[Guest User Access]
        direction TB
        GU_Browse[Browse Blog Posts] --> GU_Read[Read Published Posts]
        GU_Read --> GU_View[View Analytics/Stats]
        GU_Browse --> GU_Search[Search Posts]
    end

    subgraph RegisteredUser[Registered User Access]
        direction TB
        RU_Auth[Authentication] --> RU_Verify{Email Verified?}
        RU_Verify -->|No| RU_VerifyEmail[Email Verification Required]
        RU_Verify -->|Yes| RU_Access[Full Access]
        
        RU_Access --> RU_CreatePost[Create Blog Post]
        RU_Access --> RU_EditPost[Edit/Delete Posts]
        RU_Access --> RU_Comment[Add Comments]
        RU_Access --> RU_Bookmark[Bookmark Posts]
        RU_Access --> RU_Follow[Follow Authors]
        RU_Access --> RU_Analytics[View Detailed Analytics]
        RU_Access --> RU_AIAssist[AI Content Assistance]
    end

    GuestUser --> Frontend
    RegisteredUser --> Frontend

    Frontend[React Frontend] --> Router[React Router]
    Router --> PublicPages[Public Pages]
    Router --> ProtectedPages[Protected Pages]

    PublicPages --> API
    ProtectedPages --> |JWT Token| API

    API[Express Backend API] --> Auth[Authentication Layer]
    Auth --> |Validates| JWT[JWT Tokens]
    Auth --> |Verifies| EmailVerification[Email Verification]
    
    API --> Cache{Redis Cache?}
    Cache -->|Hit| CachedData[Return Cached Data]
    Cache -->|Miss| Services[Service Layer]
    
    Services --> BlogService[Blog Service]
    Services --> UserService[User Service]
    Services --> CommentService[Comment Service]
    Services --> AIService[AI Service]
    
    BlogService --> Validation[Zod Validation]
    UserService --> Validation
    CommentService --> Validation
    
    Validation --> Repository[Repository Layer]
    Repository --> Prisma[Prisma ORM]
    Prisma --> Database[(PostgreSQL Database)]
    
    AIService --> GoogleAI[Google Gemini AI]
    
    Services --> Email[Email Service]
    Email --> Nodemailer[Nodemailer]
    Nodemailer --> SMTP[Gmail SMTP]
    
    BlogService --> Analytics[Analytics Tracking]
    Analytics --> GeoIP[IP Geolocation]
    Analytics --> Metrics[Metrics Collection]
    Metrics --> Database
```

**[View System Architecture & Flow Diagrams](SYSTEM_OVERVIEW.md)**

### Setup and Installation
#### Pre-Requisites
- Node.js (v16 or above)
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

The project relies on several environment variables. Create a `.env` file in both the client and server directories based on the provided examples:

- **Server**: See [server/.env.example](server/.env.example) for required backend configuration
- **Client**: See [client/.env.example](client/.env.example) for required frontend configuration

#### Key Environment Variables:

**Server (.env):**
- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - Secret key for JWT token generation
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS` - Email configuration for Nodemailer
- `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` - Google OAuth credentials
- `GEMINI_API_KEY` - Google Gemini AI API key
- `REDIS_URL` - Redis connection string for caching
- `PORT` - Server port (default: 4000)

**Client (.env):**
- `VITE_BACKEND_URL` - Backend API URL
- `VITE_GOOGLE_CLIENT_ID` - Google OAuth Client ID

**Note**: To use the AI-powered article writing feature, you'll need to:
- Get a Google Gemini API key from [Google AI Studio](https://makersuite.google.com/app/apikey)


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