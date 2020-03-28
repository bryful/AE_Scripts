After Effects CS4用のライブラリ「bryful」

◎概要
スクリプト作成補佐のライブラリです。
まだ作成途中です。

◎使い方
"bryful"フォルダごとStartupフォルダにコピーしてください。

AfterEffects起動後に情報パネルに"bryful's Lib install finished."と表示されれば
無事にロードされています。


bry-ful Hiroshi Furuhashi
2011/04/27

以下の関数・クラスが使用できます。

//----------------------------------------------------------------------------
	bryful.args.jsxinc
//----------------------------------------------------------------------------
●bryful.args(arguments)
	関数内で以下のようにすれば、引数を解析してメンバ変数に収納します。

	var arg = new bryful.args(arguments);

//----------------------------------------------------------------------------
	bryful.comp.jsxinc
//----------------------------------------------------------------------------
●bryful.comp.addComp(name,width,height,pixelAspect,duration,frameRate)
	コンポを作成します。
	引数は柔軟に使えます。FolderItem/CompItem/FootageItemも引数に使えます。

●bryful.comp.setFrame(cmp,frm);
	コンポのdurationをフレーム数で設定できます。
	CompItem.setFrame(frm);
	でも可
●bryful.comp.getFrame(cmp,frm);
	コンポのフレーム数を獲得します。
	var frm = CompItem.getFrame();
	でも可
●bryful.comp.setDefSize(w,h,a,d,fr);
	bryful.comp.addCompで省略されたパラメータのデフォルト値を設定します
	
●bryful.comp.setDefDuration(d);
	bryful.comp.addCompでdurationのデフォルト値を設定します

//----------------------------------------------------------------------------
	bryful.file.jsxinc
//----------------------------------------------------------------------------
●bryful.file.pushD();
	現在のカレントフォルダをpushします。

●bryful.file.popD();
	pushD()されたフォルダへ復帰します。
	
●bryful.file.saveToTextFile(str,path)
	文字列をpathへ保存します。
	
	String..saveToTextFile(path);
	でも可

●bryful.file.loadFromTextFile(path);
	pathのファイルを読み込みます。

//----------------------------------------------------------------------------
	bryful.fld.jsxinc
//----------------------------------------------------------------------------
●bryful.fld.getPathArray(tItem)
	指定したItemのフォルダ位置を、文字列配列で返します。

●bryful.fld.findFromFolderItem(folderItem,name,matchPatten)
	指定されたFoldetItemの中から、nameの名前のItemを探して配列の返します。
	matchPattenで、Itemの種類を指定できます。

●bryful.fld.findFromPathArray(ary)
	文字列配列で指定されたアイテムを探して配列で返します。

●bryful.fld.addFolderFromPathArray(ary, findFlag)
	文字列配列で指定されたフォルダを作成します。
	findFlagをtrueなら同名フォルダがあったら、それを返します。
	falseなら、新しく作ります。

●bryful.fld.addFolder
	引数を適当に解釈してフォルダを作成します
	
//----------------------------------------------------------------------------
	bryful.interate.jsxinc
//----------------------------------------------------------------------------

●bryful.iterate
	var loop = new bryful.iterate;
	汎用エントリです。

//----------------------------------------------------------------------------
	bryful.items.jsxinc
//----------------------------------------------------------------------------
●bryful.items.getType(t)
	指定されたObjectの種類(整数定数)を返します。

●bryful.items.getTypeName
	指定されたObjectの種類(文字列)を返します。

●bryful.items.isMove
	footageがMovieファイルならtrue

●bryful.items.isSequence
	footageが連番ファイルならtrue

●bryful.items.isType
	指定されたobjectが指定されたものと同じならtrue

●bryful.items.matchType(array , matchPattern)
	指定された配列の中で、matchPatternと同じものを配列で返します。

●bryful.items.activeItem
	 app.project.activeItem;と同じです

●bryful.items.activeComp
	アクティブなCompItemを返します。
	
●bryful.items.activeFootage
	アクティブなFootageItemを返します。

●bryful.items.activeFolder
	アクティブなFolderItemを返します。

●bryful.items.activeMovie
	アクティブなMovieファイルのFootageItemを返します。
●bryful.items.activeSequence
	アクティブなSequenceファイルのFootageItemを返します。
●bryful.items.activeMvSeq
	アクティブなMovieとSequenceファイルのFootageItemを返します。
●bryful.items.activeStill
	アクティブな静止画ファイルのFootageItemを返します。

//----------------------------------------------------------------------------
	bryful.path.jsxinc
//----------------------------------------------------------------------------
●bryful.path.trim()
	文字列の前後の半角・制御文字を削除します

●bryful.path.getExt
	文字列から拡張子を切り出します。

●bryful.path.deleteLastSepa
	文字列最後のパス区切り文字(\/)を削除します。
	
	
●bryful.path.lastSepaIndexOf
	文字列の末尾からパス区切り文字を探して、そのindexを返します

●bryful.path.getParent
	文字列から親フォルダのパス文字列を切り出します。

●bryful.path.getFileName
	文字列からファイル名のみを切り出します。
●bryful.path.getFileNameWithoutExt
	文字列から拡張子を除いたファイル名のみを切り出します。
●bryful.path.getFrameNmber
	文字列からフレーム番号を切り出します。

●bryful.path.splitCutName
	文字列を各要素に分解して返します。
//----------------------------------------------------------------------------
	bryful.string.jsxinc
//----------------------------------------------------------------------------
●bryful.string.trim
	文字列の前後の半角・制御文字を削除します

//----------------------------------------------------------------------------
	bryful.stringList
//----------------------------------------------------------------------------
●bryful.stringList
	文字列リストのObjectです
	var list = new bryful.stringList;

●bryful.stringList.trim
	文字列の前後の半角・制御文字を削除します

●bryful.stringList.push
●bryful.stringList.add
	文字列リストに追加します
●bryful.stringList.pop
	末尾の文字列を切り出します

●bryful.stringList.remove
	指定されたindexの要素を削除します

●bryful.stringList.getItems
	指定されたindexの要素を獲得します
●bryful.stringList.count
	リストの要素数を返します。

●bryful.stringList.setText
	リストにTextを代入します。行毎にリスト化されます。

●bryful.stringList.getText
	シストを1個の文字列として返します。

●bryful.stringList.toString
	リストをカンマくぐりの文字列で返します。
