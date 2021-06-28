# Getting Started
Alle relevanten Informationen über die Installation und den Start der Applikation finden Sie hier:
https://pad.uni-muenster.de/_qqxij0zQfuw5yisKlODbQ

# mysolidapp


npm install @inrupt/solid-client @inrupt/solid-client-authn-browser @inrupt/vocab-common-rdf 
npm install webpack webpack-cli webpack-dev-server css-loader style-loader  --save-dev
npm start


# Docker

**Build Image**
sudo docker build -t mysolidapp . 

**Create Container an run**
sudo docker run -p 3000:3000 --name mysolidapp -d mysolidapp

**Stop Container**
sudo docker stop mysolidapp

**Restart Container**
sudo docker start mysolidapp
