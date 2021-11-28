/**
 * Evento que se ejecuta cuando el usuario hace click sobre el botón del formulario.
 */
document.getElementById('read_button').addEventListener('click', function() {
    
    /**
     * Se avisa al usuario mediante un alert en caso de que no haya introducido ningín formulario.
     */
    if(document.getElementById("file-input").files.length == 0) {
        alert('ERROR: No ha introducido ningún fichero.');
		return;
	}

    /**
     * Se obtienen los datos introducidos por el usuario en el formulario.
     */
    const metrica = document.getElementById("metrica").value;
    const num_vecinos = document.getElementById("num_vecinos").value;
    const tipo_prediccion = document.getElementById("prediccion").value;

    /**
     * Se obtiene el fichero introducido por el usuario.
     */
	let file = document.getElementById("file-input").files[0];

    /**
     * Se crea un objeto FileReader para poder leer el contenido del fichero.
     */
	let reader = new FileReader();

    /**
     * Evento que se ejecuta cuando ha finalizado la lectura del fichero.
     */
	reader.addEventListener('load', function(e) {

        // Se obtienen los datos leídos del fichero.
        let text = String(e.target.result);
         
        // Se convierte el contenido del fichero en una matriz.
        let matrix = [];
        let array_aux = [];
         
        for (let i = 0; i < text.length; i++) {
            if (text[i] != ' ' && text[i] != '\r' && text[i] != '\n') {
                if (text[i] == '-') {
                    array_aux.push(-1);
                } else {
                    array_aux.push(Number(text[i]));
                }                
            }
            if (text[i] == '\n' || i == text.length - 1) {
                matrix.push(array_aux);
                array_aux = [];
            }
        }

        // Se crea un objeto de la clase Recomendador.
        const recomendador = new Recomendador(matrix, metrica, num_vecinos, tipo_prediccion);

        // Se llaman a los métodos de la clase Recomendador para obtener los resultados y se muestran empleando código HTML.
        document.getElementById("matriz_utilidad").innerHTML = '<h5>Matriz de utilidad original</h5>' + mostrar_matriz(recomendador.get_matriz_utilidad());
        document.getElementById("matriz_similaridad").innerHTML = '<h5>Matriz de similitud</h5>' + mostrar_matriz(recomendador.get_matriz_similitud(), "Usuario");
        document.getElementById("matriz_resuelta").innerHTML = '<h5>Matriz de utilidad con predicciones resueltas</h5>' + mostrar_matriz(recomendador.recomendar(), "Item", true, recomendador.get_matriz_utilidad());
        document.getElementById("vecinos_usuarios").innerHTML = '<div class="center"><h5 class="center">Vecinos seleccionados</h5></div>' + mostrar_vecinos(recomendador.get_vecinos_usuarios());
        document.getElementById("calculo_prediccion").innerHTML = '<div class="center"><h5 class="center">Cálculo de cada predicción</h5></div>' + mostrar_calculo(recomendador.get_calculo_predicciones(), recomendador.get_tipo_prediccion());
     });

    /**
     * Evento que se ejecuta si ocurre algún error en la lectura del fichero.
     */
	reader.addEventListener('error', function() {
	    alert('ERROR: Fallo al leer el contenido del fichero.');
	});

    /**
     * Se lee como un fichero de texto el fichero introducido por el usuario.
     */
	reader.readAsText(file);
});

/**
 * Función para mostrar una matriz, en caso de que se le pasen la matriz de utilidad o la matriz resultado del cálculo, se marca en color azul las predicciones.
 * @param matriz Matriz que se va a mostrar.
 * @param elemento Indica que si en la cabecera de la matriz se debe mostrar "Item" o "Usuario", por defecto es "Item".
 * @param solucion  Indica si se va a mostrar la matriz con las predicciones resueltas, esto se utiliza para destacar en color azul 
 *                  las casillas con las predicciones obtenidas.
 * @param matriz_utilidad Esta matriz se pasa a la función sólo cuando se va a mostrar la matriz con las predicciones resueltas para 
 *                        saber donde se encuentran los "-" y marcar las soluciones.
 * @returns Tabla en código HTML.
 */
function mostrar_matriz(matriz, elemento = "Item", solucion = false, matriz_utilidad =[]) {
    let tabla = '<div class="col s12" id="table-scroll"><table class="stripped"><thead><tr><th> </th>';

    for (let i = 0; i < matriz[0].length; i++) {
        tabla += '<th> ' + elemento + " " + (i + 1) + '</th>';
    }
    tabla += '</tr></thead><tbody>';

    for (let i = 0; i < matriz.length; i++) {
        tabla += '<tr><th> Usuario ' + (i + 1) + '</th>';
        for (let j = 0; j < matriz[i].length; j++) {
            if (solucion && matriz_utilidad[i][j] == -1) {
                tabla += '<td id="mostrar_prediccion" class=" cyan darken-2 white-text">' + Math.round((matriz[i][j] + Number.EPSILON) * 100) / 100 + '</td>';
            } else if (matriz[i][j] == -1) {
                tabla += '<td id="mostrar_prediccion" class=" cyan darken-2 white-text"> - </td>';
            } else {
                tabla += '<td>' + Math.round((matriz[i][j] + Number.EPSILON) * 100) / 100 + '</td>';
            }
        }
        tabla += '</tr>';
    }
    tabla += '</tbody></table></div>';
    return tabla;
}

/**
 * Función para mostrar los vecinos seleccionados para un determinado usuario e item.
 * @param vecinos_usuarios Matriz donde cada fila tiene el formato [usuario, item, vecinos], donde vecinos es un vector.
 * @returns Lista en código HTML con los vecinos de cada usuario e item.
 */
function mostrar_vecinos(vecinos_usuarios) {
    let resultado = '<div class="col s8 offset-s2"><ul class="collection">';
    for (let i = 0; i < vecinos_usuarios.length; i++) {
        resultado += '<li class="collection-item">Para predecir la valoración del <b>Usuario ' + (vecinos_usuarios[i][0] + 1) + '</b> ' +
                        'para el <b>item ' + (vecinos_usuarios[i][1] + 1) + '</b> se han seleccionado los <b>vecinos: ';
        for(let j = 0; j < vecinos_usuarios[i][2].length; j++) {
            resultado +=  vecinos_usuarios[i][2][j].vecino + 1;
            if (j != vecinos_usuarios[i][2].length - 1)
                resultado += ', ';
        }
        resultado += '</b>.</li>';
    }
    resultado += '</ul></div>';
    return resultado;
}

/**
 * Función para mostrar los cálculos realizados en cada predicción.
 * @param predicciones Matriz con formato [usuario, item, sumatorio1, sumatorio2, prediccion] en caso de predicción simple,
 *                     y [usuario, item, media_usuario, sumatorio1, sumatorio2, prediccion] para la diferencia con la media.
 * @param tipo_prediccion Indica si se ha utilizado predicción simple o diferencia con la media.
 * @returns Lista en código HTML con el cálculo de cada prediccón.
 */
function mostrar_calculo(predicciones, tipo_prediccion) {
    let calculos = '<div class="col s8 offset-s2"><ul class="collection">';
    for (let i = 0; i < predicciones.length; i++) {
        calculos += '<li class="collection-item">Cálculo para el <b>Usuario ' + (predicciones[i][0] + 1) + '</b> con el <b>item ' +
        (predicciones[i][1] + 1) + '</b>:  &nbsp <b>';
        if (tipo_prediccion == "Predicción simple") {
            calculos += redondear(predicciones[i][2]) + ' / ' + redondear(predicciones[i][3]) + ' = ' + redondear(predicciones[i][4]);
        } else {
            calculos += redondear(predicciones[i][2]) + ' + (' + redondear(predicciones[i][3]) + ' / ' + redondear(predicciones[i][4]) + 
                    ') = ' + redondear(predicciones[i][5]);
        }
        calculos += '</b></li>';
    }
    calculos += '</ul></div>';
    return calculos;
}

/**
 * Función utilizada para redondear los cálculos de la función mostrar_calculo() y así hacer más legible el código.
 * @param numero_decimal Número que se va a redondear.
 * @returns Número redondeado.
 */
function redondear(numero_decimal) {
    return Math.round((numero_decimal + Number.EPSILON) * 100) / 100;
}