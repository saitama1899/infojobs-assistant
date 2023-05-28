![logo](https://res.cloudinary.com/dykoj2iuj/image/upload/v1685080130/logo_xcc4nz.png)
# Infojobs Assistant

Infojobs Assistant es una extensión para Google Chrome con la que el usuario podrá obtener un análisis en profundidad de su curriculum y perfil en relación a la oferta de empleo a la que quiera aplicar. La finalidad de la extensión es la de facilitar el proceso de selección al candidato para que se sienta mas seguro al aplicar y aumente sus posibilidades de conseguir el empleo.
Este análisis cuenta con 5 partes principales que el candidato podrá diferenciar fácilmente:
1- Fallos en el curriculum, faltas de ortografia, contenido que se eche en falta... etc.
2- Cambios para adaptarlo mejor a la oferta en cuestión.
3- Previsión del proceso de selección, posibles preguntas y preparación.
4- Porcentaje de compatibilidad de la oferta de trabajo con el curriculum.
5- Porcentaje de exito de conseguir el puesto de trabajo.

Este es un proyecto de 1 semana para participar en la hackaton de Infojobs y Midudev.

----
- APP: [https://github.com/saitama1899/infojobs-assistant](https://github.com/saitama1899/infojobs-assistant)
- API: [https://github.com/saitama1899/ifa-api](https://github.com/saitama1899/ifa-api)

## Demo


## 🛠️ Guía de uso
- Clonar el repositorio [APP](https://github.com/saitama1899/infojobs-assistant) en local.
- En tu navegador Chrome, ir a Extensions > Manage extensions y activar el Developer Mode.
- En la misma página de configuración, > Load Unpacked y seleccionar la carpeta Dist del proyecto [APP](https://github.com/saitama1899/infojobs-assistant).
- Una vez activada la extensión, al navegar en [infojobs.net](https://infojobs.net) la extensión nos pedirá la autenticación que deberemos hacer para poder acceder al analisis personalizado.

## API Endpoints:
- POST /api/infojobs : Espera un 'accessToken' y  un 'offerId' en el body

Este endpoint se encarga de realizar el analisis del perfil y la oferta de empleo, obteniendo en primer lugar todos los datos necesarios mediante la API de Infojobs y utiliziando OpenAI para la generación de este análisis.
Devolverá un array de 5 objetos, con las respuestas para cada uno de los 5 puntos. Los dos ultimos puntos cuentan con un campo extra 'percentage'.



## 🗝 API Built with
- [Express](https://expressjs.com/es/) For make the API.
- [Co:here AI](https://cohere.ai/) For get summary data given a raw Twitter account timeline.
- [Twitter API](https://developer.twitter.com/en/docs/twitter-api) For get the user id, avatar, and the timeline given a username.

## 💻 APP Built with
- [Vite](https://vitejs.dev/) For build the project.
- [ReactJs](https://es.reactjs.org/) For User UI.
- [Framer Motion](https://www.framer.com/motion/) For frontend animations.
- [Tailwind](https://tailwindcss.com) For frontend styles.

## 📑 Notas del desarrollo
- Este proyecto esta pensado como MVP, es una versión del código rápida y funcional para poner a prueba la idea.
- 
### APP
- Esta desarrollada en JS vanila, se utiliza Vite para hacer el build de la aplicación.
- El código debería refactorizarse pronto e intentar pasarlo a algún framework declarativo.
- Es mi primera extensión de Chrome!

### API
- Esta desarrollado en Node con Express.

## TODO técnico
- Diferenciar usuarios en la extensión de Chrome (almacenar mas de 1 accessToken a la vez y relacionado con un Id de usuario)
- Solucionar error 429 que sucede de forma puntual por exceso de peticiones.
- Trabajar en la velocidad de respuesta de chat completion de Open Ai.
- Mejorar el prompt para obtener un analisis mas completo.

## TODO conceptual
- Añadir a la extension algún cuadro mas de informacion adicional tomando datos estadisticos de la oferta, total de candidatos, del sector, de los salarios...
