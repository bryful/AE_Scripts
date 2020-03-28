/*
	簡単なスクリプトランチャー
	menuFolderNameで指定されたフォルダ内にあるスクリプトをパレットに表示する。
	この例では(menu)フォルダ名として、スクリプトメニューには登録されないようにしてある
*/
//-------------------------------------------------------------------------
(function (me)
{
	function getFileNameWithoutExt(s)
	{
		var ret = s;
		var idx = ret.lastIndexOf(".");
		if ( idx>=0){
			ret = ret.substring(0,idx);
		}
		return ret;
	}
	function getScriptName()
	{
		var ary = $.fileName.split("/");
		return File.decode( getFileNameWithoutExt(ary[ary.length-1]));
	}
	function getScriptPath()
	{
		var s = $.fileName;
		return s.substring(0,s.lastIndexOf("/"));
	}

	var palette			= null;
	var scriptName		= getScriptName();
	var menuFolderName	= "(" +scriptName +")";//ここを変更すればターゲットのフォルダ名を変更できる。ここではスクリプト名から作成。
	var scriptFolder	= new Folder( getScriptPath() + "/"+ menuFolderName);
	var btnList = new Array;
	
	//ボタンサイズのデフォルト
	var btnWidth	= 150;
	var btnHeight	= 25;
	var btnLeft	= 20;
	var btnTop		= 10;
	var btnInter	= 5;
	
	//-----------------------------
	this.onScriptButtonClick = function()
	{
		//スクリプトファイルを読み出し実行する。
		//まず現在のカレントパスを保存
		var prevCurrentFolder = Folder.current;
		//カレントパスをスクリプトのあるフォルダへ移動。
		Folder.current = this.scriptFolder;
		
		//ファイルを開きevalでスクリプトを実行。
		this.file.open();
		eval(this.file.read());
		this.file.close();
		
		//カレントを元に戻す。
		Folder.current = prevCurrentFolder;

	}
	//-----------------------------
	/*
		Fileオブジェクトからファイル名を獲得する。
		スクリプトの表示名として拡張子・先頭の数字を削除する。
		
		00.aaa.jsx
		01.bbb.jsx
		
		があるとすると、メニューパレットには
		
		aaa
		bbb
		
		と表示される。
		スクリプトの先頭の数字文字を調整することで順番を制御できる
	*/
	function capMake(f)
	{
		//Fileオブジェクトからファイル名を獲得
		var s = File.decode(f.name);
		if (s=="") return "";
		//拡張子を削除
		var idx = s.lastIndexOf(".");
		if (idx>-1) {
			s = s.substring(0,idx);
		}
		if (s=="") return "";
		
		//先頭の数字を削除。セパレータとして_-.があったらついでに削除
		var idx = -1;
		for (var i=0; i<s.length;i++){
			var c = s[i];
			if ( ( (c>="0")&&(c<="9") )||(c=="_")||(c=="-")||(c==".") ) {
			}else{
				idx = i;
				break;
			}
		}
		if (idx>=0) {
			s = s.substring(idx);
		}
		return s;
	}
	//-----------------------------
	//メニューパレットの作成
	this.exec = function()
	{
		//スクリプトファイルの一覧を獲得
		var files = scriptFolder.getFiles("*.jsx");
		if (files.length<=0) return false;

		var w = btnLeft + btnWidth + btnLeft;
		var h = btnTop + ( btnHeight +btnInter) * files.length;

		palette = ( me instanceof Panel) ? me : new Window("palette", scriptName, [ 132,  174,  132+ w,  174+ h]);

		
		var x0 = btnLeft;
		var x1 = x0 + btnWidth;
		for (var i=0; i<files.length;i++){
			var name = capMake(files[i]);
			var y0 = btnTop + (btnHeight + btnInter) *i;
			var y1 = y0 + btnHeight;
			var btn = palette.add("button",[x0,y0,x1,y1],name);
			//ボタンオブジェクトにfileを追加
			btn.file = files[i];
			//ボタンオブジェクトにスクリプトのパスを追加
			btn.scriptFolder = scriptFolder;
			btn.justify = "left";
			//ボタンのイベントを設定
			btn.onClick = this.onScriptButtonClick;
		}
		if ( ( me instanceof Panel) == false){
			palette.center();
			palette.show();
		}

	}
	this.exec();

///-----------------------------------------------------------------------
})(this);

