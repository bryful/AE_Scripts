/*
	AE_Menuで書き出されるスクリプトメニューのひな型。

	以下の$で始まるタグが置換される。(下の例は全角二していますが実際は半角です)

	＄Title		メニューのタイトル名に置換される。

	＄BaseFolder	jsx/ffxが収納されているフォルダのパスに置換される。
				絶対パスの場合 "/c/Bin/Scripts"
				相対パスの場合 "./(foo)"
				になる

	＄Items		呼び出すjsx/ffxのファイル名を配列として置換
		"aaa.jsx",
		"bbb.jsz"
		"ccc.ffx"
		こんな感じな形式に置換

	＄IconWidth	ボタンの横幅ピクセル
	＄IconHeight	ボタンの縦幅ピクセル

*/
(function(me){
	//----------------------------------
	// メニューに表示されるタイトル
	var scriptName = "レイヤ管理";
	//----------------------------------
	//読み込むフォルダ
	var cmdItemsPathBase = "./(レイヤ管理)";
	//読み込むスクリプト等
	var cmdItemsPath =[
"アクティブなコンポを選択.jsx",
"ガイドレイヤ：切り替え.jsx",
"コンポのサイズをレイヤに合わせる.jsx",
"コンポの秒数をレイヤに合わせる.jsx",
"テキストをシェイプへ.jsx",
"マスクをシェイプパスへ.jsx",
"レイヤのソースを選択.jsx",
"レイヤの選択をすべて解除.jsx",
"レイヤの順番を反転.jsx",
"新規調整シェイプレイヤ.jsx"

	];
	// アイコンサイズ
	var iconWidth = 240; 
	var iconHeight = 20; 

	var scrolBarWidth = 30;
	//----------------------------------
	//prototype登録
	//文字列の前後の空白を削除
	String.prototype.trim = function(){
		if (this=="" ) return ""
		else return this.replace(/[\r\n]+$|^\s+|\s+$/g, "");
	}
	String.prototype.getParent = function(){
		var r=this;var i=this.lastIndexOf("/");if(i>=0) r=this.substring(0,i);
		return r;
	}
	//ファイル名のみ取り出す（拡張子付き）
	String.prototype.getName = function(){
		var r=this;var i=this.lastIndexOf("/");if(i>=0) r=this.substring(i+1);
		return r;
	}
	//拡張子のみを取り出す。
	String.prototype.getExt = function(){
		var r="";var i=this.lastIndexOf(".");if (i>=0) r=this.substring(i);
		return r;
	}
	//指定した書拡張子に変更（dotを必ず入れること）空文字を入れれば拡張子の消去。
	String.prototype.changeExt=function(s){
		var i=this.lastIndexOf(".");
		if(i>=0){return this.substring(0,i)+s;}else{return this; }
	}
	//文字の置換。（全ての一致した部分を置換）
	String.prototype.replaceAll=function(s,d){ return this.split(s).join(d);}

	
	var cmdItems = [];
	//-------------------------------------------------------------------------
	//cmdItems配列に読み込むjsx/ffxの情報を構築する
	var setupItems = function()
	{
		var cnt = cmdItemsPath.length;
		if(cnt<=0) return;
		for (var i=0; i<cnt; i++)
		{
			var obj = {};
			obj.script = null;　//jsx/ffxのFile
			obj.icon = null;	//iconbutton用の画像File
			obj.isFX = false;	// ffxならtrue
			obj.work = null;	//スクリプトのあるフォルダ

			obj.script  = new File(cmdItemsPathBase + "/" + cmdItemsPath[i]);
			obj.icon  = new File(cmdItemsPathBase + "/" + cmdItemsPath[i].changeExt(".png"));
			obj.work = new Folder(cmdItemsPathBase);

			if((obj.script.exists==true)&&(obj.icon.exists==true))
			{
				var e = cmdItemsPath[i].getExt().toLowerCase();
				if ((e==".jsx")||(e==".jsxbin")) {
					obj.isFX = false;
				}else{
					obj.isFX = true;
				}
				cmdItems.push(obj);
			}
		}
	}
	setupItems();
	//-------------------------------------------------------------------------
	//Windowの作成
	var winObj = ( me instanceof Panel) ? me : new Window("palette", scriptName, [ 0,  0, iconWidth+scrolBarWidth, iconHeight *  cmdItems.length]  ,{resizeable:true});
	//-------------------------------------------------------------------------
	//iconButtonが押された時の処理
	var exec = function()
	{
		// jsx.ffxのファイルがなければエラー
		if(this.script==null){
			alert("error");
			return;
		}
		// カレントをスクリプトのある場所へ移動
		var bak = Folder.current;
		Folder.current = this.work;

		// jsxとffxで処理を変える
		if(this.isFX==true)
		{
			var sl = [];
			var ac = app.project.activeItem;
			if ( ac instanceof CompItem){
				if (ac.selectedLayers.length>0){
					sl = ac.selectedLayers;
				}
			}
			if ( sl.length>0){
				app.beginUndoGroup(File.decode(this.script.name));
				for ( var i=0; i<ac.selectedLayers.length; i++)
				{
					ac.selectedLayers[i].applyPreset(this.script);
				}
				app.endUndoGroup();
			}else{
				alert("レイヤを選択して下さい。");
			}
		}else{
			if (this.script.open("r")){
				try{
					var s = this.script.read();
					eval(s);
				}catch(e){
					alert("なんかスクリプト実行でエラー！\n\n"+e.toString());
				}finally{
					this.script.close();
				}
			}
		}
		//カレントを元に戻す
		Folder.current = bak;

	}	
	//-------------------------------------------------------------------------
	//ボタンの配列
	var ctrlTbl = [];
	//スクロールバー
	var scrolB = null;
	//ボタンを配置
	var setupButtons = function()
	{
		if (cmdItems.length<=0) return;
		var x = 0;
		var y = 0;
		for (var i=0; i<cmdItems.length; i++)
		{
			var btn = winObj.add("iconbutton", [x,y,x+iconWidth,y+ iconHeight],cmdItems[i].icon);
			btn.script = cmdItems[i].script;
			btn.isFX = cmdItems[i].isFX;
			btn.work = cmdItems[i].script.parent;
			btn.onClick = exec;

			ctrlTbl.push(btn);
			y += iconHeight;
		}

		scrolB = winObj.add("scrollbar", [iconWidth,0,iconWidth+scrolBarWidth,iconHeight*ctrlTbl.length], 0, 0, 100,);
	}
	setupButtons();
	//-------------------------------------------------------------------------
	//resize時の処理
	var  resize= function()
	{
		var scrV = scrolB.value;
		var b = winObj.bounds;
		var w = b[2] - b[0];
		var h = b[3] - b[1];
		
		var scrolB_b =  scrolB.bounds;
		scrolB_b[0] = w-scrolBarWidth;
		scrolB_b[2] = scrolB_b[0] + scrolBarWidth;
		scrolB_b[3] = scrolB_b[1] + h;
		scrolB.bounds = scrolB_b;

		var scv = iconHeight * ctrlTbl.length - h;
		if(scv>0)
		{
			if(scrolB.value>scv){
				scrolB.value = scv;
			}
			scrolB.maxvalue = scv;
		}else{
			scrolB.value = 0;
			scrolB.maxvalue = 0;

		}
		if(scrolB.value != scrV)
		{
			var v = scrolB.value;
			for (var i=0; i<ctrlTbl.length;i++)
			{
				var b = ctrlTbl[i].bounds;
				b[1] = -v +iconHeight*i;
				b[3] = b[1] + iconHeight;
				ctrlTbl[i].bounds = b;
			}
		}

	}
	resize();
	winObj.addEventListener("resize",resize);
	winObj.onResize = resize;
	
	//スクロールバーの処理
	var changeHeight=function()
	{
		var v = scrolB.value;
		for (var i=0; i<ctrlTbl.length;i++)
		{
			var b = ctrlTbl[i].bounds;
			b[1] = -v +iconHeight*i;
			b[3] = b[1] + iconHeight;
			ctrlTbl[i].bounds = b;
		}
	}
	scrolB.onChange = changeHeight;
	scrolB.onChanging = changeHeight;
	
	//-------------------------------------------------------------------------
	if ( ( me instanceof Panel) == false){
		winObj.center(); 
		winObj.show();
	}
	//-------------------------------------------------------------------------
})(this);