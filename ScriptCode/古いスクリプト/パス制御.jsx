
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
	var currentTime =0;
	function err(s)
	{
		errMes += s +"\r\n";
	}
	//-----------------------------------------------------------------
	function getTargetPath()
	{
		var ac = app.project.activeItem;
		if ( ( ac instanceof CompItem)==false) return null;
		currentTime =ac.time;
		var sl = ac.selectedLayers;
		if (sl.length!=1) return null;
		var tLayer = sl[0];
		var sp = tLayer.selectedProperties;
		if ( sp.length<=0) return null;

		var ret = new Object;
		ret.target = null;
		ret.comp = ac;
		ret.layer = tLayer;
		ret.time = ac.time;

		if ( (tLayer instanceof ShapeLayer)==false)  {
			if ( sp.length ==1) {
				var nm = sp[0].matchName;
				if ( nm == "ADBE Mask Atom"){
					ret.target = sp[0].property("ADBE Mask Shape")
					return ret;
				}else if ( nm == "ADBE Mask Shape"){
					ret.target = sp[0]
					return ret;
				}
			}else{
				for ( var i=0;i<sp.length; i++){
					var nm = sp[i].matchName;
					if ( nm == "ADBE Mask Shape"){
						ret.target = sp[i]
						return ret;
					}
				}
			}
			return null;
		}
		if ( sp.length ==1) {
			var nm = sp[0].matchName;
			if ( nm == "ADBE Vector Shape - Group"){
				ret.target = sp[0].property("ADBE Vector Shape")
				return ret;
			}else if ( nm == "ADBE Vector Shape"){
				ret.target = sp[0];
				return ret;
			}
		}else{
			for ( var i=0;i<sp.length; i++){
				var nm = sp[i].matchName;
				if ( nm == "ADBE Vector Shape"){
					ret.target = sp[i];
					return ret;
				}
			}
		}
		return null;
	}
	//-----------------------------------------------------------------
	//-------------------------------------------------------------------------
	function getTarget()
	{
		var ret = [];
		
		function addP(p)
		{
			if ( ret.length>0) {
				for ( var i=ret.length-1; i>=0; i--){
					if ( ret[i].id == p.id){
						return;
					}
				}
			}
			ret.push(p);
		}
		if ( (app.project.activeItem instanceof CompItem)==false) {
			err("コンポが選択されていません！");
			return ret;
		}
		var acitiveComp = app.project.activeItem;
		currentTime = acitiveComp.time;
		
		var sp = acitiveComp.selectedProperties;
		if (sp.length<=0) {
			err("プロパティが選択されていません！");
			return ret;
		}
		for ( var i=0; i<sp.length; i++){
			var spN = sp[i].matchName;
			if (( spN =="ADBE Vector Shape")||( spN =="ADBE Mask Shape") ){
				addP(sp[i]);
			}else if (spN == "ADBE Mask Atom") {
				addP(sp[i].property("ADBE Mask Shape"));
				break;
			}else if (spN == "ADBE Vector Shape - Group") {
				addP(sp[i].property("ADBE Vector Shape"));
				break;
			}
		}
		return ret;
	}
	//---------------------------------
	function getArea(vert)
	{
		var cnt = vert.length;
		if ( cnt<=0) return null;
		//まず範囲を調べる
		var xMin = 99999;
		var xMax = -99999;
		var yMin = 99999;
		var yMax = -99999;
		for ( var i=0; i<cnt; i++){
			var pos = vert[i];
			if ( xMin>pos[0]) xMin = pos[0];
			if ( xMax<pos[0]) xMax = pos[0];
			if ( yMin>pos[1]) yMin = pos[1];
			if ( yMax<pos[1]) yMax = pos[1];
		}
		
		return  {
			left: xMin,
			top: yMin,
			right: xMax,
			bottom: yMax,
			count: cnt
		};
	}
	//---------------------------------
	function autoExe(p,func,mode)
	{
		if ( p.numKeys <=0) {
			var sp = p.value;
			sp = func(sp,mode);
			p.setValue(sp);
		}else{
			if ( (p.selectedKeys.length==0)||( p.selectedKeys.length==p.numKeys)){
				for ( var i=1; i<=p.numKeys; i++){
					var sp = p.keyValue(i);
					sp = func(sp,mode);
					p.setValueAtKey(i,sp);
				}
			}else{
				for ( var i=0; i<p.selectedKeys.length; i++){
					var idx = p.selectedKeys[i];
					var sp = p.keyValue(idx);
					sp = func(sp,mode);
					p.setValueAtKey(idx,sp);
				}
			}
		}
	}
	//---------------------------------
	function revVer(p,mode)
	{
		function ver(sp,mode)
		{
			var ret = getArea(sp.vertices);
			if ( ret == null) {
				err(p.parentProperty.name + " パスがありません");
				return;
			}
			var cX  = 0;
			switch(mode)
			{
				case 0:
					cX = (ret.left + ret.right)/2;
					break;
				case 1:
					cX = ret.left;
					break;
				case 2:
					cX = ret.right;
					break;
			}
			//左右反転
			var v = [];
			var inT = [];
			var outT = [];
			for ( var i=0; i<ret.count; i++){
				var pX = sp.vertices[i][0];
				var pY = sp.vertices[i][1];
				pX = cX + (cX - pX);
				v.push( [pX,pY]);
				
				var pX = sp.inTangents[i][0];
				var pY = sp.inTangents[i][1];
				inT.push( [-pX,pY]);
				var pX = sp.outTangents[i][0];
				var pY = sp.outTangents[i][1];
				outT.push( [-pX,pY]);

			}
			sp.vertices = v;
			sp.inTangents = inT;
			sp.outTangents = outT;
			return sp;
		}
		autoExe(p,ver,mode);
	}
	//---------------------------------
	function revHor(p,mode)
	{
		function hor(sp,mode)
		{
			var ret = getArea(sp.vertices);
			if ( ret == null) {
				err(p.parentProperty.name + " パスがありません");
				return;
			}
			//左を求める
			//3:上下中央
			//4:上
			//5:下
			var cY = 0;
			switch(mode)
			{
				case 0:
					cY = (ret.top + ret.bottom)/2;
					break;
				case 1:
					cY = ret.top;
					break;
				case 2:
					cY = ret.bottom;
					break;
			}
			//左右反転
			var v = [];
			var inT = [];
			var outT = [];
			for ( var i=0; i<ret.count; i++){
				var pX = sp.vertices[i][0];
				var pY = sp.vertices[i][1];
				
				pY = cY + (cY - pY);
				v.push( [pX,pY]);

				var pX = sp.inTangents[i][0];
				var pY = sp.inTangents[i][1];
				inT.push( [pX,-pY]);
				var pX = sp.outTangents[i][0];
				var pY = sp.outTangents[i][1];
				outT.push( [pX,-pY]);
			}
			sp.vertices = v;
			sp.inTangents = inT;
			sp.outTangents = outT;
			return sp;
		}
		autoExe(p,hor,mode);
		
	}
	//-------------------------------------------------------------------------
	function execVer(mode,s)
	{
		errMes = "";
		var targets = getTarget();
		if ( targets.length>0){
			app.beginUndoGroup(s);
			for ( var i=0; i<targets.length; i++) { revVer(targets[i],mode); }
			app.endUndoGroup();
		}else{
			err("マスクパス・シェイプパスが選択されていません！");
		}
		
		if (errMes != "") {
			alert(errMes ,s);
		}
		
	}
	//-------------------------------------------------------------------------
	function execHor(mode,s)
	{
		errMes = "";
		var targets = getTarget();
		if ( targets.length>0){
			app.beginUndoGroup(s);
			for ( var i=0; i<targets.length; i++) { revHor(targets[i],mode); }
			app.endUndoGroup();
		}else{
			err("マスクパス・シェイプパスが選択されていません！");
		}
		
		if (errMes != "") {
			alert(errMes ,s);
		}
		
	}
	//---------------------------------
	function turnRight(p)
	{
		function turnRightSub(sp)
		{
			var ret = getArea(sp.vertices);
			if ( ret == null) {
				err(p.parentProperty.name + " パスがありません");
				return;
			}
			//中央を求める
			var cX = (ret.left + ret.right)/2;
			var cY = (ret.top + ret.bottom)/2;
			//左右反転
			var v = [];
			var inT = [];
			var outT = [];
			for ( var i=0; i<ret.count; i++){
				var pX = cX + (cY - sp.vertices[i][1]);
				var pY = cY + (cX - sp.vertices[i][0])*-1;
				
				v.push( [pX,pY]);

				var pX = sp.inTangents[i][0];
				var pY = sp.inTangents[i][1];
				inT.push( [-pY,pX]);
				var pX = sp.outTangents[i][0];
				var pY = sp.outTangents[i][1];
				outT.push( [-pY,pX]);
			}
			sp.vertices = v;
			sp.inTangents = inT;
			sp.outTangents = outT;
			return sp;
		}

		errMes = "";

		var targets = getTarget();
		if ( targets.length>0){
			app.beginUndoGroup("右90度回転");
			for ( var i=0; i<targets.length; i++) { autoExe(targets[i],turnRightSub); }
			app.endUndoGroup();
		}else{
			err("マスクパス・シェイプパスが選択されていません！");
		}
		
		if (errMes != "") {
			alert(errMes ,"右90度回転");
		}
		

	}
	//---------------------------------
	function turnLeft(p)
	{
		function turnLeftSub(sp)
		{
			var ret = getArea(sp.vertices);
			if ( ret == null) {
				err(p.parentProperty.name + " パスがありません");
				return;
			}
			//中央を求める
			var cX = (ret.left + ret.right)/2;
			var cY = (ret.top + ret.bottom)/2;
			//左右反転
			var v = [];
			var inT = [];
			var outT = [];
			for ( var i=0; i<ret.count; i++){
				var pX = cX + (cY - sp.vertices[i][1])*-1;
				var pY = cY + (cX - sp.vertices[i][0]);
				
				v.push( [pX,pY]);

				var pX = sp.inTangents[i][0];
				var pY = sp.inTangents[i][1];
				inT.push( [pY,-pX]);
				var pX = sp.outTangents[i][0];
				var pY = sp.outTangents[i][1];
				outT.push( [pY,-pX]);
			}
			sp.vertices = v;
			sp.inTangents = inT;
			sp.outTangents = outT;
			return sp;
		}

		errMes = "";

		var targets = getTarget();
		if ( targets.length>0){
			app.beginUndoGroup("左90度回転");
			for ( var i=0; i<targets.length; i++) { autoExe(targets[i],turnLeftSub); }
			app.endUndoGroup();
		}else{
			err("マスクパス・シェイプパスが選択されていません！");
		}
		
		if (errMes != "") {
			alert(errMes ,"左90度回転");
		}
		

	}
	//---------------------------------
	function turnBack(p)
	{
		function turnBackSub(sp)
		{
			var ret = getArea(sp.vertices);
			if ( ret == null) {
				err(p.parentProperty.name + " パスがありません");
				return;
			}
			//中央を求める
			var cX = (ret.left + ret.right)/2;
			var cY = (ret.top + ret.bottom)/2;
			//左右反転
			var v = [];
			var inT = [];
			var outT = [];
			for ( var i=0; i<ret.count; i++){
				var pX = cX + (cX - sp.vertices[i][0])*1;
				var pY = cY + (cY - sp.vertices[i][1])*1;
				
				v.push( [pX,pY]);

				var pX = sp.inTangents[i][0];
				var pY = sp.inTangents[i][1];
				inT.push( [-pX,-pY]);
				var pX = sp.outTangents[i][0];
				var pY = sp.outTangents[i][1];
				outT.push( [-pX,-pY]);
			}
			sp.vertices = v;
			sp.inTangents = inT;
			sp.outTangents = outT;
			return sp;
		}

		errMes = "";

		var targets = getTarget();
		if ( targets.length>0){
			app.beginUndoGroup("180度回転");
			for ( var i=0; i<targets.length; i++) { autoExe(targets[i],turnBackSub); }
			app.endUndoGroup();
		}else{
			err("マスクパス・シェイプパスが選択されていません！");
		}
		
		if (errMes != "") {
			alert(errMes ,"180回転");
		}
		

	}
	//-----------------------------------------------------------------
	var mvData = ["1","2","3","4","5","6","7","8","9","10","12","15","20","30","50","60","80","100" ];

	//-------------------------------------------------------------------------
	var winObj = ( me instanceof Panel) ? me : new Window("palette", "パス制御", [ 856,  287,  856+ 199,  287+ 536] );
	//-------------------------------------------------------------------------
var pnlMove = winObj.add("panel", [   2,    2,    2+ 191,    2+ 104], "パスの移動" );
	pnlMove.graphics.font = ScriptUI.newFont("Tahoma",ScriptUI.FontStyle.REGULAR, 11);
	var btnMv_7 = pnlMove.add("button", [  17,   12,   17+  32,   12+  24], "" );
	btnMv_7.graphics.font = ScriptUI.newFont("Tahoma",ScriptUI.FontStyle.REGULAR, 11);
	var btnMv_0 = pnlMove.add("button", [  52,   12,   52+  32,   12+  24], "上" );
	btnMv_0.graphics.font = ScriptUI.newFont("Tahoma",ScriptUI.FontStyle.BOLD, 11);
	var btnMv_1 = pnlMove.add("button", [  89,   12,   89+  32,   12+  24], "" );
	btnMv_1.graphics.font = ScriptUI.newFont("Tahoma",ScriptUI.FontStyle.REGULAR, 11);
	var btnMv_2 = pnlMove.add("button", [  89,   38,   89+  32,   38+  24], "左" );
	btnMv_2.graphics.font = ScriptUI.newFont("Tahoma",ScriptUI.FontStyle.BOLD, 11);
	var btnMv_3 = pnlMove.add("button", [  89,   65,   89+  32,   65+  24], "" );
	btnMv_3.graphics.font = ScriptUI.newFont("Tahoma",ScriptUI.FontStyle.REGULAR, 11);
	var btnMv_4 = pnlMove.add("button", [  52,   65,   52+  32,   65+  24], "下" );
	btnMv_4.graphics.font = ScriptUI.newFont("Tahoma",ScriptUI.FontStyle.BOLD, 11);
	var btnMv_5 = pnlMove.add("button", [  17,   65,   17+  32,   65+  24], "" );
	btnMv_5.graphics.font = ScriptUI.newFont("Tahoma",ScriptUI.FontStyle.REGULAR, 11);
	var btnMv_6 = pnlMove.add("button", [  17,   38,   17+  32,   38+  24], "左" );
	btnMv_6.graphics.font = ScriptUI.newFont("Tahoma",ScriptUI.FontStyle.BOLD, 11);
	var edMove = pnlMove.add("edittext", [ 126,   12,  126+  52,   12+  21], "");
	edMove.graphics.font = ScriptUI.newFont("Tahoma",ScriptUI.FontStyle.REGULAR, 11);
	var cmbMv = pnlMove.add("dropdownlist", [ 126,   39,  126+  52,   39+  21], mvData);
	cmbMv.items[0].selected = true;
	cmbMv.graphics.font = ScriptUI.newFont("Tahoma",ScriptUI.FontStyle.REGULAR, 11);
	var pnlRot = winObj.add("panel", [   3,  225,    3+ 190,  225+  88], "シェイプパスの回転" );
	pnlRot.graphics.font = ScriptUI.newFont("Tahoma",ScriptUI.FontStyle.REGULAR, 11);
	var btnLeftRot = pnlRot.add("button", [   5,   12,    5+  84,   12+  24], "左90度回転" );
	btnLeftRot.graphics.font = ScriptUI.newFont("Tahoma",ScriptUI.FontStyle.REGULAR, 11);
	var btnRightRot = pnlRot.add("button", [  95,   12,   95+  84,   12+  24], "右90度回転" );
	btnRightRot.graphics.font = ScriptUI.newFont("Tahoma",ScriptUI.FontStyle.REGULAR, 11);
	var btnTurn = pnlRot.add("button", [  37,   42,   37+ 113,   42+  24], "180度回転" );
	btnTurn.graphics.font = ScriptUI.newFont("Tahoma",ScriptUI.FontStyle.REGULAR, 11);
	var pnlScale = winObj.add("panel", [   3,  319,    3+ 190,  319+ 124], "パスの拡大・縮小" );
	pnlScale.graphics.font = ScriptUI.newFont("Tahoma",ScriptUI.FontStyle.REGULAR, 11);
	var stSX = pnlScale.add("statictext", [  11,   13,   11+  71,   13+  18], "スケールX(%)");
	stSX.graphics.font = ScriptUI.newFont("Tahoma",ScriptUI.FontStyle.REGULAR, 11);
	var edScale = pnlScale.add("edittext", [  88,   10,   88+  62,   10+  21], "100");
	edScale.graphics.font = ScriptUI.newFont("Tahoma",ScriptUI.FontStyle.REGULAR, 11);
	var stSY = pnlScale.add("statictext", [  11,   37,   11+  71,   37+  18], "スケールY(%)");
	stSY.graphics.font = ScriptUI.newFont("Tahoma",ScriptUI.FontStyle.REGULAR, 11);
	var edScaleY = pnlScale.add("edittext", [  88,   34,   88+  62,   34+  21], "100");
	edScaleY.graphics.font = ScriptUI.newFont("Tahoma",ScriptUI.FontStyle.REGULAR, 11);
	var rbS0 = pnlScale.add("radiobutton", [  14,   56,   14+  16,   56+  16], "");
	rbS0.graphics.font = ScriptUI.newFont("Tahoma",ScriptUI.FontStyle.REGULAR, 11);
	var rbS1 = pnlScale.add("radiobutton", [  36,   56,   36+  16,   56+  16], "");
	rbS1.graphics.font = ScriptUI.newFont("Tahoma",ScriptUI.FontStyle.REGULAR, 11);
	var rbS2 = pnlScale.add("radiobutton", [  58,   56,   58+  16,   56+  16], "");
	rbS2.graphics.font = ScriptUI.newFont("Tahoma",ScriptUI.FontStyle.REGULAR, 11);
	var rbS3 = pnlScale.add("radiobutton", [  14,   74,   14+  16,   74+  16], "");
	rbS3.graphics.font = ScriptUI.newFont("Tahoma",ScriptUI.FontStyle.REGULAR, 11);
	var rbS4 = pnlScale.add("radiobutton", [  36,   74,   36+  16,   74+  16], "");
	rbS4.value = true;
	rbS4.graphics.font = ScriptUI.newFont("Tahoma",ScriptUI.FontStyle.REGULAR, 11);
	var rbS5 = pnlScale.add("radiobutton", [  58,   74,   58+  16,   74+  16], "");
	rbS5.graphics.font = ScriptUI.newFont("Tahoma",ScriptUI.FontStyle.REGULAR, 11);
	var rbS6 = pnlScale.add("radiobutton", [  14,   92,   14+  16,   92+  16], "");
	rbS6.graphics.font = ScriptUI.newFont("Tahoma",ScriptUI.FontStyle.REGULAR, 11);
	var rbS7 = pnlScale.add("radiobutton", [  36,   92,   36+  16,   92+  16], "");
	rbS7.graphics.font = ScriptUI.newFont("Tahoma",ScriptUI.FontStyle.REGULAR, 11);
	var rbS8 = pnlScale.add("radiobutton", [  58,   92,   58+  16,   92+  16], "");
	rbS8.graphics.font = ScriptUI.newFont("Tahoma",ScriptUI.FontStyle.REGULAR, 11);
	var cbScaleY = pnlScale.add("checkbox", [  88,   58,   88+  96,   58+  24], "Yを有効にする");
	cbScaleY.graphics.font = ScriptUI.newFont("Tahoma",ScriptUI.FontStyle.REGULAR, 11);
	var btnSetScale = pnlScale.add("button", [  88,   83,   88+  75,   83+  23], "SET" );
	btnSetScale.graphics.font = ScriptUI.newFont("Tahoma",ScriptUI.FontStyle.REGULAR, 11);
	var pnlRev = winObj.add("panel", [   2,  110,    2+ 191,  110+ 109], "シェイプパスの反転" );
	pnlRev.graphics.font = ScriptUI.newFont("Tahoma",ScriptUI.FontStyle.REGULAR, 11);
	var btnVer = pnlRev.add("button", [  14,   12,   14+  64,   12+  24], "中央・左右" );
	btnVer.graphics.font = ScriptUI.newFont("Tahoma",ScriptUI.FontStyle.REGULAR, 11);
	var btnHor = pnlRev.add("button", [ 101,   12,  101+  64,   12+  24], "中央・上下" );
	btnHor.graphics.font = ScriptUI.newFont("Tahoma",ScriptUI.FontStyle.REGULAR, 11);
	var btnLeft = pnlRev.add("button", [  17,   41,   17+  32,   41+  51], "左" );
	btnLeft.graphics.font = ScriptUI.newFont("Tahoma",ScriptUI.FontStyle.REGULAR, 11);
	var btnTop = pnlRev.add("button", [  55,   41,   55+  72,   41+  24], "上" );
	btnTop.graphics.font = ScriptUI.newFont("Tahoma",ScriptUI.FontStyle.REGULAR, 11);
	var btnBottom = pnlRev.add("button", [  55,   68,   55+  72,   68+  24], "下" );
	btnBottom.graphics.font = ScriptUI.newFont("Tahoma",ScriptUI.FontStyle.REGULAR, 11);
	var btnRight = pnlRev.add("button", [ 133,   41,  133+  32,   41+  51], "右" );
	btnRight.graphics.font = ScriptUI.newFont("Tahoma",ScriptUI.FontStyle.REGULAR, 11);
	var pnlSet = winObj.add("panel", [   3,  446,    3+ 190,  446+  80], "パスの設定" );
	pnlSet.graphics.font = ScriptUI.newFont("Tahoma",ScriptUI.FontStyle.REGULAR, 11);
	var btnPathClose = pnlSet.add("button", [   6,   12,    6+  88,   12+  23], "パスを閉じる" );
	btnPathClose.graphics.font = ScriptUI.newFont("Tahoma",ScriptUI.FontStyle.REGULAR, 11);
	var btnPathOpen = pnlSet.add("button", [  97,   12,   97+  87,   12+  23], "パスを開く" );
	btnPathOpen.graphics.font = ScriptUI.newFont("Tahoma",ScriptUI.FontStyle.REGULAR, 11);
	var btnDeleteCurve = pnlSet.add("button", [   6,   41,    6+  88,   41+  23], "カーブの削除" );
	btnDeleteCurve.graphics.font = ScriptUI.newFont("Tahoma",ScriptUI.FontStyle.REGULAR, 11);


	//-------------------------------------------------------------------------
	var rbs = new Array;
	rbs.push(rbS0);
	rbs.push(rbS1);
	rbs.push(rbS2);
	rbs.push(rbS3);
	rbs.push(rbS4);
	rbs.push(rbS5);
	rbs.push(rbS6);
	rbs.push(rbS7);
	rbs.push(rbS8);
	var scaleIndex = 4;
	rbs[scaleIndex].value = true;
	for ( var i=0; i<rbs.length; i++){
		rbs[i].tag = i;
		rbs[i].onClick = function() { scaleIndex = this.tag;}
	}
	edScaleY.enabled = false;
	cbScaleY.onClick = function(){
		edScaleY.enabled = cbScaleY.value;
	}
	
	//-------------------------------------------------------------------------
	function getScaleIndex()
	{
		var ret = 4;
		for ( var i=0; i<rbs.length; i++){
			if ( rbs[i].value == true){
				ret = i;
				break;
			}
		}
		scaleIndex = ret;
		return ret;
	}
	//-------------------------------------------------------------------------
	function setScaleIndex(idx)
	{
		for ( var i=0; i<rbs.length; i++){
			rbs[i].value == false;
		}
		if ( (idx>=0)&&(idx<rbs.length)){
			rbs[idx].value = true;
			scaleIndex = idx;
		}else{
			rbs[4].value = true;
			scaleIndex = 4;
		}
	}
	//-------------------------------------------------------------------------

	function savePref()
	{
		var p = new Object;

		p.scale = 100;
		if ( isNaN(edScale.text)==false) p.scale = edScale.text *1;
		if ( isNaN(edScaleY.text)==false) p.scaleY = edScaleY.text *1;
		p.sy = cbScaleY.value;
		p.scaleIndex = getScaleIndex();
		p.mvValue = edMove.text;
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
		if (p.scale != undefined) edScale.text = p.scale +"";
		if (p.scaleY != undefined) edScaleY.text = p.scaleY +"";
		if (p.sy != undefined){
			cbScaleY.value = p.sy;
			edScaleY.enabled = p.sy;
		}
		
		if (p.scaleIndex != undefined) setScaleIndex(p.scaleIndex);
		if (p.mvValue != undefined) edMove.text =p.mvValue;
	}
	loadPref();
	//-------------------------------------------------------------------------
	function pathMove(dir)
	{
		var sft = 2;
		if ( (isNaN(edMove.text)==true)||(edMove.text=="")){
			edMove.text = "2";
		}
		sft = edMove.text * 1;
		var p  =getTargetPath();
		if ( p==null) return;
		var keyFlag = (p.target.numKeys>0);
		
		var sp = p.target.value;
		var ary = sp.vertices;
		if ( ary.length<=0) {
			return;
		}
		var x = 0;
		var y = 0;
		switch(dir)
		{
			case 0: x = 0;    y = -sft;break;
			case 1: x = sft;  y = -sft;break;
			case 2: x = sft;  y = 0;   break;
			case 3: x = sft;  y = sft; break;
			case 4: x = 0;    y = sft; break;
			case 5: x = -sft; y = sft; break;
			case 6: x = -sft; y = 0;   break;
			case 7: x = -sft; y = -sft;break;
		}
		for ( var i=0; i<ary.length; i++){
			ary[i][0] += x;
			ary[i][1] += y;
		}
		sp.vertices = ary;
		app.beginUndoGroup("パスの移動");
		if (keyFlag==true){
			p.target.setValueAtTime(p.time,sp);
		}else{
			p.target.setValue(sp);
		}
		app.endUndoGroup();
	}
	//-------------------------------------------------------------------------
	function pathClose()
	{
		var p  =getTargetPath();
		if ( p==null) return;
		if (p.target.numKeys>0) {
			alert("キーフレーム付きには対応していません");
		}
		var sp = p.target.value;
		if (sp.closed == false){
			app.beginUndoGroup("パスを閉じる");
			sp.closed = true;
			p.target.setValue(sp);
			app.endUndoGroup();
		}
	}
	//-------------------------------------------------------------------------
	function pathOpen()
	{
		var p  =getTargetPath();
		if ( p==null) return;
		if (p.target.numKeys>0) {
			alert("キーフレーム付きには対応していません");
			return;
		}
		var sp = p.target.value;
		if (sp.closed == true){
			app.beginUndoGroup("パスを開く");
			sp.closed = false;
			p.target.setValue(sp);
			app.endUndoGroup();
		}
	}
	//-------------------------------------------------------------------------
	function deleteCurve()
	{
		var p  =getTargetPath();
		if ( p==null) return;
		if (p.target.numKeys>0) {
			alert("キーフレーム付きには対応していません");
			return;
		}
		var sp = p.target.value;
		if ( sp.vertices.length>0){
			app.beginUndoGroup("カーブを削除");
			var zero = []
			for ( var i=0; i<sp.vertices.length; i++) zero.push([0,0]);
			sp.inTangents = [].concat(zero);
			sp.outTangents = [].concat(zero);
			p.target.setValue(sp);
			app.endUndoGroup();
		}
		
	}
	//-------------------------------------------------------------------------
	function pathScale()
	{
		var p  =getTargetPath();
		if ( p==null) return;
		if ( isNaN(edScale.text)==true){
			alert("スケールX(%)の値が不正です。");
			return;
		}
		var scaleX = (edScale.text*1) / 100;
		var scaleY = scaleX;
		if ( scaleX<=0) {
			alert("スケールX(%)の値が0です。");
			return;
		}
		if ( cbScaleY.value == true){
			if (isNaN(edScaleY.text)==true){
				alert("スケールY(%)の値が不正です。");
				return;
			}
			scaleY = (edScaleY.text*1) / 100;
			if ( scaleY<=0) {
				alert("スケールY(%)の値が0です。");
				return;
			}
		}
		if ( (scaleX==1)&&(scaleY==1)) return;
		
		var idx = getScaleIndex();
		var sp = p.target.value;
		
		//中心を決める
		var ar = getArea(sp.vertices);
		
		var cX = 0;
		var cY = 0;
		switch(idx){
			case 0: 
				cX = ar.left;
				cY = ar.top;
				break;
			case 1:
				cX = (ar.left+ar.right)/2;
				cY = ar.top;
				break;
			case 2:
				cX = ar.right;
				cY = ar.top;
				break;
			case 3:
				cX = ar.left;
				cY = (ar.top + ar.bottom)/2;
				break;
			case 4:
				cX = (ar.left+ar.right)/2;
				cY = (ar.top + ar.bottom)/2;
				break;
			case 5:
				cX = ar.right ;
				cY = (ar.top + ar.bottom)/2;
				break;
			case 6:
				cX = ar.left;
				cY = ar.bottom;
				break;
			case 7:
				cX = (ar.left+ar.right)/2;
				cY = ar.bottom;
				break;
			case 8:
				cX = ar.right;
				cY = ar.bottom;
				break;
		}
		var v = [];
		var iV = [];
		var oV = [];
		
		for ( var i=0; i<sp.vertices.length; i++){
			var lx = cX +(sp.vertices[i][0] - cX)*scaleX;
			var ly = cY +(sp.vertices[i][1] - cY)*scaleY;
			v.push([lx,ly]);
			var ix = sp.inTangents[i][0]*scaleX;
			var iy = sp.inTangents[i][1]*scaleY;
			iV.push([ix,iy]);
			var ox = sp.outTangents[i][0]*scaleX;
			var oy = sp.outTangents[i][1]*scaleY;
			oV.push([ox,oy]);
		}
		app.beginUndoGroup("パスの拡大・縮小");
		sp.vertices = v;
		sp.inTangents = iV;
		sp.outTangents = oV;
		if (p.target.numKeys<=0) {
			p.target.setValue(sp);
		}else{
			p.target.setValueAtTime(p.time,sp);
		}
		app.endUndoGroup();
	}
	//-------------------------------------------------------------------------
	
	btnMv_0.dir = 0;
	btnMv_1.dir = 1;
	btnMv_2.dir = 2;
	btnMv_3.dir = 3;
	btnMv_4.dir = 4;
	btnMv_5.dir = 5;
	btnMv_6.dir = 6;
	btnMv_7.dir = 7;
	btnMv_0.onClick = 
	btnMv_1.onClick = 
	btnMv_2.onClick = 
	btnMv_3.onClick = 
	btnMv_4.onClick = 
	btnMv_5.onClick = 
	btnMv_6.onClick = 
	btnMv_7.onClick =  function() { pathMove(this.dir);}

	btnVer.onClick = function() { execVer(0,"パスを左右反転-中央");}
	btnLeft.onClick = function() { execVer(1,"パスを左右反転-左");}
	btnRight.onClick = function() { execVer(2,"パスを左右反転-右");}
	btnHor.onClick = function() { execHor(0,"パスを上下反転-中央");}
	btnTop.onClick = function() { execHor(1,"パスを上下反転-上");}
	btnBottom.onClick = function() { execHor(2,"パスを上下反転-下");}
	
	 btnRightRot.onClick = turnRight;
	 btnTurn.onClick = turnBack;
	 btnLeftRot.onClick = turnLeft;



	btnPathClose.onClick = pathClose;
	btnPathOpen.onClick = pathOpen;
	btnDeleteCurve.onClick = deleteCurve;
	//-------------------------------------------------------------------------
	var cmbMvFlag = false;
	cmbMv.onChange = function()
	{
		if (cmbMvFlag == true) return;
		var b = cmbMvFlag;
		cmbMvFlag = true;
		edMove.text = cmbMv.selection;
		cmbMv.items[cmbMv.selection.index].selected =false;
		cmbMvFlag = b;
	}
	//-------------------------------------------------------------------------
	btnSetScale.onClick = pathScale;
	//-------------------------------------------------------------------------
	winObj.onClose = function()
	{
		savePref();
	}
	//-------------------------------------------------------------------------
	if ( ( me instanceof Panel) == false){
		winObj.center(); 
		winObj.show();
	}
	//-------------------------------------------------------------------------
})(this);
