function radioBtnDialog()
{
	this.title = "アスペクト比の変更"
	this.caption1 ="1.0";
	this.caption2 ="0.91";
	this.caption3 ="0.9";
	this.caption4 ="1.2";
	this.caption5 ="1.21";
	this.btnIndex	=1;
	this.dialog;
	this.aspect = 1;

	//------------------------------------------------------------
	this.clickRB = function ()
	{
		this.parent.btnIndex = this.id;
	}
	//------------------------------------------------------------
	this.buildAndShowDialog = function ()
	{	
		// build the dialog
		var x01 = 20;
		var x02 = x01+180;
		
		var xx01 =50;
		var xx02 =xx01+60;
		var xx03 =xx02+5;
		var xx04 =xx03+60;

		var y01 = 10;
		var y02 = y01+20;
		var y03 = y02+5;
		var y04 = y03+20;
		var y05 = y04+5;
		var y06 = y05+20;
		var y07 = y06+5;
		var y08 = y07+20;
		var y09 = y08+5;
		var y10 = y09+20;
		var y11 = y10+5;
		var y12 = y11+20;
		
		var dlg_w = x02+x01;
		var dlg_h = y12+y01;
		var dlg_l = 100;
		var dlg_t = 100;
		
		this.dialog = new Window("dialog",this.title);
		this.dialog.bounds = [dlg_l,dlg_t,dlg_l+dlg_w,dlg_t+dlg_h];
		this.dialog.btnIndex=this.btnIndex;
		this.dialog.center();
		

		var rb1		=	this.dialog.add("radiobutton", [ x01, y01, x02, y02],this.caption1);
		rb1.id=1;
		rb1.onClick = this.clickRB;
		var rb2	=	this.dialog.add("radiobutton"  , [ x01, y03, x02, y04],this.caption2);
		rb2.id=2;
		rb2.onClick = this.clickRB;
		var rb3	= this.dialog.add("radiobutton"  , [ x01, y05, x02, y06],this.caption3);
		rb3.id=3;
		rb3.onClick = this.clickRB;
		var rb4	= this.dialog.add("radiobutton"  , [ x01, y07, x02, y08],this.caption4);
		rb4.id=4;
		rb4.onClick = this.clickRB;
		var rb5	= this.dialog.add("radiobutton"  , [ x01, y09, x02, y10],this.caption5);
		rb5.id=5;
		rb5.onClick = this.clickRB;
		
		switch(this.btnIndex){
			case 1:rb1.value =true; break;
			case 2:rb2.value =true; break;
			case 3:rb3.value =true; break;
			case 4:rb4.value =true; break;
			case 5:rb5.value =true; break;
		}


		var okBtn    	= this.dialog.add("button", [ xx01, y11, xx02, y12], "OK",     {name:'ok'} );
		var cancelBtn	= this.dialog.add("button", [ xx03, y11, xx04, y12], "Cancel", {name:'cancel'});
		
		return this.dialog.show();
	}
	this.execute =function()
	{
		while(true){
			var r=this.buildAndShowDialog();
			if (r==1){
				this.btnIndex=this.dialog.btnIndex;
				switch(this.btnIndex){
					case 1:this.aspect = 1.0; break;
					case 2:this.aspect = 0.91; break;
					case 3:this.aspect = 0.9; break;
					case 4:this.aspect = 1.2; break;
					case 5:this.aspect = 1.21; break;
				}
				return true;
			}else{
				return false;
			}
	}
		return true;
	}
	//**************************************************************************
}// end of radioBtnDialog

//---------------------------------------------------------------------------
//選択したフッテージにに何かする
//---------------------------------------------------------------------------
function aspectChange(tFtg,ap)
{
	//何か
	if ( (tFtg instanceof FootageItem)||(tFtg instanceof CompItem ) ){
 		if (ap==0.9) {
 			tFtg.pixelAspect = 9/10 -0.0092
 		}else{
 			tFtg.pixelAspect = ap;
 		}
 	}else{
 		//何もしない
 	}
	return true;
}
//---------------------------------------------------------------------------
var selectedItems = app.project.selection;
if ( (selectedItems!=null)&&(selectedItems.length>0) ) {
	var rbd = new radioBtnDialog;
	
	var def = selectedItems[0].pixelAspect;
	if (def!=null) {
		if (def == 1.0) {
			rbd.btnIndex =1;
		}else if (def == 0.91){
			rbd.btnIndex =2;
		}else if (def == 0.9){
			rbd.btnIndex =3;
		}else if (def == 1.2){
			rbd.btnIndex =4;
		}else if (def == 1.21){
			rbd.btnIndex =5;
		}
	}
	if (rbd.execute()==true){
		app.beginUndoGroup("アスペクト比変更");
		var ap = rbd.aspect;
		for (var i = 0; i < selectedItems.length; i++) {
			if (aspectChange(selectedItems[i],ap)) {
			}else{
				//エラー処理
			}
		}
		app.endUndoGroup();
	}else{
		alert("キャンセル");
	}
}else{
	//エラー処理
}
//---------------------------------------------------------------------------
