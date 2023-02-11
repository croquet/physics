// Spin
// Copyright 2022 Croquet Corporation
// Croquet Microverse
// Adds a simple spin around y to a Card

class SpinActor {
    setup() {
        this.listen("newAngle", "newAngle");
        this.listen("startSpinning", "startSpinning");
        this.listen("stopSpinning", "stopSpinning");
        if (this._cardData.spin) this.startSpinning(this._cardData.spin);
    }

    startSpinning(spin) {
        this.isSpinning = true;
        this.qSpin = Microverse.q_euler(0, spin, 0);
        this.doSpin();
    }

    doSpin() {
        if (this.isSpinning) {
            let r = Microverse.q_multiply(this.rotation, this.qSpin);
            this.set({rotation: r});
            this.future(50).doSpin();
        }
    }

    stopSpinning() {
        this.isSpinning = false;
    }

    newAngle({rotation, viewId}) {
        this.set({rotation});
        this.say("focus", viewId);
    }

    teardown() {
        delete this.isSpinning;
        delete this.qSpin;
        this.unsubscribe(this.id, "startSpinning");
        this.unsubscribe(this.id, "stopSpinning");
        this.unsubscribe(this.id, "newAngle");
    }
}

class SpinPawn {
    setup() {
        this.addEventListener("pointerDown", "onPointerDown");
        this.addEventListener("pointerUp", "onPointerUp");
        this.addEventListener("pointerMove", "onPointerMove");
        this.listen("focusChanged", "focusChanged");
    }

    isSingleUser() {
        return this.actor.occupier !== undefined;
    }

    hasFocus() {
        return this.actor.occupier == this.viewId;
    }

    onPointerDown(p3d) {
        this.downP3d = p3d;
        // remember the down event for when we get the focus
        if (this.isSingleUser()) {
            this.say("focus", this.viewId);
        } else {
            this.focusChanged();
        }
    }

    focusChanged() {
        if (this.isSingleUser() && !this.hasFocus()) {
            if (this.downP3d) {this.onPointerUp(this.downP3d);}
            return;
        }
        let p3d = this.downP3d;
        if (!p3d) {return;}
        this.say("stopSpinning");
        // we will rotate to an offset from this.baseRotation
        this.baseRotation = this._rotation;
        // the offset will be the distance of the raytip from a vertical plane along this ray
        this.plane = this.planeFromRayAndAxis(p3d.ray, [0, 1, 0]);
        // for kinetic spinning after letting go we need the last few moves
        this.moveBuffer = [];
        let avatar = Microverse.GetPawn(p3d.avatarId);
        avatar.addFirstResponder("pointerMove", {}, this);
    }

    onPointerMove(p3d) {
        if (this.isSingleUser() && !this.hasFocus()) {return;}
        if (!this.downP3d) {return;}
        let offset = this.offsetFromRayTip(p3d.ray, this.downP3d.distance);
        this.moveBuffer.push(offset);
        const {q_multiply, q_euler} = Microverse;
        let rotation = q_multiply(this.baseRotation, q_euler(0, offset, 0));
        this.say("newAngle", {rotation, viewId: this.viewId});
        if (this.moveBuffer.length >= 3) {
            setTimeout(() => this.shiftMoveBuffer(), 100);
        }
    }

    shiftMoveBuffer() {
        this.moveBuffer.shift();
    }

    onPointerUp(p3d) {
        this.say("unfocus", this.viewId);
        let distance = this.downP3d.distance;
        this.downP3d = null;
        this.baseRotation = null;
        let avatar = Microverse.GetPawn(p3d.avatarId);
        avatar.removeFirstResponder("pointerMove", {}, this);
        if (this.isSingleUser() && !this.hasFocus()) {return;}

        let offset = this.offsetFromRayTip(p3d.ray, distance);
        this.moveBuffer.push(offset);

        if (this.moveBuffer.length < 3) {return;}

        this.moveBuffer = this.moveBuffer.slice(this.moveBuffer.length - 3);

        let signs = new Set();
        for (let i = 0; i < this.moveBuffer.length - 1; i++) {
            signs.add(Math.sign(this.moveBuffer[i + 1] - this.moveBuffer[i][0]));
        }
        if (signs.has(-1) && signs.has(1)) {return;}

        let deltaAngle = (this.moveBuffer[this.moveBuffer.length - 1] - this.moveBuffer[0]);

        if (Math.abs(deltaAngle) > 0.01) {
            let a = deltaAngle;
            a = Math.min(Math.max(-0.1, a), 0.1);
            this.say("startSpinning", a);
        }
    }


    offsetFromRayTip(ray, distance) {
        const {v3_add, v3_scale, v3_dot} = Microverse;
        // tip is at the end of the current ray at same distance as down ray
        let tip = v3_add(ray.origin, v3_scale(ray.direction, distance));
        // offset is tip's distance from the plane
        let offset = v3_dot(this.plane.normal, tip) - this.plane.constant;
        return offset;
    }

    planeFromRayAndAxis(ray, axis) {
        const {v3_normalize, v3_dot, v3_cross} = Microverse;
        // ray and axis form the plane, so its normal is perpendicular to both
        let normal = v3_normalize(v3_cross(ray.direction, axis));
        // ray origin is on the plane
        let constant = v3_dot(normal, ray.origin);
        return {normal, constant};
    }

    teardown() {
        this.removeEventListener("pointerDown", "onPointerDown");
        this.removeEventListener("pointerUp", "onPointerUp");
        this.removeEventListener("pointerMove", "onPointerMove");
    }
}

export default {
    modules: [
        {
            name: "Spin",
            actorBehaviors: [SpinActor],
            pawnBehaviors: [SpinPawn]
        }
    ]
}

/* globals Microverse */
