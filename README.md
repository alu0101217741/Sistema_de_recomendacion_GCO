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

Cuando el usuario termina de introducir estos parámetros debe pulsar el botón "CALCULAR PREDICCIÓN" y se mostrarán la matriz de similitud, la matriz de utilidad con las predicciones resueltas, los vecinos seleccionados y el cálculo realizado en cada predicción.

Como ya se ha comentado anteriormente para aportar una adecuada presentación a este documento se ha empleado Materialize y la hoja de estilo style.css.

### 3.2. formulario.js

Este fichero permite obtener los datos introducidos por el usuario en el formulario para almacenarlos en variables y calcular las predicciones. Para que sea posible esta interacción se ha empleado el evento `click` sobre el botón del formulario que tiene el id `read_button`.

```js
document.getElementById('read_button').addEventListener('click', function() {
```

De esta forma cuando se pulse el botón se comprueba que el usuario ha introducido un fichero, tras ello se obtienen los datos del formulario relativos a la métrica, el número de vecinos y el tipo de predicción. 

Una vez hecho esto, se procesa el fichero que incluye la matriz de utilidad, para lo que se toma el nombre del documento y se crea un objeto de la clase `FileReader()`. Luego se lee como un fichero de texto mediante `reader.readAsText(file);` y se emplean dos nuevos eventos sobre el objeto `reader`. El primero es `load` que se ejecuta cuando  ha finalizado correctamente la lectura del fichero. El otro es `error` que se ejecuta si ha ocurrido algún error en la lectura del fichero para informar al usuario.

Dentro del evento `load` se obtienen los datos leídos del fichero y se tranforman para crear una matriz de utilidad con datos numericos, cambiando el **"-"** por el **-1**.

Tras ello, se crea el objeto `recomendador` de la clase `Recomendador` pasándole los datos recogidos del formulario.

```js
 const recomendador = new Recomendador(matrix, metrica, num_vecinos, tipo_prediccion);
 ```
 Por último, se llaman a los métodos de la clase `Recomendador` para obtener los resultados y se muestran empleando código HTML. 
 

