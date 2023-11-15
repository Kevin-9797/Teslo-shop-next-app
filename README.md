
# Next.js Teslo Shop App
Para correr localmente, se necesita la base de datos
```
docker-compose up -d

```

* El -d, es para ejecutar en consola y no me deje meter mas comandos
## Configurar las varibables de entorno
Renombrar el archivo __.env.template__ a __.env__


* MongoDB URL Local

```
mongodb://localhost:27017/entriesdb
``` 

* Reconstruir los nodulos de node
``` 
yarn install
yarn dev

```


## Para llenar la base de datos con datos de prueba

* Url a llamar

``` 
https://localhost:3000/api/seed
```
