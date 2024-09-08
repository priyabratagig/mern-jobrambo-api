# JobRambo

> Better naming conventions, better-layed modules, separation of operations
> 

> Better security guidelines, json webtoken with live access authorization, http-only token, encrypted and https only cookie
> 

> Better database optimization split into atomic tables for limited works, enhanced indexation and validations
> 

```mermaid
erDiagram
    USERS {
        string _id PK
        boolean isrecruiter
        string fullname
        string phonenumber
        string email
        string password
    }

    ACCESSES {
        string _id PK
        string userid FK "Unique"
        boolean isadmin
        boolean isblocked
        date dashboardvalidity
    }

    PROFILES {
        string _id PK
        string userid FK "Unique"
        string bio
        string[] skills
        string resume
    }

    JOBS {
        string _id PK
        string title
        string description
        string[] requirements
        number salary
        string location
        string type
        number experience
        number positions
        string companyid FK "Unique-1"
        string recruiterid FK "Unique-1"
    }

    COMPANIES {
        string _id PK
        string name "Unique-1"
        string description
        string website "Unique-2"
        string location
        string logo
        string recruiterid FK "Unique-1, Unique-2"
    }

    JOBAPPLICATIONS {
        string _id PK
        string applicantid FK "Unique-1"
        string jobid FK "Unique-1"
        string status "applied|in-review|accepted|rejected"
        string companyid FK
        string recruiterid FK
    }

    %% Relationships
    USERS ||--|| ACCESSES : has
    USERS ||--|| PROFILES : has
    USERS ||--o{ COMPANIES : owns
    COMPANIES ||--o{ JOBS : offers
    JOBS ||--o{ JOBAPPLICATIONS : receives
    USERS ||--o{ JOBAPPLICATIONS : applies

```

```mermaid
sequenceDiagram
    participant Client
    participant Server
    participant CrossMiddleware
    participant CookieParser
    participant AuthMiddleware
    participant API

    %% For a successful API request
    Client->>Server: Sends API Request (e.g., '/api/some-endpoint')
    Server->>CrossMiddleware: Pass Request to Cross Middleware
    CrossMiddleware-->>Server: Check Request Source (Pass)
    Server->>CookieParser: Pass Request to Cookie Parser
    CookieParser-->>Server: Parse and Decrypt Cookies
    Server->>AuthMiddleware: Pass Request to Auth Middleware
    AuthMiddleware-->>Server: Parse Access Token and Check Authorization (Pass)
    Server->>API: Forward Request to API
    API-->>Server: Process API Logic
    Server-->>Client: Return API Response

```

```mermaid
sequenceDiagram
    participant Client
    participant Server
    participant StaticMiddleware
    participant File

    %% For a successful static webpage request
    Client->>Server: Sends Webpage Request (e.g., '/home')
    Server->>StaticMiddleware: Pass Request to Static Middleware
    StaticMiddleware-->>Server: Serve Static Files
    Server->>File: Retrieve Static File (e.g., '/home.html')
    File-->>Server: Return File Content
    Server-->>Client: Return Webpage

```

```mermaid
graph TD
    %% Define the layers and components of the server architecture
    Client[Client]
    Server[Server]

    subgraph WebLayer
        StaticMiddleware[Static Middleware]
    end

    subgraph MiddlewareLayer
        CrossMiddleware[Cross Middleware]
        CookieParser[Cookie Parser]
        AuthMiddleware[Authentication Middleware]
    end

    subgraph APILayer
        Contollers[Contollers]
        Services[Services]
        Repositories[Repositories]
    end

    %% Define the connections between layers
    Client -->|Requests| Server
    Server -->|Static Requests| StaticMiddleware
    StaticMiddleware -->|File Retrieval| File[Static Files]

    Server -->|API Requests| CrossMiddleware
    CrossMiddleware -->|Request Forwarding| CookieParser
    CookieParser -->|Request Forwarding| AuthMiddleware
    AuthMiddleware -->|Authorization| Contollers
    Contollers -->|Bussiness Logic| Services
    Services -->|Read/Write Operation| Repositories
    Repositories -->|Data Access| Database

    %% Additional connections
    AuthMiddleware -->|Token Validation| Auth[Authentication Service]
    API -->|Response| Server
    Server -->|Response| Client

```

```mermaid
graph TD
    %% Define components
    Client[Client]
    Server[Server]

    subgraph MiddlewareLayer
		    CrosMiddleware[cros.middleware]
		    CookieMiddleware[cookie.middleware]
        AuthMiddleware[authentication.middleware]
        Staticmiddleware[express.static.middleware]
    end

    subgraph ControllerLayer
        AuthController[auth.controller]
        UserController[user.controller]
        CompanyController[company.controller]
        JobController[job.controller]
        JobApplicationController[jobapplication.controller]
        PaymentController[payment.controller]
        WebAppController[webapp.controller]
    end

    subgraph ServiceLayer
        AuthService[auth.service]
        UserService[user.service]
        CompanyService[company.service]
        JobService[job.service]
        JobApplicationService[jobapplication.service]
        AccessService[access.service]
    end

    subgraph RepositoryLayer
        UserRepository[user.repository]
        AccessRepository[access.repository]
        ProfileRepository[profile.repository]
        CompanyRepository[company.repository]
        JobRepository[job.repository]
        JobApplicationRepository[jobapplication.repository]
    end

    subgraph ModelLayer
        UserModel[user.model]
        AccessModel[access.model]
        ProfileModel[profile.model]
        CompanyModel[company.model]
        JobModel[job.model]
        JobApplicationModel[jobapplication.model]
    end

    subgraph DatabaseLayer
        Database[Database]
    end

    %% Define connections
    Client -->|Requests| Server
    Server -->|Webpage| Staticmiddleware

    %% Middleware flows
    Server -->|Request Validation| CrosMiddleware
    CrosMiddleware -->|Source Validation| CookieMiddleware
    CookieMiddleware -->|Cookie Decryption| AuthMiddleware 
    AuthMiddleware -->|Authenticate/Authorize| AuthController
    AuthMiddleware -->|Authenticate/Authorize| UserController
    AuthMiddleware -->|Authenticate/Authorize| CompanyController
    AuthMiddleware -->|Authenticate/Authorize| JobController
    AuthMiddleware -->|Authenticate/Authorize| JobApplicationController
    Staticmiddleware -->|Auth Middleware| WebAppController

    %% Controller to Service connections
    AuthController -->|Uses| AuthService
    AuthController -->|Uses| UserService
    UserController -->|Uses| UserService
    CompanyController -->|Uses| CompanyService
    JobController -->|Uses| JobService
    JobApplicationController -->|Uses| JobApplicationService
    PaymentController -->|Uses| UserService
    PaymentController -->|Uses| AccessService

    %% Service to Repository connections
    AuthService -->|Uses| UserRepository
    AuthService -->|Uses| AccessRepository
    UserService -->|Uses| UserRepository
    UserService -->|Uses| ProfileRepository
    UserService -->|Uses| AccessRepository
    CompanyService -->|Uses| CompanyRepository
    JobService -->|Uses| JobRepository
    JobService -->|Uses| AccessRepository
    JobApplicationService -->|Uses| JobApplicationRepository
    JobApplicationService -->|Uses| JobRepository
    AccessService -->|Uses| AccessRepository

    %% Repository to Model connections
    UserRepository -->|Manages| UserModel
    AccessRepository -->|Manages| AccessModel
    ProfileRepository -->|Manages| ProfileModel
    CompanyRepository -->|Manages| CompanyModel
    JobRepository -->|Manages| JobModel
    JobApplicationRepository -->|Manages| JobApplicationModel

    %% Model to Database connections
    UserModel -->|Queries| Database
    AccessModel -->|Queries| Database
    ProfileModel -->|Queries| Database
    CompanyModel -->|Queries| Database
    JobModel -->|Queries| Database
    JobApplicationModel -->|Queries| Database

```

Architecture