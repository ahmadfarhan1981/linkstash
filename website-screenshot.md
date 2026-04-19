# Feature idea for website screenshot

## Technology
Use a gottenberg docker image as a website screenshot API endpoint

start the image
```bash
docker run --rm -p 3214:3000 gotenberg/gotenberg:8
```
Then curl to get the image
```bash
curl --request POST http://localhost:3214/forms/chromium/screenshot/url --form url=https://rsdoiel.github.io/blog/2026/02/21/a_simple_web_we_own.html -o test12browserviewport.jpeg --form format=png --form width=1440 --form height=900 --fo
rm clip=true
```

## Suggested approach
- Add gottenberg in the docker stack (optionally?)
- Take a env var for the gottenberg endpoint.
- Hit the endpoint to get a website screenshot. if not 200, then have a placeholder image
- adjust bookmark card to show the image. the lower right is currently quite empty so i think thats a good place to have it.
- sharp package to create different thumbnail sizes or add some post processing
- 1440x800 or 1440x900 seems to be a good resolution to get a "in browser" feel
- might want to consider "website header" screenshot like the ones used for open graph, but i really dont like those.
- 

## Aside

- This opens up the different archive format like pdf or iamge. Since gottenberg support those functionality.
- have to be careful when designing he gui, need to maintain simplicity and and usability of the bookmarks cards , as well as possible configurability for showing/not showing the website screenshot.
- handle non 200 response, likely a lot of website would need some sort of auth cookie etc. in the future we might allow attaching cookie file etc. but for now just make sure to fail gracefully