
# Needle Engine & Vite

This project uses vite and is setup to build and run a threejs project with Needle Engine including optimization and compression of glTF files.

## Features

- WebXR support
- Progressive loading of highres meshes and textures
- Automatic glTF optimization & compression on build
- Deployment to glitch with `npm run deploy:glitch` 


## Usage

For local development run
```
npm i
npm start
```

For producing a build that can be uploaded via FTP  
*Your final assets will be output into the `/dist` folder*
```
npm run build
```


For deployment to glitch  
1) Rename `.env.template` to `.env` and enter your glitch url and deployment key
2) Run `npm run deploy:glitch`  
*[Live Demo](https://grove-hospitable-stove.glitch.me/ )*


## Adding or changing models

1) Add your GLB model to the `assets/` folder
2) Update the array in [modelswitch.ts](./src/modelswitch.ts):
```ts
const assets = [
    "/assets/winged dragon.glb",
    "/assets/snake.glb",
    "/assets/vase.glb",
];
```
You can just download and add a model from [Sketchfab](https://sketchfab.com/) for example.


## Credits
All models by [Minneapolis Insitute of Art](https://sketchfab.com/artsmia)
