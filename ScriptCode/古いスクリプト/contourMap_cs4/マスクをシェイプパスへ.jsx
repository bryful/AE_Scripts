(function(me){
	String.prototype.trim = function(){
		if (this=="" ) return ""
		else return this.replace(/[\r\n]+$|^\s+|\s+$/g, "");
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
	//----------------------------------
	var scriptName = File.decode($.fileName.getName().changeExt(""));
	var prefFile = new File($.fileName.changeExt(".pref"));
	var errMes ="";
	var currentTime = 0;
	function err(s)
	{
		errMes += s +"\r\n";
	}
	//----------------------------------
	var targetComp = null;
	var targetLayer = null;
	
	var newShapeComp = null;
	var newShapeLayer = null;
	//-------------------------------------------------------------------------
	var winObj = ( me instanceof Panel) ? me : new Window("palette", "等高線地図作成", [ 198,  261,  198+ 199,  261+ 484] );
	//-------------------------------------------------------------------------
	
	//----------------------------------
	var stInfo = winObj.add("statictext", [  12,    9,   12+ 193,    9+  16], "MaskShapeからShapeLayerを作る");
	stInfo.graphics.font = ScriptUI.newFont("Tahoma",ScriptUI.FontStyle.REGULAR, 11);
	var pnlTarger = winObj.add("panel", [   8,   28,    8+ 184,   28+ 113], "TargetLayer" );
	pnlTarger.graphics.font = ScriptUI.newFont("Tahoma",ScriptUI.FontStyle.REGULAR, 11);
	var stTargetComp = pnlTarger.add("statictext", [  11,   13,   11+  79,   13+  13], "ターゲットコンポ");
	stTargetComp.graphics.font = ScriptUI.newFont("Tahoma",ScriptUI.FontStyle.REGULAR, 11);
	var edTargetComp = pnlTarger.add("edittext", [  11,   28,   11+ 167,   28+  21], "");
	edTargetComp.graphics.font = ScriptUI.newFont("Tahoma",ScriptUI.FontStyle.REGULAR, 11);
	var srTargetLayer = pnlTarger.add("statictext", [  11,   55,   11+ 100,   55+  13], "ターゲットレイヤ");
	srTargetLayer.graphics.font = ScriptUI.newFont("Tahoma",ScriptUI.FontStyle.REGULAR, 11);
	var edTargetLayer = pnlTarger.add("edittext", [  11,   70,   11+ 167,   70+  21], "");
	edTargetLayer.graphics.font = ScriptUI.newFont("Tahoma",ScriptUI.FontStyle.REGULAR, 11);
	var btnGetTargetLayer = pnlTarger.add("button", [  96,    3,   96+  41,    3+  23], "GET" );
	btnGetTargetLayer.graphics.font = ScriptUI.newFont("Tahoma",ScriptUI.FontStyle.REGULAR, 11);
	var btnClrTargetLayer = pnlTarger.add("button", [ 138,    3,  138+  41,    3+  23], "CLR" );
	btnClrTargetLayer.graphics.font = ScriptUI.newFont("Tahoma",ScriptUI.FontStyle.REGULAR, 11);
	var pnlShapeLayer = winObj.add("panel", [   8,  147,    8+ 184,  147+ 111], "ShapeLayer" );
	pnlShapeLayer.graphics.font = ScriptUI.newFont("Tahoma",ScriptUI.FontStyle.REGULAR, 11);
	var stShapeComp = pnlShapeLayer.add("statictext", [  16,   16,   16+  57,   16+  13], "コンポ名");
	stShapeComp.graphics.font = ScriptUI.newFont("Tahoma",ScriptUI.FontStyle.REGULAR, 11);
	var edShapeComp = pnlShapeLayer.add("edittext", [  14,   32,   14+ 164,   32+  21], "");
	edShapeComp.graphics.font = ScriptUI.newFont("Tahoma",ScriptUI.FontStyle.REGULAR, 11);
	var stShapeLayer = pnlShapeLayer.add("statictext", [  16,   56,   16+ 100,   56+  13], "シェイプレイヤ名");
	stShapeLayer.graphics.font = ScriptUI.newFont("Tahoma",ScriptUI.FontStyle.REGULAR, 11);
	var edShapeLayer = pnlShapeLayer.add("edittext", [  14,   72,   14+ 164,   72+  21], "");
	edShapeLayer.graphics.font = ScriptUI.newFont("Tahoma",ScriptUI.FontStyle.REGULAR, 11);
	var btnGetShapeLayer = pnlShapeLayer.add("button", [  96,    6,   96+  41,    6+  23], "GET" );
	btnGetShapeLayer.graphics.font = ScriptUI.newFont("Tahoma",ScriptUI.FontStyle.REGULAR, 11);
	var btnClrShapeLayer = pnlShapeLayer.add("button", [ 137,    6,  137+  41,    6+  23], "CLR" );
	btnClrShapeLayer.graphics.font = ScriptUI.newFont("Tahoma",ScriptUI.FontStyle.REGULAR, 11);
	var pnlOption = winObj.add("panel", [   8,  264,    8+ 184,  264+  89], "Option" );
	pnlOption.graphics.font = ScriptUI.newFont("Tahoma",ScriptUI.FontStyle.REGULAR, 11);
	var cbUnFill = pnlOption.add("checkbox", [  14,   50,   14+ 123,   50+  20], "塗りを無効にする");
	cbUnFill.graphics.font = ScriptUI.newFont("Tahoma",ScriptUI.FontStyle.REGULAR, 11);
	var stGroup = pnlOption.add("statictext", [  16,    9,   16+ 100,    9+  13], "作成するグループ名");
	stGroup.graphics.font = ScriptUI.newFont("Tahoma",ScriptUI.FontStyle.REGULAR, 11);
	var edGroup = pnlOption.add("edittext", [  14,   25,   14+ 154,   25+  21], "");
	edGroup.graphics.font = ScriptUI.newFont("Tahoma",ScriptUI.FontStyle.REGULAR, 11);
	var btnExec = winObj.add("button", [  12,  359,   12+ 175,  359+  28], "実行" );
	btnExec.graphics.font = ScriptUI.newFont("Tahoma",ScriptUI.FontStyle.REGULAR, 11);
	var pnlExp = winObj.add("panel", [   8,  390,    8+ 184,  390+  80], "グループの処理" );
	pnlExp.graphics.font = ScriptUI.newFont("Tahoma",ScriptUI.FontStyle.REGULAR, 11);
	var btnExp = pnlExp.add("button", [  19,   12,   19+ 148,   12+  24], "Expression設定" );
	btnExp.graphics.font = ScriptUI.newFont("Tahoma",ScriptUI.FontStyle.REGULAR, 11);
	var btnFillON = pnlExp.add("button", [  19,   42,   19+  71,   42+  24], "塗りを有効に" );
	btnFillON.graphics.font = ScriptUI.newFont("Tahoma",ScriptUI.FontStyle.REGULAR, 11);
	var btnFillOFF = pnlExp.add("button", [  96,   42,   96+  71,   42+  24], "塗りを無効に" );
	btnFillOFF.graphics.font = ScriptUI.newFont("Tahoma",ScriptUI.FontStyle.REGULAR, 11);

	//-------------------------------------------------------------------------
	function chkTarget()
	{
		var ck =  ( (targetLayer!=null) && (targetLayer instanceof AVLayer) );
		if ( ck==false){
			edTargetComp.text = "";
			edTargetLayer.text = "";
		}
		btnExec.enabled = ck;
		pnlShapeLayer.enabled = ck;
		var ck =  ( (newShapeLayer!=null) && (newShapeLayer instanceof ShapeLayer) );
		if ( ck==false){
			edShapeComp.text = "";
			edShapeLayer.text = "";
		}
	}
	//-------------------------------------------------------------------------
	chkTarget();
	//-------------------------------------------------------------------------
	function getTarget()
	{
		targetComp = null;
		targetLayer = null;
		edTargetComp.text = "";
		edTargetLayer.text = "";
		var ac = app.project.activeItem;
		if ( ( ac instanceof CompItem) == false){
			alert("コンポをアクティブにしてください。");
			chkTarget();
			return;
		}
		if ( ac.selectedLayers.length != 1){
			alert("レイヤを1個だけ選択してください。");
			chkTarget();
			return;
		}
		var mg = ac.selectedLayers[0].property("ADBE Mask Parade");
		if (mg.numProperties<=0){
			alert("マスクがありません。");
			chkTarget();
			return;
		}
		
		targetComp = app.project.activeItem;
		targetLayer = targetComp.selectedLayers[0];

		edTargetComp.text = targetComp.name;
		edTargetLayer.text = targetLayer.name;
		new
		chkTarget();
	}
	//-------------------------------------------------------------------------
	function getNewShape()
	{
		newShapeComp = null;
		newShapeLayer = null;
		edShapeComp.text = "";
		edShapeLayer.text = "";
		var ac = app.project.activeItem;
		if ( ( ac instanceof CompItem) == false){
			alert("コンポをアクティブにしてください。");
			chkTarget();
			return;
		}
		if ( (ac.selectedLayers.length != 1)&&(ac.selectedLayers[0] instanceof ShapeLayer )){
			alert("シェイプレイヤを1個だけ選択してください。");
			chkTarget();
			return;
		}
		newShapeComp = app.project.activeItem;
		newShapeLayer = newShapeComp.selectedLayers[0];
		
		edShapeComp.text = newShapeComp.name;
		edShapeLayer.text = newShapeLayer.name;
		chkTarget();

	}
	//-------------------------------------------------------------------------
	function shiftShape(sp, x,y)
	{
		var ret = new Shape();
		var cnt = sp.vertices.length;
		if ( cnt<=0) return sp;
		var v = [];
		for ( var i=0; i<cnt; i++){
			v.push( [ sp.vertices[i][0] + x, sp.vertices[i][1] + y]);
		}
		ret.vertices = v;
		ret.inTangents = sp.inTangents;
		ret.outTangents = sp.outTangents;
		ret.closed = sp.closed;
		return ret;
	}
	//-------------------------------------------------------------------------
	function findGroup(s)
	{
		if ( (newShapeLayer == null)||( (newShapeLayer instanceof ShapeLayer)== false)){
			return null;
		}
		var g = newShapeLayer.property("ADBE Root Vectors Group");
		if ( g.numProperties<=0) return null;
		for ( var i=1; i<=g.numProperties; i++){
			var p = g.property(i);
			if ( (p.matchName =="ADBE Vector Group")&&(p.name == s)) {
				return p;
			}
		}
		return null;
	}
	//-------------------------------------------------------------------------
	function exec()
	{
		if (( targetLayer == null)||(targetComp == null)) {
			alert("ターゲットを選択してください");
			return;
		}
		if ( (newShapeComp == null)||( (newShapeComp instanceof CompItem)==false)) {
			newShapeComp = targetComp;
		}
		edShapeComp.text = newShapeComp.name;
		if ( (newShapeLayer == null)||( (newShapeLayer instanceof ShapeLayer)==false) ) {
			app.beginUndoGroup(scriptName+"：SahpeLayer作成");
			newShapeLayer = newShapeComp.layers.addShape();
			app.endUndoGroup();
			if ( newShapeLayer == null) {
				alert("シェイプレイヤが作成できません！");
				return;
			}
		}
		edShapeLayer.text = newShapeLayer.name;
		
		var ng = edGroup.text.trim();
		if (ng =="") {
			alert("グループ名を指定してください！");
			return;
		}
		var g =findGroup(ng);
		if ( g != null) {
			alert("同名のグループが有ります！");
			return;
		}

		var unFill = ! cbUnFill.value;

		app.beginUndoGroup(scriptName);

		var rg = newShapeLayer.property("ADBE Root Vectors Group");
		var vg = rg.addProperty("ADBE Vector Group");
		vg.name = ng;
		var gg = vg.addProperty("ADBE Vectors Group");
		
		var sx = targetComp.width / -2;
		var sy = targetComp.height / -2;

		var mg = targetLayer.property("ADBE Mask Parade");
		for ( var i = 1; i<=mg.numProperties; i++){
			mask = mg.property(i);

			var sp = mask.property("ADBE Mask Shape").value;
			sp = shiftShape(sp,sx,sy);
			var s = gg.addProperty("ADBE Vector Shape - Group");
			s.name = mask.name;
			s.property("ADBE Vector Shape").setValue(sp);
		}
		var sen = null;
		if ( gg.canAddProperty("ADBE Vector Graphic - Stroke")==true){
			sen = gg.addProperty("ADBE Vector Graphic - Stroke");
		}
		if (sen == null){
			alert("線の追加が出来ない");
		}
		
		var nuri = null;
		if ( gg.canAddProperty("ADBE Vector Graphic - Fill")==true){
			nuri = gg.addProperty("ADBE Vector Graphic - Fill");
		}
		if ( nuri == null){
			alert("塗りの追加が出来ない");
		}else{
			nuri.enabled = unFill;
		}
		app.endUndoGroup();
		
	}
	//-------------------------------------------------------------------------
	function clsTarget()
	{
		targetComp = null;
		targetLayer = null;
		newShapeComp = null;
		newShapeLayer = null;
		chkTarget();
	}
	//-------------------------------------------------------------------------
	function clsNewShapeLayer()
	{
		newShapeComp = null;
		newShapeLayer = null;
		chkTarget();
	}
	//-------------------------------------------------------------------------
	function findEffect(lyr,mtname,name)
	{
		if ( (lyr == null)||( (lyr instanceof ShapeLayer)== false)){
			return null;
		}
		var fx = null;
		var eg = lyr.property("ADBE Effect Parade");
		if ( eg.numProperties>0){
			for ( var i=1; i<=eg.numProperties; i++){
				var p = eg.property(i);
				if ( (p.matchName == mtname)&&(p.name == name)) {
					fx = p;
					fx.enabled = false;
					break;
				};
			}
		}
		if ( fx == null){
			if ( eg.canAddProperty(mtname)==true){
				fx = eg.addProperty(mtname);
				fx.name = name;
				fx.enabled = false;
			}
		}
		return fx;
	}
	//-------------------------------------------------------------------------
	function setExp()
	{
		var ac = app.project.activeItem;
		if ( ( ac instanceof CompItem) == false){
			alert("コンポをアクティブにしてください。");
			return;
		}
		if ( ac.selectedLayers.length!=1) {
			alert("レイヤを1個だけ選択してください。");
			return;
		}
		var lyr = ac.selectedLayers[0];
		if ( lyr.selectedProperties.length!=1) {
			alert("グループを1個だけ選択してください。");
			return;
		}
		var target = lyr.selectedProperties[0];
		var targetName = "";
		if ( target.matchName != "ADBE Vector Group") {
			alert("グループを1個だけ選択してください。");
			return;
		}else{
			targetName = target.name;
			target = target.property("ADBE Vectors Group");
		}
		var senC = null;
		var senW = null;
		var nuriC = null;
		var nuriT = null;
		for ( var i=1; i<= target.numProperties; i++){
			if (target.property(i).matchName =="ADBE Vector Graphic - Stroke") {
				senC = target.property(i).property("ADBE Vector Stroke Color");
				senW = target.property(i).property("ADBE Vector Stroke Width");
			}else if (target.property(i).matchName =="ADBE Vector Graphic - Fill") {
				nuriC = target.property(i).property("ADBE Vector Fill Color");
				nuriT = target.property(i).property("ADBE Vector Fill Opacity");
			}
		}
		if ( (senC != null)||(senW != null)){
			var sC = findEffect(lyr,"ADBE Color Control","線の色");
			sC.property("ADBE Color Control-0001").setValue([1,1,1]);
			senC.expression = "effect(\"線の色\")(\"ADBE Color Control-0001\");";
			
			var sW = findEffect(lyr,"ADBE Slider Control","線の幅");
			sW.property("ADBE Slider Control-0001").setValue(2);
			senW.expression = "effect(\"線の幅\")(\"ADBE Slider Control-0001\");";
		}
		if ( (nuriC != null)||(nuriT != null)){
			var nuriName = targetName + "の色";
			var nC = findEffect(lyr,"ADBE Color Control",nuriName);
			nC.property("ADBE Color Control-0001").setValue([0,0,0]);
			nuriC.expression = "effect(\""+ nuriName +"\")(\"ADBE Color Control-0001\");";
			var nuriName = targetName + "の不透明度";
			var nT = findEffect(lyr,"ADBE Slider Control",nuriName);
			nT.property("ADBE Slider Control-0001").setValue(100);
			nuriT.expression = "effect(\""+ nuriName +"\")(\"ADBE Slider Control-0001\");";
			
		}
	}
	//-------------------------------------------------------------------------
	//-------------------------------------------------------------------------
	function setFillON_OFF(op)
	{
		var ac = app.project.activeItem;
		if ( ( ac instanceof CompItem) == false){
			alert("コンポをアクティブにしてください。");
			return;
		}
		if ( ac.selectedLayers.length!=1) {
			alert("レイヤを1個だけ選択してください。");
			return;
		}
		var lyr = ac.selectedLayers[0];
		var cnt = lyr.selectedProperties.length;
		if ( cnt<=0) {
			alert("グループを選択してください。");
			return;
		}
		for ( var j=0; j<cnt; j++){
			var target = lyr.selectedProperties[j];
			if ( target.matchName == "ADBE Vector Group") {
				var target = target.property("ADBE Vectors Group");
				if ( target.numProperties>0){
					for ( var i=1; i<= target.numProperties; i++){
						if (target.property(i).matchName =="ADBE Vector Graphic - Fill") {
							target.property(i).enabled = op;
						}
					}
				}
			}
		}
		
	}
	//-------------------------------------------------------------------------
	btnGetTargetLayer.onClick = getTarget;
	btnGetShapeLayer.onClick = getNewShape;
	btnExec.onClick = exec;
	btnExp.onClick = setExp;
	btnFillON.onClick = function(){ setFillON_OFF(true);}
	btnFillOFF.onClick = function(){ setFillON_OFF(false);}
	btnClrTargetLayer.onClick = clsTarget;
	btnClrShapeLayer.onClick = clsNewShapeLayer;
	//-------------------------------------------------------------------------
	if ( ( me instanceof Panel) == false){
		winObj.center(); 
		winObj.show();
	}
	//-------------------------------------------------------------------------
})(this);
