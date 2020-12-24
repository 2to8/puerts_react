const CS = require('csharp');

require('./src/index.js');

let gameObject = new CS.UnityEngine.GameObject('new GameObject');
CS.UnityEngine.Debug.Log(gameObject.name);