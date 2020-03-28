function cellTriming()
{
	//エラーメッセージ
	var errMes = "";
	var scriptName = "cellTriming";
	
	var partsFolderFooter = "_01Parts";
	var mixCompFooter = "_02Mix";
	//---------------------------------------------
	//分離したレイヤのコンポに処理を加える関数
	this.setFunc = function (cmp,lyr)
	{
		//調整レイヤを作成
		var adjLayer = cmp.layers.addShape();
		adjLayer.name = "調整シェイプレイヤ ";
		var rct = adjLayer.property("ADBE Root Vectors Group").addProperty("ADBE Vector Shape - Rect");
		rct.name = "rect";
		//サイズをあわせるエクスプレッション
		rct.property("ADBE Vector Rect Size").expression = "[thisComp.width,thisComp.height];";
		rct.property("ADBE Vector Rect Position").expression = "[0,0];";
		rct.property("ADBE Vector Rect Roundness").expression = "0;";
		adjLayer.property("ADBE Transform Group").property("ADBE Anchor Point").expression = "[0,0];";
		adjLayer.property("ADBE Transform Group").property("ADBE Position").expression = "[thisComp.width/2, thisComp.height/2];";
		var fil = adjLayer.property("ADBE Root Vectors Group").addProperty("ADBE Vector Graphic - Fill");
		fil.name = "fill";
		fil.property("ADBE Vector Fill Color").setValue( [1,1,1] );
		adjLayer.adjustmentLayer = true;
		//--調整レイヤを作成作成終わり
	
		var eg = adjLayer.property("ADBE Effect Parade");
		var fx = eg.addProperty("ADBE Shift Channels");
		fx.property("ADBE Shift Channels-0001").setValue(9); // アルファを取り込むをアルファへ
		var fx = eg.addProperty("ADBE Color Key");
		fx.property("ADBE Color Key-0001").setValue([255/255,255/255,255/255,255/255]);//キーカラーを色に

		//OLM Smootherの追加
		//var fx = eg.addProperty("OLM Smoother");
		//PSOFT ANTI-ALIASINGの追加
		var fx = eg.addProperty("PSOFT ANTI-ALIASING");

	}
	//---------------------------------------------
	function layerValueChk(lyr)
	{
		var ret = "";
		var oAnc = lyr.property("ADBE Transform Group").property("ADBE Anchor Point");
		if ( oAnc.numKeys>1){
			ret += "[" + lyr.name +"] のアンカーポイントにキーが２以上あります\n";
		}
		var oPos = lyr.property("ADBE Transform Group").property("ADBE Position");
		if ( oPos.numKeys>1){
			ret += "[" + lyr.name +"] の位置にキーが２以上あります\n";
		}
		var oScl = lyr.property("ADBE Transform Group").property("ADBE Scale");
		if ( oPos.numKeys>1){
			ret += "[" + lyr.name +"] のスケールにキーが２以上あります\n";
		}else{
			var sx = oScl.value[0];
			var sy = oScl.value[1];
			if ( ( sx != 100)||(sy != 100)) {
				ret += "[" + lyr.name +"] のスケールが100%ではないです。\n";
			}
		}
		var oRot = lyr.property("ADBE Transform Group").property("ADBE Rotate Z");
		if ( oRot.numKeys>1){
			ret += "[" + lyr.name +"] のスケールにキーが２以上あります\n";
		}else{
			if ( oRot.value != 0) {
				ret += "[" + lyr.name +"] の回転が０ではないです。\n";
			}
		}
		return ret;
	}
	//---------------------------------------------
	function getTargets()
	{
		var ret = new Object;
		ret.enabled = false;
		ret.cmp = null;
		ret.lyrs = new Array;
		ret.numLayers = 0;
		
		if ( app.project.activeItem instanceof CompItem){
			ret.cmp = app.project.activeItem;
		}else{
			errMes += "コンポをアクティブにして、レイヤを選択してください。\n";
			return ret;
		}
		var cnt = ret.cmp.selectedLayers.length;
		if ( cnt>0) {
			for (var i=0; i<cnt; i++){
				var p = ret.cmp.selectedLayers[i];
				if ( p.threeDLayer == true){
					errMes += "[" + p.name + "]は、3Dレイヤには対応していません。\n";
					return ret;
				}
				if ( p.collapseTransformation == true){
					errMes += "[" + p.name + "]の、コラップストランスフォームはOFFにしてください\n";
					return ret;
				}
				//ステータスを調べる
				var er = layerValueChk(p);
				if ( er != "") {
					errMes += er;
					return ret;
				}else{
					//通常のレイヤのみ
					if ( (p.source instanceof CompItem)||(p.source instanceof FootageItem)){
						ret.lyrs.push(ret.cmp.selectedLayers[i]);
					}else{
						errMes += "[" + p.name + "]の、は対応していません\n";
						return ret;
					}
				}
			}
			ret.numLayers = ret.lyrs.length;
		}else{
			errMes += "レイヤを選択してください。\n";
			return ret;
		}
		ret.enabled = true;
		return ret;
	}
	//---------------------------------------------
	function getTrimgSize(lyr)
	{
		//初期値は全画面
		var x0 = 0;
		var y0 = 0;
		var x1 = lyr.width;
		var y1 = lyr.height;
		//F's GuideFrameを探す
		var fx = lyr.property("ADBE Effect Parade").property("F's GuideFrame");
		if ( fx != null) {
			//切り取り範囲を求める
			if ( fx.property("F's GuideFrame-0002").numKeys==0){
				var tl = fx.property("F's GuideFrame-0002").value;
			}else{
				var tl = fx.property("F's GuideFrame-0002").keyValue(1);
			}
			var x0 = Math.floor(tl[0]);
			var y0 = Math.floor(tl[1]);
			if ( fx.property("F's GuideFrame-0003").numKeys==0){
				var br = fx.property("F's GuideFrame-0003").value;
			}else{
				var br = fx.property("F's GuideFrame-0003").keyValue(1);
			}
			var x1 = Math.floor(br[0]);
			var y1 = Math.floor(br[1]);
		}else {
			var msk = lyr.property("ADBE Mask Parade");
			if (msk.numProperties>0){
				var ms = msk.property(1).property("ADBE Mask Shape");
				if ( ms.numKeys==0){
					var sp = ms.value;
				}else{
					var sp = ms.keyValue(1);;
				}
				var xMax = -9999999999;
				var yMax = -9999999999;
				var xMin = +9999999999;
				var yMin = +9999999999;
				if (sp.vertices.length>0){
					for ( var i=0; i<sp.vertices.length; i++){
						var p = sp.vertices[i];
						if ( xMin > p[0]) xMin = p[0];
						if ( xMax < p[0]) xMax = p[0];
						if ( yMin > p[1]) yMin = p[1];
						if ( yMax < p[1]) yMax = p[1];
					}
				}
				var x0 = Math.floor(xMin);
				var y0 = Math.floor(yMin);
				var x1 = Math.floor(xMax);
				var y1 = Math.floor(yMax);
			}
		}
		//範囲の確認
		if ( x0>x1) { var tmp = x0; x0 = x1; x1 = tmp;}
		if ( y0>y1) { var tmp = y0; y0 = y1; y1 = tmp;}
		if ( x0<0) x0=0; 
		if (x1>lyr.width) x1 = lyr.width;
		if ( y0<0) y0=0;
		if (y1>lyr.height) y1 = lyr.height;
		//大きさを求める。大きさは必ず偶数になるように調整
		var w = x1 - x0;
		if ( (w % 2) ==1 ) { 
			x1--; w--;
		}
		var h = y1 - y0;
		if ( (h % 2) ==1 ) {
			y1--; h--;
		 }
		var ret = new Object;
		ret.x0 = x0;
		ret.y0 = y0;
		ret.x1 = x1;
		ret.y1 = y1;
		ret.width = w;
		ret.height = h;
		return ret;
	}
	//---------------------------------------------
	function zero2(v)
	{
		if ( v==0) return "00";
		else if ( v<10) return "0" + v.toString();
		else return v.toString();
	}
	//---------------------------------------------
	//CompItemのサイズを偶数にする
	function compSizeToInt(cmp)
	{
		if ( cmp instanceof CompItem){
			if ( (cmp.width % 2) == 1 ) cmp.width -= 1;
			if ( (cmp.height % 2) == 1 ) cmp.height -= 1;
		}
	}
	//---------------------------------------------
	//Layerの位置・アンカーポイントを整数化
	function layerPosToInt(lyr)
	{
		function pointToInt(ary)
		{
			ary[0] = Math.floor(ary[0]);
			ary[1] = Math.floor(ary[1]);
			return ary;
		}
		if ( lyr instanceof AVLayer){
			var oAnc = lyr.property("ADBE Transform Group").property("ADBE Anchor Point");
			var oPos = lyr("ADBE Transform Group").property("ADBE Position");
			var oPosV = pointToInt(oPos.value);
			oAnc.setValue(pointToInt(oAnc.value));
			oPos.setValue(pointToInt(oPos.value));
		}
	}
	//---------------------------------------------
	//同じ名前のFolderItemがあったらそれをかえす
	function mkFolder(fld,nm)
	{
		var f = fld;
		if ( (f ==null)||((f instanceof FolderItem)==false)){
			f = app.project.rootFolder;
		}
		var ret = null;
		if (f.numItems>0){
			for ( var i=1; i<=f.numItems; i++){
				if ( f.item(i) instanceof FolderItem){
					if (f.item(i).name == nm){
						ret = f.item(i);
					}
				}
			}
		}
		if ( ret ==null){
			return f.items.addFolder(nm);
		}else{
			return ret;
		}
	}
	//---------------------------------------------
	function mkComp(fld,nm,w,h,a,d,fr)
	{
		function findComp(fld,nm)
		{
			var ret = false;
			if (f.numItems>0){
				for ( var i=1; i<=f.numItems; i++){
					if ( f.item(i) instanceof CompItem){
						if (f.item(i).name == nm){
							ret = true;
							break;
						}
					}
				}
			}
			return ret;
		}
		var f = fld;
		if ( (f ==null)||((f instanceof FolderItem)==false)){
			f = app.project.rootFolder;
		}
		var n = nm;
		while( findComp(f,n)==true){n += "+";}
		
		var cmp = f.items.addComp(n,w,h,a,d,fr);
		cmp.duration = d;
		return cmp;
	}
	//---------------------------------------------
	//function executeMain(tObj)
	this.executeMain = function(tObj)
	{
		if ( tObj.enabled == false) return;
		
		compSizeToInt(tObj.cmp);
		
		//パーツフォルダを作成
		var partsFolder = mkFolder(tObj.cmp.parentFolder, tObj.cmp.name + partsFolderFooter);
		
		//再合成用のコンポを作成
		var mixComp = mkComp(
			tObj.cmp.parentFolder,
			tObj.cmp.name + mixCompFooter,
			tObj.cmp.width,
			tObj.cmp.height,
			tObj.cmp.pixelAspect,
			tObj.cmp.duration,
			tObj.cmp.frameRate);
		
		//切り出し開始
		
		for ( var i=0; i<tObj.numLayers; i++)
		{
			var lyr = tObj.lyrs[i];

			layerPosToInt(lyr);
			
			var sz = getTrimgSize(lyr);

			//------------------------------------------------
			//レイヤごとのコンポを作成
			var d = 0;
			var setFlag = false;
			//Layerの種類に応じて秒数を変える
			if ( lyr.source instanceof CompItem){
				if ( lyr.timeRemapEnabled == true){
					d = tObj.cmp.duration;
					setFlag =true;
				}else{
					d = lyr.source.duration;
					setFlag =false;
				}
			}else if ( lyr.source instanceof FootageItem){
				if ( (lyr.timeRemapEnabled == true)||(lyr.source.file == "null")||(lyr.source.mainSource.isStill == true)){
					d = tObj.cmp.duration;
					setFlag =true;
				}else{
					d = lyr.source.duration;
					setFlag =false;
				}
			}
			var cmp = mkComp(
				partsFolder,
				zero2(lyr.index) +"_" + lyr.name,
				sz.width,
				sz.height,
				tObj.cmp.pixelAspect,
				d,
				tObj.cmp.frameRate
				);
			//------------------------------------------------
			//コンポに登録
			var nLayer = cmp.layers.add(lyr.source);
			//位置を補正
			var anc = nLayer.property("ADBE Transform Group").property("ADBE Anchor Point");
			var ancV = anc.value;
			ancV[0] = sz.x0 + sz.width/2;
			ancV[1] = sz.y0 + sz.height/2;
			anc.setValue(ancV);
			//------------------------------------------------
			//タイムリマップの移植
			if (setFlag == false) {
				nLayer.startTime =0;
				nLayer.inPoint = 0;
				nLayer.outPoint = lyr.source.duration;
			}else{
				nLayer.startTime =lyr.startTime;
				if ( lyr.timeRemapEnabled == true){
					var remap = lyr.property("ADBE Time Remapping");
					if ( remap.numKeys>0){
						nLayer.timeRemapEnabled = true;
						var nRemap = nLayer.property("ADBE Time Remapping");
						//余計なキーフレームを削除
						if (nRemap.numKeys>=2) {
							for (var i=nRemap.numKeys; i>=2; i--){
								nRemap.removeKey(i);
							}
						}
						//０のキーフレームを確認
						if ( (remap.keyTime(1)>0)&&(nRemap.keyTime(1)==0)){
							nRemap.setValueAtTime(remap.keyTime(1),remap.keyValue(1));
							nRemap.removeKey(1);
						}
						//キーを移植
						for ( var i=1; i<=remap.numKeys; i++){
							var o = new Object;
							o.time = remap.keyTime(i);
							o.value = remap.keyValue(i);
							o.keyInInterpolationType  = remap.keyInInterpolationType(i);
							o.keyOutInterpolationType  = remap.keyOutInterpolationType(i);
							
							nRemap.setValueAtTime(o.time,o.value);
							nRemap.setInterpolationTypeAtKey(i,o.keyInInterpolationType,o.keyOutInterpolationType);
						}
					}
				}
				//開始終わり位置を設定
				nLayer.inPoint = lyr.inPoint;
				nLayer.outPoint = lyr.outPoint;
			}
			//------------------------------------------------
			//パーツコンポへエフェクトをかける下準備
			//setEffects(cmp,nLayer);
			if ( this.setFunc != null)
				if (this.setFunc instanceof Function)
					this.setFunc(cmp,nLayer);
			//------------------------------------------------
			//次のコンポへ登録
			var n2Layer = mixComp.layers.add(cmp);
			n2Layer.moveToEnd();
			if (setFlag==false){
				n2Layer.startTime = lyr.startTime;
			}else{
				n2Layer.startTime = 0;
			}
			n2Layer.inPoint = lyr.inPoint;
			n2Layer.outPoint = lyr.outPoint;
			
			var oAnc = lyr.property("ADBE Transform Group").property("ADBE Anchor Point");
			var oPos = lyr.property("ADBE Transform Group").property("ADBE Position");
			var oAncV = oAnc.value;
			var oPosV = oPos.value;
			
			var nAnc = n2Layer.property("ADBE Transform Group").property("ADBE Anchor Point");
			var nPos = n2Layer.property("ADBE Transform Group").property("ADBE Position");
			
			var ax = oAncV[0] - sz.x0;
			var ay = oAncV[1] - sz.y0;
	
			nAnc.setValue([ax,ay]);
			nPos.setValue(oPosV);
			
			//アンカーを調整して位置を合わせてあるので、スケールはただコピーするだけ
			n2Layer.property("ADBE Transform Group").property("ADBE Scale").setValue(
				lyr.property("ADBE Transform Group").property("ADBE Scale").value
				);
		}

	}
	//---------------------------------------------
	this.run = function()
	{
		var targets = getTargets();
		if ( targets.enabled == true ){
			app.beginUndoGroup(scriptName);
			this.executeMain(targets);
			app.endUndoGroup();
		}
		return (errMes == "");
	}
	//---------------------------------------------
	this.dispErrMes = function()
	{
		if ( errMes != "") alert ( errMes );
	}
	//---------------------------------------------

}
var ctrm = new cellTriming();

/*
ctrm.setFunc = function(cmp,lyr)
{
}
って関数を上書きできる。

*/

if (ctrm.run()== false) ctrm.dispErrMes();
