'use strict';

const parse5 = require('parse5');
const ph = require('../../src/lib/')(parse5);

describe('parse5-helper', () => {
  describe('.autoParse(html)', () => {
    it('should return a document', () => {
      const doc = ph.autoParse('<html><head></head><body><div></div></body></html>');
      expect(doc.nodeName).toBe('#document');
    });

    it('should return a fragment', () => {
      const frag = ph.autoParse('<div></div>');
      expect(frag.nodeName).toBe('#document-fragment');
    });
  });

  describe('.getOptions()', () => {
    it('should return options', () => {
      const options = ph.getOptions();
      expect(Object.keys(options)).toEqual(['treeAdapter']);
    });
  });

  describe('.updateOptions()', () => {
    it('should return options', () => {
      ph.updateOptions({test: true});
      expect(Object.keys(ph.getOptions())).toEqual(['treeAdapter','test']);
    });
  });

  describe('.parseFragment (htmlOrDoc, html)', () => {
    it('should return a fragment', () => {
      const frag = ph.parseFragment('<div></div>');
      expect(frag.nodeName).toBe('#document-fragment');
    });

    it('should return a fragment based on doc', () => {
      const doc = ph.createDocument();
      const frag = ph.parseFragment(doc, '<div></div>');
      expect(frag.nodeName).toBe('#document-fragment');
    });
  });

  describe('.getAttributes(node) || .attributesOf(node)', () => {
    it('should return all the attributes', () => {
      const node = ph
        .parseFragment('<script type="text/javascript" src="file.js" async defer="defer"></script>')
        .childNodes[0];
      const attrs = ph.getAttributes(node);
      expect(attrs).toEqual({type:"text/javascript",src:"file.js",async:"",defer:"defer"});
    });
  });

  describe('.toAttrs(obj)', () => {
    it('should return an array of attributes', () => {
      const frag = ph.parseFragment('<link rel="stylesheet">');
      const node = frag.childNodes[0];
      node.attrs = ph.toAttrs({
        rel: 'stylesheet',
        href: 'file.css'
      });
      expect(ph.serialize(frag)).toEqual('<link rel="stylesheet" href="file.css">');
    });
  });

  describe('.setAttribute(name, value, node)', () => {
    it('should change an attribute', () => {
      const frag = ph.parseFragment('<link rel="stylesheet">');
      const node = frag.childNodes[0];
      ph.setAttribute('rel', 'import', node);
      expect(ph.serialize(frag)).toEqual('<link rel="import">');
    });

    it('should add an attribute', () => {
      const frag = ph.parseFragment('<link rel="stylesheet">');
      const node = frag.childNodes[0];
      ph.setAttribute('href', 'file.css', node);
      expect(ph.serialize(frag)).toEqual('<link rel="stylesheet" href="file.css">');
    });
  });

  describe('.getAttribute(name, node)', () => {
    it('should get the attribute', () => {
      const frag = ph.parseFragment('<link rel="stylesheet">');
      const node = frag.childNodes[0];
      expect(ph.getAttribute('rel', node)).toEqual('stylesheet');
    });

    it('should return undefined', () => {
      const frag = ph.parseFragment('<link rel="stylesheet">');
      const node = frag.childNodes[0];
      expect(ph.getAttribute('class', node)).toBeUndefined();;
    });
  });

  describe('.removeAttribute(name, node)', () => {
    it('should remove the attribute', () => {
      const frag = ph.parseFragment('<link rel="stylesheet">');
      const node = frag.childNodes[0];
      ph.removeAttribute('rel', node);
      expect(ph.serialize(frag)).toEqual('<link>');
    });
  });

  describe('.createElement(tagName)', () => {
    it('should create a node', () => {
      const frag = ph.parseFragment('');
      frag.childNodes.push(ph.createElement('div'));
      expect(ph.serialize(frag)).toEqual('<div></div>');
    });
  });

  describe('.insertText(text)', () => {
    it('should create a text node', () => {
      const frag = ph.parseFragment('<div></div>');
      ph.insertText(ph.getFirstChild(frag), 'lol');
      expect(ph.serialize(frag)).toEqual('<div>lol</div>');
    });
  });

  describe('.prependChild(parent, node)', () => {
    it('should prepend a node', () => {
      const frag = ph.parseFragment('<div><a></a></div>');
      ph.prependChild(ph.getFirstChild(frag), ph.createElement('br'));
      expect(ph.serialize(frag)).toEqual('<div><br><a></a></div>');
    });
  });

  describe('.appendChild(parent, node)', () => {
    it('should append a node', () => {
      const frag = ph.parseFragment('<div><a></a></div>');
      ph.appendChild(ph.getFirstChild(frag), ph.createElement('br'));
      expect(ph.serialize(frag)).toEqual('<div><a></a><br></div>');
    });
  });

  describe('.replaceNode(newNode, oldNode)', () => {
    it('should replace a node', () => {
      const frag = ph.parseFragment('<script>a && b</script');
      const script = ph.getFirstChild(frag);
      const text = ph.getFirstChild(script);
      ph.replaceNode(ph.createElement('a'), text);
      expect(ph.serialize(frag)).toEqual('<script><a></a></script>');
    });
  });

  describe('.getNodes()', () => {
    it('should flatten the node\'s descendants', () => {
      const ast = ph.parseFragment('<div><div><div><a id="1"></a><a id="2"></div></div>');
      const nodes = ph.getNodes(ast);
      expect(nodes.length).toEqual(6);
      expect(nodes.filter((node) => node.tagName === 'a').length).toEqual(2);
    });
  });

  describe('.getTextNodes()', () => {
    it('should flatten the node\'s descendants', () => {
      const ast = ph.parseFragment('<div><div><div><a id="1">something</a><a id="2">else</div></div>');
      const nodes = ph.getTextNodes(ast);
      expect(nodes.length).toEqual(2);
    });
  });

  describe('.getNodesByTag(tag, node)', () => {
    it('should return an array of matching nodes of tag', () => {
      const ast = ph.parseFragment('<div><div><div><a id="1"></a><a id="2"></div></div>');
      const nodes = ph.getNodesByTag('a', ast);
      expect(nodes.length).toEqual(2);
    });
  });
  
  describe('.firstNodeByTag(tag, node)', () => {
    it('should return a node of tag', () => {
      const ast = ph.parseFragment('<div><div><div><a id="1"></a><a id="2"></div></div>');
      const node = ph.firstNodeByTag('a', ast);
      expect(node).not.toBeUndefined();
      expect(node.tagName).toEqual('a');
    });

    it('should return false if no tag found', () => {
      const ast = ph.parseFragment('<div><div><div><a id="1"></a><a id="2"></div></div>');
      const node = ph.firstNodeByTag('i', ast);
      expect(node).not.toBeUndefined();
      expect(node).toEqual(false);
    });
  });
  
  describe('.getNodesByClass(id, node)', () => {
    it('should return an array of matching nodes of class', () => {
      const ast = ph.parseFragment('<div><div><div><a class="one"></a><a class="two"></div></div>');
      const nodes = ph.getNodesByClass('two', ast);
      expect(nodes).not.toBeUndefined();
      expect(nodes.length).toEqual(1);
      expect(nodes[0].nodeName).toEqual('a');
    });
  });

  describe('.getNodeById(id, node)', () => {
    it('should return an array of matching nodes of tag', () => {
      const ast = ph.parseFragment('<div><div><div><a id="1"></a><a id="2"></div></div>');
      const node = ph.getNodeById('1', ast);
      expect(node).not.toBeUndefined();
      expect(node.nodeName).toEqual('a');
    });
  });

  describe('.findOne(test, nodes)', () => {
    it('should return results', () => {
      const ast = ph.parseFragment('<div><div><div><a id="1"></a><a id="2"></div></div>');
      const node = ph.findOne(()=>true, ast);
      expect(node).not.toBeUndefined();
      expect(node.nodeName).toEqual('#document-fragment');
    });

    it('should return results when passed array', () => {
      const ast = ph.parseFragment('<div><div><div><a id="1"></a><a id="2"></div></div>');
      const node = ph.findOne(()=>true, [null, ast]);
      expect(node).not.toBeUndefined();
      expect(node.nodeName).toEqual('#document-fragment');
    });
  });

  describe('.findAll(test, nodes)', () => {
    it('should return results', () => {
      const ast = ph.parseFragment('<div><div><div><a id="1"></a><a id="2"></div></div>');
      const nodes = ph.findAll(()=>true, ast);
      expect(nodes).not.toBeUndefined();
      expect(nodes.length).toEqual(6);
    });

    it('should return results when passed array', () => {
      const ast = ph.parseFragment('<div><div><div><a id="1"></a><a id="2"></div></div>');
      const nodes = ph.findAll(()=>true, [null, ast]);
      expect(nodes).not.toBeUndefined();
      expect(nodes.length).toEqual(6);
    });
  });

});
