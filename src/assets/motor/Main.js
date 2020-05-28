
async function main() {

    const canvas = document.getElementById('canvas');

    const gl = canvas.getContext("webgl2");

    var ctx = canvas.getContext("2d");

    
    //PROBAMOS LA CLASE DE MOTORTAG
    console.log("PROBAMOS LA CLASE DE MOTORTAG");

    var gestorR = new ResourceManager();
    var motor = new MotorTAG(null, gestorR, gl);

    var tras = new glMatrix.vec3.fromValues(0, -1, -5);
    var tras2 = new glMatrix.vec3.fromValues(0, 0, -10);
    var rot = new glMatrix.vec3.fromValues(0, 270, 0);
    var rot2 = new glMatrix.vec3.fromValues(0, 0, 0);
    var esc = new glMatrix.vec3.fromValues(0.25, 0.25, 0.25);

    // Creamos textura, cámara, luz y malla
    motor.cargarTexturas(["./assets/motor/texturas/texturaradio.jpg"]);

    //camara (fovy, aspect, near, far)
    var cam = motor.crearCamara((45 * Math.PI) / 180.0,  (canvas.width / canvas.clientHeight), 0.1, 20);
    
    var luz = motor.crearLuz(0.9,(canvas.width / canvas.clientHeight));
    var malla = motor.crearMalla("./assets/motor/modelos/radio.json");
    
    var nodoCamara = motor.crearNodo(motor.getNodoRaiz(), cam, null, rot2, null );

    var nodoMalla = motor.crearNodo(motor.getNodoRaiz(), malla, tras, rot, esc );
    //var nodoMalla2 =  motor.crearNodo(nodoMalla, malla, tras2, rot, null); 
    
    var nodoLuz =  motor.crearNodo(motor.getNodoRaiz(), luz, null, null, null);
    //nodoLuz.Rotar(0, 90, 0);
    var nViewport = motor.registrarViewport(10,10,10,10);
    motor.setViewportActivo(nViewport);
    
    var nLuz = motor.registrarLuz(nodoLuz);
    motor.setLuzActiva(nLuz);
    
    
    motor.dibujarEscena();
    


    console.log(nodoCamara);

    console.log(malla);

    console.log(motor);



    //Estructura del árbol

    //                                          Escena
    //
    //  Luz            Camara                    Radio                               Figura
    //
    //                               Boton1      Boton2    Cuerpo          Particula1      Particula2
    //
    //
    // Recorrido preorden: Escena, Luz, Camara, Radio, Boton1, Boton2, Cuerpo, Figura, Particula1, Particula2
    //
    /*
    //Creamos la estructura del arbol
    console.log("CREAMOS LA ESTRUCTURA DEL ARBOL:");
    //Creamos los nodos, el primero no tendrá padre
    var nEscena = new Nodo(null);
    //el resto si que tienen padre
    var nLuz = new Nodo(nEscena);
    var nCamara = new Nodo(nEscena);
    var nRadio = new Nodo(nEscena);
    var nFigura = new Nodo(nEscena);
    var nBoton1 = new Nodo(nRadio);
    var nBoton2 = new Nodo(nRadio);
    var nCuerpo = new Nodo(nRadio);
    var nParticula1 = new Nodo(nFigura);
    var nParticula2 = new Nodo(nFigura);

    */
    //prueba de RECURSOS:
    /*
    console.log("PRUEBA DE RECURSOS:");
    var recursoMalla = new RecursoMalla();
    recursoMalla.setNombre("mallaPrueba");

    await recursoMalla.cargarFichero("./modelos/radiofinal.json");

    console.log(recursoMalla);
    console.log(recursoMalla.vertices);
    console.log(recursoMalla.getNombre());
    recursoMalla.Draw(gl);

    var gestorR = new GestorRecursos();
    //probamos el gestor de recurso intentando acceder a "pruebaGestor" sin estar declarado, por lo que lo crea
    gestorR.getRecurso("pruebaGestor");
    // y aqui le pedimos el nombre del recurso "pruebaGestor" al gestor de recursos
    console.log(gestorR.getRecurso("pruebaGestor").getNombre());
    */
    /*
    //prueba de ENTIDADES
    console.log("PRUEBA DE ENTIDADES:");
    //Creamos las entidad que vamos a aplicar a los nodos
    var matriz = glMatrix.mat4.create();
    var intensidad = glMatrix.vec3.create(1,1,1);
    var eLuz = new Luz(matriz,intensidad);
    var eCam = new Camara(matriz, true, true, true);
    var eMalla = new Malla(matriz, true);

    //Añadimos las entidades a los nodos
    nLuz.setEntidad(eLuz);
    nCamara.setEntidad(eCam);
    nFigura.setEntidad(eMalla);

    //añadimos los hijos del nodo escena
    nEscena.addHijo(nLuz);  
    nEscena.addHijo(nCamara);
    nEscena.addHijo(nRadio);
    nEscena.addHijo(nFigura);

    //añadimos los hijos del nodo Radio
    nRadio.addHijo(nBoton1);
    nRadio.addHijo(nBoton2);
    nRadio.addHijo(nCuerpo);

    //añadimos los hijos del nodo Figura
    nFigura.addHijo(nParticula1);
    nFigura.addHijo(nParticula2);

    
    ///prueba de NODOS:   
    console.log("PRUEBA DE NODOS:");
    nLuz.setTraslacion(2,10,2);
    nLuz.setRotacion(10, 4, 3);
    nLuz.setEscalado(6,5,10);
    nLuz.setRotacion(10,10,10);

    //la mostramos
    console.log(nLuz.calcularMatriz());
    

    //Recorrer el arbol
    console.log("Recorrido preorden al borrar el hijo radio dibujando las entidades y calculando la matriz: ");
    var MatrizIdentidad = glMatrix.mat4.create();
    nEscena.recorrer(MatrizIdentidad);

    //Prueba de juntar el motor con WebGl
    console.log("PRUEBA DE JUNTAR EL MOTOR CON EL DIBUJADO");
    var motor2= new MotorTAG();
    
    var pruebaMalla = motor.crearMalla("pruebaDatos");
    var nodoPrueba = motor.crearNodo(motor2.getNodoRaiz(), pruebaMalla);
    */
    
}