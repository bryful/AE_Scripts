//---------------------------------------------------------------------------
//選択したコンポに調整レイヤを作成
//---------------------------------------------------------------------------
function createAdjLayer(tComp)
{
	var adjLayer = tComp.layers.addSolid([1,1,1],"調整レイヤ", tComp.width, tComp.height, tComp.pixelAspect,tComp.duration);
	//sourceプロパティでフッテージを獲得できる
	// var solidFtg = adjLayer.source;
	adjLayer.adjustmentLayer = true;
	return adjLayer;

}
//---------------------------------------------------------------------------
var selectedItems = app.project.selection;
if ( (selectedItems!=null)&&(selectedItems.length>0) ) {
	app.beginUndoGroup("何か");
	for (var i = 0; i < selectedItems.length; i++) {
		if (selectedItems[i] instanceof CompItem) {
			var al =createAdjLayer(selectedItems[i]);
		}
	}
	app.endUndoGroup();
}else{
	//エラー処理
}
//---------------------------------------------------------------------------
