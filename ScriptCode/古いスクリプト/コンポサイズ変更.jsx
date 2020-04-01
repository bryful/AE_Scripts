
(function(me){

	var rbIndex = 4;
	//-------------------------------------------------------------------------
	var winObj = ( me instanceof Panel) ? me : new Window("palette", "Comp Resize", [ 0,  0,  144,  190]  ,{resizeable:true, maximizeButton:true, minimizeButton:true});
	//-------------------------------------------------------------------------
	var btnGetSize = winObj.add("button", [   5,    5,    5+ 140,    5+  24], "Get" );
	btnGetSize.graphics.font = ScriptUI.newFont("Tahoma",ScriptUI.FontStyle.REGULAR, 11);
	var stWidth = winObj.add("statictext", [  13,   43,   13+  32,   43+  18], "横幅");
	stWidth.graphics.font = ScriptUI.newFont("Tahoma",ScriptUI.FontStyle.REGULAR, 11);
	var stHeight = winObj.add("statictext", [  13,   72,   13+  32,   72+  18], "縦幅");
	stHeight.graphics.font = ScriptUI.newFont("Tahoma",ScriptUI.FontStyle.REGULAR, 11);
	var edWidth = winObj.add("edittext", [  50,   40,   50+  95,   40+  21], "");
	edWidth.graphics.font = ScriptUI.newFont("Tahoma",ScriptUI.FontStyle.REGULAR, 11);
	var edHeight = winObj.add("edittext", [  50,   70,   50+  95,   70+  21], "");
	edHeight.graphics.font = ScriptUI.newFont("Tahoma",ScriptUI.FontStyle.REGULAR, 11);

	var stPos = winObj.add("statictext", [  13,   98,   13+  32,   98+  18], "位置");
	var rb = [];
	rb.push( winObj.add("radiobutton", [  57,   97,   57+  15,   97+  15], ""));
	rb.push( winObj.add("radiobutton", [  78,   97,   78+  15,   97+  15], ""));
	rb.push( winObj.add("radiobutton", [  99,   97,   99+  15,   97+  15], ""));
	rb.push( winObj.add("radiobutton", [  57,  118,   57+  15,  118+  15], ""));
	rb.push( winObj.add("radiobutton", [  78,  118,   78+  15,  118+  15], ""));
	rb.push( winObj.add("radiobutton", [  99,  118,   99+  15,  118+  15], ""));
	rb.push( winObj.add("radiobutton", [  57,  139,   57+  15,  139+  15], ""));
	rb.push( winObj.add("radiobutton", [  78,  139,   78+  15,  139+  15], ""));
	rb.push( winObj.add("radiobutton", [  99,  139,   99+  15,  139+  15], ""));

	var btnSetSize = winObj.add("button", [   5,  160,    5+ 140,  160+  24], "Set" );
	btnSetSize.graphics.font = ScriptUI.newFont("Tahoma",ScriptUI.FontStyle.REGULAR, 11);

	rb[rbIndex].value = true;
	
	//-------------------------------------------------------------------------
	function dispRbIndex()
	{
		var s = "位置";
		switch(rbIndex)
		{
			case 0: s ="左上"; break;
			case 1: s ="中上"; break;
			case 2: s ="左上"; break;
			case 3: s ="左中"; break;
			case 4: s ="中央"; break;
			case 5: s ="右中"; break;
			case 6: s ="左下"; break;
			case 7: s ="中下"; break;
			case 8: s ="右下"; break;
		}
		stPos.text = s;
	}
	//-------------------------------------------------------------------------
	for ( var i=0; i<rb.length; i++){
		rb[i].idx = i;
		rb[i].onClick = function()
		{
			rbIndex = this.idx;
			dispRbIndex();
		}
	}
	dispRbIndex();

	//-------------------------------------------------------------------------
	function resizeWin()
	{
		var b = winObj.bounds;
		var w = b.width -10;
		var gb = btnGetSize.bounds;
		gb.width = w;
		btnGetSize.bounds = gb;
		
		var wb = edWidth.bounds;
		wb.width = w - 45;
		edWidth.bounds = wb;

		var hb = edHeight.bounds;
		hb.width = w -45;
		edHeight.bounds = hb;
		
		var sb = btnSetSize.bounds;
		sb.width = w;
		btnSetSize.bounds = sb;
	}
	resizeWin();
	winObj.onResize = resizeWin;
	//-------------------------------------------------------------------------
	function getComp()
	{
		var ret = [];
		var sl = app.project.selection;
		if ( sl.length>0){
			for ( var i=0; i<sl.length; i++){
				if ( sl[i] instanceof CompItem) {
					ret.push(sl[i]);
				}
			}
		}
		return ret;
	}
	//-------------------------------------------------------------------------
	function getCompSize()
	{
		var lst = getComp();
		if ( lst.length==1){
			
			edWidth.text = lst[0].width +"";
			edHeight.text = lst[0].height +"";
		
		}else{
			alert("コンポを1個だけ選んでください");
		}
	}
	btnGetSize.onClick = getCompSize;
	//-------------------------------------------------------------------------
	if ( ( me instanceof Panel) == false){
		var lst = getComp();
		if ( lst.length>0){
			edWidth.text = lst[0].width +"";
			edHeight.text = lst[0].height +"";
		}
	}
	//-------------------------------------------------------------------------
	function setCompSizeSub(cmp,w,h,p)
	{
		if ( (cmp.width == w)&&(cmp.height == h) ) return;
		
		var addPos = [0,0,0];
		var aw = w - cmp.width;
		var ah = h - cmp.height;
		
		switch(p)
		{
			case 0:
				addPos[0] = 0;
				addPos[1] = 0;
				break; // そのまま
			case 1:
				addPos[0] = aw/2;
				addPos[1] = 0;
				break;
			case 2:
				addPos[0] = aw;
				addPos[1] = 0;
				break;

			case 3:
				addPos[0] = 0;
				addPos[1] = ah/2;
				break;
			case 4:
				addPos[0] = aw/2;
				addPos[1] = ah/2;
				break;
			case 5:
				addPos[0] = aw;
				addPos[1] = ah/2;
				break;

			case 6:
				addPos[0] = 0;
				addPos[1] = ah;
				break;
			case 7:
				addPos[0] = aw/2;
				addPos[1] = ah;
				break;
			case 8:
				addPos[0] = aw;
				addPos[1] = ah;
				break;
		}
		cmp.width = w;
		cmp.height = h;
		if ( cmp.numLayers>0){
			for ( var i=1; i<=cmp.numLayers; i++){
				var lyr = cmp.layer(i);
				if ( lyr.parent == null) {
					var pos = lyr.property("ADBE Transform Group").property("ADBE Position");
					if ( pos.numKeys==0){
						var pp = pos.value;
						pp[0] += addPos[0];
						pp[1] += addPos[1];
						pos.setValue(pp);
					}else{
						for ( var i=1; i<=pos.numKeys; i++)
						{
							var pp = pos.keyValue(i);
							pp[0] += addPos[0];
							pp[1] += addPos[1];
							pos.setValueAtKey(i,pp);
						}
					}
				}
			}
		}
	}
	//-------------------------------------------------------------------------
	function setCompSize()
	{
		var w = 0;
		var h = 0;
		try{
			w = eval(edWidth.text);
		}catch(e){
			alert("横幅の値がおかしい");
			return;
		}
		if ( (typeof(w) != "number")||(w<10)){
			alert("横幅の値が変");
			return;
		}
		try{
			h = eval(edHeight.text);
		}catch(e){
			alert("縦幅の値がおかしい");
			return;
		}
		if ( (typeof(h) != "number")||(h<10)){
			alert("横幅の値が変");
			return;
		}
		var p = rbIndex;
		if ( (p<0)||(p>=9)) {
			p = 4;
			rbIndex = p;
			dispRbIndex();
		}
		var lst = getComp();
		if ( lst.length>0){
			app.beginUndoGroup("コンポサイズ変更");
			for ( var i=0; i<lst.length; i++){
				setCompSizeSub(lst[i],w,h,p);
			}
			app.endUndoGroup();
		}else{
			alert("コンポを選んでください");
		}
	}
	btnSetSize.onClick = setCompSize;
	//-------------------------------------------------------------------------
	if ( ( me instanceof Panel) == false){
		winObj.center(); 
		winObj.show();
	}
	//-------------------------------------------------------------------------
})(this);