
(function(me){

	var lstSheet_item = XMPSHEET.getNameList();
	//-------------------------------------------------------------------------
	var winObj = ( me instanceof Panel) ? me : new Window("palette", "XMP Sheet data (ARDJ)", [ 0,  0,  210,  290]  ,{resizeable:true, maximizeButton:true, minimizeButton:true});
	//-------------------------------------------------------------------------
	var x0 = 5; 
	var y0 = 5;
	var y1 = 30;
	var btnDisp = winObj.add("button",	[  5,   y0,   5+ 200,  y1], "再表示" );
	y0 += 35; y1 = y0 +30; 
	var btnNew = winObj.add("button",	[  5,   y0,   5+  60,   y1], "New" );
	y0 += 35; y1 = y0 +30; 
	var btnEdit = winObj.add("button",	[  5,   y0,   5+  60,  y1], "Open" );
	y0 += 35; y1 = y0 +30; 
	var btnSetRemap = winObj.add("button",	[  5,   y0,   5+  60,  y1], "Remap" );
	y0 += 35; y1 = y0 +30; 
	var btnUp = winObj.add("button",		[  5,   y0,   5+  60,  y1], "Up" );
	y0 += 35; y1 = y0 +30; 
	var btnDown = winObj.add("button",	[  5,   y0,   5+  60,  y1], "Down" );
	y0 += 35; y1 = y0 +30; 
	var btnAdd = winObj.add("button",		[  5,   y0,   5+  60,   y1], "Import" );
	y0 += 35; y1 = y0 +30; 
	var btnOut = winObj.add("button",		[  5,   y0,   5+  60,  y1], "Output" );
	y0 += 35; y1 = y0 +30; 
	var btnDel = winObj.add("button",		[  5,   y0,   5+  60,  y1], "Del" );
	y0 += 35; y1 = y0 +30; 
	var btnOutAll = winObj.add("button",		[  5,   y0,   5+  60,  y1], "OutAll" );
	y0 += 35; y1 = y0 +30; 
	var btnAddAll = winObj.add("button",		[  5,   y0,   5+  60,  y1], "addAll" );
	y0 += 35; y1 = y0 +30; 
	var lstSheet = winObj.add("listbox",	[  70,   40,   70+ 135,   40+ 245], lstSheet_item );
	
	function chkBtn()
	{
		var idx = -1;
		if ( lstSheet.selection != null) idx = lstSheet.selection.index;
		var b =  ( idx>=0);
		btnSetRemap.enabled = b;
		btnEdit.enabled = b;
		btnOut.enabled = b;
		btnDel.enabled = b;
		btnUp.enabled = (idx>0);
		btnOutAll.enabled = (lstSheet.items.length>0);
		btnDown.enabled = ((idx>=0)&&(idx<lstSheet.items.length-1)) ;
	}
	chkBtn();
	lstSheet.onChange = chkBtn;
	//-------------------------------------------------------------------------
	function resizeW()
	{
		var b =winObj.bounds;
		
		var ab = btnDisp.bounds;
		ab[2] = b.width -5;
		btnDisp.bounds = ab;
		
		var ab = lstSheet.bounds;
		ab[2] = b.width -5;
		ab[3] = b.height -5;
		lstSheet.bounds = ab;
		
	}
	resizeW();
	winObj.onResize = resizeW;
	//-------------------------------------------------------------------------
	function listup()
	{
		var lst = XMPSHEET.getNameList();
		lstSheet.visible = false;
		lstSheet.removeAll();
		if ( lst.length>0){
			for ( var i=0;i<lst.length;i++){
				lstSheet.add("item",lst[i]);
			}
		}
		lstSheet.visible = true;
	}
	btnDisp.onClick = listup;
	//-------------------------------------------------------------------------
	var listupImport = function()
	{
		try{
			if ( lstSheet != null){
				listup();
			}
		}catch(e){
		}
		alert("toXMP OK!");
	}
	//-------------------------------------------------------------------------
	XMPSHEET.importFileFunc = listupImport;
	winObj.onClose = function()
	{
		XMPSHEET.importFileFunc = null;
	}
	//-------------------------------------------------------------------------
	btnAdd.onClick = function(){
		if (XMPSHEET.importFile(false)){
			listup();
		}
	}
	//-------------------------------------------------------------------------
	btnNew.onClick = function(){
		XMPSHEET.importFileFunc = listupImport;
		XMPSHEET.newFile();
	}
	//-------------------------------------------------------------------------
	btnSetRemap.onClick = function(){
		if ( lstSheet.selection!=null){
			var idx = lstSheet.selection.index;
			if ( idx>=0) {
				var obj = XMPSHEET.getData(idx+1);
				if ( obj.data !==undefined){
					var j = FsJSON.parse(obj.data);
					XMPSHEET.setRemapDialog(j);
				}
			}
		}
	}
	//-------------------------------------------------------------------------
	btnEdit.onClick = function(){
		if ( lstSheet.selection!=null){
			var idx = lstSheet.selection.index;
			if ( idx>=0)
			XMPSHEET.importFileFunc = listupImport;
			if (XMPSHEET.editFile(idx+1))
			{
			}
		}
	}
	//-------------------------------------------------------------------------
	btnUp.onClick = function(){
		if ( lstSheet.selection!=null){
			var idx = lstSheet.selection.index;
			if ( idx>=1)
				if  (XMPSHEET.up(idx+1)) 
				{
					listup();
					lstSheet.items[idx-1].selected = true;
				}
		}
	}
	//-------------------------------------------------------------------------
	btnDown.onClick = function(){
		if ( lstSheet.selection!=null){
			var idx = lstSheet.selection.index;
			if (( idx>=0)&&(idx<lstSheet.items.length-1))
				if (XMPSHEET.down(idx+1))
				{
					listup();
					lstSheet.items[idx+1].selected = true;
				}
		}
	}
	//-------------------------------------------------------------------------
	btnOut.onClick = function(){
		if ( lstSheet.selection!=null){
			var idx = lstSheet.selection.index;
			if ( idx>=0)
				XMPSHEET.exportFile(idx+1);
		}
	}
	//-------------------------------------------------------------------------
	btnOutAll.onClick = function()
	{
		XMPSHEET.exportAll();
	}
	//-------------------------------------------------------------------------
	btnAddAll.onClick = function()
	{
		XMPSHEET.importAll();
		listup();
	}
	//-------------------------------------------------------------------------
	btnDel.onClick = function(){
		if ( lstSheet.selection!=null){
			var idx = lstSheet.selection.index;
			if ( idx>=0)
			{
				var n = XMPSHEET.getName(idx+1);
				if (confirm(n + "を削除しますか？")){
					XMPSHEET.remove(idx+1);
					listup();
				}
			}
		}
	}
	//-------------------------------------------------------------------------
	if ( ( me instanceof Panel) == false){
		winObj.center(); 
		winObj.show();
	}
	//-------------------------------------------------------------------------
	
	//-------------------------------------------------------------------------
})(this);