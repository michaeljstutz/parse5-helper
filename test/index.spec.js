'use strict';

const PH = require('../src/');

describe('parse5-helper', () => {
  describe('.autoParse(html)', () => {
    it('should return a document', () => {
      const doc = PH.autoParse('<html><head></head><body><div></div></body></html>');
      expect(doc.nodeName).toBe('#document');
    });

    it('should return a fragment', () => {
      const doc = PH.autoParse('<div></div>');
      expect(doc.nodeName).toBe('#document-fragment');
    });
  });

  describe('.getAttributes(node) || .attributesOf(node)', () => {
    it('should return all the attributes', () => {
      const node = PH
        .parseFragment('<script type="text/javascript" src="file.js" async defer="defer"></script>')
        .childNodes[0];
      const attrs = PH.getAttributes(node);
      expect(attrs).toEqual({type:"text/javascript",src:"file.js",async:"",defer:"defer"});
    });
  });

  describe('.toAttrs(obj)', () => {
    it('should return an array of attributes', () => {
      const frag = PH.parseFragment('<link rel="stylesheet">');
      const node = frag.childNodes[0];
      node.attrs = PH.toAttrs({
        rel: 'stylesheet',
        href: 'file.css'
      });
      expect(PH.serialize(frag)).toEqual('<link rel="stylesheet" href="file.css">');
    });
  });

  describe('.setAttribute(node, name, value)', () => {
    it('should change an attribute', () => {
      const frag = PH.parseFragment('<link rel="stylesheet">');
      const node = frag.childNodes[0];
      PH.setAttribute(node, 'rel', 'import');
      expect(PH.serialize(frag)).toEqual('<link rel="import">');
    });

    it('should add an attribute', () => {
      const frag = PH.parseFragment('<link rel="stylesheet">');
      const node = frag.childNodes[0];
      PH.setAttribute(node, 'href', 'file.css');
      expect(PH.serialize(frag)).toEqual('<link rel="stylesheet" href="file.css">');
    });
  });

  describe('.getAttribute(node, name)', () => {
    it('should get the attribute', () => {
      const frag = PH.parseFragment('<link rel="stylesheet">');
      const node = frag.childNodes[0];
      expect(PH.getAttribute(node, 'rel')).toEqual('stylesheet');
    });
  });

  describe('.removeAttribute(node, name)', () => {
    it('should remove the attribute', () => {
      const frag = PH.parseFragment('<link rel="stylesheet">');
      const node = frag.childNodes[0];
      PH.removeAttribute(node, 'rel');
      expect(PH.serialize(frag)).toEqual('<link>');
    });
  });

  describe('.createNode(tagName)', () => {
    it('should create a node', () => {
      const frag = PH.parseFragment('');
      frag.childNodes.push(PH.createNode('div'));
      expect(PH.serialize(frag)).toEqual('<div></div>');
    });
  });

  describe('.createTextNode(text)', () => {
    it('should create a text node', () => {
      const frag = PH.parseFragment('<div></div>');
      frag.childNodes[0].childNodes.push(PH.createTextNode('lol'));
      expect(PH.serialize(frag)).toEqual('<div>lol</div>');
    });
  });

  describe('.prepend(parent, node)', () => {
    it('should prepend a node', () => {
      const frag = PH.parseFragment('<div><a></a></div>');
      PH.prepend(frag.childNodes[0], PH.createNode('br'));
      expect(PH.stringify(frag)).toEqual('<div><br><a></a></div>');
    });
  });

  describe('.append(parent, node)', () => {
    it('should append a node', () => {
      const frag = PH.parseFragment('<div><a></a></div>');
      PH.append(frag.childNodes[0], PH.createNode('br'));
      expect(PH.stringify(frag)).toEqual('<div><a></a><br></div>');
    });
  });

  describe('.replace(original, node)', () => {
    it('should replace a node', () => {
      const frag = PH.parseFragment('<script></script');
      const script = frag.childNodes[0];
      const text = script.childNodes[0];
      PH.replace(text, PH.createTextNode('a && b'));
      expect(PH.stringify(frag)).toEqual('<script>a && b</script>');
    });
  });

  describe('.remove(node)', () => {
    it('should remove a node', () => {
      const frag = PH.parseFragment('<div><a></a></div>');
      PH.remove(frag.childNodes[0]);
      expect(PH.stringify(frag)).toEqual('');
    });
  });

  describe('.textOf(node)', () => {
    it('should return the text of the node', () => {
      const frag = PH.parseFragment('<div>haha</div>');
      expect(PH.textOf(frag.childNodes[0])).toEqual('haha');
    });
  });

  describe('.setText(node)', () => {
    it('should set the text of the node', () => {
      const frag = PH.parseFragment('<div>1</div>');
      PH.setText(frag.childNodes[0], 'lol');
      expect(PH.stringify(frag)).toEqual('<div>lol</div>');
    });
  });

  describe('.flatten()', () => {
    it('should flatten the node\'s descendants', () => {
      const ast = PH.parseFragment('<div><div><div><a id="1"></a><a id="2"></div></div>');
      const nodes = PH.flatten(ast);
      expect(nodes.length).toEqual(6);
      expect(nodes.filter((node) => node.tagName === 'a').length).toEqual(2);
    });
  });

  describe('.getNodesByTag(tag, node)', () => {
    it('should return an array of matching nodes of tag', () => {
      const ast = PH.parseFragment('<div><div><div><a id="1"></a><a id="2"></div></div>');
      const nodes = PH.getNodesByTag('a', ast);
      expect(nodes.length).toEqual(2);
    });
  });

  describe('.getNodeById(id, node)', () => {
    it('should return an array of matching nodes of tag', () => {
      const ast = PH.parseFragment('<div><div><div><a id="1"></a><a id="2"></div></div>');
      const node = PH.getNodeById('1', ast);
      expect(node).not.toBeUndefined();
      expect(node.nodeName).toEqual('a');
    });
  });
});
