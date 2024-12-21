
# Building docker image

Make sure npm run build passed without any errors.
```
docker build -t paan1981/linkstash-backend-nightly:nightly-20241221-01 .
docker push paan1981/linkstash-backend-nightly:nightly-20241221-01
```
```
docker build -t paan1981/linkstash-frontend-nightly:nightly-20241221-01 .
docker push paan1981/linkstash-frontend-nightly:nightly-20241221-01
```