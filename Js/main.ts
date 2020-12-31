import { JsIndex } from './src/JsIndex';
import * as cs from 'csharp';

class Main {
    public canvas: cs.UnityEngine.GameObject;
    public jsIndex: JsIndex;
    constructor(canvas: cs.UnityEngine.GameObject) {
        this.canvas = canvas;
        this.jsIndex = new JsIndex(canvas);
    }
}

export function init(jsEnvMgr: cs.JsEnvManager) {
    new Main(jsEnvMgr.canvas);
}
