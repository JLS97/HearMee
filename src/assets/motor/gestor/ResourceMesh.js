

var indicesLength;
var verticesLength;
var textBuffer;
var indBuffer;
var verBuffer;
var norBuffer;
var indices;
var vertices;
var normals;
var gl;

var uLightColor;
var uLightDirection ;

class ResourceMesh extends Resource {
    constructor(name) {
        super(name);
        this.vertPositionBuffer = null;
        this.normalsBuffer = null;
        this.indicesBuffer = null;
        this.textureBuffer = null;
        this.model = null;
        this.textures = [];
        this.colorsBuffer = null;
        this.n_vertices = null;
        this.n_indices = null;
        this.n_normals = null;
        this.tex_name = false;

    }

    loadFile(file_name, gl, shaderProgram) {
        //console.log(file_name); 
        let ext = file_name.substring(file_name.lastIndexOf('.')).toLowerCase(); //Coge la extensión del archivo en minúsculas

        if (ext == '.json') {
            let req = new XMLHttpRequest();
            req.open('GET', file_name, false);
            req.send();

            if (req.status == 200) {

                this.loadModel(JSON.parse(req.responseText), gl);

            }
        } else if (ext == '.obj') {
            let req = new XMLHttpRequest();
            req.open('GET', file_name, false);
            req.send();

            if (req.status == 200) {
                var obj = new OBJ.Mesh(req.responseText);
                //console.log(obj)
                this.loadModel(obj, gl);

            }
        }
        else {
            throw new Exception('Only JSON 3D models are accepted');
        }
    }

    loadModel(model,gl){
        
        this.model = model;
        
        //console.log(model);

        if (this.model.vertices && this.model.vertices.length != 0) {
            const vertexBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.model.vertices), gl.STATIC_DRAW);
            this.n_vertices = this.model.vertices.length;
            vertices = this.model.vertices;
            this.vertPositionBuffer = vertexBuffer;
            verBuffer=vertexBuffer;
        }
        if (this.model.indices && this.model.indices.length != 0) {
            const indicesBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indicesBuffer);
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.model.indices), gl.STATIC_DRAW);
            this.n_indices = this.model.indices.length;
            indicesLength =  this.model.indices.length;
            indices = this.model.indices;
            this.indicesBuffer = indicesBuffer;
            indBuffer=indicesBuffer;
        }

        if (this.model.texture || this.model.texcoords) {
            this.tex_name = this.model.texture;
            const textureBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, textureBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.model.texcoords),gl.STATIC_DRAW);
            this.textureBuffer = textureBuffer;
            textBuffer=textureBuffer;
        }
        else { this.tex_name = false; }

        if (this.model.normals && this.model.normals.length != 0) {
            const normalsBuffer= gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER,normalsBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.model.normals),gl.STATIC_DRAW);
            this.normalsBuffer=normalsBuffer;
            this.n_normals = this.model.normals.length;
            norBuffer=normalsBuffer;
        }

    } 
    
   draw(gl, programInfo, mat, cam, textures) {
       console.log(cam);



       gl.useProgram(programInfo);

       console.log(textures);
      

        // Uniforms
        //Obtener las matrices model, view y projection del árbol de la escena
        //Obtener la posición de las luces y otras variables
        //Asociar cada matriz y variable a un uniform del shader
        
        
        /*
        var triangleVertexPositionBuffer =gl.createBuffer();
        gl.bindBuffer( gl.ARRAY_BUFFER, triangleVertexPositionBuffer);
        gl.bufferData( gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
        gl.bindBuffer( gl.ARRAY_BUFFER, null);
    
        //The following code snippet creates a vertex buffer and binds the indices to it
        var triangleIndicesBuffer =gl.createBuffer();
        gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, triangleIndicesBuffer);
        gl.bufferData( gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices),gl.STATIC_DRAW);
        gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, null);
        */
    
        /*
        var vertexShader = getAndCompileShader("vertexShader");
        var fragmentShader = getAndCompileShader("fragmentShader");
        var shaderProgram =gl.createProgram();
        gl.attachShader(shaderProgram, vertexShader);
        gl.attachShader(shaderProgram, fragmentShader);
        gl.linkProgram(shaderProgram);
    
        if (! gl.getProgramParameter(shaderProgram,gl.LINK_STATUS)) {
            alert("Could not link shaders");
        }
    */
    
    
    
    
    
        
    
        var positionAttributeLocation =gl.getAttribLocation(
            programInfo,
            "position"
        );

        
        var normalAttributeLocation =gl.getAttribLocation(programInfo,"normal");

        var textureCoordinateAttributeLocation =gl.getAttribLocation(
            programInfo,
            "textureCoordinate"
        );


        
    
    
        //var colorAttributeLocation =gl.getAttribLocation(shaderProgram, "color");
        //gl.enableVertexAttribArray(colorAttributeLocation);
        //gl.bindBuffer( gl.ARRAY_BUFFER, triangleVertexColorBuffer);
        //voidgl.vertexAttribPointer(index, size, type, normalized, stride, offset);
        //gl.vertexAttribPointer(colorAttributeLocation, 4,gl.FLOAT, false, 0, 0);
        /*
        const FLOAT_SIZE = 4;
        gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexPositionAndColorBuffer);
        gl.vertexAttribPointer(positionAttributeLocation, 3 ,gl.FLOAT, false, 7*FLOAT_SIZE, 0);
        gl.vertexAttribPointer(colorAttributeLocation, 4 ,gl.FLOAT, false, 7*FLOAT_SIZE, 3*FLOAT_SIZE);
        */
        var modelMatrix = mat;
        var viewMatrix = cam.getViewMatrix();
        var projectionMatrix = cam.getProjectionMatrix();
        
  
        var samplerUniformLocation = gl.getUniformLocation(programInfo, "sampler0");
        
        var modelMatrixLocation = gl.getUniformLocation(programInfo, "modelMatrix");
        var viewMatrixLocation = gl.getUniformLocation(programInfo, "viewMatrix");
        var projectionMatrixLocation = gl.getUniformLocation(
            programInfo,
            "projectionMatrix"
        );
        var camera = {position: glMatrix.vec3.fromValues(0,0,0), direction: glMatrix.vec3.fromValues(0,0,-1), pitch:0, yaw: -1*Math.PI/2.0};
        

       

        //Intento de luz
        gl.uniform3f(uLightColor, 1.0, 1.0, 1.0);
        var lightDirection = glMatrix.vec3.fromValues(0.5,3.0,4.0);

        var lightDirectionNormal = glMatrix.vec3.normalize(glMatrix.vec3.create(), lightDirection);
        gl.uniform3fv(uLightDirection, lightDirectionNormal);




        gl.clearColor(1, 0, 0, 0.0);
        gl.enable( gl.DEPTH_TEST);

        //gl.clear( gl.COLOR_BUFFER_BIT |gl.DEPTH_BUFFER_BIT);
        
           
    
        gl.bindBuffer( gl.ARRAY_BUFFER, verBuffer);
        //voidgl.vertexAttribPointer(index, size, type, normalized, stride, offset);
        gl.vertexAttribPointer(positionAttributeLocation, 3,gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(positionAttributeLocation);
    
        gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER,  indBuffer);




        gl.vertexAttribPointer(normalAttributeLocation,3,gl.FLOAT,true,3 * Float32Array.BYTES_PER_ELEMENT,0);        

        gl.bindBuffer(gl.ARRAY_BUFFER,this.norBuffer);

         //Limpiamos buffer de texturas
      // gl.bindTexture(gl.TEXTURE_2D, null);

       //Comprueba si en el array que pasamos de texturas existe una textura para el modelo y la devuelve
       var resourcetex = this.getTexture(textures);
       console.log(this.textureBuffer);

       var texturaslistas= false;

        // Cargamos textura si existe y creamos su buffer
        if (resourcetex) {
            this.texture = resourcetex.texture;
            console.log(resourcetex.texture);

            const numComponents = 2;
            const type = gl.FLOAT;
            const normalize = false;
            const stride = 0;
            const offset = 0;
            
            gl.enableVertexAttribArray(textureCoordinateAttributeLocation);
            gl.bindBuffer(gl.ARRAY_BUFFER, textBuffer);
            gl.vertexAttribPointer(textureCoordinateAttributeLocation, numComponents,type,normalize,stride,offset);
           // gl.enableVertexAttribArray(programInfo.attribLocations.textureCoord);

            // Tell WebGL we want to affect texture unit 0
            gl.activeTexture(gl.TEXTURE0);

            // Bind the texture to texture unit 0
            gl.bindTexture(gl.TEXTURE_2D, this.texture);

            // Tell the shader we bound the texture to texture unit 0
            gl.uniform1i(samplerUniformLocation, 0);
            texturaslistas=true;
        }

         //Información de las luces.
         var ambientUninformLocation= gl.getUniformLocation(programInfo,'ambientLightIntensity');
         var sunlightDirUniformLocation= gl.getUniformLocation(programInfo,'sunlightDirection');
         var sunlightIntUniformLocation=gl.getUniformLocation(programInfo,'sunlightIntensity');
 
         gl.uniform3f(ambientUninformLocation, 0.7, 0.7, 0.7);
         gl.uniform3f(sunlightDirUniformLocation, 0.5, 3.0, 4.0 );
         gl.uniform3f(sunlightIntUniformLocation, 0.9, 0.9, 0.9);
 

       
        requestAnimationFrame(runRenderLoop);


        function runRenderLoop(){

            moveCamera(camera);
            var target = glMatrix.vec3.create();
              glMatrix.vec3.add(target, camera.position, camera.direction);
                
                
                glMatrix.mat4.lookAt(viewMatrix,camera.position,target, glMatrix.mat3.fromValues(0,1,0));
               
                gl.uniformMatrix4fv(modelMatrixLocation, false, modelMatrix);
                gl.uniformMatrix4fv(viewMatrixLocation, false, viewMatrix);
                gl.uniformMatrix4fv(projectionMatrixLocation, false, projectionMatrix);
                gl.useProgram(programInfo);
                gl.drawElements( gl.TRIANGLES, indicesLength,gl.UNSIGNED_SHORT,0);

            
            requestAnimationFrame(runRenderLoop);
            
        }  
        
        

        console.log("metodo de dibujado de RecursoMalla");
    }
    
    cargarTextura(texture) {
        this.texture = texture;
        this.textureBuffer = this.texture.textureBuffer;

    }

    getTexture(textures) {
        for (var i = 0; i < textures.length; i++) {
            if (textures[i].name == this.tex_name)
                return textures[i];
        }

        return textures[0];

    }

}
var isWPressed = false;
var isSPressed = false; 
var isAPressed = false; 
var isDPressed = false; 
var isGPressed = false; 
var isJPressed = false; 
var isYPressed = false;
var isHPressed = false; 
var boton= true;

document.getElementById("start").addEventListener("click", function(event)
{
    boton=!boton;
}  
);

document.addEventListener("keydown", function(event)
{
    if(event.key =='w'){
       isWPressed = true;
    }
    if(event.key =='s'){
        isSPressed= true;
    }
    if(event.key =='d'){
       isDPressed = true;
    }
    if(event.key =='a'){
       isAPressed = true; 
    }
    if(event.key =='g'){
       isGPressed = true; 
    }
    if(event.key =='j'){
       isJPressed = true; 
    }
    if(event.key =='y'){
       isYPressed = true; 
    }
    if(event.key =='h'){
       isHPressed = true; 
    }
}  
);

function moveCamera(camera)
{
    camera.direction[0] = Math.cos(camera.pitch) * Math.cos(camera.yaw);
    camera.direction[1] = Math.sin(camera.pitch);
    camera.direction[2] = Math.cos(camera.pitch) * Math.sin(camera.yaw);


    camera.right = glMatrix.vec3.fromValues(-1*Math.sin(camera.yaw), 0 , Math.cos(camera.yaw));
    var movementDirection = glMatrix.vec3.create();
    if(isWPressed){
        glMatrix.vec3.scale(movementDirection, camera.direction, .1);
        glMatrix.vec3.add(camera.position, camera.position, movementDirection);
    }
    if(isSPressed){
        glMatrix.vec3.scale(movementDirection, camera.direction, -.1);
        glMatrix.vec3.add(camera.position, camera.position, movementDirection);
    }
    if(isAPressed){
        glMatrix.vec3.scale(movementDirection, camera.right, -.1);
        glMatrix.vec3.add(camera.position, camera.position, movementDirection);
    }
    if(isDPressed){
        glMatrix.vec3.scale(movementDirection, camera.right, .1);
        glMatrix.vec3.add(camera.position, camera.position, movementDirection);
    }
    //rotations
    if(isGPressed){
        camera.yaw -= .02;
    }
    if(isJPressed){
        camera.yaw += .02;
    }
    if(isYPressed){
        camera.pitch += .02;
    }
    if(isHPressed){
        camera.pitch -= .02;
    }

    if(boton==true){
        glMatrix.vec3.scale(movementDirection, camera.right, -.05);
        glMatrix.vec3.add(camera.position, camera.position, movementDirection);
        camera.yaw += .01;
    }
}

document.addEventListener("keyup", function(event)
{
    if(event.key =='w'){
        isWPressed = false;
     }
     if(event.key =='s'){
         isSPressed= false;
     }
     if(event.key =='d'){
        isDPressed = false;
     }
     if(event.key =='a'){
        isAPressed = false; 
     }
     if(event.key =='g'){
        isGPressed = false; 
     }
     if(event.key =='j'){
        isJPressed = false; 
     }
     if(event.key =='y'){
        isYPressed = false; 
     }
     if(event.key =='h'){
        isHPressed = false; 
     }
});

