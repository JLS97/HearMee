class ResourceTexture extends Resource {
    constructor(name) {
        super(name);
        var self = this;
        this.textureBuffer = null;
        this.texture = null;
        //  this.image = new Image();

        /*  this.image.onload = function () {
              self.loadModel();
          }*/
    }
    isPowerOf2(value) {
        return (value & (value - 1)) == 0;
    }

    loadFile(file_name, gl) {
        let ext = file_name.substring(file_name.lastIndexOf('.')).toLowerCase(); //Coge la extensión del archivo en minúsculas

        if (ext == '.png' || ext == '.jpg' || ext == '.jpeg') {
            let req = new XMLHttpRequest();
            req.open('GET', file_name, false);
            req.send();
            if (req.status == 200) {
                this.name = file_name.split("/").pop().split(".")[0].toLowerCase();//Seleccionamos el nombre del fichero de textura
                this.loadModel(req.responseURL, gl);//cargamos la textura no el buffer

            }
        }
        else {
            throw new Exception('Only .png, .jpg or .jpeg are accepted');
        }
    }

    loadModel(urlTex, gl) {
        const texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);
        // Creamos la textura y primero le asignamos color azul. Una vez se carga la imagen, actualizamos la textura
        const level = 0;
        const internalFormat = gl.RGBA;
        const width = 1;
        const height = 1;
        const border = 0;

        const srcFormat = gl.RGBA;
        const srcType = gl.UNSIGNED_BYTE;
        const pixel = new Uint8Array([0, 0, 255, 255]);  // opaque blue
        //gl.texImage2D(gl.TEXTURE_2D, level, internalFormat, width, height, border, srcFormat, srcType, pixel);
        const image = new Image();
        var me = this;
        
        image.src = urlTex
         image.onload = function () {
          console.log(gl)
            gl.bindTexture(gl.TEXTURE_2D, texture);
            //document.getElementById("imgprueba").src = urlTex;
            gl.texImage2D(gl.TEXTURE_2D, level, internalFormat, srcFormat, srcType, image);
            //Para el funcionamiento correcto la textura tiene que ser de dimensiones potencia de 2
          
              if (me.isPowerOf2(this.width) && me.isPowerOf2(this.height)) {
                  // Yes, it's a power of 2. Generate mips.
                  gl.generateMipmap(gl.TEXTURE_2D);
                  
              } else {
                  // No, it's not a power of 2. Turn of mips and set
                  // wrapping to clamp to edge
                  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
                  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
                  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
              }
        };
        console.log(texture)
        this.texture = texture;

    }


}


