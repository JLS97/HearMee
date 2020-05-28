//Construimos la clase nodo
class MotorTAG{
    constructor(escena,gestorR,gl){
        if(escena!=null){
            this.escena = escena;
        }
        else{
            this.escena = new Nodo();
        }


        this.gl = gl;


        if(this.gestorR!=null){
            this.gestorRecursos=gestorR;
        }
        else{
            this.gestorRecursos = new ResourceManager();
        }
        this.registroTexturas=[];
        this.registroLuces = [];
        this.registroCamaras = [];
        this.registroViewports = [];
        //hay que ver como gestionar el viewport, ya que si en un futuro hay que llamar a la interfaz-
        //- tal vez sale a cuenta crear un viewport predefinido 
        this.viewportActivo=new Viewport();
        this.camaraActivada=new Camara();
        this.luzActivada=new Luz();
        this.actualizarLuz=false;
        this.actualizarCam=false;

        this.program = this.iniciarPrograma();
    }

    
    iniciarPrograma(){

        var vertexShader = this.getAndCompileShader("vertexShader");
        var fragmentShader = this.getAndCompileShader("fragmentShader");
        var shaderProgram =this.gl.createProgram();

        this.gl.attachShader(shaderProgram, vertexShader);
        this.gl.attachShader(shaderProgram, fragmentShader);
        this.gl.linkProgram(shaderProgram);

        // Comprobamos estado del programa despues de unir los shaders

        if (!this.gl.getProgramParameter(shaderProgram, this.gl.LINK_STATUS)) {
            console.log('Fallo al crear el programa o cargar los shaders en el ' + this.gl.getProgramInfoLog(shaderProgram));
        }
        return shaderProgram;

    }
     getAndCompileShader(id){
        var shader;
        var shaderElement = document.getElementById(id);
        var shaderText = shaderElement.text.trim();
        if (id == "vertexShader")
            shader = this.gl.createShader(this.gl.VERTEX_SHADER);
        else if(id == "fragmentShader")
            shader = this.gl.createShader(this.gl.FRAGMENT_SHADER);
        
            this.gl.shaderSource(shader,shaderText);
            this.gl.compileShader(shader);

        if (!this.gl.getShaderParameter(shader,this.gl.COMPILE_STATUS)){
            alert(this.gl.getShaderInfoLog(shader));
            return null;
        }

        return shader;
    }

    cargarTexturas(texturas) {
        console.log(this.gestorRecursos);
        for (var i = 0; i < texturas.length; i++) {
            var textura = this.gestorRecursos.getResource(texturas[i], this.gl);
            this.registroTexturas.push(textura);
        }
    }
    

    // EL ORDEEEEN
    crearNodo(padre, ent, traslacion, rotacion, escalado){
        if(padre==null){
            padre = this.escena;
        }
        var nodoNuevo = new Nodo(padre, ent);

        if(traslacion!=null){
            nodoNuevo.setTraslacion(traslacion);
            nodoNuevo.actualizarMatriz=true;
        }


        if(rotacion!=null){
            nodoNuevo.setRotacion(rotacion);
            nodoNuevo.actualizarMatriz=true;
        }


        if(escalado!=null){
            nodoNuevo.setEscalado(escalado);
            nodoNuevo.actualizarMatriz=true;
        }

        return nodoNuevo;
    }
    //hay que comprobar este metodo
    crearCamara(perspectiva, aspecto, cercano, lejano){
        var nuevaCamara = new Camara(perspectiva, aspecto, cercano, lejano);
        if(this.camaraActivada!=null){
            this.camaraActivada.setActivada(false);
        }
        this.camaraActivada=nuevaCamara;
        nuevaCamara.setActivada(true);

        this.registroCamaras.push(nuevaCamara);
        return nuevaCamara;
    }

    crearLuz(intensidad,posicion){
        var nuevaLuz = new Luz(intensidad,posicion);
        if(this.luzActivada!=null){
            this.luzActivada.setActivada(false);
        }
        this.luzActivada=nuevaLuz;
        nuevaLuz.setActivada(true);

        this.registroLuces.push(nuevaLuz);
        return nuevaLuz;
    }
    
    crearMalla(fichero){
        //pillar del gestor la malla que es y llevarla con gl tb
       // console.log(fichero)
        var model = this.gestorRecursos.getResource(fichero, this.gl);
        var malla = new Malla(model);
        return malla;
    }
    
    getNodoRaiz(){
        return this.escena;
    }

    registrarLuz(nodoluz){
        if(nodoluz!=null){
            return this.registroLuces.push(nodoluz);
        }
        return false;
    }

    setLuzActiva(numLuz){
        this.registroLuces[numLuz-1].getEntidad().setActivada(true);
    } 

    actualizarLuz(){
        this.actualizarLuz=true;
    }

    registrarCam(nodocam){
        if(nodocam!=null){
            return this.registroCamaras.push(nodocam);
        }
        return false;
    }
    //GESTIONAR LAS CAMARAS BIEN QUE ESTO ES UN JALEO
    setCamActiva(numCam){

        this.registroCamaras[numCam-1].getEntidad().setActivada(true);
        this.camaraActivada = this.registroCamaras[numCam-1];
    } 

    actualizarCam(){
        this.actualizarCam=true;
    }

    registrarViewport(x,y,alto,ancho){
        if(x!=null && y!=null && alto!=null && ancho!=null){
            var viupor= new Viewport(x,y,alto,ancho);
        }
        
        return this.registroViewports.push(viupor); 
    }
    //TODO: COMPROBAR QUE EL PUSH DA LA POSICION CORRECTA 
    setViewportActivo(num){
        this.viewportActivo=this.registroViewports[num-1];
    }


    //AQUI HACE FALTA UN ELSE PARA LAS LUCES Y ESO 
    dibujarEscena(){
        if(this.actualizarLuz || this.actualizarCam){
            console.log
            this.escena.recorrerSinDiv();

            this.registroLuces.forEach(element => {
                element.getMatrizTransf();
                element.getEntidad().setActivada();
            });
        }
        console.log(this.registroCamaras);
        this.escena.recorrer(this.gl, this.program, this.camaraActivada, this.registroTexturas);
        
        

    }
}