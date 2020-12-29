
import { UnityEngine } from 'csharp'

import React from 'react';


UnityEngine.Debug.Log('hello world');

let gameObject = new UnityEngine.GameObject("testobject");
console.log(gameObject.name);
gameObject.transform.position = new UnityEngine.Vector3(1, 2, 3);

console.log(React);

async function asyncFun2() {
    return 0;
}

async function asyncFun() {
    const a = await asyncFun2();
    console.log(a);
}

class AAA {

}


// var CS = require('csharp')



