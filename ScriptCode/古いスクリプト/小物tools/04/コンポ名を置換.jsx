/*
	コンポジションの名前を一括置換するスクリプト
	選択したフォルダの中にあるコンポも再帰して探す。

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


	//---------------
	var winObj = ( me instanceof Panel) ? me : new Window("palette", scriptName, [ 154,  203,  154+ 299,  203+ 174]);
	
	
	var btnGetName = winObj.add("button", [  10,   10,   10+  49,   10+  23], "Get");
	var edGetName = winObj.add("edittext", [  65,   12,   65+ 222,   12+  19], "", {readonly:false, multiline:false});
	var pnl = winObj.add("panel", [  10,   40,   10+ 277,   40+  96], "コンポジション名の置換");
	var lbSrc = pnl.add("statictext", [   6,   30,    6+  90,   30+  12], "置換前の文字列");
	var tbSrc = pnl.add("edittext", [ 102,   27,  102+ 161,   27+  19], "", {readonly:false, multiline:false});
	var lbDst = pnl.add("statictext", [   6,   60,    6+  90,   60+  12], "置換前の文字列");
	var tbDst = pnl.add("edittext", [ 102,   57,  102+ 161,   57+  19], "", {readonly:false, multiline:false});
	var btnOK = winObj.add("button", [ 198,  142,  198+  75,  142+  23], "実行");
	//---------------
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
	function getCompName()
	{
		var ret = "";
	
		if ( app.project.activeItem != null){
			 ret= app.project.activeItem.name;
		}else{
			var selectedItems = app.project.selection;
			if ( (selectedItems!=null)&&(selectedItems.length>0) ) {
				ret = selectedItems[0].name;
			}

		}
		edGetName.text = ret;
	}
	btnGetName.onClick = getCompName;
	//===============================================================================
	function getComp()
	{
		function getC(c)
		{
			var r = new Array;
			if ( c instanceof CompItem) {
				if ( (c.TargetIndex== undefined)||(c.TargetIndex== null)){
				 	r.push(c);
					c.TargetIndex = 1;
				}
			 }
			else if ( c instanceof FolderItem){
				if ( c.numItems>0){
					for ( var i=1; i<=c.numItems; i++) {
						var rr = getC(c.items[i]);
						if ( rr.length>0) r = r.concat(rr);
					}
				}
			}
			return r;
		}
	
		var ret = new Array;
		var sa = app.project.selection;
		if ( sa.length<=0) {
			return ret;
		}
		for (var i = 0; i < sa.length; i++) {
			var rr = getC(sa[i]);
			if ( rr.length>0) ret = ret.concat(rr);
		}
		if ( ret.length>0){
			for (var i = 0; i < ret.length; i++)  {
				 ret[i].TargetIndex = null;
			}
		}
		return ret;
	}
	//===============================================================================
	function ExecReplace()
	{
		src = tbSrc.text;
		dst = tbDst.text;
		if ( src == "") {
			alert("置換前の文字列が有りません！");
			return;
		}
		var sa = getComp();
		if ( sa.length<=0) {
			alert("コンポジションが選択されていませんん！");
			return;
		}
		app.beginUndoGroup(scriptName);
		writeLn ( "Replace : "+ sa.length);
		for ( var i=0; i<sa.length; i++){
			var nm = sa[i].name;
			nm = nm.replace(src,dst);
			if ( ( nm !="")&&(nm != sa[i].name) ){
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
