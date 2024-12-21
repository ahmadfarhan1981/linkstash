# Contributing to LinkStash

## How to Contribute
- [Contributing to LinkStash](#contributing-to-linkstash)
  - [How to Contribute](#how-to-contribute)
  - [Interact](#interact)
    - [Community](#community)
    - [Questions](#questions)
  - [Report](#report)
    - [Bug Reports](#bug-reports)
    - [Enhancement Requests](#enhancement-requests)
    - [Improving documentation](#improving-documentation)
  - [Change](#change)
    - [Submitting Pull Requests](#submitting-pull-requests)
  - [Development](#development)
    - [Technology Stack](#technology-stack)
    - [Pre-requisites for Development](#pre-requisites-for-development)
    - [Setting up the Development Environment](#setting-up-the-development-environment)
  - [Community Standards](#community-standards)
## Interact
Interacting with the project is a great way to contribute, even with minimal commitment. Here’s how you can get involved:

### Community
- **Star the Repository**: helps with visibility 
- **Join Discussions**: Participate in [GitHub Discussions](https://github.com/ahmadfarhan1981/linkstash/discussions).
- **Spread the Word**: Share with others or on social media. 

### Questions
If you have questions about LinkStash, you can post them in the [Q&A section](https://github.com/ahmadfarhan1981/linkstash/discussions/categories/q-a) of the discussions tab. 
- Be specific when asking questions to ensure quick and accurate responses.
- Provide context about your setup or the issue you’re facing.


## Report
If you encounter a bug or have a feature request, please [open an issue](https://github.com/ahmadfarhan1981/linkstash/issues).

### Bug Reports

To report a bug effectively:
- **Title**: Provide a clear, concise, and descriptive title for the issue.
- **Steps to Reproduce**: Include detailed steps to replicate the issue. The more precise, the better.
- **Expected vs. Actual Behavior**: Describe what you expected to happen and what actually occurred.
- **Screenshots/Logs**: Add screenshots, error messages, or relevant logs if available. These are invaluable for debugging.

### Enhancement Requests

If you have an idea for improving LinkStash:
- Clearly explain the feature or enhancement you're proposing.
- Describe the problem it solves or the value it adds.
- If possible, include examples of how it would be used.
- Try to concentrate on use case rather than implementation details

By providing detailed and actionable information, you can help ensure your feedback is addressed promptly and effectively.

### Improving documentation
If anything in the [user guide](https://linkstashapp.com) is not accurate, you can also report the issue. Some notes on documentation issues:
  - make sure you are on the latest version
  - explain the behaviour now vs behaviour mentioned in the user guide.
  - if possible include screenshots of page with the discrepency in the aplication where applicable. 

## Change 

### Submitting Pull Requests
Report bugs or suggest features via [pull requests](https://github.com/ahmadfarhan1981/linkstash/pulls).

- **Focus on Clarity**: Ensure your PR clearly explains the changes you've made and why they are necessary.
- **Small and Scoped Changes**: Keep your PR focused on one feature or issue to make reviewing and merging easier.
- **Reference Issues**: Link your PR to relevant issues (e.g., "Fixes #123") to provide context.
- **Document Changes**: Update relevant documentation, including the README or other guides, if your PR introduces new features or alters functionality.

**TODO** 
Style guide

## Development

### Technology Stack
- Backend: [LoopBack 4](https://loopback.io/)
- Frontend: [Next.js](https://nextjs.org/)

### Pre-requisites for Development
- **Node Version Management:** Use `nvm` for easy switching between Node.js versions for the frontend and backend.
- Do this individually in the backend/frontend folders:
  - To install the correct Node.js version, run:
    ```bash
    nvm install
    ```
  - To use the selected version, run:
    ```bash
    nvm use
    ```
    Run the above commands one time before running any `npm` commands, additionally when switching between the frontend and backend npm commands.

  - On Windows, `nvm` won’t source the version from the `.nvmrc` file automatically. Use PowerShell to specify the Node.js version from `.nvmrc`:
    ```powershell
    nvm install $(Get-Content .nvmrc)
    nvm use $(Get-Content .nvmrc)
    ```
  - Alternatively, if manually managing Node.js instances, manually check the `.nvmrc` file in each subfolder for the required version.

### Setting up the Development Environment

1. **Initialize the Database:**
   - Use a MariaDB Docker instance for local development.
   - Example `docker-compose.yaml` for MariaDB:
     ```yaml
     services:
       db:
         image: mariadb:11.4.2-noble
         restart: unless-stopped
         volumes:
           - mariadbdata:/var/lib/mysql
         environment:
           MARIADB_ROOT_PASSWORD: example
         ports:
           - 3306:3306
       phpmyadmin:
         image: phpmyadmin:5.2.1-apache
         restart: always
         ports:
           - 8887:80
         environment:
           - PMA_ARBITRARY=1
     volumes:
       mariadbdata:
     ```
   - LinkStash has been tested exclusively with MariaDB. While it should work with other RDBMS, they are not officially supported or guaranteed to function correctly at this time.

2. **Set Up Environment Configurations:**
   - `.env.local` can be created by copying the `.env.example` files in their respective folders.
   - Backend: Inside the `linkstash_backend` folder:
     - Create `.env.local` and configure database connection settings.
     - Run migrations:
       ```bash
       cd linkstash_backend
       nvm use
       npm run migrate
       ```
     - Start the backend:
       ```bash
       npm run dev
       ```
      - Alternatively, run the backend without debugging for slightly faster startup time:
        ```bash
        npm start
        ```
   - Frontend: Inside the `linkstash_frontend` folder:
     - Create `.env.local` and configure the connection to the backend.
     - Start the frontend:
       ```bash
       nvm use
       npm run dev
       ```

## Community Standards
- Don’t be a dick.

Thank you for contributing to LinkStash!
