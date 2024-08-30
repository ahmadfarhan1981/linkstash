# :bookmark: LinkStash
Selfhosted, backend driven :bookmark:bookmarking and :book: read it later solution. 

\>>>>>Pretty gif here<<<<<

# Feature
- :bookmark: Save and manage links
- :book: Save an offline version for reading later
- :file_cabinet: Selfhost friendly deployment via docker compose file
- :wrench: backend driven, all functionality is exposed via REST endpoints.

# Installation
## docker compose
A docker compose file with everything you need to run the service is available.

```bash
mkdir config

mkdir archive

wget docker-compose.yaml https://raw.githubusercontent.com/ahmadfarhan1981/linkstash/develop/docker/docker-compose.yaml

docker compose up -d
```
Access linkstash at: http://localhost:3000

The default credential is:
```
username: admin
password:password
```

## Customization

You can customize stuff via the env file

```bash
wget .env.example https://raw.githubusercontent.com/ahmadfarhan1981/linkstash/develop/docker/.env.example
cp .env.example .env
```


## exposing to the internet

reverse proxy
please be advice to take reasonable precaution 

start with volumes

```bash
docker run --rm -v <volume>:/src -v $(pwd)/<dir>:/dest alpine sh -c 'cp -R /src/* /dest/'
```

default user admin@linkstashapp:password
data management
grab data from volumes, 
keep .migrated together, 
when to remove .migrated.


## For development

run migrate for generated columns

Frontend
create `.env.local`

Backend
create `.env.local`

init db
start backend

start frontend

Docker stuff
## Building locally
Database
- docker of mariadb example


# Configuration
ads

# Similar projects / services
- Linkding (https://github.com/sissbruecker/linkding/)
- Pinboard (https://pinboard.in)
- Delicious (now defunct) (https://del.icio.us/)
- 
  
# Status
## Moving towards MVP
Feature set for MVP
- :white_check_mark: Bookmarking
- :white_check_mark: Tagging 
- :white_check_mark: Archiving
- :white_check_mark: Docker deployment
- :construction: Import/export

Currently still working on MVP features. 
After that, there is a round of bug squashing. Then onwards to V1.0 MVP

## For the future
*These might change if there is feedback*

After the MVP release. Focus topics (in no particular order) is going to be:
- UI improvements
  - responsive mobile layout
  - general UX improvements
- Integrations
  - integration with other services
    - paperless-ngx
    - archivebox
    - internet archive
    - yt-dl
- Arcihving improvements
  - different formats
    - default(non-reader view) format
  - archive versioning
- management feature
  - group by domains
  - link duplication check
  - checking for changes / link rot
  - backend scheduled tasks 
- Code quality
  - tests
- extendable frontend styles
