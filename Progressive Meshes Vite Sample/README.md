
# Needle Engine & Vite

This project uses vite and is setup to build and run a threejs project with Needle Engine including optimization and compression of glTF files.

## Features

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
1) Setup `.env` → see `.env.template` for instructions
2) Run `npm run deploy:glitch`