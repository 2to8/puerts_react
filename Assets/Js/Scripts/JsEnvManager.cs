using Puerts;
using UnityEngine;

public class JsEnvManager : MonoBehaviour
{
    private JsEnv jsEnv;
    private void Start()
    {
        jsEnv = new JsEnv(new JsEnvLoader("G:/Unity/Git/puerts_react/Js"), 8080);
        jsEnv.WaitDebugger();
        jsEnv.Eval(@"require('main')");
    }
    private void Update()
    {
        jsEnv.Tick();
    }
    private void OnDestroy()
    {
        jsEnv.Dispose();
    }
}
