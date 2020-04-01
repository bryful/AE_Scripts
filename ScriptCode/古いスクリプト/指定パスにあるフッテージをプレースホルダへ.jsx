(function(me){
	//-------------------------------------------------------------------------
	//prototype登録
	String.prototype.trim = function(){
		if (this=="" ) return ""
		else return this.replace(/[\r\n]+$|^\s+|\s+$/g, "");
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
		if(i>=0){return this.substring(0,i)+s;}else{return this + s; }
	}
	//文字の置換。（全ての一致した部分を置換）
	String.prototype.replaceAll=function(s,d){ return this.split(s).join(d);}
	
	Folder.prototype.childFile = function(nm){ return new File(this.fullName + "/" + nm);}
	Folder.prototype.childFolder = function(nm){ return new Folder(this.fullName + "/" + nm);}
	
	FootageItem.prototype.nameTrue =
	AVLayer.prototype.nameTrue = function()
	{
		var bak = this.name;
		this.name = "";
		var ret = this.name;
		this.name = bak;
		return ret;
	}
	//*************************************************************************
	FootageItem.prototype.isPsd = function()
	{
		if ( this.file == null) return false;
		var e = this.file.name.getExt().toLowerCase();
		return ((e==".psd")||(e==".ai"));
	}
	//-------------------------------------------------------------------------
	var scriptName = File.decode($.fileName.getName().changeExt(""));
	var prefFile = new File($.fileName.changeExt(".pref"));

	var nonePath = [];
	var selectedNonePath = "";
	//-------------------------------------------------------------------------
	function addNonePath(s)
	{
		if ( (s == null)||(s == "")) return false;
		var ss = Folder.decode(s);
		if ( nonePath.length>0) {
			for ( var i=0; i<nonePath.length; i++){
				if ( nonePath[i] == ss) return false;
			}
		}
		nonePath.push(ss);
		nonePath.sort();
		return true;
	}
	//-------------------------------------------------------------------------
	function isInList(f)
	{
		var ret = false;
		if (nonePath.length<=0) return ret;
		var p = Folder.decode(f.fullName);
		for ( var i=0; i<nonePath.length; i++)
		{
			if ( p.indexOf(nonePath[i])==0){
				ret = true;
				break;
			} 
		}
		return ret;
	}
	//-------------------------------------------------------------------------
	var winObj = ( me instanceof Panel) ? me : new Window("palette", "プレースホルダ", [ 797,  387,  797+ 317,  387+ 246]  ,{resizeable:true});
	//-------------------------------------------------------------------------
	var btnExec = winObj.add("button", [   8,    8,    8+ 296,    8+  24], "以下のパスにあるのフッテージをプレースホルダへ変更" );
	btnExec.graphics.font = ScriptUI.newFont("Tahoma",ScriptUI.FontStyle.REGULAR, 11);
	var stInfo = winObj.add("statictext", [   8,   40,    8+ 350,   40+  21], "変更後コメントにPathが保存されます。但しpsd/aiは変更しません");
	stInfo.graphics.font = ScriptUI.newFont("Tahoma",ScriptUI.FontStyle.REGULAR, 11);
	var btnAdd = winObj.add("button", [   8,   64,    8+  56,   64+  23], "追加" );
	btnAdd.graphics.font = ScriptUI.newFont("Tahoma",ScriptUI.FontStyle.REGULAR, 11);
	var btnDelete = winObj.add("button", [  70,   64,   70+  56,   64+  23], "削除" );
	btnDelete.graphics.font = ScriptUI.newFont("Tahoma",ScriptUI.FontStyle.REGULAR, 11);
	var nonePathList = winObj.add("listbox", [   8,   96,    8+ 296,   96+ 108], [] );
	nonePathList.graphics.font = ScriptUI.newFont("Tahoma",ScriptUI.FontStyle.REGULAR, 11);
	var btnReExec = winObj.add("button", [   8,  216,    8+ 296,  216+  24], "プレースホルダを元のPathへ設定" );
	btnReExec.graphics.font = ScriptUI.newFont("Tahoma",ScriptUI.FontStyle.REGULAR, 11);


	//-------------------------------------------------------------------------
	var nonePathListBak = winObj.add("listbox",nonePathList.boounds , [] );
	nonePathListBak.visible = false;
	nonePathListBak.enabled = false;
	
	winObj.text = scriptName;
	//-------------------------------------------------------------------------
	function enabledChk()
	{
		btnDelete.enabled = ((nonePathList.items.length>0)&&(nonePathList.selection != null)&&(nonePathList.selection.index>=0));
	}
	enabledChk();
	nonePathList.onChange = enabledChk;
	//-------------------------------------------------------------------------
	function refreshList()
	{
		nonePathListBak.bounds = nonePathList.bounds;
		nonePathListBak.visible = true;
		nonePathList.visible = false;
		winObj.remove(nonePathList);
		nonePath.sort();
		nonePathList = winObj.add("listbox",nonePathListBak.bounds , nonePath );
		nonePathList.onChange = enabledChk;
		nonePathList.visible = true;
		nonePathListBak.visible = false;
		enabledChk();
	}
	//-------------------------------------------------------------------------
	function addNonePathDialog()
	{
		var f = Folder.selectDialog("再配置対象外のフォルダを指定してください",selectedNonePath);
		if ( f != null){
			selectedNonePath = f.fullName;
			if (addNonePath(f.fullName) ==true){
				refreshList();
			}
		}
	}
	btnAdd.onClick = addNonePathDialog;
	//-------------------------------------------------------------------------
	function prefSave()
	{
		var o = new Object;
		
		o.nonePath = [].concat(nonePath);
		o.selectedNonePath = selectedNonePath;
		var str = o.toSource();
		if (prefFile.open("w")){
			try{
				prefFile.write(str);
			}catch(e){
			}finally{
				prefFile.close();
			}
		}
	}
	winObj.onClose = prefSave;
	//-------------------------------------------------------------------------
	function prefLoad()
	{
		if ( (prefFile ==null)||(prefFile.exists ==false)) return;
		var str ="";
		if (prefFile.open("r")){
			try{
				str = prefFile.read();
			}catch(e){
				return;
			}finally{
				prefFile.close();
			}
		}
		if ( str == "") return;
		var o = eval(str);
		if (o!=null){
			if (o.nonePath != undefined) { nonePath = [].concat(o.nonePath); }
			if (o.selectedNonePath != undefined) { selectedNonePath = o.selectedNonePath; }
			refreshList();
		}
	}
	prefLoad();
	//-------------------------------------------------------------------------
	function deleteNonePath()
	{
		if ( nonePath.length<=0) return;
		var idx = nonePathList.selection.index;
		if ( idx<0) return;
		nonePath.splice(idx,1);
		refreshList();
	}
	btnDelete.onClick = deleteNonePath;
	//-------------------------------------------------------------------------
	function resize()
	{
		var b = winObj.bounds;
		var w = b[2] - b[0];
		var h = b[3] - b[1];
		if ( w<100) w = 100;
		if ( h<150) h = 150;

		var b = btnExec.bounds;
		b[2] = w - 8;
		btnExec.bounds = b;

		var b = nonePathList.bounds;
		b[2] = w - 8;
		b[3] = h - 44;
		nonePathList.bounds = b;

		var b = btnReExec.bounds;
		b[2] = w - 8;
		b[1] = h - 32;
		b[3] = h - 8;
		btnReExec.bounds = b;
	}
	resize();
	winObj.addEventListener("resize",resize);
	winObj.onResize = resize;
	
	//-------------------------------------------------------------------------
	function isRenban(ftg)
	{
		//静止画は違う
		if (ftg.mainSource.isStill==true) return false;
		//拡張子で判別
		var e = ftg.name.getExt().toLowerCase();
		if ( (e==".mov")||(e==".qt")||(e==".avi")) {
			return false;
		}
		//一応念のため
		var nf = ftg.mainSource.nativeFrameRate;
		if ( (nf == ftg.mainSource.conformFrameRate)&&(nf == ftg.mainSource.displayFrameRate)){
			return true;
		}else{
			return false;
		}
	}
	//-------------------------------------------------------------------------
	function exec()
	{
		if ( app.project.numItems<=0) return;
		app.beginUndoGroup(scriptName+"Go");
		for ( var i=1; i<app.project.numItems; i++){
			var t = app.project.item(i);
			if ((t instanceof FootageItem)==false) continue;//フッテージ以外
			if (t.mainSource.color != undefined)  continue;//平面
			if (t.isPsd() == true) {
				continue;//レイヤ付きpsd
			}
			if ( isInList(t.file) == true)//リスト参照
			{
				var o = new Object;
				o.path = t.file.fullName;
				o.isRenban = isRenban(t);
				t.comment = o.toSource();
				var nm = t.file.name;
				t.replaceWithPlaceholder(nm, t.width,t.height,t.frameRate,t.duration);
			}
		}
		app.endUndoGroup();
	}
	btnExec.onClick = exec;
	//-------------------------------------------------------------------------
	function reExec()
	{
		if ( app.project.numItems<=0) return;
		app.beginUndoGroup(scriptName+"ReGo");
		for ( var i=1; i<app.project.numItems; i++){
			var t = app.project.item(i);
			if ((t instanceof FootageItem)==false) continue;//フッテージ以外
			if (t.mainSource.color != undefined)  continue;//平面
			if (t.isPsd() == true) continue;//レイヤ付きpsd
			
			if ( t.comment != ""){
				var o = eval(t.comment);
				if (o.path != undefined){
					var f = new File(o.path);
					if ( f.exists ==true){
						if ( o.isRenban == true){
							t.replaceWithSequence(f,false);
						}else{
							t.replace(f);
						}
					}
					if (t.file.exists == true){
						t.comment = "";
					}
				}
				
			}
		}
		app.endUndoGroup();
		
	}
	btnReExec.onClick = reExec;
	//-------------------------------------------------------------------------
	if ( ( me instanceof Panel) == false){
		winObj.center(); 
		winObj.show();
	}
	//-------------------------------------------------------------------------
})(this);