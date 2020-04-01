(function (me){
	var errList = [];//*************************var folderSolidChk = function(itm){	if (!(itm instanceof FolderItem)) return true;	if (itm.numItems<=0) return true;	for ( var i = 1; i<=itm.numItems; i++){		var t = itm.item(i);		var b = true;		if (t instanceof CompItem){			continue;		}else if (t instanceof FolderItem) {			b = folderChk(t);		}else if ( t instanceof FootageItem) {			if (t.mainSource.color == undefined) {				if (t.file != null) {					b = false;				}			}		}		if (b==false){			return false;		}	}	return true;	}
//*************************var itemPath = function(itm){	var r = [];	p = itm;	while (p!= null){		r.push(p.name);		p = p.parentFolder;	}	r = r.reverse();	var ret = "";	for (var i=0; i<r.length; i++) {		if (ret != "") ret += ":";		if (r[i] !="ルート") {			ret += r[i];		}	}	return ret;}//*************************var errListToStr= function(itm){		return  itm.err + " " + itm.errName + " (" + itemPath(itm) +")";}//*************************var errListToStrList= function(){	var ret = [];	if (errList.length<=0) return ret;		for (var i=0; i<errList.length; i++) {		ret.push(errListToStr(errList[i]));	}	return ret;}//*************************var nameChk = function(s){	var ret = 0;	if (s.length<=0) return ret;		var space = false;	for (var i=0; i<s.length; i++) {		var c = s[i];		if (  ((c>="0")&&(c<="9"))			||((c>="a")&&(c<="z"))			||((c>="A")&&(c<="Z"))			||((c=="-")||(c=="_")||(c==".")||(c=="(")||(c==")"))			){				//正常		}else if (c ==" ") {			space = true;		}else{			ret = 1;			break;		}	}	if ((ret==0)&&(space == true)) {		ret  = 2;	}	return ret;}
//*************************
var itemChk = function(itm){	itm.err = "";	itm.errName  = "";	if ( itm instanceof CompItem){	}else if ( itm instanceof FolderItem) {		var e = nameChk(itm.name);		if (e!=0) {			if (e == 1) {				itm.err = "警告！フォルダ名エラー ";			}else if (e ==2) {				itm.err = "注意。フォルダ名にスペース";			}			var f = false;			if (itm.name == "平面"){				f = folderSolidChk(itm);			}			if (f==false){				itm.errName = itm.name;				errList.push(itm);			}		}	}else if ( itm instanceof FootageItem) {		if (itm.mainSource.color ==undefined ){			if (itm.file == null) {				itm.err = "致命的！ファイルリンクエラー";				itm.errName = itm.name;				errList.push(itm);			}else{				var e =nameChk(File.decode(itm.file.name));			 	if (e!=0){					if (e == 1) {						itm.err = "警告！ファイル名エラー ";					}else if (e ==2) {						itm.err = "警告！ファイル名にスペース";					}					itm.errName = File.decode(itm.file.name);					errList.push(itm);				}			}		}	}}//*************************
//MainWindow
var winObj = ( me instanceof Panel) ? me : new Window("palette", "日本語確認", [0,0,0+349,0+402],{resizeable:true});

//*************************
//controls
var lbInfo = winObj.add("statictext",[11, 11, 11+327, 11+12],"問題ありそうなフッテージを表示します。");
var listResult = winObj.add("listbox",[11, 29, 11+327, 29+333],[]);
var btnFind = winObj.add("button",[263, 368, 263+75, 368+23],"探す");
var btnStart = winObj.add("button",[263, 368, 263+75, 368+23],"開始");
btnFind.enabled = false;
var ddClick = function(){	if (app.project.numItems>0) {		for ( var i=1; i<=app.project.numItems; i++){			var t = app.project.item(i);			if (t.selected) t.selected = false;		}	}	var idx = this.selection.index;	if (idx>=0) {		errList[idx].selected = true;	}}var ddClick2= function(){	if (app.project.numItems>0) {		for ( var i=1; i<=app.project.numItems; i++){			var t = app.project.item(i);			if (t.selected) t.selected = false;		}	}	var idx = listResult.selection.index;	if (idx>=0) {		errList[idx].selected = true;	}}var ddChange = function(){	btnFind.enabled = (this.selection.index>=0);}btnFind.onClick = ddClick2;listResult.onDoubleClick = ddClick;listResult.onChange = ddChange;
//*************************var chk = function(){	errList = [];	lbInfo.text = "Check Start";	listResult.removeAll();	if (app.project.numItems>0) {		for (var i=1; i<= app.project.numItems; i++) {			itemChk(app.project.item(i));		}		if (errList.length>0) {			for (var i=0; i<errList.length; i++){				listResult.add("item",errListToStr(errList[i]));			}		}else{			lbInfo.text = "no errors!";		}	}else{		lbInfo.text = "no items";	}}
//*************************
//button click event
btnStart.onClick = chk;
//*************************
//resize eventwinObj.onResize= function(){
	var b = winObj.bounds;
	var bw = b[2]-b[0];
	var bh = b[3]-b[1];
		var lbInfo_b = lbInfo.bounds;
	lbInfo_b[0] = 10;
	lbInfo_b[1] = 10;
	lbInfo_b[2] = b[2] - 10;
	lbInfo_b[3] = 22;
	lbInfo.bounds = lbInfo_b;	
	var listResult_b = listResult.bounds;
	listResult_b[0] = 10;
	listResult_b[1] = 30;
	listResult_b[2] = bw - 10;
	listResult_b[3] = bh - 50;
	listResult.bounds = listResult_b;
	var btnStart_b = btnStart.bounds;
	btnStart_b[0] = bw - 100;
	btnStart_b[2] = bw - 10;
	btnStart_b[1] = bh - 45;
	btnStart_b[3] = bh - 10;
	btnStart.bounds = btnStart_b;
	var btnＦｉｎｄ_b = btnFind.bounds;
	btnＦｉｎｄ_b[0] = bw - 200;
	btnＦｉｎｄ_b[2] = bw - 110;
	btnＦｉｎｄ_b[1] = bh - 45;
	btnＦｉｎｄ_b[3] = bh - 10;
	btnＦｉｎｄ.bounds = btnＦｉｎｄ_b;
}
//*************************
//window show
if ( ( me instanceof Panel) == false){
	winObj.center();
	winObj.show();
}
})(this);
