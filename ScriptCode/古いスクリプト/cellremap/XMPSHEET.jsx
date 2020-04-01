//XMPを使うときのおまじない
if (ExternalObject.AdobeXMPScript == undefined) {
	ExternalObject.AdobeXMPScript = new　ExternalObject('lib:AdobeXMPScript');
}

if ( typeof (XMPSHEET) !== "object"){//デバッグ時はコメントアウトする
	XMPSHEET = {};
}//デバッグ時はコメントアウトする

(function(){

	var sheetNamespace = "animeSheet";
	var sheetNamespaceURL = "ns_animeSheet";
	var sheetNamePropName = sheetNamespace +":name";
	var sheetDataPropName = sheetNamespace +":data";

	var  cellRemapFile = new File("$cellRemapPath");

	var isWindows = ($.os.indexOf("Windows")>=0);

	//-------------------------------------------------------------------------
	var getExt = function(str)
	{
		var ret = "";
		if ( str === "" ) return ret;
		var s = "";
		if ( typeof(str) === "string") {
			s = str;
		}else if ( str instanceof File){
			s = File.decode(str.name);
		}
		var idx = s.lastIndexOf(".");
		if ( idx<0) return ret;
		var e = s.substring(idx).toLowerCase();
		if ( (e === ".ard")||(e === ".ardj")||(e === ".sts")||(e === ".xps")||(e === ".tsh") ) ret = e;
		return ret;
	}
	//-------------------------------------------------------------------------
	var newSheetData = function ()
	{
		return {
			sheetName:"",
			frameRate:24,
			frameCount:24,
			cellCount:6,
			caption:["A","B","C","D","E","F"],
			cells:[[],[],[],[],[],[]],
			AfterFXPath:""
			};
	}
	//-------------------------------------------------------------------------
	function setup()
	{
		try{
			XMPMeta.registerNamespace(sheetNamespaceURL,sheetNamespace);
			var mdata = new XMPMeta(app.project.xmpPacket);
			var schemaNS = XMPMeta.getNamespaceURI(sheetNamespace);

			if (mdata.doesPropertyExist(schemaNS, sheetNamePropName) === false){
				mdata.setProperty(schemaNS, sheetNamePropName,null,XMPConst.PROP_IS_ARRAY);
				b = true;
			}
			if (mdata.doesPropertyExist(schemaNS, sheetDataPropName) === false){
				mdata.setProperty(schemaNS, sheetDataPropName,null,XMPConst.PROP_IS_ARRAY);
				b = true;
			}
			if ( b) app.project.xmpPacket = mdata.serialize();

		}catch(e){
			alert("XMPSHEET.setup()\n" + e.toString());
		}
	}
	//必ず１回実行
	setup();
	if (typeof(XMPSHEET.setup) !== "function"){
		XMPSHEET.setup = setup;
	}
	//-------------------------------------------------------------------------
	function unSetup()
	{
		try{
			var mdata = new XMPMeta(app.project.xmpPacket);
			var schemaNS = XMPMeta.getNamespaceURI(sheetNamespace);
			if (mdata.doesPropertyExist(schemaNS, sheetNamePropName) === true){
				mdata.deleteProperty(schemaNS, sheetNamePropName);
				b = true;
			}
			if (mdata.doesPropertyExist(schemaNS, sheetDataPropName) === true) {
				mdata.deleteProperty(schemaNS, sheetDataPropName);
				b = true;
			}
			if ( b) app.project.xmpPacket = mdata.serialize();
		}catch(e){
			alert("XMPSHEET.unSetup()\n" +e.toString());
		}
	}
	if (typeof(XMPSHEET.unSetup) !== "function"){
		XMPSHEET.unSetup = unSetup;
	}
	//-------------------------------------------------------------------------
	function add(name,data)
	{
		try{
			var mdata = new XMPMeta(app.project.xmpPacket);
			var schemaNS = XMPMeta.getNamespaceURI(sheetNamespace);
			if (mdata.doesPropertyExist(schemaNS, sheetNamePropName) === false){
				mdata.setProperty(schemaNS, sheetNamePropName,null,XMPConst.PROP_IS_ARRAY);
			}
			mdata.appendArrayItem(schemaNS, sheetNamePropName,escape(name));

			if (mdata.doesPropertyExist(schemaNS, sheetDataPropName) === false) {
				mdata.setProperty(schemaNS, sheetDataPropName,null,XMPConst.PROP_IS_ARRAY);
			}
			mdata.appendArrayItem(schemaNS, sheetDataPropName,escape(data));
			app.project.xmpPacket = mdata.serialize();
		}catch(e){
			alert("XMPSHEET.add()\n" +e.toString());
		}
	}
	if (typeof(XMPSHEET.add) !== "function"){
		XMPSHEET.add = add;
	}
	//-------------------------------------------------------------------------
	function insert(name,data,index)
	{
		try{
			var mdata = new XMPMeta(app.project.xmpPacket);
			var schemaNS = XMPMeta.getNamespaceURI(sheetNamespace);
			mdata.insertArrayItem(schemaNS, sheetNamePropName,index,escape(name));
			mdata.insertArrayItem(schemaNS, sheetDataPropName,index,escape(data));
			app.project.xmpPacket = mdata.serialize();
		}catch(e){
			alert("XMPSHEET.insert(name,data,index)\n" +e.toString());
		}
	}
	if (typeof(XMPSHEET.insert) !== "function"){
		XMPSHEET.insert = insert;
	}
	//-------------------------------------------------------------------------
	function remove(index)
	{
		var ret = false;
		try{
			if ( index<=0) return ret;
			var mdata = new XMPMeta(app.project.xmpPacket);
			var schemaNS = XMPMeta.getNamespaceURI(sheetNamespace);
			var cnt = mdata.countArrayItems(schemaNS, sheetNamePropName);
			if ( index>cnt) return ret;
			mdata.deleteArrayItem(schemaNS, sheetNamePropName,index);
			mdata.deleteArrayItem(schemaNS, sheetDataPropName,index);
			app.project.xmpPacket = mdata.serialize();
		}catch(e){
			alert("XMPSHEET.delete(index)\n" +e.toString());
		}
	}
	if (typeof(XMPSHEET.remove) !== "function"){
		XMPSHEET.remove = remove;
	}
	//-------------------------------------------------------------------------
	function setData(name,data,index)
	{
		try{
			var mdata = new XMPMeta(app.project.xmpPacket);
			var schemaNS = XMPMeta.getNamespaceURI(sheetNamespace);
			var cnt = mdata.countArrayItems(schemaNS, sheetNamePropName);
			if ( (index>=1)&&(index<=cnt)){
				mdata.deleteArrayItem(schemaNS, sheetNamePropName,index);
				mdata.deleteArrayItem(schemaNS, sheetDataPropName,index);
				mdata.insertArrayItem(schemaNS, sheetNamePropName,index,escape(name));
				mdata.insertArrayItem(schemaNS, sheetDataPropName,index,escape(data));
			}else{
				mdata.appendArrayItem(schemaNS, sheetNamePropName,escape(name));
				mdata.appendArrayItem(schemaNS, sheetDataPropName,escape(data));
			}
			app.project.xmpPacket = mdata.serialize();

		}catch(e){
			alert("XMPSHEET.setData(name,data,index)\n" +e.toString());
		}
	}
	if (typeof(XMPSHEET.setData) !== "function"){
		XMPSHEET.setData = setData;
	}
	//-------------------------------------------------------------------------
	function getName(index)
	{
		var ret = "";
		try{
			var mdata = new XMPMeta(app.project.xmpPacket);
			var schemaNS = XMPMeta.getNamespaceURI(sheetNamespace);
			var n = mdata.getArrayItem(schemaNS, sheetNamePropName,index);
			if ( n != undefined)  ret  = unescape(n);
			return ret;
		}catch(e){
			alert("XMPSHEET.getName(index)\n" +e.toString());
		}
	}
	if (typeof(XMPSHEET.getName) !== "function"){
		XMPSHEET.getName = getName;
	}
	//-------------------------------------------------------------------------
	function getData(index)
	{
		var ret = {};
		try{
			var mdata = new XMPMeta(app.project.xmpPacket);
			var schemaNS = XMPMeta.getNamespaceURI(sheetNamespace);
			var n = mdata.getArrayItem(schemaNS, sheetNamePropName,index);
			if ( n != undefined)  n  = unescape(n);
			ret.name = n;
			var d = mdata.getArrayItem(schemaNS, sheetDataPropName,index);
			if ( d != undefined)  d  = unescape(d);
			ret.data = d;
			return ret;
		}catch(e){
			alert("XMPSHEET.getData(index)\n" +e.toString());
		}
	}
	if (typeof(XMPSHEET.getData) !== "function"){
		XMPSHEET.getData = getData;
	}
	//-------------------------------------------------------------------------
	function up(index)
	{
		var ret = false;
		try{
			if (index<=1) return ret;
			var mdata = new XMPMeta(app.project.xmpPacket);
			var schemaNS = XMPMeta.getNamespaceURI(sheetNamespace);
			var cnt = mdata.countArrayItems(schemaNS, sheetNamePropName);
			if ( cnt === 1) return ret;
			var n = mdata.getArrayItem(schemaNS, sheetNamePropName,index-1);
			var d = mdata.getArrayItem(schemaNS, sheetDataPropName,index-1);

			mdata.deleteArrayItem(schemaNS, sheetNamePropName,index-1);
			mdata.deleteArrayItem(schemaNS, sheetDataPropName,index-1);

			mdata.insertArrayItem(schemaNS, sheetNamePropName,index,n);
			mdata.insertArrayItem(schemaNS, sheetDataPropName,index,d);
			app.project.xmpPacket = mdata.serialize();
			ret = true;
		}catch(e){
			alert("XMPSHEET.up(index)\n" +e.toString());
		}
		return ret;
	}
	if (typeof(XMPSHEET.up) !== "function"){
		XMPSHEET.up = up;
	}
	//-------------------------------------------------------------------------
	function down(index)
	{
		var ret = false;
		try{
			if (index<1) return ret;
			var mdata = new XMPMeta(app.project.xmpPacket);
			var schemaNS = XMPMeta.getNamespaceURI(sheetNamespace);
			var cnt = mdata.countArrayItems(schemaNS, sheetNamePropName);
			if ( (cnt === 1)||(index>=cnt)) return ret;
			var n = mdata.getArrayItem(schemaNS, sheetNamePropName,index);
			var d = mdata.getArrayItem(schemaNS, sheetDataPropName,index);

			mdata.deleteArrayItem(schemaNS, sheetNamePropName,index);
			mdata.deleteArrayItem(schemaNS, sheetDataPropName,index);

			mdata.insertArrayItem(schemaNS, sheetNamePropName,index+1,n);
			mdata.insertArrayItem(schemaNS, sheetDataPropName,index+1,d);
			app.project.xmpPacket = mdata.serialize();
			ret = true;
		}catch(e){
			alert("XMPSHEET.down(index)\n" +e.toString());
		}
		return ret;
	}
	if (typeof(XMPSHEET.down) !== "function"){
		XMPSHEET.down = down;
	}
	//-------------------------------------------------------------------------
	function find(name)
	{
		var ret = 0;
		try{
			var mdata = new XMPMeta(app.project.xmpPacket);
			var schemaNS = XMPMeta.getNamespaceURI(sheetNamespace);
			var cnt = mdata.countArrayItems(schemaNS, sheetNamePropName);
			if ( cnt>0){
				for ( var i=1; i<=cnt; i++){
					var n = mdata.getArrayItem(schemaNS, sheetNamePropName,i);
					if ( n != undefined){
						if ( name === unescape(n)){
							ret = i;
							break;
						}
					}
				}
			}
			return ret;
		}catch(e){
			alert("XMPSHEET.find(name)\n" +e.toString());
		}
	}
	if (typeof(XMPSHEET.find) !== "function"){
		XMPSHEET.find = find;
	}
	//-------------------------------------------------------------------------
	function count()
	{
		try{
			var mdata = new XMPMeta(app.project.xmpPacket);
			var schemaNS = XMPMeta.getNamespaceURI(sheetNamespace);
			return mdata.countArrayItems(schemaNS, sheetNamePropName);
		}catch(e){
			alert("XMPSHEET.count()\n" +e.toString());
		}
	}
	if (typeof(XMPSHEET.count) !== "function"){
		XMPSHEET.count = count;
	}
	//-------------------------------------------------------------------------
	function getNameList()
	{
		var ret = [];
		try{
			var mdata = new XMPMeta(app.project.xmpPacket);
			var schemaNS = XMPMeta.getNamespaceURI(sheetNamespace);
			var cnt = mdata.countArrayItems(schemaNS, sheetNamePropName);
			if ( cnt>0){
				for ( var i=1; i<=cnt; i++){
					var s = mdata.getArrayItem(schemaNS, sheetNamePropName,i);
					ret.push( unescape(s));
				}
			}
			return ret;
		}catch(e){
			alert("XMPSHEET.getNameList()\n" +e.toString());
			return ret;
		}
	}
	if (typeof(XMPSHEET.getNameList) !== "function"){
		XMPSHEET.getNameList = getNameList;
	}
	//-------------------------------------------------------------------------
	function exportAll()
	{
		if (app.project.file === null){
			alert("XMPSHEET.exportAll() : Projct not saved!\n");
			return;
		}
		var projFolder = app.project.file.parent;
		function save(idx)
		{
			var ret = false;
			var d = getData(idx);
			if ( d.name === undefined)
			{
				alert("データが無い!");
				return false;
			}
			var f = new File(projFolder.fullName + "/" +d.name + ".ardj");
			f.encoding = "UTF-8";
			try{
				f.open("w","ardj","CRMP");
				f.write(d.data);
				ret = true;
			}catch(e){
				alert("XMPSHEET.exportAll()\n" +e.toString());
				return false;
			}finally{
				f.close();
			}
			return ret;
		}
		var c = count();
		if (c<=0) {
			alert("XMPSHEET.exportAll() : no data!\n");
			return;
		}
		for (var i=1; i<=c; i++) {
			save(i);
		}
	}
	if (typeof(XMPSHEET.exportAll) !== "function"){
		XMPSHEET.exportAll = exportAll;
	}
	//-------------------------------------------------------------------------
	function exportFile(index)
	{
		var d = getData(index);
		if ( d.name === undefined)
		{
			alert("データが無い!");
			return;
		}
		var ff = new File(d.name);
		var f = ff.saveDlg("Export","*.ardj");
		if ( f !== null){
			f.encoding = "UTF-8";
			try{
				f.open("w","ardj","CRMP");
				f.write(d.data);
			}catch(e){
				alert("XMPSHEET.exportFile()\n" +e.toString());
			}finally{
				f.close();
			}
		}
	}
	if (typeof(XMPSHEET.exportFile) !== "function"){
		XMPSHEET.exportFile = exportFile;
	}
	//-------------------------------------------------------------------------
	function escapeUnicode(str) {
	  return str.replace(/[^ -~]|\\/g, function(m0) {
		var code = m0.charCodeAt(0);
		return '\\u' + ((code < 0x10)? '000' :
						(code < 0x100)? '00' :
						(code < 0x1000)? '0' : '') + code.toString(16);
	  });
	}
	//-------------------------------------------------------------------------
	function unescapeUnicode(str) {
	  return str.replace(/\\u([a-fA-F0-9]{4})/g, function(m0, m1) {
		return String.fromCharCode(parseInt(m1, 16));
	  });
	}
	//-------------------------------------------------------------------------
	function sheetNameChk(s)
	{
		var ret = "";
		try{
			s = FsJSON.parse(s);
			if ( s !== null){
				if ( s.sheetName !== undefined){
					ret = s.sheetName;
				}
			}
		}catch(e){
			alert("eval:"+e.toString());
			return "";
		}
		return ret;
	}
	//-------------------------------------------------------------------------
	var importFileSub = function(name,js,isFunc)
	{
		var ret = false;
		if ( name !== ""){
			var idx = find(name);
			if (idx>0){
				setData(name,js,idx);
			}else{
				add(name,js);
			}
			if(isFunc == true){
				if ( typeof(XMPSHEET.importFileFunc) === "function"){
					XMPSHEET.importFileFunc();
				}
			}
			ret = true;
		}
		return ret;
	}
	//-------------------------------------------------------------------------
	function importAll()
	{
		if (app.project.file === null){
			alert("XMPSHEET.importAll() : Projct not saved!\n");
			return;
		}
		var projFolder = app.project.file.parent;
		var files = projFolder.getFiles();
		var cnt = 0;
		if (files.length>0){
			for (var i=0; i<files.length;i++){
				var e = getExt(files[i].name);
				if (e !== ""){
					var cmd = "sheetToJson" + " " +"\""+ files[i].fsName + "\"";
					try{
						var objStr = system.callSystem(cmd);
						if (  (objStr!==null)&&(objStr !=="")){
							var obj = eval(objStr);
							if ( obj.sheetName !== undefined){
								delete obj.AfterFXPath;
								ret = importFileSub(obj.sheetName,FsJSON.toJSON(obj));
								if (ret) cnt++;
							}
						}
					}catch(e){
						alert("XMPSHEET.importAll()\n call.System()\n" +e.toString());
					}
				}
			}
		}
		if (cnt>0){
			alert("ok");
		}
	}
	if (typeof(XMPSHEET.importAll) !== "function"){
		XMPSHEET.importAll = importAll;
	}
	//-------------------------------------------------------------------------
	function importFile(f,isFunc)
	{
		var ret = false;
		var ff = null;
		if ( f instanceof File){
			ff = f;
		}else if (typeof(f) === "string"){
			ff = new File(f);
			if ( ff.exists === false) ff = null;
		}
		if ( ff === null){
			ff = File.openDialog("","*.ardj;*.ard;*.xps;*.tsh;*.sts");
			if ( ff ===null) return false;
		}
		var e = getExt(ff);
		if (e === "") return false;
		if (  e !==".ardj"){
			var cmd = "sheetToJson" + " " +"\""+ ff.fsName + "\"";
			try{
				var objStr = system.callSystem(cmd);
				if (  (objStr!==null)&&(objStr !=="")){
					var obj = eval(objStr);
					if ( obj.sheetName !== undefined){
						delete obj.AfterFXPath;
						ret = importFileSub(obj.sheetName,FsJSON.toJSON(obj),isFunc);
					}
				}
			}catch(e){
				alert("XMPSHEET.exportFile()\n call.System()\n" +e.toString());
			}
		}else{
			try{
				ff.encoding = "utf-8";
				ff.open("r");
				var d = ff.read();
				if (d.length>0){
					var nm = sheetNameChk(d);
					if ( nm !== ""){
						ret = importFileSub(nm,d,isFunc);
					}
				}
			}catch(e){
				alert("XMPSHEET.exportFile()\n" +e.toString());
				return ret;
			}finally{
				ff.close();
			}
		}
		return ret;
	}
	if (typeof(XMPSHEET.importFile) !== "function"){
		XMPSHEET.importFile = importFile;
	}
	//-------------------------------------------------------------------------
	var getAfterFXPath = function()
	{
		if ( $.os.indexOf("Win")>=0){
			return Folder.appPackage.fullName+"/AfterFX.exe";
		}else{
		return Folder.appPackage.fullName;
		}
	}
	//-------------------------------------------------------------------------
	function newFile()
	{
		var cmd = "\""+cellRemapFile.fsName +"\" -n ";
		system.callSystem(cmd);
	}
	if (typeof(XMPSHEET.newFile) !== "function"){
		XMPSHEET.newFile = newFile;
	}
	//-------------------------------------------------------------------------
	function editFile(index)
	{
		try{
			var mdata = new XMPMeta(app.project.xmpPacket);
			var schemaNS = XMPMeta.getNamespaceURI(sheetNamespace);
			var n = mdata.getArrayItem(schemaNS, sheetNamePropName,index);
			if ( n === undefined)  return false;
			n  = unescape(n);
			var d = mdata.getArrayItem(schemaNS, sheetDataPropName,index);
			if ( d === undefined)  return false;
			d  = unescape(d);

			var js = FsJSON.parse(d);
			js.AfterFXPath = getAfterFXPath();
			d =FsJSON.toJSON(js);
			if ( js.sheetName !== undefined) n = js.sheetName;
			var idx = n.lastIndexOf(".");
			if ( idx>=0) {
				n = n.substring(0,idx);
			}
			var f = new File(Folder.temp.fullName +"/"+n +".ardj");
			if ( f.exists === true) f.remove();
			f.encoding = "UTF-8";
			f.open("w");
			f.write(d);
			f.close();
			if ( f.exists === true) {
				var cmd = "\""+cellRemapFile.fsName +"\" -n \"" + f.fsName + "\"";
				system.callSystem(cmd);
				ret = true;
			}
			return ret;
		}catch(e){
			alert("XMPSHEET.editFile(index)\n" +e.toString());
		}

	}
	if (typeof(XMPSHEET.editFile) !== "function"){
		XMPSHEET.editFile = editFile;
	}
	//-------------------------------------------------------------------------
	var setRemapSub = function(lyr,rd)
	{
		if ( lyr.canSetTimeRemapEnabled == false) return false;
		var rp = lyr.property("ADBE Time Remapping");
		if (rp.numKeys>0) for ( var i=rp.numKeys; i>=1;i--) rp.removeKey(i);
		var du = rp.maxValue;
		lyr.timeRemapEnabled = true;
		if (rp.numKeys>0) for ( var i=rp.numKeys; i>1;i--) rp.removeKey(i);
		for (var i=0; i<rd.length;i++){
			var t = rd[i][0];
			var v = rd[i][1];
			if ( v<du){
				if  (v<0) v = du;
				rp.setValueAtTime(t,v);
			}
		}
		for (var i=1 ; i<=rp.numKeys ; i++) rp.setInterpolationTypeAtKey(i,KeyframeInterpolationType.HOLD,KeyframeInterpolationType.HOLD);
		//inPoint/outPointの処理
		if ( rd.length>1){
			if ( rd[0][1] <0){
				lyr.inPoint = rd[1][0];
			}else{
				lyr.inPoint = 0;
			}
			if ( rd[rd.length-1][1] <0){
				if ( rd[rd.length-2][1] <0){
					lyr.outPoint = rd[rd.length-2][0]
				}else{
					lyr.outPoint = rd[rd.length-1][0]
				}
			}else{
				lyr.outPoint = lyr.containingComp.duration;
			}
		}

		var bd = lyr.property("ADBE Effect Parade").property("ADBE Block Dissolve");
		if ( bd == null)bd = lyr.property("ADBE Effect Parade").addProperty("ADBE Block Dissolve");
		bdp = bd.property("ADBE Block Dissolve-0001");
		if (bdp.numKeys>0) for ( var i=bdp.numKeys; i>=1;i--) bdp.removeKey(i);
		var v2 = 0;
		for (var i=0; i<rd.length;i++){
			var t = rd[i][0];
			var v = rd[i][1];
			if ( v<du){
				if (v<0) v = 100;else v=0;
				if ( i==0){
					bdp.setValueAtTime(t,v);
				}else if ( v2 != v ){
					bdp.setValueAtTime(t,v);
				}
			}
			v2 = v;
		}
		for (var i=1 ; i<=bdp.numKeys ; i++) bdp.setInterpolationTypeAtKey(i,KeyframeInterpolationType.HOLD,KeyframeInterpolationType.HOLD);

		/*
		if (this.inPoint != null) lyr.inPoint = this.inPoint;
		if (this.outPoint != null) lyr.outPoint = this.outPoint;
		*/
		return true;
	}
	var setRemap = function(sd,idx)
	{
		var err = "";
		var cnt = 0;
		if ( sd.cells[idx].length<=0) {
			alert( "cell number Empty!");
			return;
		}
		if (app.project.activeItem instanceof CompItem){
			if ( app.project.activeItem.selectedLayers.length>0){
				var du = sd.frameCount / sd.frameRate;
				if ( app.project.activeItem.duration != du)  app.project.activeItem.duration = du;

				var d = [];
				for ( var i=0; i<sd.cells[idx].length;i++){
					var dd = [];
					dd.push(sd.cells[idx][i][0]/sd.frameRate);

					if (sd.cells[idx][i][1]===0){
						dd.push(-1);
					}else{
						dd.push(  (sd.cells[idx][i][1]-1)/sd.frameRate);
					}
					d.push(dd);
				}

				for ( var i=0; i<app.project.activeItem.selectedLayers.length;i++){
					if (setRemapSub(app.project.activeItem.selectedLayers[i],d) ==false){
						err += "! " + app.project.activeItem.selectedLayers[i].name +" is not remaped!\r\n"
					}else{
						cnt++;
					}
				}
			}else{
				err += "no selected Layer!\r\n";
			}
		}else{
			err += "no actived CompItem!\r\n";
		}
		if ( (err =="")&&(cnt==0) ) err = "no Target!\r\n";
		if (err !=""){
			alert(err);
		}
	}
	//-------------------------------------------------------------------------
	var setRemapDialog = function (sheetData)
	{
		var sd = sheetData;
		var sp3 = function(v){
			if ( v==0) return "X  ";
			else if ( v<10) return  v+"  ";
			else if ( v<100) return  v+" ";
			else return "" + v;
		}
		var capS = function(v){
			var ret = "";
			var l = v.length;
			if ( l==0){
				ret = "     ";
			}else if (l==1){
				ret = "    "+v;
			}else if (l==2){
				ret = "   "+v;
			}else if (l==3){
				ret = "  "+v;
			}else if (l==4){
				ret = " "+v;
			}else if (l==5){
				ret = ""+v;
			}else{
				ret = v.substr(0,5);
			}
			return ret;
		}
		var dispCell = function(a,cap,fc){
			var ret = capS(cap) + "  : ";
			var p = [];
			if (fc >60) fc = 60;
			for ( var i=0; i<fc;i++) p.push(-1);
			p[0] = 0;
			for ( var i = 0; i<a.length;i++){
				p[a[i][0]] = a[i][1];
			}
			for ( var i=0; i<fc;i++) {
				if ( p[i] <0) {
					ret += " . ";
				}else{
					ret += sp3(p[i]);
				}
			}
			return ret;
		}
		var title = "Remapセット";
		if ( sheetData.sheetName !== undefined) {
			title += " [" + sheetData.sheetName +"]";
		}else{
			alert("no sheetdata!");
			return;
		}
		var fc = 0;
		if  ( sheetData.frameCount !== undefined) {
			fc = sheetData.frameCount;
			title += " frame:" + fc;
		}
		var fps = 0;
		if  ( sheetData.frameRate !== undefined) {
			fps = sheetData.frameRate;
			title += " fps:" + fps;
		}
		//-------------------------------------------------------------------------
		var cellList_items = [];
		if ( sheetData.cells !== undefined){
			for ( var i= 0; i<sheetData.cells.length; i++){
				cellList_items.push( dispCell(sheetData.cells[i], sheetData.caption[i], fc));
			}
		}
		//-------------------------------------------------------------------------
		var winObj = new Window("palette", title, [ 0, 0,  260,  220]  ,{resizeable:true, maximizeButton:true, minimizeButton:true});
		//-------------------------------------------------------------------------
		var btnSet = winObj.add("button", [  10,   10,   10+ 100,   10+  25], "レイヤへ適応" );
		btnSet.graphics.font = ScriptUI.newFont("MS UI Gothic",ScriptUI.FontStyle.REGULAR, 12);
		var cellList = winObj.add("listbox", [  10,   40,   10+ 240,   40+ 170], cellList_items );
		cellList.graphics.font = ScriptUI.newFont("MS UI Gothic",ScriptUI.FontStyle.REGULAR, 12);
		//---------------------------
		var resizeW = function(){
			var b = winObj.bounds;
			var cb = cellList.bounds;
			cb[2] = b.width-10;
			cb[3] = b.height-10;
			cellList.bounds = cb;
		}
		resizeW();
		winObj.onResize = resizeW;
		//---------------------------
		btnSet.enabled = false;
		cellList.onChange= function()
		{
			var idx = -1;
			if ( cellList.selection != null) idx = cellList.selection.index;

			btnSet.enabled = (idx>=0);
		}
		btnSet.onClick = function(){
			var idx = -1;
			if ( cellList.selection != null) idx = cellList.selection.index;
			if (idx>=0){
				setRemap(sd,idx);
			}
		}
		winObj.center();
		winObj.show();
	}
	if (typeof(XMPSHEET.setRemapDialog) !== "function"){
		XMPSHEET.setRemapDialog = setRemapDialog;
	}
	//-------------------------------------------------------------------------	//-------------------------------------------------------------------------
	var mkSheetTextLayer = function (cmp, name, d)	{			var tx = cmp.layer(name);			if ( (tx === null)||( !(tx instanceof TextLayer))){				tx = cmp.layers.addText();			}			tx.name = name;			tx.property("ADBE Transform Group").property("ADBE Position").setValue([5,25]);			tx.property("Marker").setValueAtTime(0, new MarkerValue(d));			tx.locked = true;					return tx;	}	//-------------------------------------------------------------------------
	var mkSheetTextInfo = function (cmp)	{		var infoName = "このコンポ[_cellRemap]について";		var tx = cmp.layer(infoName);		if ( (tx === null)||( !(tx instanceof TextLayer))){			tx = cmp.layers.addText();			tx.name = infoName;			tx.property("ADBE Transform Group").property("ADBE Position").setValue([20,60]);
			var infoText = "このコンポ[_cellRemap]について\n" +								"\tこのコンポにはcellRemapのデータが保存されています。\n"+								"\t扱いに注意してもらえれば助かります。\n\n"+								"\tbry-ful";						var st = tx.property("Source Text");
			var textDocument = new TextDocument(infoText);
			st.setValue(textDocument);
			
			textDocument = st.value; // 再設定これが味噌

			textDocument.resetCharStyle();
			textDocument.fontSize = 20;
			textDocument.fillColor = [1, 1, 1];
			textDocument.strokeColor = [0, 0, 0];
			textDocument.strokeWidth = 0;
			textDocument.font = "MS-Gothic";
			textDocument.strokeOverFill = true;
			textDocument.applyStroke = true;
			textDocument.applyFill = true;
			//textDocument.justification = 6014;
			textDocument.tracking = 0;
			st.setValue(textDocument);
						tx.locked = true;		}else{			return;		}					}	//-------------------------------------------------------------------------
	var  toSheetComp = function()
	{		//セーブされているか確認
		var cnt = count();
		if (cnt<=0){
			alert("no data");
			return;
		}		//総当りでルートからコンポを探す		var findComp = function(tn)		{			var ret = null;			var rf = app.project.rootFolder;			if (rf.numItems>0) {				for ( var i = rf.numItems; i>=1;i--) {					if (rf.item(i).name === tn){						if (rf.item(i) instanceof CompItem) {							ret = rf.item(i);							break;						}					}				}			}			return ret;		}		var sheetCompName = "_cellRemap";		var sheetComp = findComp(sheetCompName);		if (sheetComp === null) {
			sheetComp = app.project.items.addComp(sheetCompName,600,200,1,1,24);			mkSheetTextInfo(sheetComp);		}		for (var i = 1; i<=cnt; i++) {			var d = getData(i);			mkSheetTextLayer(sheetComp, d.name,d.data);		}
	}
	//-------------------------------------------------------------------------
	if (typeof(XMPSHEET.toSheetComp) !== "function"){
		XMPSHEET.toSheetComp = toSheetComp;
	}	toSheetComp();
	//-------------------------------------------------------------------------

})();
