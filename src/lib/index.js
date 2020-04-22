'use strict';

const R = require('ramda');

const DEFAULT_NAMESPACE_URI = 'http://www.w3.org/1999/xhtml';

module.exports = function(parse5, options = {}) {

  const ph = {};
  
  ph.options_ = options;

  const treeAdapter = 
  ph.options_.treeAdapter = ph.options_.treeAdapter || // passed in options
      R.path(['treeAdapter','default'], parse5) || // version 2/3/4
      require('parse5/lib/tree-adapters/default'); // version 5/6

  const getOptions = 
  ph.getOptions = () => ph.options_;

  const updateOptions = 
  ph.updateOptions = (newOptions) => Object.assign(ph.options_, newOptions);

  // Base Tree Adapter functions

  const adoptAttributes = 
  ph.adoptAttributes = R.curry(treeAdapter.adoptAttributes);

  const appendChild = 
  ph.appendChild = R.curry(treeAdapter.appendChild);

  const createCommentNode = 
  ph.createCommentNode = R.curry(treeAdapter.createCommentNode);

  const createDocument = 
  ph.createDocument = R.curry(treeAdapter.createDocument);

  const createDocumentFragment = 
  ph.createDocumentFragment = R.curry(treeAdapter.createDocumentFragment);

  const createElement = // Can not curry a function with defaults
  ph.createElement = (tagName, namespaceURI=DEFAULT_NAMESPACE_URI, attrs=[]) => treeAdapter.createElement(tagName, namespaceURI, attrs);

  const detachNode = 
  ph.detachNode = R.curry(treeAdapter.detachNode);

  const getAttrList = 
  ph.getAttrList = R.curry((node) => treeAdapter.getAttrList(node) || []);

  const getChildNodes = 
  ph.getChildNodes = R.curry((node) => treeAdapter.getChildNodes(node) || []);

  const getCommentNodeContent = 
  ph.getCommentNodeContent = R.curry(treeAdapter.getCommentNodeContent);

  const getDocumentMode = 
  ph.getDocumentMode = R.curry(treeAdapter.getDocumentMode);

  const getDocumentTypeNodeName = 
  ph.getDocumentTypeNodeName = R.curry(treeAdapter.getDocumentTypeNodeName);

  const getDocumentTypeNodePublicId = 
  ph.getDocumentTypeNodePublicId = R.curry(treeAdapter.getDocumentTypeNodePublicId);

  const getDocumentTypeNodeSystemId = 
  ph.getDocumentTypeNodeSystemId = R.curry(treeAdapter.getDocumentTypeNodeSystemId);

  const getFirstChild = 
  ph.getFirstChild = R.curry(treeAdapter.getFirstChild);

  const getNamespaceURI = 
  ph.getNamespaceURI = R.curry(treeAdapter.getNamespaceURI);

  const getNodeSourceCodeLocation = 
  ph.getNodeSourceCodeLocation = R.curry(treeAdapter.getNodeSourceCodeLocation || R.F);

  const getParentNode = 
  ph.getParentNode = R.curry(treeAdapter.getParentNode);

  const getTagName = 
  ph.getTagName = R.curry(treeAdapter.getTagName);

  const getTemplateContent = 
  ph.getTemplateContent = R.curry(treeAdapter.getTemplateContent);

  const getTextNodeContent = 
  ph.getTextNodeContent = R.curry(treeAdapter.getTextNodeContent);

  const updateNodeSourceCodeLocation =
  ph.updateNodeSourceCodeLocation = R.curry(treeAdapter.updateNodeSourceCodeLocation || R.F);

  const insertBefore = 
  ph.insertBefore = R.curry(treeAdapter.insertBefore);

  const insertText = 
  ph.insertText = R.curry(treeAdapter.insertText);

  const insertTextBefore = 
  ph.insertTextBefore = R.curry(treeAdapter.insertTextBefore);

  const isCommentNode = 
  ph.isCommentNode = R.curry(treeAdapter.isCommentNode);

  const isDocumentTypeNode = 
  ph.isDocumentTypeNode = R.curry(treeAdapter.isDocumentTypeNode);

  const isElementNode = 
  ph.isElementNode = R.curry(treeAdapter.isElementNode);

  const isTextNode = 
  ph.isTextNode = R.curry(treeAdapter.isTextNode);


  const setDocumentMode = 
  ph.setDocumentMode = R.curry(treeAdapter.setDocumentMode);

  const setDocumentType = 
  ph.setDocumentType = R.curry(treeAdapter.setDocumentType);

  const setNodeSourceCodeLocation = 
  ph.setNodeSourceCodeLocation = R.curry(treeAdapter.setNodeSourceCodeLocation || R.F);

  const setTemplateContent = 
  ph.setTemplateContent = R.curry(treeAdapter.setTemplateContent);

  // Core parse5 functions

  const isDocumentHtml = 
  ph.isDocumentHtml = R.test(/^\s*<(!doctype|html|head|body)\b/i);
  
  const parse = 
  ph.parse = (html) => parse5.parse(html, options);

  const parseFragment = 
  ph.parseFragment = (htmlOrDoc, html) => {
    // Account for the silly optional leading param
    if (html) return parse5.parseFragment(htmlOrDoc, html, options);
    return parse5.parseFragment(htmlOrDoc, options);
  };

  const serialize = 
  ph.serialize = (doc) => parse5.serialize(doc, options);

  const autoParse = 
  ph.autoParse = R.cond([
    [isDocumentHtml, parse],
    [R.T, parseFragment],
  ]);

  // Other functions

  const getAttributes = 
  ph.getAttributes = R.pipe(
    getAttrList,
    R.reduce((acc, attr) => {
      return {...acc, [attr.name]: attr.value};
    }, {})
  );

  const getAttribute = 
  ph.getAttribute = R.curry((name, node) => {
    const attributes = getAttributes(node);
    return attributes[name] || undefined;
  });

  const getClassList = 
  ph.getClassList = R.curry((node) => {
    const attributes = getAttributes(node);
    const classValue = attributes['class'] || null;
    if (R.isNil(classValue) || R.isEmpty(classValue)) return [];
    return R.split(' ', classValue);
  });

  const isTagMatch =
  ph.isTagMatch = R.curry((tag, node) => getTagName(node) === tag);

  const isIdMatch = 
  ph.isIdMatch = R.curry((id, node) => R.propEq('id', id, getAttributes(node)));

  const hasClassMatch =
  ph.hasClassMatch = R.curry((name, node) => R.includes(name, getClassList(node)));

  const findOne =
  ph.findOne = R.curry((test, nodes) => {
    const stack = Array.isArray( nodes ) ? nodes.slice() : [ nodes ];
    while ( stack.length ) {
      const node = stack.shift();
      if ( ! node ) continue;
      if ( test(node) ) return node;
      const children = getChildNodes(node);
      if ( ! R.isNil(children) && ! R.isEmpty(children) ) stack.unshift(...children);
    }
    return false;
  });

  const findAll =
  ph.findAll = R.curry((test, nodes) => {
    const results = [];
    const stack = Array.isArray(nodes) ? nodes.slice() : [ nodes ];
    while ( stack.length ) {
      const node = stack.shift();
      if ( ! node ) continue;
      const children = getChildNodes(node);
      if ( ! R.isNil(children) && ! R.isEmpty(children) ) stack.unshift(...children);
      if ( test(node) ) results.push(node);
    }
    return results;
  });

  const getNodes = 
  ph.getNodes = findAll(R.T);
  
  const getTextNodes = 
  ph.getTextNodes = findAll(isTextNode);

  const getNodesByTag = 
  ph.getNodesByTag = R.curry((tag, doc) => findAll(isTagMatch(tag), doc));
  
  const firstNodeByTag = 
  ph.firstNodeByTag = R.curry((tag, doc) => findOne(isTagMatch(tag), doc));

  const getNodesByClass =
  ph.getNodesByClass = R.curry((name, doc) => findAll(hasClassMatch(name), doc));

  const getNodeById = 
  ph.getNodeById = R.curry((id, doc) => findOne(isIdMatch(id), doc));

  const setNodeParent = 
  ph.setNodeParent = R.curry((parent, node) => node.parentNode = parent);

  const setAttribute = 
  ph.setAttribute = R.curry((name, value, node) => {
    const attrs = node.attrs = getAttrList(node);
    const attr = R.find(R.propEq('name', name), attrs);

    // mutate the attr if found
    if (attr) {
      attr.value = value;
      return node;
    }

    // mutate attrs adding new attr
    attrs.push({
      name: name,
      value: value
    });

    return node;
  });

  const prependChild = 
  ph.prependChild = R.curry((parent, node) => {
    parent.childNodes.unshift(node);
    setNodeParent(node, parent);
  });

  const removeAttribute = 
  ph.removeAttribute = R.curry((name, node) => {
    const attrs = getAttrList(node);
    node.attrs = attrs.filter((attr) => attr.name !== name);
  });

  const replaceNode = 
  ph.replaceNode = R.curry((newNode, node) => {
    const parent = getParentNode(node);
    insertBefore(parent, newNode, node);
    detachNode(node);
  });

  const toAttrs = 
  ph.toAttrs = R.curry((obj) => {
    const attrs = [];
    R.mapObjIndexed((value, key, obj) => attrs.push({name: key, value: value}), obj);
    return attrs;
  });

  // Return an immutable object of functions
  return Object.freeze(ph);
};
