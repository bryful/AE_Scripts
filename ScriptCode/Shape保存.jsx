
(function(me){
	//UIの配列
	var cntrlTbl = [];

	#include "json2.jsxinc"
	#include "bryScriptLib.jsxinc"

	var isModifiedMode = false;

	//----------------------------------
	var scriptName = File.decode($.fileName.getName().changeExt(""));
	var aeclipPath = File.decode($.fileName.getParent()+"/aeclip.exe");
	//-------------------------------------------------------------------------
	// ********************************************************************************
	// Propertyのvalueを読み出す
	// ********************************************************************************
	var setValue = function(obj,p)
	{
		var ret = null;
		
		if (obj.isModified == false) return ret;
		
		switch(obj.propertyValueType){
			case  PropertyValueType.NO_VALUE:
				break;
			case  PropertyValueType.ThreeD_SPATIAL:
			case PropertyValueType.ThreeD:
			case PropertyValueType.TwoD_SPATIAL:
			case PropertyValueType.TwoD:
			case PropertyValueType.OneD:
			case PropertyValueType.COLOR:
				p.setValue(obj.value);
				break;
			case PropertyValueType.SHAPE:

				if (obj.value.vertices.length>0) {
					var myShape  = new Shape();
					myShape.vertices = obj.value.vertices;
					myShape.inTangents = obj.value.inTangents;
					myShape.outTangents = obj.value.outTangents;
					myShape.closed = obj.value.closed;
					p.setValue(myShape);
				}
				break;
			//case PropertyValueType.CUSTOM_VALUE:	
			//case PropertyValueType.MARKER:
			//case PropertyValueType.LAYER_INDEX:
			//case PropertyValueType.MASK_INDEX:
			//case PropertyValueType.TEXT_DOCUMENT:
		}
		return ret;
	}
	// ********************************************************************************
	var setValues = function(obj,p)
	{
		var ret = null;
		
		if (obj.isModified == false) return ret;
		
		switch(obj.propertyValueType){
			case  PropertyValueType.NO_VALUE:
				break;
			case  PropertyValueType.ThreeD_SPATIAL:
			case PropertyValueType.ThreeD:
			case PropertyValueType.TwoD_SPATIAL:
			case PropertyValueType.TwoD:
			case PropertyValueType.OneD:
			case PropertyValueType.COLOR:
				p.setValuesAtTimes(obj.times,obj.values);
				break;
			case PropertyValueType.SHAPE:
				var vv = [];
				for ( var i =0; i<obj.values.length;i++){
						var myShape  = new Shape();
					if (obj.values[i].vertices.length>0) {
						myShape.vertices = obj.values[i].vertices;
						myShape.inTangents = obj.values[i].inTangents;
						myShape.outTangents = obj.values[i].outTangents;
						myShape.closed = obj.values[i].closed;
					}
						vv.push(myShape);
				}
				p.setValuesAtTimes(obj.times,vv);
				break;
			//case PropertyValueType.CUSTOM_VALUE:	
			//case PropertyValueType.MARKER:
			//case PropertyValueType.LAYER_INDEX:
			//case PropertyValueType.MASK_INDEX:
			//case PropertyValueType.TEXT_DOCUMENT:
		}
		return ret;
	}
	// ********************************************************************************
	// ********************************************************************************
	var setObjectValue= function(obj,p)
	{
		var ret = false;
		if (p.matchName != obj.matchName) return false;
		if (obj.isModified != true) return true;
		if (p.name != obj.name) p.name = obj.name;
		if (p.active != obj.active) p.active = obj.active;
		if (p.enabled != obj.enabled) p.enabled = obj.enabled;
		
		if ("value" in obj) {
			ret = setValue(obj,p);
		}else if (("times" in obj)&&("values" in obj)) {
			ret = setValues(obj,p);

		}else if ("items" in obj) {
			if (obj.items.length>0){
				for ( var i=0; i<obj.items.length; i++){
					if (obj.items[i].isModified==true){
						setObjectValue(obj.items[i],p.property(obj.items[i].propertyIndex));
					}
				}
			}
		}
		return ret;
	}
	// ********************************************************************************
	// 新規に作成
	// ********************************************************************************
	var createObject= function(obj,pg)
	{
		var ret = false;
		
		if (obj.matchName == "ADBE Vector Group"){
			createGroup(obj,pg);
		}else{
			if (pg.canAddProperty(obj.matchName)==true){
				var p = pg.addProperty(obj.matchName);
				if (p!=null) {
					ret = setObjectValue(obj,p);
				}
			}
		}
		return ret;
	}
	// ********************************************************************************
	// ********************************************************************************
	var setContent= function(obj,pg)
	{
		var ret = false;
		if (obj.length>0){
			for ( var i=0; i<obj.length; i++)
			{
				createObject(obj[i],pg);
			}
			ret = true;
		}
		return ret;
	}

	// ********************************************************************************
	// ********************************************************************************
	var createGroup = function(obj,pg)
	{
		var ret = false;
		if (pg.canAddProperty(obj.matchName)==true){
			var p = pg.addProperty(obj.matchName);
			if (p.name != obj.name) p.name = obj.name;
			if (p.active != obj.active) p.active = obj.active;
			if (p.enabled != obj.enabled) p.enabled = obj.enabled;
			
			if ("blendMode" in obj){
				setObjectValue(obj.blendMode,p.property(1));
			}
			if ("transform" in obj){
				setObjectValue(obj.transform,p.property(3));
			}
			
			if("content" in obj) {
				setContent(obj.content.items, p.property(2));
			}
			
		}
		return ret;
		
	}
	// ********************************************************************************
	// Shapeをインポート
	//
	// ********************************************************************************
	
	var setObjectStart= function(obj,pg)
	{
		var ret = false;
		switch (obj.matchName){
			case "ADBE Root Vectors Group": //ルートコンテンツ
				v = setContent(obj.content,pg);
				break;
			case "ADBE Vector Group": //グループ
				v = createGroup(obj,pg);
				break;
			default://各要素
				break;
			
		}

		return ret;	
	}
	// ********************************************************************************
	// Shapeをインポート
	//
	// ********************************************************************************
	var importShape = function()
	{
		var ac = getActiveComp();
		if (ac==null) return ;
		var pg = getPropertyGroup(ac);
		if (pg==null) return;
		
		//alert(pg.getTreeM().toString());
		//return;
		
		
		var fPath = File.openDialog("Import Shape","*.json");
		if(fPath ==null){
			return;
		}
		var f = new File(fPath);
		if (f.exists==false) return;
		var str = ""
		try{
			f.encoding = "utf-8";
			if (f.open("r")){
				str= f.read();
			}
		}catch(e){
			alert("read errer!\r\n" + e.toString());
			return;
		}finally{
			f.close();
		}
		var obj = JSON.parse(str);
		
		ahead = ""; //AEShapeIO
		if ("ahead" in obj) { ahead = obj.ahead;}
		
		if (ahead != "AEShapeIO"){
			alert("Headerが違う");
			return;
		}
		var sp = null;
		if ("shape" in obj) { sp = obj.shape;}
		var ret = false;
		if (sp!=null) {
			var ret = setObjectStart(sp,pg);
		}else{
			alert("データが不正");
			return;
		}
	}
	 // ☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆
	 // ☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆
	 // ☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆
	var toClipbord = function(str)
	{
		var ob = Folder.temp.fullName;
		var pa =  ob + "/tmp.txt";
		var ff = new File(pa);
		ff.encoding = "utf-8";
		if (ff.open("w")){
			try{
				ff.write(str);
			}finally{
				ff.close();
			}
		}
		var fclip = new File(aeclipPath);
		var cmd =  "\"" + fclip.fsName +"\"" + " /c \"" + ff.fsName + "\"";
		if (ff.exists==true){
			try{
				var er = system.callSystem(cmd);
			}catch(e){
				alert("toClipbord: " + e.toString());
			}
		}
	}
	// ********************************************************************************
	//AEのプロパティ情報の最低量を読み込む
	// ********************************************************************************
	var getObjectSub = function(p)
	{
		var ret = {};
		ret.name 					= p.name;
		ret.matchName 				= p.matchName;
		ret.propertyType 			= p.propertyType;
		ret.propertyIndex 			= p.propertyIndex ;
		if ("propertyValueType" in p) 	ret.propertyValueType = p.propertyValueType;
		if ("isModified" in p) 		ret.isModified = p.isModified;
		if ("active" in p)			ret.active= p.active;
		if ("canSetEnabled" in p) 	ret.enabled = p.enabled;
		if ("numProperties" in p) 	ret.numProperties  = p.numProperties ;
		ret.isPropertyGroup			= (p instanceof PropertyGroup);
		return ret;
	}
	// **********************
	function ShapeTo(sp)
	{
		ret = {};
		ret.closed = sp.closed;
		ret.vertices = sp.vertices;
		ret.inTangents = sp.inTangents;
		ret.outTangents = sp.outTangents;
		return ret;
	}
	// **********************
	// ********************************************************************************
	// Propertyのvalueを読み出す
	// ********************************************************************************
	var getObjectFromPropertyValue = function(p)
	{

		var ret = null;
		var v = null;
		
		if ((p.isModified == false)&&(isModifiedMode==true)) return ret;
		switch(p.propertyValueType){
			case  PropertyValueType.NO_VALUE:
				break;
			case  PropertyValueType.ThreeD_SPATIAL:
			case PropertyValueType.ThreeD:
			case PropertyValueType.TwoD_SPATIAL:
			case PropertyValueType.TwoD:
			case PropertyValueType.OneD:
			case PropertyValueType.COLOR:
				ret  = p.value;
				break;
			case PropertyValueType.SHAPE:
				ret = ShapeTo(p.value);
				break;
			//case PropertyValueType.CUSTOM_VALUE:	
			//case PropertyValueType.MARKER:
			//case PropertyValueType.LAYER_INDEX:
			//case PropertyValueType.MASK_INDEX:
			//case PropertyValueType.TEXT_DOCUMENT:
		}
		return ret;
	}
	var getObjectFromPropertyTimes = function(p)
	{
		var ret = [];
		for ( var i=1; i<=p.numKeys; i++) {
			ret.push(p.keyTime(i));
		}
		return ret;
	}
	var getObjectFromPropertyValues = function(p)
	{

		var ret = null;
		var v = null;
		
		if ((p.isModified == false)&&(isModifiedMode==true)) return ret;
		switch(p.propertyValueType){
			case  PropertyValueType.NO_VALUE:
				break;
			case  PropertyValueType.ThreeD_SPATIAL:
			case PropertyValueType.ThreeD:
			case PropertyValueType.TwoD_SPATIAL:
			case PropertyValueType.TwoD:
			case PropertyValueType.OneD:
			case PropertyValueType.COLOR:
				ret = [];
				for ( var i=1; i<=p.numKeys; i++) {
					ret.push(p.keyValue(i));
				}
				break;
			case PropertyValueType.SHAPE:
				ret = [];
				for ( var i=1; i<=p.numKeys; i++) {
					ret.push( ShapeTo(p.keyValue(i) ));
				}
				break;
			//case PropertyValueType.CUSTOM_VALUE:	
			//case PropertyValueType.MARKER:
			//case PropertyValueType.LAYER_INDEX:
			//case PropertyValueType.MASK_INDEX:
			//case PropertyValueType.TEXT_DOCUMENT:
		}
		return ret;
	}

	// ********************************************************************************
	//プロパティの情報を読み出す
	// ********************************************************************************
	var getObjectFromProperty = function(p)
	{
		var ret = {};
		if ( ("name" in p)==false) return ret;
		if ((p.isModified == false)&&(isModifiedMode==true)) {
			return null;
		}
		ret = getObjectSub(p);
		if (p.canSetExpression==true){
			if (p.expression !="") {
				ret.expression = p.expression.replace("\\","\\\\");
				ret.expressionEnabled = p.expressionexpressionEnabled;
			}
		}
		var numKeys = 0;
		if ("numKeys" in p) {
			numKeys = p.numKeys;
		}
		if ("value" in p) {
			if (numKeys<=0) {
				var v = getObjectFromPropertyValue(p)
				if (v!= null) ret.value = v;
			}else{
				var v = getObjectFromPropertyValues(p)
				if (v!= null) ret.values = v;
				var t = getObjectFromPropertyTimes(p)
				if (t!= null) ret.times = t;
			}
		}

		return ret;
	}

	// ********************************************************************************
	// プロパティグループから情報を読み出す
	// ********************************************************************************
	var getObjectFromPropertyGroup= function(p)
	{
		var ret = {};
		if ((p.isModified == false)&&(isModifiedMode==true)) {
			return null;
		}
		ret = getObjectSub(p);
		ret.items = [];
		if (p.numProperties>0){
			for(var i=1; i<=p.numProperties; i++){
				var v = getObjectFromProperty(p.property(i));
				if (v!=null) ret.items.push(v);
			}
		}
		return ret;
		
	}	
	// ********************************************************************************
	// ルートコンテンツから情報を読み出す
	// ********************************************************************************
	var getObjectFromRoot= function(p)
	{
		var ret = {};
		if ((p.isModified == false)&&(isModifiedMode==true)) {
			return null;
		}
		ret = getObjectSub(p);
		if (p.numProperties>0){
			ret.content = [];
			for ( var i=1; i<=p.numProperties; i++){
				var v = getObject(p.property(i));
				if (v!=null)ret.content.push(v);
			}
		}
		return ret;
	}
	// ********************************************************************************
	// グループから情報を読み出す
	// ********************************************************************************
	var getObjectFromGroup= function(p)
	{
		var ret = {};
		if ((p.isModified == false)&&(isModifiedMode==true)) {
			return null;
		}
		ret = getObjectSub(p);
		ret.npG = p.numProperties;
		var v = getObjectFromProperty(p.property(1));
		if (v!=null) ret.blendMode = v;
		
		var v = getObjectFromContent(p.property(2));
		if (v!=null) ret.content =v;
		
		var v = getObjectFromPropertyGroup(p.property(3));
		if (v!=null) ret.transform = v;
		
		return ret;
		
	}
	// ********************************************************************************
	//コンテンツから情報を読み出す
	// ********************************************************************************
	var getObjectFromContent= function(p)
	{
		var ret = {};
		if ((p.isModified == false)&&(isModifiedMode==true)) {
			return null;
		}
		ret = getObjectSub(p);
		if (p.numProperties>0){
			ret.items = [];
			for ( var i=1; i<=p.numProperties; i++){
				var v = getObject(p.property(i));
				if (v!=null) ret.items.push(v);
			}
		}
		return ret;
		
	}
	// ********************************************************************************
	// トランスフォームから情報を読み出す
	// ********************************************************************************
	var getObjectFromTransform = function(p)
	{
		var ret = {};
		if ((p.isModified == false)&&(isModifiedMode==true)) {
			return null;
		}
		var pp = getObjectSub(p);
		if (pp.numProperties>0){
			pp.items = [];
			for ( var i=1; i<=p.numProperties; i++){
				var v = getObjectFromProperty(p.property(i));
				if (v!=null) pp.items.push(v);
			}
		}
		return ret;
		
	}
	// ********************************************************************************
	// Shapeをエキスポート
	//
	// ********************************************************************************
	var getObject= function(p)
	{
		var ret = null;
		var v= null;
		if (p instanceof PropertyGroup) {
			switch (p.matchName){
				case "ADBE Root Vectors Group": //ルートコンテンツ
					v = getObjectFromRoot(p);
					break;
				case "ADBE Vectors Group": //コンテンツ
					v = getObjectFromContent(p);
					break;
				case "ADBE Vector Group": //グループ
					v = getObjectFromGroup(p);
					break;
				default://各要素
					v = getObjectFromPropertyGroup(p);
					break;
				
			}
		}else if  (p instanceof Property) {
			v = getObjectFromProperty(p)
		}
		if(v!=null) ret = v;

		return ret;	
	}
	// ********************************************************************************
	//Shapeをエキスポート
	//
	// ********************************************************************************
	var exportShape = function()
	{
		var ac = getActiveComp();
		if (ac==null) return ;
		var pg = getPropertyGroup(ac);
		if (pg==null) return;
		
		
		var shapeData = {};
		shapeData.ahead = "AEShapeIO";
		shapeData.aep = app.project.file.fsName;
		shapeData.compName = ac.name;
		shapeData.shape  = getObject(pg);
		
		
		//var js = toJSON(shapeData);
		var js = JSON.stringify(shapeData,undefined,1);
		
		var fPath = File.saveDialog("Export Sgape","*.json");
		if(fPath ==null){
			return;
		}
		var f = new File(fPath);
		f.encoding = "utf-8";
		if (f.open("w")){
			try{
				f.write(js);
			}finally{
				f.close();
			}
		}
		if (f.exists){
			alert("Save OK! \r\n"+f.fsName); 
		}
	}

	// ********************************************************************************
	var winObj = ( me instanceof Panel) ? me : new Window("palette", scriptName, [ 0,  0,  200,  160]  ,{resizeable:true, maximizeButton:true, minimizeButton:true});
	// ********************************************************************************
	var ctrl_xx = 15;
	var ctrl_yy = 15;
	var cap		= winObj.add("statictext",    [ctrl_xx,ctrl_yy,ctrl_xx+ 170,ctrl_yy+ 25], "Shapeデータのファイル保存と読み込み" );
	ctrl_yy += 35;
	var btnExport = winObj.add("button",    [ctrl_xx,ctrl_yy,ctrl_xx+ 170,ctrl_yy+ 25], "Shape 書き出し" );
	ctrl_yy += 35;
	var btnImport = winObj.add("button",    [ctrl_xx,ctrl_yy,ctrl_xx+ 170,ctrl_yy+ 25], "Shape 読み込み" );
	ctrl_yy += 35;
	
	// ********************************************************************************


	// ********************************************************************************
	cntrlTbl.push(btnExport);
	cntrlTbl.push(btnImport);
	
	// ********************************************************************************
	btnExport.onClick = exportShape;
	btnImport.onClick = importShape;

	// ********************************************************************************
	var resizeWin = function()
	{
		var b = winObj.bounds;
		var w = b[2] - b[0];
		var h = b[3] - b[1];
		var cnt = cntrlTbl.length;
		for ( var i=0; i<cnt; i++)
		{
			var c = cntrlTbl[i];
			var bs = c.bounds;
			bs[0] = ctrl_xx;
			bs[2] = bs[0] + w - ctrl_xx*2;
			c.bounds = bs;
		}
	}
	resizeWin();
	winObj.onResize = resizeWin;

	//-------------------------------------------------------------------------
	//-------------------------------------------------------------------------
	if ( ( me instanceof Panel) == false){
		winObj.center(); 
		winObj.show();
	}
	//-------------------------------------------------------------------------
})(this);