

# :bookmark: LinkStash

<p align="center">
  <img src="resources/favicons/logo-trans.svg" alt="LinkStash Logo" width="250">
</p>

<p align="center">
  <img src="https://img.shields.io/github/v/release/ahmadfarhan1981/linkstash" alt="Latest Release">
  <img src="https://img.shields.io/github/license/ahmadfarhan1981/linkstash" alt="License">
  <img src="https://img.shields.io/github/stars/ahmadfarhan1981/linkstash?style=social" alt="Stars">
  <img src="https://img.shields.io/docker/pulls/paan1981/linkstash-backend" alt="Docker Pulls">
  <img src="https://img.shields.io/badge/Self--Hosted-✔-blue" alt="Self-Hosted">
</p>


<p align="center">
  <strong>"Guarda tus enlaces, revísalos en cualquier momento - LinkStash: Tu gestor de marcadores autoalojado"</strong>
</p>



LinkStash es una solución autoalojada de marcadores y "leer más tarde" basada en backend, que te permite tener control total sobre tus enlaces guardados y tu contenido sin conexión.

![LinkStash Demo GIF](img/screenshot.png)

## Características

- **:file_folder: Privacidad y Propiedad**: Control total sobre tus datos, autoalojado para máxima privacidad.
- **:globe_with_meridians: Acceso sin conexión**: Guarda y lee contenido sin conexión, incluso sin internet.
- **:file_cabinet: Despliegue sencillo**: Comienza rápidamente con Docker Compose.
- **:wrench: Integración con API REST**: Conéctate y automatiza fácilmente con completo soporte de API REST.
## ¿Por qué LinkStash?

LinkStash está diseñado para darte control total sobre tus necesidades de marcadores. A diferencia de las alternativas basadas en la nube, LinkStash ofrece:
- **Privacidad y Propiedad**: Autoalojado, para que tus datos se queden contigo.
- **Lectura sin conexión**: Guarda artículos para más tarde, incluso cuando estés sin conexión.
- **Acceso a API REST**: Acceso completo a todas las funciones a través de endpoints REST, facilitando la integración con otras herramientas.
- **Despliegue fácil**: Comienza rápidamente con Docker Compose, haciendo que la configuración sea indolora.

LinkStash está diseñado para usuarios que valoran el control, la privacidad y la flexibilidad al organizar su contenido web.
## Inicio rápido

### Docker Compose

Para ponerlo en marcha con la configuración predeterminada usando Docker Compose:

```bash
mkdir config
mkdir archive

wget https://raw.githubusercontent.com/ahmadfarhan1981/linkstash/develop/docker/docker-compose.yaml

docker compose up -d
```

Accede a LinkStash en: [http://localhost:3000](http://localhost:3000)

**Credenciales predeterminadas:**
```plaintext
username: admin
password: password
```

## Datos persistentes
Los datos persistentes creados por LinkStash se almacenan en algunos lugares:
- Los archivos de datos de MySQL se almacenan en el volumen de Docker `linkstash-data`.
- La carpeta `./archive` contiene activos descargados para uso sin conexión.
- La carpeta `./config` contiene archivos para realizar un seguimiento del estado de la migración de la base de datos.

## Más información 
Visita el [sitio web](http://linkstashapp.com) para la guía de usuario

## Comunidad, Contribución y Desarrollo

¡Gracias por tomarte el tiempo para contribuir!

Se fomentan y valoran todo tipo de contribuciones. 🎉

Si te gusta el proyecto pero simplemente no tienes tiempo para contribuir, está bien. Puedes apoyar el proyecto:
- Dar una estrella al proyecto
- Mencionar el proyecto en redes sociales
- Participar en las [discusiones](https://github.com/ahmadfarhan1981/linkstash/discussions).
 
Para las pautas de contribución detalladas, consulta [CONTRIBUTING.md](CONTRIBUTING.md).

## Proyectos / Servicios similares

- [Linkding](https://github.com/sissbruecker/linkding/)
- [Pinboard](https://pinboard.in)
- Delicious (ahora inactivo): 

## Estado

### Lanzamiento MVP

Con la adición de las funciones de gestión masiva en V1.1, considero este MVP completo.

### Para el futuro

Hay una publicación en el blog sobre [el futuro de LinkStash](https://blog.ahmadfarhan.com/posts/linkstash-future/) en mi blog.

El desarrollo será lento pero constante.

Estos son los puntos de enfoque.
- Formato de archivos
- Móvil 
- Integración con otras herramientas autoalojadas.
