# example-kontena-feature-branches

Example on running different web app versions in a single node with Docker and Kontena. Useful if developers are using feature branches and want to have them running on single node at the same time. Also helps with customers' needs so they can test all of the features in a single node.

## Main stuff used:

 - [Docker](https://www.docker.com/)
 - [Kontena](https://www.kontena.io/)
 - [Node.js](https://nodejs.org/)
 - [nginx](https://nginx.org/)
 - [gliderlabs/alpine:3.4 base image](https://hub.docker.com/r/gliderlabs/alpine/)
 
## What does this do?

1. Builds a Docker image `project/service:branch`
2. Pushes the image to private image registry
3. Starts a new Kontena service `project-service-branch`
4. Containerized feature branch is available on `url/branch/`, list of running Kontena services is available on `/services/` 
 
## Features

1. Run different app versions from feature branches in single node. 
See [`client-backend`](client-backend/) and [`client-frontend`](client-frontend/) for client-side web app and 
[`server-side`](server-side/) for server-side web app
2. Automatically list running Kontena services (see [`list-kontena-services`](list-kontena-services/))
3. Example Node.js Docker image, see [Dockerfile](client-backend/Dockerfile)
    - Size: ~ 33 MB
    - `node --version` `v6.2.0`
    - `npm --version` `3.8.9`
4. Example nginx Docker image, see [Dockerfile](client-frontend/Dockerfile)
    - Size: ~ 22 MB
    - Virtual path
    - Reverse proxy (to other linked containers)
    - Injecting environment variables to `nginx.conf`, used for port, virtual path and reverse proxy configuration
    
## Usage

1. Setup Docker
2. [Setup Kontena](https://www.kontena.io/docs/getting-started/quick-start)
    - Install `kontena-cli`
    - Create a Kontena Master
    - Create a Grid named `dev`
    - Create a Kontena Node
    - Create a image registry
    - Create a vpn service
3. Write following secrets to Kontena vault with `kontena vault write KEY VALUE`:
    - `KONTENA_URL`: this is the Kontena Master's url, run `kontena master current` and you get `<name> <url>`, pick `<url>`
    - `KONTENA_TOKEN`: **NOTE:** This is by no means official or even recommended, as this is **your personal** token (issue in [GitHub](https://github.com/kontena/kontena/issues/225)).
      You can get your personal token for current Kontena Master from `~/.kontena_client.json`, it starts with `kontena-`.
    - `KONTENA_GRID`: `dev`
4. Run 

    ```
    npm run docker:build
    npm run docker:tag
    npm run docker:push
    ```

  in every folder
5. To deploy client-side web app, run 

    ```
    cd path/to/project
    kontena app deploy -f kontena.client-side.yml
    ```

6. To deploy server-side web app, run 

   ```
   cd path/to/project
   kontena app deploy -f kontena.server-side.yml
   ```
    
7. Change the ports of the load balancer in one of the kontena configuration files if you want to run them simultaneously on a single node.
8. Get the list of running containers by opening your browser to `<kontena-node-url>/services/`
9. Your containerized branches will be running in `<kontena-node-url>/<branch>/`
10. You can automatically build and deploy new containerized branches by switching to a different branch and running 
`kontena-deploy.sh` or `npm run kontena:deploy` in [`client-frontend`](client-frontend/kontena-deploy.sh) or [`server-side`](server-side/kontena-deploy.sh)

## Random stuff / gotchas

1. "_Why is the Kontena project name named `f` and not the default `example-kontena-feature-branches`?_"
    - Kontena doesn't allow too long service names (noticed it while doing this example, issue opened in [GitHub](https://github.com/kontena/kontena/issues/825)). Note that `kontena-deploy.sh` scripts does not have a check for this.
2. "_Why not list branches in root url `/` and run branches in `/branch-1/`, `/branch-2/` etc.?_"
    - Because then the `list-kontena-services` catches every request to it's subdomain. It is possible, but couldn't be bothered with it just yet. Possible solution in [StackOverFlow](http://stackoverflow.com/questions/30508644/haproxy-multiple-backends-accessed-with-same-path)
3. "_Do I need to use Kontena with this?_"
    - No, this example should work with `docker-compose` and with any other container orchestration toolkit, even just with only Docker. You just have to implement `list-kontena-services` or ignore it. But if you haven't tried Kontena before, you should definitely give it a shot because of how easy it is to use.
4. Docker doesn't like tags with slashes `/` in them, so you should name your branches without slashes
5. Configuration:
    1. `kontena/lb`
        - Environment variable `KONTENA_LB_KEEP_VIRTUAL_PATH=true` must to be set for links to JavaScript and CSS files and API calls
    2. nginx reverse proxy
        - `proxy_set_header Host` must be set for linked containers
        - Trailing slashes

## License

[MIT](LICENSE)
