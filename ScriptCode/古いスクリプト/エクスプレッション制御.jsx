(function(me){

	//-------------------------------------------------------------------------
	var winObj = ( me instanceof Panel) ? me : new Window("palette", "エクス制御", [ 875,  363,  875+ 162,  363+ 293] );
	//-------------------------------------------------------------------------
	var btnAddExp = winObj.add("button", [  12,    8,   12+ 136,    8+  23], "エクスプレッション追加" );
	btnAddExp.graphics.font = ScriptUI.newFont("Tahoma",ScriptUI.FontStyle.REGULAR, 11);
	var btnDeleteExp = winObj.add("button", [  12,   37,   12+ 136,   37+  23], "エクスプレッション削除" );
	btnDeleteExp.graphics.font = ScriptUI.newFont("Tahoma",ScriptUI.FontStyle.REGULAR, 11);
	var btnAllONAtLayer = winObj.add("button", [  12,   85,   12+ 136,   85+  23], "すべてONに(選択レイヤ)" );
	btnAllONAtLayer.graphics.font = ScriptUI.newFont("Tahoma",ScriptUI.FontStyle.REGULAR, 11);
	var btnAllOFFAtLayer = winObj.add("button", [  12,  114,   12+ 136,  114+  23], "すべてOFFに(選択レイヤ)" );
	btnAllOFFAtLayer.graphics.font = ScriptUI.newFont("Tahoma",ScriptUI.FontStyle.REGULAR, 11);
	var btnAllONAtComp = winObj.add("button", [  12,  159,   12+ 136,  159+  23], "すべてONに(選択コンポ)" );
	btnAllONAtComp.graphics.font = ScriptUI.newFont("Tahoma",ScriptUI.FontStyle.REGULAR, 11);
	var btnAllOFFAtComp = winObj.add("button", [  12,  188,   12+ 136,  188+  23], "すべてOFFに(選択コンポ)" );
	btnAllOFFAtComp.graphics.font = ScriptUI.newFont("Tahoma",ScriptUI.FontStyle.REGULAR, 11);
	var btnSliderAtComp = winObj.add("button", [  12,  231,   12+ 136,  231+  23], "スライダ\"ー\"対策(コンポ)" );
	btnSliderAtComp.graphics.font = ScriptUI.newFont("Tahoma",ScriptUI.FontStyle.REGULAR, 11);
	var btnSliderAtProj = winObj.add("button", [  12,  260,   12+ 136,  260+  23], "スライダ\"ー\"対策(Proj)" );
	btnSliderAtProj.graphics.font = ScriptUI.newFont("Tahoma",ScriptUI.FontStyle.REGULAR, 11);

	//-------------------------------------------------------------------------
	function getLayer()
	{
		var ret = [];
		if (app.project.activeItem instanceof CompItem){
			if ( app.project.activeItem.selectedLayers.length>0){
				ret = app.project.activeItem.selectedLayers;
			}
		}
		return ret;
	}
	//-------------------------------------------------------------------------
	function getComp()
	{
		var ret = [];
		if ( app.project.selection.length>0){
			for ( var i=0; i<app.project.selection.length; i++){
				if ( app.project.selection[i] instanceof CompItem){
					ret.push(app.project.selection[i]);
				}
			}
		}
		return ret;
	}
	//-------------------------------------------------------------------------
	function getProp()
	{
		var ret = new Object;
		ret.props = [];
		ret.layer = null
		ret.numProperties = 0;
		if (app.project.activeItem instanceof CompItem){
			if ( app.project.activeItem.selectedLayers.length==1){
				ret.layer = app.project.activeItem.selectedLayers[0];
				ret.props = app.project.activeItem.selectedProperties;
				ret.numProperties = app.project.activeItem.selectedProperties.length;
			}
		}
		return ret;
	}
	//-------------------------------------------------------------------------
	var expErr = "";
	//-------------------------------------------------------------------------
	function expressionOn(tLayer)
	{
		function expOn(p)
		{
			if ( p instanceof Property){
				if ( (p.expression != "")&&(p.expressionEnabled == false)){
					if ( p.expressionError ==""){
						p.expressionEnabled = true;
					}else{
						expErr += "**********************\r\n" + p.expressionError+"\r\n";
						p.selected = true;
					}
				}
			}else {
				if ( p.numProperties>0){
					for ( var i=1; i<=p.numProperties; i++) {
						expOn(p.property(i));
					}
				}
			}
	
		}

		if ( tLayer.numProperties<=0) {
			return;
		}
		for ( var i=1; i<=tLayer.numProperties;i++)
		{
			expOn(tLayer.property(i));
		}
	}
	//-------------------------------------------------------------------------
	function expressionOff(tLayer)
	{
		function expOff(p)
		{
			if ( p instanceof Property){
				if ( p.expression !="")
					p.expressionEnabled = false;
			}else{
				if ( p.numProperties>0){
					for ( var i=1; i<=p.numProperties; i++) expOff(p.property(i));
				}
			}

		}
		if ( tLayer.numProperties<=0) return;
		for ( var i=1; i<=tLayer.numProperties;i++)
		{
			expOff(tLayer.property(i));
		}
	}
	//-------------------------------------------------------------------------
	function allONatLayer()
	{
		var lst = getLayer();
		if ( lst.length <=0) {
			alert("レイヤを選択してください。");
			return;
		}
		expErr="";
		app.beginUndoGroup("エクスプレッションをすべてONに");
		app.beginSuppressDialogs();
		for ( var i=0; i<lst.length; i++) expressionOn(lst[i]);
		if ( expErr!=""){
			alert(expErr);
		}
		app.endSuppressDialogs();
		app.endUndoGroup();
	}
	//-------------------------------------------------------------------------
	function allOFFatLayer()
	{
		var lst = getLayer();
		if ( lst.length <=0) {
			alert("レイヤを選択してください。");
			return;
		}
		app.beginUndoGroup("エクスプレッションをすべてOFFに");
		for ( var i=0; i<lst.length; i++) expressionOff(lst[i]);
		app.endUndoGroup();
	}
	//-------------------------------------------------------------------------
	function allONatComp()
	{
		var lst = getComp();
		if ( lst.length <=0) {
			alert("コンポを選択してください。");
			return;
		}
		expErr="";
		app.beginUndoGroup("エクスプレッションをすべてONに");
		app.beginSuppressDialogs();
		for ( var i=0; i<lst.length; i++) {
			if ( lst[i].numLayers>0){
				for ( var j=1; j<=lst[i].numLayers;j++)
				expressionOn(lst[i].layer(j));
			}
		}
		if ( expErr!=""){
			alert(expErr);
		}
		app.endSuppressDialogs();
		app.endUndoGroup();
	}
	//-------------------------------------------------------------------------
	function allOFFatComp()
	{
		var lst = getComp();
		if ( lst.length <=0) {
			alert("コンポを選択してください。");
			return;
		}
		app.beginUndoGroup("エクスプレッションをすべてOFFに");
		for ( var i=0; i<lst.length; i++) {
			if ( lst[i].numLayers>0){
				for ( var j=1; j<=lst[i].numLayers;j++)
				expressionOff(lst[i].layer(j));
			}
		}
		app.endUndoGroup();
	}
	//-------------------------------------------------------------------------
	function addExp()
	{
		var props = getProp();
		if ( props.numProperties!=1){
			alert("プロパティを１個だけ選択してください。");
			return;
		}
		if (( props.props[0].expression =="")&&(props.props[0].canSetExpression == true)){
			app.beginUndoGroup("エクスプレッション追加");
			app.executeCommand(2702);
			app.endUndoGroup();
		}
	}
	//-------------------------------------------------------------------------
	function deleteExp()
	{
		var props = getProp();
		if ( props.numProperties<=0){
			alert("プロパティを選択してください。");
			return;
		}
		for (var i=0; i<props.numProperties; i++){
			if ( props.props[0].expression !=""){
				app.beginUndoGroup("エクスプレッション削除");
				props.props[i].expression = "";
				app.endUndoGroup();
			}
		}
	}
	//-------------------------------------------------------------------------
	var counter = 0;
	var srcWord = "\"スライダ\"";
	var srcWordB = "\"スライダー\"";
	var dstWord = "\"ADBE Slider Control-0001\"";
	var srcWord2 = ".param(" + dstWord + ")";
	var dstWord2 = "(" + dstWord + ")";
	//-------------------------------------------------------------------------
	function sliderForgetPro(pro)
	{
		if ( pro instanceof Property) {
			if ( (pro.canSetExpression == true)&&(pro.expression != "")){
				var s = "";
				if ( pro.expression.indexOf(srcWordB)>=0) {
					s = pro.expression + "";
					s = s.split(srcWordB).join(dstWord);
				}else if ( pro.expression.indexOf(srcWord)>=0) {
					s = pro.expression + "";
					s = s.split(srcWord).join(dstWord);
				}
				if ( s != ""){
					if ( s.indexOf(srcWord2)>=0) {
						s = s.split(srcWord2).join(dstWord2);
					}
					pro.expression = s;
					pro.expressionEnabled = true;
					counter++;
				}
			}
		}else if ( (pro instanceof PropertyGroup)||(pro instanceof MaskPropertyGroup) ){
			if ( pro.numProperties>0){
				for (var i=1; i<=pro.numProperties; i++){
					sliderForgetPro(pro.property(i));
				}
			}
		}
	
		return true;
	}
	//---------------------------------------------------------------------------
	function sliderForget(tComp)
	{
		if ( tComp.numLayers>0){
			for ( var i=1; i<=tComp.numLayers;i++){
				var lyr = tComp.layer(i);
				if (lyr.numProperties>0) {
					for ( var j=1; j<=lyr.numProperties;j++){
						sliderForgetPro(lyr.property(j));
					}
				}
			}
		}
		return true;
	}
	//---------------------------------------------------------------------------
	function sliderForgetAtComp()
	{
		var selectedItems = app.project.selection;
		if ( (selectedItems!=null)&&(selectedItems.length>0) ) {
			app.beginUndoGroup("スライダを対処");
			counter = 0;
			for (var i = 0; i < selectedItems.length; i++) {
				if (selectedItems[i] instanceof CompItem) {
					if (sliderForget(selectedItems[i])==true) {
					}
				}
			}
			app.endUndoGroup();
			alert( counter +"箇所の「スライダ」を対処しました。");
		}else{
			//エラー処理
		}
	}
	//-------------------------------------------------------------------------
	//---------------------------------------------------------------------------
	function sliderForgetAtProj()
	{
		app.beginUndoGroup("スライダを対処");
		counter = 0;
		
		if (app.project.numItems>0){
			for ( var i=1; i<=app.project.numItems; i++)
			{
				if ( app.project.item(i) instanceof CompItem){
					sliderForget(app.project.item(i));
				}
			}
		}
		app.endUndoGroup();
		alert( counter +"箇所の「スライダ」を対処しました。");
	}
	//-------------------------------------------------------------------------
	btnAllONAtLayer.onClick = allONatLayer;
	btnAllOFFAtLayer.onClick = allOFFatLayer;
	btnAllONAtComp.onClick = allONatComp;
	btnAllOFFAtComp.onClick = allOFFatComp;
	btnAddExp.onClick = addExp;
	btnDeleteExp.onClick = deleteExp;
	btnSliderAtComp.onClick = sliderForgetAtComp;
	btnSliderAtProj.onClick = sliderForgetAtProj;
	//-------------------------------------------------------------------------
	
	if ( ( me instanceof Panel) == false){
		winObj.center(); 
		winObj.show();
	}
	//-------------------------------------------------------------------------
})(this);