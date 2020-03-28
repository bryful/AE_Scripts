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
	
	//移動はWindowsでしか使えない
	File.prototype.move = function(f){ return this.rename(f.fullName);}
	Folder.prototype.move = function(f){ return this.rename(f.fullName);}
	
	FootageItem.prototype.nameTrue = function(){ var b=this.name;this.name=""; var ret=this.name;this.name=b;return ret;}
	//----------------------------------
	var scriptName = File.decode($.fileName.getName().changeExt(""));
	var prefFile = new File($.fileName.changeExt(".pref"));
	//-------------------------------------------------------------------------
	var footages = [];


	var afxw_path = "";
	//-------------------------------------------------------------------------
	var winObj = ( me instanceof Panel) ? me : new Window("palette", scriptName, [ 670,  354,  670+ 571,  354+ 402]  ,{resizeable:true});
	//-------------------------------------------------------------------------
	var btnGet = winObj.add("button", [   6,    3,    6+  75,    3+  23], "獲得" );
	btnGet.graphics.font = ScriptUI.newFont("Tahoma",ScriptUI.FontStyle.REGULAR, 11);
	var stName = winObj.add("statictext", [   3,   94,    3+ 561,   94+  17], "選択されたフッテージ名");
	stName.graphics.font = ScriptUI.newFont("ＭＳ ゴシック",ScriptUI.FontStyle.REGULAR, 16);
	var cbInFolder = winObj.add("checkbox", [  93,    8,   93+ 376,    8+  17], "プロジェクトフォルダ以外から使われているフッテージのみ表示");
	cbInFolder.value = true;
	cbInFolder.graphics.font = ScriptUI.newFont("Tahoma",ScriptUI.FontStyle.REGULAR, 11);
	var st0 = winObj.add("statictext", [   3,   28,    3+ 201,   28+  14], "フッテージファイルのパス ");
	st0.graphics.font = ScriptUI.newFont("Tahoma",ScriptUI.FontStyle.REGULAR, 11);
	var edFullPath = winObj.add("edittext", [   1,   45,    1+ 563,   45+  46], "", { multiline:true, scrollable:true });
	edFullPath.graphics.font = ScriptUI.newFont("ＭＳ ゴシック",ScriptUI.FontStyle.REGULAR, 16);
	var edInfo = winObj.add("edittext", [   1,  115,    1+ 563,  115+  37], "", { multiline:true, scrollable:true });
	edInfo.graphics.font = ScriptUI.newFont("ＭＳ ゴシック",ScriptUI.FontStyle.REGULAR, 16);
	var footageList = winObj.add("listbox", [   1,  159,    1+ 434,  159+ 212], [] );
	footageList.graphics.font = ScriptUI.newFont("ＭＳ ゴシック",ScriptUI.FontStyle.REGULAR, 16);
	var pnlExec = winObj.add("panel", [ 441,  158,  441+ 123,  158+ 145], "execute" );
	pnlExec.graphics.font = ScriptUI.newFont("Tahoma",ScriptUI.FontStyle.REGULAR, 11);
	var btnSelected = pnlExec.add("button", [   6,   10,    6+ 108,   10+  24], "選択する" );
	btnSelected.graphics.font = ScriptUI.newFont("Tahoma",ScriptUI.FontStyle.REGULAR, 11);
	var btnOpenFolder = pnlExec.add("button", [   6,   40,    6+ 108,   40+  24], "フォルダを開く" );
	btnOpenFolder.graphics.font = ScriptUI.newFont("Tahoma",ScriptUI.FontStyle.REGULAR, 11);
	var btnOpenAFXW = pnlExec.add("button", [   6,   70,    6+ 108,   70+  24], "あふwで開く" );
	btnOpenAFXW.graphics.font = ScriptUI.newFont("Tahoma",ScriptUI.FontStyle.REGULAR, 11);
	var btnCopy = pnlExec.add("button", [   6,  100,    6+ 108,  100+  24], "ProjFolderへコピー" );
	btnCopy.graphics.font = ScriptUI.newFont("Tahoma",ScriptUI.FontStyle.REGULAR, 11);
	var pnlRep = winObj.add("panel", [ 441,  309,  441+ 123,  309+  87], "replace" );
	pnlRep.graphics.font = ScriptUI.newFont("Tahoma",ScriptUI.FontStyle.REGULAR, 11);
	var btnReplace = pnlRep.add("button", [   7,    7,    7+ 108,    7+  24], "置き換え" );
	btnReplace.graphics.font = ScriptUI.newFont("Tahoma",ScriptUI.FontStyle.REGULAR, 11);
	var rbStill = pnlRep.add("radiobutton", [  14,   34,   14+  96,   34+  17], "静止画/ムービー");
	rbStill.graphics.font = ScriptUI.newFont("Tahoma",ScriptUI.FontStyle.REGULAR, 11);
	var rbSeq = pnlRep.add("radiobutton", [  14,   52,   14+  96,   52+  17], "連番ファイル");
	rbSeq.value = true;
	rbSeq.graphics.font = ScriptUI.newFont("Tahoma",ScriptUI.FontStyle.REGULAR, 11);
	var progBar1 = winObj.add("progressbar", [   1,  376,    1+ 434,  376+  16],    0 ,   0,  100 );


	var footageListBak = winObj.add("listbox",footageList.bounds , [] );
	footageListBak.visible = false;
	//-------------------------------------------------------------------------
	function selectedIndex()
	{
		var ret = -1;
		if ( footages.length<=0) return ret;
		if ( footageList.items.length<=0) return ret;
		if ( footageList.selection == null) return ret;
		return footageList.selection.index;
	}
	//-------------------------------------------------------------------------
	function enabledSet(b)
	{
		if ( b != pnlExec.enabled)
		{
			pnlExec.enabled =
			pnlRep.enabled = 
			btnSelected.enabled =
			btnOpenFolder.enabled =
			btnOpenAFXW.enabled =
			btnReplace.enabled = b;
		}
	}
	enabledSet(false);
	//-------------------------------------------------------------------------
	function enabledChk()
	{
		var idx = selectedIndex();
		enabledSet( ( idx>=0) );
	}
	enabledChk();
	//-------------------------------------------------------------------------
	//フッテージのフォルダ構成(プロジェクトウィンドウ)を配列で返す
	function getFolderItemPath(ftg)
	{
		var ret = [];
		var rid = app.project.rootFolder.id;
		var p = ftg;
		while(p != null)
		{
			p = p.parentFolder;
			if (( p.id == rid)||(p==null)) break;
			ret.push(p.name+"");
			
		}
		ret.reverse();
		return ret;
	}
	//-------------------------------------------------------------------------
	function getInfo()
	{
		edInfo.text = "";
		edFullPath.text = "";
		stName.text = "";
		
		var idx = selectedIndex();
		if ( idx<0) return;
		var f = footages[idx];
		
		var fn = f.file.fullName;
		if ( f.useProxy)
			fn += "\n    Proxy=" + f.proxySource.file.fullName;
		edFullPath.text = fn;
		
		var fn = f.name;
		var tfn = f.nameTrue(); 
		if ( fn != tfn) fn += " ("+tfn+")";
		stName.text = fn;
		
		var str = "";
		str = getFolderItemPath(f).toString().split(",").join("/");
		
		edInfo.text = str;
		enabledChk();
		
	}
	footageList.onChange = getInfo;
	//-------------------------------------------------------------------------
	btnOpenFolder.onClick = function()
	{
		var idx = selectedIndex();
		if ( idx<0) return;
		var f = footages[idx];
		if (footages[idx].mainSource.isStill == true){
			f.file.parent.execute();
		}else{
			f.file.parent.parent.execute();
		}
	}
	//-------------------------------------------------------------------------
	btnOpenAFXW.onClick = function()
	{
		var af = new File(afxw_path);
		if ( (af == null)||(af.exists == false)){
			af = null;
			af = File.openDialog("あふｗ(AFXW.EXE)を選択してください。");
			if ( af != null){
				if ( af.name =="AFXW.EXE"){
					afxw_path = af.fullName;
				}else{
					alert(af.fullName +"は、あふwじゃないっぽいです");
				}
			}else{
				return;
			}
		}
		var idx = selectedIndex();
		if ( idx<0) return;
		var f = footages[idx];
		
		var str = "";
		str += "\"" + af.fsName + "\" -s";
		if ( app.project.file != null){
			str += " -L\""+ app.project.file.fsName + "\"";
		}
		if (footages[idx].mainSource.isStill == true){
			str += " -R\""+ f.file.fsName + "\"";
		}else{
			str += " -R\""+ f.file.parent.fsName + "\"";
		}
		system.callSystem(str);
		
	}
	//-------------------------------------------------------------------------
	//ファイルコピーの基本関数。
	function copySrc(s,fld)
	{
		var dst = new File(fld.fullName + "/" +s.name);
		return s.copy(dst);
	}
	//-------------------------------------------------------------------------
	//フッテージからフレーム番号を除いた名前を得る
	function splitFrameNumber(s,op)
	{
		if (s =="") return "";
		var ss = s.changeExt("");
		if (ss =="") return "";
		
		var idx = -1;
		for ( var i= ss.length-1;i>=0; i--){
			var c = ss[i];
			if ( (c<"0")||(c>"9")){
				idx = i;
				break;
			}
		}
		//AAA_0001
		//01234567
		if (idx > -1){
			ss = ss.substr(0,idx+1);
			if ((op==true)&&( ss.length>1)){
				var c = ss[ss.length-1];
				if ( (c=="_")||(c=="-")) ss = ss.substr(0,ss.length-1);
				ss = ss.trim();
			}
		}
		
		return ss;
	}
	//-------------------------------------------------------------------------
	function copyToProj()
	{
		var projFld = null;
		if ( app.project.file == null){
			alert("プロジェクトが保存されていません。");
			return;
		}else{
			projFld = app.project.file.parent;
		}
		var idx = selectedIndex();
		if ( idx<0) return;
		var f = footages[idx];
		var ret = "";
		if ( f.mainSource.isStill == true){
			if ( copySrc(f.file, projFld) ==true){
				ret = File.decode(f.file.name) +"をコピーしました。"
			}else{
				ret = File.decode(f.file.name) +"をコピー失敗しました！"
			}
		}else{
			var targetName = splitFrameNumber(f.file.name,false) + "*" + f.file.name.getExt();
			var files = f.file.parent.getFiles(targetName);
			if ((files == null)||( files.length<=0)){
				ret = f.file.name +"がありません！"
			}else{
				var dstFld = new Folder(projFld.fullName + "/" + files[0].parent.name);
				if (dstFld.exists == false) dstFld.create();
				progBar1.value = 0;
				progBar1.maxvalue = files.length-1;
				var cnt = 0;
				for ( var i=0; i<files.length; i++)
				{
					winObj.update();
					progBar1.value = i;
					
					if ( copySrc(files[i],dstFld)==false){
						ret = "コピーに失敗しました！ files\n\n" + File.decode(files[i].fullName);
						break;
					}else{
						cnt++;
					}
				}
				if ( ret =="") ret = "[" + targetName + "]を"+cnt+"個、コピーしました";
				progBar1.value = 0;
			}
		}
		alert(ret);
		
	}
	btnCopy.onClick = copyToProj;
	//-------------------------------------------------------------------------
	//-------------------------------------------------------------------------
	function rep()
	{
		var idx = selectedIndex();
		if ( idx<0) return;
		var f = footages[idx];
		var nm = f.nameTrue().toLowerCase();
		var e = nm.getExt();
		if ( (nm.indexOf("/")>=0)&& ( (e == ".psd")||(e == ".ai"))){
			alert("レイヤ付きフッテージの差し替えには注意！");
		}
		var isRen = ( rbSeq.value == true);
		
		var newFtg = File.openDialog("[" + f.name + "]を置き換え");
		if (newFtg != null){
			
			var io = new ImportOptions(newFtg);
			var b = true;
			if ( io.canImportAs(ImportAsType.COMP)==true) b = false;
			else if ( io.canImportAs(ImportAsType.COMP_CROPPED_LAYERS)==true) b = false;
			if ( b==false){
				alert("すみません。このスクリプトでは、レイヤ付きファイルの置き換えはできません！");
				return;
			}
			
			
			if ( isRen == true){
				f.replaceWithSequence(newFtg,false);
				f.name = "";
			}else{
				f.replace(newFtg);
				f.name = "";
			}
			f.selected = false;
			f.selected = true;
			//getInfo();
			exec();
			enabledChk();
			
		}else{
			alert("cancel");
		}
	}
	btnReplace.onClick = rep;
	//-------------------------------------------------------------------------
	function exec()
	{
		
		edInfo.text = "";
		footages = [];
		footageList.removeAll();
		
		var isInFoler = cbInFolder.value;
		var projPath = "";
		if ( app.project.file == null){
			isInFoler = false;
		}else{
			projPath = app.project.file.parent.fullName;
		}
		if ( app.project.numItems>0){
			for ( var i=1; i<=app.project.numItems; i++){
				var t = app.project.item(i);
				if ( (t instanceof FootageItem)==false) continue;
				if (t.mainSource.color != undefined ) continue;
				var b = true;
				if (( isInFoler == true)&&( t.footageMissing ==false)){
					//alert(t.file.fullName);
					if ( t.file.fullName.indexOf( projPath )>=0) b = false;
				}
				if ( b==true) footages.push(t);
			}
		}
		if (footages.length>0){
			var lst = [];
			for ( var i=0; i<footages.length; i++){
				var s = "";
				if ( footages[i].footageMissing==true) s ="！"; else s ="　";
				s += footages[i].name;
				lst.push(s);
			}
			footageListBak.bounds =footageList.bounds;
			footageListBak.visible = true;
			footageList.visible = false;
			winObj.remove(footageList);
			footageList = winObj.add("listbox",footageListBak.bounds , lst );
			footageList.onChange = getInfo;
			footageList.visible = true;
			footageListBak.visible = false;
		}
	}
	exec();
	btnGet.onClick = exec;
	cbInFolder.onClick = exec;
	//-------------------------------------------------------------------------
	function setelctFootage()
	{
		var idx = selectedIndex();
		if ( idx<0) return;
		var f = footages[idx];
		f.selected = false;
		f.selected = true;
		
		
	}
	btnSelected.onClick = setelctFootage;
	//-------------------------------------------------------------------------
	function resize()
	{
		var b = winObj.bounds;
		var w = b[2] - b[0];
		var h = b[3] - b[1];
		if (w<150) w = 150;
		if (h<150) h = 150;
		var w2 = w -130;

		var b = edFullPath.bounds;
		b[0] = 4;
		b[2] = w-4;
		edFullPath.bounds = b;

		var b = stName.bounds;
		b[0] = 4;
		b[2] = w;
		stName.bounds = b;

		var b = edInfo.bounds;
		b[0] = 4;
		b[2] = w-4;
		edInfo.bounds = b;

		var b = footageList.bounds;
		b[0] = 4;
		b[2] = w2
		b[3] = h -30;
		footageList.bounds = b;

		var b = progBar1.bounds;
		b[0] = 4;
		b[2] = w2-4;
		b[1] = h - 24;
		b[3] = h - 8;
		progBar1.bounds = b;

		var b = pnlExec.bounds;
		b[0] = w2 + 1;
		b[2] = b[0] + 123;
		pnlExec.bounds = b;

		var b = pnlRep.bounds;
		b[0] = w2 + 1;
		b[2] = b[0] + 123;
		pnlRep.bounds = b;

	}
	resize();
	winObj.addEventListener("resize",resize);
	winObj.onResize = resize;
	//-------------------------------------------------------------------------
	function prefSave()
	{
		var o = new Object;
		
		o.afxw_path = afxw_path;
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
			if (o.afxw_path != undefined) { afxw_path = o.afxw_path; }
		}
	}
	prefLoad();
		//-------------------------------------------------------------------------
	if ( ( me instanceof Panel) == false){
		winObj.center(); 
		winObj.show();
	}
	//-------------------------------------------------------------------------
})(this);