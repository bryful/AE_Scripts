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
	var winObj = ( me instanceof Panel) ? me : new Window("palette", "レンダーキュー設定", [ 856,  344,  856+ 200,  344+ 422]  ,{resizeable:true, maximizeButton:true, minimizeButton:true});
	//-------------------------------------------------------------------------
	var btnGetTemplate = winObj.add("button", [   4,    8,    4+ 191,    8+  30], "テンプレートを獲得" );
	btnGetTemplate.graphics.font = ScriptUI.newFont("Tahoma",ScriptUI.FontStyle.REGULAR, 11);
	var stRS = winObj.add("statictext", [   4,   42,    4+ 109,   42+  14], "レンダリング設定");
	stRS.graphics.font = ScriptUI.newFont("Tahoma",ScriptUI.FontStyle.REGULAR, 11);
	var lstRS = winObj.add("dropdownlist", [   4,   59,    4+ 189,   59+  21], [ ]);
	lstRS.graphics.font = ScriptUI.newFont("Tahoma",ScriptUI.FontStyle.REGULAR, 11);
	var stOM = winObj.add("statictext", [   4,   83,    4+ 108,   83+  14], "出力モジュール設定");
	stOM.graphics.font = ScriptUI.newFont("Tahoma",ScriptUI.FontStyle.REGULAR, 11);
	var lstOM = winObj.add("dropdownlist", [   4,  100,    4+ 189,  100+  21], [ ]);
	lstOM.graphics.font = ScriptUI.newFont("Tahoma",ScriptUI.FontStyle.REGULAR, 11);
	var btnSet = winObj.add("button", [   4,  127,    4+ 188,  127+  34], "RS/OMテンプレートを設定" );
	btnSet.graphics.font = ScriptUI.newFont("Tahoma",ScriptUI.FontStyle.REGULAR, 11);
	var cbRenderOFF1 = winObj.add("checkbox", [   7,  165,    7+ 152,  165+  17], "レンダリングOFFも含める");
	cbRenderOFF1.graphics.font = ScriptUI.newFont("Tahoma",ScriptUI.FontStyle.REGULAR, 11);
	var stSapa = winObj.add("statictext", [  11,  186,   11+ 185,  186+  16], "----------------------------------------");
	stSapa.graphics.font = ScriptUI.newFont("Tahoma",ScriptUI.FontStyle.REGULAR, 11);
	var btnSelectFolder = winObj.add("button", [   4,  205,    4+ 187,  205+  33], "フォルダ選択" );
	btnSelectFolder.graphics.font = ScriptUI.newFont("Tahoma",ScriptUI.FontStyle.REGULAR, 11);
	var stSelectFolder = winObj.add("statictext", [   8,  240,    8+ 184,  240+  19], "stSelectFolder");
	stSelectFolder.graphics.font = ScriptUI.newFont("Tahoma",ScriptUI.FontStyle.REGULAR, 11);
	var pnlFolderName = winObj.add("panel", [   5,  259,    5+ 191,  259+  96], "連番時作成されるフォルダ" );
	pnlFolderName.graphics.font = ScriptUI.newFont("Tahoma",ScriptUI.FontStyle.REGULAR, 11);
	var cbHeader = pnlFolderName.add("checkbox", [  12,   12,   12+  63,   12+  17], "ヘッダー");
	cbHeader.graphics.font = ScriptUI.newFont("Tahoma",ScriptUI.FontStyle.REGULAR, 11);
	var cbFootor = pnlFolderName.add("checkbox", [  12,   35,   12+  63,   35+  17], "フッター");
	cbFootor.graphics.font = ScriptUI.newFont("Tahoma",ScriptUI.FontStyle.REGULAR, 11);
	var cbOnly = pnlFolderName.add("checkbox", [  12,   57,   12+ 170,   57+  24], "連番時同じフォルダを作らない");
	cbOnly.graphics.font = ScriptUI.newFont("Tahoma",ScriptUI.FontStyle.REGULAR, 11);
	var edHeader = pnlFolderName.add("edittext", [  82,    8,   82+ 100,    8+  21], "");
	edHeader.graphics.font = ScriptUI.newFont("Tahoma",ScriptUI.FontStyle.REGULAR, 11);
	var edFootor = pnlFolderName.add("edittext", [  82,   33,   82+ 100,   33+  21], "");
	edFootor.graphics.font = ScriptUI.newFont("Tahoma",ScriptUI.FontStyle.REGULAR, 11);
	var btnSetOutput = winObj.add("button", [   5,  359,    5+ 188,  359+  34], "出力先を設定" );
	btnSetOutput.graphics.font = ScriptUI.newFont("Tahoma",ScriptUI.FontStyle.REGULAR, 11);
	var cbRenderOFF2 = winObj.add("checkbox", [   9,  396,    9+ 147,  396+  17], "レンダリングOFFも含める");
	cbRenderOFF2.graphics.font = ScriptUI.newFont("Tahoma",ScriptUI.FontStyle.REGULAR, 11);

	//-------------------------------------------------------------------------
	stSelectFolder.text = "";
	//-------------------------------------------------------------------------
	function enabledChk()
	{
		edHeader.enabled = cbHeader.value;
		edFootor.enabled = cbFootor.value;
	}
	cbHeader.onClick = enabledChk;
	cbFootor.onClick = enabledChk;
	enabledChk();
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
	btnGetTemplate.onClick = getTemplate;
	getTemplate();
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
		o.selectFolder = stSelectFolder.text;
		o.selectedFolder = selectedFolder;
		
		o.headerON = cbHeader.value;
		o.header = edHeader.text;
		o.footorON = cbFootor.value;
		o.footor = edFootor.text;
		o.only = cbOnly.value;
		
		o.RenderOFF1 = cbRenderOFF1.value;
		o.RenderOFF2 = cbRenderOFF2.value;
		
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
			if ( o.selectFolder != undefined) stSelectFolder.text = o.selectFolder;
			if ( o.selectedFolder != undefined) selectedFolder = o.selectedFolder;

			if ( o.headerON != undefined) cbHeader.value = o.headerON;
			if ( o.header != undefined) edHeader.text = o.header;
			if ( o.footorON != undefined) cbFootor.value = o.footorON;
			if ( o.footor != undefined) edFootor.text = o.footor;
			if ( o.only != undefined) cbOnly.value = o.only;
			if ( o.RenderOFF1 != undefined) cbRenderOFF1.value = o.RenderOFF1;
			if ( o.RenderOFF2 != undefined) cbRenderOFF2.value = o.RenderOFF2;

			enabledChk();
		}
	}
	prefLoad();
	//-------------------------------------------------------------------------
	function getRQ(op)
	{
		var ret = []
		if ( app.project.renderQueue.numItems>0){
			for ( var i=1; i<=app.project.renderQueue.numItems; i++)
			{
				var rq = app.project.renderQueue.item(i);
				if ( (rq.status == RQItemStatus.QUEUED)||((rq.status == RQItemStatus.UNQUEUED)&&(op==true))){
					ret.push(rq);
				}
			}
		}
		return ret;
	}
	//-------------------------------------------------------------------------
	function setRQ()
	{
		var rs = "";
		var om = "";
		if ( lstRS.selection != null) rs = lstRS.selection.text;
		if ( lstOM.selection != null) om = lstOM.selection.text;
		
		if ( (rs =="")||(om =="") ){
			alert("テンプレートを選んでください。");
			return;
		}
		var rqs = getRQ(cbRenderOFF1.value);
		if ( rqs.length<=0){
			alert("レンダーキューに何も登録されていません");
			return;
		}
		for ( var i=0; i<rqs.length; i++)
		{
			var rq = rqs[i];
			rq.applyTemplate(rs);
			if ( rq.numOutputModules>0){
				for ( var j=1; j<=rq.numOutputModules; j++){
					rq.outputModule(j).applyTemplate(om);
				}
			}
		}
		writeln("レンダーキューを設定します。");
	}
	btnSet.onClick = setRQ;
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
	function setOutput()
	{
		var exportFolder = new Folder(stSelectFolder.text);
		if ( (exportFolder==null)||(exportFolder.exists==false)){
			stSelectFolder.text = "";
			alert("フォルダを選択して下さい。");
			return;
		}
		var rqs = getRQ(cbRenderOFF2.value);
		if ( rqs.length<=0){
			alert("レンダーキューに何も登録されていません");
			return;
		}
		var fc = cbOnly.value;
		var hed = "";
		if ( cbHeader.value == true) hed = edHeader.text;
		
		var fot = "";
		if ( cbFootor.value == true) fot = edFootor.text;
				
		for ( var i=0; i<rqs.length; i++){
			var rq = rqs[i];
			if ( rq.numOutputModules>0){
				for ( var j=1; j<=rq.numOutputModules; j++){
					var opm = rq.outputModule(j);
					if ( opm.file == null) opm.file = new File(opm.name);
					if ( isRenban(opm.file)==true){
						var n = renbanFolderName(File.decode(opm.file.name));
						var fld = new Folder(exportFolder.fullName +"/" + hed + File.encode(n) + fot);
						fld = fchk(fld,fc);
						opm.file = new File(fld.fullName + "/" + opm.file.name);
					}else{
						opm.file = new File(exportFolder.fullName +"/"+opm.file.name);
					}
					
				}
			}
		}
		alert("変えた☆");
	}
	btnSetOutput.onClick = setOutput;
	//-------------------------------------------------------------------------
	function resize()
	{
		var b = winObj.bounds;
		var w = b[2] - b[0];
		var h = b[3] - b[1];

		var b = btnGetTemplate.bounds;
		b[0] = 4;
		b[2] = w - 4;
		btnGetTemplate.bounds = b;

		var b = btnSet.bounds;
		b[0] = 4;
		b[2] = w - 4;
		btnSet.bounds = b;

		var b = btnSetOutput.bounds;
		b[0] = 4;
		b[2] = w - 4;
		btnSetOutput.bounds = b;

		var b = lstRS.bounds;
		b[0] = 4;
		b[2] = w - 4;
		lstRS.bounds = b;

		var b = lstOM.bounds;
		b[0] = 4;
		b[2] = w - 4;
		lstOM.bounds = b;


		var b = btnSelectFolder.bounds;
		b[0] = 4;
		b[2] = w - 4;
		btnSelectFolder.bounds = b;

		var b = pnlFolderName.bounds;
		b[0] = 4;
		b[2] = w - 4;
		pnlFolderName.bounds = b;

		var b = stSelectFolder.bounds;
		b[0] = 4;
		b[2] = w - 4;
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