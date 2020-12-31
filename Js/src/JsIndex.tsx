import { UnityDom } from './react/unity-dom'
import Test from './tsx/test';
import * as cs from 'csharp';
import * as React from 'react';

export class JsIndex {
    public canvas: cs.UnityEngine.GameObject;
    constructor(canvas: cs.UnityEngine.GameObject) {
        this.canvas = canvas;
        console.log(canvas.name);
        UnityDom.render(<Test />, this.canvas);
    }
}
