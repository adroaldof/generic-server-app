[![Codeship Status for adroaldof/generic-server-app](https://img.shields.io/codeship/810993d0-34ff-0134-9930-761d96654ee5/master.svg?style=flat-square)](https://www.codeship.io/projects/165138)
[![Codecov private](https://img.shields.io/codecov/c/token/YLeMzfYLuj/github/adroaldof/generic-server-app/master.svg?maxAge=2592000&style=flat-square)]()
[![Dependency Status](https://www.versioneye.com/user/projects/579a85ba3815c80028e2ea43/badge.svg?style=flat-square)](https://www.versioneye.com/user/projects/579a85ba3815c80028e2ea43)

# Generic Server

This project is a generic server sample.

## Start Using

To work on this project follow the rules

**Clone the repo**
```bash
git clone git@github.com:adroaldof/generic-app-server.git
cd generic-app-server
```

**If you use NVM**
```bash
nvm use
```

**Install global dependencies**
```bash
npm install -g gulp-cli
```

**Install project dependencies**
```bash
npm install
```

And you are good to go. Checkout the commands bellow and enjoy :)


## Useful Commands

Here are some shortcut commands that I use

| NPM | Gulp | Description |
| :---                 | :---               | :---
| `npm run serve`      | `gulp serve`       | Run local server with live reload on change |
| `npm run full-serve` | `gulp full-serve`  | Run test, documentation and start local server |
| `npm run tests`      | `gulp test`        | Run tests and generate `coverage` directory results |
| `npm run lint`       | `gulp lint`        | Lint JS files (JSHint and JSCS) |
| `npm run documentate`| `gulp documentate` | Generate documentation and locate at `docs` folder |
| `npm run clean`      | `gulp clean`       | Clean all generated files (`docs`, `dist`) |
| `npm run pre`        | `gulp pre`         | Crete a Git Tag with pre release (E.g. 0.0.0-1) |
| `npm run patch`      | `gulp patch`       | Crete a Git Tag with patch release (E.g. 0.0.1) |
| `npm run minor`      | `gulp minor`       | Crete a Git Tag with minor release (E.g. 0.1.0) |
| `npm run major`      | `gulp major`       | Crete a Git Tag with major release (E.g. 1.0.0) |
| `npm run help`       | `gulp help`        | Show help command options |


## Local Static Front

If you want to see some front-end there are a sample implementation

```bash
npm run serve
```

Go to your browser at location [http://localhost:3000](http://localhost:3000)



## Some References

The follow references were used to build this project. Thank you so much guys :+1:

- [Kunal Kapadia - express-mongoose-es6-rest-api](https://github.com/KunalKapadia/express-mongoose-es6-rest-api)
- [Jason Miller - express-es6-rest-api](https://github.com/developit/express-es6-rest-api)
- [Pranav Sathyanarayanan - node-backend-boilerplate](https://github.com/PranavSathy/node-backend-boilerplate)
- [Madhusudhan Srinivasa - node-express-mongoose-demo](https://github.com/madhums/node-express-mongoose-demo)
- [Sahat Yalkabov - hackathon-starter](https://github.com/sahat/hackathon-starter)
- [Robert Onodi - Node.js authentication](http://blog.robertonodi.me/node-authentication-series-email-and-password/)
- [Michael Herman - User Authentication With Passport and Express 4](https://github.com/mjhea0/passport-local-express4)
- [RESTful API User Authentication with Node.js and AngularJS – Part 1/2: Server](https://devdactic.com/restful-api-user-authentication-1/)
- [Scotch Media - Sending Email with Nodemailer and node-mailer-templates](http://www.scotchmedia.com/tutorials/express/authentication/3/02)
- [Andrew Kelley - Rapid Development Email Templates with Node.js](http://andrewkelley.me/post/swig-email-templates.html)

