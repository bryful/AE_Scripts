(function(me){
	//----------------------------------
	//prototype登録
	String.prototype.trim = function(){
		if (this=="" ) return ""
		else return this.replace(/[\r\n]+$|^\s+|\s+$/g, "");
	}
	//ファイル名のみ取り出す（拡張子付き）
	String.prototype.getName = function(){
		var r=this;var i=this.lastIndexOf("/");if(i>=0) r=this.substring(i+1);
		return r;
	}
	//拡張子のみを取り出す。
	String.prototype.getExt = function(){
		var r="";var i=this.lastIndexOf(".");if (i>=0) r=this.substring(i);
		return r;
	}
	//指定した書拡張子に変更（dotを必ず入れること）空文字を入れれば拡張子の消去。
	String.prototype.changeExt=function(s){
		var i=this.lastIndexOf(".");
		if(i>=0){return this.substring(0,i)+s;}else{return this + s; }
	}
	//文字の置換。（全ての一致した部分を置換）
	String.prototype.replaceAll=function(s,d){ return this.split(s).join(d);}

	FootageItem.prototype.nameTrue = function(){ var b=this.name;this.name=""; var ret=this.name;this.name=b;return ret;}
	
	//----------------------------------
	var scriptName = File.decode($.fileName.getName().changeExt(""));
	var prefFile = new File($.fileName.changeExt(".pref"));

	var targetComp = null;
	var frameCount = 0;
	var frameRate = 24;
	var pageFrame = 144;
	var cells = ["",""];
	var cellCaptions = ["Frame","A"];
	var captionWidth = [100,50];
	var selectedIndex = -1;
	//-------------------------------------------------------------------------
	var winObj = ( me instanceof Panel) ? me : new Window("palette", scriptName, [ 609,  381,  609+ 693,  381+ 348]  ,{resizeable:true});
	//-------------------------------------------------------------------------
	var btnGet = winObj.add("button", [   7,    3,    7+  88,    3+  23], "Remap獲得" );
	btnGet.graphics.font = ScriptUI.newFont("Tahoma",ScriptUI.FontStyle.REGULAR, 11);
	var remapList = winObj.add("listbox", [   1,   28,    1+ 688,   28+ 316], cells ,{numberOfColumns:2,showHeaders:true,columnTitles:cellCaptions,columnWidths:captionWidth});
	remapList.graphics.font = ScriptUI.newFont("Tahoma",ScriptUI.FontStyle.REGULAR, 14);

	//-------------------------------------------------------------------------
	function prefSave()
	{
		if ( (me instanceof Panel)==true) return;
		var o = new Object;
		var b = winObj.bounds;
		var bb = [];
		bb.push(b[0]);
		bb.push(b[1]);
		bb.push(b[2]);
		bb.push(b[3]);
		o.bounds = bb;
		
		var str = o.toSource();
		if (prefFile.open("w")){
			try{
				prefFile.write(str);
			}catch(e){
			}finally{
				prefFile.close();
			}
		}
	}
	winObj.onClose = prefSave;
	//-------------------------------------------------------------------------
	function prefLoad()
	{
		if ( (me instanceof Panel)==true) return;
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
		var o = eval(str);
		if ((o!=null)&&(o.bounds != undefined)){
			var b = o.bounds;
			var bb = winObj.bounds;
			bb[0] = b[0];
			bb[1] = b[1];
			bb[2] = b[2];
			bb[3] = b[3];
			if ( (bb[2]-bb[0] >=20)&&(bb[3]-bb[1] >=20))
				winObj.bounds = bb;
		}
	}
	prefLoad();	
	//-------------------------------------------------------------------------
	function timeJump()
	{
		if (targetComp == null) return;
		var idx = remapList.selection.index;
		if ( (idx!=null)&&(idx!=undefined)&&(idx>=0)){
			targetComp.time = idx /frameRate;
			targetComp.selected = false;
			targetComp.selected = true;
		}
	}
	remapList.onDoubleClick = timeJump;
	//-------------------------------------------------------------------------
	function selectedChk()
	{
		if (targetComp == null) {
			selectedIndex = -1;
			return;
		}
		var idx = remapList.selection.index;
		if ( (idx!=null)&&(idx!=undefined)&&(idx>=0)){
			selectedIndex = idx;
		}
	}
	remapList.onChange = selectedChk;
	//-------------------------------------------------------------------------
	function toFrame(d)
	{
		return Math.round(d * frameRate);
	}
	function sp3(p)
	{
		var ret = "";
		if ( p<=-2)		ret += "   ";
		else if ( p<=-1)ret += "  |";
		else if ( p<=0)	ret += "  X";
		else if (p<10)	ret += "  "+p;
		else if (p<100)	ret += " "+p;
		else 			ret += ""+p;
		return ret;
	}
	//-------------------------------------------------------------------------
	function frameStr(v)
	{
		function zero2(p)
		{
			var ret = "";
			if ( p<=0)		ret += "00";
			else if (p<10)	ret += "0"+p;
			else 			ret += ""+p;
			return ret;
		}
		function zero3(p)
		{
			var ret = "";
			if ( p<=0)		ret += "000";
			else if (p<10)	ret += "00"+p;
			else if (p<100)	ret += "0"+p;
			else 			ret += ""+p;
			return ret;
		}
		
		var ret = zero3(v+1);
		
		ret += "(" + zero2(Math.floor(v / pageFrame)+1) + "p" + zero3(Math.floor(v % pageFrame)+1) +")";
		
		return ret;
	}
	//-------------------------------------------------------------------------
	function dispList()
	{
		var b = remapList.bounds;
		winObj.remove(remapList);
		remapList = winObj.add("listbox", b, [] ,
			{	numberOfColumns: cells.length +1,
				showHeaders:true,
				columnTitles:cellCaptions,
				columnWidths:captionWidth
				});
		remapList.onDoubleClick = timeJump;
		remapList.onChange = selectedChk;


		if ( cells.length>0)
		{
			var fr2 = frameRate/2;
			for (var i= 0; i<frameCount; i++){
				var s = frameStr(i);
				var b =  ( ((i+1) % fr2)== 0);
				if ( b==true) s += "_______";
				var item1 = remapList.add ('item', s);
				for (var j= 0; j<cells.length; j++){
					var s =sp3(cells[j][i])
					if ( b==true) s += "_______";
					item1.subItems[j].text = s;
				}
			}
		}
		if ( selectedIndex>=0) remapList.items[selectedIndex].selected = true;
		
	}
	//-------------------------------------------------------------------------
	function getCellNumber(lyr)
	{
		var ret = [];
		for ( var i = 0; i<frameCount; i++) ret.push(-1);
		var remap = lyr.timeRemap;
		var rm = Math.round(lyr.source.duration * lyr.source.frameRate)+1;
		
		var cng = lyr.property("ADBE Effect Parade").property("セル番号");
		if ( cng!= null){
			var cn = cng.property("ADBE Slider Control-0001");
			if (cn.numKeys>0){
				for ( var i=1; i<= cn.numKeys; i++){
					var f = Math.round(cn.keyTime(i) * frameRate);
					var v = Math.round(cn.keyValue(i));
					ret[f] = v;
				}
			}
		
		}else{
			if (remap.numKeys>0){
				for ( var i=1; i<= remap.numKeys; i++){
					var f = Math.round(remap.keyTime(i) * frameRate);
					var v = Math.round(remap.keyValue(i) * frameRate)+1;
					if ( v>=rm) v = 0;
					ret[f] = v;
				}
				var opa = lyr.property("ADBE Transform Group").property("ADBE Opacity");
				if ( opa.numKeys>0){
					for ( var i=1; i<= opa.numKeys; i++){
						if ( opa.keyValue(i) <= 0){
							var f = Math.round(opa.keyTime(i) * frameRate);
							ret[f] = 0;
						}
					}
				}
				var blind = lyr.property("ADBE Effect Parade").property("ブラインド");
				if (blind != null){
					var bp = blind.property("ADBE Venetian Blinds-0001");
					if ( bp.numKeys>0){
						for ( var i=1; i<= bp.numKeys; i++){
							if ( bp.keyValue(i) >= 100){
								var f = Math.round(bp.keyTime(i) * frameRate);
								ret[f] = 0;
							}
						}
					}
				}
			}
		}
		if ( ret.length>0){
			if ( ret[0] == -1){
				for ( var i=0; i<ret.length; i++){
					if ( ret[i] <= -1){
						ret[i] = -2;
					}else{
						break;
					}
				}
			}
			var idx = -1;
			var v = -2;
			for ( var i=ret.length-1; i>0; i--){
				if ( ret[i] != -1){
					idx = i;
					v = ret[i];
					break;
				}
			}
			if ((idx>0)&&(idx<ret.length-1)){
				if ( v==0){
					for ( var i= idx+1; i<ret.length; i++){
						ret[i] = -2;
					}
				}
			}
		}
		return ret;
	}
	//-------------------------------------------------------------------------
	function getRemap()
	{
		var ac = app.project.activeItem;
		if ( (ac instanceof CompItem) == false){
			alert("コンポを選択してチョ！");
			return;
		}
		var lyrs = [];
		if ( ac.numLayers>0){
			for ( var i=ac.numLayers; i>=1; i--)
			{
				if ( ac.layer(i).timeRemapEnabled == true){
					if ( ac.layer(i).timeRemap.numKeys>0){
						lyrs.push(ac.layer(i));
					}
				}
			}
		}
		if ( lyrs.length>0){
			var idd = -1;
			if (targetComp != null) idd = targetComp.id;
			targetComp = ac;
			if (targetComp.id != idd)
				selectedIndex = -1;
			frameRate = ac.frameRate;
			frameCount = ac.duration * ac.frameRate;
			cells = [];
			cellCaptions = [];
			captionWidth = [];
			cellCaptions.push("Frame");
			captionWidth.push(100);
			
			for ( var i=0; i<lyrs.length; i++)
			{
				var ret = getCellNumber(lyrs[i]);
				cells.push(ret);
				cellCaptions.push(lyrs[i].name);
				captionWidth.push(50);
			}
			dispList();
		}
	}
	btnGet.onClick = getRemap;
	//-------------------------------------------------------------------------
	function resize()
	{
		var b = winObj.bounds;
		var w = b[2] - b[0];
		var h = b[3] - b[1];
				
		var b = remapList.bounds;
		b[0] = 4;
		b[2] = w-4;
		b[1] = 28;
		b[3] = h -4;
		remapList.bounds = b;
	}
	resize();
	winObj.addEventListener("resize",resize);
	winObj.onResize = resize;
	//-------------------------------------------------------------------------
	if ( ( me instanceof Panel) == false){
		winObj.center(); 
		winObj.show();
	}
	//-------------------------------------------------------------------------
})(this);