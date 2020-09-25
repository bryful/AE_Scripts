# prototypeUnoで拡張された関数や変数
  
prototypeUno.jsxは10年位前に作った奴で、After effects用のScriptライブラリーです。  
prototypeを使って機能拡張してあるので、コーディングが極めて楽になります。 

例えば使っていない平面フッテージを集めるスクリプトが以下のコードで実現できます。  

```
app.beginUndo();
var f = app.project.folder("使ってない平面");//フォルダアイテムを作成
app.project.getSolid().interate(
	function(t){
		if ( t.noneUsed()) t.parentFolder = f;
	}
);
app.endUndo();
```
簡単なintetaterを実装しているので極めて簡単にコーディングできます。  


呼び出し方は簡単で

```
var str = "aaa.tga";
var ext = str.getExt(); // extに".tga"が入る

var cmp = app.project.getActiveComp(); // cmpにアクティブなコンポがはいる。ない場合はnull

```

といった感じになります。


# 関数・変数の一覧
| Object                                                 | name                 | type     | Result                                | 説明                                                                        | 
| ------------------------------------------------------ | -------------------- | -------- | ------------------------------------- | --------------------------------------------------------------------------- | 
| Application                                            | uno                  | Object   | {"version":"2.00","madeby":"bry-ful"} | ロード確認用の変数                                                          | 
| String                                                 | getParent()          | function | String                                | 親フォルダのパス文字列を取り出す。                                          | 
| String                                                 | changeExt()          | function | String                                | 指定した書拡張子に変更（dotを必ず入れること）空文字を入れれば拡張子の消去。 | 
| String                                                 | getName()            | function | String                                | ファイル名のみ取り出す（拡張子付き）                                        | 
| String<br>File                                         | getExt()             | function | String                                | 拡張子のみを取り出す。                                                      | 
| String<br>File                                         | getNameWithoutExt()  | function | String                                | 拡張子なしのファイル名を取り出す。                                          | 
| String                                                 | replaceAll(src,dst)  | function | String                                | 文字の置換。（全ての一致した部分を置換）                                    | 
| String                                                 | trim()               | function | String                                | 文字列の前後の空白・改行コードを取り除く                                    | 
| String                                                 | lineToArray()        | function | Array                                 | 文字列を改行ごとに配列に変換                                                | 
| Array                                                  | toLineStr()          | function | String                                | 配列を改行区切りの文字列に変換                                              | 
| Array                                                  | indexIn(idx)         | function | Boolean                               | 指定した番号が配列の要素数内であればtrueを返す。                            | 
| Array                                                  | clear()              | function | Array (return this;)                  | 配列をクリア（要素数を０に)                                                 | 
| Array                                                  | clone()              | function | Array                                 | 配列を複製                                                                  | 
| Array                                                  | first()              | function | var                                   | 配列の先頭を取り出す                                                        | 
| Array                                                  | last()               | function | var                                   | 配列の最後を取り出す                                                        | 
| Array                                                  | removeAt(idx)        | function | var                                   | 指定したインデックス番号の要素を削除                                        | 
| Array                                                  | swap(s,d)            | function | Array                                 | 指定したインデックス番号で要素を入れ替える                                  | 
| ItemCollection<br>LayerCollection                      | toArray()            | function | Array                                 | コレクションを普通の配列に変換                                              | 
| Array                                                  | toArray()            | function | Array                                 | 配列自身を返す。                                                            | 
| String                                                 | toArray()            | function | Array                                 | 文字列を１文字１文字で配列に変換                                            | 
| Number                                                 | zero3()              | function | String                                | 値を先頭を０で埋めて３桁して文字列に変換。                                  | 
| Number                                                 | zero4()              | function | String                                | 値を先頭を０で埋めて４桁して文字列に変換。                                  | 
| File                                                   | saveText(str)        | function | Boolean                               | 文字列を書き込む                                                            | 
| String                                                 | save(File or Sring)  | function | Boolean                               | 文字列を書き込む                                                            | 
| Array<br>ItemCollection<br>LayerCollection<br>Property | interate(func)       | function | None                                  | Interate関数。fnc(要素,そのインデックス)                                    | 
| FootageItem<br>CompItem<br>FolderItem                  | isSound()            | function | Boolean                               | wav等のサウンドフッテージならtrue                                           | 
| FootageItem<br>CompItem<br>FolderItem                  | isSolid()            | function | Boolean                               | 平面フッテージならtrue                                                      | 
| FootageItem<br>CompItem<br>FolderItem                  | isStill()            | function | Boolean                               | 静止画フッテージならtrue                                                    | 
| FootageItem<br>CompItem<br>FolderItem                  | isSequence()         | function | Boolean                               | 動画フッテージならtrue                                                      | 
| FootageItem<br>CompItem<br>FolderItem                  | isSequence()         | function | Boolean                               | 動画フッテージならtrue                                                      | 
| FootageItem<br>CompItem<br>FolderItem                  | isComp()             | function | Boolean                               | コンポジションならtrue                                                      | 
| FootageItem<br>CompItem<br>FolderItem                  | isFolder()           | function | Boolean                               | フォルダーアイテムならtrue                                                  | 
| FootageItem<br>CompItem<br>FolderItem                  | isNotStill()         | function | Boolean                               | 秒数を持たないアイテム(CompItem動画フッテージ以外)ならtrue                  | 
| FootageItem<br>                                        | noneUsed()           | function | Boolean                               | フッテージアイテムが何も使われていないときはtrue                            | 
| Application                                            | __pushD__            | Array    |                                       | 現在のカレントディレクトリを保存するための変数                              | 
| Application                                            | pushD()              | function | None                                  | 現在のカレントディレクトリを保存するための変数                              | 
| Application                                            | popD()               | function | None                                  | 保存したカレントディレクトリを復帰                                          | 
| Application                                            | getCurrentPath()     | function | String                                | カレントティレクトリのフルパス(デコード済み)                                | 
| Application                                            | getCurrentPathD()    | function | String                                | カレントティレクトリのフルパス(デコード前)                                  | 
| Application                                            | getScriptFile()      | function | File                                  | 現在実行中のスクリプトファイル自身の File objectを獲得                      | 
| Application                                            | getScriptName()      | function | String                                | 現在実行中のスクリプトファイル名を獲得(デコード済み)                        | 
| Application                                            | getScriptNameD()     | function | String                                | 現在実行中のスクリプトファイル名を獲得(デコード前)                          | 
| Application                                            | getScriptTitle()     | function | String                                | 現在実行中のスクリプトファイル名（拡張子なし）を獲得                        | 
| Application                                            | getScriptPath()      | function | String                                | 現在実行中のスクリプトファイルの親フォルダのパスを獲得(デコード済み)        | 
| Application                                            | getScriptPathD()     | function | String                                | 現在実行中のスクリプトファイルの親フォルダのパスを獲得(デコード前)          | 
| Application                                            | beginUndo(str)       | function | None                                  | ものぐさbeginUndoGroup。スクリプト名を保管している。引数は追加文字列        | 
| Application                                            | endUndo()            | function | None                                  | ものぐさendUndoGroup                                                        | 
| Application                                            | getScreenCount()     | function | Number                                | PCに接続されているモニタの数を獲得                                          | 
| CompItem                                               | getFrame()           | function | Number                                | コンポの長さをフレーム数で獲得r                                             | 
| CompItem                                               | setFrame(frm)        | function | None                                  | コンポの長さをフレーム数で設定                                              | 
| CompItem<br>FootageItem                                | createComp()         | function | CompItem                              | ンポ・フッテージと同じ大きさ長さのコンポを作成                              | 
| FolderItem<br>Project                                  | folder(name)         | function | FolderItem                            | フォルダを作成。指定した同じ名前のフォルダがあったらそれを返す。            | 
| CompItem                                               | selectionPush()      | function | None                                  | レイヤの選択状態を記憶                                                      | 
| CompItem                                               | selectionPop()       | function | None                                  | レイヤの選択状態を復帰                                                      | 
| CompItem                                               | selectionNone()      | function | None                                  | レイヤの選択を全て解除                                                      | 
| Project                                                | selectionPush()      | function | None                                  | アイテムの選択状態を記憶                                                    | 
| Project                                                | selectionPop()       | function | None                                  | アイテムの選択状態を復帰                                                    | 
| Project                                                | selectionNone()      | function | None                                  | アイテムの選択を全て解除                                                    | 
| Project                                                | findItemByName(name) | function | Array                                 | プロジェクト内のアイテムを名前で探す。結果は配列で返る。                    | 
| FolderItem                                             | findItemByName(name) | function | Array                                 | フォルダ内のアイテムを名前で探す。結果は配列で返る。                        | 
| Object                                                 | isAEItems()          | function | Boolean                               | ObjectがAfter Effectsのアイテムかどうか(CompItem FotageItem FoldeItem)      | 
| Array                                                  | getComp()            | function | Array                                 | 配列内からCompItemを抽出                                                    | 
| Array                                                  | getFootage()         | function | Array                                 | 配列内からFootageItemを抽出                                                 | 
| Array                                                  | getSolid()           | function | Array                                 | 配列内から平面フッテージを抽出                                              | 
| Project                                                | getActiveComp()      | function | CompItem                              | 現在アクティブなコンポを返す                                                | 
| Project                                                | getActiveFootage()   | function | FootageItem                           | 現在アクティブなフッテージを返す                                            | 
| Project                                                | getSelectedComp()    | function | Array                                 | 選択されているコンポを配列で返す。                                          | 
| Project                                                | getSelectedFolder()  | function | Array                                 | 選択されているフォルダアイテムを配列で返す。                                | 
| Project                                                | getSelectedFootage() | function | Array                                 | 選択されているフォルダを配列で返す。                                        | 
| Project                                                | selectedProperties() | function | Array                                 | 現在選択されているプロパティを配列で返す。                                  | 
| Project                                                | selectedLayers()     | function | Array                                 | 現在選択されているレイヤを配列で返す。                                      | 
| Projec<br>FolderItem                                   | getComp()            | function | Array                                 | フォルダーアイテム内のCompItemを獲得                                        | 
| Projec<br>FolderItem                                   | getFootage()         | function | Array                                 | フォルダーアイテム内のFootageItemを獲得                                     | 
| Projec<br>FolderItem                                   | getFolderItem()      | function | Array                                 | フォルダーアイテム内のFolderItemを獲得                                      | 
| Projec<br>FolderItem                                   | getSolid()           | function | Array                                 | フォルダーアイテム内の平面フッテージを獲得                                  | 
| Property                                               | isKeyAtTime(time)    | function | Boolean                               | 指定された時間にキーフレームがあったらtrue                                  | 
| Property                                               | keyClear()           | function | noen                                  | キーフレームを全て削除                                                      | 
| Property                                               | keyFreeze()          | function | noen                                  | キーフレームを最初の１個のみにする                                          | 
| Property                                               | getParentLayer()     | function | Layer                                 | このプロパティのあるLayer objectを返す                                      | 
| Property                                               | keySelectedAll(boo;) | function | none                                  | 全てのキーフレームを選択。引数にfalseを入れると全ての選択を解除             | 
  
  
# License
  
This software is released under the MIT License, see LICENSE
  
# Authors

bry-ful(Hiroshi Furuhashi) http://bryful.yuzu.bz/  
twitter:[bryful](https://twitter.com/bryful)  
bryful@gmail.com  

# References
