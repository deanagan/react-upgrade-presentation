# React: From React17 to React18

This is a presentation showing my notes on upgrading React17 to React18.

I've setup the project so that React17 and React18 are running as microfrontends, thus
easier to show a live difference between the 2.


## Installed Packages - setting up the microfrontends
There are 2 microfrontends and a container:
Container: HostApp
Microfrontend: 
- React17Demo
- React18Demo

1. I created 3 folders (one for each MF and container) and ran npm init -y on each.
Then add webpack packages:
`npm init -y && npm i webpack@5.88.0 webpack-cli@4.10.0 webpack-dev-server@4.7.4 html-webpack-plugin@5.5.0 nodemon --save-exact`

2. Create the following files/folders:
> public -> index.html
> src -> index.js

3. Create a basic index.html file and an index.js file

public/index.html
```
<!DOCTYPE html>
<html>
    <head></head>
    <body>
        <div id="react-17-demo"></div>
        <div id="react-18-demo"></div>
    </body>
</html>
```
src/index.js
```
// Just log to console for now
console.log("Host App is running");
```

4. Add a webpack.config.js and add below. Remotes will be empty for now.
```
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");

module.exports = {
    mode: "development",
    devServer: {
        port: 8080,
    },
    plugins: [
        new ModuleFederationPlugin({
        name: "hostapp",
        remotes: {
        },
        }),
        new HtmlWebpackPlugin({
        template: "./public/index.html",
        }),
    ],
}
```

5. Update package.json > scripts, and add `"start": "webpack serve"`. For now, since we only have a console.log, open the console in settings and we should see our console.log output. That's it for the hostapp for now.

6. Change directory to react17demo.

7. And repeat step1 as done in hostapp. Add webpack packages:
`npm init -y && npm i webpack@5.88.0 webpack-cli@4.10.0 webpack-dev-server@4.7.4 html-webpack-plugin@5.5.0 nodemon --save-exact`

8. Create a webpack.config.js file and enter:
```
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");

module.exports = {
  mode: "development",
  devServer: {
    port: 8081,
  },
  plugins: [
    new ModuleFederationPlugin({
      name: "react17demo",
      filename: "remoteEntry.js",
      exposes: {
        "./React17DemoIndex": "./src/index",
      },
    }),
    new HtmlWebpackPlugin({
      template: "./public/index.html",
    }),
  ],
};
```

9. Add the public/index.html and src/index.js files. 
public/index.html
```
<!DOCTYPE html>
<html>
<head>
    <title>Home</title>
</head>
<body>
    <h1>React 17 Demo</h1>
    <div id="react-17-demo"></div>
</body>
</html>
```
src/index.js
```

let users = "<div>Peter</div><div>Parker</div><div>Gwen</div><div>Mary</div>";


console.log(users);

document.querySelector("#react-17-demo").innerHTML = users;
```

10. Update package.json and add "start: "webpack serve" and test the app by running npm start

11. At this point, we should have verified that the microfrontend works separately. Let's try
to hook the host app to the other microfrontend by updating the remotes part in the config:

Add below:
```
      name: "hostapp",
      // Add this part
      remotes: {
        react17demo: "react17demo@http://localhost:8081/remoteEntry.js",
      },
```

12. Create a bootstrap.js in the hostapp. Note that it should match name/exposes in MF.
src/bootstrap.js
```
import "react17demo/React17DemoIndex";

console.log("Container");

```
13. Then in index.js, import bootstrap
```
import("./bootstrap");
...
```

14. It should now work at this point. 
**** Note: When I was starting to setup, I noticed that setting the id="app1", seems to throw an error and is throwing a fn not found error.

```
main.js:500 Uncaught (in promise) TypeError: fn is not a function
    at handleFunction (main.js:500:31)
    at onInitialized (main.js:512:60)
    at main.js:502:52
    at async Promise.all (:8080/index 0)
```

## Adding eslint
`npm install --save-dev eslint`
Add config
`npx eslint --init`


Optional: Add `prettier` to the configuration
`npm install --save-dev eslint-plugin-prettier eslint-config-prettier`
## Converting the app to typescript react

1. To create a react app after, first install typescript
`npm install --save-dev typescript`

2. Created a tsconfig.json file via `npx tsc --init`

3. Rename `index.js` file to `index.ts`

4. Install React
### For React17
`npm install react@17 react-dom@17`

### For React18
`npm install react react-dom`

5. Then install typescript types for react and react-dom (Regardless of version)
`npm install --save-dev @types/react @types/react-dom`


6. Regardless of type, install babel
`npm install --save-dev babel-loader @babel/core @babel/preset-env @babel/preset-react @babel/preset-typescript`


7. Now that we've got babel, update index.ts to index.tsx

8. Then add src to the tsconfig.json to limit scope and explicitly configure
```
    "include": ["src"]
```

9. Set the following in tsconfig.json 
```
    "jsx": "react-jsx"
```
This transforms JSX into more modern React function calls. 
This option leverages the new JSX transform introduced in React 17, which doesn’t require importing React at the top of your files.
It’s more efficient and results in smaller bundles because it avoids creating unnecessary intermediate objects.
This is now the recommended setting for new React projects.


10. Add a .babelrc file
```
{
    "presets": ["@babel/preset-env", "@babel/preset-react", "@babel/preset-typescript"]
}
```

11. Update webpack.config.js to find typescript files
```
const path = require("path");
....
// Add below to module.exports
entry: "./src/index.tsx",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        use: "babel-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
```