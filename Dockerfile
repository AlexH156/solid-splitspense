FROM node:14

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install
RUN npm install @inrupt/solid-client @inrupt/solid-client-authn-browser
RUN npm install webpack webpack-cli webpack-dev-server css-loader style-loader  --save-dev

# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY . .

EXPOSE 8080
CMD [ "npm", "start" ]