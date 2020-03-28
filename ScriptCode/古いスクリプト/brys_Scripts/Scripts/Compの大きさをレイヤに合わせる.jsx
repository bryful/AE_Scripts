//---------------------------------------------------------------------------
//Compの大きさをレイヤに合わせる.jsx
//透過光処理の基本コンポのサイズをセルサイズに合わせるために作成
//---------------------------------------------------------------------------

function ajustCompsizeFromLayer(tComp){

	var ly = tComp.layers;

	if((ly!=null)&&(ly.length>0)){
		//レイヤのサイズを求める。一応一番大きい物で
		var w = 0;
		var h = 0;
		for ( var i=1 ; i<=ly.length;i++){
			var ww = ly[i].width;
			var hh = ly[i].height;
			if (ww>w) w = ww;
			if (hh>h) h = hh;
		}
		
		//コンポの大きさを合わせる
		tComp.width = w;
		tComp.height = h;
		
		var cX = Math.floor(w / 2);
		var cY = Math.floor(h /2);
		
		for ( var i=1 ; i<=ly.length;i++){
			var l = ly[i];
			l.property("Anchor Point").setValue([Math.floor(l.width /2) ,Math.floor(l.height /2)]);
			l.property("Position").setValue([cX,cY]);
		}
	}else{
		errMes +=  "Comp[ " + tComp.name + " ]にはレイヤが無いですぅ♪\n"
		return false;
	}
	return true;
}
//---------------------------------------------------------------------------
var selectedItems = app.project.selection;
if ( (selectedItems!=null)&&(selectedItems.length>0) ) {
	app.beginUndoGroup("Compの大きさをレイヤに合わせる");
	var errMes = "";
	var cnt = 0;
	for (var i = 0; i < selectedItems.length; i++) {
		if (selectedItems[i] instanceof CompItem) {
			if (ajustCompsizeFromLayer(selectedItems[i])==true) {
				cnt++;
			}
		}
	}
	if (cnt==0){
		alert("コンポが無いっす");
	}else{
		if (errMes!=""){
			alert(errMes);
		}else{
			alert(cnt +"個のコンポを修正しました")
		}
	}
	app.endUndoGroup();
}else{
	alert("コンポが選択されてないですぅ㍗");
}

