//Construimos la clase nodo
class Nodo{
    constructor(padre,entidad){
        this.hijos = [];
        this.entidad=entidad;
        if(padre!=null) {
            this.padre = padre;
            padre.addHijo(this);
        }
        //para controlar las tranformaciones 
        this.actualizarMatriz=false;
        this.actualizarTras=false;
        this.actualizarRot=false;
        this.actualizarEsc=false;
        //vectores de translacion, rotacion y esccalado
        this.traslacion     = glMatrix.vec3.create();
        this.rotacion       = glMatrix.vec3.create();
        //this.anguloGra      = 0;
        this.escalado       = glMatrix.vec3.create();
        //matriz de transformacion declarada
        this.matrizTransf   = glMatrix.mat4.create();

    }

    //seters y geters de entidad y metodos de gestion del arbol 
    setEntidad(entidad){
        if(entidad!=null){
            this.entidad=entidad;
            return true;
        }
        else{
            return false;
        }
    }

    getEntidad(){
        if(this.entidad!=null){
            return this.entidad;
        }
        else {
            return null;
        }
    }

    getPadre(){
        if(this.padre!=null){
            return this.padre;
        }else{
            return null;
        }
    }

    borraHijo(hijo){
        if(hijo!=null){
            for(var i = 0;i <this.hijos.length;i++){
                if(this.hijos[i]==hijo){
                    //eliminamos el padre del hijo que vamos a borrar
                    this.hijos[i].borraPadre();
                    //eliminamos el hijo del array del padre
                    this.hijos.splice(i,1);
                }
            }
        }
    }

    borraPadre(){
        this.padre = null;
    }

    //metodo para modificar el vector de translacion valores absolutos
    setTraslacion(tras){
        if(tras!=null){
            this.traslacion=tras;
            this.actualizarTras=true;
            return true;
        }
        else return false;
    }

    //metodo para modificar el vector de translacion valores absolutos
    setRotacion(rot){
        if(rot!=null){
            this.rotacion=rot;
            this.actualizarRot=true;
            return true;
        }
        else return false;
    }

    //metodo para modificar el vector de translacion valores absolutos
    setEscalado(esc){
        if(esc!=null){
            this.escalado=esc;
            this.actualizarEsc=true;
            return true;
        }
        else return false;
    }

    //metodo para modificar el vector de translacion valores relativos
    //TODO: REVISAR EL COMO METER LAS TRANSFORMACIONES
    Trasladar(tra){
        if(tra !=null){
            console.log(tra);
            glMatrix.mat4.translate(this.matrizTransf,this.matrizTransf,tra);
            return true;

        }
        else return false;
    }


    //metodo para modificar el vector de rotacion valores relativos
    //los angulos los pasamos en grados pero los pasamos a Radianes antes de aplicar la transformacion

    //angulo????
    Rotar(rot){
        if(rot!=null){
            glMatrix.mat4.rotateX(this.matrizTransf,this.matrizTransf ,rot[0]* Math.PI / 180);
            glMatrix.mat4.rotateY(this.matrizTransf,this.matrizTransf ,rot[1]* Math.PI / 180);
            glMatrix.mat4.rotateZ(this.matrizTransf,this.matrizTransf ,rot[2]* Math.PI / 180);
            return true;
        }
        else return false;
    }


    //metodo para modificar el vector de escalado valores relativos
    //TODO: El escalado se multiplica porque es un valor entre 0-1, preguntar profesor
    Escalar(esc){
        if(esc !=null){
            glMatrix.mat4.scale(this.matrizTransf,this.matrizTransf ,esc);
            return true;

        }else return false;
    }

    //metodo para cambiar la matrizTransf, va bien
    setMatrizTransf(matrizTransf){
        if(matrizTransf!=null){
            this.matrizTransf = matrizTransf;
            this.actualizarMatriz=true;
            return true;
        }else{
            return false;
        }
    }

    //metodo para pedir la matrizTransf, va bien
    getMatrizTransf(){
        if(this.matrizTransf!=null){
            return this.matrizTransf;
        }
        else return null;
    }

    //Añadimos un hijo al nodo. va bien
    addHijo(hijo){
        if(hijo != null){
            this.hijos.push(hijo);
        }
        else{
           alert("no es posible añadir el hijo");
        }
    }

    //metodo para calcular la matriz propia de la clase nodos en funcion de los vectores de transformacion
    //primero rotacion en x, luego en y, luego en z, luego escalado, luego traslacion
    calcularMatriz(){
        /*
        glMatrix.mat4.rotateX(this.matrizTransf,this.matrizTransf, this.rotacion[0]);
        glMatrix.mat4.rotateY(this.matrizTransf,this.matrizTransf, this.rotacion[1]);
        glMatrix.mat4.rotateZ(this.matrizTransf,this.matrizTransf, this.rotacion[2]);
        
        //console.log(this.matrizTransf);
        //aplico las ultimas transformaciones siendo el translate la ultima
        glMatrix.mat4.scale(this.matrizTransf,this.matrizTransf,this.escalado);
        glMatrix.mat4.translate(this.matrizTransf, this.matrizTransf, this.traslacion);

        return this.matrizTransf;
        
       console.log("como llega");
        console.log(this.matrizTransf);
        */
        if(this.actualizarTras){this.Trasladar(this.traslacion);}
         /*
        console.log("despues de trasladar");
        console.log(this.matrizTransf);
        */
        if(this.actualizarEsc){this.Escalar(this.escalado); }
        /*
        console.log("despues de escalar");
        console.log(this.matrizTransf);
        */
        if(this.actualizarRot){this.Rotar(this.rotacion );}
    
    }

    //Recorrido del arbol en Preorden dibujando los nodos y calculando las tranformaciones, como en el ejemplo de las diapos
    /*
    recorrer(matrizAcum){
        if(this.hijos!=null){
            if(this.getEntidad()!=null){
                if(this.actualizarMatriz){
                    glMatrix.mat4.multiply(this.matrizTransf,matrizAcum,this.calcularMatriz());
                }
                this.getEntidad().dibujar();
            }
            this.hijos.forEach(element => {
                element.recorrer(this.matrizTransf);
            });
        }
    }
    */

    //gl: es el rollo de webgl, program info: inromacion que manejo del programa
    recorrer(gl, programInfo, cam, texture, matrizAcum){
        if (this.actualizarEsc || this.actualizarRot || this.actualizarTras || this.actualizarMatriz) {


            this.calcularMatriz();

            glMatrix.mat4.multiply(this.matrizTransf,matrizAcum,this.matrizTransf);

        }

        //AQUI IRIA EL DIBUJADO
        if (this.entidad!=null){ 
            
            this.entidad.dibujar(gl, programInfo, this.matrizTransf, cam, texture);
            /*Dibuja la entidad en cuestión y ejecuta recursivamente para cada nodo del árbol*/

        }
        this.hijos.forEach(element => {
            element.actualizarMatriz=true;
            element.recorrer(gl, programInfo, cam, texture, this.matrizTransf);
        });  
    }

    recorrerSinDiv(matrizAcum){
        if(this.hijos!=null){
            if(this.getEntidad()!=null){
                if(this.actualizarMatriz){
                    glMatrix.mat4.multiply(this.matrizTransf,matrizAcum,this.calcularMatriz());
                }
                //this.getEntidad().dibujar();
            }
            this.hijos.forEach(element => {
                element.recorrerSinDiv(this.matrizTransf);
            });
        }
    }
    /*
    //Se visualizan los hijos del nodo
    getHijos = function(){
        console.log("Hijos de "+this+":");
        if(this.hijos.length>=1){
            this.hijos.forEach(element => {
                console.log(element);
            });
        }else{
            console.log("no tiene hijos");
        }
    }*/
    

}