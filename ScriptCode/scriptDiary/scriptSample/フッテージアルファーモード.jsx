//---------------------------------------------------------------------------
//選択したフッテージにに何かする
//---------------------------------------------------------------------------
/*
AlphaMode.IGNORE
AlphaMode.STRAIGHT
AlphaMode.PREMULTIPLIED
*/
function setAlphaMode(tFtg)
{
	if (tFtg.mainSource.hasAlpha==true){
		tFtg.mainSource.alphaMode = AlphaMode.STRAIGHT;
	}
}
//---------------------------------------------------------------------------
var selectedItems = app.project.selection;
if ( (selectedItems!=null)&&(selectedItems.length>0) ) {
	app.beginUndoGroup("フッテージアルファーモード");
	for (var i = 0; i < selectedItems.length; i++) {
		if (selectedItems[i] instanceof FootageItem) {
			setAlphaMode(selectedItems[i]);
		}
	}
	app.endUndoGroup();
}else{
	//エラー処理
}
//---------------------------------------------------------------------------
