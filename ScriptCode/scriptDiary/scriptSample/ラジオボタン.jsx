function radioBtnDialog()
{
	this.title = "ラジオボタン"
	this.caption1 ="1:";
	this.caption2 ="2:";
	this.caption3 ="3:";
	this.btnIndex	=1;
	this.dialog;

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
		
		var dlg_w = x02+x01;
		var dlg_h = y08+y01;
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
		
		switch(this.btnIndex){
			case 1:rb1.value =true; break;
			case 2:rb2.value =true; break;
			case 3:rb3.value =true; break;
		}

		var okBtn    	= this.dialog.add("button", [ xx01, y07, xx02, y08], "OK",     {name:'ok'} );
		var cancelBtn	= this.dialog.add("button", [ xx03, y07, xx04, y08], "Cancel", {name:'cancel'});
		
		return this.dialog.show();
	}
	this.execute =function()
	{
		while(true){
			var r=this.buildAndShowDialog();
			if (r==1){
				this.btnIndex=this.dialog.btnIndex;
				return true;
			}else{
				return false;
			}
	}
		return true;
	}
	//**************************************************************************
}// end of radioBtnDialog

var rbd = new radioBtnDialog;
rbd.title="選択";
rbd.caption1 = "その１";
rbd.caption2 = "その２";
rbd.caption3 = "その３";
rbd.btnIndex = 1;
if (rbd.execute()==true){
	alert("ボタン"+rbd.btnIndex+"が選ばれました");
}else{
	alert("キャンセル");
}
