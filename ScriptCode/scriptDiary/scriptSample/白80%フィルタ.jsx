var filterLayer = null;

//---------------------------------------------------------------------------
//選択したコンポに何かする
//---------------------------------------------------------------------------
function filterW(tComp)
{
			if (filterLayer==null) {
				var adjLayer = dstComp.layers.addSolid([1,1,1],"白80%フィルタ", tComp.width, tComp.height, tComp.pixelAspect,tComp.duration);
				filterLayer = adjLayer.source;
			}else{
				var adjLayer = dstComp.layers.add(filterLayer);
			}

	adjLayer.adjustmentLayer = true;
	return adjLayer;

}
//---------------------------------------------------------------------------
var selectedItems = app.project.selection;
if ( (selectedItems!=null)&&(selectedItems.length>0) ) {
	app.beginUndoGroup("白80%フィルタ");
	for (var i = 0; i < selectedItems.length; i++) {
		if (selectedItems[i] instanceof CompItem) {
			if (filterW(selectedItems[i])==true) {
			}else{
				//エラー処理
			}
		}
	}
	app.endUndoGroup();
}else{
	//エラー処理
}
//---------------------------------------------------------------------------
