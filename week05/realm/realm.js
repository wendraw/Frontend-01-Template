class Node {
  constructor(id) {
    this.id = id;
    this.children = [];
    this.object = {};
  }
}
const globalProperties = [
  "eval",
  "isFinite",
  "isNaN",
  "parseFloat",
  "parseInt",
  "decodeURI",
  "decodeURIComponent",
  "encodeURI",
  "encodeURIComponent",
  "Array",
  "Date",
  "RegExp",
  "Promise",
  "Proxy",
  "Map",
  "WeakMap",
  "Set",
  "WeakSet",
  "Function",
  "Boolean",
  "String",
  "Number",
  "Symbol",
  "Object",
  "Error",
  "EvalError",
  "RangeError",
  "ReferenceError",
  "SyntaxError",
  "TypeError",
  "URIError",
  "ArrayBuffer",
  "SharedArrayBuffer",
  "DataView",
  "Float32Array",
  "Float64Array",
  "Int8Array",
  "Int16Array",
  "Int32Array",
  "Uint8Array",
  "Uint16Array",
  "Uint32Array",
  "Uint8ClampedArray",
  "Atomics",
  "JSON",
  "Math",
  "Reflect",
];
let set = new Set();

let data = new Node("Realm");
let queue = [];
for (let property of globalProperties) {
  queue.push({
    path: [property],
    object: this[property],
  });

  data.children.push(new Node(property));
  let index = 0;
  while (queue.length) {
    let current = queue.shift();
    if (set.has(current.object)) continue;
    set.add(current.object);
    console.log(current.path.join("."));
    let node = findNode(data, current.path);

    for (let p of Object.getOwnPropertyNames(current.object)) {
      let d = Object.getOwnPropertyDescriptor(current.object, p);

      if (
        d.value &&
        (typeof d.value === "object" || typeof d.value === "function")
      ) {
        queue.push({
          path: current.path.concat([p]),
          object: d.value,
        });
        node.children.push(new Node(p));
      }

      if (d.get && typeof d.get === "function") {
        queue.push({
          path: current.path.concat([p]),
          object: d.get,
        });
        node.children.push(new Node(p));
      }

      if (d.set && typeof d.set === "function") {
        queue.push({
          path: current.path.concat([p]),
          object: d.set,
        });
        node.children.push(new Node(p));
      }
    }
  }
}

function getChild(tree, p) {
  return tree.children.find((val) => val.id === p);
}

function findNode(tree, path) {
  let node = getChild(tree, path[0]);
  for (let i = 1; i < path.length; i++) {
    node = getChild(node, path[i]);
  }
  return node;
}
