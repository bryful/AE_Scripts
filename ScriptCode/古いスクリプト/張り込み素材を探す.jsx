(function (me)
{
	/////////////////////////////////////////////////////////////////////////////////////////////
	//各種変数
	var extList = new Array( ".png",".jpg",".tga",".psd",".tif",".pic",".*" );
	
	var targetFolder	= null; //File
	var targetExt		= 0;
	var fileList		= new Array;
	var fileListName	= new Array;
	
	var wordHis			= new Array;
	var prefFile		= new File("張り込み素材を探す.pref");
	var hisFile			= new File("張り込み素材を探す.his");

	var isChkDup		= false;	//修復登録を禁止するか

	var resultArray		= new Array;
	var importList		= new Array;
	
	///////////////////////////////////////////////////////////////////////////////////////////////
	function trim(s)
	{
		return s.replace(/(^\s+)|(\s+$)/g,"");
	}
	///////////////////////////////////////////////////////////////////////////////////////////////
	function selectedIndex(ctrl)
	{
		var ret = -1;
		if ( ctrl == null) return ret;
		if ( ctrl.items.length<=0)  return ret;
		for ( var i=0; i<ctrl.items.length; i++){
			if (ctrl.items[i].selected == true) {
				ret = i;
				break;
			}
		}
		return ret;
	}
	/////////////////////////////////////////////////////////////////////////////////////////////
	function getExt(s)
	{
		var ret = "";
		if (s == "") return ret;
		var idx = s.lastIndexOf(".");
		if ( idx>=0) {
			ret = s.substring(idx);
		}
		return ret;
	}
	/////////////////////////////////////////////////////////////////////////////////////////////
	function isTargetFile(f)
	{
		return  ( getExt(f.name).toLowerCase() == extList[targetExt]);
	}
	/////////////////////////////////////////////////////////////////////////////////////////////
	function listup()
	{
		var progD = new Window("palette", "", [  0,  0,   0+ 200,  0+ 50],{closeButton:false});
		var stMes = progD.add("statictext", [  10,   5,   10+ 180,    5+  15], "読み込み中");
		var prog = progD.add("progressbar", [  10,   20,  10+ 180,   20+  20],    0 ,  100);
		var cnt = 0;
		progD.center();
		progD.show();
		var cf = true;
		//----------
		function listupSub(f)
		{
			if ((f instanceof Folder)==false) return;
			var a = f.getFiles();
			var d = new Array;
			if (a.length>0) {
				for (var i=0; i<a.length; i++){
					prog.value = cnt;
					cnt++;
					if ( cnt>100) cnt =0;
					if ( a[i] instanceof File){
						if ( isTargetFile(a[i]) ==true) fileList.push(a[i]);
					}else if (a[i] instanceof Folder){
						d.push(a[i]);
					}
				}
			}
			if ( d.length>0){
				for ( var i = 0; i<d.length; i++){
					listupSub(d[i]);
				}
			}
		}
		//----------
		//検索テーブルを先に作成
		fileList = new Array;
		fileListName = new Array;
		if ( (targetFolder != null)&&(targetFolder.exists == true)) {
			listupSub(targetFolder);
			
			if ( fileList.length>0){
				prog.minValue = 0;
				prog.maxvalue = fileList.length;
				prog.value = 0;
				for ( var i=0; i<fileList.length; i++){
					prog.value = i;
					var s = File.decode(fileList[i].name).toLowerCase();
					fileListName.push(s);
				}
			}
			
		}
		progD.close();
	}
	/////////////////////////////////////////////////////////////////////////////////////////////
	function prefSave()
	{
		var flag = prefFile.open("w");
		if (flag == true)
		{
			try{
				var str = "";
				if (targetFolder == null) {
					str += "\r\n";
				}else{
					str += targetFolder.path + "/" + targetFolder.name + "\r\n";
				}
				str += targetExt +"\r\n";
				str += isChkDup.toString()+"\r\n";
				prefFile.write(str);
			}catch(e){
			}finally{
				prefFile.close();
			}
		}
	}
	/////////////////////////////////////////////////////////////////////////////////////////////
	function prefLoad()
	{
		var ret = false;
		if (prefFile.exists == false) return ret;
		var flag = prefFile.open("r");
		if (flag == true)
		{
			//行数固定のパラメータ確保
			//本当はこんなことしちゃいけない
			var s0 = "";
			var s1 = "";
			var s2 = "";
			try
			{
				if (prefFile.eof == false) s0 = prefFile.readln().replace(/[\r\n]+$/g, "");
				if (prefFile.eof == false) s1 = prefFile.readln().replace(/[\r\n]+$/g, "");
				if (prefFile.eof == false) s2 = prefFile.readln().replace(/[\r\n]+$/g, "");
				if ( s0 != "") {
					var f = new Folder(s0);
					if ( f.exists == true) {
						targetFolder = f;
						ret = true;
					}
				}
				if ( isNaN(s1)==false){
					var idx = s1 * 1;
					if ( (idx>=0)&&(idx <extList.length)) {
						targetExt = idx;
						// ret は変更しない
					}else{
						targetExt = 0;
					}
				}
				isChkDup = (s2 == "true");
			}catch(e){
				ret = false;
				return ret;
			}finally{
				prefFile.close();
			}
		}
		return ret;
	}
	/////////////////////////////////////////////////////////////////////////////////////////////
	//---------------
	var winObj = ( me instanceof Panel) ? me : new Window("palette", "張り込み素材検索", [ 132,  174,  132+ 553,  174+ 568]);
	
	var pnlDir = winObj.add("panel", [  12,   12,   12+ 528,   12+  80], "検索対象フォルダ");
	var stDir = pnlDir.add("statictext", [   8,   19,    8+ 503,   19+  18], "statictext_AE1");
	var btnReload = pnlDir.add("button", [   6,   41,    6+  75,   41+  23], "再読み込み");
	var statictext_AE6 = pnlDir.add("statictext", [  87,   46,   87+  68,   46+  18], "対象拡張子");
	var lstExt = pnlDir.add("dropdownlist", [ 161,   41,  161+  85,   41+  20], [".png",".jpg",".tga",".psd",".tif",".pic",".*" ]);
	var stInfo = pnlDir.add("statictext", [ 257,   44,  257+ 171,   44+  18], "対象なし");
	var btnSetDir = pnlDir.add("button", [ 447,   41,  447+  75,   41+  23], "設定");
	var statictext_AE2 = winObj.add("statictext", [  12,   98,   12+  53,   98+  12], "検索履歴");
	var lstHis = winObj.add("dropdownlist", [  13,  113,   13+ 427,  113+  20], [ ]);
	var statictext_AE3 = winObj.add("statictext", [  12,  144,   12+  57,  144+  12], "検索ワード");
	var edWord = winObj.add("edittext", [  14,  159,   14+ 427,  159+  19], "", {readonly:false, multiline:false});
	var btnFind = winObj.add("button", [ 447,  113,  447+  94,  113+  69], "検索開始");
	var statictext_AE4 = winObj.add("statictext", [  12,  186,   12+  53,  186+  12], "検索結果");
	
	var lbResultBase = winObj.add("listbox", [  12,  201,   12+ 528,  201+ 196], [ ]);
	var lbResult = winObj.add("listbox", [  12,  201,   12+ 528,  201+ 196], [ ]);
	
	var statictext_AE5 = winObj.add("statictext", [  18,  416,   18+  72,  416+  12], "取り込みリスト");
	var btnAdd = winObj.add("button", [ 446,  403,  446+  88,  403+  22], "追加");
	var lstImport = winObj.add("listbox", [  13,  431,   13+ 528,  431+  88], [ ]);
	var btnRemove = winObj.add("button", [  18,  525,   18+  88,  525+  27], "削除");

	if ( ( me instanceof Panel)==false){
		var btnClose = winObj.add("button", [ 353,  525,  353+  88,  525+  37], "閉じる");
	}
	var btnImport = winObj.add("button", [ 447,  525,  447+  88,  525+  37], "取り込み");
	var cbChkDup = winObj.add("checkbox", [ 335,  407,  335+ 105,  407+  16], "重複登録を禁止");

	/////////////////////////////////////////////////////////////////////////////////////////////
	//UIの初期化
	//------------------------
	stDir.text = "未設定";
	lstExt.removeAll();
	for ( var i = 0; i<extList.length; i++) lstExt.add("item",extList[i]);
	lstExt.items[targetExt].selected = true;
	edWord.enabled = false;
	btnFind.enabled = false;
	lbResult.removeAll();
	lbResultBase.visible = false;
	btnAdd.enabled = false;
	btnRemove.enabled = false;
	btnImport.enabled = false;
	cbChkDup.value = isChkDup;
	//------------------------
	cbChkDup.onChange = function(){
		isChkDup = cbChkDup.value;
	}
	/////////////////////////////////////////////////////////////////////////////////////////////
	function addHis(s)
	{
		var ss = trim(s);
		if ( ss == "" ) return;
		if ( lstHis.items.length<=0) {
			lstHis.add("item",ss);
			return;
		}
		var ssl = ss.toLowerCase();
		for ( var i=0; i<lstHis.items.length; i++){
			var s = lstHis.items[i].toString();
			if ( s.toLowerCase() == ssl) {
				return;
			}
		}
		var a = new Array;
		for ( var i = 0; i<lstHis.items.length; i++) {
			if ( lstHis.items[i] != null) {
				a.push(lstHis.items[i].toString());
			}
		}
		lstHis.removeAll();
		lstHis.add("item",ss);
		for ( var i = 0; i<a.length; i++) {
			if ( i>20) break;
			lstHis.add("item",a[i]);
		}
	}
	/////////////////////////////////////////////////////////////////////////////////////////////
	function hisSave()
	{
		var flag = hisFile.open("w");
		if (flag == true)
		{
			try{
				var str = "";
				if ( lstHis.items.length>0) {
					for ( var i=0; i<lstHis.items.length; i++){
						str += lstHis.items[i].toString() +"\r\n";
					}
				}
				hisFile.write(str);
			}catch(e){
			}finally{
				hisFile.close();
			}
		}
		
	}
	/////////////////////////////////////////////////////////////////////////////////////////////
	function hisLoad()
	{
		lstHis.removeAll();
		if (hisFile.exists == false) return;
		var flag = hisFile.open("r");
		if (flag == true)
		{
			try
			{
				while(hisFile.eof == false)
				{
					var line =  hisFile.readln().replace(/[\r\n]+$/g, "");
					line = trim(line);
					if ( line != "") {
						lstHis.add("item",line);
					}
				}
			}catch(e){
			}finally{
				hisFile.close();
			}
		}
	}
	hisLoad();
	/////////////////////////////////////////////////////////////////////////////////////////////
	function loadTargetFolder(f)
	{
		if ( f != null){
			targetFolder = f;
			listup();
			stDir.text = File.decode(targetFolder.path +"/" + targetFolder.name);
			if (fileList.length>0){
				stInfo.text = fileList.length + "個の対象在り(*" + extList[targetExt] +")";
				edWord.enabled = true;
			}else{
				stInfo.text = "対象なし(*" + extList[targetExt] +")";
				edWord.enabled = false;
				btnFind.enabled = false;
			}
			lbResult.removeAll();
		}
	}
	/////////////////////////////////////////////////////////////////////////////////////////////
	lstHis.onChange = function()
	{
		var idx = selectedIndex(lstHis);
		if ( idx>=0){
			edWord.text = lstHis.items[idx].toString();
			btnFind.enabled = (edWord.text != "");
		}
	}
	/////////////////////////////////////////////////////////////////////////////////////////////
	function resultChange()
	{
		var idx = selectedIndex(lbResult);
		btnAdd.enabled = (idx>=0);
	}
	/////////////////////////////////////////////////////////////////////////////////////////////
	function findExec(wd)
	{
		var w = trim(wd);
		if ( w == "") return;
		if ( (fileList == null)||(fileList.length<=0)) return;
		if ( (fileListName == null)||(fileListName.length<=0)) return;
		if ( fileList.length>fileListName.length) return;
		addHis(w);
		w = w.toLowerCase();
		resultArray = new Array;
		var cnt = fileListName.length;
		for (var i=0; i<cnt; i++){
			var idx = fileListName[i].indexOf(w);
			if ( idx>=0) resultArray.push(fileList[i]);
		}
		if ( resultArray.length>0) {
			var ary = new Array;
			for ( var i=0; i<resultArray.length; i++){
				ary.push(File.decode(resultArray[i].name));
			}
			lbResultBase.visible = true;
			winObj.remove(lbResult)
			lbResult = winObj.add("listbox", [  12,  201,   12+ 528,  201+ 196], ary);
			lbResult.onChange = resultChange;
			lbResultBase.visible = false;
		}else{
			lbResult.removeAll();
		}
	}
	/////////////////////////////////////////////////////////////////////////////////////////////
	btnFind.onClick = function()
	{
		findExec(edWord.text);
	}
	/////////////////////////////////////////////////////////////////////////////////////////////
	function toImportList()
	{
		lstImport.removeAll();
		btnRemove.enabled = false;

		if ( importList.length>0){
			importList.sort();
			for ( var i=0; i<importList.length; i++)
			{
				lstImport.add("item",File.decode(importList[i].name) );
			}
			btnImport.enabled = true;
		}else{
			btnImport.enabled = false;
		}
	}
	/////////////////////////////////////////////////////////////////////////////////////////////
	//--------------------------
	lstImport.onChange = function()
	{
		btnRemove.enabled = (selectedIndex(lstImport)>=0);
	}
	//--------------------------
	btnRemove.onClick = function()
	{
		var idx = selectedIndex(lstImport);
		if ( idx>=0){
			importList.splice(idx,1);
			toImportList();
		}else{
			btnRemove.enabled = false;
		}
	}
	//--------------------------
	btnAdd.onClick = function()
	{
		isChkDup = cbChkDup.value;
		var idx = selectedIndex(lbResult);
		if ( idx<0) return;
		var f = resultArray[idx];
		if ( (isChkDup==true)&&(importList.length>0)){
			for ( var i=0; i<importList.length; i++){
				if ( f.fsName == importList[i].fsName) return;
			}
		}
		importList.push(resultArray[idx]);
		
		toImportList();
	}
	//--------------------------
	btnSetDir.onClick =  function ()
	{
		loadTargetFolder(folderGetDialog("検索対象フォルダの設定"));
	}
	//--------------------------
	btnReload.onClick = function()
	{
		if ( (targetFolder == null)||(targetFolder.exists == false) ){
			btnSetDir.notify("onClick");
			return;
		}else{
			if (confirm("再読み込みしますか？")){
				loadTargetFolder(targetFolder);
			}
		}
	}
	//--------------------------
	var lstExtFlag = false;
	lstExt.onChange = function ()
	{
		if (lstExtFlag == true) return;
		var idx = selectedIndex(lstExt);
		if ((idx<0)||(idx>=extList.length)) return;
		if (targetExt != idx) {
			if ( (targetFolder != null)&&(targetFolder.exists == true) ){
				if (confirm("再読み込みしますか？")){
					targetExt = idx;
					loadTargetFolder(targetFolder);
				}else{
					lstExtFlag = true;
					lstExt.items[targetExt].selected = true;
					lstExtFlag = false;
				}
			}
		}
		
	}
	//--------------------------
	edWord.onChanging = function()
	{
		var s = trim(edWord.text);
		btnFind.enabled = ( s != "");
	}
	/////////////////////////////////////////////////////////////////////////////////////////////
	function importGo()
	{
		var err = false;
		function importSafeWithError(importOptions)
		{
			try { 
				app.project.importFile(importOptions);
			} catch (error) {
				err = true;
				alert(error.toString() + importOptions.file.fsName);
			}
		}
		function processFile(theFile)
		{
			try {
				var importOptions = new ImportOptions(theFile);
				importSafeWithError(importOptions);
			} catch (error) {
				err = true;
				// Ignore errors.
			}
		}

		if ((importList == null)||( importList.length<=0)) {
			importList = new Array;
			btnImport.enabled = false;
			return;
		}
		for ( var i=0; i<importList.length; i++) {
			processFile(importList[i]);
		}
		if ( err == false) {
			importList = new Array;
			toImportList();
		}
		prefSave();
		hisSave(); 
	}
	//-------------------------------------
	btnImport.onClick = function()
	{
		importGo();
	}
	/////////////////////////////////////////////////////////////////////////////////////////////
	winObj.onClose = function() 
	{
		prefSave();
		hisSave(); 
	}
	/////////////////////////////////////////////////////////////////////////////////////////////
	if (prefLoad() == true){
		loadTargetFolder(targetFolder);
		cbChkDup.value = isChkDup;
	}
	//-------------------------------------
	if ( ( me instanceof Panel) == false){
		btnClose.onClick = function() 
		{
			prefSave();
			hisSave(); 
			winObj.close()
		}
		winObj.center(); 
		winObj.show();
	}
	/////////////////////////////////////////////////////////////////////////////////////////////

})(this);

