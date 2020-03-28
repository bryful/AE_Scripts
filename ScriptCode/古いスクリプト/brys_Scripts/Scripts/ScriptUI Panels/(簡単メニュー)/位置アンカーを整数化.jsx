//---------------------------------------------------------------------------
// 位置アンカーを整数化 v1.00 2006/06/24
//
// 画像ファイルが奇数のものをコンポに登録すると、アンカーと位置が小数になってしまいます。
// これは結構気になるので、それを整数に直すもの
// 他のスクリプトで相当前に作ってあったものを抜き出して単独使用できるようにしたもの
//---------------------------------------------------------------------------

var activeComp = app.project.activeItem;
if ( (activeComp!=null)&&(activeComp instanceof CompItem) ) {
	app.beginUndoGroup("位置アンカーを整数化");
	var selectedLayers = activeComp.selectedLayers;
	if ( (selectedLayers!=null)&&(selectedLayers.length>0) ) {
		for (var i = 0; i < selectedLayers.length; i++) {
			var curLayer = selectedLayers[i];
			//位置とアンカーポイントを整数値に
			var pos=curLayer.property("Position").value;
			pos[0] = Math.floor(pos[0]);
			pos[1] = Math.floor(pos[1]);
			curLayer.property("Position").setValue(pos);
			var Anc=curLayer.property("Anchor Point").value;
			Anc[0] = Math.floor(Anc[0]);
			Anc[1] = Math.floor(Anc[1]);
			curLayer.property("Anchor Point").setValue(Anc);
		//} else {
			//エラー処理
		}
	}
	app.endUndoGroup();
}else{
	alert("レイヤを選択してください。\n"+
				"複数選択可です。");
}
