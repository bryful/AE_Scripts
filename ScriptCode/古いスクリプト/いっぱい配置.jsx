(function(me){
	if ( app.preferences.getPrefAsLong("Main Pref Section", "Pref_SCRIPTING_FILE_NETWORK_SECURITY") != 1){
		var s = "すみません。以下の設定がオフになっています。\r\n\r\n";
		s +=  "「環境設定：一般設定：スクリプトによるファイルへの書き込みとネットワークへのアクセスを許可」\r\n";
		s += "\r\n";
		s += "このスクリプトを使う為にはオンにする必要が有ります。\r\n";
		alert(s);
		return;
	}
	String.prototype.trim = function(s)
	{
		if ( s == "" ) return "";
		return s.replace(/[\r\n]+$|^\s+|\s+$/g, "");
	}

	var targetComp = null;
	var targetLayer = null;

	var layerName = "Obj";
	var count = "36";
	var radius = "1200";
	var side = "200";
	var opa_add = "0.5";
	var modeStr = ["筒状","横","奥" ];
	var	mode = 0;

	var rot = 360 / count;

	//-----------------------------------------------------------------------
	function center_null_Name()
	{
		return layerName + "_center";
	}
	//-----------------------------------------------------------------------
	//同名のcenter_nullがあったらtrue
	function is_center_null()
	{
		var ret = false;
		var cnt = targetComp.numLayers;
		if (cnt<=0) return ret;
		var s = center_null_Name();
		for ( var i= 1; i<=cnt; i++) {
			if ( targetComp.layer(i).name == s ) {
				ret = true;
				break;
			}
		}
		return ret;
	}
	//-----------------------------------------------------------------------
	//エフェクトを追加
	function addFx(lyr,fx,name,b)
	{
		var fxg = lyr.property("ADBE Effect Parade");
		if (fxg.canAddProperty(fx)) {
			var f = fxg.addProperty(fx);
			f.name = name;
			f.enabled = b;
			return  f;
		}else{
			return null;
		}
	}
	//-----------------------------------------------------------------------
	//筒状に配置
	function setupCylinder()
	{
		if ((targetLayer==null)||(( targetLayer instanceof AVLayer)==false)){
			return;
		}
		app.beginUndoGroup("筒状に配置");
		if (targetLayer.threeDLayer == false){
			targetLayer.threeDLayer = true;
		}

		var pos = targetLayer.property("ADBE Transform Group").property("ADBE Position").value;
		//center_nullを作成
		var center_null = targetComp.layers.addNull(targetComp.duration);
		center_null.name = center_null_Name();
		center_null.source.name = layerName +"_null";
		center_null.threeDLayer = true;
		center_null.property("ADBE Transform Group").property("ADBE Position").setValue(pos);
		center_null.moveToBeginning();

		//必要なエクスプレッション制御
		var rotX = addFx(center_null,"ADBE Angle Control","rotX",false);
		var rotY = addFx(center_null,"ADBE Angle Control","rotY",false);
		var rotZ = addFx(center_null,"ADBE Angle Control","rotZ",false);
		var radiusP = addFx(center_null,"ADBE Slider Control","radius",false);
		radiusP.property("ADBE Slider Control-0001").setValue(radius);
		var scaleX = addFx(center_null,"ADBE Slider Control","scaleX",false);
		scaleX.property("ADBE Slider Control-0001").setValue(100);
		var scaleY = addFx(center_null,"ADBE Slider Control","scaleY",false);
		scaleY.property("ADBE Slider Control-0001").setValue(100);
		
		var lockedA = [];
		var tmp_null = targetComp.layers.addNull(targetComp.duration);
		lockedA.push(tmp_null);
		tmp_null.name = layerName +"n_0";
		tmp_null.source.name = layerName +"n_0";
		tmp_null.threeDLayer = true;
		tmp_null.parent = center_null;
		tmp_null.property("ADBE Transform Group").property("ADBE Rotate Y").expression = "name.split(\"_\")[1]*"+ rot;
		tmp_null.property("ADBE Transform Group").property("ADBE Anchor Point").expression = "[transform.anchorPoint[0],transform.anchorPoint[1],parent.effect(\"radius\")(\"ADBE Slider Control-0001\")*-1];";
		tmp_null.property("ADBE Transform Group").property("ADBE Position").setValue([0,0,0]);
		tmp_null.property("ADBE Transform Group").property("ADBE Orientation").setValue([0,0,0]);
		tmp_null.shy = true;
		tmp_null.moveToBeginning();

		var lyr = targetLayer.duplicate();
		lockedA.push(lyr);
		targetLayer.enabled = false;
		lyr.parent = tmp_null;
		lyr.name = layerName + "_0";
		lyr.property("ADBE Transform Group").property("ADBE Position").setValue([0,0,0]);
		lyr.property("ADBE Transform Group").property("ADBE Orientation").setValue([0,0,0]);
		lyr.property("ADBE Transform Group").property("ADBE Rotate X").expression = "thisComp.layer(\"" + center_null.name +"\").effect(\"rotX\")(\"角度\")";
		lyr.property("ADBE Transform Group").property("ADBE Rotate Y").expression = "thisComp.layer(\"" + center_null.name +"\").effect(\"rotY\")(\"角度\")";
		lyr.property("ADBE Transform Group").property("ADBE Rotate Z").expression = "thisComp.layer(\"" + center_null.name +"\").effect(\"rotZ\")(\"角度\")";
		var exps = "[thisComp.layer(\"" + center_null.name + "\").effect(\"scaleX\")(\"ADBE Slider Control-0001\"),thisComp.layer(\""+ center_null.name+"\").effect(\"scaleY\")(\"ADBE Slider Control-0001\"),100];";
		lyr.property("ADBE Transform Group").property("ADBE Scale").expression = exps;
		lyr.shy = true;
		lyr.moveToBeginning();

		for ( var i=1; i<count; i++){
			var t = tmp_null.duplicate();
			t.name = layerName +"n_"+ i;
			var l = lyr.duplicate();
			l.name = layerName +"_"+ i;
			l.parent = t;
			t.property("ADBE Transform Group").property("ADBE Position").setValue([0,0,0]);
			t.property("ADBE Transform Group").property("ADBE Orientation").setValue([0,0,0]);
			t.moveToBeginning();
			l.property("ADBE Transform Group").property("ADBE Position").setValue([0,0,0]);
			l.property("ADBE Transform Group").property("ADBE Orientation").setValue([0,0,0]);
			l.moveToBeginning();
			lockedA.push(l);
			lockedA.push(t);
			
		}
		center_null.moveToBeginning();
		/*
		if (lockedA.length>0) {
			for ( var i=0; i<lockedA.length; i++){
				lockedA[i].locked = true; 
			}
		}
		*/
		app.endUndoGroup();
	}
	//-----------------------------------------------------------------------
	//横に配置
	function setupSide()
	{
		if ((targetLayer==null)||(( targetLayer instanceof AVLayer)==false)){
			return;
		}
		app.beginUndoGroup("横に配置");
		if (targetLayer.threeDLayer == false){
			targetLayer.threeDLayer = true;
		}

		var pos = targetLayer.property("ADBE Transform Group").property("ADBE Position").value;
		//center_nullを作成
		var center_null = targetComp.layers.addNull(targetComp.duration);
		center_null.name = center_null_Name();
		center_null.source.name = layerName +"_null";
		center_null.threeDLayer = true;
		center_null.property("ADBE Transform Group").property("ADBE Position").setValue(pos);
		center_null.moveToBeginning();

		//必要なエクスプレッション制御
		var rotX = addFx(center_null,"ADBE Angle Control","rotX",false);
		var rotY = addFx(center_null,"ADBE Angle Control","rotY",false);
		var rotZ = addFx(center_null,"ADBE Angle Control","rotZ",false);
		var sideP = addFx(center_null,"ADBE Slider Control","side",false);
		sideP.property("ADBE Slider Control-0001").setValue(side);
		var scaleX = addFx(center_null,"ADBE Slider Control","scaleX",false);
		scaleX.property("ADBE Slider Control-0001").setValue(100);
		var scaleY = addFx(center_null,"ADBE Slider Control","scaleY",false);
		scaleY.property("ADBE Slider Control-0001").setValue(100);
		var opa = addFx(center_null,"ADBE Slider Control","opa_add",false);
		opa.property("ADBE Slider Control-0001").setValue(opa_add);
		
		var lockedA = [];

		var lyr = targetLayer.duplicate();
		lockedA.push(lyr);
		targetLayer.enabled = false;
		lyr.parent = center_null;
		lyr.name = layerName + "_0";
		lyr.property("ADBE Transform Group").property("ADBE Position").setValue([0,0,0]);
		var exps = "p = name.split(\"_\")[1]*1;\n"
		exps += "p *= thisComp.layer(\""+center_null.name+"\").effect(\"side\")(\"ADBE Slider Control-0001\");\n";
		exps += "[p,0,0];\n";
		lyr.property("ADBE Transform Group").property("ADBE Position").expression = exps;
		exps = "p = name.split(\"_\")[1]*1;\n"
		exps += "p *= thisComp.layer(\""+center_null.name+"\").effect(\"opa_add\")(\"ADBE Slider Control-0001\");\n";
		exps += "transform.opacity -= p;\n";
		lyr.property("ADBE Transform Group").property("ADBE Opacity").expression = exps;

		lyr.property("ADBE Transform Group").property("ADBE Orientation").setValue([0,0,0]);
		lyr.property("ADBE Transform Group").property("ADBE Rotate X").expression = "thisComp.layer(\"" + center_null.name +"\").effect(\"rotX\")(\"角度\")";
		lyr.property("ADBE Transform Group").property("ADBE Rotate Y").expression = "thisComp.layer(\"" + center_null.name +"\").effect(\"rotY\")(\"角度\")";
		lyr.property("ADBE Transform Group").property("ADBE Rotate Z").expression = "thisComp.layer(\"" + center_null.name +"\").effect(\"rotZ\")(\"角度\")";
		var exps = "[thisComp.layer(\"" + center_null.name + "\").effect(\"scaleX\")(\"ADBE Slider Control-0001\"),thisComp.layer(\""+ center_null.name+"\").effect(\"scaleY\")(\"ADBE Slider Control-0001\"),100];";
		lyr.property("ADBE Transform Group").property("ADBE Scale").expression = exps;
		lyr.shy = true;
		lyr.moveToBeginning();

		for ( var i=1; i<count; i++){
			var l = lyr.duplicate();
			l.name = layerName +"_"+ i;
			l.parent = center_null;
			l.property("ADBE Transform Group").property("ADBE Position").setValue([0,0,0]);
			l.property("ADBE Transform Group").property("ADBE Orientation").setValue([0,0,0]);
			l.moveToBeginning();
			lockedA.push(l);
			
		}
		center_null.moveToBeginning();
		/*
		if (lockedA.length>0) {
			for ( var i=0; i<lockedA.length; i++){
				lockedA[i].locked = true; 
			}
		}
		*/
		app.endUndoGroup();
	}
	//-----------------------------------------------------------------------
	//奥に配置
	function setupDeps()
	{
		if ((targetLayer==null)||(( targetLayer instanceof AVLayer)==false)){
			return;
		}
		app.beginUndoGroup("奥に配置");
		if (targetLayer.threeDLayer == false){
			targetLayer.threeDLayer = true;
		}

		var pos = targetLayer.property("ADBE Transform Group").property("ADBE Position").value;
		//center_nullを作成
		var center_null = targetComp.layers.addNull(targetComp.duration);
		center_null.name = center_null_Name();
		center_null.source.name = layerName +"_null";
		center_null.threeDLayer = true;
		center_null.property("ADBE Transform Group").property("ADBE Position").setValue(pos);
		center_null.moveToBeginning();

		//必要なエクスプレッション制御
		var rotX = addFx(center_null,"ADBE Angle Control","rotX",false);
		var rotY = addFx(center_null,"ADBE Angle Control","rotY",false);
		var rotZ = addFx(center_null,"ADBE Angle Control","rotZ",false);
		var deps = addFx(center_null,"ADBE Slider Control","deps",false);
		deps.property("ADBE Slider Control-0001").setValue(side);
		var scaleX = addFx(center_null,"ADBE Slider Control","scaleX",false);
		scaleX.property("ADBE Slider Control-0001").setValue(100);
		var scaleY = addFx(center_null,"ADBE Slider Control","scaleY",false);
		scaleY.property("ADBE Slider Control-0001").setValue(100);
		var opa = addFx(center_null,"ADBE Slider Control","opa_add",false);
		opa.property("ADBE Slider Control-0001").setValue(opa_add);
		
		var lockedA = [];

		var lyr = targetLayer.duplicate();
		lockedA.push(lyr);
		targetLayer.enabled = false;
		lyr.parent = center_null;
		lyr.name = layerName + "_0";
		lyr.property("ADBE Transform Group").property("ADBE Position").setValue([0,0,0]);
		var exps = "p = name.split(\"_\")[1]*1;\n"
		exps += "p *= thisComp.layer(\""+center_null.name+"\").effect(\"deps\")(\"ADBE Slider Control-0001\");\n";
		exps += "[0,0,p];\n";
		lyr.property("ADBE Transform Group").property("ADBE Position").expression = exps;
		exps = "p = name.split(\"_\")[1]*1;\n"
		exps += "p *= thisComp.layer(\""+center_null.name+"\").effect(\"opa_add\")(\"ADBE Slider Control-0001\");\n";
		exps += "transform.opacity -= p;\n";
		lyr.property("ADBE Transform Group").property("ADBE Opacity").expression = exps;

		lyr.property("ADBE Transform Group").property("ADBE Orientation").setValue([0,0,0]);
		lyr.property("ADBE Transform Group").property("ADBE Rotate X").expression = "thisComp.layer(\"" + center_null.name +"\").effect(\"rotX\")(\"角度\")";
		lyr.property("ADBE Transform Group").property("ADBE Rotate Y").expression = "thisComp.layer(\"" + center_null.name +"\").effect(\"rotY\")(\"角度\")";
		lyr.property("ADBE Transform Group").property("ADBE Rotate Z").expression = "thisComp.layer(\"" + center_null.name +"\").effect(\"rotZ\")(\"角度\")";
		var exps = "[thisComp.layer(\"" + center_null.name + "\").effect(\"scaleX\")(\"ADBE Slider Control-0001\"),thisComp.layer(\""+ center_null.name+"\").effect(\"scaleY\")(\"ADBE Slider Control-0001\"),100];";
		lyr.property("ADBE Transform Group").property("ADBE Scale").expression = exps;
		lyr.shy = true;
		lyr.moveToBeginning();

		for ( var i=1; i<count; i++){
			var l = lyr.duplicate();
			l.name = layerName +"_"+ i;
			l.parent = center_null;
			l.property("ADBE Transform Group").property("ADBE Position").setValue([0,0,0]);
			l.property("ADBE Transform Group").property("ADBE Orientation").setValue([0,0,0]);
			l.moveToBeginning();
			lockedA.push(l);
			
		}
		center_null.moveToBeginning();
		/*
		if (lockedA.length>0) {
			for ( var i=0; i<lockedA.length; i++){
				lockedA[i].locked = true; 
			}
		}
		*/
		app.endUndoGroup();
	}
	//-------------------------------------------------------------------------
	//-------------------------------------------------------------------------
	var winObj = ( me instanceof Panel) ? me : new Window("palette", "いっぱい配置", [ 865,  403,  865+ 174,  403+ 206]  ,{resizeable:true, maximizeButton:true, minimizeButton:true});
	//-------------------------------------------------------------------------
	var stLayerName = winObj.add("statictext", [  12,    9,   12+  83,    9+  18], "ベース名称");
	stLayerName.graphics.font = ScriptUI.newFont("Tahoma",ScriptUI.FontStyle.REGULAR, 11);
	var edLayerName = winObj.add("edittext", [ 101,    6,  101+  61,    6+  21], layerName);
	edLayerName.graphics.font = ScriptUI.newFont("Tahoma",ScriptUI.FontStyle.REGULAR, 11);
	var stCount = winObj.add("statictext", [  12,   36,   12+  83,   36+  18], "配置数");
	stCount.graphics.font = ScriptUI.newFont("Tahoma",ScriptUI.FontStyle.REGULAR, 11);
	var edCount = winObj.add("edittext", [ 101,   33,  101+  61,   33+  21], count);
	edCount.graphics.font = ScriptUI.newFont("Tahoma",ScriptUI.FontStyle.REGULAR, 11);
	var stRadius = winObj.add("statictext", [  12,   63,   12+  83,   63+  18], "筒の半径(px)");
	stRadius.graphics.font = ScriptUI.newFont("Tahoma",ScriptUI.FontStyle.REGULAR, 11);
	var edRadius = winObj.add("edittext", [ 101,   60,  101+  61,   60+  21], radius);
	edRadius.graphics.font = ScriptUI.newFont("Tahoma",ScriptUI.FontStyle.REGULAR, 11);
	var stSide = winObj.add("statictext", [  12,   90,   12+  83,   90+  18], "横の距離(px)");
	stSide.graphics.font = ScriptUI.newFont("Tahoma",ScriptUI.FontStyle.REGULAR, 11);
	var edSide = winObj.add("edittext", [ 101,   87,  101+  61,   87+  21], side);
	edSide.graphics.font = ScriptUI.newFont("Tahoma",ScriptUI.FontStyle.REGULAR, 11);
	var stOpa_add = winObj.add("statictext", [  12,  117,   12+  83,  117+  18], "不透明度補正");
	stOpa_add.graphics.font = ScriptUI.newFont("Tahoma",ScriptUI.FontStyle.REGULAR, 11);
	var edOpa_add = winObj.add("edittext", [ 101,  114,  101+  61,  114+  21], opa_add);
	edOpa_add.graphics.font = ScriptUI.newFont("Tahoma",ScriptUI.FontStyle.REGULAR, 11);
	var lstMode = winObj.add("dropdownlist", [  20,  144,   20+ 135,  144+  21], modeStr);
	lstMode.items[0].selected = true;
	lstMode.graphics.font = ScriptUI.newFont("Tahoma",ScriptUI.FontStyle.REGULAR, 11);
	var btnExec = winObj.add("button", [  20,  171,   20+ 135,  171+  23], "実行" );
	btnExec.graphics.font = ScriptUI.newFont("Tahoma",ScriptUI.FontStyle.REGULAR, 11);

	edSide.enabled = false;
	edOpa_add.enabled = false;
	
	
	lstMode.onChange = function()
	{
		mode = lstMode.selection.index;
		if (mode<0) {
			lstMode.items[0].selected = true;
			mode = 0;
		}
		switch(mode){
		case 0:
			edRadius.enabled = true;
			edSide.enabled = false;
			edOpa_add.enabled = false;
			break;
		case 1:
		case 2:
			edRadius.enabled = false;
			edSide.enabled = true;
			edOpa_add.enabled = true;
			break;
		}
	}
	//-------------------------------------------------------------------------
	function getParams()
	{
		var ret = false;
		try
		{
			layerName = edLayerName.text;
			if (layerName == "") {
				alert("名前が不正");
				return ret;
			}
			count = edCount.text * 1;
			if ( count<=0) {
				alert("配置数が不正");
				return ret;
			}
			rot = 360 / count;
			radius = edRadius.text * 1;
			if ( radius<0) {
				alert("筒の半径が不正");
				return ret;
			}
			side = edSide.text * 1;
			if ( side<0) {
				alert("横の距離が不正");
				return ret;
			}
			mode = lstMode.selection.index;
			if ( mode<0 ) {
				alert("実行モードが選択されていません");
				return ret;
			}
			ret = true;
		}catch(e){
			return ret;
		}
		return ret;
	}
	//-------------------------------------------------------------------------
	function getSelectedLayer()
	{
		targetLayer = null;
		targetComp = null;
		var act = app.project.activeItem;
		if ( act instanceof CompItem) {
			if (act.selectedLayers.length==1){
				targetComp = act;
				targetLayer = act.selectedLayers[0];
			}else{
				alert("Layerは1個だけ選択してください");
			}
		}else{
			alert("Compをアクティブにしてください。");
		}
	}
	//-------------------------------------------------------------------------
	btnExec.onClick = function()
	{
		getSelectedLayer();
		if ( targetLayer == null) return;
		if ( getParams() == false ) return;

		if (is_center_null() == true){
			alert("同名のレイヤがあります。");
		}else{
			switch(mode){
			case 0: 
				setupCylinder();
				break;
			case 1:
				setupSide();
				break;
			case 2:
				setupDeps();
			}
		}
	}

	//-------------------------------------------------------------------------
	if ( ( me instanceof Panel) == false){
		winObj.center(); 
		winObj.show();
	}
	//-------------------------------------------------------------------------
})(this);
