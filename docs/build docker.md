
# Building docker image

Make sure npm run build passed without any errors.
```
docker build -t paan1981/linkstash-server-nightly:daily-20241129-01 .
docker push paan1981/linkstash-server-nightly:daily-20241129-01
```
```
docker build -t paan1981/linkstash-frontend-nightly:daily-20241129-01 .
docker push paan1981/linkstash-frontend-nightly:daily-20241129-01
```