(function (me)
{
	///////////////////////////////////////////////////////////////////////////////////
	if ( app.preferences.getPrefAsLong("Main Pref Section", "Pref_SCRIPTING_FILE_NETWORK_SECURITY") != 1){
		var s = "すみません。以下の設定がオフになっています。\r\n\r\n";
		s +=  "「環境設定：一般設定：スクリプトによるファイルへの書き込みとネットワークへのアクセスを許可」\r\n";
		s += "\r\n";
		s += "このスクリプトを使う為にはオンにする必要が有ります。\r\n";
		alert(s);
		return;
	}
	function getFileNameWithoutExt(s)
	{
		var ret = s;
		var idx = ret.lastIndexOf(".");
		if ( idx>=0){
			ret = ret.substring(0,idx);
		}
		return ret;
	}
	function getScriptName()
	{
		var ary = $.fileName.split("/");
		return File.decode( getFileNameWithoutExt(ary[ary.length-1]));
	}
	function getScriptPath()
	{
		var s = $.fileName;
		return s.substring(0,s.lastIndexOf("/"));
	}
	///////////////////////////////////////////////////////////////////////////////////
	var scriptName = getScriptName();
	
	var targetComp = null;
	
	///////////////////////////////////////////////////////////////////////////////////
	function trim(s){
		if ( s == "" ) return "";
		return s.replace(/[\r\n]+$|^\s+|\s+$/g, "");
	}
	///////////////////////////////////////////////////////////////////////////////////
	var winObj = ( me instanceof Panel) ? me : new Window("palette", scriptName, [ 132,  174,  132+ 186,  174+ 102]);
	
	var btnCode = winObj.add("button", [  12,   12,   12+ 156,   12+  28], "Javascript作成");
	var btnToImg = winObj.add("button", [  12,   46,   12+ 156,   46+  28], "画像書き出しのComp作成");
	var cbIsPalette = winObj.add("checkbox", [  12,   80,   12+ 110,   80+  16], "パレット形式にする");
	
	cbIsPalette.value = true;
	///////////////////////////////////////////////////////////////////////////////////
	function showCodeDialog(s)
	{
		//ダイアログを作成して表示。
		//カット＆ペーストしやすいようにedittextに表示
		var winObj = new Window("dialog", scriptName, [0, 0, 1024, 400],{resizeable:true});
		var gb1 = winObj.add("panel", [12, 12, 12+1000, 12+350], "javascript code" );
		var tbProp = gb1.add("edittext", [10, 20, 10+980, 20+320], s,{multiline: true,readonly:true } );
		var btnOK = winObj.add("button", [850, 365, 850+98, 365+23], "OK", {name:'ok'});
		//フォントを大きく
		var fnt = tbProp.graphics.font;
		tbProp.graphics.font = ScriptUI.newFont (fnt.name, ScriptUI.FontStyle.BOLD, fnt.size * 1.2);
		//コントロールを配置する
		function sizeSet()
		{
			var btnW = 100;
			var btnH = 23;
			var b = winObj.bounds;
			
			var bb = new Array;
			bb[0] = 12;
			bb[1] = 12;
			bb[2] = bb[0] + (b[2]-b[0]) - (bb[0]*2);
			bb[3] = bb[1] + (b[3]-b[1]) - (bb[1]*2) - (btnH +4);
			
			gb1.bounds = bb;
			var bb2 = new Array;
			bb2[0] = 10;
			bb2[1] = 10;
			bb2[2] = bb2[0] + (bb[2]-bb[0]) - (bb2[0]*2);
			bb2[3] = bb2[1] + (bb[3]-bb[1]) - (bb2[1]*2);
			tbProp.bounds = bb2;
			
			var bb3 = new Array;
			bb3[0] = (b[2] -b[0]) - (btnW +24);
			bb3[1] = bb[3] + 4;
			bb3[2] = bb3[0] + btnW;
			bb3[3] = bb3[1] + btnH;
			btnOK.bounds = bb3;
		}
		sizeSet();
		winObj.onResize = sizeSet;
		
		winObj.center();
		winObj.show();
	}
	///////////////////////////////////////////////////////////////////////////////////
	//指定されたコンポがダイアログ設計用か判別。
	//レイヤ名の先頭が"@"で始まるかどうか
	function isTargetComp(cmp)
	{
		var ret = false;
		if ( ( cmp instanceof CompItem)==false) return ret;
		if ( cmp.numLayers <=0 ) return ret;
		
		for ( var i=1; i<= cmp.numLayers; i++){
			if ( cmp.layer(i) instanceof AVLayer){
				var n = trim(cmp.layer(i).name);
				if ( (n!="")&&(n[0]=="@") ){
					return true;
				}
			}
		}
		return ret;
	}
	///////////////////////////////////////////////////////////////////////////////////
	function cmpToBounds(cmp)
	{
		return "[ 100, 100, " + (cmp.width +100) + ", " + (cmp.height + 100) + " ]";
	}
	///////////////////////////////////////////////////////////////////////////////////
	function getLayerStatus(lyr)
	{
		var ret = new Object;
		if ((lyr instanceof AVLayer)==false) return null;
		var name = trim(lyr.name);
		if ( (name =="")||(name[0] !="@")) return null;
		var sa = name.split(",");
		if ( sa.length<3) return null;
		
		ret.source = lyr.source;
		ret.parentName = trim(sa[0].substring(1));
		var kind = trim(sa[1]).toLowerCase();
		if ( kind.indexOf("bu")==0) kind = "button";
		else if ( kind.indexOf("ch")==0) kind = "checkbox";
		else if ( kind.indexOf("dr")==0) kind = "dropdownlist";
		else if ( kind.indexOf("ed")==0) kind = "edittext";
		else if ( kind.indexOf("gr")==0) kind = "group";
		else if ( kind.indexOf("ic")==0) kind = "iconbutton";
		else if ( kind.indexOf("im")==0) kind = "image";
		else if ( kind.indexOf("li")==0) kind = "listbox";
		else if ( kind.indexOf("pa")==0) kind = "panel";
		else if ( kind.indexOf("pr")==0) kind = "progressbar";
		else if ( kind.indexOf("ra")==0) kind = "radiobutton";
		else if ( kind.indexOf("sc")==0) kind = "scrollbar";
		else if ( kind.indexOf("sl")==0) kind = "slider";
		else if ( kind.indexOf("st")==0) kind = "statictext";
		else return null;
		ret.kind = kind;
		
		ret.name = trim(sa[2]);
		if ( ret.name == "") return null;
		
		ret.text = new Array;
		if ( sa.length>=4){
			for ( var i= 3; i<sa.length; i++){
				ret.text.push(trim(sa[i]));
			}
		}
		///サイズの計算
		var w = lyr.width;
		var h = lyr.height;
		var scale = lyr.property("ADBE Transform Group").property("ADBE Scale").value;
		var pos = lyr.property("ADBE Transform Group").property("ADBE Position").value;
		var anc = lyr.property("ADBE Transform Group").property("ADBE Anchor Point").value;
		//右上の位置を求める
		ret.scale	= scale;
		ret.scaleX	= scale[0] /100;
		ret.scaleY	= scale[0] /100;
		ret.left	= Math.floor(pos[0] - (anc[0] * ret.scaleX));
		ret.top		= Math.floor(pos[1] - (anc[1] * ret.scaleY));
		ret.width	= Math.ceil(lyr.width * ret.scaleX);
		ret.height	= Math.ceil(lyr.height * ret.scaleY);
		
		
		ret.boundsStr = function()
		{
			return "[" + ret.left + ", " + ret.top + ", " + (ret.left+ret.width) + ", " + (ret.top + ret.height) +"]";
		}
		
		return ret;

	}
	///////////////////////////////////////////////////////////////////////////////////
	///////////////////////////////////////////////////////////////////////////////////
	function showCode()
	{
		var isPalette = cbIsPalette.value;
		var targetComp = app.project.activeItem;
		if ( isTargetComp(targetComp)==false){
			targetComp = null;
			alert("ダイアログ設計用のコンポを選択して下さい。");
			return;
		}
		var statusAry = new Array;
		for ( var i=targetComp.numLayers; i>=1; i--){
			var o = getLayerStatus(targetComp.layer(i));
			if ( o != null) statusAry.push(o);
		}
		if (statusAry.length<=0) {
			alert("対象レイヤがありません！");
			return;
		}
		var ret = "(function (me){\r\n";


		//配列、画像を別にしておく
		var parentList = new Array;
		for ( var i=0; i<statusAry.length; i++){
			if ( (statusAry[i].kind == "dropdownlist")||(statusAry[i].kind == "listbox") ){
				ret += "\tvar "+ statusAry[i].name + "Ary = [";
				var jc = statusAry[i].text.length;
				if ( jc>0){
					for ( var j=0; j<jc; j++){
						var ss = trim(statusAry[i].text[j]);
						if ( ss != "") {
							ret += "\"" + statusAry[i].text[j] + "\"";
							if ( j<jc-1) ret += ",";
						}
					} 
				}
				
				ret += "];\r\n";
			} else if ( (statusAry[i].kind == "image")||(statusAry[i].kind == "iconbutton") ){
				ret += "\tvar "+ statusAry[i].name + "File = new File(";
				var jc = statusAry[i].text.length;
				if (jc>0){
					ret += "\"" + statusAry[i].text[0] + "\"";
				}else{
					ret += "\"" + statusAry[i].name + ".png\"";
				}
				ret += ");\r\n";
			}
			if ( (statusAry[i].kind == "panel")||(statusAry[i].kind == "group") ){
				parentList.push(statusAry[i]);
			}
		}
		ret += "\r\n";

		if (isPalette == true){
			ret += "\tvar winObj = ( me instanceof Panel) ? me : new Window(\"palette\", \"" + targetComp.name + "\", " + cmpToBounds(targetComp) + " );\r\n";
			ret += "\r\n";
		}else{
			ret += "\tvar winObj = new Window(\"dialog\", \"" + targetComp.name + "\", " + cmpToBounds(targetComp) + " );\r\n";
			ret += "\r\n";
		}
		
		for ( var i=0; i<statusAry.length; i++){
			ret += "\tvar ";
			ret += statusAry[i].name +" = ";
			
			var par = null;
			if (parentList.length>0){
				if ( statusAry[i].parentName != ""){
					var idx = -1;
					for (var k =0; k<parentList.length; k++){
						if ( parentList[k].name == statusAry[i].parentName){
							idx = k;
							break;
						}
					}
					if ( k>=0){
						par = parentList[k];
					}
				}
			}
			
			
			if ( par == null){
				ret += "winObj.add(";
			} else {
				ret += statusAry[i].parentName + ".add(";
			}
			
			ret += "\"" + statusAry[i].kind +"\"";
			
			if ( par != null){
				statusAry[i].left = statusAry[i].left - par.left;
				statusAry[i].top = statusAry[i].top - par.top;
			}
			ret += ", " + statusAry[i].boundsStr();
			
			if ( statusAry[i].text.length>0) {
				if ( (statusAry[i].kind == "dropdownlist")||(statusAry[i].kind == "listbox") ){
					ret += ", " + statusAry[i].name + "Ary";
				}else if ( (statusAry[i].kind == "image")||(statusAry[i].kind == "iconbutton") ){
					ret += ", " + statusAry[i].name + "File";
				}else {
					ret += ", \"" + statusAry[i].text[0] + "\"";
				}
			}
			
			ret += ");\r\n";
		}
		
		ret += "\r\n";
		if (isPalette == true){
			ret += "\tif ( ( me instanceof Panel) == false){\r\n";
			ret += "\t\twinObj.center();\r\n";
			ret += "\t\twinObj.show();\r\n";
			ret += "\t}\r\n";
		}else{
			ret += "\twinObj.center();\r\n";
			ret += "\twinObj.show();\r\n";
		}
		ret += "})(this);\r\n";
		
		showCodeDialog(ret);
	}
	btnCode.onClick = showCode;
	///////////////////////////////////////////////////////////////////////////////////
	function makeComp()
	{
		var targetComp = app.project.activeItem;
		if ( isTargetComp(targetComp)==false){
			targetComp = null;
			alert("ダイアログ設計用のコンポを選択して下さい。");
			return;
		}
		var statusAry = new Array;
		for ( var i=targetComp.numLayers; i>=1; i--){
			var o = getLayerStatus(targetComp.layer(i));
			if ( o != null) statusAry.push(o);
		}
		if (statusAry.length<=0) {
			alert("対象レイヤがありません！");
			return;
		}
		var images = new Array;
		for ( var i=0; i<statusAry.length; i++){
			if ( (statusAry[i].kind == "image")||(statusAry[i].kind == "iconbutton") ){
				images.push(statusAry[i]);
			}
		}
		if ( images.length<=0) {
			alert("保存対象のオブジェクトがありません");
			return;
		}
		var fld = targetComp.parentFolder.items.addFolder(targetComp.name + "_pictures");
		for ( var i=0; i<images.length; i++){
			var n = "";
			if (images[i].text.length>0){
				n = getFileNameWithoutExt(images[i].text[0]);
			}else{
				n = images[i].name;
			}
			var ncmp = fld.items.addComp(
						//name,width,height,pixelAspect,duration,frameRate)p(
						n,
						images[i].width,
						images[i].height,
						1,
						1/24,
						24
						);
			ncmp.duration = 1/24;
			var nlyr = ncmp.layers.add(images[i].source);
			nlyr.property("ADBE Transform Group").property("ADBE Scale").setValue(images[i].scale);
		}
	}
	btnToImg.onClick = makeComp;
	///////////////////////////////////////////////////////////////////////////////////
	//---------------
	if ( ( me instanceof Panel) == false){
		winObj.center(); 
		winObj.show();
	}

})(this);
