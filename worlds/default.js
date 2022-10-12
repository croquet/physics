// Copyright 2022 by Croquet Corporation, Inc. All Rights Reserved.
// https://croquet.io
// info@croquet.io

export function init(Constants) {
    Constants.AvatarNames = ["newwhite"];

    /* Alternatively, you can specify a card spec for an avatar,
       instead of a string for the partical file name, to create your own avatar.
       You can add behaviorModules here. Also, if the system detects a behavior module
       named AvatarEventHandler, that is automatically installed to the avatar.
        {
            type: "3d",
            modelType: "glb",
            name: "rabbit",
            dataLocation: "./assets/avatars/newwhite.zip",
            dataRotation: [0, Math.PI, 0],
            dataScale: [0.3, 0.3, 0.3],
        }
    */

    // rotates an object around a center point.
    function rotateTo(center, length, angle){
        let pos = [];
        pos.push(length*Math.sin(angle));
        pos.push(0);
        pos.push(length*Math.cos(angle));
        pos[0]+=center[0];
        pos[1]=center[1];
        pos[2]+=center[2];
        return pos;
    }

    Constants.UserBehaviorDirectory = "behaviors/default";
    Constants.UserBehaviorModules = [
        "lights.js", "cascade.js", "earth.js", "gridBlock.js", "gridSphere.js", "pool.js", "spin.js", 
        "urlLink.js", "replaceWorld.js", "menus.js"
    ];

    Constants.DefaultCards = [
        {
            card: {
                name:"world model",
                layers: ["walk"],
                type: "3d",
                singleSided: true,
                shadow: true,
                translation:[0, -1.7, 0],
                placeholder: true,
                placeholderSize: [400, 0.1, 400],
                placeholderColor: 0x808080,
                placeholderOffset: [0, 0, 0],
                behaviorModules: ["Menus"],
            }
        },
        {
            card: {
                name: "light",
                layers: ["light"],
                type: "lighting",
                behaviorModules: ["Light"],
                dataLocation: "./assets/sky/aboveClouds.jpg",
                fileName: "/aboveClouds.jpg",
                dataType: "jpg",
            }
        },

        {
            card: {
                name:"spray",
                type: "object",
                layers: ["pointer"],
                translation: [0, -1, -15],
                behaviorModules: ["Spray"],
                physicsSize: [0.2, 0.2, 0.2],
                physicsShape: "cuboid",
                physicsType: "positionBased",
                color: 0xcccccc,
                shadow: true,
            }
        },

        {
            card:{
                name:"block1",
                type: "object",
                translation: [0, 0.25-1.7, -9.5],
                layers: ["pointer", "walk"],
                scale: [1, 1, 1],
                behaviorModules: ["GridBlock", "Physics", "Cascade"], //"Physics",
                physicsShape: "cuboid",
                physicsSize: [12, 0.25, 1],
                physicsType: "positionBased",
                blockSize: [12, 0.25, 1],
                density: 2,
                shadow: true,
            }
        },

        {
            card:{
                name:"block2",
                type: "object",
                translation: [0, 0.25-1.7, -20.5],
                layers: ["pointer", "walk"],
                scale: [1, 1, 1],
                behaviorModules: ["GridBlock", "Physics", "Cascade"],
                physicsShape: "cuboid",
                physicsSize: [12, 0.25, 1],
                blockSize: [12, 0.25, 1],
                physicsType: "positionBased",
                density: 2,
                shadow: true,
            }
        },

        {
            card:{
                name:"block3",
                type: "object",
                translation: [-5.5, 0.25-1.7, -15],
                layers: ["pointer", "walk"],
                scale: [1, 1, 1],
                behaviorModules: ["GridBlock", "Physics", "Cascade"],
                physicsShape: "cuboid",
                physicsSize: [1, 0.25, 10],
                physicsType: "positionBased",
                blockSize: [1, 0.25, 10],
                density: 2,
                shadow: true,
            }
        },

        {
            card:{
                name:"block4",
                type: "object",
                translation: [5.5, 0.25-1.7, -15],
                layers: ["pointer", "walk"],
                scale: [1, 1, 1],
                behaviorModules: ["GridBlock", "Physics", "Cascade"],
                physicsShape: "cuboid",
                physicsSize: [1, 0.25, 10],
                physicsType: "positionBased",
                blockSize: [1, 0.25, 10],
                density: 2,
                shadow: true,
            }
        },
        {
            card:{
                name:"block5",
                type: "object",
                translation: [2.5, -1, -15],
                layers: ["pointer"],
                behaviorModules: ["GridBlock", "Physics", "Cascade", "Spin"],
                spin: 0.01,
                physicsShape: "cuboid",
                physicsSize: [2, 0.25, 2],
                physicsType: "positionBased",
                blockSize: [2, 0.25, 2],
                density: 2,
                shadow: true,
            }
        },
        {
            card:{
                name:"earth",
                type: "object",
                translation: [-2.5, -0.5, -15],
                scale: [0.25, 0.25, 0.25],
                layers: ["pointer"],
                behaviorModules: ["Earth", "Physics", "Cascade", "Spin"],
                spin:0.02,
                physicsShape: "ball",
                physicsSize: 2,
                physicsType: "positionBased",
                density: 2,
                shadow: true,
            }
        },
        {
            card:{
                name:"pool",
                type: "object",
                translation: [0, -1.5, -15],
                layers: ["pointer"],
                behaviorModules: ["Pool"],
                poolSize: [10, 10]
            }
        },
        {
            card:{
                name:"simple tree",
                translation: [10, 1.3, -15],
                rotation: [0, -0.01904446484351159, 0, 0.9998186377332763],
                layers: ["walk", "pointer"],
                dataLocation: "./assets/3D/simpletree.glb",
                //behaviorModules: ["Blowing"],
                modelType: "glb",
                shadow: true,
                singleSided: true,
                type: "3d",
                flatten: true
            }
        },
        {
            card: {
                name: "Croquet Card",
                //behaviorModules: ["ReplaceWorld"],
                //targetURL: "https://croquet.io/microverse/?world=test",
                translation: rotateTo([0, 0, 0], -12, Math.PI / 2),
                rotation: [0, Math.PI / 2, 0],
                layers: ["pointer"],
                scale: [4, 4, 4],
                type: "2d",
                textureType: "image",
                textureLocation: "./assets/images/CroquetLogo_RGB.jpg",
                cardURL: "https://croquet.io",
                behaviorModules: ["URLLink"],
                fullBright: true,
                frameColor: 0xcccccc,
                color: 0xffffff,
                cornerRadius: 0.05,
                depth: 0.05,
                shadow: true,
            }
        },

        {
            card: {
                name: "Gallery Card",
                behaviorModules: ["ReplaceWorld"],
                replaceWorldTargetURL: "https://croquet.github.io/gallery",
                replaceWorldOverrideOrigin: "(.*\.)?croquet.(io|dev)$",
                translation: rotateTo([0, 0, 0], -12, Math.PI/8+Math.PI/2),
                //    translation: [4.440892098500626e-16, 2.5357677795120512, -7.9631457611584615],
                //rotation: [0, Math.PI / 2, 0],
                rotation: [0, Math.PI/8+Math.PI/2, 0],
                layers: ["pointer"],
                scale: [4, 4, 4],
                type: "2d",
                textureType: "image",
                textureLocation: "./assets/images/Croquet Gallery.png",
                fullBright: true,
                frameColor: 0xcccccc,
                color: 0xffffff,
                cornerRadius: 0.05,
                depth: 0.05,
                shadow: true,
            }
        },
        {
            card: {
                name: "Mythos Card",
                translation: rotateTo([0, 0, 0], -12, 2*Math.PI/8+Math.PI/2),
                behaviorModules: ["ReplaceWorld"],
                replaceWorldTargetURL: "https://croquet.github.io/mythos",
                replaceWorldOverrideOrigin: "(.*\.)?croquet.(io|dev)$",
                rotation: [0, 2*Math.PI/8+Math.PI/2, 0],
                layers: ["pointer"],
                scale: [4, 4, 4],
                type: "2d",
                textureType: "image",
                textureLocation: "./assets/images/Croquet Mythos.png",
                fullBright: true,
                frameColor: 0xcccccc,
                color: 0xffffff,
                cornerRadius: 0.05,
                depth: 0.05,
                shadow: true,
            }
        },
        {
            card: {
                name: "About Physics",
                translation: rotateTo([0, 0.5, 0], -12, 3*Math.PI/8+Math.PI/2), //[-5, 2.1, -7.963],
                scale: [4, 4, 4],
                rotation: [0, 3*Math.PI/8+Math.PI/2, 0],
                layers: ["pointer"],
                behaviorModules: ["PDFView"],
                color: 8947848,
                depth: 0.05,
                frameColor: 16777215,
                fullBright: true,
                modelType: "pdf",
                pdfLocation: "./assets/PDF/Physics Readme.pdf",
                shadow: true,
                singleSided: true,
                type: "2d",
            }
        },
    ];
}
