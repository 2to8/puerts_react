#if UNITY_EDITOR
#define START_DEBUG
#endif

using Puerts;
using UnityEngine;

public class JsEnvManager : MonoBehaviour
{
    private JsEnv jsEnv;
#if START_DEBUG
    async
#endif
    private void Start()
    {
        jsEnv = new JsEnv(new JsEnvLoader("G:/Unity/Git/puerts_react/Js/build"), 8080);
#if START_DEBUG
        Debug.Log("等待连接调试...");
        await jsEnv.WaitDebuggerAsync();
        Debug.Log("成功连接！");
#endif
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
