
function changeOutputPathWithFolder()
{
	var title		= "書き出し場所変更(サブフォルダ作成)";
	var prefName	= title + ".pref";
	var dialog = null;
	var cbHeader = null;
	var edHeader = null;
	var cbFooter = null;
	var edFooter = null;
	var params = new Object;
	params.path = "";
	params.isHeader = false;
	params.header = "";
	params.isFooter = false;
	params.footer = "";
	//----------------------------------------------------
	function prefSave()
	{
		var text_file = new File(prefName);
		text_file.open("w","TEXT","????"); 
		text_file.encoding = "UTF-8";
		text_file.writeln(prefName);
		text_file.writeln(params.path);
		text_file.writeln(params.isHeader);
		text_file.writeln(params.header);
		text_file.writeln(params.isFooter);
		text_file.writeln(params.footer);
		text_file.writeln("この列は必ず7行目");
		text_file.close();
	}
	//----------------------------------------------------
	function prefLoad()
	{
		
		var text_file = new File(prefName);
		if (text_file.exists ==true){
			text_file.open("r","TEXT","????"); 
			text_file.encoding = "UTF-8";
			var s = text_file.readln();
			if (s != prefName){
				return;
			}
			var s = text_file.readln();
			if ( (s!="")&&(s!="undefined") ){
				var fld = new Folder(s);
				if ( fld.exists == true) {
					params.path = s;
				}
			}
			var s = text_file.readln();
			if ( (s!="")&&(s!="undefined") ){
				s = s.toUpperCase().replace(/^\s+|\s+$/g, "");
				if ( s=="TRUE"){
					params.isHeader = true;
				}else{
					params.isHeader = false;
				}
			}
			var s = text_file.readln();
			if ( (s!="")&&(s!="undefined") ){
				params.header = s.replace(/^\s+|\s+$/g, "");
			}
			var s = text_file.readln();
			if ( (s!="")&&(s!="undefined") ){
				s = s.toUpperCase().replace(/^\s+|\s+$/g, "");
				if ( s=="TRUE"){
					params.isFooter = true;
				}else{
					params.isFooter = false;
				}
			}
			var s = text_file.readln();
			if ( (s!="")&&(s!="undefined") ){
				params.footer = s.replace(/^\s+|\s+$/g, "");
			}

			text_file.close();
		}

	}	//-----------------------------------------------------------
	function getOutputPath()
	{
		var ret = null;
		var cmdName = "AE_SelectFolder.exe";
	
		var cmd = new File(cmdName);
		if ( cmd.exists == true) {
			var p = system.callSystem("AE_SelectFolder.exe");
			if ( p !="" ) ret = new Folder(p);
		}else{
			ret = folderGetDialog("");
		}
		return ret;
	}
	//-----------------------------------------------------------
	function changeParent(src, p)
	{
		var nm = src.name;
		
		return new File( p.fsName + "\\" + nm);
	}
	//-----------------------------------------------
	function splitFileName(s)
	{
		var ss = s;
		var o = new Object;
		o.node = "";
		o.frameSepa = "";
		o.frames = "";
		o.framesFooter = "";
		o.ext = "";
		
		if ( ss == "" ) return o;
		var p1 = ss.lastIndexOf(".");
		if ( p1>=0) {
			o.ext = ss.substring(p1);
			ss = ss.substring(0,p1);
		}
		
		var idx = ss.lastIndexOf("]");
		if ( (idx != -1)&&( idx != ss.length-1) ){
			o.framesFooter = ss.substring(idx +1);
			ss = ss.substring(0,idx+1);
		}
		
		if ( ss[ss.length-1] =="]" ){
			p1 = ss.lastIndexOf("[");
			o.frames = ss.substring(p1);
			ss = ss.substring(0,p1);
		}else{
			var pp = -1;
			for ( var i= ss.length-1; i>=0; i--){
				var c = ss[i];
				if ( ( c>="0")&&( c<="9") ){
				}else{
					pp = i;
					break;
				}
			}
			if ( pp>=0) {
				o.frames = ss.substring(pp+1);
				ss = ss.substring(0,pp+1);
			}
		}
		var c = ss[ss.length-1];
		if ( (c =="_")||(c =="-") ){
			o.frameSepa = c;
			ss = ss.substring(0,ss.length-1);
		}
		o.node = ss;
		return o;
	}

	//-----------------------------------------------------------
	function getParams()
	{
		params.isHeader	= cbHeader.value;
		params.header	= edHeader.text.replace(/^\s+|\s+$/g, "");
		
		params.isFooter	= cbFooter.value;
		params.footer	= edFooter.text.replace(/^\s+|\s+$/g, "");
		
	}
	//-----------------------------------------------------------
	function buildDialog()
	{
		var pLeft		= 25;
		var pTop		= 10;
		
		var cbWidth		= 100;
		var edWidth		= 100;
		var pHeight		= 24;
		
		var pInter	= 2;
		
		var btnW		= 75;
		var btnH		= 24;
		
		var dWidth	= cbWidth + edWidth + (pLeft * 2);
		var dHeight = pTop + (pHeight + pInter) * 3 + btnH + pTop;
		
		dialog = new Window("dialog",title);
		dialog.bounds = [0, 0, dWidth, dHeight];
		dialog.center();
		
		var x0,x1,y0,y1;
		x0 = 10;
		x1 = x0 + cbWidth + edWidth;
		y0 = pTop;
		y1 = y0 + pHeight;
		var st = dialog.add("statictext",[x0,y0,x1,y1 ],"書き出し名からフォルダを作成します。");
		
		x0 = pLeft;
		x1 = x0 + cbWidth;
		y0 = y1 + pInter;
		y1 = y0 + pHeight;
		cbHeader = dialog.add("checkbox",[x0,y0,x1,y1 ],"ヘッダーを付ける");
		x0 += cbWidth + pInter;
		x1 = x0 + edWidth;
		edHeader = dialog.add("edittext", [x0,y0,x1,y1 ], "");
		x0 = pLeft;
		x1 = x0 + cbWidth;
		y0 += pHeight + pInter;
		y1 = y0 + pHeight;
		cbFooter = dialog.add("checkbox",[x0,y0,x1,y1 ],"フッターを付ける");
		x0 += cbWidth + pInter;
		x1 = x0 + edWidth;
		edFooter = dialog.add("edittext", [x0,y0,x1,y1 ], "");
		
		
		x0 = dWidth -( pLeft + btnW * 2 + pInter);
		x1 = x0 + btnW;
		y0 += pHeight + pInter;
		y1 = y0 + btnH;
		var okBtn = dialog.add("button", [ x0, y0, x1, y1], "OK",     {name:'ok'} );
		
		x0 = x1 + pInter;
		x1 = x0 + btnW;
		var cancelBtn	= dialog.add("button", [ x0, y0, x1, y1], "Cancel", {name:'cancel'});

		cbHeader.onClick = getParams;
		cbFooter.onClick = getParams;
		edHeader.onChange = getParams;
		edFooter.onChange = getParams;
		cbHeader.value = params.isHeader;
		edHeader.text = params.header;
		cbFooter.value = params.isFooter;
		edFooter.text = params.footer;
		
		return dialog.show();
	}
	//-----------------------------------------------------------
	this.execute = function()
	{
		if (app.project.renderQueue.numItems<=0){
			alert("レンダーキューに何も登録されていません。");
			return false;
		}
		
		prefLoad();
		var r =  buildDialog();
		if ( r==1){
			//alert(params.isHeader + " :[" + params.header+"]\n"
			//+params.isFooter + " :[" + params.footer+"]")
			
			app.beginUndoGroup(title);
			var newLocation = getOutputPath();
			params.path = newLocation.fsName;
			prefSave();
			for (i = 1; i <= app.project.renderQueue.numItems; i++) {
				var curItem = app.project.renderQueue.item(i);
				if ( (curItem.status == RQItemStatus.QUEUED)||(curItem.status == RQItemStatus.NEEDS_OUTPUT) ) {
					var curOM = curItem.outputModule(1);//出力モジュールは１個と決め付け
					
					var n = splitFileName(File.decode(curOM.file.name));
					
					var newPath = newLocation.fsName;
					newPath += "\\";
					if ( params.isHeader){
						newPath += params.header;
					}
					newPath += n.node;
					if ( params.isFooter){
						newPath += params.footer;
					}
					
					var newFolder = new Folder(newPath);
					if (newFolder.exists == false) newFolder.create();

					curOM.file = changeParent(curOM.file, newFolder);
				}
			}
			app.endUndoGroup();
			
		}

	}
	//-----------------------------------------------------------
}

var copf = new changeOutputPathWithFolder();
copf.execute();
