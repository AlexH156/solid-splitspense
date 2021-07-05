# Getting Started 
This Application was developed for a Project at WWU Münster, Germany. It can be used with the Solid Plattform, and should give the opportunity to learn simple programming and the use of the Solid Plattform.
The content is provided by [AlexH156](https://github.com/AlexH156) and [NilKl00](https://github.com/NilKl00). We are students at WWU in Münster, Germany.
Parts of the Programming are inspired by the Tutorial from Inrupt: [Inrupt: Getting Started](https://docs.inrupt.com/developer-tools/javascript/client-libraries/tutorial/getting-started/)


# Docker
You can use the following commands to test the App with Docker. The requirement is that you have installed Docker, more on that here: [Get Docker](https://docs.docker.com/get-docker/)

## Pull the image from Docker Hub
Here is the Docker Image on Docker Hub: [niklx/solid_splitspense](https://hub.docker.com/r/niklx/solid_splitspense/tags?page=1&ordering=last_updated)

Linux: ```sudo docker pull niklx/solid_splitspense:1.0.2```
Windows: ```docker pull niklx/solid_splitspense:1.0.2```

Linux: ```sudo docker run -p 8080:8080 -d --name splitspense niklx/solid_splitspense:1.0.2```
Windows: ```docker run -p 8080:8080 -d --name splitspense niklx/solid_splitspense:1.0.2```


The App is running on your localhost:8080.



If not sure if this is the latest version, check [niklx/solid_splitspense](https://hub.docker.com/r/niklx/solid_splitspense/tags?page=1&ordering=last_updated) for the latest update.

## Build Image by yourself
First change in webpack.conf.js the field 
```
devServer: {
        contentBase: "./",
        host: 'localhost',
        port: 8080
    }, 

```
to
```
devServer: {
        contentBase: "./",
        host: '0',
        port: 8080
    },
    
```

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

**Remove Container to start a new one with the same Name**
Linux: ```sudo docker rm splitspense```
Windows: ```docker rm splitspense```


# Use Splitspense with Node and Webpack for development
npm --version 6.14.13
node --version 14.17.2

npm install @inrupt/solid-client @inrupt/solid-client-authn-browser
npm install webpack webpack-cli webpack-dev-server css-loader style-loader  --save-dev
npm start

## Hilfreiche Links für das Programmieren einer Solid-App
* [Bestehende Solid Apps](https://solidproject.org/apps) anhand dere ein guter Überblick geschaffen werden kann.
* [Inrupt Getting Started](https://docs.inrupt.com/developer-tools/javascript/client-libraries/tutorial/getting-started/)
* [Inrupt - Wie lese ich daten?](https://docs.inrupt.com/developer-tools/javascript/client-libraries/tutorial/read-write-data/)
* [Inrupt - Wie lese ich Datein?](https://docs.inrupt.com/developer-tools/javascript/client-libraries/tutorial/read-write-files/)
* [Inrupt - Daten schreiben](https://docs.inrupt.com/developer-tools/javascript/client-libraries/tutorial/read-write-data/)
* [Inrupt - Management von Access rights](https://docs.inrupt.com/developer-tools/javascript/client-libraries/tutorial/manage-access/#changing-access-data-for-a-resource) konnte von uns leider nicht genutzt werden, da es sich noch in einer Beta variante befindet. Es gab fehlermeldung die wir nicht beheben konnte und wozu wir keine Lösungen finden konnten. 

* [Tripledoc - Writing a Solid App](https://vincenttunru.gitlab.io/tripledoc/docs/writing-a-solid-app/writing-a-solid-app.html) guter Stepbystep Guide mit stärkerem Fokus auf LinkedData und verwendum des FOAF Vokabulars

* [Dockerizing a Node.js](https://nodejs.org/en/docs/guides/nodejs-docker-webapp/) ist ein Guter Guide mit dem man ein Dockerfile für die Solid-App erstellen kann. 

## Getting Started Deutsch
Alle relevanten Informationen über Nutzung der Applikation finden Sie hier auf Deutsch: https://pad.uni-muenster.de/_qqxij0zQfuw5yisKlODbQ?view


