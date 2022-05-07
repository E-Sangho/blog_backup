---
layout: post
title: Youtube Clone 5
date: 2021-11-29 13:24:20
categories: NodeJS
tag:
toc: true
---

## 9 WEBPACK

### 9.0 Introduction to Webpack

이전에 우리는 Babel Node를 설치했다. Babel Node를 설치했기 때문에 최신 자바스크립트를 사용하더라도, NodeJS가 이해할 수 있는 코드로 번역해줬다. 이는 백엔드에서 일어나는 일이었다. 지금부터 우리는 프론트 엔드부분을 만들게 된다. 그런데 브라우저에 따라서 자바스크립트가 이해할 수 있는 범위가 다를 수 있다. 그렇기 때문에 Babel Node의 브라우저 버전이 필요하다. 그래서 사용하는 것이 Webpack으로 자바스크립트 뿐만 아니라 sass도 브라우저에서 구동하는 구형 자바스크립트와 css로 바꿔주는 일을 한다.

그렇지만 대부분의 경우 Webpack을 직접 사용하는 경우가 드물다. 그 이유는 대부분의 프레임워크가 Webpack을 이미 포함하고 있는 경우가 많기 때문이다. 예를 들어 react, vue, svelte, next 등은 이미 Webpack을 포함하고 있어서 별도로 다룰 필요가 없다. 하지만 Webpack은 업계 표준으로 직접 다뤄보는 것도 중요한 경험이다.

### 9.1 Webpack Configuration part One

이제 Webpack을 설치해보자. 우리가 필요한 것은 webpack과 webpack-cli로 devDependencies에 설치해주려고 한다. 그러므로 `npm i webpack webpack-cli --save -dev`로 설치하거나 조금 더 짧게 `npm i webpack webpack-cli -D`로 설치한다.

Webpack을 설정하기 위해서, webpack.config.js라는 파일을 만들어야 한다. 이 파일은 굉장히 오래된 자바스크립트만 이해할 수 있으므로 import, export를 사용하지 못한다 대신에 require, module.exports를 사용해야 한다.

webpack.config.js에서 해야 할 일은 2가지다. 첫 번째는 enrty로, entry는 우리가 처리하고 싶은 파일로 다시 말해 우리가 최신 자바스크립트로 작성한 파일을 말한다. src폴더에 client라는 폴더를 하나 만들자. 앞으로 서버가 아니라 브라우저에서 실행될 코드 파일은 client에 만들것이다. client 안에는 js폴더를 만들고 main.js를 만든다. 그리고 아래처럼 작성해주자.

```
// main.js
const hello = async () => {
    alert("Hi its working");
    const x = await fetch("")
}
hello();
```

우리 목표는 이 파일을 Webpack으로 보내서 모든 브라우저가 이해할 수 있는 코드로 바꿔주는 것이다. 다시 webpack.config.js로 돌아와서 module.exports 안에 코드를 적어줘야 한다. 우선 entry는 우리가 바꾸고 싶은 코드가 어디에 있는지를 의미하는데, 코드 위치는 "./src/client/js/mail.js"가 된다. 그리고 결과물로 나올 파일을 output으로 설정해준다. 우선은 파일명과 저장 경로를 적어주자. `filename: "main"`으로 적어주고, `path: "./assets/js"`에 저장해준다.

```
// webpack.config.js
module.exports = {
  entry: "./src/client/js/main.js",
  output: {
    filename: "main.js",
    path: "./assets/js",
  },
};
```

이렇게 만든 코드를 실행시켜줘야 작동한다. 그러므로 scripts를 만들텐데, 우리는 이전에 dev를 만들어서 npm run dev로 간단히 코드를 실행했다. 다시 말해 scripts는 코드를 실행하는 간단한 명령어를 만드는 일이었다. 마찬가지의 일을 여기서 하려고 한다. scripts 아래에 `"assets": "webpack --config webpack.config.js"`를 작성한다.

하지만 이렇게 하고 `npm run assets`로 실행하면 에러가 나온다. output의 path는 절대경로가 되어야 한다는 에러로, Webpack 홈페이지를 보면 path.resolve()로 이를 해결한 것을 볼 수 있다. 다음에는 이를 고치는 법을 알아보겠다.

### 9.2 Webpack Configuration part Two

우리는 Webpack에 상대경로를 입력했는데, 절대경로를 요구하고 있다. 한 번 `console.log(__dirname);`을 실행시켜보자. 그러면 파일까지의 경로를 보여준다. Webpack 홈페이지를 보면 이를 path.resolve()와 함께 사용하고 있다. path를 사용하려면 우선 path를 import 해야 한다. `const path = require("path");`로 불러와주고 `console.log(path.resolve(__dirname, ""))`를 출력해보자. 그러면 절대경로가 문자열로 출력된다. 이번에는 `console.log(path.resolve(__dirname, "assets", "js"));`를 출력해보자. 그러면 끝에 /assets/js가 붙은 것을 볼 수 있다. 즉 path.resolve는 \_\_dirname 뒤에 우리가 원하는 경로를 추가하는 것이다. 이를 사용해 path를 수정하면 아래처럼 된다.

```
// webpack.config.js
const path = require("path");

module.exports = {
    entry: "./src/client/js/main.js",
    output: {
        filename: "main.js",
        path: path.resolve(__dirname, "assets", "js"),
    },
};
```

이제 코드를 실행시켜서 어떤 변화가 생겼는지 보자. 코드를 실행하기 전에는 없던, assets 폴더가 생긴 것을 볼 수 있다. 그리고 콘솔을 보면 `The 'mode' option has not been set`이란 에러가 나온다. 이는 나중에 확인하기로 하고, 다시 assets 폴더를 보면, js 폴더와 main.js 파일이 생겼다. 그리고 내용을 보면 Webpack이 코드를 전환시켜 브라우저도 이해하도록 만들어 놓았다. 현재는 별다른 처리를 하지 않았기 때문에 단순히 압축한 코드만 적혀있다.

우리는 백엔드의 자바스크립트를 Babel로 처리했었다. 마찬가지로 프론트엔드에서도 Babel로 처리할 수 있다. 이는 package.json에서는 불가능하고 webpack.config.js에서 해야 한다. 그러기 위해 rules를 사용하는데, rules는 각 파일의 종류에 따라 어떤 전환을 할지 결정하는 것이다. 예를 들어서 css 파일을 변환시키는 방법은 아래와 같다.

```
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader'],
            },
        ],
    },
```

이는 css 파일을 style-loader과 css-loader를 적용시켜서 변환 시킨다는 의미다. 여기서 loader란 Webpack 용어로 어떤 파일을 바꾸는 방법을 담고 있다. 우리의 경우 Babel을 변환 시키려는 것이므로 babel-loader이 필요하다. 다시 돌아가서 우리는 자바스크립트에 babel-loader를 rules에 적어주려고 한다. rules는 여러가지를 적용할 수 있으므로 array 형태로 작성된다. 그래서 코드를 보면 []이 있다. test에는 `/\.js$/`가 들어가면 되고, use에는 babel-loader가 들어가면 된다.

그렇지만 아직 우리는 babel-loader이 없다. [babel-loader](https://github.com/babel/babel-loader)를 확인해보면 babel-loader, @babel/core, @babel/preset-env, webpack이 필요하다. 그런데 우리는 나머지는 다 설치했고 babel-loader만 없다. 그러므로 `npm i babel-loader -D`로 babel-loader만 설치하자. 그리고 babel-loader를 사용하는 법은 위 사이트에서 그대로 옮겨와줬다.

```
// webpack.config.js
const path = require("path");

module.exports = {
    entry: "./src/client/js/main.js",
    output: {
        filename: "main.js",
        path: path.resolve(__dirname, "assets", "js"),
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            ['@babel/preset-env', { targets: "defaults" }]
                        ],
                    },
                },
            },
        ],
    },
};
```

이렇게하면 자바스크립트 코드를 babel-loader라는 loader로 전환하는데, Webpack은 node-modules에서 babel-loader를 찾고, 몇 가지 옵션을 적용시켜준다. 이렇게 하고 다시 `npm run assets`를 실행시켜보자. 그리고 assets/js 폴더에서 main.js파일을 보면 코드가 상당히 바뀌었다. 이는 모두 babel에서 한 것으로, 우리가 원한대로 babel로 자바스크립트 코드를 변화시켰다.

마지막으로 mode 문제를 해결해보자. 우리는 Webpack에게 우리가 개발중(development)인지, 코드를 완성(production)한 것인지 알려줘야 한다. mode를 설정해주지 않으면 Webpack은 production mode로 설정된다. 그리고 Webpack은 코드를 한 줄로 압축하게 되는데, 개발중에는 이렇게 하면 보기 불편하다. 우리는 아직 개발중이므로 module.exports에 mode: "development",를 추가하자.

```
// webpack.config.js
const path = require("path");

module.exports = {
    entry: "./src/client/js/main.js",
    // add mode here
    mode: "development",
    output: {
        ...
    },
};
```

그리고 다시 `npm run assets`를 실행하고 main.js를 보면 좀 더 보기 쉽게 바뀌었다. 개발중에는 mode를 development로 유지하고 완료되면 production으로 바꿔주면 된다.

### 9.3 Webpack Configuration part Three

client 폴더는 우리가 코드를 작성할 폴더고, assets는 브라우저가 읽어낼 파일이 있는 폴더다. 그런데 Express에게는 assets 폴더나, main.js 파일이 존재하는지 모른다. 그러므로 Express에서 저 폴더들을 읽을 수 있게 만들어줘야 한다. 이전에 이와 동일한 일을 uploads 폴더에 진행했었는데, server.js에서 고쳐줬었다. server.js로 이동해서 `app.use("/assets", express.static("assets"));`로 assets 폴더를 사용할 수 있게 설정한다.

```
server.js
...
app.use("/uploads", express.static("uploads"));
// use assets with /static url
app.use("/static", express.static("assets"));
app.use("/", rootRouter);
...
```

이제 clint 폴더의 main.js로 이동해서 코드를 `alert("hi")`로 고쳐보자. 그리고 `npm run assets`로 코드를 만든다. 다음으로 이 코드가 실행되도록, base.pug로 이동해서 제일 아래에 `script(src="/assets/js/main.js")`를 입력하자. 그리고 서버를 실행해서 화면에 들어가면 코드가 실행되는 것을 볼 수 있다.

```
// base.pug
...
    include partials/footer
    // add script
    script(src="/assets/js/main.js")
```

### 9.4 SCSS Loader

지금까지 자바스크립트 코드를 처리하는 법을 알아봤다. 이번에는 css를 변환하는 법을 알아보자. scss 파일을 변환하기 위해서는 loader이 3개 필요한데, sass-loader, css-loader, style-loader이다. sass-loader는 scss 파일을 가져다가 css 파일로 전환시킨다. `npm i sass-loader sass -D`로 설치해준다. css-loader는 @import와 url()을 해석해준다. `npm i css-loader -D`로 설치하자. 마지막으로 style-loader은 css를 DOM에 주입한다. `npm i style-loader -D`로 설치한다. 이렇게하면 필요한 것은 모두 설치해줬다.

다음으로 loader를 적용시켜야 한다. loader를 적용시키는 것은 마지막 것부터 적용시켜야 한다. 그러므로 style/css/sass 순서로 적어줘야 한다.

```
// webpack.config.js

module.exports = {
    module: {
        rules: [
            {
                ...
            },
            {
                test: /\.scss$/,
                use: ["style-loader", "css-loader", "sass-loader"],
            },
        ],
    },
};
```

css가 잘 적용되는지 보기 위해 간단히 파일을 만든다. client 폴더 안에 scss라는 폴더를 만들고, 그 안에 style.scss, \_variables.scss 파일을 만들어준다. 그리고 다음처럼 만든다.

```
// style.scss
@import "./_variables.scss";
body {
    background-color: $red;
    color: white;
}
```

```
// _variable.scs
$red: red
```

그리고 main.js에 아래처럼 적는다.

```
// main.js
import "../scss/styles.scss";
console.log("hi");
```

이렇게하고 코드를 실행하면 붉은색 화면이 나오고, 브라우저의 콘솔을 보면 hi가 출력된. 그렇다면 코드는 정확히 어떻게 실행되는 것일까? 이는 webpack.config.js 파일을 읽어보면 알 수 있다. 먼저 main.js 파일을 가져와서 바벨로 자바스크립트를 번역한다. 그리고 main.js에 scss 파일이 속해 있으므로 sass-loader을 사용해 css로 번역한다. 그리고 css-loader를 사용해 @import, url()을 해석한다. 마지막으로 style-loader를 적용시켜서 브라우저가 읽을 수 있는 css로 바꿔준다.

### 9.5 MiniCssExtractPlugin

우리가 지금까지 작업한 것에 한 가지 문제가 있다. 바로 css 코드가 자바스크립트 코드 안에 들어 있다는 점이다. 보통은 웹페이지를 만들 때, css, 자바스크립트를 분리해서 만든다. 이는 css가 먼저 실행되고 자바스크립트가 실행되도록 해서, 화면이 바로 나오게 하고 싶기 때문이다. 그런데 우리가 만든 것은 css가 자바스크립트 안에 있어서 로딩을 기다려야 한다. 이는 style-loader 때문이므로 이를 다른 것으로 교체해줘야 한다.

그러기 위해 사용하는 것이 [MiniCssExtractPlugin](https://webpack.js.org/plugins/mini-css-extract-plugin/)이다. `npm install --save-dev mini-css-extract-plugin`로 설치해준다. 그리고 webpack.config.js를 아래처럼 수정한다.

```
// webpack.config.js
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
    // add plugins
    plugins: [new MiniCssExtractPlugin()],
    outputs: {
        ...
    },
    module: {
        rules: [
        {
            ...

        {
            test: /\.scss$/,
            use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
        },
        ],
    },
};
```

이후에 `npm run assets`를 실행하면 main.js외에 main.css가 생겼고, 그 안에 css 코드가 들어있다. 그런데 문제는 main.css가 js 폴더 안에 있다는 점이다. 그래서 output을 살짝 수정하려고 한다. 현재 우리 코드는 아래와 같다.

```
// webpack.config.js
module.exports = {
    plugins: [new MiniCssExtractPlugin()],
    output: {
        filename: "main.js",
        path: path.resolve(__dirname, "assets", "js"),
    },
    ...
```

여기서 우리 파일이 js에 생기는 이유는 path 때문이다. 그러므로 path를 `path: path.resolve(__dirname, "assets"),`로 수정해보자. 그리고 다시 코드를 실행해야 하는데, 그 전에 assets 폴더를 삭제하고 실행해야 한다. 이후에도 경로가 수정되면 파일의 저장 위치가 바뀌므로, 이전 파일이 남을 수 있다. 그러므로 경로를 바꿀 때 마다 폴더를 삭제해야 원하는대로 파일이 생성된다. assets 폴더를 지우고 `npm run assets`를 실행하면 assets 폴더 안에 main.js, main.css가 생겼다.

다음으로 우리는 js 파일을 폴더를 만들어서 넣어보겠다. 이는 output의 filename을 수정하면 된다. main.js를 js/main.js로 바꿔준다.

```
// webpack.config.js
module.exports = {
    plugins: [new MiniCssExtractPlugin()],
    output: {
        filename: "js/main.js",
        path: path.resolve(__dirname, "assets"),
    },
```

이렇게 하면 js 폴더에 main.js가 생긴다. 다음으로 css를 폴더 안에 넣어 줘야 한다. 이는 MiniCssExtractPlugin의 페이지를 참고하면 filename을 지정할 수 있는 옵션이 있다.

```
// webpack.config.js
module.exports = {
    plugins: [
        new MiniCssExtractPlugin({
            filename: "css/style.css",
        }),
    ],
    output: {
        filename: "js/main.js",
        path: path.resolve(__dirname, "assets"),
    },
```

최종적으로 webpack.config.js 파일의 코드는 아래와 같다.

```
// webpack.config.js
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const path = require("path");

module.exports = {
  entry: "./src/client/js/main.js",
  mode: "development",
  plugins: [
    new MiniCssExtractPlugin({
      filename: "css/styles.css",
    }),
  ],
  output: {
    filename: "js/main.js",
    path: path.resolve(__dirname, "assets"),
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [["@babel/preset-env", { targets: "defaults" }]],
          },
        },
      },
      {
        test: /\.scss$/,
        use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
      },
    ],
  },
};
```

이제 pug에서 css 파일을 연결하기만 하면 된다. base.pug로 이동해서 아래처럼 적어주자.

```
// base.pug
doctype html
html(lang="ko")
    head
        ...
        link(rel="stylesheet" href="/assets/css/style.css")
    ...
```

### 9.6 Better Deveolper Experience

매번 scss나 자바스크립트가 바뀔 때마다, assets 폴더를 삭제하는건 번거롭다. 게다가 scss나 자바스크립트가 변경될 때마다 `npm run assets`를 실행시키는 것도 하고 싶지 않다. 그래서 사용하는 것이 clean과 watch다. webpack.config.js에 다음을 추가해주자.

```
// webpack.config.js
...
module.exports = {
    entry: "./src/client/js/main.js",
    mode: "development",
    // add watch
    watch: true,
    ...
    outpus: {
        filename: "js/main.js",
        path: path.resolve(__dirname, "assets"),
        // add clean
        clean: true,
    }
};
```

clean은 output 폴더를 빌드하기 전에 비워주는 일을 한다. 그러므로 우리가 파일을 새로 빌드할 때, 폴더를 일일이 지워줄 필요가 없다.

watch: true를 추가하고, `npm run assets`를 실행하면 명령어가 종료되지 않는다. 다시 말해 코드가 새로 저장되어도 일일이 `npm run assets`를 입력할 필요가 없다는 의미다. 이렇게 되면 콘솔을 2개 사용하고 있다. 하나는 server를 다루는 콘솔이고, 다른 하나는 client 파일들을 watch하는 콘솔이다. 둘을 나눠서 사용하고 있기 때문에 `npm run dev`와 `npm run assets`를 2개의 콘솔에 각각 사용해야 한다. 만약 하나만 실행할 경우 에러가 발생하거나 원하는 대로 작동하지 않는다.

그런데 이 경우 프론트엔드만 수정했는데도 백엔드가 재시작된다. 이는 webpack.config.js가 저장될 때, nodemon이 파일을 저장하는 줄 알고 재시작하기 때문에 발생한다. 그러므로 nodemon에게 몇 가지 파일이나 폴더를 무시하도록 만들어주자. 방법은 2가지가 있다. package.json에서 직접 옵션을 추가하는 방법과, 별도로 파일을 만드는 방법이다. 옵션이 간단하다면 package.json에서 직접 추가해줘도 된다. 그렇지만 코드가 길어진다면 따로 파일을 만드는 것이 좋다. 우리는 파일을 하나 생성하도록 한다.

nodemon은 다행히도 설정 파일을 지원한다. nodemon.json 파일에 설정을 저장하면 이를 알아서 인식한다. nodemon.json 파일을 생성하고 아래처럼 추가해주자.

```
// nodemon.json
{
    "ignore": ["webpack.config.js", "src/client/*", "assets/*"],
    "exec": "babel-node src/init.js"

}
```

이렇게 하면 webpack.config.js 파일을 무시하고, src/client나 assets 폴더 안의 모든 파일을 무시하게 된다. 아래의 exec는 원래 scripts의 "dev"에 있던 설정을 옮겨준 것이다. 설정 파일을 새로 만들었으므로 설정을 nodemon.json 파일에 모아줘야 하기 때문이다. 그래서 package.json도 아래처럼 수정해야 한다.

```
// package.json
...
    "scripts": {
        "dev": "nodemon",
        ...
    },
```

이제 nodemon만 호출하면 자동으로 nodemon.json의 설정을 호출한다. 그러므로 콘솔에서 nodemon만 입력해도 서버가 시작된다.

이렇게 설정하고 webpack.config.js 파일을 저장하더라도 서버가 재시작되지 않는다.

추가로 scripts의 "assets"도 수정해보자. `"assets": "webpack --config webpack.config.js"`에서 뒷 부분을 지워서 `"assets": "webpack"`로 만든 다음 다시 `npm run assets`로 webpack을 실행해보자. 신기하게도 코드가 그대로 동작한다. 이는 nodemon과 마찬가지로 webpack.config.js 역시 Webpack이 실행될 때, 기본적으로 찾는 설정 파일이기 때문이다. 추가적으로 명령어를 아래처럼 수정하고 끝을 내겠다.

```
// package.json
...
  "scripts": {
    "dev:server": "nodemon",
    "dev:assets": "webpack"
  },
```

앞으로는 백엔드를 실행하려면 `npm run dev:server`를 입력하고, Webpack을 실행할 때는 `npm run dev:assets`를 입력하면 된다.

마지막으로 assets폴더를 업로드할 이유가 없으므로, assets 폴더를 .gitignore에 추가해야 한다.

```
// .gitignore
/node_modules
.env
/uploads
.DS_Store
/assets
```

### 9.7 Recap
