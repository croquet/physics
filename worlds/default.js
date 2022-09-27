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

    Constants.UserBehaviorDirectory = "behaviors/default";
    Constants.UserBehaviorModules = [
        "lights.js", "cascade.js", "earth.js", "gridBlock.js", "gridSphere.js", "pool.js", "spin.js"
    ];
    Constants.UseRapier = true;
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
                rapierSize: [0.2, 0.2, 0.2],
                rapierShape: "cuboid",
                rapierType: "positionBased",
                color: 0xcccccc,
                shadow: true,
            }
        },

        {
            card:{
                name:"block1",
                type: "object",
                translation: [0, 0.25-1.7, -9.5],
                layers: ["pointer"],
                scale: [1, 1, 1],
                behaviorModules: ["GridBlock", "Rapier", "Cascade"], //"Rapier", 
                rapierSize: 0.8,
                rapierShape: "cuboid",
                //rapierForce: {x:0.2, y: 0.2, z:0.2},
                rapierSize: [12, 0.25, 1],
                rapierType: "positionBased",
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
                layers: ["pointer"],
                scale: [1, 1, 1],
                behaviorModules: ["GridBlock", "Rapier", "Cascade"],  
                rapierSize: 0.8,
                rapierShape: "cuboid",
                //rapierForce: {x:0.2, y: 0.2, z:0.2},
                rapierSize: [12, 0.25, 1],
                blockSize: [12, 0.25, 1],
                rapierType: "positionBased",
                density: 2,
                shadow: true,
            }
        },

        {
            card:{
                name:"block3",
                type: "object",
                translation: [-5.5, 0.25-1.7, -15],
                layers: ["pointer"],
                scale: [1, 1, 1],
                behaviorModules: ["GridBlock", "Rapier", "Cascade"], 
                rapierSize: 0.8,
                rapierShape: "cuboid",
                //rapierForce: {x:0.2, y: 0.2, z:0.2},
                rapierSize: [1, 0.25, 10],
                rapierType: "positionBased",
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
                layers: ["pointer"],
                scale: [1, 1, 1],
                behaviorModules: ["GridBlock", "Rapier", "Cascade"], 
                rapierSize: 0.8,
                rapierShape: "cuboid",
                //rapierForce: {x:0.2, y: 0.2, z:0.2},
                rapierSize: [1, 0.25, 10],
                rapierType: "positionBased",
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
                scale: [1, 1, 1],
                behaviorModules: ["GridBlock", "Rapier", "Cascade", "Spin"], 
                spin: 0.01,
                rapierSize: 0.8,
                rapierShape: "cuboid",
                //rapierForce: {x:0.2, y: 0.2, z:0.2},
                rapierSize: [2, 0.25, 2],
                rapierType: "positionBased",
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
                behaviorModules: ["Earth", "Rapier", "Cascade", "Spin"], 
                spin:0.02,
                rapierShape: "ball",
                //rapierForce: {x:0.2, y: 0.2, z:0.2},
                rapierSize: 2,
                rapierType: "positionBased",
                density: 2,
                shadow: true,
            }
        },
        {
            card:{
                name:"pool",
                type: "object",
                translation: [0, -1.5, -15],
                scale: [1, 1, 1],
                layers: ["pointer"],
                behaviorModules: ["Pool"], 
                poolSize: [10,10]
            }
        },
        {
            card:{
                translation: [10, 1.3, -15],    
                rotation: [0, -0.01904446484351159, 0, 0.9998186377332763],    
                layers: ["walk", "pointer"],    
                name: "/simpletree.glb",    
                dataLocation: "./assets/3D/simpletree.glb",
                dataScale: [1, 1, 1],    
                //behaviorModules: ["Blowing"],
                modelType: "glb",    
                shadow: true,    
                singleSided: true,    
                type: "3d",
                flatten: true
            }
        },

    ];
}
