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
	
	//----------------------------------
	var scriptName = File.decode($.fileName.getName().changeExt(""));
	var prefFile = new File($.fileName.changeExt(".pref"));


	var selectedFolder = "";
	//-------------------------------------------------------------------------
	var winObj = ( me instanceof Panel) ? me : new Window("palette", "レンダーキューへ登録", [ 850,  327,  850+ 212,  327+ 366]  ,{resizeable:true});
	//-------------------------------------------------------------------------
	var btnGetTemplates = winObj.add("button", [  12,    6,   12+ 194,    6+  29], "テンプレートを獲得" );
	btnGetTemplates.graphics.font = ScriptUI.newFont("Tahoma",ScriptUI.FontStyle.REGULAR, 11);
	var pnlTemp = winObj.add("panel", [  12,   39,   12+ 190,   39+ 100], "テンプレート" );
	pnlTemp.graphics.font = ScriptUI.newFont("Tahoma",ScriptUI.FontStyle.REGULAR, 11);
	var stPS = pnlTemp.add("statictext", [  13,    6,   13+ 100,    6+  14], "レンダリング設定");
	stPS.graphics.font = ScriptUI.newFont("Tahoma",ScriptUI.FontStyle.REGULAR, 11);
	var lstRS = pnlTemp.add("dropdownlist", [  10,   22,   10+ 173,   22+  21], [ ]);
	lstRS.graphics.font = ScriptUI.newFont("Tahoma",ScriptUI.FontStyle.REGULAR, 11);
	var stOM = pnlTemp.add("statictext", [  13,   44,   13+ 100,   44+  14], "出力モジュール");
	stOM.graphics.font = ScriptUI.newFont("Tahoma",ScriptUI.FontStyle.REGULAR, 11);
	var lstOM = pnlTemp.add("dropdownlist", [  10,   60,   10+ 173,   60+  21], [ ]);
	lstOM.graphics.font = ScriptUI.newFont("Tahoma",ScriptUI.FontStyle.REGULAR, 11);
	var pnlFolder = winObj.add("panel", [  12,  145,   12+ 190,  145+ 160], "書き出し場所" );
	pnlFolder.graphics.font = ScriptUI.newFont("Tahoma",ScriptUI.FontStyle.REGULAR, 11);
	var rbNone = pnlFolder.add("radiobutton", [   8,   12,    8+ 133,   12+  16], "指定しない");
	rbNone.graphics.font = ScriptUI.newFont("Tahoma",ScriptUI.FontStyle.REGULAR, 11);
	var rbToProjFolder = pnlFolder.add("radiobutton", [   8,   34,    8+ 133,   34+  16], "プロジェクトフォルダの");
	rbToProjFolder.value = true;
	rbToProjFolder.graphics.font = ScriptUI.newFont("Tahoma",ScriptUI.FontStyle.REGULAR, 11);
	var edProj = pnlFolder.add("edittext", [  23,   52,   23+ 118,   52+  21], "(Pre-Render)");
	edProj.graphics.font = ScriptUI.newFont("Tahoma",ScriptUI.FontStyle.REGULAR, 11);
	var stToProjFolder = pnlFolder.add("statictext", [ 147,   55,  147+  20,   55+  15], "へ");
	stToProjFolder.graphics.font = ScriptUI.newFont("Tahoma",ScriptUI.FontStyle.REGULAR, 11);
	var rbSelectFolder = pnlFolder.add("radiobutton", [   8,   79,    8+  87,   79+  16], "場所を指定");
	rbSelectFolder.graphics.font = ScriptUI.newFont("Tahoma",ScriptUI.FontStyle.REGULAR, 11);
	var btnSelectFolder = pnlFolder.add("button", [ 101,   79,  101+  75,   79+  20], "場所を指定" );
	btnSelectFolder.graphics.font = ScriptUI.newFont("Tahoma",ScriptUI.FontStyle.REGULAR, 11);
	var stSelectFolder = pnlFolder.add("statictext", [   5,  102,    5+ 178,  102+  16], "Select Folder");
	stSelectFolder.graphics.font = ScriptUI.newFont("Tahoma",ScriptUI.FontStyle.REGULAR, 11);
	var cbFolderChk = pnlFolder.add("checkbox", [   8,  129,    8+ 176,  129+  17], "連番では同じフォルダは作らない");
	cbFolderChk.graphics.font = ScriptUI.newFont("Tahoma",ScriptUI.FontStyle.REGULAR, 11);
	var cbOnly = winObj.add("checkbox", [  23,  311,   23+ 165,  311+  17], "他のRQは無効化する");
	cbOnly.graphics.font = ScriptUI.newFont("Tahoma",ScriptUI.FontStyle.REGULAR, 11);
	var btnAdd = winObj.add("button", [   9,  330,    9+ 197,  330+  31], "レンダーキューへ登録" );
	btnAdd.graphics.font = ScriptUI.newFont("Tahoma",ScriptUI.FontStyle.REGULAR, 11);

	//-------------------------------------------------------------------------
	stSelectFolder.text = "";
	//-------------------------------------------------------------------------
	function getTemplate()
	{
		var _ps = [];
		var _om = [];
		if ( app.project.renderQueue.numItems<=0){
			var tempComp = app.project.items.addComp("_temp_",100,100,1,1,24);
			var rq = app.project.renderQueue.items.add(tempComp);
			_ps = rq.templates;
			_om = rq.outputModules[1].templates;
			tempComp.remove();
		}else{
			var rq = app.project.renderQueue.item(1);
			_ps = rq.templates;
			_om = rq.outputModules[1].templates;
		}
		var ps = [];
		var om = [];
		lstRS.removeAll();
		lstOM.removeAll();
		for ( var i=0; i<_ps.length; i++)
			if ( _ps[i].indexOf("_HIDDEN")<0) lstRS.add("item",_ps[i]);
		for ( var i=0; i<_om.length; i++)
			if ( _om[i].indexOf("_HIDDEN")<0) lstOM.add("item",_om[i]);
	}
	btnGetTemplates.onClick = getTemplate;
	getTemplate();
	//-------------------------------------------------------------------------
	function setList(lst,s)
	{
		if ( lst.items.length<=0) return;
		for ( var i=0; i<lst.items.length; i++)
		{
			if ( lst.items[i].text == s) {
				lst.items[i].selected = true;
				break;
			}
		}
	}
	//-------------------------------------------------------------------------
	function enabledChk()
	{
		if ( rbNone.value == true){
			edProj.enabled = false;
			cbFolderChk.enabled = false;
			btnSelectFolder.enabled = false;
			stSelectFolder.enabled = false;
			
		}else if ( rbToProjFolder.value == true){
			edProj.enabled = true;
			cbFolderChk.enabled = true;
			btnSelectFolder.enabled = false;
			stSelectFolder.enabled = false;
		}else{
			edProj.enabled = false;
			cbFolderChk.enabled = true;
			btnSelectFolder.enabled = true;
			stSelectFolder.enabled = true;
		}
	}
	//-------------------------------------------------------------------------
	rbNone.onClick = function()
	{
		rbNone.value = true;
		rbToProjFolder.value = false;
		rbSelectFolder.value = false;
		enabledChk();
	}
	rbToProjFolder.onClick = function()
	{
		rbNone.value = false;
		rbToProjFolder.value = true;
		rbSelectFolder.value = false;
		enabledChk();
	}
	rbSelectFolder.onClick = function()
	{
		rbNone.value = false;
		rbToProjFolder.value = false;
		rbSelectFolder.value = true;
		enabledChk();
	}
	rbNone.value = true;
	rbToProjFolder.value = false;
	rbSelectFolder.value = false;
	enabledChk();
	//-------------------------------------------------------------------------
	function prefSave()
	{
		var o = new Object;
		o.rs = "";
		if ( lstRS.selection != null){
			o.rs = lstRS.selection.text;
		}
		o.om = "";
		if ( lstOM.selection != null){
			o.om = lstOM.selection.text;
		}
		o.folder = 0;
		if (rbNone.value == true) o.folder = 0;
		else if (rbToProjFolder.value == true) o.folder = 1;
		else if (rbSelectFolder.value == true) o.folder = 2;
		o.folderName = edProj.text;
		o.selectFolder = stSelectFolder.text;
		o.only = cbOnly.value;
		o.folderChk = cbFolderChk.value;
		
		o.selectedFolder = selectedFolder;
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
			if ( (o.rs != undefined)&&(o.rs != "")) {
				setList(lstRS,o.rs);
			}
			if ( (o.om != undefined)&&(o.om != "")) {
				setList(lstOM,o.om);
			}
			if (o.folder != undefined){
				switch (o.folder){
					case 1:
						rbNone.value = false;
						rbToProjFolder.value = true;
						rbSelectFolder.value = false;
						break;
					case 2:
						rbNone.value = false;
						rbToProjFolder.value = true;
						rbSelectFolder.value = false;
						break;
					case 0:
					default:
						rbNone.value = true;
						rbToProjFolder.value = false;
						rbSelectFolder.value = false;
						break;
				}
			}
			if ( o.folderName != undefined) edProj.text = o.folderName;
			if ( o.selectFolder != undefined) stSelectFolder.text = o.selectFolder;
			
			if ( o.selectedFolder != undefined) selectedFolder = o.selectedFolder;
			if ( o.only != undefined) cbOnly.value = o.only;
			if ( o.folderChk != undefined) cbFolderChk.value = o.folderChk;

			enabledChk();
		}
	}
	prefLoad();	
	//-------------------------------------------------------------------------
	function selectedFolderDlg()
	{
		var f = Folder.selectDialog("書き出しフォルダ",selectedFolder);
		if ( f != null)
		{
			selectedFolder = f.fullName;
			stSelectFolder.text = File.decode(f.fullName);
		}
	}
	btnSelectFolder.onClick = selectedFolderDlg;
	//-------------------------------------------------------------------------
	function isRenban(f)
	{
		var n = File.decode(f.name);
		return  ( (n.indexOf("[")>=0)&&(n.indexOf("]")>=0)&&(n.indexOf("#")>=0) );
	}
	//-------------------------------------------------------------------------
	function renbanFolderName(n)
	{
		var idx = n.indexOf("[");
		if ( idx<=0)  return null;
		//AAAA_[####].tga
		//0123456789AB
		var ret = n.substr(0, idx);
		var c = ret[ret.length-1];
		if ( (c=="_")||(c=="-")||(c==" ")){
			ret = ret.substr(0,ret.length-1);
		}
		return ret;
	}
	//-------------------------------------------------------------------------
	function fchk(fld,op)
	{
		if ( fld.exists == false){
			fld.create();
			return fld;
		}else{
			if (op==false) return fld;
			var pf = fld.parent;
			var sa = File.decode(fld.name).split("_");
			var idx = 1;
			while(true)
			{
				var r = new Folder(fld.parent.fullName + "/" + sa[0] +"_" + idx);
				if ( r.exists == false){
					r.create();
					return r;
				}
				idx++;
				if ( idx>100) return r;
			}
		}
	}
	//-------------------------------------------------------------------------
	function add()
	{
		var sl = [];
		if ( app.project.selection.length>0){
			for ( var i=0; i<app.project.selection.length; i++){
				if ( app.project.selection[i] instanceof CompItem){
					sl.push(app.project.selection[i]);
				}
			}
		}
		if ( sl.length<=0){
			alert("コンポを選択して下さい。");
			return;
		}
		var rs = "";
		var om = "";
		if ( lstRS.selection != null) rs = lstRS.selection.text;
		if ( lstOM.selection != null) om = lstOM.selection.text;
		
		if ( (rs =="")||(om =="") ){
			alert("テンプレートを選んでください。");
			return;
		}
		var exportFolder = null;

		var md = 0;
		if (rbNone.value == true) md = 2;
		else if (rbToProjFolder.value == true) md = 0;
		else if (rbSelectFolder.value == true) md = 1;


		switch (md){
		case 0:
			if (app.project.file == null){
				alert("プロジェクトを保存してください。");
				return;
			}
			var p = app.project.file.parent.fullName;
			if ( edProj.txet !="") p += "/" + edProj.text;
			exportFolder = new Folder(p);
			if (exportFolder.exists == false) exportFolder.create();
			break;
		case 1:
			exportFolder = new Folder(stSelectFolder.text);
			if ((exportFolder == null)||(exportFolder.exists == false)){
				alert("書き出し先がありません");
				return;
			}
			break;
		}
		var fc = cbFolderChk.value;
		
		
		app.beginUndoGroup(scriptName);
		if (app.project.renderQueue.numItems>0){
			if ( cbOnly.value == true){
				for (var i=1; i<=app.project.renderQueue.numItems; i++){
					app.project.renderQueue.item(i).render = false;
				}
			}
		}
		for ( var i=0; i<sl.length; i++){
			var rq = app.project.renderQueue.items.add(sl[i]);
			
			rq.applyTemplate(rs);
			var opm = rq.outputModule(1);
			opm.applyTemplate(om);
			if (md < 2){
				if ( opm.file == null) opm.file = new File(sl[i].name); 
				if ( isRenban(opm.file)==true){
					var n = renbanFolderName(File.decode(opm.file.name));
					var fld = new Folder(exportFolder.fullName +"/" + File.encode(n));
					fld = fchk(fld,fc);
					opm.file = new File(fld.fullName + "/" + opm.file.name);
				}else{
					opm.file = new File(exportFolder.fullName +"/"+opm.file.name);
				}
			}
			
		}
		app.endUndoGroup();
	}
	btnAdd.onClick = add;
	//-------------------------------------------------------------------------
	function resize()
	{
		var b = winObj.bounds;
		var w = b[2] - b[0];
		var h = b[3] - b[1];

		var b = btnGetTemplates.bounds;
		b[0] = 4;
		b[2] = w - 4;
		btnGetTemplates.bounds = b;

		var b = btnAdd.bounds;
		b[0] = 4;
		b[2] = w - 4;
		btnAdd.bounds = b;

		var b = pnlTemp.bounds;
		b[0] = 4;
		b[2] = w - 4;
		var pw = b[2] - b[0];
		pnlTemp.bounds = b;

		var b = lstRS.bounds;
		b[0] = 4;
		b[2] = pw - 8;
		lstRS.bounds = b;
		var b = lstOM.bounds;
		b[0] = 4;
		b[2] = pw - 8;
		lstOM.bounds = b;

		var b = pnlFolder.bounds;
		b[0] = 4;
		b[2] = w - 4;
		var pw = b[2] - b[0];
		pnlFolder.bounds = b;
		var b = stSelectFolder.bounds;
		b[0] = 2;
		b[2] = pw - 2;
		stSelectFolder.bounds = b;

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