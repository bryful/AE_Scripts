//---------------------------------------------------------------------------
//選択したフッテージにに何かする
//---------------------------------------------------------------------------
function foo(tFtg)
{
	//何か
	return true;
}
//---------------------------------------------------------------------------
var selectedItems = app.project.selection;
if ( (selectedItems!=null)&&(selectedItems.length>0) ) {
	app.beginUndoGroup("何か");
	for (var i = 0; i < selectedItems.length; i++) {
		if (selectedItems[i] instanceof FootageItem) {
			if (foo(selectedItems[i])) {
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
