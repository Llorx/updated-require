# Updated Require

This module will keep track of modules and any of his dependencies changes, and will always return an up-to-date module.

## Installation

`npm install updated-require`

## Usage

```js
/* FILE: test1.js */
module.exports = {
    test2: require("./test2"),
    message: "I'm test1.js"
};
```

```js
/* FILE: test2.js */
module.exports = "I'm test2.js!";
```

```js
/* FILE: main.js */
// Load the module at the top of the entry point file
var UpdatedRequire = require("updated-require").UpdatedRequire;

// If you are using TypeScript, you can use import
import { UpdatedRequire } from "updated-require";

// Instantiate an object. You can add an optional callback.
// Only use the old instance to validate data. Do not keep the reference.
var updatedRequire = new UpdatedRequire(function(oldmodule, newmodule) {
    // This callback will be called only when a valid module is created
    console.log("Old module changed!", oldmodule.filename, newmodule.filename);
});

// Require a module and see how returns a different output each time you modify it.
var interval = setInterval(function() {
    // If the module is half-written, instead of returning an error, will return and old cached module.
    // Try to add syntax error code to the files, and see how it returns old exports until errors are fixed.
    console.log(updatedRequire.require("./test1"));
}, 1000);

// After you have finished, call dispose() to clean resources attached to modules
setTimeout(function() {
    clearInterval(interval);
    updatedRequire.dispose();
}, 30000);
```

## Limitations

See Custom Require limitations: https://github.com/Llorx/custom-require#limitations