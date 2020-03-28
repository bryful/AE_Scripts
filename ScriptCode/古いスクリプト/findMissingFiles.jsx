/*		インストール：	ターゲットのAfter Effectsの実行ファイルのあるフォルダ内にあるScripts/ScriptUI Panelsフォルダに	このスクリプトを移動させてください。	移動後必ずAfter Effectsは再起動する事。		設定：	「環境設定：環境設定：一般設定：スクリプトによるファイルへの書き込みとネットワークへのアクセスを許可」をONにしてください。	使い方:	上記の設定をしてあれば、「ウィンドウ」メニューに「findMissingFiles.jsx」が現れるので、それを実行。	フローティングパネルが表示されるので適当にパネルにドッキングさせておく。		「失われたファイルをプロジェクトから獲得」ボタンを押すとリンク切れのフッテージアイテムが下のリストに表示される。		リストの項目をダブルクリックすれば、そのアイテムをプロジェクトウィンドウ上で選択できる。		リストから項目を選び「ファイルを置き換える」ボタンを実行すればファイル選択ダイアログが表示されるので選べば置き換えされる。	そのフォルダ内に他の失われたファイルが存在すればそれも置き換える。		「ファイルをフォルダから探す」でフォルダ選択ダイアログが表示されるので選べば探して置き換えを行う。		機能的制限：	レイヤ付きPhotoshopファイル(*.psd)およびIllustratorファイル(*.ai)はこのスクリプトファイルでは置き換えできません。	これはAfter Effectsが提供しているAPIの仕様のためで現在のところプラグイン・スクリプトでは対応は不可能です。		ダブルクリックで選択してctrl-Hで標準機能の置き換えをするしか今のところ対処はありません。*/
(function(me){
	//prototype登録
	String.prototype.trim = function(){
		if (this=="" ) return ""
		else return this.replace(/[\r\n]+$|^\s+|\s+$/g, "");
	}
	//ファイル名のみ取り出す（拡張子付き）
	String.prototype.getName = function(sepa){		if ( (sepa == null)||(sepa == null)){			sepa = "/";		}
		var r=this;var i=this.lastIndexOf(sepa);if(i>=0) r=this.substring(i+1);
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
		if(i>=0){return this.substring(0,i)+s;}else{return this + s; }
	}
	//文字の置換。（全ての一致した部分を置換）
	String.prototype.replaceAll=function(s,d){ return this.split(s).join(d);}

	FootageItem.prototype.nameTrue = function(){ var b=this.name;this.name=""; var ret=this.name;this.name=b;return ret;}
			// After Effectsが対応しているファイルの拡張子。小文字で記述のこと	var extList = [						//静止画					".ai",".psd",".eps",					 ".tga",".png",".tif",".bmp",".jpg",".exr",".gif",".cin",".pic",					 //ムービー					 ".mov", ".avi",".mpg",".mp4",".wma",".wmv",					 //音声					 ".aif",".mp3",".aac",".wav"					 ];
	//----------------------------------
	//このスクリプトの名前を獲得	var scriptName = File.decode($.fileName.getName().changeExt(""));
	//環境設定ファイル	var prefFile = new File($.fileName.changeExt(".pref"));
	//パスの区切りを設定	if ( $.os.indexOf("Windows")>=0){		var pathSepa = "\\";	}else{		var pathSepa = "/";	}	//-------------------------------------------------------------------------
	//獲得したリンク切れのフッテージアイテムをためる配列	var missingList = [];	//フォルダー選択ダイアログ用	var selectedFolder = new Folder;	//ファイル選択ダイアログ用	var selectedFile = new File;			var isRepFileNoReplace = true;	//*************************************************************************	if ( app.preferences.getPrefAsLong("Main Pref Section", "Pref_SCRIPTING_FILE_NETWORK_SECURITY") != 1){
		var s = "すみません。以下の設定がオフになっています。\r\n\r\n";
		s +=  "「環境設定：一般設定：\nスクリプトによるファイルへの書き込みとネットワークへのアクセスを許可」\r\n";
		s += "\r\n";
		s += "このスクリプト("+scriptName+")を使う為にはオンにする必要が有ります。\r\n";
		alert(s);
	}
	//*************************************************************************	// UI パネルの構築	//*************************************************************************
	//-------------------------------------------------------------------------
	//ウィンドウメニューで実行されていたらパネルモード。	//スクリプトから実行されていたらウィンドウモード。	//それを判別してUIオブジェクトを作成	var winObj = ( me instanceof Panel) ? me : new Window("palette", "findMissingFiles", [ 0, 0,  370,  475]  ,{resizeable:true, maximizeButton:true, minimizeButton:true});
	//-------------------------------------------------------------------------
	var btnGet = winObj.add("button", [  10,   10,   10+ 350,   10+  30], "失われたファイルをプロジェクトから獲得" );
	var listMissingFiles = winObj.add("listbox", [  10,   45,   10+ 350,   45+ 265], [] );
	var lbInfo = winObj.add("statictext", [  10,  315,   10+ 350,  315+  30], "リストをダブルクリックでフッテージを選択");
	var lbInfo2 = winObj.add("statictext", [  10,  345,   10+ 350,  345+  30], "レイヤ付きpsd/aiファイルはこのスクリプトでは置き換え出来ません！");
	var cbRepFileNoReplace = winObj.add("checkbox", [  10,  375,   10+ 350,  375+  30], "重複した名前のアイテムは置き換えない" );	var btnReplaceFile = winObj.add("button", [  10,  405,   10+ 350,  405+  30], "ファイルを置き換える" );
	var btnFindFiles = winObj.add("button", [  10,  435,   10+ 350,  435+  30], "ファイルをフォルダから探す" );
	//ボタンは初期では無効化しておく。	btnReplaceFile.enabled = false;
	btnFindFiles.enabled = false;
	cbRepFileNoReplace.value = isRepFileNoReplace;
	//-------------------------------------------------------------------------
	//UIパネルのリサイズ処理	var resize = function ()
	{
		var b = winObj.bounds;
		var w = b[2] - b[0];
		var h = b[3] - b[1];
		var b = btnGet.bounds;
		b[0] = 10;
		b[2] = w -10;		btnGet.bounds = b;
		var b = listMissingFiles.bounds;
		b[0] = 10;
		b[2] = w -10;
		b[1] = 45;
		b[3] = h - 165;
		listMissingFiles.bounds = b;
		
		var b = lbInfo.bounds;
		b[0] = 10;
		b[2] = w -10;		b[1] = h - 165;
		b[3] = b[1] + 30;
		lbInfo.bounds = b;
		var b = lbInfo2.bounds;
		b[0] = 10;
		b[2] = w -10;		b[1] = h - 135;
		b[3] = b[1] + 30;
		lbInfo2.bounds = b;
		var b = cbRepFileNoReplace.bounds;
		b[0] = 10;
		b[2] = w -10;
		b[1] = h - 105;
		b[3] = b[1] + 30;
		cbRepFileNoReplace.bounds = b;
		var b = btnReplaceFile.bounds;
		b[0] = 10;
		b[2] = w -10;		b[1] = h - 75;
		b[3] = b[1] + 30;
		btnReplaceFile.bounds = b;
		var b = btnFindFiles.bounds;
		b[0] = 10;
		b[2] = w -10;
		b[1] = h - 40;
		b[3] = b[1] + 30;
		btnFindFiles.bounds = b;
		
	}	//とりあえず一回実行
	resize();	//イベントを設定
	winObj.addEventListener("resize",resize);
	winObj.onResize = resize;
	//-------------------------------------------------------------------------	//ボタンの有効化を確認	var enabledChk = function()	{		var b = false;		if ( listMissingFiles.items.length>=0){			if (listMissingFiles.selection != null){				b =  (listMissingFiles.selection.index>=0);			}		}				btnReplaceFile.enabled = b;		btnFindFiles.enabled = (missingList.length>0);	}	enabledChk();	listMissingFiles.onClick = enabledChk;	//-------------------------------------------------------------------------	//フッテージが静止画・連番・ムービーか識別	/*		-1	: どれでもない		0	: 静止画		1	: 連番		2	: ムービー	*/	var getFootageType = function(ftg)	{		var ret = -1;		if (ftg instanceof FootageItem){			if ( ftg.mainSource.color === undefined){				if (ftg.mainSource.isStill === true){					ret = 0;				}else{					if ( (ftg.mainSource.nativeFrameRate === ftg.mainSource.conformFrameRate)&&(ftg.mainSource.nativeFrameRate === ftg.mainSource.displayFrameRate)){						ret = 1;					}else{						ret = 2;					}				} 			}		}		return ret;	}	//-------------------------------------------------------------------------	//プロジェクトからmissingフッテージを探してmissingList配列へ	var listupMissingFiles = function()	{		missingList = [];		if (app.project.numItems>0){			for ( var i=1; i<= app.project.numItems; i++){				var ftg = app.project.item(i);				if (ftg.footageMissing === true) {					ftg.footageType = getFootageType(ftg);					missingList.push(ftg);				}			}		}		//名前の重複を確認。		if (missingList.length>1){			for (var i=0; i<missingList.length; i++){				missingList[i].isRep = false;;			}			for (var i=0; i<missingList.length-1; i++){				if (missingList[i].isRep === true) continue;				for ( var k = i +1; k<missingList.length;k++){					//名前が同じ					if ( missingList[i].name === missingList[k].name){						//同じファイルならOKなので除外						if (missingList[i].file.fullName !== missingList[k].file.fullName) {							missingList[i].isRep = true;							missingList[k].isRep = true;						}					}				}			}		}	}
	//-------------------------------------------------------------------------	//missingList配列をリストボックスへ表示	var dispMissingFiles = function()	{		listMissingFiles.removeAll();		if (missingList.length>0){			listMissingFiles.visible = false;			for ( var i=0; i<missingList.length;i++){				if (missingList[i].footageMissing === true){					var s = "";					if (missingList[i].isRep===true) s +="!重複名! ";					s += missingList[i].name;					s += " <" + missingList[i].mainSource.missingFootagePath + ">";					listMissingFiles.add("item",s);				}			}			listMissingFiles.visible = true;		}	}	//-------------------------------------------------------------------------	//リストボックスをダブルクリックでそのフッテージを選択する処理	listMissingFiles.onDoubleClick = function()	{		if ( listMissingFiles.selection !== null){			var idx = listMissingFiles.selection.index;			for ( var i = app.project.numItems; i>=1; i--) {				if (app.project.item(i).selected===true) app.project.item(i).selected = false;				if (idx>=0){					missingList[idx].selected = true;				}			}		}	}	//-------------------------------------------------------------------------	//獲得ボタンのイベント
	btnGet.onClick = function()	{		listupMissingFiles();		dispMissingFiles();		enabledChk();	}
	//-------------------------------------------------------------------------	//指定したフォルダ内のファイルをリストアップして返す	//サブフォルダも含めて検索する。	var findTargetFiles = function(fld)	{		var ret = [];		if ( !( fld instanceof Folder)) return ret;		//-------------		var sub = function(d)		{			var files = d.getFiles();			if (files.length<=0) return;			var dd = [];			for (var i=0; i<files.length;i++){				if ( files[i] instanceof Folder){					dd.push(files[i]);				}else{					var e = files[i].name.getExt().toLowerCase();					//After Effects　が使えるファイルのみ					var bb = false;					for  ( var k =0; k<extList.length; k++){						if ( e === extList[k]) {							bb = true;							break;						}					}					if (bb)					{						ret.push(files[i]);					}				}			} 			if (dd.length>0){				for (var i=0; i<dd.length;i++){					sub(dd[i]);				}			}		}		//-------------		sub(fld);		return ret;	}	//-------------------------------------------------------------------------	//フッテージファイルを置き換える。	// idx : missingList配列のインデックス	// f : 置き換えるFileオブジェクト	// レイヤ付きphotoshop/aiは弾く。replaseが対応していないので。	var repFile = function(idx,f)	{		if ( (idx<0)||(idx>=missingList.length)) return;		if ( (isRepFileNoReplace === true)&&(missingList[idx].isRep === true)) return;		var fType = getFootageType(missingList[idx]);		if ( fType == 1){	//連番動画			missingList[idx].replaceWithSequence(f,false);		}else if ( fType == 2){　//ムービーファイル			missingList[idx].replace(f,);		}else{			var e = missingList[idx].file.fullName.getExt().toLowerCase();			//レイヤ付きphotoshopファイルは置き換えしない			var b =  ( ((e == ".psd")||(e == ".ai"))&&(missingList[idx].name.indexOf("/")>=0) );			if (!b){				missingList[idx].replace(f);			}		}	}	//-------------------------------------------------------------------------	// 指定したフォルダ内から探す。	var findAsFolder = function (fld)	{		if ( !( fld instanceof Folder)) return;		if (missingList.length<=0) return;				var files = findTargetFiles(fld);		if (files.length<=0) return;				for ( var i =0; i<missingList.length; i++){			if (missingList[i].footageMissing === true){				var nm = missingList[i].mainSource.missingFootagePath.getName(pathSepa);				for ( var j=0; j<files.length; j++){					if ( nm == File.decode( files[j].name)){						repFile(i,files[j]);						break;					}				}			}		}	}	//-------------------------------------------------------------------------	//置き換えダイアログ（ファイル）の表示	var replaceFileDialog = function()	{		var idx = -1;		if ( listMissingFiles.selection !== null){			idx = listMissingFiles.selection.index;		}		if ( idx<0) {			alert("置き換えるフッテージを選んで下さい。");			reruen;		}		var fType = getFootageType(missingList[idx]);		var ts = "";		switch ( fType )		{			case 0: ts = "静止画";break;			case 1: ts = "連番ファイル";break;			case 2: ts = "ムービーファイル";break;		}				if (selectedFile.exists ===false){			selectedFile = new File (Folder.myDocuments.fullName +"/" + missingList[idx].file.name);		}else{			selectedFile = new File(selectedFile.parent.fullName +"/" + missingList[idx].file.name);		}		var sfile  = selectedFile.openDlg(ts + " [ " + missingList[idx].file.name +" ]を選んでください", missingList[idx].file.name);		if (sfile == null)  return;		selectedFile = sfile;				app.beginUndoGroup("findMIssingFiles");		isRepFileNoReplace = cbRepFileNoReplace.value;		repFile(idx,sfile);		findAsFolder(sfile.parent);		listupMissingFiles();		dispMissingFiles();		enabledChk();		app.endUndoGroup();	}	btnReplaceFile.onClick = replaceFileDialog;
	//-------------------------------------------------------------------------	//置き換えダイアログ(フォルダ)の表示	var replaceFolderDialog = function()	{		if ( missingList.length<=0) {			alert("獲得ボタンを押してください。");			reruen;		}		if (selectedFolder.exists ===false){			selectedFile = Folder.myDocuments;		}		var sDir  = selectedFolder.selectDlg("フォルダを選択してください。");		if (sDir == null)  return;		selectedFolder = sDir;				app.beginUndoGroup("findMIssingFiles");		isRepFileNoReplace = cbRepFileNoReplace.value;		findAsFolder(sDir);		listupMissingFiles();		dispMissingFiles();		enabledChk();		app.endUndoGroup();	}	btnFindFiles.onClick = replaceFolderDialog;
	//-------------------------------------------------------------------------	//初期設定ファイルの読み込み	var prefLoad = function()	{		selectedFile = new File (Folder.myDocuments.fullName + "temp.jpg");		selectedFolder = Folder.myDocuments;		if (prefFile.exists === false ) {			return;		}		var prefStr = "";		prefFile.open("r");		try{			prefStr = prefFile.read();		}finally{			prefFile.close();		}		if (prefStr !== ""){			var pref = eval(prefStr);			if (pref !== null) {				if ( pref.selctedFilePath !== undefined) selectedFile = new File(pref.selctedFilePath);				if ( pref.selctedFolderPath !== undefined) selectedFolder = new Folder(pref.selctedFolderPath);			}		}	}	prefLoad();
	//-------------------------------------------------------------------------	//初期設定ファイルの書き込み	var prefSave = function()	{		var pref = {};		pref.selctedFilePath = selectedFile.fullName;		pref.selctedFolderPath = selectedFolder.fullName;				prefFile.open("w");		try{			prefFile.write(pref.toSource());		}finally{			prefFile.close();		}			}	//終了イベントに適応	winObj.onClose = prefSave;
	//-------------------------------------------------------------------------
	//パネルでなく通常スクリプトで実行されていたら、ウィンドウとして表示	if ( ( me instanceof Panel) == false){
		winObj.center(); 
		winObj.show();
	}
	//-------------------------------------------------------------------------
})(this);