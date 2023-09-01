
// gridsphere.js
// Croquet Microverse
// A variable sized sphere object that aligns to a grid 1 to 1

// the following import statement is solely for the type checking and
// autocompletion features in IDE.  A Behavior cannot inherit from
// another behavior or a base class but can use the methods and
// properties of the card to which it is installed.
// The prototype classes ActorBehavior and PawnBehavior provide
// the features defined at the card object.

import {ActorBehavior, PawnBehavior} from "../PrototypeBehavior";

class GridSphereActor extends ActorBehavior {
    setup() {

    }
}

class GridSpherePawn extends PawnBehavior {
    setup() {
        this.gridTexture = this.loadGrid();
        this.constructSphere();
    }

    loadGrid(){
        let assetManager = this.service("AssetManager").assetManager;
        const THREE = Microverse.THREE;
        const gridImage = `./assets/images/grid.png`
        let txtr = assetManager.fillCacheIfAbsent(gridImage, () => {
            let tex = new THREE.TextureLoader().load(gridImage);
            tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
            return tex;
        }, this.id);
        return txtr;
    }

    setGrid(u, v){
        const THREE = Microverse.THREE;
        let gt = this.gridTexture.clone();

        gt.repeat = new THREE.Vector2(u,v);
        return gt;
    }

    constructSphere(){
        const THREE = Microverse.THREE;
 
        let size = this.actor._cardData.blockSize;
        var geometry = new THREE.SphereGeometry( ...size );
        let [x,y,z] = [...size];
        let material = new THREE.MeshStandardMaterial({map:this.setGrid(z,y), color: 0x808080, side: THREE.FrontSide});
    
        this.gridSphere = new THREE.Mesh( geometry) //, material );
        this.gridSphere.receiveShadow = true;
        this.gridSphere.castShadow = true;

        this.shape.add(this.gridSphere);
    }

}

export default {
    modules: [
        {
            name: "GridSphere",
            actorBehaviors: [GridSphereActor],
            pawnBehaviors: [GridSpherePawn],
        }
    ]
}
