class ResourceManager {
    constructor() {
        this.resources = [];
    }

    getResource(name, gl) {
        console.log(name);
        let resourceRes = null,
            resources = this.resources;

        if (resources.length != 0) {
            resources.forEach(resource => {
                if (resource != null && resource.getName() == name) {
                    resourceRes = resource;
                    return resourceRes;
                }
            });
        }
        if (resourceRes == null) {
            resourceRes = this.getObjectType(name);
            resourceRes.loadFile(name, gl);
            this.resources.push(resourceRes);
        }
        return resourceRes;

    }

    getObjectType(name) {
        let req = new XMLHttpRequest;
        req.open('GET', name, false);
        req.send();

        if (req.status == 200) {
            let ext = name.substring(name.lastIndexOf('.')).toLowerCase(); //Coge la extensión del archivo en minúsculas
            switch (ext) {
                case '.png':
                    return new ResourceTexture;
                case '.json':
                    return new ResourceMesh;
                case '.obj':
                    return new ResourceMesh;
                case '.jpg':
                    return new ResourceTexture;
                case '.mtl':
                return new ResourceMaterial;
                default:
                    return null;
            }
        }
    }
}