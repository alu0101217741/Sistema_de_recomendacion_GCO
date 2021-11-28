# Gestión del Conocimiento en las organizaciones
## Sistemas de recomendación
### Autor: Alberto Mendoza Rodríguez (alu0101217741@ull.edu.es)


<p align="center">
  Acceda al sistema de recomendación: <a href="https://alu0101217741.github.io/Sistema_de_recomendacion_GCO/">https://alu0101217741.github.io/Sistema_de_recomendacion_GCO/</a>
</p>


## 1. Introducción

Este repositorio incluye el código fuente que implementa un sistema de recomendación basado en el filtrado colaborativo. El paradigma para desarrollar este sistema se basa en la teoría de que si los usuarios han compartido algunos de sus interes en el pasado, podrán tener gustos similares en el futuro.

Para desarrollar el sistema de recomendación se han utilizado los lenguajes de programación **HTML**, **CSS** y  **JavaScript** de forma que el usuario puede introducir los datos necesarios para realizar la recomendación a través de una página web y obtener los resultados en la pantalla de su navegador. Cabe destacar que para establecer el estilo de la página también se ha empleado el framework de CSS  [Materialize](https://materializecss.com/).

## 2. Estructura de directorios

El sistema de recomendación se encuentra dentro de **docs** que incluye los siguientes directorios y ficheros:

* **css**: Almacena la hoja de estilo **style.css** para definir la presentación para el documento escrito en HTML.
* **example-utility-matrices**: Incluye diferentes ejemplos de matrices de utilidad con las que se puede comprobar el correcto funcionamiento del programa.
* **src**: Almacena los siguientes ficheros con código JavaScript:

  * **formulario.js**: Permite gestionar el formulario donde el usuario debe introducir los datos y hace posible mostrar los resultados. 
   
  * **recomendador.js**: Se define la clase **Recomendador** que implementa la recomendación basada en el filtrado colaborativo, de forma que calcula la matriz de similitud, la matriz de utilidad con las predicciones resueltas, los vecinos seleccionados y el cálculo realizado en cada predicción.
 
* **index.html**: Documento escrito con el lenguaje de marcado HTML para elaborar la página web.

## 3. Descripción del código desarrollado
A continuación, se describe el contenido de cada uno de los ficheros que forman el sistema de recomendación.

### 3.1. index.html
En primer lugar, el fichero **index.html** contiene el formulario donde el usuario debe introducir los siguientes datos:

* Fichero con la matriz de utilidad compuesta por las calificaciones de usuarios-ítems.
* Métrica elegida, pudiendo seleccionar entre Correlación de Pearson, Distancia coseno y Distancia Euclídea.
* Número de vecinos considerados.
* El tipo de predicción, que puede ser predicción simple o diferencia con la media.

Cuando el usuario termina de introducir estos parámetros debe pulsar el botón `CALCULAR PREDICCIÓN` y se mostrarán la matriz de similitud, la matriz de utilidad con las predicciones resueltas, los vecinos seleccionados y el cálculo realizado en cada predicción.

Como ya se ha comentado anteriormente para aportar una adecuada presentación a este documento se ha empleado Materialize y la hoja de estilo style.css.

### 3.2. formulario.js

Este fichero permite obtener los datos introducidos por el usuario en el formulario, lo que hace posible almacenarlos en variables y calcular las predicciones. Para realizar esta interacción se ha empleado el evento `click` sobre el botón del formulario que tiene el id `read_button`.

```js
document.getElementById('read_button').addEventListener('click', function() {
```

De esta forma cuando se pulse el botón se comprueba que el usuario ha introducido un fichero, tras ello se obtienen los datos del formulario relativos a la métrica, el número de vecinos y el tipo de predicción. 

Una vez hecho esto, se procesa el fichero que incluye la matriz de utilidad, para lo que se toma el nombre del documento y se crea un objeto de la clase `FileReader()`. Luego se lee como un fichero de texto mediante `reader.readAsText(file);` y se emplean dos nuevos eventos sobre el objeto `reader`. El primero es `load` que se ejecuta cuando  ha finalizado correctamente la lectura del fichero. El otro es `error` que se ejecuta si ha ocurrido algún error en la lectura del fichero para informar al usuario.

Dentro del evento `load` se obtienen los datos leídos del fichero y se tranforman para crear una matriz de utilidad con datos numéricos, cambiando el **"-"** por el **-1**.

Tras ello, se crea el objeto `recomendador` de la clase `Recomendador` pasándole los valores recogidos del formulario.

```js
 const recomendador = new Recomendador(matrix, metrica, num_vecinos, tipo_prediccion);
 ```
 Por último, se llaman a los métodos de la clase `Recomendador` para obtener los resultados y se muestran en la página web empleando las funciones `mostrar_matriz`, `mostrar_vecinos` y `mostrar_calculo` que incorporan código HTML.
 
 ### 3.3. recomendador.js
 
 Este fichero incluye la clase `Recomendador` que implementa un recomendador siguiendo el método del filtrado colaborativo.
 
 #### Constructor
 El constructor de la clase es el que se muestra a continuación:
 
 ```js
 constructor(matriz, metrica, num_vecinos, tipo_prediccion) {
        this.matriz_utilidad = matriz;
        this.metrica = metrica;
        this.num_vecinos = num_vecinos;
        this.tipo_prediccion = tipo_prediccion;
        this.matriz_similitud = this.crear_matriz_similitud(metrica);
        this.vecinos_usuarios = [];
        this.calculo_predicciones = [];
    }
  ```
  
Con los parámetros recibidos se inicializan algunos de los atributos de la clase que son los siguientes: 

* `this.matriz_utilidad:` es la matriz de utilidad original que incluye un -1 en las posiciones donde un usuario no ha calificado un determinado ítem.
* `this.metrica`: el tipo de métrica elegida.
* `this.num_vecinos`: el número de vecinos considerados.
* `this.tipo_predicción`: el tipo de predicción que se tendrá que aplicar para realizar los cálculos.
* `this.matriz_similitud`: se trata de una matriz cuadrada donde se indica el grado de relación entre cada para de usuarios.
* `this.vecinos_usuarios`: es una matriz donde cada fila sigue la estructura `[usuario, item, vecinos]` donde `vecinos` es un array con los vecinos del usuario para ese determinado `item`. Se utiliza para almacenar los vecinos de los usuarios y poderlos mostrar como parte de los resultados.
* `this.calculo_predicciones`: es una matriz donde las filas pueden seguir dos estructuras diferentes en función del tipo de predicción:
  * Predicción simple: La estructura de cada fila es `[usuario, item, sumatorio1, sumatorio2, prediccion]`.
  * Predicción basada en la diferencia con la media: La estructura de cada fila es `[usuario, item, media_usuario, sumatorio1, sumatorio2, prediccion]`.
 
En ambas estructuras la variable `prediccion` almacena el cálculo final de la predicción. Al igual que en `this.vecinos_usuarios`, esta matriz se emplea para mostrar el proceso que se ha seguido para obtener los resultados en las diferentes predicciones.

#### crear_matriz_similitud(metrica)

Para generar la matriz de similaridad se llama desde el constructor al método `crear_matriz_similitud(metrica)` pasándole el tipo de métrica que se esta utilizando. En este método se va a crear una matriz cuadrada formada tanto en las filas como en las columnas por usuarios, de forma que se muestra el grado de relación entre cada par de usuarios. Para lograrlo se recorre por filas la matriz de utilidad y se calcula la similitud de un usuario `i` con el resto, el resultado obtenido depende de la métrica que se este aplicando.

### correlacion_pearson(usuario_u, usuario_v)

Este método aplica la medida de similitud basada en la correlación de Pearson que se trata de un índice que se puede emplear para medir la relación entre dos variables cuantitativas y continuas. 

En primer lugar, se calculan las medias para ambos usuarios, para lo que se utilizan todos las valoraciones, independientemente si el otro usuario ha valorado ese item o no. Después se recorre por ítems la matriz de utilidad comprobando que el item haya sido calificado por ambos usuarios, y si esto se calculan los sumatorios que componen la siguiente fórmula:

# FORMULA CORRELACION PEARSON

Por último, cuando se tienen los sumatorios se aplica las operaciones de la fórmula y se devuelve el resultado.


  
  
  
  
  
  
  
  
  
Por último, se definen una serie de getters para poder obtener los atributos de la clase.
  
  

  

