(function (me)
{
	if ( app.preferences.getPrefAsLong("Main Pref Section", "Pref_SCRIPTING_FILE_NETWORK_SECURITY") != 1){
		var s = "すみません。以下の設定がオフになっています。\r\n\r\n";
		s +=  "「環境設定：一般設定：スクリプトによるファイルへの書き込みとネットワークへのアクセスを許可」\r\n";
		s += "\r\n";
		s += "このスクリプトを使う為にはオンにする必要が有ります。\r\n";
		alert(s);
		return;
	}
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

	var startFolder =Folder.current;	//起動時のpath。使ってない
	
	var current = startFolder;			//カレントパス。
	
	var folderList = new Array;			//カレントパスのフォルダ
	var fileList = new Array;			
	
	var selectedFFXIndex = -1;
	
	
	// デフォルトのパス。prefFileの情報が優先される。
	var defaultPath = new Array(
		"/c/Program%20Files/Adobe/Adobe%20After%20Effects%20CS4/Support%20Files/Presets"
	);
	var pathList = new Array;
	var prefPath = new File(getScriptPath() + "/" + getScriptName() + ".pref");

	///////////////////////////////////////////////////////////////////////////////////////
	function defPref()
	{
		pathList = new Array;
		if (defaultPath.length>0){
			for ( var i=0; i<defaultPath.length; i++){
				pathList.push(  new Folder(defaultPath[i]) );
			}
		}
	}
	///////////////////////////////////////////////////////////////////////////////////////
	function loadPref()
	{
		//ファイルがなかったらデフォルト処理
		if (prefPath.exists == false) {
			defPref();
			return;
		}
		var flag = prefPath.open("r");
		if (flag == true){
			try{
				var lines = new Array;
				//1行ずつ読み込む
				while(prefPath.eof == false){
					var s = prefPath.readln().replace(/[\r\n]+$/g, "");
					if ( s != ""){
						if ( (s[0]!=";")&&(s[0]!="#") ){
							lines.push(s);
						}
					}
				}
				prefPath.close();
				
				if ( lines.length>0) {
					//重複確認
					if (lines.length>1) {
						for ( var i = lines.length-1; i>=1; i--){
							var s = lines[i];
							for ( var j=0; j<i; j++){
								if ( lines[j] == s ){
									lines.splice(i,1);
									break;
								}
							}
						}
					}
					pathList = new Array;
					for ( var i=0; i<lines.length; i++){
						var ff = new Folder(lines[i]);
						if ( ff.exists == true) {
							pathList.push(ff);
						}
					}
				}else{
					defPref();
				}
			}catch(e){
				defPref();
				return;
			}
		}
	}
	loadPref();
	///////////////////////////////////////////////////////////////////////////////////////
	function savePref()
	{
		var flag = prefPath.open("w");
		if (flag == true)
		{
			var s = ";\n";
			if (pathList.length>0){
				for(var i=0; i<pathList.length; i++){
					s += pathList[i].path + "/" + pathList[i].name + "\n";
				}
			}
			try{
				prefPath.write(s);
				prefPath.close();
			}catch(e){
			}
		}
	}
	///////////////////////////////////////////////////////////////////////////////////////
	function selectedIndex(ctrl)
	{
		var idx = -1;
		if ( (ctrl == null)||(ctrl == undefined) ) return idx;
		var pCnt = ctrl.items.length;
		if ( pCnt>0){
			for ( var i=0; i<pCnt; i++){
				if ( ctrl.items[i].selected == true) {
					idx = i;
					break;
				}
			}
		}
		return idx;
	}
	///////////////////////////////////////////////////////////////////////////////////////
	function addPathList(f)
	{
		if ( pathList.length<=0) {
			pathList.push(f);
			return true;
		}
		for ( var i=0; i<pathList.length; i++){
			if ( pathList[i].fsName == f.fsName) {
				if (i==0) {
					return false;
				}
				pathList.splice(i,1);
				break;
			}
		}
		pathList.unshift(f);
		if (pathList.length>12){
			pathList.length = 12;
		}
		return true;
	}
	///////////////////////////////////////////////////////////////////////////////////////
	function removePathList(idx)
	{
		var ret = false;
		if ( pathList.length<=0) return ret;
		if ( (idx<0)||(idx>=pathList.length) ) {
			alert("removePathList: indexが不正");
			return ret;
		}
		var pp = pathList[idx].path + "/" + pathList[idx].name;
		if ( confirm("[ "+ pp+ " ]を削除しますか？") == true){
			pathList.splice(idx,1);
			ret = true;
		}
		return ret;
	}
	///////////////////////////////////////////////////////////////////////////////////////
	function getExt(s)
	{
		var ret = "";
		if ( s=="" ) return ret;
		var idx = s.lastIndexOf(".");
		if (idx>=0){
			ret = s.substring(idx);
		}
		return ret;
	}
	///////////////////////////////////////////////////////////////////////////////////////
	function pathInfo(f)
	{
		var ret = "";
		if ( f==null) return ret;
		var p = File.decode(f.path) + "/" + File.decode(f.name);
		var pp = p.split("/");
		var ppCount = pp.length - 1;
		
		ret = pp[ppCount];
		ppCount--;
		var idx = 3;
		while( (ppCount>=0)&&(idx>0)){
			ret =  pp[ppCount] + "/" + ret;
			ppCount--;
			idx--;
		}
		
		return ret;
	}
	///////////////////////////////////////////////////////////////////////////////////////
	function getFFX(p)
	{
		var ret = new Array;
		if (p == null) return ret;
		if ( (p instanceof Folder)==false) return ret;
		if ( p.exists == false) return ret;
		return  p.getFiles("*.ffx");
	}
	///////////////////////////////////////////////////////////////////////////////////////
	function getCurrentFolder(p)
	{
		folderList = new Array;
		fileList = new Array;
		if (p == null) return;
		if ( (p instanceof Folder)==false) return;
		if ( p.exists == false) return;
		
		var pp = getFFX(p);
		if ( pp.length>0) {
			folderList.push(p);
		}
		
		var lst = p.getFiles();
		if ( lst.length>0){
			for ( var i=0; i<lst.length; i++){
				if ( lst[i] instanceof Folder) {
					var pp = getFFX(lst[i]);
					if ( pp.length>0){
						folderList.push(lst[i]);
					}
				}
			}
		}
	}
	
	///////////////////////////////////////////////////////////////////////////////////////
	var winObj = ( me instanceof Panel) ? me : new Window("palette", "プリセットメニュー", [ 198,  261,  198+ 401,  261+ 381]);
	
	
	var cmbPath = winObj.add("dropdownlist", [  12,   12,   12+ 370,   12+  20], [ ]);
	var btnGetProsetFoler = winObj.add("button", [  12,   38,   12+  47,   38+  23], "追加");
	var btnDelete = winObj.add("button", [  65,   38,   65+  47,   38+  23], "削除");
	this.statictext_AE1 = winObj.add("statictext", [  12,   66,   12+  37,   66+  12], "Folder");
	this.statictext_AE2 = winObj.add("statictext", [ 150,   66,  150+  87,   66+  12], "FFX(Preset) file");
	var listbox_AE1 = winObj.add("listbox", [  12,   81,   12+ 134,   81+ 256], [ ]);
	var listbox_AE2 = winObj.add("listbox", [ 152,   81,  152+ 237,   81+ 256], [ ]);
	var btnOK = winObj.add("button", [ 152,  343,  152+ 237,  343+  26], "適応");

	///////////////////////////////////////////////////////////////////////////////////////
	btnOK.enabled = false;
	btnDelete.enabled = false;
	//---------------
	if ( ( me instanceof Panel) == false){
		winObj.center(); 
		winObj.show();
	}
	//---------------
	///////////////////////////////////////////////////////////////////////////////////////
	function getFolder(f)
	{
		current = f;
		getCurrentFolder(f);
		listbox_AE1.removeAll();
		listbox_AE1.enabled = false;
		listbox_AE2.removeAll();
		listbox_AE2.enabled = false;
		btnOK.enabled = false;
		if (folderList.length<=0) return;
		
		if ( folderList.length>0){
			for ( var i=0; i<folderList.length; i++){
				if ( f.fsName == folderList[i].fsName) {
					listbox_AE1.add("item","< このフォルダ >");
				}else{
					listbox_AE1.add("item",File.decode(folderList[i].name));
				}
			}
		}
		listbox_AE1.items[0].selected = true;
		listbox_AE1.enabled = true;
	}
	///////////////////////////////////////////////////////////////////////////////////////
	getFolder();
	///////////////////////////////////////////////////////////////////////////////////////
	function buildCmb()
	{
		cmbPath.removeAll();
		if ( pathList.length>0){
			for ( var i=0; i<pathList.length; i++){
				cmbPath.add("item",pathInfo(pathList[i]));
			}
		}
	}
	buildCmb();
	///////////////////////////////////////////////////////////////////////////////////////
	cmbPath.onChange = function(){
		var idx = selectedIndex(cmbPath);
		btnOK.enabled = false;
		btnDelete.enabled = (idx>=0);
		if ( idx<0) return;
		getFolder(pathList[idx]);
	}
	///////////////////////////////////////////////////////////////////////////////////////
	btnGetProsetFoler.onClick = function(){
		var cur = Folder.current;
		Folder.current = current;
		var f = Folder.selectDialog("プリセットフォルダの選択");
		if ( f != null ) {
		
			if ( addPathList(f) == true) {
				buildCmb();
				savePref();
			}
		}
		
		Folder.current = cur;
	}
	///////////////////////////////////////////////////////////////////////////////////////
	listbox_AE1.onChange = function()
	{
		listbox_AE2.removeAll();
		listbox_AE2.enabled = false;
		btnOK.enabled = false;
		selectedFFXIndex = -1;
		var idx = selectedIndex(listbox_AE1);
		if ( idx<0 ) return;
		if ( (folderList==null)||(folderList.length<=0)) return;
		
		fileList = getFFX(folderList[idx]);
		
		if ( fileList.length<=0) return;
		for ( var i=0; i<fileList.length; i++){
			listbox_AE2.add("item",File.decode(fileList[i].name));
		}
		listbox_AE2.enabled = true;
	}
	///////////////////////////////////////////////////////////////////////////////////////
	listbox_AE2.onChange = function()
	{
		var idx = selectedIndex(listbox_AE2);
		btnOK.enabled = ( idx>=0);
		selectedFFXIndex = idx;
	}
	///////////////////////////////////////////////////////////////////////////////////////
	btnOK.onClick = function()
	{
		var ac = app.project.activeItem;
		if ( ( ac instanceof CompItem)==false) {
			alert("CompItemをアクティブにしてください。");
			return;
		}
		if (ac.selectedLayers.length<=0) {
			alert("レイヤを選択してください。");
			return;
		}
		if (selectedFFXIndex<0){
			alert("プリセットを選択して下さい。");
			return;
		}
		var f = fileList[selectedFFXIndex];
		app.beginUndoGroup("apply " + f.name);
		var mes = "以下のレイヤに、[ " + File.decode(f.name) + " ]を適用しました。\n\n";
		for ( var i=0; i<ac.selectedLayers.length; i++){
			ac.selectedLayers[i].applyPreset(f);
			mes += ac.selectedLayers[i].name + "\n";
		}
		app.endUndoGroup();
		alert(mes);
	}
	///////////////////////////////////////////////////////////////////////////////////////
	btnDelete.onClick = function()
	{
		var idx = selectedIndex(cmbPath);
		if (removePathList(idx) == true){
			buildCmb();
			savePref();
		}

	}
	///////////////////////////////////////////////////////////////////////////////////////
})(this);
