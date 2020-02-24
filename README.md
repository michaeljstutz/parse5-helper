# parse5-helper

Parse5 helper functions

## Installation

```
npm install --save parse5-helper
```

## Sample

```
const PH = require('parse5-helper');

// Returns node with childNodes
const doc = PH.autoParse('<div>sample</div>');

// Convert branched object into array of nodes
const nodes = PH.getNodes(doc); // Returns an array of nodes
```

## Methods

append

appendChildNode

arrayReducerFn

attributesOf

autoParse

createFragment

createNode

createTextNode

flatten

getAttribute

getAttributes

getAttrs

getNodeById

getNodes

getNodesByTag

getText

isDocument

parse

parseFragment

prepend

reduceNodes

reduceNodesByTag

remove

removeAttribute

replace

serialize

setAttribute

setParentNode

setText

stringify

textOf

toAttrs

## Credit

>This project is based off of the utils package available https://www.npmjs.com/package/parse5-utils

