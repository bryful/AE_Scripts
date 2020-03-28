/*

*/

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


	var scriptName = getScriptName();
	var pref = new File( getScriptPath() + "/"+ File.encode(scriptName)+".pref");
	var src ="";
	var dst ="";

	var activeComp = null;
	//---------------
	var winObj = ( me instanceof Panel) ? me : new Window("palette", scriptName, [ 154,  203,  154+ 299,  203+ 174] ,{resizeable:true, maximizeButton:true, minimizeButton:true});
	
	
	var btnGetName = winObj.add("button", [  10,   10,   10+  49,   10+  23], "Get");
	var edGetName = winObj.add("edittext", [  65,   12,   65+ 222,   12+  19], "", {readonly:false, multiline:false});
	var pnl = winObj.add("panel", [  10,   40,   10+ 277,   40+  96], "レイヤ名の置換");
	var lbSrc = pnl.add("statictext", [   6,   30,    6+  90,   30+  12], "置換前の文字列");
	var tbSrc = pnl.add("edittext", [ 102,   27,  102+ 161,   27+  19], "", {readonly:false, multiline:false});
	var lbDst = pnl.add("statictext", [   6,   60,    6+  90,   60+  12], "置換後の文字列");
	var tbDst = pnl.add("edittext", [ 102,   57,  102+ 161,   57+  19], "", {readonly:false, multiline:false});
	var btnOK = winObj.add("button", [ 198,  142,  198+  75,  142+  23], "実行");
	//---------------
	function resizeWin()
	{
		var b = winObj.bounds;
		var w = b[2] - b[0];
		var h = b[3] - b[1];
		
		var gb = edGetName.bounds;
		gb[2] = w -10;
		edGetName.bounds = gb;
		var pb = pnl.bounds;
		pb[2] = w -10;
		pnl.bounds = pb;
		var pw = pb[2] - pb[0];
		var ph = pb[3] - pb[1];
		var sb = tbSrc.bounds;
		sb[2] = pw -10;
		tbSrc.bounds = sb;
		var db = tbDst.bounds;
		db[2] = pw -10;
		tbDst.bounds = db;
		var bb = btnOK.bounds;
		bb[0] = w -85;
		bb[2] = w -10;
		btnOK.bounds = bb;
		
	}
	resizeWin();
	winObj.onResize = resizeWin;
	//===============================================================================
	//===============================================================================
	function savePrm()
	{
		src = tbSrc.text;
		dst = tbDst.text;
		pref.open("w");
		pref.write(src +"\t"+dst);
		pref.close();
	
	}
	//===============================================================================
	function loadPrm()
	{
		src ="";
		dst ="";
		if (pref.exists == false) return;
		pref.open("r");
		var line = pref.readln();
		if (line == "") return;
		pref.close();
		var sa = line.split("\t");
		if ( sa.length>=2){
			src = sa[0];
			dst = sa[1];
		}
		tbSrc.text = src;
		tbDst.text = dst;
	}
	//===============================================================================
	function getLayerName()
	{
		activeComp =null;
		var ret = "";
		
		var cmp = app.project.activeItem;
		if ( (cmp!=null)&&( ( cmp instanceof CompItem)==true)){
			
			if ( cmp.selectedLayers.length>0){
				activeComp = cmp;
				ret = cmp.selectedLayers[0].name;
			}
		}
	
		edGetName.text = ret;
	}
	btnGetName.onClick = getLayerName;
	//===============================================================================
	function getLayers()
	{
		var ret = [];
		var cmp = app.project.activeItem;
		if ( (cmp == null)|| ( (cmp instanceof CompItem)==false))
		{
			return ret;
		}
		return cmp.selectedLayers;
	}
	//===============================================================================
	var propList = [];
	
	function findExpressionFromProp(prop, srcName)
	{
		if ( prop == null) return;
		if ( prop instanceof Property){
			if ( prop.expression != ""){
				if ( prop.expression.indexOf(srcName)>=0){
					var o = new Objet;
					o.prop = prop;
					o.expressionEnabled = prop.expressionEnabled;
					propList.push(o);
				}
			}
		}else if ( prop instanceof PropertyGroup){
			if ( prop.numProperties>0){
				for ( var i=1; i<=prop.numProperties; i++){
					findExpressionFromProp(prop.property(i),srcName);
				}
			}
		}
	}
	//===============================================================================
	function replaceExpression(prop,src,dst)
	{
		
	}
	
	//===============================================================================
	function ExecReplace()
	{
		activeComp =null;
		src = tbSrc.text;
		dst = tbDst.text;
		if ( src == "") {
			alert("置換前の文字列が有りません！");
			return;
		}
		if ( src == dst) {
			alert("同じ単語です");
			return;
		}
		var sa = getLayers();
		
		if ( sa.length<=0) {
			alert("レイヤが選択されていませんん！");
			return;
		}
		app.beginUndoGroup(scriptName);
		writeLn ( "ReplaceLayer : "+ sa.length);
		for ( var i=0; i<sa.length; i++){
			var nm = sa[i].name;
			nm = nm.replace(src,dst);
			if (nm != sa[i].name ){
				writeLn(sa[i].name + ">>"+ nm);
				sa[i].oldName = sa[i].name;
				sa[i].name = nm;
			}
		}
		savePrm();
		app.endUndoGroup();
	}
	//===============================================================================
	btnOK.onClick = ExecReplace;
	//===============================================================================
	loadPrm();
	if ( ( me instanceof Panel) == false){ winObj.center(); winObj.show(); }

})(this);
