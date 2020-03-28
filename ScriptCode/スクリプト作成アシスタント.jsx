
(function(me){
	//----------------------------------
	//prototype登録
	String.prototype.trim = function(){
		if (this=="" ) return ""
		else return this.replace(/[\r\n]+$|^\s+|\s+$/g, "");
	}
	String.prototype.getParent = function(){
		var r=this;var i=this.lastIndexOf("/");if(i>=0) r=this.substring(0,i);
		return r;
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
		if(i>=0){return this.substring(0,i)+s;}else{return this; }
	}
	//文字の置換。（全ての一致した部分を置換）
	String.prototype.replaceAll=function(s,d){ return this.split(s).join(d);}

	FootageItem.prototype.nameTrue = function(){ var b=this.name;this.name=""; var ret=this.name;this.name=b;return ret;}
	
	//----------------------------------
	var scriptName = File.decode($.fileName.getName().changeExt(""));

	//-------------------------------------------------------------------------
	var btnExec_str = "Exec";
	var btnClear_str = "Clear";
	var cbExecClear_str = "実行前にClear";
	var cmdList_items = [];
	var cmdList_funcs = [];
	var funcIndex = -1;
	var btnExec = null;
	var btnClear = null;
	var edConsole = null;
	var stInfo = null;
	var cmdList = null;
	var cbExecClear = null;
	var cbInfoLebel = null;
	
	//-------------------------------------------------------------------------
	function BR()
	{
		return  "\r\n";
	}
	//-------------------------------------------------------------------------
	function cClear()
	{
		if ( edConsole == null) return;
		if (edConsole.text == ""){
			alert("console empty");
		}else{
			edConsole.visible = false;
			edConsole.text = "";
			edConsole.visible = true;
		}
	}
	//-------------------------------------------------------------------------
	function cWrite(s)
	{
		if ( edConsole == null) return;
		edConsole.text = edConsole.text + s + BR();
	}
	//-------------------------------------------------------------------------
	function cWriteLn(s)
	{
		consoleWrite( s + BR());
	}
	//-------------------------------------------------------------------------
	function HR()
	{
		return  "-----------------------------------------------------";
	}
	//-------------------------------------------------------------------------
	function HR2()
	{
		return  "*****************************************************";
	}
	//-------------------------------------------------------------------------
	function HRLn()
	{
		return  HR() + BR();
	}
	//-------------------------------------------------------------------------
	function HR2Ln()
	{
		return  HR2() + BR();
	}
	//*************************************************************************
	function getProjectIndex(itm)
	{
		var ret = -1;
		if (itm == null) return ret;
		if ( app.project.numItems <=0) return ret;
		if ( (itm instanceof CompItem)||(itm instanceof FootageItemm)||( itm instanceof FolderItem)){
			for ( var i=1; i<=app.project.numItems; i++){
				if ( app.project.items[i].id == itm.id){
					ret = i;
					break;
				}
			}
		}
		return ret;
	}
	//*************************************************************************
	//プロパティのアクセス配列を得る
	function proPath(p)
	{
		var ret = [];
		if ( ( p== null)||(p==undefined)) return ret;
		if (  (p instanceof Property )||(p instanceof PropertyGroup )||(p instanceof MaskPropertyGroup )) {
			var pp = p;
			while ( pp != null){
				ret.push(pp);
				pp = pp.parentProperty;	//このメソッドがキモ
			}
			//配列をひっくり返す
			if ( ret.length>1) ret = ret.reverse();
		}
		//返されるObjectは、Layerからになる
		return ret;
	} 
	//*************************************************************************
	//Javascriptのコードに変換
	function proPathToString(ary,idx)
	{
		if ( !(ary instanceof Array) ) return "";
		if ( ary.length <=2) return "";
		
		var ret = "var p = ";
		ret += "app.project.item("+ idx + ")";		//CompItem

		for ( var i=0; i<ary.length; i++){
			if ( ( ary[i] instanceof AVLayer)||( ary[i] instanceof ShapeLayer)||(ary[i] instanceof TextLayer)){
				ret += ".layer(\"" + ary[i].name +"\")";
			}else if (( ary[i] instanceof PropertyGroup)||( ary[i] instanceof MaskPropertyGroup)){
				
				var canNameChange = ( (ary[i].propertyType == PropertyType.NAMED_GROUP)&&(ary[i].matchName !="ADBE Transform Group" ));
				
				if (canNameChange ==true){
					ret += ".property(\"" + ary[i].name +"\")";
				}else{
					ret += ".property(\"" + ary[i].matchName +"\")";
				}
				
			}else if ( ary[i] instanceof Property){
				ret += ".property(\"" + ary[i].matchName +"\")";
			}
		}
		ret +=";\n";
		return ret;
	}
	//*************************************************************************
	function getPT(p)
	{
		var ret = new Object;
		ret.isColor = false;
		ret.isValue = false;
		ret.typeName = "";
		
		if ( (p instanceof PropertyGroup)||(p instanceof PropertyBase)||(p instanceof MaskPropertyGroup)){
			switch( p.propertyType)
			{
				case PropertyType.INDEXED_GROUP : ret.typeName = "PropertyType.INDEXED_GROUP";break;
				case PropertyType.NAMED_GROUP : ret.typeName = "PropertyType.NAMED_GROUP";break;
				case PropertyType.PROPERTY : ret.typeName = "PropertyType.PROPERTY";break;
				default : ret.typeName = "PropertyType.UNKNOWN";break;
			}
		}else if ( p instanceof Property){
			ret.isValue = true;
			switch( p.propertyValueType)
			{
				case PropertyValueType.NO_VALUE :ret.typeName = "PropertyValueType.NO_VALUE"; ret.isValue = fasle;break;
				case PropertyValueType.ThreeD_SPATIAL :	ret.typeName = "PropertyValueType.ThreeD_SPATIAL";break;
				case PropertyValueType.ThreeD :			ret.typeName = "PropertyValueType.ThreeD";break;
				case PropertyValueType.TwoD_SPATIAL :	ret.typeName = "PropertyValueType.TwoD_SPATIAL";break;
				case PropertyValueType.TwoD :			ret.typeName = "PropertyValueType.TwoD";break;
				case PropertyValueType.OneD :			ret.typeName = "PropertyValueType.OneD";break;
				case PropertyValueType.COLOR :			ret.typeName = "PropertyValueType.COLOR";  ret.isColor = true;break;
				case PropertyValueType.CUSTOM_VALUE :	ret.typeName = "PropertyValueType.CUSTOM_VALUE"; ret.isValue = false; break;
				case PropertyValueType.MARKER :			ret.typeName = "PropertyValueType.MARKER";break;
				case PropertyValueType.LAYER_INDEX :	ret.typeName = "PropertyValueType.LAYER_INDEX";break;
				case PropertyValueType.MASK_INDEX :		ret.typeName = "PropertyValueType.MASK_INDEX";break;
				case PropertyValueType.SHAPE :			ret.typeName = "PropertyValueType.SHAPE"; ret.isValue = false;break;
				case PropertyValueType.TEXT_DOCUMENT :	ret.typeName = "PropertyValueType.TEXT_DOCUMENT";break;
				default: ret.typeName = "PropertyValueType UNKNOWN"; ret.isValue = false;break;
			}
		}
		return ret;
	}
	//*************************************************************************
	//変数をスクリプト用の文字列に変換
	function valueTo(p,isColor)
	{
		if ((p==null)||(p==undefined)) return "/*不正なプロパティ\*/";
		if ( p instanceof Array)
		{
			//配列
			var ret = "[";
			if (p.length>0){
				for ( var i=0; i<p.length; i++){
					if (isColor) {
						var v = p[i];
						var vs = Math.round(v * 255);
						ret +=  vs +"/255";
					}else{
						ret += p[i];
					}
					if (i<p.length-1){
						ret += ",";
					}
				}
			}
			ret += "]";
			return ret;
		}else if (typeof(p)=="string"){
			//文字列
			return "\"" + p + "\"";
		}else{
			//その他
			return p +"";
		}
	}
	//*************************************************************************
	function getTypeName(p)
	{
		var ret = "";
		if ( p instanceof AVLayer){
			ret += "AVLayer";
		}else if (p instanceof PropertyGroup){
			ret += "PropertyGroup";
		}else if (p instanceof PropertyBase){
			ret += "PropertyBase";
		}else if (p instanceof MaskPropertyGroup){
			ret += "MaskPropertyGroup";
		}else if (p instanceof Property){
			ret += "Property";
		}else{
			ret += "Unknown";
		}
		return ret;
	}
	//*************************************************************************
	var proInfo_lebel = false;
	function proInfo(p,tb,pd)
	{
		var ret = "";
		var t = tb;
		if ( (p== null)||(p ==undefined)) return "";
		ret += t + "type:" + getTypeName(p) +BR();

		ret += t + "name = \"" + p.name +"\"" +BR();
		ret += t + "matchName = \"" + p.matchName +"\"" + BR();
		var typ = getPT(p);
		ret += t + "PropertyType= \""+ typ.typeName +"\"\r\n";
		if (typ.isValue) {
			ret += t+ "value = " + valueTo(p.value,typ.isColor)+BR();
		}
		if ( p.label != undefined) ret += t + "label = " +p.label + BR();
		if ( p.numKeys != undefined)  ret += t + "numKeys = " + p.numKeys +BR();
		if ( p.active != undefined) ret += t + "active = " +p.active + BR();
		if ( p.canSetEnabled != undefined)  ret +=t +  "canSetEnabled = " +p.canSetEnabled + BR();
		if ( p.enabled != undefined)  ret += t + "enabled = " +p.enabled + BR();
		if ( p.propertyIndex != undefined)ret += t + "PropertyIndex = "+ p.propertyIndex + BR();
		if ( p.propertyDepth != undefined)ret += t + "PropertyDeps = "+ p.propertyDepth  +BR();
		
		if ( proInfo_lebel==true)  {
			if ( p.isEffect != undefined)  ret += t + "isEffect = " +p.isEffect + BR();
			if ( p.isMask != undefined)  ret += t + "isMask = " +p.isMask + BR();
			if ( p.elided != undefined)  ret +=t +  "elided = " +p.elided + BR();
			if ( p.isModified != undefined)  ret += t + "isModified = " +p.isModified + BR();
			if ( p.isMask != undefined)  ret += t + "isMask = " +p.isMask + BR();
			if ( p.canVaryOverTime != undefined) ret += t + "canVaryOverTime = " +p.canVaryOverTime +BR();
			if ( p.isSpatial != undefined) ret += t + "isSpatial = " + p.isSpatial +BR();
			if ( p.isTimeVarying != undefined) ret += t + "isTimeVarying = " + p.isTimeVarying +BR();
			
			if (p.hasMin != undefined)
				if ( p.hasMin == true)
					if ( p.minValue != undefined)
						ret += t + "minValue = " + p.minValue +BR();
			if (p.hasMax != undefined)
				if ( p.hasMax == true)
					if ( p.maxValue != undefined)
						ret += t + "maxValue = " + p.maxValue +BR();
			
			if ( p.unitsText != undefined)  ret += t + "unitsText = \"" + p.unitsText +"\"" +BR();
			if ( p.canSetExpression != undefined) ret += t + "canSetExpression = " +p.canSetExpression +BR();
			if ( p.expressionEnabled != undefined)  ret += t + "expressionEnabled = " +p.expressionEnabled +BR();
			if ( p.expressionError != undefined)  ret += t + "expressionError = \"" +p.expressionError +"\""+ BR();
	
			if ( p.expression != undefined)  {
				if (p.expression !="") {
					ret += "---- expression start -----------" +BR();
					ret += p.expression + BR();
					ret += "---- expression end ------------" +BR();
				}
			}
		}

		if ( pd == undefined) pd = false;
		if ( p.numProperties != undefined)  {
			ret += t + "numProperties = " +p.numProperties + BR();
			if (p.numProperties>0){
				for ( var d = 1; d<=p.numProperties; d++){
					var pp = p.property(d);
					if ( pd == true) {
					ret += t +"-- property("+ d +") --" +BR();
						ret += proInfo(pp, t +"\t",false);
					}else{
						ret += t +"  property(" + d + ")  " + pp.name +"("+ pp.matchName +") index=" + pp.propertyIndex +  BR();
					}
				}
			}
		}
		ret +=  BR();
		return ret;
	}
	
	//*************************************************************************
	function listupProperty(ary)
	{
		var ret = [];
		if (ary.length<=0) return ret;
		for ( var i=0; i<ary.length; i++){
			if ( ary[i] instanceof Property){
				ret.push(ary[i]);
			}
		}
		return ret;
	}
	//*************************************************************************
	function listupPropertyGroup(ary)
	{
		var ret = [];
		if (ary.length<=0) return ret;
		for ( var i=0; i<ary.length; i++){
			var pg = ary[i];
			if ( pg instanceof Property) pg = pg.parentProperty;
			if ( pg instanceof PropertyGroup){
				var b = true;
				if ( ret.length>0){
					for ( var k=0; k<ret.length; k++){
						if ( ret[k].id == pg.id) {
							b = false;
							break;
						}
					}
				}
				if ( b==true) ret.push(pg);
			}
		}
		return ret;
	}
	//*************************************************************************
	function getPropertyPath()
	{
		//作成したコードを収納する
		var codeList = "";
		//ターゲットのコンポのインデックス
		var compIndex = -1;
		var layerIndex = -1;
	//アクティブなアイテムを得る
		var ac = app.project.activeItem;
		if ( ac instanceof CompItem)
		{
			compIndex = getProjectIndex(ac);
			var prA = listupProperty(ac.selectedProperties);
			var cnt = prA.length
			if ( cnt>0){
				for (var i = 0; i < cnt; i++)
				{
 					var a = proPath(prA[i]);
					if ( a.length>0){
						codeList += HR() +"\r\n";
						codeList += proPathToString(a,compIndex) +"\n";
					}
				}
			}
		}
		if ( codeList == ""){
			alert("レイヤーのプロパティを何か選択してくださいまし。");
		}else{
			cWrite(codeList);
		}
	}
	//*************************************************************************
	function getPropertyInfo()
	{
		//作成したコードを収納する
		var codeList = "";
	
		//アクティブなアイテムを得る
		var ac = app.project.activeItem;
		if ( ac instanceof CompItem)
		{
			var prA = listupProperty(ac.selectedProperties);
			var cnt = prA.length
			if ( cnt>0){
				for ( var i=0; i<cnt; i++){
					codeList += HR2Ln();
					codeList += proInfo(prA[i],"");
				}
			}
		}
		if ( codeList == ""){
			alert("レイヤーのプロパティを何か選択してくださいまし。");
		}else{
			cWrite(codeList);
		}
	
	}
	//*************************************************************************
	function getPropertyInfoAll()
	{
		//作成したコードを収納する
		var codeList = "";
		var compIndex = -1;
	
		//アクティブなアイテムを得る
		var ac = app.project.activeItem;
		if ( ac instanceof CompItem)
		{
			compIndex = getProjectIndex(ac);
			var prA = listupProperty(ac.selectedProperties);
			var cnt = prA.length
			if ( cnt>0){
				for ( var i=0; i<cnt; i++){
					codeList += HR2Ln();
 					var a = proPath(prA[i]);
					if ( a.length>0){
						for ( var k=a.length-1; k>=0; k--){
							codeList += HR() +BR();
							codeList += "depth:" + (k+1) +"番目のProperty"+BR();
							codeList += proInfo(a[k],"");
						}
					}
				}
			}
		}
		if ( codeList == ""){
			alert("レイヤーのプロパティを何か選択してくださいまし。");
		}else{
			cWrite(codeList);
		}
	
	}
	//*************************************************************************
	function getPropertyGroup()
	{
		var codeList = "";
		var ac = app.project.activeItem;
		if ( ac instanceof CompItem)
		{
			var pg = listupPropertyGroup( ac.selectedProperties);
			if (pg.length>0){
				for ( var i=0; i<pg.length; i++){
					codeList += HR2Ln();
					codeList += proInfo(pg[i],"",false);
				}
			}
		}
		if ( codeList == ""){
			alert("レイヤーのプロパティを何か選択してくださいまし。");
		}else{
			cWrite(codeList);
		}
	}
	//*************************************************************************
	function getPropertyGroupALL()
	{
		var codeList = "";
		var ac = app.project.activeItem;
		if ( ac instanceof CompItem)
		{
			var pg = listupPropertyGroup( ac.selectedProperties);
			if (pg.length>0){
				for ( var i=0; i<pg.length; i++){
					codeList += HR2Ln();
					codeList += proInfo(pg[i],"",true);
				}
			}
		}
		if ( codeList == ""){
			alert("レイヤーのプロパティを何か選択してくださいまし。");
		}else{
			cWrite(codeList);
		}
	}
	//*************************************************************************
	//-------------------------------------------------
	function getItemP(tItem,tb)
	{
		var t = tb;
		var ret = "";
		if ( (tItem==null)||(tItem==undefined)) return ret;
		
		if ( tItem.name != undefined) {
			ret += t + "[" + tItem.name +"]";
			if ( tItem.matchName != undefined) ret += "("+ tItem.matchName + ")";
			ret += BR();
		}
		var lst = [];
		
		for ( var s in tItem){
			lst.push(s);
		}
		if (lst.length>0){
			for ( var i=0; i<lst.length; i++)
			{
				if (( lst[i] != "")&&(lst[i] !="=="))
					ret += t + lst[i] +BR();
			}
		}
		return ret;
	}
	//*************************************************************************
	function getItemPList()
	{
		var codeList = "";
		var itms = app.project.selection;
		if ( itms.length>0){
			
			for ( var i=0; i<itms.length; i++){
				codeList += "--------------------------" +BR();
				codeList +=getItemP( itms[i],"  ");
			}
		}
		if ( codeList == ""){
			alert("プロジェクトの何か選択してくださいまし。");
		}else{
			cWrite(codeList);
		}
	}
	//*************************************************************************
	function getLayerPList()
	{
		var codeList = "";
		var ac = app.project.activeItem;
		if ( ac instanceof CompItem){
			var lyrs = ac.selectedLayers;
			if ( lyrs.length>0){
				
				for ( var i=0; i<lyrs.length; i++){
					codeList += "--------------------------" +BR();
					codeList +=getItemP( lyrs[i],"  ");
				}
			}
		}
		if ( codeList == ""){
			alert("レイヤーを選択してくださいまし。");
		}else{
			cWrite(codeList);
		}
	}
	//*************************************************************************
	function getPropertyPList()
	{
		var codeList = "";
		var ac = app.project.activeItem;
		if ( ac instanceof CompItem){
			var ps = ac.selectedProperties;
			if ( ps.length>0){
				
				for ( var i=0; i<ps.length; i++){
					codeList += "--------------------------" +BR();
					codeList +=getItemP( ps[i],"  ");
				}
			}
		}
		if ( codeList == ""){
			alert("プロパティを選択してくださいまし。");
		}else{
			cWrite(codeList);
		}
	}
	//*************************************************************************
	function getApplicationPList()
	{
		var codeList = "";
		
		codeList += "************************" +BR();
		codeList += "Application" +BR();
		codeList += getItemP(app," ");
		codeList += BR();
		
		cWrite(codeList);
	}
	//*************************************************************************
	function getProjectPList()
	{
		var codeList = "";
		

		codeList += "************************" +BR();
		codeList += "Project" +BR();
		codeList += getItemP(app.project," ");
		codeList += BR();		

		cWrite(codeList);
	}
	//*************************************************************************
	function getSystemPList()
	{
		var codeList = "";
		
		codeList += "************************" +BR();
		codeList += "System" +BR();
		codeList += getItemP(system," ");
		codeList += BR();

		cWrite(codeList);
	}
	//*************************************************************************
	function getDollorPList()
	{
		var codeList = "";
		
		codeList += "************************" +BR();
		codeList += "Dollor" +BR();
		codeList += getItemP($," ");
		codeList += BR();
		
		cWrite(codeList);
	}
	//*************************************************************************
	function getAfterEffectsPList()
	{
		var codeList = "";
		
		
		codeList += "************************" +BR();
		codeList += "aftereffects" +BR();
		codeList += getItemP(aftereffects," ");
		codeList += BR();

		cWrite(codeList);
	}
	//*************************************************************************
	function getGlobalPList()
	{
		var codeList = "";
		
		codeList += "************************" +BR();
		codeList += "global" +BR();
		codeList += getItemP($.global," ");
		codeList += BR();
		cWrite(codeList);
	}
	//*************************************************************************
	function getWindowsPList()
	{
		var codeList = "";
		
		var win = new Window("palette", "TEST", [ 0, 0,  100,  100]  ,{resizeable:true, maximizeButton:true, minimizeButton:true});
		var btn = win.add("button", [  0,  0,   40,  20], "a");
		var tb = win.add("edittext", [  0,  0,   40,  20]);
		codeList += "************************" +BR();
		codeList += "Window Object" +BR();
		codeList += getItemP(win," ");
		codeList += BR();
		codeList += "************************" +BR();
		codeList += "Graphics Object" +BR();
		codeList += getItemP(win.graphics," ");
		codeList += BR();
		codeList += "************************" +BR();
		codeList += "Font Object" +BR();
		codeList += getItemP(win.graphics.font," ");
		codeList += BR();
		codeList += "************************" +BR();
		codeList += "Bounds Object" +BR();
		codeList += getItemP(win.bounds," ");
		codeList += BR();
		codeList += "************************" +BR();
		codeList += "Button Control" +BR();
		codeList += getItemP(btn," ");
		codeList += BR();
		codeList += "************************" +BR();
		codeList += "Edittext Control" +BR();
		codeList += getItemP(tb," ");
		codeList += BR();
		cWrite(codeList);
	}
	//*************************************************************************
	function getExpressionCmd(p)
	{
		var ret = "";
		if ( !(p instanceof Property)) return ret;
		ret = p.name;
		
		if ( p.canSetExpression == true){
			var bk = "";
			var ee = p.expressionEnabled ;
			if (p.expression != "") {
				bk = p.expression;
				p.expression = "";
			}
			p.selected = true;
			app.executeCommand(2702);
			ret += BR() +p.expression +BR();
			p.selected = true;
			app.executeCommand(2702);
			if( bk !=""){
				p.expression = bk;
				p.expressionEnabled = ee;
			}
			p.selected = false;

		}else{
			ret = " expressionなし";
		}
		return ret;
	}
	//*************************************************************************
	function getPropertyExpression()
	{
		var codeList = "";
		var ac = app.project.activeItem;
		if ( ac instanceof CompItem){
			var lyrs = [];
			if ( ac.selectedLayers.length>0)
				for ( var i=0; i<ac.selectedLayers.length; i++) lyrs.push(ac.selectedLayers[i]);
			if ( lyrs.length>0){
				for ( var l =0; l<lyrs.length;l++){
					var lyr = lyrs[l];
					var ps = [];
					if  (lyr.selectedProperties.length>0)
						for ( var i=0; i<lyr.selectedProperties.length; i++)
							if ( lyr.selectedProperties[i] instanceof Property)
								ps.push(lyr.selectedProperties[i]);
					if ( ps.length>0){
						for ( var i=0; i<ps.length; i++) ps[i].selected = false;
						for ( var i=0; i<ps.length; i++){
							codeList += "--------------------------" +BR();
							var s = getExpressionCmd(ps[i]);
							codeList +=s;
						}
						for ( var i=0; i<ps.length; i++) ps[i].selected = true;
					}
				}
			}
		}
		if ( codeList == ""){
			alert("プロパティを選択してくださいまし。");
		}else{
			cWrite(codeList);
		}
	}
	//*************************************************************************
	//-------------------------------------------------------------------------
	function addFunc(cap,func)
	{
		cmdList_items.push(cap);
		cmdList_funcs.push(func);
	}
	//-------------------------------------------------------------------------
	addFunc("プロパティのアクセスコード",getPropertyPath);
	addFunc("プロパティの情報",getPropertyInfo);
	addFunc("プロパティの情報(親プロパティも表示)",getPropertyInfoAll);
	addFunc("プロパティグループの情報",getPropertyGroup);
	addFunc("プロパティグループの情報(子プロパティすべて）",getPropertyGroupALL);
	addFunc("オリジナルエクスプレッション",getPropertyExpression);
	addFunc("プロパティリスト(プロジェクトアイテム)",getItemPList);
	addFunc("プロパティリスト(レイヤー)",getLayerPList);
	addFunc("プロパティリスト(プロパティ)",getPropertyPList);
	addFunc("プロパティリスト(Application)",getApplicationPList);
	addFunc("プロパティリスト(Project)",getProjectPList);
	addFunc("プロパティリスト(System)",getSystemPList);
	addFunc("プロパティリスト(Doller)",getDollorPList);
	addFunc("プロパティリスト(aftereffects)",getAfterEffectsPList);
	addFunc("プロパティリスト(グローバル)",getGlobalPList);
	addFunc("プロパティリスト(Windows Object)",getWindowsPList);
	//-------------------------------------------------------------------------
	//-------------------------------------------------------------------------
	//-------------------------------------------------------------------------
	var winObj = ( me instanceof Panel) ? me : new Window("palette", scriptName, [ 0, 0,  800,  400]  ,{resizeable:true, maximizeButton:true, minimizeButton:true});
	//-------------------------------------------------------------------------
	btnExec = winObj.add("button", [  10,   10,   10+ 280,   10+  26], btnExec_str );
	btnExec.graphics.font = ScriptUI.newFont("Tahoma",ScriptUI.FontStyle.REGULAR, 11);
	btnExec.enabled = false;
	cmdList = winObj.add("listbox", [  10,   40,   10+ 280,   40+  140], cmdList_items );
	cmdList.graphics.font = ScriptUI.newFont("Tahoma",ScriptUI.FontStyle.REGULAR, 11);
	btnClear = winObj.add("button", [  10,  180,   10+ 40,  180+  20], btnClear_str);
	cbExecClear = winObj.add("checkbox", [  60,  180,   60+ 120,  180+  20], cbExecClear_str);
	cbExecClear.value = true;
	cbInfoLebel = winObj.add("checkbox", [  180,  180,   180+ 120,  180+  20], "情報をすべて表示");
	edConsole = winObj.add("edittext", [  10,  200,   10+ 280,  200+ 190], "", { readonly:true, multiline:true, scrollable:true  });
	edConsole.graphics.font = ScriptUI.newFont("Tahoma",ScriptUI.FontStyle.REGULAR, 15);	
	/*
	btnExec.visible = true;
	cmdList.visible = true;
	btnClear.visible = true;
	cbExecClear.visible = true;
	cbInfoLebel.visible = true;
	*/
	
	//-------------------------------------------------------------------------
	btnClear.onClick = cClear;
	//winObj.onDraw = function(){edConsole.visible  = true; }
	//-------------------------------------------------------------------------
	function resizeWin()
	{
		edConsole.visible = false;
		var b = winObj.bounds;
		var w = b[2] - b[0];
		var h = b[3] - b[1];
		var eb = btnExec.bounds;
		eb[0] = 10;
		eb[2] = eb[0] + w - 15;
		btnExec.bounds = eb;
		var lb = cmdList.bounds;
		lb[0] = 10;
		lb[2] = w - 10;
		lb[2] = lb[0] + w - 15;
		cmdList.bounds = lb;
		var cb = edConsole.bounds;
		cb[0] = 10;
		cb[2] = cb[0] + w - 15;
		cb[3] = cb[0] + h - 15;
		edConsole.bounds = cb;
		edConsole.visible = true;
	}
	resizeWin();
	winObj.onResize = resizeWin;
	//-------------------------------------------------------------------------
	function execFunc()
	{
		proInfo_lebel = cbInfoLebel.value;
		edConsole.visible = false;
		if (cbExecClear.value == true){
			edConsole.text = "";
		}
		
		if ( cmdList.selection == null) {
			funcIndex =-1;
			writeLn("None func");
			edConsole.visible = true;
			return;
		}
		funcIndex = cmdList.selection.index;
		if ( (funcIndex>=0)&&(funcIndex<cmdList_funcs.length)){
			writeLn(cmdList_items[funcIndex]);
			var f = cmdList_funcs[funcIndex];
			f();
		}
		edConsole.visible = true;
	}
	cmdList.onDoubleClick = execFunc;
	btnExec.onClick = execFunc;
	//-------------------------------------------------------------------------
	cmdList.onChange = function(){
		var idx = cmdList.selection.index;
		if ( (idx>=0)&&(idx<cmdList_funcs.length)){
			funcIndex = idx;
			btnExec.text = cmdList_items[funcIndex];
			btnExec.enabled = true;
		}else{
			funcIndex = -1;
			btnExec.text = "None";
			btnExec.enabled = false;
		}
	}
		//-------------------------------------------------------------------------
	if ( ( me instanceof Panel) == false){
		winObj.center(); 
		winObj.show();
	}
	//-------------------------------------------------------------------------
})(this);