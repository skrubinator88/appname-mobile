# Applicacion de Contratistas

## Dependencias que se utilizaran.

| **Dependencias**                                                              | **descripción**                                                                      |
| ----------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| [axios](https://github.com/axios/axios)                                       | API para hacer peticiones HTTP                                                       |
| [expo](https://docs.expo.io/versions/latest/)                                 | Utilizacion de recursos o API del dispositivo tales como camaras, localizacion, etc. |
| [react-navigation (Native)](https://reactnavigation.org/docs/getting-started) | Sistema de rutas.                                                                    |
| [styled-components](https://styled-components.com/docs)                       | CSS, mejor que la implementacion de stylos en react                                  |

## Notas:

- **[Performance]** Utilizar **`<FlatList>`** en vez de **`<ListView>`**: Para paginas Scrolleables. **_(FlatList Renderiza unicamente lo que esta en pantalla, en cambio ListView renderiza todo aunque no este prensente visualmente)_** Link: [React Native Docs](https://reactnative.dev/docs/flatlist.html)

- **[Standard]** Utilizar Flexbox en CSS para el posicionamiento de los componentes. Aqui una guia: [A Complete Guide to Flexbox](https://css-tricks.com/snippets/css/a-guide-to-flexbox/)

- **[Standard]** Utilizar React Hooks **`useState(), useEffect()`** y esto incluye componentes tipo **`function`** y no **`class`**. Documentacion: [Introducing Hooks](https://reactjs.org/docs/hooks-intro.html)

- **[Standard]** Utilizar el estado de una aplicacion para simular datos viniendo del server y necesita ser comentado en ingles que tipo de informacion esta simulando.
