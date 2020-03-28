/*
	コンポジションの名前を一括置換するスクリプト
	選択したフォルダの中にあるコンポも再帰して探す。

*/

function compNameReplace(me)
{
	var scriptName = "compNameReplace";
	var pref = new File(Folder.current.absoluteURI + "/"+ scriptName+".pref");
	var src ="";
	var dst ="";


	//---------------
	this.winObj = ( me instanceof Panel) ? me : new Window("palette", "CompNameReplace", [110, 145, 110+317, 145+157]);

	var pnl = this.winObj.add("panel", [3, 3, 3+300, 3+117], "コンポジション名の置換");
	var lbSrc = pnl.add("statictext", [18, 16, 18+87, 16+12], "置換前の文字列");
	var tbSrc = pnl.add("edittext", [18, 34, 18+260, 34+19], "", {readonly:false, multiline:false});
	var lbDst = pnl.add("statictext", [18, 59, 18+87, 59+12], "置換後の文字列");
	var tbDst = pnl.add("edittext", [18, 77, 18+260, 77+19], "", {readonly:false, multiline:false});
	var btnOK = this.winObj.add("button", [117, 126, 117+75, 126+23], "実行");
	//---------------
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
	if ( ( me instanceof Panel) == false){ this.winObj.center(); this.winObj.show(); }
}
//===============================================================================
var _compNameReplace = new compNameReplace(this);
//===============================================================================
