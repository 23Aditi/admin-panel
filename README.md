# admin-panel
# Admin Panel Project

Full-stack admin panel application with React frontend and Node.js backend.

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- Yarn package manager

### Installation

1. Clone the repository
```bash
git clone [repository-url]
cd admin-panel
```

2. Install Dependencies
You'll need to install dependencies for both frontend and backend:

```bash
# Install backend dependencies
cd backend
yarn install

# Install frontend dependencies
cd ../frontend
yarn install
```

### Running the Application

Start both servers in separate terminal windows:

```bash
# Terminal 1 - Backend
cd backend
yarn start

# Terminal 2 - Frontend
cd frontend
yarn start
```

### Development Notes
- Always keep yarn.lock files in version control
- Run `yarn install` in both frontend and backend directories after pulling updates
- Node modules are not tracked in git - they will need to be reinstalled when setting up on a new machine