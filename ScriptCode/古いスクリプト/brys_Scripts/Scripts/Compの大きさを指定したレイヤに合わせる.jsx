//---------------------------------------------------------------------------
//Compの大きさをレイヤに合わせる.jsx
//透過光処理の基本コンポのサイズをセルサイズに合わせるために作成
//---------------------------------------------------------------------------
//---------------------------------------------------------------------------
var activeComp = app.project.activeItem;
if ( (activeComp!=null)&&(activeComp instanceof CompItem) ) {
	var selectedLayers = activeComp.selectedLayers;
	if ( (selectedLayers!=null)&&(selectedLayers.length>0) ){
		app.beginUndoGroup("Compの大きさを指定したレイヤに合わせる");

		//選択したレイヤの大きさを調べる
		var w =0;
		var h =0;
		for (var i = 0; i < selectedLayers.length; i++) {
			var ww =selectedLayers[i].width;
			var hh =selectedLayers[i].height;
			if (ww>w) w = ww;
			if (hh>h) h = hh;
		}
		activeComp.width = w;
		activeComp.height = h;
		//レイヤの位置調整
		var cX = Math.floor(w / 2);
		var cY = Math.floor(h /2);
		
		for ( var i=0 ; i<selectedLayers.length;i++){
			var l = selectedLayers[i];
			l.property("Anchor Point").setValue([Math.floor(l.width /2) ,Math.floor(l.height /2)]);
			l.property("Position").setValue([cX,cY]);
		}
	app.endUndoGroup();
	}else{
		alert("レイヤが選択されていません。");
	}
}else{
	alert("何も選択されていません。");
}

