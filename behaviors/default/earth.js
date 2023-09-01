// the following import statement is solely for the type checking and
// autocompletion features in IDE.  A Behavior cannot inherit from
// another behavior or a base class but can use the methods and
// properties of the card to which it is installed.
// The prototype classes ActorBehavior and PawnBehavior provide
// the features defined at the card object.

import {ActorBehavior, PawnBehavior} from "../PrototypeBehavior";

class EarthPawn extends PawnBehavior {
    setup() {
        this.constructEarth();
    }

    constructEarth() {
        // Create the earth
        const SHADOWRADIUS = 3.95; // size of the earth (water)
        const BASERADIUS = 4;      // size of the earth (land)
        const earthbase = `./assets/images/earthbase.png`;
        const earthshadow = `./assets/images/earthshadow.jpg`;

        const THREE = Microverse.THREE;

        [...this.shape.children].forEach((c) => {
            c.material.dispose();
            this.shape.remove(c);
        });

        let assetManager = this.service("AssetManager").assetManager;

        let earthBaseTexture = assetManager.fillCacheIfAbsent(earthbase, () => {
            let tex = new THREE.TextureLoader().load(earthbase);
            tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
            tex.repeat.set(1,1);
            return tex;
        }, this.id);

        let earthShadowTexture = assetManager.fillCacheIfAbsent(earthshadow, () => {
            let tex = new THREE.TextureLoader().load(earthshadow);
            tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
            tex.repeat.set(1,1);
            return tex;
        }, this.id);

        this.shadowSphere = new THREE.Mesh(
            new THREE.SphereGeometry(SHADOWRADIUS, 64, 64),
            new THREE.MeshStandardMaterial({ map: earthShadowTexture, color: 0xaaaaaa, roughness: 0.7, opacity:0.9, transparent: true }));
        this.shadowSphere.receiveShadow = true;
        this.shape.add(this.shadowSphere);

        this.baseSphere = new THREE.Mesh(
            new THREE.SphereGeometry(BASERADIUS, 64, 64),
            new THREE.MeshStandardMaterial({ alphaMap: earthBaseTexture, color: 0x22ee22, roughness: 0.7, opacity:0.9, transparent: true }));
        this.baseSphere.receiveShadow = true;
        this.baseSphere.castShadow = true;
        this.shape.add(this.baseSphere);
    }

    teardown() {
        let assetManager = this.service("AssetManager").assetManager;

        const earthbase = `./assets/images/earthbase.png`;
        const earthshadow = `./assets/images/earthshadow.jpg`;
        assetManager.revoke(earthbase, this.id);
        assetManager.revoke(earthshadow, this.id);
    }
}

export default {
    modules: [
        {
            name: "Earth",
            pawnBehaviors: [EarthPawn],
        }
    ]
}

/* globals Microverse */
