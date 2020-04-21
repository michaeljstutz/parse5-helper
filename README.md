# parse5-helper

Parse5 helper functions

## Installation

```
npm install --save parse5-helper
```

## Sample

```

const ph = require('parse5-helper');

// Returns node with childNodes
const doc = ph.autoParse('<div>sample</div>');

// Convert branched object into array of nodes
const nodes = ph.getNodes(doc); // Returns an array of nodes

```

## Methods

adoptAttributes

appendChild

autoParse

createCommentNode

createDocument

createDocumentFragment

createElement

detachNode

findAll

findOne

firstNodeByTag

getAttribute

getAttributes

getAttrList

getChildNodes

getClassList

getCommentNodeContent

getDocumentMode

getDocumentTypeNodeName

getDocumentTypeNodePublicId

getDocumentTypeNodeSystemId

getFirstChild

getNamespaceURI

getNodeById

getNodes

getNodesByClass

getNodesByTag

getNodeSourceCodeLocation

getOptions

getParentNode

getTagName

getTemplateContent

getTextNodeContent

getTextNodes

hasClassMatch

insertBefore

insertText

insertTextBefore

isCommentNode

isDocumentHtml

isDocumentTypeNode

isElementNode

isIdMatch

isTagMatch

isTextNode

options_

parse

parseFragment

prependChild

removeAttribute

replaceNode

serialize

setAttribute

setDocumentMode

setDocumentType

setNodeParent

setNodeSourceCodeLocation

setOptions

setTemplateContent

toAttrs

updateNodeSourceCodeLocation

## Credit

>This project was inspired by the utils package available @ https://www.npmjs.com/package/parse5-utils

