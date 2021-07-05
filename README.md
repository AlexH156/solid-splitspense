# Getting Started

Alle relevanten Informationen über die Installation und den Start der Applikation finden Sie hier: https://pad.uni-muenster.de/_qqxij0zQfuw5yisKlODbQ

Ein Beispielvideo findet ihr hier: https://uni-muenster.sciebo.de/s/LETl8XqovuPRtKO

# mysolidapp


npm install @inrupt/solid-client @inrupt/solid-client-authn-browser
npm install webpack webpack-cli webpack-dev-server css-loader style-loader  --save-dev
npm start


# Docker
You can use the following commands to test the App with Docker. The requirement is that you have installed Docker, more on that here: [Get Docker](https://docs.docker.com/get-docker/)

## Pull the image from Docker Hub
sudo docker pull niklx/solid_splitspense:1.0.0
sudo docker run -p 8080:8080 niklx/solid_splitspense:1.0.0

The App is running on your localhost:8080.

## Build Image by yourself
First change in webpack.conf.js the field 
 ```   devServer: {
        contentBase: "./",
        host: 'localhost',
        port: 8080
    }, ```
to
 ```   devServer: {
        contentBase: "./",
        host: '0',
        port: 8080
    }, ```


Start with **building the image**.
Linux: ```sudo docker build -t splitspense . ```
Windows: ``` docker build -t splitspense . ```

**Create the Container an run**
Linux: ```sudo docker run -p 3000:3000 --name splitspense -d splitspense```
Windows: ```docker run -p 3000:3000 --name splitspense -d splitspense```

**Stop Container**
Linux: ```sudo docker stop splitspense```
Windows: ```docker stop splitspense```

**Restart Container**
Linux: ```sudo docker start splitspense```
Windows: ```docker start splitspense```



## Hilfreiche Links für das Programmieren einer Solid-App
* [Bestehende Solid Apps](https://solidproject.org/apps) anhand dere ein guter Überblick geschaffen werden kann.
* [Inrupt Getting Started](https://docs.inrupt.com/developer-tools/javascript/client-libraries/tutorial/getting-started/)
* [Inrupt - Wie lese ich daten?](https://docs.inrupt.com/developer-tools/javascript/client-libraries/tutorial/read-write-data/)
* [Inrupt - Wie lese ich Datein?](https://docs.inrupt.com/developer-tools/javascript/client-libraries/tutorial/read-write-files/)
* [Inrupt - Daten schreiben](https://docs.inrupt.com/developer-tools/javascript/client-libraries/tutorial/read-write-data/)
* [Inrupt - Management von Access rights](https://docs.inrupt.com/developer-tools/javascript/client-libraries/tutorial/manage-access/#changing-access-data-for-a-resource) konnte von uns leider nicht genutzt werden, da es sich noch in einer Beta variante befindet. Es gab fehlermeldung die wir nicht beheben konnte und wozu wir keine Lösungen finden konnten. 

* [Tripledoc - Writing a Solid App](https://vincenttunru.gitlab.io/tripledoc/docs/writing-a-solid-app/writing-a-solid-app.html) guter Stepbystep Guide mit stärkerem Fokus auf LinkedData und verwendum des FOAF Vokabulars

* [Dockerizing a Node.js](https://nodejs.org/en/docs/guides/nodejs-docker-webapp/) ist ein Guter Guide mit dem man ein Dockerfile für die Solid-App erstellen kann. 

