//**********************************************************
function preComposeTriming()
{
	//エラーメッセージ
	var errMes = "";
	var scriptName = "preComposeTriming";

 	var isGuideFrame = false;
 	var isMaskPath = false;
 	var useGuideFrame = true;
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
			isMaskPath = (msk.numProperties>0);

			if ( (isGuideFrame==false) && ( isMaskPath==false) ){
				errMes += "マスクパスかF's GuideFrameで矩形を指定してください。\n";
				return ret;
			}else if ( (isGuideFrame==true) && ( isMaskPath==false) ){
				if ( (fx.property("F's GuideFrame-0002").numKeys>1)||(fx.property("F's GuideFrame-0003").numKeys>1)){
					errMes += "F's GuideFrameにキーフレームがあります。\n";
					return ret;
				}
				useGuideFrame = true;
			}else if ( (isGuideFrame==false) && ( isMaskPath==true) ){
				var mskS = msk.property(1).property("ADBE Mask Shape");
				if (mskS.numKeys>1) {
					errMes += "マスクパスにキーフレームがあります。\n";
					return ret;
				}
				useGuideFrame = false;
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
		ret.newName = ret.cmp.name + "_" + ret.lyr.name;

		ret.duration	= ret.cmp.duration;		//長さ
		ret.startTime	= ret.lyr.startTime;	//スタート
		ret.inPoint		= ret.lyr.inPoint;		//
		ret.outPoint	= ret.lyr.outPoint;		//
		
		return ret;
	}
	//---------------------------------------------
	function getShapeToRect(target)
	{
		var sp = target.lyr.property("ADBE Mask Parade").property(1).property("ADBE Mask Shape").value;
		var ret = new Object;
		ret.x0 =0;
		ret.y0 =0;
		ret.x1 =0;
		ret.y1 =0;
		if ( (sp==null)||(sp==undefined)) return ret;
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
	function getGuideFrameToRect(target)
	{
		var fx = target.lyr.property("ADBE Effect Parade").property("F's GuideFrame");
		var ret = new Object;
		ret.x0 =0;
		ret.y0 =0;
		ret.x1 =0;
		ret.y1 =0;
		if ( (fx==null)||(fx==undefined)) return ret;
		fx.enabled = false;
		//切り取り範囲を求める
		var tl = fx.property("F's GuideFrame-0002").value;
		ret.x0 = Math.floor(tl[0]);
		ret.y0 = Math.floor(tl[1]);
		var br = fx.property("F's GuideFrame-0003").value;
		ret.x1 = Math.floor(br[0]);
		ret.y1 = Math.floor(br[1]);
		if ( ret.x0>ret.x1) { var tmp = ret.x0; ret.x0 = ret.x1; ret.x1 = tmp;}
		if ( ret.y0>ret.y1) { var tmp = ret.y0; ret.y0 = ret.y1; ret.y1 = tmp;}
		return ret;
	
	}
	//---------------------------------------------
	//CompItemのサイズを偶数にする
	function compSizeToInt(target)
	{
		if ( target.cmp instanceof CompItem){
			if ( (target.cmp.width % 2) == 1 ) target.cmp.width -= 1;
			if ( (target.cmp.height % 2) == 1 ) target.cmp.height -= 1;
		}
	}
	//---------------------------------------------
	//Layerの位置・アンカーポイントを整数化
	function layerPosToInt(target)
	{
		function pointToInt(ary)
		{
			ary[0] = Math.floor(ary[0]);
			ary[1] = Math.floor(ary[1]);
			return ary;
		}
		if ( target.cmp.numLayers>0){
			for ( var i=1; i<=target.cmp.numLayers; i++){
				var lyr = target.cmp.layer(i);
				if ( lyr instanceof AVLayer){
					var oAnc = lyr.property("ADBE Transform Group").property("ADBE Anchor Point");
					var oPos = lyr("ADBE Transform Group").property("ADBE Position");
					var oPosV = pointToInt(oPos.value);
					oAnc.setValue(pointToInt(oAnc.value));
					oPos.setValue(pointToInt(oPos.value));
				}
			}
		}
	}
	//---------------------------------------------
	function executeMain(target)
	{
		if (( target.cmp instanceof CompItem)==false){
			errMes += "executeMain CompItem引数エラー\n";
			return;
		}
		else if (( target.lyr instanceof AVLayer)==false){
			errMes += "executeMain AVLayer引数エラー\n";
			return;
		}
		
		//compSizeToInt(target.cmp);
		//layerPosToInt(target.lyr);
		
		var prm = new Object;
		if (useGuideFrame == false){
			prm = getShapeToRect(target);
		}else{
			prm = getGuideFrameToRect(target);
		}
		prm.x0 = Math.floor(prm.x0/4) * 4;
		prm.y0 = Math.floor(prm.y0/4) * 4;
		prm.x1 = Math.floor(prm.x1/4 + 1) * 4;
		prm.y1 = Math.floor(prm.y1/4 + 1) * 4;
		
		//範囲の確認
		if ( prm.x0<0) prm.x0 = 0;
		if (prm.x1>target.lyr.width) prm.x1 = target.lyr.width;
		if ( prm.y0<0) prm.y0 = 0;
		if (prm.y1>target.lyr.height) prm.y1 = target.lyr.height;

		//大きさを求める。大きさは必ず偶数になるように調整
		var w = prm.x1 - prm.x0;
		var h = prm.y1 - prm.y0;
		if ( (w<=16)||(h<=16)) {
			errMes += "切り取り範囲が小さすぎる\n";
			return;
		}
		//コンポ作成
		var preCompCell =  target.cmp.parentFolder.items.addComp(
			target.newName,
			w,
			h,
			target.cmp.pixelAspect,
			target.cmp.duration,
			target.cmp.frameRate);
		preCompCell.duration = target.cmp.duration;
		//コンポに追加
		var nLayer = preCompCell.layers.add(target.lyr.source);
		
		//位置を修正
		var anc = nLayer.property("ADBE Transform Group").property("ADBE Anchor Point");
		var ancV = anc.value;
		ancV[0] = prm.x0 + w/2;
		ancV[1] = prm.y0 + h/2;
		anc.setValue(ancV);

		nLayer.startTime = target.startTime;
		//念のためRemapを移植
		if ( target.lyr.timeRemapEnabled == true){
			var remap = target.lyr.property("ADBE Time Remapping");
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
		nLayer.inPoint = target.lyr.inPoint;
		nLayer.outPoint = target.lyr.outPoint;
		
		//元のコンポに張りなおす
		var n2Layer = target.cmp.layers.add(preCompCell);
		n2Layer.startTime = 0;
		n2Layer.moveBefore(target.lyr);
		n2Layer.inPoint = target.lyr.inPoint;
		n2Layer.outPoint = target.lyr.outPoint;
		
		var oAnc = target.lyr.property("ADBE Transform Group").property("ADBE Anchor Point");
		var oPos = target.lyr("ADBE Transform Group").property("ADBE Position");
		var oAncV = oAnc.value;
		var oPosV = oPos.value;
		var nAnc = n2Layer.property("ADBE Transform Group").property("ADBE Anchor Point");
		var nPos = n2Layer.property("ADBE Transform Group").property("ADBE Position");

		var ax = oAncV[0] - prm.x0;
		var ay = oAncV[1] - prm.y0;

		nAnc.setValue([ax,ay]);
		nPos.setValue(oPosV);
		
		//アンカーを調整して位置を合わせてあるので、スケールはただコピーするだけ
		n2Layer.property("ADBE Transform Group").property("ADBE Scale").setValue(
			target.lyr.property("ADBE Transform Group").property("ADBE Scale").value
			);
			
		//全部無事に終わった。
	}
	//---------------------------------------------
	this.dispErrMes = function()
	{
		if ( errMes != "") alert ( errMes );
	}
	//---------------------------------------------
	////////////////////////////////////////////////////////////////////////////////////////////////
	this.showDialog = function()
	{
		errMes = "";
		var target = getTarget();
		if ( target.enabled == false ){
			this.dispErrMes();
			return;
		}
		//---------------
		var winObj = new Window("dialog", "プリコンポーズトリミング", [  88,  116,   88+ 337,  116+ 194]);
		
		var pnlNewCompName = winObj.add("panel", [   5,   12,    5+ 320,   12+  53], "新しく作るコンポ名");
		var tbNewCompName = pnlNewCompName.add("edittext", [   7,   18,    7+ 307,   18+  19], "", {readonly:false, multiline:false});
		var pnlFrame = winObj.add("panel", [   5,   71,    5+ 320,   71+  72], "フレーム指定");
		var rbGuideFrame = pnlFrame.add("radiobutton", [  21,   19,   21+ 131,   19+  16], "F's GuideFrameを使う");
		var rbMaskPath = pnlFrame.add("radiobutton", [  21,   41,   21+  96,   41+  16], "マスクパスを使う");
		var btnExec = winObj.add("button", [ 160,  149,  160+  73,  149+  33], "実行");
		var btnClose = winObj.add("button", [ 246,  149,  246+  73,  149+  33], "閉じる");

		//---------------
		tbNewCompName.text = target.newName;
		
		rbGuideFrame.enabled = isGuideFrame;
		rbMaskPath.enabled = isMaskPath;
		
		if ((isGuideFrame == true)&&(isMaskPath == false)){
			rbGuideFrame.value = true;
			rbMaskPath.value = false;
			useGuideFrame = true;
		}else if ((isGuideFrame == false)&&(isMaskPath == true)) {
			rbGuideFrame.value = false;
			rbMaskPath.value = true;
			useGuideFrame = false;
		}
		
		rbGuideFrame.onClick =
		rbMaskPath.onClick = function()
		{
			if ((isGuideFrame.enabled == true)&&(isGuideFrame.value == true)){
				useGuideFrame = true;
			} else if ((rbMaskPath.enabled == true)&&(rbMaskPath.value == true)){
				useGuideFrame = false;
			}
		}
		
		btnExec.run = this.run;
		btnExec.dispErrMes = this.dispErrMes;
		
		btnExec.onClick = function()
		{
			target.newName = tbNewCompName.text;
			if ( target.newName != ""){
				app.beginUndoGroup(scriptName);
				executeMain(target);
				app.endUndoGroup();
			}else{
				errMes += "コンポ名を入力してください\n";
			}
			winObj.close();
			this.dispErrMes();
		}
		btnClose.onClick = function()
		{
			winObj.close();
		}
		winObj.center(); 
		winObj.show();
	}
	////////////////////////////////////////////////////////////////////////////////////////////////

}
//**********************************************************


var preComposeTrimingDlg = new preComposeTriming();
preComposeTrimingDlg.showDialog();
