//import * as gm from './librerias/gl-matrix';
//Construimos la clase Entidad
class Entidad{
    constructor(){
        if(this.constructor === Entidad ){
            throw new TypeError ("No se pueden hacer entidades abstractas");
        }
    }
    //TODO: Funcion de dibujado, que ahora solo muestra el mensaje
}

//Construimos la subclase luz
class Luz extends Entidad {
    constructor(intensidad, posicion){
        super();
        this.activada=false;
        this.intensidad=intensidad;
        this.posicion=posicion;
    }
    dibujar(gl, programInfo,  matriztrans, cam, texture){
        
        console.log("aqui llega luz")
    }
    //metodo para modificar el vector de intensidad
    setIntensidad(x,y,z){
        if(x!=null && y!=null && z!=null){
            super.intensidad = [x,y,z];
            return true;
        }else{
            return false;
        }
    }
    getIntensidad(){
        return this.intensidad;
    }
    setPosicion(x,y,z){
        if(x!=null && y!=null && z!=null){
            super.posicion = [x,y,z];
            return true;
        }else{
            return false;
        }
    }
    getPosicion(){
        return this.posicion;
    }
    getPosicion(){
        return this.posicion;
    }
    setActivada(){
        this.activada=true;
    }
}

//Construimos la subclase Camara
class Camara extends Entidad {
    constructor(perspectiva, aspecto, cercano, lejano){
        super();
        this.activada=false;
        this.perspectiva=perspectiva;
        this.aspecto=aspecto;
        this.cercano=cercano;
        this.lejano=lejano;
     //console.log("esta Entidad de tipo: "+this.tipo+" esta en pespectiva: "+this.perspectiva + " " + this.cercano + " " + this.lejano);
        this.projectionMatrix = glMatrix.mat4.create();  
        this.projectionMatrix = glMatrix.mat4.perspective(this.projectionMatrix, perspectiva, aspecto, cercano, lejano);
        this.viewMatrix = glMatrix.mat4.create();  

    }

    //TO DO: la camara no necesita dibujar, creo
    dibujar(gl, programInfo,  matriztrans, cam, texture){
        glMatrix.mat4.invert(this.viewMatrix,matriztrans);
    }

    getProjectionMatrix(){
        return this.projectionMatrix;
    }
    getViewMatrix(){
        return this.viewMatrix;
    }
    setCercano(nuevoCer){
        this.cercano=nuevoCer;
    }
    setLejano(nuevoLej){
        this.lejano=nuevoLeg;
    }
    //metodo para modificar el vector de la perspectiva
    setPerspectiva(cercano, lejano){
        if(cercano!=null && lejano!=null){
            this.cercano = cercano;
            this.lejano= lejano;
            return true;
        }else{
            return false;
        }
    }
    setParalela(cercano, lejano){
        if(cercano!=null && lejano!=null){
            this.cercano = cercano;
            this.lejano= lejano;
            return true;
        }else{
            return false;
        }
    }
    setActivada(estado){
        this.activada=estado;
    }
    setViewMatrix(matriz){
        this.viewMatrix=matriz;
    }
}

//Construimos la subclase Malla
class Malla extends Entidad {
    constructor(malla){
        super();

        this.malla=malla;
        
    }
    dibujar(gl, programInfo,  matriztrans, cam, texture){
    
        console.log("PUNTO DE CONTROL");
        console.log(matriztrans);
        this.malla.draw(gl,programInfo,matriztrans,cam,texture);
        //TO DO: this.malla bla bla bla 
        console.log("aqui llega malla")
    }
    getMalla() {
        return this.malla;
    }
}
