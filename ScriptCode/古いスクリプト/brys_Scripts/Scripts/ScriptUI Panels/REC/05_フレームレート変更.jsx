//(function(){
	
	function radioBtnDialog()
	{
		this.title = "フレームレートの変更"
		this.caption1 ="23.976 fps";
		this.caption2 ="29.97 fps";
		this.caption3 ="24 fps";
		this.caption4 ="30 fps";
		this.btnIndex	=1;
		this.dialog = null;
		this.frameRate = 23.976;
	
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
			
			var dlg_w = x02+x01;
			var dlg_h = y10+y01;
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
			
			switch(this.btnIndex){
				case 1:rb1.value =true; break;
				case 2:rb2.value =true; break;
				case 3:rb3.value =true; break;
				case 4:rb4.value =true; break;
			}
	
	
			var okBtn    	= this.dialog.add("button", [ xx01, y09, xx02, y10], "OK",     {name:'ok'} );
			var cancelBtn	= this.dialog.add("button", [ xx03, y09, xx04, y10], "Cancel", {name:'cancel'});
			
			return this.dialog.show();
		}
		this.execute =function()
		{
			while(true){
				var r=this.buildAndShowDialog();
				if (r==1){
					this.btnIndex=this.dialog.btnIndex;
					switch(this.btnIndex){
						case 1:this.frameRate = 23.976; break;
						case 2:this.frameRate = 29.97; break;
						case 3:this.frameRate = 24; break;
						case 4:this.frameRate = 30; break;
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
	function frameRateChange(target,fr)
	{
		//何か
		if (target instanceof FootageItem){
		 	target.mainSource.conformFrameRate = fr;
		}else if (target instanceof CompItem) {
			target.frameDuration = 1 / fr;
		}else {
			//何もしない
		}
		return true;
	}
	//---------------------------------------------------------------------------
	var selectedItems = app.project.selection;
	if ( (selectedItems!=null)&&(selectedItems.length>0) ) {
		var rbd = new radioBtnDialog;
		if (rbd.execute()==true){
			app.beginUndoGroup("フレームレート変更");
			var fr = rbd.frameRate;
			for (var i = 0; i < selectedItems.length; i++) {
					frameRateChange(selectedItems[i],fr);
			}
			app.endUndoGroup();
		}else{
			alert("キャンセル");
		}
	}else{
		//エラー処理
	}
	//---------------------------------------------------------------------------
//}();
