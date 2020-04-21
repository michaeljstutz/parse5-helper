# Parse5 Helper Changelog

## 1.0.0, Initial release

### Notes:

Functions:

* autoParse
* findAll
* findOne
* firstNodeByTag
* getAttribute
* getAttributes
* getClassList
* getNodeById
* getNodes
* getNodesByClass
* getNodesByTag
* getOptions
* getTextNodes
* hasClassMatch
* isDocumentHtml
* isIdMatch
* isTagMatch
* parse
* parseFragment
* prependChild
* removeAttribute
* replaceNode
* serialize
* setAttribute
* setNodeParent
* setOptions
* toAttrs

Functions from the treeAdapter with notes on changes:

* adoptAttributes
* appendChild
* createCommentNode
* createDocument
* createDocumentFragment
* createElement
  * Includes default namespaceURI and empty attrs array
* detachNode
* getAttrList
  * Defaults to an empty array
* getChildNodes
  * Defaults to an empty array
* getCommentNodeContent
* getDocumentMode
* getDocumentTypeNodeName
* getDocumentTypeNodePublicId
* getDocumentTypeNodeSystemId
* getFirstChild
* getNamespaceURI
* getNodeSourceCodeLocation
  * Added in newer versions of parse5 so default function will always return false
* getParentNode
* getTagName
* getTemplateContent
* getTextNodeContent
* insertBefore
* insertText
* insertTextBefore
* isCommentNode
* isDocumentTypeNode
* isElementNode
* isTextNode
* setDocumentMode
* setDocumentType
* setNodeSourceCodeLocation
  * Added in newer versions of parse5 so default function will always return false
* setTemplateContent
* updateNodeSourceCodeLocation
  * Added in newer versions of parse5 so default function will always return false
