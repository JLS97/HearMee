class ResourceMaterial extends Resource {
    constructor(name) {
        super(name);
    }

    loadFile(file_name, gl) {
        let ext = file_name.substring(file_name.lastIndexOf('.')).toLowerCase(); //Coge la extensión del archivo en minúsculas

        if (ext == '.mtl') {
            let req = new XMLHttpRequest();
            req.open('GET', file_name, false);
            req.send();
            if (req.status == 200) {
               // var mat = new 
                this.name = file_name.split("/").pop().split(".")[0].toLowerCase();//Seleccionamos el nombre del fichero de textura
                this.loadModel(req.responseURL, gl);//cargamos el material no el buffer
            }
        }
        else {
            throw new Exception('Only .mtl,are accepted');
        }
    }

    loadModel(urlMat, gl) {
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
        gl.texImage2D(gl.TEXTURE_2D, level, internalFormat, width, height, border, srcFormat, srcType, pixel);
        const image = new Image();
        var me = this;
        image.onload = function () {
          
            gl.bindTexture(gl.TEXTURE_2D, texture);
            //document.getElementById("imgprueba").src = urlMat;
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
        image.src = urlMat
        
        this.texture = texture;

    }


}