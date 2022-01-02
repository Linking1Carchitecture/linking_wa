# pull official base image
FROM node:14

# set working directory
WORKDIR /usr/src/linking_wa

# install app dependencies
COPY package*.json ./

RUN npm install

COPY . .

# start app
CMD ["npm", "start"]    