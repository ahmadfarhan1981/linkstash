# Running from code
You can also run LinkStash from the code.

## Pre-requisites 
- git 
- node
- pnpm
- mysql database

## Setting up the Development Environment
1. Clone the repository
   ```bash
   git clone https://github.com/ahmadfarhan1981/linkstash.git
   ```
2. make sure pnpm is installed 
   
   See: [Installing pnpm](https://pnpm.io/installation) 
   ```bash
   npm install -g pnpm
   ```
3. Install the pre-requisite
   ```bash
   pnpm install
   ```
4. Configure the backend
   
   **In the backend folder**:
      
   Create `.env.local` and configure database connection settings for the backend.
   > See configuration for all configuration settings.
   ```bash
   cd apps/linkstash-backend
   cp env.example env.local 
   nano env.local
   ```
5. Configure the frontend
   
   **In the frontend folder**:
   
   Create `.env.local` and configure database connection settings.
   > See configuration for all configuration settings.
   ```bash
   cd apps/linkstash-frontend
   cp env.example env.local 
   nano env.local
   ```
6. Initialize databse
   
   (back in the root directory)
   ```bash           
   pnpm --filter=linkstash-backend run migrate
   ```
7. Start the development servers
   ```bash
   pnpm -r run dev
   ```
