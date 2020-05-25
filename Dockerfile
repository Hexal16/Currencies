FROM nginx:alpine
LABEL author="Gerda Diteriha"
COPY ./src/config/nginx.conf /etc/nginx/conf.d/default.conf

# First build the project
# 1. build project `ng build`

# 2. Build the Docker image:
# docker build -t nginx-angular -f dockerfile .

# 3. run the docker file on windows
# docker run --detach --publish 8080:80 -v $(pwd)/dist:/share/ngnix/html --name nginx-angular nginx