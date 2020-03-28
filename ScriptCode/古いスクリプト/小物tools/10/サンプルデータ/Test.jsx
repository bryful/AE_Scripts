(function (me){
	var img1File = new File("imag1.png");
	var IconButtonFile = new File("iconb.png");
	var lstAry = ["リストボックス","です","だ"];
	var dlistAry = ["ドロップダウン","です",];

	var winObj = ( me instanceof Panel) ? me : new Window("palette", "ダイアログデザイン", [ 100, 100, 700, 400 ] );

	var img1 = winObj.add("image", [9, 11, 75, 291], img1File);
	var statictext1 = winObj.add("statictext", [86, 11, 198, 31], "テキストだ");
	var pnl = winObj.add("panel", [87, 38, 306, 211], "パネルだ");
	var ed1 = pnl.add("edittext", [25, 22, 195, 46], "エディとだ");
	var cb1 = pnl.add("checkbox", [25, 62, 195, 86], "ちぇクボックスだ");
	var cb2 = pnl.add("checkbox", [25, 105, 195, 129], "ちぇクボックスだ２");
	var btn1 = pnl.add("button", [61, 138, 195, 160], "ボタン");
	var IconButton = winObj.add("iconbutton", [96, 222, 201, 289], IconButtonFile);
	var group1 = winObj.add("group", [321, 41, 452, 209]);
	var rb1 = group1.add("radiobutton", [13, 27, 122, 52], "ラジオボタン１");
	var rb2 = group1.add("radiobutton", [13, 59, 122, 84], "ラジオボタン２");
	var rb3 = group1.add("radiobutton", [13, 92, 122, 117], "ラジオボタン３");
	var lst = winObj.add("listbox", [459, 35, 582, 230], lstAry);
	var dlist = winObj.add("dropdownlist", [451, 241, 584, 266], dlistAry);
	var btn2 = winObj.add("button", [452, 272, 586, 294], "ボタン2");
	var prog1 = winObj.add("progressbar", [220, 226, 420, 255]);
	var scrollbar1 = winObj.add("scrollbar", [219, 260, 350, 284]);
	var slider1 = winObj.add("slider", [346, 11, 578, 31]);

	btn2.onClick = function(){
		alert("a");
	}
	if ( ( me instanceof Panel) == false){
		winObj.center();
		winObj.show();
	}
})(this);
