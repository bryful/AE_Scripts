(function (me)
{
	var errMes = "";
	function trim(s)
	{
		if (s=="" ) return ""
		else return s.replace(/[\r\n]+$|^\s+|\s+$/g, "");
	}
	//-------------------------------------------------------------------------
	function err(s)
	{
		errMes += s +"\r\n";
	}
	//-------------------------------------------------------------------------
	function getTarget()
	{
		var ret = null;
		if ( (app.project.activeItem instanceof CompItem)==false) {
			err("コンポが選択されていません！");
			return ret;
		}
		var acitiveComp = app.project.activeItem;
		
		var sp = acitiveComp.selectedProperties;
		if (sp.length>0) {
			for ( var i=0; i<sp.length; i++){
				if (( sp[i].matchName =="ADBE Vector Shape")||( sp[i].matchName =="ADBE Mask Shape") ){
					ret = sp[i];
					break;
				}else if ( sp[i].matchName =="ADBE Vector Shape - Group"){
					ret = sp[i].property("ADBE Vector Shape");
					break;
					
				}else if ( sp[i].matchName =="ADBE Mask Atom"){
					ret = sp[i].property("ADBE Mask Shape");
					break;
				}
			}
		}
		if ( ret == null) {
			err("プロパティを１個だけ選択してください。");
			return ret;
		}
		if ((ret.numKeys<=0)||(ret.selectedKeys.length ==1)){
			return ret;
		}else{
			err("キーフレームは１個だけ選択してください。");
			return null;
		}
	}
	
	

	//-------------------------------------------------------------------------
	
	//-------------------------------------------------------------------------
	var winObj = ( me instanceof Panel) ? me : new Window("palette", "パスの編集", [ 844,  333,  844+ 224,  333+ 353]  ,{resizeable:true});
	//-------------------------------------------------------------------------
	var btnGet = winObj.add("button", [  15,    7,   15+  72,    7+  24], "GET" );
	btnGet.graphics.font = ScriptUI.newFont("Tahoma",ScriptUI.FontStyle.BOLD, 11);
	var btnSet = winObj.add("button", [ 127,    7,  127+  72,    7+  24], "SET" );
	btnSet.graphics.font = ScriptUI.newFont("Tahoma",ScriptUI.FontStyle.BOLD, 11);
	var stBasePos = winObj.add("statictext", [  12,   37,   12+  87,   37+  14], "値の演算");
	stBasePos.graphics.font = ScriptUI.newFont("Tahoma",ScriptUI.FontStyle.BOLD, 13);
	var stBaseX = winObj.add("statictext", [  12,   57,   12+  24,   57+  14], "X:");
	stBaseX.graphics.font = ScriptUI.newFont("Tahoma",ScriptUI.FontStyle.BOLD, 13);
	var edAddX = winObj.add("edittext", [  42,   56,   42+ 119,   56+  21], "0");
	edAddX.graphics.font = ScriptUI.newFont("Tahoma",ScriptUI.FontStyle.BOLD, 11);
	var stBaseY = winObj.add("statictext", [  12,   84,   12+  24,   84+  14], "Y:");
	stBaseY.graphics.font = ScriptUI.newFont("Tahoma",ScriptUI.FontStyle.BOLD, 13);
	var edAddY = winObj.add("edittext", [  42,   81,   42+ 119,   81+  21], "0");
	edAddY.graphics.font = ScriptUI.newFont("Tahoma",ScriptUI.FontStyle.BOLD, 11);
	var btnCalc = winObj.add("button", [ 167,   54,  167+  45,   54+  23], "演算" );
	btnCalc.graphics.font = ScriptUI.newFont("Tahoma",ScriptUI.FontStyle.REGULAR, 11);
	var stPos = winObj.add("statictext", [   9,  114,    9+  87,  114+  14], "頂点の位置");
	stPos.graphics.font = ScriptUI.newFont("Tahoma",ScriptUI.FontStyle.BOLD, 13);
	var btnAdd = winObj.add("button", [ 102,  108,  102+  84,  108+  22], "頂点の追加" );
	btnAdd.graphics.font = ScriptUI.newFont("Tahoma",ScriptUI.FontStyle.REGULAR, 11);
	var edPos = winObj.add("edittext", [  12,  132,   12+ 202,  132+ 186], "", { multiline:true, scrollable:true });
	edPos.graphics.font = ScriptUI.newFont("Tahoma",ScriptUI.FontStyle.BOLD, 13);
	var btnDeleteCarve = winObj.add("button", [  12,  322,   12+  83,  322+  22], "カーブの削除" );
	btnDeleteCarve.graphics.font = ScriptUI.newFont("Tahoma",ScriptUI.FontStyle.REGULAR, 11);

	//-------------------------------------------------------------------------	
	btnSet.enabled = false;
	btnCalc.enabled = false;
	//-------------------------------------------------------------------------
	function sepa(idx)
	{
		var s = "{ ";
		if ( idx<=0) s += "000";
		else if ( idx <10) s += "00" + idx;
		else if ( idx <100) s += "0" + idx;
		else  s += "" + idx;
		
		return s + " -----------\r\n";
		
	}
	//-------------------------------------------------------------------------
	function dispVert(ver)
	{
		var cnt = ver.length;
		var str = "";
		if (cnt>0){
			for ( var i = 0; i<cnt; i++){
				var pp = ver[i];
				str += sepa(i);
				str += "X: " + pp[0].toString() +"\r\n";
				str += "Y: " + pp[1].toString() +"\r\n";
				str += "}\r\n";
			}
		}
		edPos.text = str;
	}
	//-------------------------------------------------------------------------
	function getPath()
	{
		errMes = "";
		var p = getTarget();
		
		if ( p != null) {
			var sp = null;
			if ( p.numKeys==0) {
				sp = p.value;
			} else {
				sp = p.keyValue(p.selectedKeys[0]);
			}
			dispVert(sp.vertices);
		}
		
		if ( errMes != ""){
			alert(errMes,"パスの編集");
		}
	}
	//-------------------------------------------------------------------------
	function toArray()
	{
		function blk(s)
		{
			var ret = [];
			if ( s=="") return ret;
			var lines = s.split("\n");
			var cnt = lines.length;
			if ( cnt<2)  return ret;
			//X
			var X = 0;
			for (var i= 0; i<cnt;i++){
				var line = trim(lines[i]);
				if ( line == "") continue;
				var sa = line.split(":");
				if ( sa.length<2) continue;
				if ( trim(sa[0]).toUpperCase()=="X"){
					X = trim(sa[1]) *1;
					break;
				}
			}
			ret.push(X);
			var Y = 0;
			for (var i= 0; i<cnt;i++){
				var line = trim(lines[i]);
				if ( line == "") continue;
				var sa = line.split(":");
				if ( sa.length<2) continue;
				if ( trim(sa[0]).toUpperCase()=="Y"){
					Y = trim(sa[1]) *1;
					break;
				}
			}
			ret.push(Y);
			return ret;
		}
	
		var ret = [];
		var str = trim(edPos.text);
		if ( str == "") return ret;
		var block = str.split("}");
		for ( var i=0; i<block.length; i++){
			var ppp = blk(block[i]);
			if (ppp.length==2)
				ret.push(ppp);
		}
		return ret;
	}
	//-------------------------------------------------------------------------
	function addPoint()
	{
		var ary = toArray();
		ary.push([0,0]);
		dispVert(ary);
	}
	//-------------------------------------------------------------------------
	function calc()
	{
		var x = 0;
		if ( isNaN(edAddX.text)==false) {
			x = edAddX.text *1;
		}else{
			alert("Xの値が不正");
			return;
		}
		var y = 0;
		if ( isNaN(edAddY.text)==false) {
			y = edAddY.text *1;
		}else{
			alert("Yの値が不正");
			return;
		}
		
		if ( (x==0)&&(y==0)) return;
		var ary = toArray();
		if ( ary.length <=0) return;
		for ( var i= 0; i<ary.length; i++){
			if ( x!=0) ary[i][0] += x;
			if ( y!=0) ary[i][1] += y;
		}
		edAddX.text = "0";
		edAddY.text = "0";
		btnCalc.enabled = false;

		dispVert(ary);
	}
	//-------------------------------------------------------------------------
	function setPath()
	{
		errMes = "";
		var p = getTarget();
		
		if ( p != null) {
			var sp = null;
			var ary = toArray();
			app.beginUndoGroup("シェイプパスの編集");
			if ( p.numKeys==0) {
				sp = p.value;
				sp.vertices = ary;
				p.setValue(sp);
			} else {
				sp = p.keyValue(p.selectedKeys[0]);
				sp.vertices = ary;
				p.setValueAtKey(p.selectedKeys[0],sp);
				
			}
			app.endUndoGroup();
			//dispVert(sp.vertices);
		}
		
		if ( errMes != ""){
			alert(errMes,"パスの編集");
		}
	}
	//-------------------------------------------------------------------------
	function deleteCurve()
	{
		errMes = "";
		var p = getTarget();
		
		if ( p != null) {
			var sp = null;
			app.beginUndoGroup("カーブの削除");
			if ( p.numKeys==0) {
				sp = p.value;
				var itn = [];
				var otn = [];
				if (sp.inTangents.length>0){
					for ( var i=0; i<sp.inTangents.length; i++) {
						itn.push([0,0]);
						otn.push([0,0]);
					}
				}
				sp.inTangents = itn;
				sp.outTangents = otn;
				p.setValue(sp);
			} else {
				sp = p.keyValue(p.selectedKeys[0]);
				sp.vertices = ary;
				var itn = [];
				var otn = [];
				if (sp.inTangents.length>0){
					for ( var i=0; i<sp.inTangents.length; i++) {
						itn.push([0,0]);
						otn.push([0,0]);
					}
				}
				sp.inTangents = itn;
				sp.outTangents = otn;
				p.setValueAtKey(p.selectedKeys[0],sp);
				
			}
			app.endUndoGroup();
		}
		
		if ( errMes != ""){
			alert(errMes,"パスの編集");
		}
	}
	//-------------------------------------------------------------------------
	function resize()
	{
		var b = winObj.bounds;
		var w = b[2] - b[0];
		var h = b[3] - b[1];
		
		if (w > 200){

			var nb = edPos.bounds;
			nb[2] = w -15;
			edPos.bounds = nb;

		} 
		
		if ( h>200){
			var nb = edPos.bounds;
			nb[3] = h -37;
			edPos.bounds = nb;

			var nb = btnDeleteCarve.bounds;
			nb[1] = h -31;
			nb[3] = h -31 + 22;
			btnDeleteCarve.bounds = nb;
		}
	}
	
	
	//-------------------------------------------------------------------------
	function chkCalc()
	{
		var ret = true;
		if ( (isNaN(edAddX.text)==true)||(edAddX.text == ""))  ret = false;
		if ( (isNaN(edAddY.text)==true)||(edAddY.text == ""))  ret = false;
		
		if ( ret == true) {
			if ( (edAddX.text*1 == 0)&&(edAddY.text*1 == 0)) ret = false;
		}
		btnCalc.enabled = ret;
	}
	//-------------------------------------------------------------------------
	winObj.addEventListener("resize",resize);
	winObj.onResize = resize;

	edPos.onChanging = function() { btnSet.enabled = (edPos.text != "");}
	edAddX.onChanging = edAddY.onChanging = function() { chkCalc();}

	btnGet.onClick  = function(){
		getPath();
	 	btnSet.enabled = (edPos.text != "");
	 }
	btnSet.onClick  = function(){
		setPath();
	 	btnSet.enabled = (edPos.text != "");
	}
	btnAdd.onClick  = function(){ addPoint();}
	btnCalc.onClick  = function(){ calc();}
	btnDeleteCarve.onClick  = function(){ deleteCurve();}
	//-------------------------------------------------------------------------
	if ( ( me instanceof Panel) == false){
		winObj.center(); 
		winObj.show();
	}
//-------------------------------------------------------------------------
})(this);