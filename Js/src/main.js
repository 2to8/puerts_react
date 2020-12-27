import { UnityEngine } from 'csharp'

UnityEngine.Debug.Log('hello world');
let gameObject = new UnityEngine.GameObject("testobject");
console.log(gameObject.name);
gameObject.transform.position = new UnityEngine.Vector3(1, 2, 3);


// const CS = require('csharp');

// import './src/index.js'

// let gameObject = new CS.UnityEngine.GameObject('new GameObject');
// CS.UnityEngine.Debug.Log(gameObject.name);
