//---------------------------------------------------------------------------
//選択したコンポに何かする
//---------------------------------------------------------------------------
function foo(tComp)
{
	//何か
	return true;
}
//---------------------------------------------------------------------------
var selectedItems = app.project.selection;
if ( (selectedItems!=null)&&(selectedItems.length>0) ) {
	app.beginUndoGroup("何か");
	for (var i = 0; i < selectedItems.length; i++) {
		if (selectedItems[i] instanceof CompItem) {
			if (foo(selectedItems[i])==true) {
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
