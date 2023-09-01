
// pool.js
// Croquet Microverse
// A variable sized rectangular pool of water

// the following import statement is solely for the type checking and
// autocompletion features in IDE.  A Behavior cannot inherit from
// another behavior or a base class but can use the methods and
// properties of the card to which it is installed.
// The prototype classes ActorBehavior and PawnBehavior provide
// the features defined at the card object.

import {ActorBehavior, PawnBehavior} from "../PrototypeBehavior";

class PoolActor extends ActorBehavior {
    setup() {
        this.future(1000).update();
    }

    update(){
        this.say("updatePool", this.now());
        this.future(20).update();
    }
}

class PoolPawn extends PawnBehavior {
    setup() {
        this.constructPool();
        this.listen("updatePool", this.updatePool);
    }

    constructPool(){
        const THREE = Microverse.THREE;
        return Promise.all([
            import("../assets/src/WaterReflector.js"),
        ]).then(([water_S]) => {
            let waterNormals = this.loadTextureAsset("./assets/images/waternormals.jpg");
            let size = this.actor._cardData.poolSize;
            const waterGeometry = new THREE.PlaneGeometry( ...size );
            waterNormals.wrapS = waterNormals.wrapT = THREE.RepeatWrapping;
            let sunVector = new THREE.Vector3(-1, -1, 1);
            sunVector.normalize();
            this.water = new water_S.Water(
                waterGeometry,
                {
                    textureWidth: 512,
                    textureHeight: 512,
                    waterNormals: waterNormals,
                    sunDirection: sunVector,
                    sunColor: 0xffffff,
                    waterColor: 0xaaaaff, //0x001eff,
                    distortionScale: 3.7,
                    //side:THREE.DoubleSide,
                    //fog: scene.fog !== undefined
                }
            );
            console.log(this.water);
            this.water.rotation.x=-Math.PI/2;
            this.shape.add(this.water);
        });
    }

    loadTextureAsset(URL){
    //console.log("loadTextureAsset "+URL)
            let assetManager = this.service("AssetManager").assetManager;
            return assetManager.fillCacheIfAbsent(URL, () => {
                let tex = new Microverse.THREE.TextureLoader().load(URL);
                tex.wrapS = tex.wrapT = Microverse.THREE.RepeatWrapping;
                tex.repeat.set(1,1);
                return tex;
            }, this.id);
        }

    updatePool(t){
        if(this.water && this.water.material)this.water.material.uniforms[ 'time' ].value = t*0.0001;
    }
}

export default {
    modules: [
        {
            name: "Pool",
            actorBehaviors: [PoolActor],
            pawnBehaviors: [PoolPawn],
        }
    ]
}
