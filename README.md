# Applicacion de Contratistas

## Dependencias que se utilizaran.

| **Dependencias**                                                                     | **descripción**                                                                      |
| ------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------ |
| [axios](https://github.com/axios/axios)                                              | API para hacer peticiones HTTP                                                       |
| [expo](https://docs.expo.io/versions/latest/)                                        | Utilizacion de recursos o API del dispositivo tales como camaras, localizacion, etc. |
| [react-navigation (Native)](https://reactnavigation.org/docs/getting-started)        | Sistema de rutas.                                                                    |
| [styled-components](https://styled-components.com/docs)                              | CSS, mejor que la implementacion de stylos en react                                  |
| [async-storage](https://react-native-community.github.io/async-storage/docs/install) | Para aplicar persistent data y guardar datos en el mobile localmente.                |

## Notas:

- **[Performance]** Utilizar **`<FlatList>`** en vez de **`<ListView>`**: Para paginas Scrolleables. **_(FlatList Renderiza unicamente lo que esta en pantalla, en cambio ListView renderiza todo aunque no este prensente visualmente)_** Link: [React Native Docs](https://reactnative.dev/docs/flatlist.html)

- **[Standard]** Utilizar Flexbox en CSS para el posicionamiento de los componentes. Aqui una guia: [A Complete Guide to Flexbox](https://css-tricks.com/snippets/css/a-guide-to-flexbox/)

- **[Standard]** Utilizar React Hooks **`useState(), useEffect()`**. Documentacion: [Introducing Hooks](https://reactjs.org/docs/hooks-intro.html).

- **[Standard]** Utilizar componentes tipo **`export function componente()`** y no **`export class componente()`**. Documentacion: [Introducing Hooks](https://reactjs.org/docs/hooks-intro.html)

- **[Standard]** Utilizar el estado de una aplicacion para simular datos viniendo del server y necesita ser comentado en ingles que tipo de informacion esta simulando.

- **[Styling]** Botones que tengan que ser del mismo estilo entre los differentes sistemas operativos, hagan uso de **`TouchableOpacity`** y no **`Button`**. Luego le ponen estilos con `styled-components`.

- **[Styling]** Botones azules deben utilizar este color: **`#548ff7`**.

- **[UX]** Pantallas que muestren teclado, tienen que tener: \*\*`<TouchableWithoutFeedback onPress={() => {Keyboard.dismiss();}} { CODIGO } </TouchableWithoutFeedback>`\*\*.

- **[UX]** Logicas (UX) deben implementarse.
