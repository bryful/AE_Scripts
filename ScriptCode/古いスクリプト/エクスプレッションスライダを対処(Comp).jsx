(function (me)
{
	var counter = 0;
	var srcWord = "\"スライダ\"";
	var srcWordB = "\"スライダー\"";
	var dstWord = "\"ADBE Slider Control-0001\"";
	var srcWord2 = ".param(" + dstWord + ")";
	var dstWord2 = "(" + dstWord + ")";
	//---------------------------------------------------------------------------
	//選択したコンポに何かする
	//---------------------------------------------------------------------------
	function sliderForgetPro(pro)
	{
		if ( pro instanceof Property) {
			if ( (pro.canSetExpression == true)&&(pro.expression != "")){
				var s = "";
				if ( pro.expression.indexOf(srcWordB)>=0) {
					s = pro.expression + "";
					s = s.split(srcWordB).join(dstWord);
				}else if ( pro.expression.indexOf(srcWord)>=0) {
					s = pro.expression + "";
					s = s.split(srcWord).join(dstWord);
				}
				if ( s != ""){
					if ( s.indexOf(srcWord2)>=0) {
						s = s.split(srcWord2).join(dstWord2);
					}
					pro.expression = s;
					pro.expressionEnabled = true;
					counter++;
				}
			}
		}else if ( (pro instanceof PropertyGroup)||(pro instanceof MaskPropertyGroup) ){
			if ( pro.numProperties>0){
				for (var i=1; i<=pro.numProperties; i++){
					sliderForgetPro(pro.property(i));
				}
			}
		}
	
		return true;
	}
	//---------------------------------------------------------------------------
	//選択したコンポに何かする
	//---------------------------------------------------------------------------
	function sliderForget(tComp)
	{
		if ( tComp.numLayers>0){
			for ( var i=1; i<=tComp.numLayers;i++){
				var lyr = tComp.layer(i);
				if (lyr.numProperties>0) {
					for ( var j=1; j<=lyr.numProperties;j++){
						sliderForgetPro(lyr.property(j));
					}
				}
			}
		}
		return true;
	}
	//---------------------------------------------------------------------------
	var selectedItems = app.project.selection;
	if ( (selectedItems!=null)&&(selectedItems.length>0) ) {
		app.beginUndoGroup("スライダを対処");
		counter = 0;
		for (var i = 0; i < selectedItems.length; i++) {
			if (selectedItems[i] instanceof CompItem) {
				if (sliderForget(selectedItems[i])==true) {
				}
			}
		}
		app.endUndoGroup();
		alert( counter +"箇所の「スライダ」を対処しました。");
	}else{
		//エラー処理
	}
	//---------------------------------------------------------------------------
})(this);
