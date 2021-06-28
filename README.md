# mysolidapp


npm install @inrupt/solid-client @inrupt/solid-client-authn-browser @inrupt/vocab-common-rdf 
npm install webpack webpack-cli webpack-dev-server css-loader style-loader  --save-dev
npm start


# Docker

## Ubuntu
**Build Image**
sudo docker build -t mysolidapp . 

**Create Container an run**
sudo docker run -p 3000:3000 --name mysolidapp -d mysolidapp

**Stop Container**
sudo docker stop mysolidapp

**Restart Container**
sudo docker start mysolidapp

## Windows
**Build Image**
docker build -t mysolidapp . 

**Create Container an run**
docker run -p 3000:3000 --name mysolidapp -d mysolidapp

**Stop Container**
docker stop mysolidapp

**Restart Container**
docker start mysolidapp