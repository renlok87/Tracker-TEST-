# Tracker(Test)

## Installation

Install dependencies:
```sh
cd <project folder>
composer install
npm install
```

Run your local server:
```sh
npm start
```
Server is located at http://localhost:3000,
proxy from local host `tracker.project`
(you can change this in `webpack-dev-server.config.js`)

Note: To allow external viewing of the demo, change the following value in `webpack-dev-server.config.js`:

```
host: 'localhost'  //Change to '0.0.0.0' for external facing server
```
