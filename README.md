# :bookmark: LinkStash
Selfhosted, backend driven :bookmark:bookmarking and :book: read it later solution. Focusing on clean interface, configurability, and easy deployment via docker. 
# Feature
- :bookmark: Bookmark links
- :book: Save an offline version for reading later
- tagging
- selfhost friendly deployment via docker compose file
- backend driven
- :tag
# Installation
asda
run migrate for generated collumns

Frontend
create ```.env.local```

Backend
create ```.env.local```

Docker stuff
Building locally
Database
- docker of mariadb example

#### docker compose
mkdir config
mkdir archive
wget docker-compose.yaml
wget .env.example

start with volumes
docker run --rm -v <volume>:/src -v $(pwd)/<dir>:/dest alpine sh -c 'cp -R /src/* /dest/'

default user admin@linkstashapp:password
data management
grab data from volumes, 
keep .migrated together, 
when to remove .migrated.

# Configuration
ads

# Status
## Moving towards MVP
- docker deployment
## For the future
- backend scheduled tasks
- extendable frontend
