//-----------------------------------------------------------------------------
function inputDialog(){
	this.title ="インプットダイアログ";
	
	this.value1;
	this.value2;
	this.value1Caption	 ="1:";
	this.value2Caption	 ="2:";
	
	//エディットテキストを変数にしてtextを得る
	this.valueEdit1;
	this.valueEdit2;

	//-------------------------------------------------
	this.getValue = function()
	{
		this.value1 = this.valueEdit1.text;
		this.value2 = this.valueEdit2.text;
		return true;
	}
	//-------------------------------------------------
	this.buildAndShowDialog = function ()
	{	
		// build the dialog
		var x01 = 10;
		var x02 = x01+80;
		var x03 = x02+10;
		var x04 = x03+80;
		
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
		
		var dlg_w = x04+x01;
		var dlg_h = y06+y01;
		var dlg_l = 200;
		var dlg_t = 200;
		
		var my_dialog = new Window("dialog",this.title);

		my_dialog.bounds = [dlg_l,dlg_t,dlg_l+dlg_w,dlg_t+dlg_h];
		//center()で画面中央に表示
		my_dialog.center();
		
		var p =3;
		var st1=					my_dialog.add("statictext", [ x01, y01+p, x02, y02+p], this.value1Caption);
		this.valueEdit1=	my_dialog.add("edittext"  , [ x03, y01,   x04, y02], this.value1);
		var st2=				my_dialog.add("statictext",   [ x01, y03+p, x02, y04+p], this.value1Caption);
		this.valueEdit2=	my_dialog.add("edittext"  , [ x03, y03,   x04, y04], this.value2);

		var okBtn    		= my_dialog.add("button",			[ xx01, y05, xx02, y06], "OK",     {name:'ok'} );
		var cancelBtn		= my_dialog.add("button",			[ xx03, y05, xx04, y06], "Cancel", {name:'cancel'});
		
		//statictextで右あわせ
		st1.justify="right";
		st2.justify="right";
		
		return my_dialog.show();
	}
	//-----------------------------------
	this.execute =function()
	{
		while (true){
			var r=this.buildAndShowDialog();
			//showの戻り値が１ならOKボタンが押された
			if (r==1){
				if (this.getValue()==true){
					//this.getValue()がfalseを返せば、またダイアログが表示される。
					return true;
				}
			}else{
				return false;
			}
		}
	}
}
//-----------------------------------------------------------------------------
// 
// The main script.
//
var w = new inputDialog;
w.title="シンプルダイアログ";
w.value1Caption = "第１引数";
w.value1="aaa";
w.value2Caption = "第２引数";
w.value2="bbb";

if (w.execute()==true){
	alert(	w.value1Caption+":"+w.value1+"\n"+
					w.value2Caption+":"+w.value2+"\n");
}else{
	alert("Cancelされました");
}
