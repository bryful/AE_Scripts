
(function(me){
	//----------------------------------
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
	FootageItem.prototype.nameTrue = function(){ var b=this.name;this.name=""; var ret=this.name;this.name=b;return ret;}
	
	//移動はWindowsでしか使えない
	File.prototype.move = function(f){ return this.rename(f.fullName);}
	Folder.prototype.move = function(f){ return this.rename(f.fullName);}
	//----------------------------------
	var scriptName = File.decode($.fileName.getName().changeExt(""));
	var prefFile = new File($.fileName.changeExt(".pref"));
	var footages = [];

	//-------------------------------------------------------------------------
	var winObj = ( me instanceof Panel) ? me : new Window("palette", "規定フッテージへ差し替え", [ 822,  415,  822+ 267,  415+ 280]  ,{resizeable:true});
	//-------------------------------------------------------------------------
	var btnAdd = winObj.add("button", [   5,   12,    5+  48,   12+  23], "追加" );
	btnAdd.graphics.font = ScriptUI.newFont("Tahoma",ScriptUI.FontStyle.REGULAR, 11);
	var btnDelete = winObj.add("button", [  55,   12,   55+  48,   12+  23], "削除" );
	btnDelete.graphics.font = ScriptUI.newFont("Tahoma",ScriptUI.FontStyle.REGULAR, 11);
	var btnReplace = winObj.add("button", [ 129,   12,  129+  62,   12+  23], "置き換え" );
	btnReplace.graphics.font = ScriptUI.newFont("Tahoma",ScriptUI.FontStyle.REGULAR, 11);
	var btnImport = winObj.add("button", [ 194,   12,  194+  62,   12+  23], "読み込み" );
	btnImport.graphics.font = ScriptUI.newFont("Tahoma",ScriptUI.FontStyle.REGULAR, 11);
	var footageList = winObj.add("listbox", [   0,   41,    0+ 265,   41+ 238], [] );
	footageList.graphics.font = ScriptUI.newFont("Tahoma",ScriptUI.FontStyle.REGULAR, 11);



	var footageListBak = winObj.add("listbox",footageList.bounds , [] );
	footageListBak,visible = false;
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
	function enabledChk()
	{
		btnImport.enabled =
		btnReplace.enabled =
		btnDelete.enabled = ((footageList.items.length>0)&&(footageList.selection != null)&&(footageList.selection.index>=0));
	}
	enabledChk();
	footageList.onChange = enabledChk;
	//-------------------------------------------------------------------------
	function refreshList()
	{
		footageListBak.bounds = footageList.bounds;
		footageListBak.visible = true;
		footageList.visible = false;
		winObj.remove(footageList);
		
		var lst = [];
		if ( footages.length>0){
			for ( var i=0; i<footages.length; i++){
				var s = "\"" + footages[i].name +"\"";
				s += "   " + footages[i].fullName;
				lst.push(s);
			}
		}
		footageList = winObj.add("listbox",footageListBak.bounds , lst );
		footageList.onChange = enabledChk;
		footageList.visible = true;
		footageListBak.visible = false;
		enabledChk();
	}
	//-------------------------------------------------------------------------
	function addFootage(ftg)
	{
		var n = ftg.nameTrue();
		var e = n.getExt().toLowerCase();
		if ( (e==".psd")||(e==".ai")){
			if ( n.indexOf("/")>=0){
				alert("レイヤ付きは登録できません。");
				return false;
			}
		}
		var o = new Object;
		o.isRen = isRenban(ftg);
		o.fullName = ftg.file.fullName;
		o.name = ftg.name;
		if ( footages.length>0){
			for ( var i=0; i<footages.length; i++){
				if ( (footages[i].fullName == o.fullName)&&(footages[i].isRen == o.isRen)&&(footages[i].name == o.name)){
					return false;
				}
			}
			
		}
		footages.push(o);
		footages.sort();
		return true;
	}
	//-------------------------------------------------------------------------
	function addFootageList()
	{
		var ac = app.project.selection;
		var targets = [];
		if ( ac.length>0){
			for ( var i=0; i < ac.length; i++){
				if ( ( ac[i] !=null)&&(ac[i] instanceof FootageItem)&&( ac[i].mainSource.color == undefined)){
					targets.push(ac[i]);
				}
			}
		}
		if ( targets.length<=0){
			alert("追加したいフッテージを選択してください。");
			return;
		}
		for( var i=0; i<targets.length; i++) {
			if ( addFootage(targets[i])==false) break;
		}
		refreshList();
	}
	btnAdd.onClick = addFootageList;

	//-------------------------------------------------------------------------
	function deleteList()
	{
		if ( footages.length<=0) return;
		if ( footageList.selection == null) return;
		var idx = footageList.selection.index;
		if ( idx<0) return;
		footages.splice(idx,1);
		refreshList();
	}
	btnDelete.onClick = deleteList;
	//-------------------------------------------------------------------------
	function prefSave()
	{
		var o = new Object;
		
		o.footages = footages;
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
		if ((o!=null)&&(o.footages != undefined)&&(o.footages.length>0)){
			footages = [];
			for ( var i=0; i<o.footages.length; i++){
				var n = o.footages[i].fullName;
				var e = n.getExt().toLowerCase();
				if ( (e==".psd")||(e==".ai")){
					if ( n.indexOf("/")>=0){
						continue;
					}
				}

				var p = new Object;
				p.isRen = o.footages[i].isRen;
				p.name = o.footages[i].name;
				p.fullName = o.footages[i].fullName;
				var f = new File(p.fullName);
				if ( f.exists == true){
					footages.push(p);
				}
			}
			
			refreshList();
		}
	}
	prefLoad();	
	//-------------------------------------------------------------------------
	function importFootage()
	{
		if ( footages.length<=0) return;
		if ( footageList.selection == null) return;
		var idx = footageList.selection.index;
		if ( idx<0) return;
		
		var f = new File(footages[idx].fullName);
		if ( f.exists == false){
			alert("元ファイルがありません");
			return;
		}
		var io = new ImportOptions(f);
		io.sequence = footages[idx].isRen;
		var b = true;
		if ( io.canImportAs(ImportAsType.COMP) ==true) b= false;
		if ( b== false){
			alert("レイヤ付きのファイルのインポートには対応してません");
			return;
		}
		
		app.beginUndoGroup(scriptName + ":import");
		try{
			app.project.importFile(io);
		}catch(e){
			alert(e.toString());
		}
		app.endUndoGroup();
	}
	btnImport.onClick = importFootage;
	//-------------------------------------------------------------------------
	function rep()
	{
		if ( footages.length<=0) return;
		if ( footageList.selection == null) return;
		var idx = footageList.selection.index;
		if ( idx<0) return;
		var ac = app.project.activeItem;
		if ((ac instanceof FootageItem)==false){
			alert("フッテージを選んでください。");
			return;
		}
		var f = new File(footages[idx].fullName);
		if ( f.exists == false){
			alert("元ファイルがありません");
			return;
		}
		app.beginUndoGroup(scriptName + ":rep");
		if ( footages[idx].isRen == true){
			ac.replaceWithSequence(f,false);
		}else{
			ac.replace(f);
		}
		ac.name = "";
		ac.selected = false;
		ac.selected = true;
		app.endUndoGroup();
	}
	btnReplace.onClick = rep;
	
	//-------------------------------------------------------------------------
	function resize()
	{
		var b = winObj.bounds;
		var w = b[2] - b[0];
		var h = b[3] - b[1];
				
		var b = footageList.bounds;
		b[0] = 0;
		b[2] = w;
		b[3] = h;
		footageList.bounds = b;
	}
	resize();
	winObj.addEventListener("resize",resize);
	winObj.onResize = resize;
	//-------------------------------------------------------------------------
	if ( ( me instanceof Panel) == false){
		winObj.center(); 
		winObj.show();
	}
	//-------------------------------------------------------------------------
})(this);