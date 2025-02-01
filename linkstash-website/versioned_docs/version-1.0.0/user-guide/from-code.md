# Running from code
You can also run LinkStash from the code.

## Pre-requisites 
- git 
- nvm
- node
- mysql database

## Setting up the Development Environment
1. Clone the repository
   ```bash
   git clone http://github.linkstash/
   ```
2. **Start the backend** 
   1. Switch to the backend folder
      ```bash
      cd linkstash-backend
      ```
   2. Create `.env.local` and configure database connection settings.
      > See configuration for all configuration settings.
      ```bash
      cp env.example env.local 
      nano env.local
      ```
    3. Initialize databse
       ```bash          
       nvm use
       npm run migrate
       ```
    4. Start the application
           ```bash
           npm start
           ```
3. **Start the frontend**
   1. Switch to the backend folder
      ```bash
      cd linkstash-frontend
      ```
   2. Create `.env.local` and configure database connection settings.
      > See configuration for all configuration settings.
      ```bash
      cp env.example env.local 
      nano env.local
      ```
    3. Start the application
           ```bash
           npm start
           ```

