function tragetResize()
{
	var outWidth	= 1920;
	var outHeight	= 1080;
	
	var compArray = new Array;
	//----------------------------------------
	function getComps()
	{
		compArray = new Array;
		var cnt = app.project.selection.length;
		if ( cnt > 0) {
			for ( var i=0; i<cnt; i++){
				if (app.project.selection[i] instanceof CompItem) {
					compArray.push(app.project.selection[i]);
				}
			}
		}
		return (compArray.length>0);
	}
	//----------------------------------------
	function resizeCmp(cmp)
	{
	
		if ( (cmp.width == outWidth)&&(cmp.height == outHeight) ){
		}else{
			cmp.width = outWidth;
			cmp.height = outHeight;
		}
		
		if ( cmp.numLayers > 0){
			for ( var i=1; i<=cmp.numLayers; i++){
				var lyr = cmp.layer(i);
				//まずアンカーポイント
				var ancX = Math.floor(lyr.width /2);
				var ancY = Math.floor(lyr.height /2);
				lyr.property("Anchor Point").setValue([ancX,ancY]);
				var posX = Math.floor(cmp.width /2);
				var posY = Math.floor(cmp.height /2);
				lyr.property("Position").setValue([posX,posY]);
				
				var s = ( outHeight / lyr.height) *100;
				lyr.property("Scale").setValue([s,s]);
			}
		}
	}
	//----------------------------------------
	
	this.exec = function()
	{
		if (getComps() == true){
			app.beginUndoGroup("コンポレイヤのリサイズ");
			for ( var i=0; i<compArray.length; i++){
				resizeCmp(compArray[i]);
			}
			app.endUndoGroup();
		}else{
			alert("コンポが選択されていません");
		}
	}
}
var tr = new tragetResize();
tr.exec()
