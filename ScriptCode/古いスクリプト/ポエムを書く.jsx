(function (me)
{
	if (ExternalObject.AdobeXMPScript == undefined) {
		ExternalObject.AdobeXMPScript = new
		ExternalObject('lib:AdobeXMPScript');
	}
	//-------------------------------------------------------------------------
	var winObj = ( me instanceof Panel) ? me : new Window("palette", "ポエムを書く", [ 0,  0,  500,  300]  ,{resizeable:true, maximizeButton:true, minimizeButton:true});
	//-------------------------------------------------------------------------
	var btnGet = winObj.add("button", [ 10,  5,  10+50,  5+  30], "GET" );
	var btnSet = winObj.add("button", [ 65,  5,  65+50,  5+  30], "SET" );
	var btnClear = winObj.add("button", [ 130,  5,  130+50,  5+  30], "Clear" );
	var stInfo = winObj.add("statictext", [  185,   5,   185+ 260,   5+  30], "改行はctrl + Enterです。");
	
	var edPoem = winObj.add("edittext", [  10,   40,   10+ 480,   40+ 250], "", { multiline:true, scrollable:true });
	edPoem.graphics.font = ScriptUI.newFont("Tahoma",ScriptUI.FontStyle.REGULAR, 16);
	//-------------------------------------------------------------------------
	function resizeWin()
	{
		var b = winObj.bounds;
		var eb = edPoem.bounds;
		eb[2] = b.width-5;
		eb[3] = b.height-5;
		edPoem.bounds = eb;
	}
	resizeWin();
	winObj.onResize =resizeWin;

	//-------------------------------------------------------------------------
	function getPoem()
	{
		var mdata = new XMPMeta(app.project.xmpPacket);
		var schemaNS = XMPMeta.getNamespaceURI("xmp");
		var propName = "xmp:Poem";
		try {
			var p = mdata.getProperty(schemaNS, propName);
			if ( p== undefined) {
				alert("ポエムは書かれていません");
			}
			edPoem.text =unescape(p.value);
		}
		catch(e) {
			//alert(e);
		}
	}
	btnGet.onClick = getPoem;
	//-------------------------------------------------------------------------
	function clear()
	{
		edPoem.text = "";
	
	}
	btnClear.onClick = clear;
	//-------------------------------------------------------------------------
	function setPoem()
	{
		var mdata = new XMPMeta(app.project.xmpPacket);
		var schemaNS = XMPMeta.getNamespaceURI("xmp");
		var propName = "xmp:Poem";
		try {
			var s = edPoem.text;
			if ( s!=""){
				mdata.setProperty(schemaNS, propName,escape(s));
			}else{
			}
		}
		catch(e) {
			alert(e);
		}
		app.project.xmpPacket = mdata.serialize();
	}
	btnSet.onClick = setPoem;
	//-------------------------------------------------------------------------
	if ( ( me instanceof Panel) == false){
		winObj.center(); 
		winObj.show();
	}
	//-------------------------------------------------------------------------


})(this);