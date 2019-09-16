# React SSR Boilerplate

![https://img.shields.io/github/license/lenconda/react-ssr-boilerplate.svg](https://img.shields.io/github/license/lenconda/react-ssr-boilerplate.svg)
![https://img.shields.io/github/forks/lenconda/react-ssr-boilerplate.svg](https://img.shields.io/github/forks/lenconda/react-ssr-boilerplate.svg)
![https://img.shields.io/github/stars/lenconda/react-ssr-boilerplate.svg](https://img.shields.io/github/stars/lenconda/react-ssr-boilerplate.svg)

This is a boilerplate for React.js using Webpack. With the help of Webpack multi-entries architecture, compile React code to multiple entries, pass the entry bundle files to rendering server, which is a new way to make React server-side rendering easier.

## Overview
Item | Value
- | -
**Name** | react-ssr-boilerplate
**Description** | An boilerplate for server-side rendering based on React and Webpack
**Author** | [lenconda](https://github.com/lenconda)
**Version** | 1.0.0
**Generator** | [@lenconda/generator-react-ssr](https://www.npmjs.com/package/@lenconda/generator-react-ssr)

## Demo

Coming soon

## Feature

* 🏷 Using TypeScript
* 📇 Automatically detects new entries and routes
* 🐳 Docker friendly
* ⏳ Webpack hot reload module supported
* 🌈 Multiple CSS pre-processors supported (powered by Yeoman generator)

## Configure Server Ports

Edit `/config.json` to change server ports

## Structure

The file structure is as below:

```
├── .babelrc
├── .eslintrc.js
├── .gitignore
├── LICENSE
├── README.md
├── config.json
├── package.json
├── postcss.config.js
├── scripts
|  └── clean.js
├── server
|  ├── config.ts
|  ├── index.ts
|  ├── middlewares
|  |  └── render.ts
|  ├── routers
|  |  └── index.ts
|  └── utils
|     ├── entries.ts
|     ├── http.ts
|     └── template.ts
├── src
|  ├── assets
|  |  └── css
|  |     └── reset.css
|  ├── config
|  |  ├── css_loaders.js
|  |  ├── env.js
|  |  └── webpack.config.js
|  ├── index.css
|  ├── index.tsx
|  ├── pages
|  |  └── hello
|  |     └── index.tsx
|  └── utils
|     └── http.ts
├── templates
|  └── index.html
├── tsconfig.json
└── typings
   └── koa2-connect.d.ts
```

Webpack compiler will compile files in `/src`, and entries will be automatically loaded and the bundle will automatically generated. A special bundle is named `app__root`, it will be generated from entry `/src/index.tsx`

### Add a New Entry

In `/src/pages`, make an empty directory with the name of the entry, add `index.tsx` in it, e.g.

```
cd /path/to/project/src/pages
mkdir example
cd example
touch index.tsx
```

then Webpack compiler will automatically detect your new entry and generate a new bundle named `example-routes.js`.

If add new entries not in the root directory of `/src/pages`, like `/src/pages/example/test/index.tsx`, it will generate a new bundle named `example_test-routes.js`

### Add a New Route

Similar to entries, add route files to `/server/routers`. Notice that Koa server will only detect the router entries named `index.*`, so wrap the route entries with a directory with different name.

## Usage

### Development

Download the boilerplate

```
git clone https://github.com/lenconda/react-ssr-boilerplate.git
```

Install dependencies

```
npm i
```

Start development server

```
npm start
```

> It will concurrently start `webpack-dev-server` and `koa` servers, the ports are specified in `/config.json`

### Production

Install dependencies under with `NODE_ENV` as `development`

```
export NODE_ENV=development
npm i
```

Build project

```
npm run build
```

Prepare TypeScript environment

```
npm i typescript ts-node -g
```

Start the server

```
ts-node server/index.ts
```

or by `pm2`

```
npm i pm2 -g
pm2 start --interpreter=./node_modules/.bin/ts-node --name app server/index.ts
```

## License

[MIT](https://github.com/lenconda/react-ssr-boilerplate/blob/master/LICENSE) @ [lenconda](https://github.com/lenconda)
