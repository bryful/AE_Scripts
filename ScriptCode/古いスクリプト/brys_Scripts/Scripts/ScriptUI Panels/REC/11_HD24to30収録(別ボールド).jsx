//**************************************************************************
function makeRecCompWithBold()
{
	this.title = "HD24to30収録Comp作成(別ボールド)";
	var targetList	= new Array;
	var targetBold	= new Array;
	
	var outWidth		= 1920;
	var outHeight		= 1080;
	var outFps			= 29.97;
	var outAspect		= 1.0;

	var inFps			= 23.976;
	var inAspect		= 1.0;
	
	var boldLength		= 1/3;
	
	//-----------------------------------------------
	this.settingFps = function (iFps,oFps)
	{
		inFps = iFps;
		outFps = oFps;
	}
	//-----------------------------------------------
	this.settingAspect = function (iAspect,oAspect)
	{
		inAspect = iAspect;
		outAspect = oAspect;
	}
	//-----------------------------------------------
	function isSequece(ftg)
	{
		var ret = -1;
		if (ftg == null) return ret;
		if ( ftg instanceof FootageItem) {
			if (ftg.file != null){
				if ( ftg.mainSource.isStill == true) {
					ret = 1;
				}else{
					ret = 0;
				}
			}
		}
		
		return ret;
	}
	//-----------------------------------------------
	function splitFileName(s)
	{
		var ss = s;
		var o = new Object;
		o.node = "";
		o.frameSepa = "";
		o.frames = "";
		o.ext = "";
		
		if ( ss == "" ) return o;
		var p1 = ss.lastIndexOf(".");
		if ( p1>=0) {
			o.ext = ss.substring(p1);
			ss = ss.substring(0,p1);
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
	function getFootageFromFolder(path)
	{
		var cnt = path.items.length;
		if ( cnt <=0 ) return;
		for ( var i = 0; i < cnt; i++){
			var kind = isSequece(app.project.selection[i]);
			if ( kind ==0 ){
				targetList.push(path.items[i]);
			}else if ( kind == 1 ){
				targetBold.push(path.items[i]);
			}else if ( path.items[i] instanceof FolderItem ){
				getFootageFromFolder(path.items[i]);
			}
		}
	}
	function getFootage()
	{
		targetList = new Array;
		var cnt = app.project.selection.length;
		if (cnt <=0) return;
		for ( var i = 0; i < cnt; i++){
			var kind = isSequece(app.project.selection[i]);
			if ( kind == 0 ){
				targetList.push(app.project.selection[i]);
			}else if ( kind == 1 ){
				targetBold.push(app.project.selection[i]);
			}else if ( app.project.selection[i] instanceof FolderItem ){
				getFootageFromFolder(app.project.selection[i]);
			}
		}
	}
	//-----------------------------------------------
	function findBold(s)
	{
		var ss = s.toLowerCase();
		var cnt = targetBold.length;
		if (cnt<=0) return null;
		for ( var i=0; i<cnt; i++){
			var nm = splitFileName(targetBold[i].name);
			
			if ( nm.node.toLowerCase() == ss){
				return targetBold[i];
			}
		}
		return null;
	}
	//-----------------------------------------------
	function makeComp()
	{
		var cnt = targetList.length;
		if ( cnt <=0 ) return;
		
		for ( var i=0; i<cnt; i++){
			targetList[i].mainSource.conformFrameRate = inFps;
			targetList[i].pixelAspect = inAspect;
	
			var pf = targetList[i].parentFolder;
			
			var nm = splitFileName(targetList[i].name);
			
			
			var du = targetList[i].duration + boldLength;

			//フレームレート変更の場合は、フィールドを切り捨てる
			if ( inFps != outFps){
				var frm = Math.floor(targetList[i].duration * outFps);
				du = (frm / outFps)  + boldLength;
			}
			
			var dstComp = pf.items.addComp(
				nm.node,
				outWidth,
				outHeight,
				outAspect,
				du,
				outFps);
			//念のために再設定
			dstComp.duration = du;
			
			var mainLayer = dstComp.layers.add(targetList[i]);
			mainLayer.startTime = boldLength;
			
			//縦幅を合わせる
			var s = 100 * outHeight / targetList[i].height;
			mainLayer.property("Scale").setValue([s,s]);
			//mainLayer.stretch;
			
			var bld = findBold(nm.node);
			if (bld != null){
				var b = dstComp.layers.add(bld);
				b.startTime = 0;
				b.outPoint = boldLength;
				s = 100 * outHeight / bld.height;
				b.property("Scale").setValue([s,s]);
			}
		}
	}
	this.exec = function()
	{
		getFootage();
		if (targetList.length<=0) {
			alert("ターゲットが選択されていません。");
		}else{
			app.beginUndoGroup(this.title);
			makeComp()
			app.endUndoGroup();
		};
	}
}
var mrcb = new makeRecCompWithBold();
mrcb.title = "HD24to30収録Comp作成(別ボールド)";
mrcb.settingFps(23.976,29.97);

mrcb.exec();

