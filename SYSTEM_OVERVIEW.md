# Bloguer - System Architecture Overview

## High-Level System Architecture

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

## Detailed Component Flow

### 1. Authentication & User Management Flow

```mermaid
flowchart TD
    Start[User Signup/Login] --> AuthType{Auth Type?}
    
    AuthType -->|Credentials| CredentialAuth[Email/Password Auth]
    AuthType -->|OAuth| GoogleAuth[Google OAuth]
    
    CredentialAuth --> ValidateInput[Zod Validation]
    ValidateInput --> HashPassword[Bcrypt Hash Password]
    HashPassword --> CreateUser[Create User in DB]
    CreateUser --> GenToken[Generate Verification Token]
    GenToken --> SendEmail[Send Verification Email]
    SendEmail --> WaitVerify[Wait for Email Verification]
    WaitVerify --> VerifyClick[User Clicks Email Link]
    VerifyClick --> MarkVerified[Mark Email as Verified]
    MarkVerified --> AllowLogin[Allow Login]
    
    GoogleAuth --> CheckGoogleUser{User Exists?}
    CheckGoogleUser -->|No| CreateGoogleUser[Create User with Google Data]
    CheckGoogleUser -->|Yes| FetchGoogleUser[Fetch User]
    CreateGoogleUser --> AutoVerify[Auto-Verify Email]
    FetchGoogleUser --> AllowLogin
    AutoVerify --> AllowLogin
    
    AllowLogin --> GenerateJWT[Generate JWT Token]
    GenerateJWT --> ReturnToken[Return Token to Client]
    ReturnToken --> StoreToken[Store in Auth Store]
```

### 2. Password Reset Flow

```mermaid
flowchart TD
    ForgotPassword[User Clicks Forgot Password] --> EnterEmail[Enter Email]
    EnterEmail --> ValidateEmail[Validate Email Format]
    ValidateEmail --> FindUser{User Exists?}
    
    FindUser -->|No| ErrorMsg[Show Error]
    FindUser -->|Yes| GenResetToken[Generate Reset Token]
    
    GenResetToken --> SaveToken[Save Token in DB with 1hr Expiry]
    SaveToken --> SendResetEmail[Send Password Reset Email]
    SendResetEmail --> UserClicksLink[User Clicks Reset Link]
    
    UserClicksLink --> ValidateToken{Token Valid?}
    ValidateToken -->|No/Expired| ShowError[Show Error]
    ValidateToken -->|Yes| ShowResetForm[Show Reset Password Form]
    
    ShowResetForm --> EnterNewPassword[Enter New Password]
    EnterNewPassword --> ValidatePassword[Validate Password Strength]
    ValidatePassword --> HashNewPassword[Hash New Password]
    HashNewPassword --> UpdatePassword[Update Password in DB]
    UpdatePassword --> ClearToken[Clear Reset Token]
    ClearToken --> RedirectLogin[Redirect to Login]
```

### 3. Blog Post Management Flow

```mermaid
flowchart TD
    CreatePost[Create Post Request] --> AuthCheck{Authenticated?}
    AuthCheck -->|No| Unauthorized[Return 401]
    AuthCheck -->|Yes| ValidatePost[Validate Post Input]
    
    ValidatePost --> CheckTitle{Title Valid?}
    ValidatePost --> CheckContent{Content Valid?}
    ValidatePost --> CheckCategory{Category Valid?}
    
    CheckTitle -->|No| ValidationError[Return Validation Error]
    CheckContent -->|No| ValidationError
    CheckCategory -->|No| ValidationError
    
    CheckTitle -->|Yes| AllValid{All Valid?}
    CheckContent -->|Yes| AllValid
    CheckCategory -->|Yes| AllValid
    
    AllValid --> CalcReadTime[Calculate Read Time]
    CalcReadTime --> SetImage[Set Featured Image]
    SetImage --> SavePost[Save to Database]
    SavePost --> InvalidateCache[Invalidate Relevant Caches]
    InvalidateCache --> ReturnPost[Return Post Data]
    
    GetPost[Get Post Request] --> CheckCache{Cache Hit?}
    CheckCache -->|Yes| ReturnCached[Return Cached Data]
    CheckCache -->|No| FetchDB[Fetch from Database]
    
    FetchDB --> IncrementViews[Increment View Count]
    IncrementViews --> TrackAnalytics[Track Analytics]
    TrackAnalytics --> GetSimilar[Get Similar Posts]
    GetSimilar --> CacheResult[Cache Result]
    CacheResult --> ReturnData[Return Post Data]
```

### 4. Analytics & Tracking System

```mermaid
flowchart TD
    UserVisit[User Visits Post] --> CaptureData[Capture Visit Data]
    
    CaptureData --> GetIP[Get IP Address]
    CaptureData --> GetUserAgent[Get User Agent]
    CaptureData --> GetReferrer[Get Referrer]
    CaptureData --> GetVisitorID[Get/Generate Visitor ID]
    
    GetIP --> Geolocation[IP Geolocation Lookup]
    Geolocation --> GetCountry[Determine Country]
    
    GetUserAgent --> ParseDevice{Parse Device Type}
    ParseDevice --> Mobile[Mobile]
    ParseDevice --> Desktop[Desktop]
    ParseDevice --> Other[Other]
    
    GetReferrer --> ClassifySource{Classify Source}
    ClassifySource --> Direct[Direct]
    ClassifySource --> Social[Social Media]
    ClassifySource --> Search[Search Engine]
    ClassifySource --> Referral[Referral]
    
    GetVisitorID --> CheckReturning{Returning Visitor?}
    CheckReturning -->|Yes| MarkReturning[Mark as Returning]
    CheckReturning -->|No| MarkNew[Mark as New]
    
    GetCountry --> CreateEvent[Create PostView Event]
    Mobile --> CreateEvent
    Desktop --> CreateEvent
    Other --> CreateEvent
    Direct --> CreateEvent
    Social --> CreateEvent
    Search --> CreateEvent
    Referral --> CreateEvent
    MarkReturning --> CreateEvent
    MarkNew --> CreateEvent
    
    CreateEvent --> SaveEvent[Save to Database]
    SaveEvent --> UpdateMetrics[Update Post Metrics]
```

### 5. AI Content Assistance Flow

```mermaid
flowchart TD
    UserRequest[User Requests AI Help] --> AuthCheck{Authenticated?}
    AuthCheck -->|No| Unauthorized[Return 401]
    AuthCheck -->|Yes| ValidatePrompt[Validate Prompt]
    
    ValidatePrompt --> CheckLength{Valid Length?}
    CheckLength -->|No| Error[Return Error]
    CheckLength -->|Yes| PrepareRequest[Prepare AI Request]
    
    PrepareRequest --> CallGemini[Call Google Gemini API]
    CallGemini --> WaitResponse[Wait for AI Response]
    
    WaitResponse --> CheckSuccess{Success?}
    CheckSuccess -->|No| AIError[Return AI Error]
    CheckSuccess -->|Yes| ParseResponse[Parse AI Response]
    
    ParseResponse --> FormatContent[Format Content]
    FormatContent --> ReturnToUser[Return to User]
```

### 6. Caching Strategy

```mermaid
flowchart TD
    Request[Incoming Request] --> CacheType{Request Type?}
    
    CacheType --> BulkPosts[Bulk Posts List]
    CacheType --> PopularPosts[Popular Posts]
    CacheType --> FollowingPosts[Following Posts]
    CacheType --> SinglePost[Single Post]
    
    BulkPosts --> BulkCache[Cache: 10 min]
    PopularPosts --> PopularCache[Cache: 6 hours]
    FollowingPosts --> FollowingCache[Cache: 3 min]
    SinglePost --> PostCache[Cache: 2 min]
    
    BulkCache --> CheckBulk{Cache Exists?}
    PopularCache --> CheckPopular{Cache Exists?}
    FollowingCache --> CheckFollowing{Cache Exists?}
    PostCache --> CheckPost{Cache Exists?}
    
    CheckBulk -->|Yes| ReturnCached[Return Cached]
    CheckBulk -->|No| FetchDB[Fetch from DB]
    CheckPopular -->|Yes| ReturnCached
    CheckPopular -->|No| FetchDB
    CheckFollowing -->|Yes| ReturnCached
    CheckFollowing -->|No| FetchDB
    CheckPost -->|Yes| ReturnCached
    CheckPost -->|No| FetchDB
    
    FetchDB --> CacheData[Cache Data]
    CacheData --> ReturnData[Return Data]
    
    Mutation[Create/Update/Delete] --> InvalidateCache[Invalidate Cache]
    InvalidateCache --> ClearPattern[Clear Cache Pattern]
    ClearPattern --> NextRequest[Next Request Rebuilds Cache]
```

### 7. Comment System Flow

```mermaid
flowchart TD
    CreateComment[Create Comment] --> AuthCheck{Authenticated?}
    AuthCheck -->|No| Unauthorized[Return 401]
    AuthCheck -->|Yes| ValidateComment[Validate Comment Content]
    
    ValidateComment --> CheckLength{1-1000 chars?}
    CheckLength -->|No| ValidationError[Return Error]
    CheckLength -->|Yes| SaveComment[Save to Database]
    
    SaveComment --> LinkToPost[Link to Post]
    SaveComment --> LinkToAuthor[Link to Author]
    LinkToPost --> ReturnComment[Return Comment]
    LinkToAuthor --> ReturnComment
    
    DeleteComment[Delete Comment] --> GetComment[Get Comment]
    GetComment --> CheckOwnership{Is Owner?}
    CheckOwnership --> IsCommentAuthor{Comment Author?}
    CheckOwnership --> IsPostAuthor{Post Author?}
    
    IsCommentAuthor -->|Yes| AllowDelete[Allow Delete]
    IsPostAuthor -->|Yes| AllowDelete
    IsCommentAuthor -->|No| CheckPost[Check Post]
    CheckPost --> IsPostAuthor
    IsPostAuthor -->|No| Forbidden[Return 403]
    
    AllowDelete --> RemoveComment[Remove from Database]
    RemoveComment --> Success[Return Success]
```

### 8. Data Validation Flow

```mermaid
flowchart TD
    Request[API Request] --> ExtractBody[Extract Request Body]
    ExtractBody --> ValidationSchema{Schema Type?}
    
    ValidationSchema --> SignupSchema[Signup Schema]
    ValidationSchema --> LoginSchema[Login Schema]
    ValidationSchema --> BlogSchema[Blog Schema]
    ValidationSchema --> CommentSchema[Comment Schema]
    ValidationSchema --> ResetSchema[Reset Password Schema]
    
    SignupSchema --> ValidateUsername[Username: 3-20 chars, alphanumeric]
    SignupSchema --> ValidateEmail[Email: Regex pattern]
    SignupSchema --> ValidatePassword[Password: 8-128 chars + complexity]
    SignupSchema --> ValidateName[Name: 2-50 chars]
    
    LoginSchema --> ValidateLoginEmail[Email format]
    LoginSchema --> ValidateLoginPassword[Password format]
    
    BlogSchema --> ValidateTitle[Title: 5-100 chars]
    BlogSchema --> ValidateContent[Content: 20-50000 chars]
    BlogSchema --> ValidateCategory[Category: 1-30 chars]
    
    CommentSchema --> ValidateCommentContent[Content: 1-1000 chars]
    
    ResetSchema --> ValidateToken[Token: 64-char hex]
    ResetSchema --> ValidateNewPassword[Password: Strong format]
    
    ValidateUsername --> ZodParse[Zod SafeParse]
    ValidateEmail --> ZodParse
    ValidatePassword --> ZodParse
    ValidateName --> ZodParse
    ValidateLoginEmail --> ZodParse
    ValidateLoginPassword --> ZodParse
    ValidateTitle --> ZodParse
    ValidateContent --> ZodParse
    ValidateCategory --> ZodParse
    ValidateCommentContent --> ZodParse
    ValidateToken --> ZodParse
    ValidateNewPassword --> ZodParse
    
    ZodParse --> ParseResult{Valid?}
    ParseResult -->|No| GetFirstError[Get First Error]
    ParseResult -->|Yes| ProceedService[Proceed to Service]
    
    GetFirstError --> ReturnError[Return Error Message]
    ProceedService --> BusinessLogic[Execute Business Logic]
```

## Technology Stack

### Frontend

- **Framework**: React 18 with TypeScript
- **Routing**: React Router v6
- **State Management**: Zustand (Auth Store)
- **Styling**: Tailwind CSS
- **Build Tool**: Vite
- **HTTP Client**: Axios
- **Notifications**: React Hot Toast
- **Deployment**: Vercel

### Backend

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **ORM**: Prisma
- **Database**: PostgreSQL
- **Validation**: Zod (via @pulkitgarg04/bloguer-validations)
- **Authentication**: JWT + Passport.js (Google OAuth)
- **Password Hashing**: Bcrypt
- **Email**: Nodemailer with Gmail SMTP
- **Caching**: Redis
- **AI Integration**: Google Gemini AI
- **Geolocation**: IP-to-Country lookup

### DevOps & Infrastructure

- **Containerization**: Docker
- **Version Control**: Git/GitHub
- **Development**: ts-node-dev (hot reload)
- **Environment**: dotenv

## Key Features

1. **Email Verification System**
   - 24-hour token expiry
   - Resend verification option
   - Auto-verified for Google OAuth users

2. **Password Reset**
   - 1-hour token expiry
   - Secure token generation (crypto.randomBytes)
   - Email-based reset flow

3. **Blog Management**
   - Create, read, update, delete posts
   - Auto-generated read time calculation
   - Category-based organization
   - Featured images per category

4. **Analytics Dashboard**
   - Real-time view tracking
   - Geographic distribution
   - Device type breakdown
   - Traffic source classification
   - Engagement metrics
   - 30-day trend analysis

5. **Social Features**
   - Follow/unfollow authors
   - Bookmark posts
   - Comment on posts
   - View following feed

6. **Performance Optimization**
   - Multi-layer caching with Redis
   - Cache invalidation on mutations
   - Efficient database queries with Prisma
   - Visitor ID tracking for unique views

7. **Security**
   - JWT-based authentication
   - Bcrypt password hashing (12 rounds)
   - Input validation at all layers
   - Rate limiting ready
   - Email verification enforcement

8. **AI Assistance**
   - Google Gemini integration
   - Content generation help
   - Writing suggestions
