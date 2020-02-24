'use strict';

const assert = require('assert');
const parse5 = require('parse5');
const R = require('ramda');

const DEFAULT_NAMESPACE_URI = 'http://www.w3.org/1999/xhtml';

const DEFAULT_NODE = Object.freeze({
  nodeName: '',
  tagName: '',
  attrs: [],
  namespaceURI: DEFAULT_NAMESPACE_URI,
  childNodes: [],
});

const DEFAULT_TEXT_NODE = Object.freeze({
  nodeName: '#text',
  value: '',
});

const PH = {};

// Simple Function
const arrayReducerFn = PH.arrayReducerFn = R.curry((arr, node) => arr.concat(node));
const getAttrs = PH.getAttrs = R.curry((node) => node.attrs || []);
const getChildNodes = R.curry((node) => Array.isArray(node) ? node : node.childNodes || []);
const isDocument = PH.isDocument = R.test(/^\s*<(!doctype|html|head|body)\b/i);
const parse = PH.parse = parse5.parse;
const parseFragment = PH.parseFragment = parse5.parseFragment;
const pushChildNode = PH.appendChildNode = R.curry((parent, node) => parent.childNodes.push(node));
const serialize = PH.serialize = parse5.serialize;
const setParentNode = PH.setParentNode = (node, parent) => node.parentNode = parent;
const unshiftChildNode = PH.appendChildNode = R.curry((parent, node) => parent.childNodes.unshift(node));

// Not so Simple Functions
const autoParse = PH.autoParse = R.cond([
  [isDocument, parse],
  [R.T, parseFragment],
]);

const createNode = PH.createNode = R.curry((name) => {
  return {
    ...DEFAULT_NODE,
    nodeName: name,
    tagName: name,
  };
});

const createTextNode = PH.createTextNode = R.curry((value) => {
  return {
    ...DEFAULT_TEXT_NODE,
    value: value,
  };
});

const getAttributes = PH.getAttributes = R.pipe(
  getAttrs,
  R.reduce((acc, attr) => {
    return {...acc, [attr.name]: attr.value};
  }, {})
);

const reduceNodes = PH.reduceNodes = R.curry((fn, init, node) => {
  const acc = fn(init, node);
  const children = getChildNodes(node);
  
  if (!children) return acc;

  return children.reduce(reduceNodes(fn), acc);
});

const getNodes = PH.getNodes = reduceNodes(arrayReducerFn, []);

const getNodeById = PH.getNodeById = R.curry((id, doc) => R.find((node)=>R.propEq('id', id, getAttributes(node)), getNodes(doc)));

const reduceNodesByTag = PH.reduceNodesByTag = R.curry((tag, acc, node)=>{
  if (!R.propEq('tagName', tag, node)) return acc;
  return [...acc, node];
});

const getNodesByTag = PH.getNodesByTag = R.curry((tag, doc) => R.reduce(reduceNodesByTag(tag), [], getNodes(doc)));

// Complex Functions
const append = PH.append = R.curry((parent, node) => {
  setParentNode(node, parent);
  pushChildNode(parent, node);
  return node;
});

const getAttribute = PH.getAttribute = R.curry((node, name) => {
  const attributes = getAttributes(node);
  return attributes[name] || undefined;
});

const prepend = PH.prepend = R.curry((parent, node) => {
  setParentNode(node, parent);
  unshiftChildNode(parent, node);
  return node;
});

const remove = PH.remove = R.curry((node) => {
  const children = node.parentNode.childNodes;
  const index = children.indexOf(node);
  if (~index) children.splice(index, 1);
  return node;
});

const removeAttribute = PH.removeAttribute = R.curry((node, name) => {
  const attrs = getAttrs(node);
  node.attrs = attrs.filter((attr) => attr.name !== name);
  return node;
});

const replace = PH.replace = R.curry((original, node) => {
  const children = original.parentNode.childNodes;
  const index = children.indexOf(original);
  if (!~index) return;
  node.parentNode = original.parentNode;
  children.splice(index, 1, node);
  return node;
});

const setAttribute = PH.setAttribute = R.curry((node, name, value) => {
  const attrs = node.attrs = getAttrs(node);
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

const setText = PH.setText = R.curry((node, text) => {
  node.childNodes = [];
  append(node, createTextNode(text || ''));
  return node;
});

const getText = PH.getText = R.curry((node) => {
  // TODO: FIX as this does not function as expected due to the nested nature of parse5
  const childNodes = getChildNodes(node);
  if (!childNodes.length) return '';
  assert.equal(childNodes.length, 1, 'wtf');
  const child = childNodes[0];
  assert.equal(child.nodeName, '#text');
  return child.value || '';
});

const toAttrs = PH.toAttrs = R.curry((obj) => {
  const attrs = [];
  R.mapObjIndexed((value, key, obj)=>attrs.push({name: key, value: value}), obj);
  return attrs;
});

// Alias Functions
const attributesOf = PH.attributesOf = getAttributes;
const flatten = PH.flatten = getNodes;
const createFragment = PH.createFragment = parseFragment;
const stringify = PH.stringify = serialize;
const textOf = PH.textOf = getText;

// Return an immutable object of functions
module.exports = Object.freeze(PH);
