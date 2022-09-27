# Create Croquet Microverse

![Microverse Screenshot](https://croquet.io/images/microversess.png)

[https://croquet.io](https://croquet.io)

## Introduction

Croquet Microverse is a framework to build multiplayer immersive 3D virtual worlds on the web. It is built on the Croquet OS and the Worldcore framework. Please refer to [https://github.com/croquet/microverse](https://github.com/croquet/microverse) for more information.

This utility `create-croquet-microverse` allows you to set up a minimum working installation by simply running the following in an empty directory:

     npm init croquet-microverse

The process copies some files into the top-level directory and sets things up.

Then, You need to obtain your Croquet API Key from [https://croquet.io/keys/](https://croquet.io/keys/), and edit the two properties called `apiKey` and `appId` in the `apiKey.js` file.

```
const apiKey = "paste your apiKey from croquet.io/keys";
const appId = "type your own appId such as com.example.david.mymicroverse";
export default {apiKey, appId};
```

Then you can run:

     npm start

and from a web browser to open `localhost:9684` to open the world.

You can then modify the default world file `worlds/default.js`, and add behavior files to expand the world. You can add more asset files in the assets directory, or use the Croquet DataId to refer to more assets from your world.

## Deployment

You can copy all files in `behaviors`, `assets`, `lib`, `meta`, and `worlds` along with `index.html` and `apiKey.js` to your publicly accessible HTTP server to have your own deployment. You can also use a hosting services such as Netlify and Vercel, which let you connect your GitHub repository to automate deployment. Note that the auto generated default apiKey for your Croquet account allows anybody to use it from any site.  In order to protect your API key from unauthorized use, you should create a new apiKey with URL restriction limited to your site.

## License

The source code and assets in this repository are licensed under Apache License 2.0.

**Copyright (c) 2022 Croquet Corporation**
