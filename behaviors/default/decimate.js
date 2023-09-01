// decimate.js
// Croquet Microverse
// Simplifies a 3D object's polygon structure

// the following import statement is solely for the type checking and
// autocompletion features in IDE.  A Behavior cannot inherit from
// another behavior or a base class but can use the methods and
// properties of the card to which it is installed.
// The prototype classes ActorBehavior and PawnBehavior provide
// the features defined at the card object.

import {ActorBehavior, PawnBehavior} from "../PrototypeBehavior";

class DecimateActor extends ActorBehavior {
    setup() {

    }
}

class DecimatePawn extends PawnBehavior {
    setup() {
        // the 3D object will likely not be loaded yet. 
        this.simplifyTo = 0.875;
        if(this.object){
            this.modelLoaded(this.object);
        }else this.subscribe(this.id, "3dModelLoaded", "modelLoaded");
    }

    modelLoaded(object){
        console.log("DecimatePawn>>modelLoaded", object);
        if(object)this.object = object; // should be a no-op
        else this.object = this.shape.children[0]; // this is the original object
        return Promise.all([
            import("/assets/src/SimplifyModifier.js"),
        ]).then(([simplify]) => {
            if(this.simplified)this.simplified.removeFromParent();
            const modifier = new simplify.SimplifyModifier();
            this.simplified = this.object.clone();
            this.simplified.traverse( c=>{
                if(c.geometry){
                    const count = Math.floor( c.geometry.attributes.position.count * this.simplifyTo ); // number of vertices to remove
                    c.geometry = modifier.modify( c.geometry, count );
                    console.log(c.geometry)
                }
            });
            this.simplified.position.x = 3;
            this.simplified.rotation.y  = -Math.PI/2;
            this.shape.add(this.simplified);
        });

    }
}

export default {
    modules: [
        {
            name: "Decimate",
            actorBehaviors: [DecimateActor],
            pawnBehaviors: [DecimatePawn],
        }
    ]
}
