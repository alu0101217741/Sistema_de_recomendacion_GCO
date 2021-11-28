/**
 * Clase que implementa un sistema de recomendación siguiendo el método de filtrado colaborativo.
 */
class Recomendador {
    /**
     * Constructor de la clase.
     * @param matriz Matriz de utilidad original.
     * @param metrica El tipo de métrica.
     * @param num_vecinos La cantidad de vecinos.
     * @param tipo_prediccion El tipo de predcción a utilizar.
     */
    constructor(matriz, metrica, num_vecinos, tipo_prediccion) {
        this.matriz_utilidad = matriz;
        this.metrica = metrica;
        this.num_vecinos = num_vecinos;
        this.tipo_prediccion = tipo_prediccion;
        this.matriz_similitud = this.crear_matriz_similitud(metrica);
        this.vecinos_usuarios = [];
        this.calculo_predicciones = [];
    }

    /**
     * Método que devuelve la matriz de utilidad original.
     * @returns Matriz de utilidad original.
     */
    get_matriz_utilidad() {
        return this.matriz_utilidad;
    }

    /**
     * Método que devuelve el tipo de predicción utilizada.
     * @returns Tipo de predicción.
     */
    get_tipo_prediccion() {
        return this.tipo_prediccion;
    }

    /**
     * Método que devuelve la matriz de similitud que se ha calculado.
     * @returns Matriz de similitud.
     */
    get_matriz_similitud() {
        return this.matriz_similitud;
    }

    /**
     * Método que devuelve los vecinos para cada uno de los usuarios e items.
     * @returns Vecinos para cada para cada usuario según el item.
     */
    get_vecinos_usuarios() {
        return this.vecinos_usuarios;
    }

    /**
     * Método que devuelve los valores utilizados en el cálculo de cada predicción.
     * @returns Los cálculos realizados en las predicciones.
     */
    get_calculo_predicciones() {
        return this.calculo_predicciones;
    }

    /**
     * Método para calcular la matriz de similitud.
     * @param metrica El tipo de métrica ha utilizar.
     * @returns La matriz de similitud.
     */
    crear_matriz_similitud(metrica) {
        let matriz_similitud = [];
        let similitud_vecinos = [];
        for (let i = 0; i < this.matriz_utilidad.length; i++) {
           for (let j = 0; j < this.matriz_utilidad.length; j++) {
                switch (metrica) {
                    case 'Correlación de Pearson':
                        similitud_vecinos.push(this.correlacion_pearson(i, j));
                        break;
                    case 'Distancia coseno':
                        similitud_vecinos.push(this.distancia_coseno(i, j));
                        break;
                    case 'Distancia Euclídea':
                        similitud_vecinos.push(this.distancia_euclidea(i, j));
                        break;
                }
           }
           matriz_similitud.push(similitud_vecinos);
           similitud_vecinos = [];
        }
        return matriz_similitud;
    }

    /**
     * Método para calcular la similitud según la correlación de Pearson.
     * @param usuario_u Usuario u utilizado para el cálculo.
     * @param usuario_v Usuario v utilizado para el cálculo.
     * @returns La similitud según la correlación de Pearson entre los usuarios u y v.
     */
    correlacion_pearson(usuario_u, usuario_v) {
        let media_u = this.calcular_media(usuario_u);
        let media_v = this.calcular_media(usuario_v);
        let sumatorio1 = 0;
        let sumatorio2 = 0;
        let sumatorio3 = 0;

        for (let i = 0; i < this.matriz_utilidad[usuario_u].length; i++) {
            if (this.matriz_utilidad[usuario_u][i] != -1 && this.matriz_utilidad[usuario_v][i] != -1) {
                sumatorio1 += (this.matriz_utilidad[usuario_u][i] - media_u) * (this.matriz_utilidad[usuario_v][i] - media_v);
                sumatorio2 += Math.pow(this.matriz_utilidad[usuario_u][i] - media_u, 2);
                sumatorio3 += Math.pow(this.matriz_utilidad[usuario_v][i] - media_v, 2);
            }
        }
        return sumatorio1 / (Math.sqrt(sumatorio2) * Math.sqrt(sumatorio3));
    }

    /**
     * Método para calcular la similitud según la distancia coseno.
     * @param usuario_u Usuario u utilizado para el cálculo.
     * @param usuario_v Usuario v utilizado para el cálculo.
     * @returns La similitud según la distancia coseno entre los usuarios u y v.
     */
    distancia_coseno(usuario_u, usuario_v) {
        let sumatorio1 = 0;
        let sumatorio2 = 0;
        let sumatorio3 = 0;
        for (let i = 0; i < this.matriz_utilidad[usuario_u].length; i++) {
            if (this.matriz_utilidad[usuario_u][i] != -1 && this.matriz_utilidad[usuario_v][i] != -1) {
                sumatorio1 += this.matriz_utilidad[usuario_u][i] * this.matriz_utilidad[usuario_v][i];
                sumatorio2 += Math.pow(this.matriz_utilidad[usuario_u][i], 2);
                sumatorio3 += Math.pow(this.matriz_utilidad[usuario_v][i], 2);
            }
        }
        return sumatorio1 / (Math.sqrt(sumatorio2) * Math.sqrt(sumatorio3));
    }

    /**
     * Método para calcular la similitud según la distancia Euclídea.
     * @param usuario_u Usuario u utilizado para el cálculo.
     * @param usuario_v Usuario v utilizado para el cálculo.
     * @returns La similitud según la distancia Euclídea entre los usuarios u y v.
     */
    distancia_euclidea(usuario_u, usuario_v) {
        let sumatorio = 0;
        for (let i = 0; i < this.matriz_utilidad[usuario_u].length; i++) {
            if (this.matriz_utilidad[usuario_u][i] != -1 && this.matriz_utilidad[usuario_v][i] != -1) 
                sumatorio += Math.pow(this.matriz_utilidad[usuario_u][i] - this.matriz_utilidad[usuario_v][i], 2);
        }
        return Math.sqrt(sumatorio);
    }

    /**
     * Método para calcular la media de las valoraciones de un usuario.
     * @param usuario Usuario que se va a utilizar para calcular la media de sus valoraciones.
     * @returns La media de las valoraciones.
     */
    calcular_media(usuario) {
        let media = 0;
        let total = 0;
        for (let i = 0; i < this.matriz_utilidad[usuario].length; i++) {
            if (this.matriz_utilidad[usuario][i] != -1) {
                media += this.matriz_utilidad[usuario][i];
                total++;
            }
        }
        return media / total;
    }

    /**
     * Método para calcular los vecinos de un usuario para un determinado item.
     * @param usuario El usuario al que se le van a calcular los vecinos.
     * @param item El item que no ha valorado el usuario.
     * @returns Los vecinos de un usuario para un determinado item.
     */
    calcular_vecinos(usuario, item) {
        let similitud_vecinos = [];
        let seleccion_vecinos = [];
        for (let i = 0; i < this.matriz_utilidad.length; i++) {
            if (i != usuario)
                similitud_vecinos.push({vecino: i, similitud: this.matriz_similitud[usuario][i]});
        }
        if (this.metrica == "Correlación de Pearson" || this.metrica == "Distancia coseno") {
            similitud_vecinos.sort(function(a, b) {
                return b.similitud - a.similitud;
            });
        } else {
            similitud_vecinos.sort(function(a, b) {
                return a.similitud - b.similitud;
            });
        }
        let i = 0;
        while ((seleccion_vecinos.length < this.num_vecinos) && (i < similitud_vecinos.length)) {
            if (this.matriz_utilidad[similitud_vecinos[i].vecino][item] != -1)
                seleccion_vecinos.push(similitud_vecinos[i]);
            i++;
        }
        return seleccion_vecinos;
    }

    /**
     * Método para calcular la predicción simple.
     * @param usuario El usuario al que se le va a calcular la predicción.
     * @param item El item que no ha valorado el usuario.
     * @returns La predicción calculada.
     */
    prediccion_simple(usuario, item) {
        let sumatorio1 = 0;
        let sumatorio2 = 0;
        let vecinos = this.calcular_vecinos(usuario, item);
        this.vecinos_usuarios.push([usuario, item, vecinos]);
        for (let i = 0; i < vecinos.length; i++) {
            sumatorio1 += vecinos[i].similitud * this.matriz_utilidad[vecinos[i].vecino][item];
            sumatorio2 += Math.abs(vecinos[i].similitud);
        }
        let prediccion = sumatorio1/sumatorio2;
        this.calculo_predicciones.push([usuario, item, sumatorio1, sumatorio2, prediccion]);
        return prediccion;
    }

    /**
     * Método para calcular la predicción utilizando la diferencia con la media.
     * @param usuario El usuario al que se le va a calcular la predicción.
     * @param item El item que no ha valorado el usuario.
     * @returns La predicción calculada.
     */
    diferencia_media(usuario, item) {
        let sumatorio1 = 0;
        let sumatorio2 = 0;
        let vecinos = this.calcular_vecinos(usuario, item);
        this.vecinos_usuarios.push([usuario, item, vecinos]);
        let media_usuario = this.calcular_media(usuario);
        for (let i = 0; i < vecinos.length ; i++) {
            sumatorio1 += vecinos[i].similitud * (this.matriz_utilidad[vecinos[i].vecino][item] - this.calcular_media(vecinos[i].vecino));
            sumatorio2 += Math.abs(vecinos[i].similitud);
        }
        let prediccion = media_usuario + (sumatorio1 / sumatorio2);
        this.calculo_predicciones.push([usuario, item, media_usuario, sumatorio1, sumatorio2, prediccion]);
        return prediccion;
    }

    /**
     * Método que recorre la matriz de utilidad original buscando los items no valorados y calculando sus predicciones.
     * @returns La matriz de utilidad con las predicciones resueltas.
     */
    recomendar() {
        let matriz_resuelta = [];
        for (let i = 0; i < this.matriz_utilidad.length; i++) {
            matriz_resuelta.push([]);
            for (let j = 0; j < this.matriz_utilidad[i].length; j++) {
                matriz_resuelta[i][j] = this.matriz_utilidad[i][j];
            }
        }

        for (let i = 0; i < this.matriz_utilidad.length; i++) {
            for (let j = 0; j < this.matriz_utilidad[i].length; j++) {
                if (this.matriz_utilidad[i][j] == -1) {
                    switch (this.tipo_prediccion) {
                        case 'Predicción simple':
                            matriz_resuelta[i][j] = this.prediccion_simple(i, j);
                            break;
                        case 'Diferencia con la media':
                            matriz_resuelta[i][j] = this.diferencia_media(i, j);
                            break;
                    }
                }
            }
        }
        return matriz_resuelta;
    }
}
