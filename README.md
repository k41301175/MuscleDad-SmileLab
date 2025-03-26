---
layout: default
title: README
permalink: /readme/
---

# MuscleDad-SmileLab

## 覚書
### UnityのiOSにおけるATT対応について
この手順は、[こちらの記事](https://qiita.com/ichiromatano/items/fb7204c19d5b8cfcc36a)を参考にしています。
以下の手順で、対応することができます。
1. パッケージをインストール
Package ManagerのUnity RegistryからiOS 14 Advertising Supportをインストール

2. UnityEditorで、コードを作成
以下のコードを作成し、ゲームのトップシーンの空のゲームオブジェクトにアタッチする。
```
using UnityEngine;

#if UNITY_IOS
using Unity.Advertisement.IosSupport;
#endif

public class ATTRequest : MonoBehaviour
{
    void Start()
    {
        #if UNITY_IOS
        if (ATTrackingStatusBinding.GetAuthorizationTrackingStatus() == 
            ATTrackingStatusBinding.AuthorizationTrackingStatus.NOT_DETERMINED)
        {
            ATTrackingStatusBinding.RequestAuthorizationTracking();
        }
        #endif
    }
}
```
3. ビルド時に実行するスクリプトを作成
UnityでEditorフォルダ内に、以下のスクリプトを作成し、保存する。  
(シーンにアタッチしなくて大丈夫)
```
using UnityEditor;
using UnityEditor.Build;
using UnityEditor.Build.Reporting;
using UnityEditor.Callbacks;
#if UNITY_IOS
using UnityEditor.iOS.Xcode;
#endif
using System.IO;

public class PostBuildProcessing : IPostprocessBuildWithReport
{
    // 実行順
    public int callbackOrder => 100;

    // ビルド後処理
    public void OnPostprocessBuild(BuildReport report)
    {
#if UNITY_IOS
        if (report.summary.platform != BuildTarget.iOS)
            return;

        string projectPlistPath = Path.Combine(report.summary.outputPath, "Info.plist");

        if (!File.Exists(projectPlistPath))
        {
            UnityEngine.Debug.LogError("Info.plist not found at path: " + projectPlistPath);
            return;
        }

        PlistDocument plistObj = new PlistDocument();
        plistObj.ReadFromString(File.ReadAllText(projectPlistPath));
        PlistElementDict plistRoot = plistObj.root;

        plistRoot.SetString("NSUserTrackingUsageDescription", "This identifier will be used to deliver personalized ads to you.");

        File.WriteAllText(projectPlistPath, plistObj.WriteToString());
        UnityEngine.Debug.Log("Updated Info.plist successfully.");
#endif
    }
}
```
これにより、ビルド実行時に自動的にplistに追加してくれるようになりますので、通常の手順通りにビルド可能です。

##### その他
[ローカライズ方法](https://kan-kikuchi.hatenablog.com/entry/Localization_AppName_Tracking?utm_source=feed)