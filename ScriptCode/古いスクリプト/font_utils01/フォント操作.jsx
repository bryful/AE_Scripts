(function(me){
	var selectFontStr = "フォントの選択";
	//-------------------------------------------------------------------------
	String.prototype.trim = function(){
		if (this=="" ) return ""
		else return this.replace(/[\r\n]+$|^\s+|\s+$/g, "");
	}
	Array.prototype.indexIn = function(i){
		return ((typeof(i)=="number")&&(i>=0)&&(i<this.length));
	}
	Array.prototype.removeAt = function(i) {
		if(this.indexIn(i)==true) return this.splice(i,1);else return null;
	}
	//ファイル名のみ取り出す（拡張子付き）
	String.prototype.getName = function(){
		var r=this;var i=this.lastIndexOf("/");if(i>=0) r=this.substring(i+1);
		return r;
	}
	String.prototype.changeExt=function(s){
		var i=this.lastIndexOf(".");
		if(i>=0){return this.substring(0,i)+s;}else{return this + s; }
	}
	Application.prototype.getScriptName = function(){
		return File.decode($.fileName.getName());
	}
	
	//----------------------------------
	var scriptName = File.decode($.fileName.getName().changeExt(""));
	var prefFile = new File($.fileName.changeExt(".pref"));
	var cmbFlag = false;
	//----------------------------------
	var FontNameStr = "";
	var hisData = [ ];
	var srcName = "";
	var dstName = "";
	//-------------------------------------------------------------------------
	var winObj = ( me instanceof Panel) ? me : new Window("palette", "フォント操作", [  66,   87,   66+ 207,   87+ 314] );
	//-------------------------------------------------------------------------
	var pnlGet = winObj.add("panel", [   9,   12,    9+ 188,   12+ 144], "フォント名の獲得/設定" );
	pnlGet.graphics.font = ScriptUI.newFont("Tahoma",ScriptUI.FontStyle.REGULAR, 11);
	var btnGetFontName = pnlGet.add("button", [   6,   21,    6+  58,   21+  23], "GET" );
	btnGetFontName.graphics.font = ScriptUI.newFont("Tahoma",ScriptUI.FontStyle.REGULAR, 11);
	var btnSetFontName = pnlGet.add("button", [ 115,   21,  115+  59,   21+  23], "SET" );
	btnSetFontName.graphics.font = ScriptUI.newFont("Tahoma",ScriptUI.FontStyle.REGULAR, 11);
	var edFontName = pnlGet.add("edittext", [   6,   50,    6+ 168,   50+  21], FontNameStr);
	edFontName.graphics.font = ScriptUI.newFont("Tahoma",ScriptUI.FontStyle.REGULAR, 11);
	var stHis = pnlGet.add("statictext", [   3,   74,    3+ 100,   74+  16], "過去の履歴");
	stHis.graphics.font = ScriptUI.newFont("Tahoma",ScriptUI.FontStyle.REGULAR, 11);
	var cmbHis = pnlGet.add("dropdownlist", [   6,   93,    6+ 168,   93+  21], hisData);
	cmbHis.graphics.font = ScriptUI.newFont("Tahoma",ScriptUI.FontStyle.REGULAR, 11);
	var pnlReplace = winObj.add("panel", [   9,  162,    9+ 188,  162+ 134], "フォント名の置換" );
	pnlReplace.graphics.font = ScriptUI.newFont("Tahoma",ScriptUI.FontStyle.REGULAR, 11);
	var stSrc = pnlReplace.add("statictext", [   9,   10,    9+  71,   10+  13], "元のフォント");
	stSrc.graphics.font = ScriptUI.newFont("Tahoma",ScriptUI.FontStyle.REGULAR, 11);
	var edSrc = pnlReplace.add("edittext", [   6,   25,    6+ 168,   25+  21], srcName);
	edSrc.graphics.font = ScriptUI.newFont("Tahoma",ScriptUI.FontStyle.REGULAR, 11);
	var stDst = pnlReplace.add("statictext", [   7,   49,    7+  71,   49+  14], "新しいフォント");
	stDst.graphics.font = ScriptUI.newFont("Tahoma",ScriptUI.FontStyle.REGULAR, 11);
	var edDst = pnlReplace.add("edittext", [   6,   65,    6+ 168,   65+  21], dstName);
	edDst.graphics.font = ScriptUI.newFont("Tahoma",ScriptUI.FontStyle.REGULAR, 11);
	var btnReplace = pnlReplace.add("button", [   6,   92,    6+  61,   92+  23], "SET" );
	btnReplace.graphics.font = ScriptUI.newFont("Tahoma",ScriptUI.FontStyle.REGULAR, 11);
	//-------------------------------------------------------------------------
	function savePref()
	{
		var p = new Object;
		p.FontNameStr = edFontName.text;
		p.hisData = [].concat(hisData);
		p.srcName = edSrc.text;
		p.dstName = edDst.text;
		var str = p.toSource();
		if (prefFile.open("w")){
			try{
				prefFile.write(str);
				prefFile.close();
			}catch(e){
			}
		}
	}
	//-------------------------------------------------------------------------
	function loadPref()
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
		var p = eval(str);
		if (p!=null){
			if (p.FontNameStr != undefined)
				edFontName.text = p.FontNameStr;
			if (p.srcName != undefined)
				edSrc.text = p.srcName;
			if (p.dstName != undefined)
				edDst.text = p.dstName;
			var b = cmbFlag;
			cmbFlag=true;
			cmbHis.removeAll();
			cmbFlag = b;

			if (p.hisData != undefined) {
				hisData = [].concat(p.hisData);
				if ( hisData.length>0){
					var b = cmbFlag;
					cmbFlag=true;
						cmbHis.add("item",selectFontStr);
					for (var i=0; i<hisData.length; i++){
						cmbHis.add("item",hisData[i]);
					}
					cmbFlag = b;
				}
			}
		}
	}
	loadPref();
	//-------------------------------------------------------------------------
	function getTextLayer()
	{
		var activeComp = app.project.activeItem;
		var ret = [];
		if ( (activeComp!=null)&&(activeComp instanceof CompItem) ) {
			var selectedLayers = activeComp.selectedLayers;
			if ( (selectedLayers!=null)&&(selectedLayers.length>0) ){
				for (var i = 0; i < selectedLayers.length; i++) {
					if ( selectedLayers[i] instanceof TextLayer){
						ret.push(selectedLayers[i]);
					}
				}
			}else{
			alert("テキストレイヤを選択してください。");
			}
		}else{
			alert("コンポをアクティブにしてください。");
		}
		return ret;
	}
	
	//-------------------------------------------------------------------------
	function setHis(s)
	{
		var ss = s.trim();
		if ( ss=="") return;
		if ( hisData.length<=0) {
			hisData.push(ss);
		}else{
			for(var i=0; i<hisData.length; i++){
				if (hisData[i] == ss){
					hisData.removeAt(i);
					break;
				}
			}
			hisData.unshift(ss);
			if ( hisData.length>20) {
				hisData.pop();
			}
		}
		var b = cmbFlag;
		cmbFlag = true;
		cmbHis.removeAll();
		if ( hisData.length>0){
			cmbHis.add("item",selectFontStr);
			for ( var i=0; i<hisData.length; i++){
				cmbHis.add("item",hisData[i]);
			}
		}
		cmbFlag = b;
		savePref();
	}
	//-------------------------------------------------------------------------
	function getFontName()
	{
		var lst = getTextLayer();
		if ( lst.length<=0) return;
		if (lst.length != 1) {
			alert("テキストレイヤを1個だけ選択してください。");
			return;
		}
		var td = lst[0].property("ADBE Text Properties").property("ADBE Text Document").value;
		edFontName.text = td.font;
		setHis(td.font);
	}
	//-------------------------------------------------------------------------
	function setFontName()
	{
		var nName = edFontName.text.trim();
		if (nName == ""){
			alert("フォント名を設定してください。");
			return;
		}

		var lst = getTextLayer();
		if ( lst.length<=0) return;

		app.beginUndoGroup(scriptName +":set Font");
		for (var i=0; i<lst.length; i++){
			var td = lst[i].property("ADBE Text Properties").property("ADBE Text Document");
			var tdv = td.value;
			if ( tdv.font != nName){
				tdv.font = nName;
				td.setValue(tdv);
			}
		}
		app.endUndoGroup();
		setHis(nName);

	}
	//-------------------------------------------------------------------------
	function replaceFontName()
	{
		var src = edSrc.text.trim();
		var dst = edDst.text.trim();
		if ((src=="")||(dst=="")||(dst==src)) {
			alert("フォント名がおかしい");
			return;
		}
		var lst = getTextLayer();
		if ( lst.length<=0){
			alert("テキストレイヤを選択してください。");
			return;
		}
		app.beginUndoGroup(scriptName +":replace Font");
		for(var i=0; i<lst.length; i++){
			var td = lst[i].property("ADBE Text Properties").property("ADBE Text Document");
			var tdv = td.value
			if ( tdv.font == src){
				tdv.font = dst;
				td.setValue(tdv);
			}
		}
		app.endUndoGroup();
	}
	//-------------------------------------------------------------------------
	btnGetFontName.onClick = getFontName;
	btnSetFontName.onClick = setFontName;
	btnReplace.onClick = replaceFontName;

	//-------------------------------------------------------------------------
	/*
	btnGetFontName.onChanging = function()
	{
		if ( (cmbHis.items.length>0)&&(cmbHis.selection!="")){
			var b = cmbFlag;
			cmbFlag = true;
			for (var i=0; i<cmbHis.items.length; i++){
				cmbHis.items[i].selected = false;
			}
			cmbFlag = b;
		}
	}
	*/
	//-------------------------------------------------------------------------
	cmbHis.onChange = function()
	{
		if ( (cmbHis.selection != "")&&(cmbHis.selection != null)&&(cmbFlag==false)){
			if (cmbHis.selection != selectFontStr) {
				edFontName.text = cmbHis.selection;
				var b = cmbFlag;
				cmbFlag = true;
				for (var i=0; i<cmbHis.items.length; i++){
					cmbHis.items[i].selected = false;
				}
				cmbFlag = b;
				}
		}
	}
	//-------------------------------------------------------------------------
	winObj.onClose = function(){
		savePref();
	}
	//-------------------------------------------------------------------------
	if ( ( me instanceof Panel) == false){
		winObj.center(); 
		winObj.show();
	}
	//-------------------------------------------------------------------------
})(this);
