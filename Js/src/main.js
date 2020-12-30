
import { UnityEngine } from 'csharp'

import React from 'react';


UnityEngine.Debug.Log('hello world');

let gameObject = new UnityEngine.GameObject("testobject");
console.log(gameObject.name);
gameObject.transform.position = new UnityEngine.Vector3(1, 2, 3);

console.log(React);

var element = React.createElement('div', { className: 'shopping-list' },
    React.createElement('h1', /* ... h1 children ... */),
    React.createElement('ul', /* ... ul children ... */)
);

console.log(element);
