# pull official base image
FROM node:alpine

# set working directory
WORKDIR /usr/src/linking_wa

# install app dependencies
COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

# start app
CMD ["npm", "start"]    