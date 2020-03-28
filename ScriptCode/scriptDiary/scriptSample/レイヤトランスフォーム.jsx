//---------------------------------------------------------------------------
//選択したレイヤのトランスフォームを変更
//---------------------------------------------------------------------------
//---------------------------------------------------------------------------
function layerParam(tLayer)
{
	//setValueで値を入力。
	//キーフレームの値はsetValueAtTime(time, newValue)か、setValueAtKey(keyIndex, newValue)を使う。
	//アンカーポイント
	tLayer.property("Anchor Point").setValue([100,100]);
	//位置
	tLayer.property("Position").setValue([100,100]);
	//スケール
	tLayer.property("Scale").setValue([50,40]);
	//回転
	tLayer.property("Rotation").setValue(90);
	//不透明度
	tLayer.property("Opacity").setValue(50);
	
	//こっちの書き方でもOK
	/*
	tLayer.anchorPoint.setValue([100,100]);
	tLayer.position.setValue([100,100]);
	tLayer.scale.setValue([50,50]);
	tLayer.rotation.setValue(90);
	tLayer.opacity.setValue(50);
	*/
}
//---------------------------------------------------------------------------
var activeComp=app.project.activeItem;
if((activeComp!=null)&&(activeComp instanceof CompItem)){
	
	var selectedLayers=activeComp.selectedLayers;

	if((selectedLayers!=null)&&(selectedLayers.length>0)){
		app.beginUndoGroup("選択したレイヤに何かする");
		for(var i=0;i<selectedLayers.length;i++){
			if(layerParam(selectedLayers[i])==false){
				//エラー処理
			}else{
			}
		}
	app.endUndoGroup();
	}else{
		//エラー処理
	}
}else{
	//エラー処理
}
//---------------------------------------------------------------------------

