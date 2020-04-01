(function(me){
	//ファイル名のみ取り出す（拡張子付き）
	String.prototype.getName = function(){
		var r=this;var i=this.lastIndexOf("/");if(i>=0) r=this.substring(i+1);
		return r;
	}
	String.prototype.changeExt=function(s){
		var i=this.lastIndexOf(".");
		if(i>=0){return this.substring(0,i)+s;}else{return this + s; }
	}
	//----------------------------------
	var scriptName = File.decode($.fileName.getName().changeExt(""));
	var prefFile = new File($.fileName.changeExt(".pref"));
	var errMes ="";
	var time = 0;
	function err(s)
	{
		errMes += s +"\r\n";
	}
	//-------------------------------------------------------------------------
	function getPathSize(p)
	{
		var ret = new Object;
		ret.size = [100,100];
		ret.pos = [0,0];
		if ( (p instanceof Array) ==false) return ret;
		if ( p.length<=0) return ret;
		var minX = 99999;
		var maxX = -99999;
		var minY = 99999;
		var maxY = -99999;
		for (var i=0; i<p.length; i++){
			if ( (p[i] instanceof Array) == false) return ret;
			if ( minX>p[i][0]) minX = p[i][0];
			if ( maxX<p[i][0]) maxX = p[i][0];
			if ( minY>p[i][1]) minY = p[i][1];
			if ( maxY<p[i][1]) maxY = p[i][1];
		}
		ret.size = [ maxX - minX, maxY - minY];
		ret.pos = [ (maxX + minX)/2, (maxY + minY)/2];
		
		return ret;
	}
	//-----------------------------------------------------------------
	function getTargetSize()
	{
		var ret = null;
		var ac = app.project.activeItem;
		if ( ( ac instanceof CompItem)==false) return ret;
		var sl = ac.selectedLayers;
		if (sl.length!=1) return ret;
		var tLayer = sl[0];
		var sp = tLayer.selectedProperties;
		if (sp.length<=0) return ret;

		if ( (tLayer instanceof ShapeLayer)==false)  {
			var sz = null;
			if ( sp.length ==1){
				if ( sp[0].matchName =="ADBE Mask Atom"){
					sz =getPathSize(sp[0].property("ADBE Mask Shape").value.vertices);
				}else if (sp[0].matchName == "ADBE Mask Shape"){
					sz =getPathSize(sp[0].value.vertices);
				}else{
					return null;
				}
			}else{
				for ( var i=0; i<sp.length; i++){
					if ( sp[i].matchName =="ADBE Mask Shape"){
						sz =getPathSize(sp[i].value.vertices);
						break
					}
				}
			}
			if (sz !=null){
				var ret = new Object;
				ret.layer = tLayer;
				ret.parent = tLayer.property("ADBE Mask Parade");
				ret.size = sz.size;
				ret.pos = sz.pos;
				ret.x0 = ret.pos[0] - ret.size[0]/2;
				ret.x1 = ret.pos[0] + ret.size[0]/2;
				ret.y0 = ret.pos[1] - ret.size[1]/2;
				ret.y1 = ret.pos[1] + ret.size[1]/2;
				return ret;
			}else{
				return null;
			}
		}
		var ret = new Object;
		ret.size = [100,100];
		ret.pos =[0,0];
		ret.x0 = -50;
		ret.x1 = 50;
		ret.y0 = -50;
		ret.y1 = 50;
		ret.layer = tLayer;
		ret.parent = tLayer.property("ADBE Root Vectors Group");
		
		//まず
		var p = null;
		var pk = "";
		for ( var i=0; i<sp.length; sp++){
			var nm = sp[i].matchName;
			if ( nm == "ADBE Vector Shape - Rect"){
				p = sp[i];
				pk= "Rect";
				break;
			}else if ( nm == "ADBE Vector Shape - Ellipse"){
				p = sp[i];
				pk= "Ellipse";
				break;
			}else if ( nm == "ADBE Vector Shape - Star"){
				p = sp[i];
				pk= "Star";
				break;
			}else if ( nm == "ADBE Vector Shape - Group"){
				p = sp[i];
				pk= "Shape";
			}//ADBE Vector Shape - Group
			if ( nm.indexOf("ADBE Vector Rect ")>=0){
				p = sp[i].parentProperty;
				pk= "Rect";
				break;
			}
			if ( nm.indexOf("ADBE Vector Ellipse ")>=0){
				p = sp[i].parentProperty;
				pk= "Ellipse";
				break;
			}
			if ( nm.indexOf("ADBE Vector Star ")>=0){
				p = sp[i].parentProperty;
				pk= "Star";
				break;
			}
			if ( nm =="ADBE Vector Shape"){
				p = sp[i].parentProperty;
				pk= "Shape";
				break;
			}
		}
		if ( p== null){
			for ( var i=0; i<sp.length; sp++){
				var nm = sp[i].matchName;
				if ( nm == "ADBE Vector Group"){
					ret.parent = sp[i];
					break;
				}
			}
			return ret;
		}
		ret.parent = p.parentProperty;
		if ( pk=="Rect"){
			ret.size = p.property("ADBE Vector Rect Size").value;
			ret.pos = p.property("ADBE Vector Rect Position").value;
		}else if ( pk=="Ellipse"){
			var el = p.property("Size");
			ret.size = [].concat(el.value);
			var ps = p.property("Position").value;
			ret.pos = [].concat(ps);
		}else if ( pk=="Star"){ 
			var r = 2 * p.property("ADBE Vector Star Outer Radius").value;
			ret.size = [r,r];
			ret.pos = p.property("Position").value;
		}else if ( pk=="Shape"){
			var pp = p.property("ADBE Vector Shape").value;
			var sz = getPathSize(pp.vertices);
			ret.size = sz.size;
			ret.pos = sz.pos;
		}
		
		ret.x0 = ret.pos[0] - ret.size[0]/2;
		ret.x1 = ret.pos[0] + ret.size[0]/2;
		ret.y0 = ret.pos[1] - ret.size[1]/2;
		ret.y1 = ret.pos[1] + ret.size[1]/2;
		
		return ret;
	}

	//-------------------------------------------------------------------------
	function getTarget()
	{
		var ret =null;
		if ( (app.project.activeItem instanceof CompItem)==false) {
			err("コンポが選択されていません！");
			return ret;
		}
		var acitiveComp = app.project.activeItem;
		time = acitiveComp.time;
		var sp = acitiveComp.selectedProperties;
		if (sp.length<=0) {
			err("プロパティが選択されていません！");
			return ret;
		}
		for ( var i=0; i<sp.length; i++){
			var spN = sp[i].matchName;
			if (( spN =="ADBE Vector Shape")||( spN =="ADBE Mask Shape") ){
				ret = sp[i];
				break;
			}else if (spN == "ADBE Mask Atom") {
				ret = sp[i].property("ADBE Mask Shape");
				break;
			}else if (spN == "ADBE Vector Shape - Group") {
				ret = sp[i].property("ADBE Vector Shape");
				break;
			}
		}
		
		return ret;
	}
	//-------------------------------------------------------------------------
	var winObj = ( me instanceof Panel) ? me : new Window("palette", "パスの作成", [  44,   58,   44+ 206,   58+ 348] );
	//-------------------------------------------------------------------------
	
	//----------------------------------
	var triData = ["二等辺三角形(上)","二等辺三角形(右)","二等辺三角形(下)","二等辺三角形(左)","直角三角形(右下)","直角三角形(左下)","直角三角形(右上)","直角三角形(左上)" ];
	var lineData = ["中心から、上","中心から、右上","中心から、右","中心から、右下","中心から、下","中心から、左下","中心から、左","中心から、左上","＼左上から、右下","／左下から、右上","上から下（左)","上から下（中央)","上から下（右)","右から左（上）","右から左（中央）","右から左（下）" ];
	//----------------------------------
	var pnl2P = winObj.add("panel", [   8,    5,    8+ 190,    5+ 113], "直線:2点で指定" );
	pnl2P.graphics.font = ScriptUI.newFont("Tahoma",ScriptUI.FontStyle.REGULAR, 11);
	var stX0 = pnl2P.add("statictext", [   7,   13,    7+  20,   13+  16], "X0:");
	stX0.graphics.font = ScriptUI.newFont("Tahoma",ScriptUI.FontStyle.REGULAR, 11);
	var edX0 = pnl2P.add("edittext", [  28,    8,   28+  60,    8+  21], "0");
	edX0.graphics.font = ScriptUI.newFont("Tahoma",ScriptUI.FontStyle.REGULAR, 11);
	var stY0 = pnl2P.add("statictext", [  96,   13,   96+  20,   13+  16], "Y0:");
	stY0.graphics.font = ScriptUI.newFont("Tahoma",ScriptUI.FontStyle.REGULAR, 11);
	var edY0 = pnl2P.add("edittext", [ 117,    8,  117+  60,    8+  21], "0");
	edY0.graphics.font = ScriptUI.newFont("Tahoma",ScriptUI.FontStyle.REGULAR, 11);
	var stX1 = pnl2P.add("statictext", [   7,   49,    7+  20,   49+  16], "X1:");
	stX1.graphics.font = ScriptUI.newFont("Tahoma",ScriptUI.FontStyle.REGULAR, 11);
	var edX1 = pnl2P.add("edittext", [  28,   44,   28+  60,   44+  21], "100");
	edX1.graphics.font = ScriptUI.newFont("Tahoma",ScriptUI.FontStyle.REGULAR, 11);
	var stY1 = pnl2P.add("statictext", [  96,   49,   96+  20,   49+  16], "Y1:");
	stY1.graphics.font = ScriptUI.newFont("Tahoma",ScriptUI.FontStyle.REGULAR, 11);
	var edY1 = pnl2P.add("edittext", [ 117,   44,  117+  60,   44+  21], "100");
	edY1.graphics.font = ScriptUI.newFont("Tahoma",ScriptUI.FontStyle.REGULAR, 11);
	var btnSet2P = pnl2P.add("button", [ 104,   71,  104+  75,   71+  23], "SET" );
	btnSet2P.graphics.font = ScriptUI.newFont("Tahoma",ScriptUI.FontStyle.REGULAR, 11);
	var pnlRot = winObj.add("panel", [   8,  123,    8+ 190,  123+ 105], "直線:角度で指定" );
	pnlRot.graphics.font = ScriptUI.newFont("Tahoma",ScriptUI.FontStyle.REGULAR, 11);
	var stX = pnlRot.add("statictext", [   7,   17,    7+  20,   17+  16], "X:");
	stX.graphics.font = ScriptUI.newFont("Tahoma",ScriptUI.FontStyle.REGULAR, 11);
	var edX = pnlRot.add("edittext", [  30,   12,   30+  62,   12+  21], "0");
	edX.graphics.font = ScriptUI.newFont("Tahoma",ScriptUI.FontStyle.REGULAR, 11);
	var stY = pnlRot.add("statictext", [  95,   15,   95+  20,   15+  16], "Y:");
	stY.graphics.font = ScriptUI.newFont("Tahoma",ScriptUI.FontStyle.REGULAR, 11);
	var edY = pnlRot.add("edittext", [ 117,   12,  117+  62,   12+  21], "0");
	edY.graphics.font = ScriptUI.newFont("Tahoma",ScriptUI.FontStyle.REGULAR, 11);
	var stLen = pnlRot.add("statictext", [   6,   44,    6+  27,   44+  16], "長さ");
	stLen.graphics.font = ScriptUI.newFont("Tahoma",ScriptUI.FontStyle.REGULAR, 11);
	var edLen = pnlRot.add("edittext", [  38,   39,   38+  50,   39+  21], "100");
	edLen.graphics.font = ScriptUI.newFont("Tahoma",ScriptUI.FontStyle.REGULAR, 11);
	var stRot = pnlRot.add("statictext", [  92,   42,   92+  32,   42+  16], "角度");
	stRot.graphics.font = ScriptUI.newFont("Tahoma",ScriptUI.FontStyle.REGULAR, 11);
	var edRot = pnlRot.add("edittext", [ 128,   39,  128+  51,   39+  21], "45");
	edRot.graphics.font = ScriptUI.newFont("Tahoma",ScriptUI.FontStyle.REGULAR, 11);
	var btnSetRot = pnlRot.add("button", [ 103,   64,  103+  75,   64+  23], "SET" );
	btnSetRot.graphics.font = ScriptUI.newFont("Tahoma",ScriptUI.FontStyle.REGULAR, 11);
	var pnlMk = winObj.add("panel", [   8,  234,    8+ 190,  234+ 101], "パーツから作成" );
	pnlMk.graphics.font = ScriptUI.newFont("Tahoma",ScriptUI.FontStyle.REGULAR, 11);
	var btnMkRect = pnlMk.add("button", [   6,    8,    6+  64,    8+  23], "長方形" );
	btnMkRect.graphics.font = ScriptUI.newFont("Tahoma",ScriptUI.FontStyle.REGULAR, 11);
	var btnMkTri = pnlMk.add("button", [   5,   34,    5+  64,   34+  23], "三角形" );
	btnMkTri.graphics.font = ScriptUI.newFont("Tahoma",ScriptUI.FontStyle.REGULAR, 11);
	var btnMkLine = pnlMk.add("button", [   5,   61,    5+  64,   61+  23], "直線" );
	btnMkLine.graphics.font = ScriptUI.newFont("Tahoma",ScriptUI.FontStyle.REGULAR, 11);
	var cmbTri = pnlMk.add("dropdownlist", [  75,   36,   75+ 102,   36+  21], triData);
	cmbTri.items[1].selected = true;
	cmbTri.graphics.font = ScriptUI.newFont("Tahoma",ScriptUI.FontStyle.REGULAR, 11);
	var cmbLine = pnlMk.add("dropdownlist", [  74,   63,   74+ 103,   63+  21], lineData);
	cmbLine.items[1].selected = true;
	cmbLine.graphics.font = ScriptUI.newFont("Tahoma",ScriptUI.FontStyle.REGULAR, 11);

	//-------------------------------------------------------------------------
	function savePref()
	{
		var p = new Object;
		p.x0 = 0;
		p.y0 = 0;
		p.x1 = 100;
		p.y1 = 100;
		p.x = 0;
		p.y = 0;
		p.len = 100;
		p.rot = 45;
		
		if ( isNaN(edX0.text)==false) p.x0 = edX0.text * 1;
		if ( isNaN(edY0.text)==false) p.y0 = edY0.text * 1;
		if ( isNaN(edX1.text)==false) p.x1 = edX1.text * 1;
		if ( isNaN(edY1.text)==false) p.y1 = edY1.text * 1;

		if ( isNaN(edX.text)==false) p.x = edX.text * 1;
		if ( isNaN(edY.text)==false) p.y = edY.text * 1;
		if ( isNaN(edLen.text)==false) p.len = edLen.text * 1;
		if ( isNaN(edRot.text)==false) p.rot = edRot.text * 1;
		
		p.triIndex = cmbTri.selection.index;
		p.lineIndex = cmbLine.selection.index;
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
		
		if (p.x0 != undefined) edX0.text = p.x0 +"";
		if (p.y0 != undefined) edY0.text = p.y0 +"";
		if (p.x1 != undefined) edX1.text = p.x1 +"";
		if (p.y1 != undefined) edY1.text = p.y1 +"";

		if (p.x != undefined) edX.text = p.x +"";
		if (p.y != undefined) edY.text = p.y +"";
		if (p.len != undefined) edLen.text = p.len +"";
		if (p.rot != undefined) edRot.text = p.rot +"";

		if (p.triIndex != undefined)
			cmbTri.items[p.triIndex].selected = true;
		if (p.lineIndex != undefined)
			cmbLine.items[p.lineIndex].selected = true;
	}
	loadPref();
	//-------------------------------------------------------------------------
	function mkRect()
	{
		var ret = getTargetSize();
		if ( ret == null) {
			alert("シェイプを選んでください。");
			return;
		}
		var ary = [];
		ary.push([ret.x0,ret.y0]);
		ary.push([ret.x1,ret.y0]);
		ary.push([ret.x1,ret.y1]);
		ary.push([ret.x0,ret.y1]);
		
		var sp = new Shape;
		sp.vertices = ary;
		sp.closed = true;
		app.beginUndoGroup("長方形パスの作成");
		if ( ret.parent.matchName == "ADBE Mask Parade"){
			var pg = ret.parent.addProperty("ADBE Mask Atom");
			var pp = pg.property("ADBE Mask Shape");
			pp.setValue(sp);
		}else{
			var pg = ret.parent.addProperty("ADBE Vector Shape - Group");
			var pp = pg.property("ADBE Vector Shape");
			pp.setValue(sp);
		}
		app.endUndoGroup();
	}
	//-------------------------------------------------------------------------
	function mkTri()
	{
		var ret = getTargetSize();
		if ( ret == null) {
			alert("シェイプを選んでください。");
			return;
		}
		var idx = cmbTri.selection.index;
		var ary = [];
		switch(idx)
		{
			//0"二等辺三角形(上)",
			case 0:
				ary.push([ret.pos[0],ret.y0]);
				ary.push([ret.x1,ret.y1]);
				ary.push([ret.x0,ret.y1]);
				break;
			//1"二等辺三角形(右)",
			case 1:
				ary.push([ret.x1,ret.pos[1]]);
				ary.push([ret.x0,ret.y1]);
				ary.push([ret.x0,ret.y0]);
				break;
			//2"二等辺三角形(下)",
			case 2:
				ary.push([ret.pos[0],ret.y1]);
				ary.push([ret.x0,ret.y0]);
				ary.push([ret.x1,ret.y0]);
				break;
			//3"二等辺三角形(左)",
			case 3:
				ary.push([ret.x0,ret.pos[1]]);
				ary.push([ret.x1,ret.y0]);
				ary.push([ret.x1,ret.y1]);
				break;
			//4"直角三角形(右下)",
			case 4:
				ary.push([ret.x1,ret.y0]);
				ary.push([ret.x1,ret.y1]);
				ary.push([ret.x0,ret.y1]);
				break;
			//5"直角三角形(左下)",
			case 5:
				ary.push([ret.x0,ret.y0]);
				ary.push([ret.x1,ret.y1]);
				ary.push([ret.x0,ret.y1]);
				break;
			//6"直角三角形(右上)",
			case 6:
				ary.push([ret.x0,ret.y0]);
				ary.push([ret.x1,ret.y0]);
				ary.push([ret.x1,ret.y1]);
				break;
			//7"直角三角形(左上)" ];
			case 7:
				ary.push([ret.x0,ret.y0]);
				ary.push([ret.x1,ret.y0]);
				ary.push([ret.x0,ret.y1]);
				break;
		}
		var sp = new Shape;
		sp.vertices = ary;
		sp.closed = true;
		app.beginUndoGroup("三角形パスの作成");
		if ( ret.parent.matchName == "ADBE Mask Parade"){
			var pg = ret.parent.addProperty("ADBE Mask Atom");
			var pp = pg.property("ADBE Mask Shape");
			pp.setValue(sp);
		}else{
			var pg = ret.parent.addProperty("ADBE Vector Shape - Group");
			var pp = pg.property("ADBE Vector Shape");
			pp.setValue(sp);
		}
		app.endUndoGroup();
	}
	//-------------------------------------------------------------------------
	function mkLine()
	{
		var ret = getTargetSize();
		if ( ret == null) {
			alert("シェイプを選んでください。");
			return;
		}
		/*
		*/
		var idx = cmbLine.selection.index;
		var ary = [];
		switch(idx)
		{
			//0"中心から、上",
			case 0:
				ary.push([ret.pos[0],ret.pos[1]]);
				ary.push([ret.pos[0],ret.y0]);
				break;
			//1"中心から、右上",
			case 1:
				ary.push([ret.pos[0],ret.pos[1]]);
				ary.push([ret.x1,ret.y0]);
				break;
			//2"中心から、右,
			case 2:
				ary.push([ret.pos[0],ret.pos[1]]);
				ary.push([ret.x1,ret.pos[1]]);
				break;
			//3"中心から、右下",
			case 3:
				ary.push([ret.pos[0],ret.pos[1]]);
				ary.push([ret.x1,ret.y1]);
				break;
			//4"中心から、下",
			case 4:
				ary.push([ret.pos[0],ret.pos[1]]);
				ary.push([ret.pos[0],ret.y1]);
				break;
			//5"中心から、左下",
			case 5:
				ary.push([ret.pos[0],ret.pos[1]]);
				ary.push([ret.x0,ret.y1]);
				break;
			//6"中心から、左",
			case 6:
				ary.push([ret.pos[0],ret.pos[1]]);
				ary.push([ret.x0,ret.pos[1]]);
				break;
			//7"中心から、左上",
			case 7:
				ary.push([ret.pos[0],ret.pos[1]]);
				ary.push([ret.x0,ret.y0]);
				break;
			//8"＼左上から、右下",
			case 8:
				ary.push([ret.x0,ret.y0]);
				ary.push([ret.x1,ret.y1]);
				break;
			//9"／左下から、右上",
			case 9:
				ary.push([ret.x0,ret.y1]);
				ary.push([ret.x1,ret.y0]);
				break;
			//10"上から下（左)",
			case 10:
				ary.push([ret.x1,ret.y0]);
				ary.push([ret.x1,ret.y1]);
				break;
			//11"上から下（中央)",
			case 11:
				ary.push([ret.pos[0],ret.y0]);
				ary.push([ret.pos[0],ret.y1]);
				break;
			//12"上から下（右)",
			case 12:
				ary.push([ret.x0,ret.y0]);
				ary.push([ret.x0,ret.y1]);
				break;
			//13"右から左（上）",
			case 13:
				ary.push([ret.x0,ret.y0]);
				ary.push([ret.x1,ret.y0]);
				break;
			//14"右から左（中央）",
			case 14:
				ary.push([ret.x0,ret.pos[1]]);
				ary.push([ret.x1,ret.pos[1]]);
				break;
			//15"右から左（下）" ];
			case 15:
				ary.push([ret.x0,ret.y1]);
				ary.push([ret.x1,ret.y1]);
				break;
		}
		
		var sp = new Shape;
		sp.vertices = ary;
		sp.closed = true;
		app.beginUndoGroup("直線パスの作成");
		if ( ret.parent.matchName == "ADBE Mask Parade"){
			var pg = ret.parent.addProperty("ADBE Mask Atom");
			var pp = pg.property("ADBE Mask Shape");
			pp.setValue(sp);
		}else{
			var pg = ret.parent.addProperty("ADBE Vector Shape - Group");
			var pp = pg.property("ADBE Vector Shape");
			pp.setValue(sp);
		}
		app.endUndoGroup();
	}

	//-------------------------------------------------------------------------
	function setPath2Point()
	{
		errMes = "";
		var p = getTarget();
		if ( p== null) err("パスを選択してください。");
		if ( isNaN(edX0.text)==true) err("x0が不正な数値です。");
		if ( isNaN(edY0.text)==true) err("y0が不正な数値です。");
		if ( isNaN(edX1.text)==true) err("x1が不正な数値です。");
		if ( isNaN(edY1.text)==true) err("y1が不正な数値です。");
		if (errMes !=""){
			alert(errMes);
			return;
		}
		var x0 = edX0.text * 1;
		var y0 = edY0.text * 1;
		var x1 = edX1.text * 1;
		var y1 = edY1.text * 1;
		
		app.beginUndoGroup(scriptName +"2点");
		var sp = new Shape;
		sp.closed = false;
		sp.vertices = [[x0,y0],[x1,y1]];
		if ( p.numKeys<=0){
			p.setValue(sp);
		}else{
			p.setValueAtTime(time,sp);
		}
	}
	//-------------------------------------------------------------------------
	function setPathRot()
	{
		errMes = "";
		var p = getTarget();
		if ( p== null) err("パスを選択してください。");
		if ( isNaN(edX.text)==true) err("xが不正な数値です。");
		if ( isNaN(edY.text)==true) err("yが不正な数値です。");
		if ( isNaN(edLen.text)==true) err("Lengthが不正な数値です。");
		if ( isNaN(edRot.text)==true) err("Rorationが不正な数値です。");
		if (errMes !=""){
			alert(errMes);
			return;
		}
		var x = edX.text * 1;
		var y = edY.text * 1;
		var l = edLen.text * 1;
		var r = edRot.text * 1;
		if ( l<0){
			r += 180;
			l = Math.abs(l);
		}
		r %= 360;
		if ( r<0) r+= 360;

		var x1 =x;
		var y1 =y; 
		
		if ( (r>=0)&&(r<90) ) {
			x1 =Math.sin((Math.PI/180)*r)*l;
			y1 =Math.cos((Math.PI/180)*r)*l*-1;
		}else if (( r>=90)&&(r<180)) {
			x1 =Math.cos((Math.PI/180)*(r-90))*l;
			y1 =Math.sin((Math.PI/180)*(r-90))*l;
		}else if ( (r>=180)&&(r<270) ) {
			x1 =Math.sin((Math.PI/180)*(r-180))*l*-1;
			y1 =Math.cos((Math.PI/180)*(r-180))*l;
		}else if ( (r>=270)&&(r<360) ) {
			x1 =Math.cos((Math.PI/180)*(r-270))*l*-1;
			y1 =Math.sin((Math.PI/180)*(r-270))*l*-1;
		}

		app.beginUndoGroup(scriptName +"角度");
		var sp = new Shape;
		sp.closed = false;
		sp.vertices = [[x,y],[x + x1,y + y1]];
		if ( p.numKeys<=0){
			p.setValue(sp);
		}else{
			p.setValueAtTime(time,sp);
		}

		
	}
	//-------------------------------------------------------------------------
	btnSet2P.onClick = setPath2Point;
	btnSetRot.onClick = setPathRot;

	btnMkRect.onClick = mkRect;
	btnMkTri.onClick = mkTri;
	btnMkLine.onClick = mkLine;

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