using Puerts;
using System.IO;

/// <summary> 自定义Loader </summary>
public class JsEnvLoader : ILoader
{
    private string root = "";
    public JsEnvLoader(string root)
    {
        this.root = root;
#if UNITY_EDITOR_WIN || UNITY_STANDALONE_WIN
        this.root = this.root.Replace("/", "\\");
#endif
    }
    public bool FileExists(string filepath)
    {
        return File.Exists(Path.Combine(root, filepath));
    }
    public string ReadFile(string filepath, out string debugpath)
    {
        debugpath = Path.Combine(root, filepath);
        return File.ReadAllText(debugpath);
    }
}
