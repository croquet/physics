/*
  This Behavior for Actor creates a rigid body and a collider based on
  physicsShape, physicsForce, and physicsType properties, and add it to
  the Rapier engine based physics simulation.

  For information on Rapier, refer to this page:
  https://rapier.rs/docs/user_guides/javascript/getting_started_js

  Rapier provides bit-identical physical simulation so we use it on the Model/Actor side of Croquet.
*/

class CascadeActor {
    setup() {
        if (!this.physicsWorld) {
            let physicsManager = this.service("PhysicsManager");
            console.log("new physics world for cascade");
            physicsManager.createGlobalWorld({timeStep: 20}, this.id);
        }

        /*
          variable kinematic is initialized based on physicsType and
          calls another behavior (Rapier)'s createRigidBoy method,
          which in turn calls Rapier's method of the same name.

          Variable Physics contains all exports from the Rapier
          packages. It is prefixed with Microverse, which is the only
          global variable visible to behavior code.
        */
        let kinematic;
        let physicsType = this._cardData.physicsType;
        let physicsShape = this._cardData.physicsShape;
        let physicsSensor = this._cardData.physicsSensor;
        let physicsImpulse = this._cardData.physicsImpulse
        let physicsTorque = this._cardData.physicsTorque;
        if (physicsType === "positionBased") {
            kinematic = Microverse.Physics.RigidBodyDesc.newKinematicPositionBased();
        } else if (physicsType === "static") {
            kinematic = Microverse.Physics.RigidBodyDesc.newStatic();
        } else {
            kinematic = Microverse.Physics.RigidBodyDesc.newDynamic();
        }
        this.call("Physics$PhysicsActor", "createRigidBody", kinematic);

        /*
          variable cd (collider description) is initialized based on physicsShape and physicsSize,
          and it is used for a call to createCollider.

          The ColliderDesc of Rapier tends to take the half-size;
          ex. [0.5, 0.5, 0.5] makes a [1, 1, 1] cube.
        */

        let cd;
        if (physicsShape === "ball") {
            let s = this._cardData.physicsSize || 1;
            s = s / 2;
            cd = Microverse.Physics.ColliderDesc.ball(s);
        } else if (physicsShape === "cuboid") {
            let s = this._cardData.physicsSize || [1, 1, 1];
            s = [s[0] / 2, s[1] / 2, s[2] / 2];
            cd = Microverse.Physics.ColliderDesc.cuboid(...s);
        }
        /*else if (physicsShape === "cylinder") {
            let s = this._cardData.physicsSize || [1, 1];
            s = [s[1] / 2, s[0]];
            cd = Microverse.Physics.ColliderDesc.cylinder(...s);
        }*/

        /*
          Uncomment above shape === "cylinder" section to add cylinder type.
        */

        cd.setRestitution(this._cardData.physicsRestitution || 0.4);
        cd.setFriction(this._cardData.physicsFriction || 0.8);
        cd.setDensity(this._cardData.physicsDensity || 1.5);

        /*
          physicsSensor here adds intersectionEventHandler. Note that
          this code (cascade.js) is in the user land; if you need to
          have contactEventHandler for your application, you can
          simply add it here.
        */

        if (physicsSensor) {
            this.registerIntersectionEventHandler("intersection");
            cd.setSensor(true);
            cd.setActiveEvents(Microverse.Physics.ActiveEvents.CONTACT_EVENTS |
                               Microverse.Physics.ActiveEvents.INTERSECTION_EVENTS);
        }
        this.collider = this.call("Physics$PhysicsActor", "createCollider", cd);

        /*
          If this is a regular moving object, add an event handler for pointerTap to invoke
           the jolt method.
        */

        if (!physicsType) {
            this.addEventListener("pointerTap", "jolt");
        }

        /*
          If the card spec has an initial physicsImpulse, put some force upon creation.
        */

        if (physicsImpulse) {
            if (!this.initialImpulseApplied) {
                this.initialImpulseApplied = true;
                this.rigidBody.applyImpulse(physicsImpulse);
            }
        }

        if (physicsTorque) {
            if (!this.initialTorqueApplied) {
                this.initialTorqueApplied = true;
                this.rigidBody.applyTorqueImpulse(physicsTorque);
            }
        }
        /*
          All movement of an object triggers "translating" event, and
          it invokes the translated() method to implement the 'kill
          plane'.
        */
        this.listen("translating", "translated");
    }

    jolt() {
        // Apply an upward force and random spin.
        let r = this.rigidBody;
        if (r) {
            r.applyImpulse({x: 0, y: 0.08, z: 0}, true);
            r.applyTorqueImpulse({x: Math.random() * 0.001 - 0.0005, y: Math.random() * 0.002, z: Math.random() * 0.001 - 0.0005}, true);
        }
    }

    translated() {
        /*
          if this object fell below, it kills itself.
          destroy() is a method of the base CardActor. It invokes all destroy() methods of attached
          behaviors. The Physics behavior removes the rigidBody from the Rapier world.
        */
        if (this._translation[1] < -2) {
            this.destroy();
        }
    }

    registerCollisionEventHandler(methodName) {
        /*
          The CardActor has a method that invokes a behavior's method based on
          `collisionEventHandlerBehavior` and `collisionEventHandlerMethod` values.
          In this example, this is called from the above 'physicsSensor' case.
        */
        let behavior = this._behavior;
        let physicsManager = this.service("PhysicsManager");
        this.collisionEventHandlerBehavior = `${behavior.module.name}$${behavior.$behaviorName}`;
        this.collisionEventHandlerMethod = methodName;
        physicsManager.registerCollisionEventHandler(this._target);
    }

    intersection(card1, card2, intersecting) {
        /*
          With above set up This method will be called when two
          rigidbodies, with at least one collider description with
          active events intersects.
        */
        if (!intersecting) {return;}
        if (card1.id !== this.id) {
            card1.destroy();
        }
        if (card2.id !== this.id) {
            card2.destroy();
        }
    }
}

class CascadePawn {
    setup() {
        /*
          Creates a Three.JS mesh based on the specified physicsShape and physicsSize.

          For a demo purpose, it does not override an existing shape
          (by checking this.shape.children.length) so that the earth
          shape created by FlightTracker behavior is preserved.

          Uncomment the cyclinder case to add the cylinder shape.

        */

        // [...this.shape.children].forEach((c) => this.shape.remove(c));
        if (this.shape.children.length === 0) {
            let physicsShape = this.actor._cardData.physicsShape;
            if (physicsShape === "ball") {
                let s = this.actor._cardData.physicsSize || 1;
                let geometry = new Microverse.THREE.SphereGeometry(s / 2, 32, 16);
                let material = new Microverse.THREE.MeshStandardMaterial({color: this.actor._cardData.color || 0xff0000});
                this.obj = new Microverse.THREE.Mesh(geometry, material);
                this.obj.castShadow = this.actor._cardData.shadow;
                this.obj.receiveShadow = this.actor._cardData.shadow;
            } else if (physicsShape === "cuboid") {
                let s = this.actor._cardData.physicsSize || [1, 1, 1];
                let geometry = new Microverse.THREE.BoxGeometry(...s);
                let material = new Microverse.THREE.MeshStandardMaterial({color: this.actor._cardData.color || 0xff0000});
                this.obj = new Microverse.THREE.Mesh(geometry, material);
                this.obj.castShadow = this.actor._cardData.shadow;
                this.obj.receiveShadow = this.actor._cardData.shadow;
            }
            /*else if (physicsShape === "cylinder") {
                let s = this.actor._cardData.physicsSize || [1, 1];
                let geometry = new Microverse.THREE.CylinderGeometry(s[0], s[0], s[1], 20);
                let material = new Microverse.THREE.MeshStandardMaterial({color: this.actor._cardData.color || 0xff0000});
                this.obj = new Microverse.THREE.Mesh(geometry, material);
                this.obj.castShadow = this.actor._cardData.shadow;
                this.obj.receiveShadow = this.actor._cardData.shadow;
            }*/
            this.shape.add(this.obj);
        }
        this.removeEventListener("pointerDoubleDown", "onPointerDoubleDown");
        this.addEventListener("pointerDoubleDown", "nop");
    }
}

/*
  This is used for the cube that sits above the inclined plane. It
  calls spray() in a future loop at a 500 millisecond interval, and
  create a new card by calling createCard().
*/
class SprayActor {
    setup() {
        /*

          Because of the life cycle of a behavior that means that the
          setup() may be called multiple times on the same card, we tend to guard a property initialization with a conditional like this.
        */
        if (this.running === undefined) {
            this.running = true;
            this.spray();
        }
        /*
          you can start and stop spray() loop by clicking the cube.
        */
        this.addEventListener("pointerDown", "toggle");
    }

    randomColor() {
        let h = Math.random();
        let s = 0.8;
        let v = 0.8;
        let r, g, b, i, f, p, q, t;
        i = Math.floor(h * 6);
        f = h * 6 - i;
        p = v * (1 - s);
        q = v * (1 - f * s);
        t = v * (1 - (1 - f) * s);
        switch (i % 6) {
            case 0: r = v, g = t, b = p; break;
            case 1: r = q, g = v, b = p; break;
            case 2: r = p, g = v, b = t; break;
            case 3: r = p, g = q, b = v; break;
            case 4: r = t, g = p, b = v; break;
            case 5: r = v, g = p, b = q; break;
        }
        return ((Math.round(r * 255) << 16) +
                (Math.round(g * 255) << 8) +
                Math.round(b * 255))
    }

    spray() {
        if (!this.running) {return;}
        this.future(150).spray();

        /*
          For the demo purpose, we define the demo in the global
        coordinates. For a more controll example would add cards to an
        owner card.
        */

        let t = this.translation;
        let r = Math.random() * Math.PI * 2;
        let x = Math.cos(r) * 0.016 * (Math.random() * 0.6 + 0.5);
        let z = Math.sin(r) * 0.016 * (Math.random() * 0.6 + 0.5);
        const initTr = [t[0] + x * 2, t[1] + 0.3, t[2] + z * 2];

        let shape;
        let size;
        let density;
        let launchSpeed = 0.09;
        let dice = Math.random();
        let color = this.randomColor();

        if (dice < 1.0) {
            shape = "cuboid";
            size = [0.25, 0.25, 0.25];
            density = 0.5;
        } else {
            shape = "ball";
            size = 0.3;
            density = 1;
            x *= 5;
            z *= 5;
        }

        this.createCard({
            type: "object",
            layers: ["pointer"],
            translation: initTr,
            behaviorModules: ["Physics", "Cascade"],
            physicsSize: size,
            physicsImpulse: {x, y: launchSpeed, z},
            physicsTorque: {x: Math.random() * 0.005 - 0.0025, y: Math.random() * 0, z: Math.random() * 0.005 - 0.0025},
            physicsShape: shape,
            physicsDensity: density,
            color: color,
            shadow: true,
        });
    }

    toggle() {
        this.running = !this.running;
        if (this.running) {
            this.spray();
        }
    }
}

class SprayPawn {
    setup() {
        [...this.shape.children].forEach((c) => this.shape.remove(c));

        if (this.shape.children.length === 0) {
            let s = 0.2;
            let geometry = new Microverse.THREE.BoxGeometry(s, s, s);
            let material = new Microverse.THREE.MeshStandardMaterial({color: this.actor._cardData.color || 0xff0000});
            this.obj = new Microverse.THREE.Mesh(geometry, material);
            this.obj.castShadow = this.actor._cardData.shadow;
            this.obj.receiveShadow = this.actor._cardData.shadow;
            this.shape.add(this.obj);
        }
    }
}

/*
  Two behavior modules are exported from this file.  See worlds/default.js for their use.
*/
export default {
    modules: [
        {
            name: "Cascade",
            actorBehaviors: [CascadeActor],
            pawnBehaviors: [CascadePawn]
        },
        {
            name: "Spray",
            actorBehaviors: [SprayActor],
            pawnBehaviors: [SprayPawn],
        }
    ]
}

/* globals Microverse */

