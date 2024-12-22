to release tag commits.
When tagged with linkstash-backend_vxxx or linkstash-frontend_vxxx , github actions will build the docker image and push to dockerhub to:

- `paan1981/linkstash-frontend`
- `paan1981/linkstash-backedend`

The version string supports up to 3 segments of numeric version and a version suffix
Valid Tags:

With numeric versions:

- `linkstash-backend_v1`
- `linkstash-backend_v1.0`
- `linkstash-backend_v1.0.1`

With numeric versions and suffixes:

- `linkstash-backend_v1.0-alpha`
- `linkstash-backend_v1.0.1-rc`
- `linkstash-backend_v1.0.1.2-beta`