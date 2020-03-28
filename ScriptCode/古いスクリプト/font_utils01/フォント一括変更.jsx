(function(me){
	var TagABC = "%E%";
	var TagJAP = "%J%";


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
	//-------------------------------------------------------------------------
	var winObj = ( me instanceof Panel) ? me : new Window("palette", "フォント一括設定", [  44,   58,   44+ 208,   58+ 249] );
	//-------------------------------------------------------------------------
	
	//----------------------------------
	var pnlFont = winObj.add("panel", [  12,   12,   12+ 188,   12+ 219], "コンポ内のフォントを一括変更" );
	pnlFont.graphics.font = ScriptUI.newFont("Tahoma",ScriptUI.FontStyle.REGULAR, 11);
	var st1 = pnlFont.add("statictext", [   6,   17,    6+ 127,   17+  13], "フォント(デフォルト)");
	st1.graphics.font = ScriptUI.newFont("Tahoma",ScriptUI.FontStyle.REGULAR, 11);
	var edFontDef = pnlFont.add("edittext", [   9,   33,    9+ 165,   33+  21], "");
	edFontDef.graphics.font = ScriptUI.newFont("Tahoma",ScriptUI.FontStyle.REGULAR, 11);
	var st2 = pnlFont.add("statictext", [   9,   56,    9+ 173,   56+  13], "英字フォント");
	st2.graphics.font = ScriptUI.newFont("Tahoma",ScriptUI.FontStyle.REGULAR, 11);
	var st3 = pnlFont.add("statictext", [  23,   73,   23+ 159,   73+  14], "レイヤ名に%E%が含まれること");
	st3.graphics.font = ScriptUI.newFont("Tahoma",ScriptUI.FontStyle.REGULAR, 11);
	var edFontABC = pnlFont.add("edittext", [   9,   89,    9+ 165,   89+  21], "");
	edFontABC.graphics.font = ScriptUI.newFont("Tahoma",ScriptUI.FontStyle.REGULAR, 11);
	var st4 = pnlFont.add("statictext", [   6,  113,    6+  88,  113+  15], "日本語フォント");
	st4.graphics.font = ScriptUI.newFont("Tahoma",ScriptUI.FontStyle.REGULAR, 11);
	var st5 = pnlFont.add("statictext", [  23,  129,   23+ 159,  129+  12], "レイヤ名に%J%が含まれること");
	st5.graphics.font = ScriptUI.newFont("Tahoma",ScriptUI.FontStyle.REGULAR, 11);
	var edFontJ = pnlFont.add("edittext", [   9,  145,    9+ 165,  145+  21], "");
	edFontJ.graphics.font = ScriptUI.newFont("Tahoma",ScriptUI.FontStyle.REGULAR, 11);
	var btnSet = pnlFont.add("button", [  99,  172,   99+  75,  172+  22], "SET" );
	btnSet.graphics.font = ScriptUI.newFont("Tahoma",ScriptUI.FontStyle.REGULAR, 11);

	//-------------------------------------------------------------------------
	function savePref()
	{
		var p = new Object;
		p.fontDef = edFontDef.text;
		p.fontABC = edFontABC.text;
		p.fontJ = edFontJ.text;
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
			if (p.fontDef != undefined)
				edFontDef.text = p.fontDef;
			if (p.fontABC != undefined)
				edFontABC.text = p.fontABC;
			if (p.fontJ != undefined)
				edFontJ.text = p.fontJ;
		}
	}
	loadPref();
	//-------------------------------------------------------------------------
	function getTextLayer()
	{
		var ret = [];

		if ( app.project.selection.length>0){
			for (var j=0; j<app.project.selection.length; j++){
				var t = app.project.selection[j];
				if ( (t!=null)&&(t instanceof CompItem) ) {
					if ( t.numLayers>0){
						for ( var i=1; i<=t.numLayers; i++){
							if ( t.layer(i) instanceof TextLayer){
								ret.push(t.layer(i));
							}
						}
					}
				}
			}
		}
		if ( ret.length<=0){
			alert("コンポを選択してください。");
		}
		return ret; 
	}
	//-------------------------------------------------------------------------
	function setFonts()
	{
		var defFont = edFontDef.text.trim();
		var eFont = edFontABC.text.trim();
		var jFont = edFontJ.text.trim();
		
		if (defFont == "") {
			alert("フォント(デフォルト)が設定されていません。");
		
		}
		if (eFont == "") eFont = defFont;
		if (jFont == "") jFont = defFont;

		savePref();

		var lst = getTextLayer();
		if ( lst.length<=0) return;
		
		app.beginUndoGroup(scriptName);
		for (var i=0; i<lst.length;i++){
			var td = lst[i].property("ADBE Text Properties").property("ADBE Text Document");
			var tdv = td.value
			var n = lst[i].name;
			if ( n.indexOf(TagABC)>=0){
				tdv.font = eFont;
			}else if ( n.indexOf(TagJAP)>=0){
				tdv.font = jFont;
			}else{
				tdv.font = defFont;
			}
			td.setValue(tdv);
		}
		app.endUndoGroup();
	}
	btnSet.onClick = setFonts;

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