## CHALLENGE N1U BACKEND

### Instrucciones necesarias para ejecutar la aplicación

Primero antes que nada, necesitamos una versión de node > 16.

Una vez clonemos el proyecto backend, nos debemos parar sobre la raiz del proyecto y ejecutar el siguiente comando:

```
npm install
```

Una vez tengamos todo el proyecto instalado, nos debemos parar en la rama DEVELOPMENT.

```
git checkout development
```

Y nos traemos todo de esa rama

```
git pull origin HEAD
```

Con todos los modulos instalados, la versión de node correcta, ya podremos usar la API.

Para inizializar la aplicación:

```python
# Para correr la aplicación
npm start

# Para correr los tests
npm test
```

### Instrucciones para la BD

Actualmente esta BD se esta conectando con la config dentro de los enviroments, para poder correrlo local se va a tener que poner el HOST correspondiente a su maquina, con su USER y PASSWORD.

El archivo SQL contiene todas las tablas con sus relaciones listas.

### Instrucciones para ver la documentacion

Debemos ingresar a la carpeta POSTMAN dentro del archivo src, e importarlo dentro del Postman.
Ahi podremos ver todas las requests con su documentacion, y un body valido para ejecutar la consulta, siempre y cuando este el API corriendo y tengamos la BD conectada.

```
Enlace a la documentacion de los endpoints.

https://documenter.getpostman.com/view/19074634/2sA3BkcYsS
```

### Desafíos o problemas enfrentados durante el desarrollo.

Fue un desarrollo divertido por el tiempo que tuve y por la forma de pensar un proyecto "simple" desde el inicio.

Dentro del GitHub tenemos 3 ramas, las cuales están divididas en Development, Testing y Production.

Cada ambiente tiene su propia conexión a la BD, y también tiene sus propias secrets para la generación del TOKEN, cabe recalcar que al no tener un servidor, no puedo guardar las secrets en algún secret manager, por lo tanto se usa una carpeta CONFIG, un JSON con cada credencial.

Uno de los desafíos más grandes fue el modelar la BD para que quede flexible y escalable, ya que al momento de pensar alguna funcionalidad, me topaba con alguna dificultad de escalabilidad; como por ejemplo, el pensar en los horarios para el restaurante y los horarios de las promociones de los productos.

Problemas en sí grandes no hubo mucho de por medio, quedó una buena estructura de BD, escalable y flexible. Me hubiera gustado agregar seguridad contra SQL injection, pero no lo vi tan necesario para este simple desarrollo, para una BD que implique modificar o traer data de tablas ultra delicadas, más en PROD, es necesario ese tipo de validaciones.

Para el tema de los TEST, corren con JEST y SUPERTEST, soy consciente de que se pueden manejar de una mejor forma, al no encontrar alguna buena dependencia para generar una BD en memoria, opté por utilizar la misma BD, solamente que se eliminan al terminar todos los tests, esto claramente tiene sus PROS y CONTRAS; por ejemplo, uno de sus PROS es que independientemente de la data que haya dentro de la BD en DEV, los tests corren igual y pasan de igual forma, una CONTRA es que el código de TEST se hizo muy largo y complicado de entender y ser flexible al agregar nuevos servicios para testear.

LOS TEST ÚNICAMENTE SE ENCUENTRAN EN LA RAMA DEVELOPMENT Y TESTING.

Para la documentación había varias alternativas (MD, Swagger, etc.), pero opté por POSTMAN ya que tiene su propia documentación en WEB y puedo dejar los BODY válidos para la generación de todos los llamados.
