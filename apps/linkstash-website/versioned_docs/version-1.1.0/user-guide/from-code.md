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
2. **Set Up Environment Configurations:**
   - `.env` can be created by copying the `.env.example` files in their respective folders.
   - backend : `./apps/linkstash-backend/.env`
      - nextjs supports having environment specific env file e.g `env.local` for local development.
   - frontend : `./apps/linkstash-frontened/.env`
2. **Start the backend**
   1. Initialize databse
      ```bash
      npm -w=apps/linkstash-backend run migrate
      ```
   2. Start the application
      ```bash
      npm -w=apps/linkstash-backend start
      ```
3. **Start the frontend**
   1. Start the application
      ```bash
      npm start
      ```

