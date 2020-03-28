(function (me){
	var img1File = new File("./imag1.png");
	var IconButtonFile = new File("./iconbutton.png");
	var lstAry = ["リストボックス","です","だ"];
	var dlistAry = ["ドロップダウン","です",];

	var winObj = ( me instanceof Panel) ? me : new Window("palette", "Test", [ 100, 100, 700, 400 ] );

	var img1 = winObj.add("image", [9, 11, 75, 291], img1File);
	var statictext1 = winObj.add("statictext", [86, 11, 198, 31], "テキスト");
	var pnl = winObj.add("panel", [87, 38, 306, 211], "パネル");
	var ed1 = pnl.add("edittext", [26, 54, 196, 78], "テキストエディット");
	var cb1 = pnl.add("checkbox", [26, 94, 196, 118], "チェックボックス1");
	var cb2 = pnl.add("checkbox", [26, 137, 196, 161], "チェックボックス2");
	var btn1 = pnl.add("button", [25, 14, 125, 46], "ボタン1");
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

	btn2.onClick = function() { alert("btn2");}

	if ( ( me instanceof Panel) == false){
		winObj.center();
		winObj.show();
	}
})(this);
