//**********************************************************
function preCompoCells()
{
	//エラーメッセージ
	var errMes = "";
	var scriptName = "preCompoCells";

	// trueならマスクパスがターゲット、falseにするとF's GuideFrame.aex
	//ただ状態を調べてある方を使う。だから両方あった時のみ有効
	var isUseMask = false; 
 
 	var isGuideFrame = false;
 	var isMask = false;
	//---------------------------------------------
	function getTarget()
	{
		var ret = new Object;
		ret.enabled = false;
		ret.cmp = null;
		ret.lyr = null;
		
		if ( app.project.activeItem instanceof CompItem){
			ret.cmp = app.project.activeItem;
		}else{
			errMes += "コンポをアクティブにして、レイヤを選択してください。\n";
			return ret;
		}
		if ( ret.cmp.selectedLayers.length==1) {
			var p = ret.cmp.selectedLayers[0].source;
			if ( ( p ==null)||( p ==undefined)){
				errMes += "普通のレイヤのみ対応です。\n";
				return ret;
			}
			//F's GuideFrameを使ってるか確認
			var fx = ret.cmp.selectedLayers[0].property("ADBE Effect Parade").property("F's GuideFrame");
			isGuideFrame = ( fx != null);
			
			//Maskを使ってるか確認
			var msk = ret.cmp.selectedLayers[0].property("ADBE Mask Parade");
			isMask = (msk.numProperties>0);

			if ( (isGuideFrame==false) && ( isMask==false) ){
				errMes += "マスクパスかF's GuideFrameで矩形を指定してください。\n";
				return ret;
			}else if ( (isGuideFrame==true) && ( isMask==false) ){
				if ( (fx.property("F's GuideFrame-0002").numKeys>1)||(fx.property("F's GuideFrame-0003").numKeys>1)){
					errMes += "F's GuideFrameにキーフレームがあります。\n";
					return ret;
				}
				isUseMask = false;
			}else if ( (isGuideFrame==false) && ( isMask==true) ){
				var mskS = msk.property(1).property("ADBE Mask Shape");
				if (mskS.numKeys>1) {
					errMes += "マスクパスにキーフレームがあります。\n";
					return ret;
				}
				isUseMask = true;
			}
			var p = ret.cmp.selectedLayers[0];
			if ( p.threeDLayer == true){
				errMes += "3Dレイヤには対応していません。\n";
				return ret;
			}
			if ( p.collapseTransformation == true){
				errMes += "コラップストランスフォームはOFFにしてください\n";
				return ret;
			}
			
			if ( 
				(p.property("ADBE Transform Group").property("ADBE Anchor Point").numKeys>1)||
				(p.property("ADBE Transform Group").property("ADBE Scale").numKeys>1)||
				(p.property("ADBE Transform Group").property("ADBE Position").numKeys>1)||
				(p.property("ADBE Transform Group").property("ADBE Rotate Z").numKeys>1)
				){
				errMes += "キーフレームがあります。\n";
				return ret;
			}
			if ( p.property("ADBE Transform Group").property("ADBE Rotate Z").value !=0){
				errMes += "回転の数値が０じゃない\n";
				return ret;
			}
			ret.lyr = ret.cmp.selectedLayers[0];
		}else{
			errMes += "レイヤは一つだけ選択してください。\n";
			return ret;
		}
		ret.enabled = true;
		return ret;
	}
	//---------------------------------------------
	function getShapeToRect(sp)
	{
		var ret = new Object;
		ret.x0 =0;
		ret.y0 =0;
		ret.x1 =0;
		ret.y1 =0;
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
		ret.x0 = Math.floor(xMin);
		ret.y0 = Math.floor(yMin);
		ret.x1 = Math.floor(xMax);
		ret.y1 = Math.floor(yMax);
		return ret;
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
	function executeMain(cmp,lyr)
	{
		if (( cmp instanceof CompItem)==false){
			errMes += "executeMain CompItem引数エラー\n";
			return;
		}
		else if (( lyr instanceof AVLayer)==false){
			errMes += "executeMain AVLayer引数エラー\n";
			return;
		}
		
		compSizeToInt(cmp);
		layerPosToInt(lyr);
		
		//F's GuideFrameを探す
		var x0 = 0;
		var y0 = 0;
		var x1 = 0;
		var y1 = 0;
		if (isUseMask == true){
			var ms = getShapeToRect(lyr.property("ADBE Mask Parade").property(1).property("ADBE Mask Shape").value);
			x0 = ms.x0;
			y0 = ms.y0;
			x1 = ms.x1;
			y1 = ms.y1;
		}else{
			var fx = lyr.property("ADBE Effect Parade").property("F's GuideFrame");
			fx.enabled = false;
			//if ( fx == null) return;
			//切り取り範囲を求める
			var tl = fx.property("F's GuideFrame-0002").value;
			x0 = Math.floor(tl[0]);
			y0 = Math.floor(tl[1]);
			var br = fx.property("F's GuideFrame-0003").value;
			x1 = Math.floor(br[0]);
			y1 = Math.floor(br[1]);
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
		if ( (w % 2) ==1 ) { x1++; w++;}
		var h = y1 - y0;
		if ( (h % 2) ==1 ) { y1++; h++;}
		if ( (w<=16)||(h<=16)) {
			errMes += "切り取り範囲が小さすぎる\n";
			return;
		}
		//コンポ作成
		var d = 0;
		if ( lyr.source instanceof CompItem){
			d = cmp.duration;
		}else if ( (lyr.source.file == "null")||(lyr.source.mainSource.isStill == true)){
			d = cmp.frameDuration;
		}else{
			d = cmp.duration;
		}
		var preCompCell =  cmp.parentFolder.items.addComp(
			cmp.name +"_"+ lyr.name,
			w,
			h,
			cmp.pixelAspect,
			d,
			cmp.frameRate);
		preCompCell.duration = d;
		//コンポに追加
		var nLayer = preCompCell.layers.add(lyr.source);
		
		//位置を修正
		var anc = nLayer.property("ADBE Transform Group").property("ADBE Anchor Point");
		var ancV = anc.value;
		ancV[0] = x0 + w/2;
		ancV[1] = y0 + h/2;
		anc.setValue(ancV);

		nLayer.startTime = lyr.startTime;
		//念のためRemapを移植
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
		
		//元のコンポに張りなおす
		var n2Layer = cmp.layers.add(preCompCell);
		n2Layer.startTime = 0;
		n2Layer.moveBefore(lyr);
		n2Layer.inPoint = lyr.inPoint;
		n2Layer.outPoint = lyr.outPoint;
		
		var oAnc = lyr.property("ADBE Transform Group").property("ADBE Anchor Point");
		var oPos = lyr("ADBE Transform Group").property("ADBE Position");
		var oAncV = oAnc.value;
		var oPosV = oPos.value;
		var nAnc = n2Layer.property("ADBE Transform Group").property("ADBE Anchor Point");
		var nPos = n2Layer.property("ADBE Transform Group").property("ADBE Position");

		var ax = oAncV[0] - x0;
		var ay = oAncV[1] - y0;

		nAnc.setValue([ax,ay]);
		nPos.setValue(oPosV);
		
		//アンカーを調整して位置を合わせてあるので、スケールはただコピーするだけ
		n2Layer.property("ADBE Transform Group").property("ADBE Scale").setValue(
			lyr.property("ADBE Transform Group").property("ADBE Scale").value
			);
			
		//全部無事に終わった。
	}
	//---------------------------------------------
	this.run = function()
	{
		var target = getTarget();
		if ( target.enabled == true ){
			app.beginUndoGroup(scriptName);
			executeMain(target.cmp,target.lyr);
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
//**********************************************************


var pcc = new preCompoCells();
if (pcc.run()== false) pcc.dispErrMes();
