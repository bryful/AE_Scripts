function timeJumpDlg(me)
{	//---------------
	this.winObj = ( me instanceof Panel) ? me : new Window("palette", "TimeJump", [132, 174, 132+149, 174+284]);

	this.tbInput = this.winObj.add("edittext", [12, 33, 12+94, 33+26], "1p13+3" );
	this.btn7 = this.winObj.add("button", [5, 64, 5+32, 64+32], "7");
	this.btn8 = this.winObj.add("button", [38, 64, 38+32, 64+32], "8");
	this.btn9 = this.winObj.add("button", [71, 64, 71+32, 64+32], "9");
	this.btn4 = this.winObj.add("button", [5, 97, 5+32, 97+32], "4");
	this.btn5 = this.winObj.add("button", [38, 97, 38+32, 97+32], "5");
	this.btn6 = this.winObj.add("button", [71, 97, 71+32, 97+32], "6");
	this.btn1 = this.winObj.add("button", [5, 129, 5+32, 129+32], "1");
	this.btn2 = this.winObj.add("button", [38, 129, 38+32, 129+32], "2");
	this.btn3 = this.winObj.add("button", [71, 129, 71+32, 129+32], "3");
	this.btn0 = this.winObj.add("button", [5, 162, 5+32, 162+32], "0");
	this.btnPage = this.winObj.add("button", [38, 162, 38+32, 162+32], "Pg");
	this.btnSec = this.winObj.add("button", [71, 162, 71+32, 162+32], "秒");
	this.btnClear = this.winObj.add("button", [108, 4, 108+37, 4+26], "CL");
	this.btnBS = this.winObj.add("button", [109, 34, 109+36, 34+26], "BS");
	this.btnGet = this.winObj.add("button", [109, 63, 109+36, 63+32], "Get");
	this.btnSet = this.winObj.add("button", [109, 96, 109+36, 96+53], "Set");
	this.btnPluss = this.winObj.add("button", [109, 155, 109+36, 155+32], "＋");
	this.btnMinus = this.winObj.add("button", [109, 188, 109+36, 188+32], "－");
	this.lbDisp = this.winObj.add("statictext", [1, 203, 1+26, 203+17], "disp" );
	this.cmbDisp = this.winObj.add("dropdownlist", [31, 200, 31+75, 200+20], ["時間","Frm","秒+Frm","P+Frm","P+秒+Frm" ] );
	this.lbFps = this.winObj.add("statictext", [8, 230, 8+27, 230+14], "FPS" );
	this.tbFps = this.winObj.add("edittext", [35, 226, 35+39, 226+22], "24" );
	this.lbPage = this.winObj.add("statictext", [2, 258, 2+34, 258+14], "Page" );
	this.tbPage = this.winObj.add("edittext", [35, 254, 35+39, 254+22], "144" );
	this.lbInput = this.winObj.add("statictext", [12, 4, 12+94, 4+26], "" );
	this.btnM0 = this.winObj.add("button", [76, 226, 76+68, 226+24], "push");
	this.btnM1 = this.winObj.add("button", [76, 254, 76+68, 254+24], "pops");


	this.tbInput.graphics.font = ScriptUI.newFont("Arial",ScriptUI.FontStyle.BOLD,18);
	this.lbInput.graphics.font = ScriptUI.newFont("Arial",ScriptUI.FontStyle.BOLD,18);


	//---------------
	//ボタンに命令コマンドを設定
	this.btn0.cmd = "0";
	this.btn1.cmd = "1";
	this.btn2.cmd = "2";
	this.btn3.cmd = "3";
	this.btn4.cmd = "4";
	this.btn5.cmd = "5";
	this.btn6.cmd = "6";
	this.btn7.cmd = "7";
	this.btn8.cmd = "8";
	this.btn9.cmd = "9";
	this.btnSet.cmd = "set";
	this.btnGet.cmd = "get";
	this.btnPluss.cmd = "pluss";
	this.btnMinus.cmd = "minus";
	this.btnSec.cmd = "sec";
	this.btnPage.cmd = "page";
	this.btnClear.cmd = "clear";
	this.btnBS.cmd = "bs";
	this.btnM0.cmd = "m0";
	this.btnM1.cmd = "m1";
	//---------------
	//ボタンを配列に
	this.btnArray = new Array;
	this.btnArray.push(this.btn0);
	this.btnArray.push(this.btn1);
	this.btnArray.push(this.btn2);
	this.btnArray.push(this.btn3);
	this.btnArray.push(this.btn4);
	this.btnArray.push(this.btn5);
	this.btnArray.push(this.btn6);
	this.btnArray.push(this.btn7);
	this.btnArray.push(this.btn8);
	this.btnArray.push(this.btn9);
	this.btnArray.push(this.btnSet);
	this.btnArray.push(this.btnGet);
	this.btnArray.push(this.btnPluss);
	this.btnArray.push(this.btnMinus);
	this.btnArray.push(this.btnSec);
	this.btnArray.push(this.btnPage);
	this.btnArray.push(this.btnClear);
	this.btnArray.push(this.btnBS);
	this.btnArray.push(this.btnM0);
	this.btnArray.push(this.btnM1);
	
	
	this.setMode = function(v)
	{
		var cnt = this.cmbDisp.items.length;
		
		for ( var i=0;i<cnt; i++) this.cmbDisp.items[i].selected = false;
		if ( v<0) return;
		if ( v<cnt)
			this.cmbDisp.items[v].selected = true;
	}
	this.getMode = function()
	{
		var cnt = this.cmbDisp.items.length;
		
		var ret = -1;
		for ( var i=0;i<cnt; i++) {
			if (this.cmbDisp.items[i].selected == true){
				ret = i;
				break;
			}
		}
		return ret;
	}
	//---------------
	if ( ( me instanceof Panel) == false){ this.winObj.center(); this.winObj.show(); }
}
//*****************************************************************************
/*
	時間を便利に扱うObject
*/
//*****************************************************************************
function jTime()
{
	//*************************************************************
	//明示的に数値と宣言
	var value = 0;
	var mode = 3;
	 /*
	 0"時間",
	 1"Frm",
	 2"秒+Frm",
	 3"P+Frm",
	 4"P+秒+Frm"
	 */
	//数値が負数かどうか
	var frameRate = 24;
	var page = 144;
	var startFrame = app.project.displayStartFrame;
	
	//*************************************************************
	function strToNum(s)
	{
		var v = 0;
		try
		{
			v = eval(s);
			return v;
		}catch(e){
			//alert("strToNum: "+e);
			return Number.NaN;
		}
	}
	//*************************************************************
	function chkStr(s)
	{
		var ret = "";
		if (s == "") return ret;
		for ( var i=0; i<s.length; i++){
			var c =  s.charAt(i);
			if ( (c>="0")&&( c<="9")) {ret += c;}
			else if ( (c==".")||(c=="+")||(c=="p") ) {ret += c;}
			else if ( i==0){
				if ( (c=="-")||(c=="－")||(c=="ー")){
					ret +="-";
				}
			}
			else
			{
				switch(c){
					case "０": c = "0";break;
					case "１": c = "1";break;
					case "２": c = "2";break;
					case "３": c = "3";break;
					case "４": c = "4";break;
					case "５": c = "5";break;
					case "６": c = "6";break;
					case "７": c = "7";break;
					case "８": c = "8";break;
					case "９": c = "9";break;
					case "。": c = ".";break;
					case "P": c = "p";break;
					case "ｐ": c = "p";break;
					case "Ｐ": c = "p";break;
					case "＋": c = "+";break;
					default:
						c = "";
						break;
				}
				ret +=c;
			}
		}
		return ret;
	}
	//*************************************************************
	function strToDur(s)
	{
		if (s.indexOf("+")>=0){
			var sa = s.split("+");
			var s = strToNum(sa[0]);
			var k = strToNum(sa[1]) - startFrame;
		
			return s + ( k / frameRate);
		}else if (s.indexOf(".")<0) {
			return ( strToNum(s)- startFrame) / frameRate;
		}else{
			return strToNum(s);
		}
	}
	//*************************************************************
	this.setValueStr = function(line)
	{
		var ret = 0;
		var _line = chkStr(line);
		if ( (_line == "")||(_line == "-")) {
			value = 0;
			return true;
		}
		//－対策
		var minus = 1;
		if (_line[0] == "-") {
			minus = -1;
			_line = _line.substr(1);
		}
		var lp = _line.split("p");

		if ( lp.length>2) return false;
		
		
		if (lp.length == 1){
			ret = strToDur(lp[0]);
		}else if (lp.length == 2){
			if ( (lp[0].indexOf("+")>=0)||(lp[0].indexOf(".")>=0) ) {
				return false;
			}
			var pg = 0;
			try{
				var pp = eval(lp[0]) -1;
				if ( pp<0) pp=0;
				pg =  pp * (page/frameRate);
			}catch(e){
				return false;
			}
			
			ret = pg + strToDur(lp[1]);
		}
		if ( isNaN(ret)==false){
			value = ret * minus;
			return true;
		}else{
			return false;
		}
	}
	//*************************************************************
	this.getValueStr = function()
	{
		var line ="";
		switch(mode)
		{
		case 0: 
			line = (value ) +"";
			if ( line.indexOf(".")<0) line +=".0";
			break;
		case 1:
			line = Math.round(value * frameRate) + startFrame;
			break;
		case 2:
			var frm = Math.round(value * frameRate);
			var s = Math.floor(frm / frameRate);
			var k = Math.round(frm % frameRate) + startFrame;
			line = s + "+" + k;
			break;
		case 3:
			var frm = Math.round(value * frameRate);
			var p = Math.floor(frm / page) + 1;
			var k = Math.round(frm % page) + startFrame;
			if ( p > 1){
				line = p + "p" + k;
			}else{
				line = k;
			}
			break;
		case 4:
			var frm = Math.round(value * frameRate);
			var p = Math.floor(frm / page) + 1;
			var s = Math.floor( (frm % page) / frameRate);
			var k = Math.round( (frm % page) % frameRate)+ startFrame;
			if ( p>1){
				line = p + "p" + s + "+" + k;
			}else{
				line = s + "+" + k;
			}
			break;
		}
		return line;
	}
	//*************************************************************
	this.setDuration = function(v)
	{
		if ( isNaN(v) ==false){
			value = v;
		}
	}
	//*************************************************************
	this.getDuration = function()
	{
		return value;
	}
	//*************************************************************
	this.setFrameRate = function(v)
	{
		if ( isNaN(v) ==false){
			frameRate = v;
		}
	}
	//*************************************************************
	this.getFrameRate = function()
	{
		return frameRate;
	}
	//*************************************************************
	this.setPage = function(v)
	{
		if ( isNaN(v) ==false){
			page = v;
		}
	}
	//*************************************************************
	this.getPage = function()
	{
		return page;
	}
	//*************************************************************
	this.getMode = function()
	{
		return mode;
	}
	//*************************************************************
	this.setMode = function(v)
	{
		if (v<=0) mode = 0;
		else if (v>=4) mode = 4;
		else mode = v;
	}
	//*************************************************************
	this.clear = function()
	{
		value = 0;
	}
	//*************************************************************
	this.getTime = function()
	{
		var ac = app.project.activeItem;
		if ( ac instanceof CompItem)
		{
			value = ac.time;
		}else{
			alert("コンポを選択してください。")
		}
	}
	//*************************************************************
	this.setTime = function()
	{
		var ac = app.project.activeItem;
		if ( ac instanceof CompItem)
		{
			var v = value;
			if ( ( v>=0)&&(v<ac.duration)) 
				if (ac.time != v)
					ac.time = v;
		}else{
			alert("コンポを選択してください。")
		}
	}
	//*************************************************************
	this.setTimePluss = function()
	{
		var ac = app.project.activeItem;
		if ( ac instanceof CompItem)
		{
			var v = ac.time + value;
			if ( ( v>=0)&&(v<ac.duration)) 
				if (ac.time != v)
					ac.time = v;
		}else{
			alert("コンポを選択してください。")
		}
	}
	//*************************************************************
	this.setTimeMinus = function()
	{
		var ac = app.project.activeItem;
		if ( ac instanceof CompItem)
		{
			var v = ac.time - value;
			if ( ( v>=0)&&(v<ac.duration)) 
				if (ac.time != v)
					ac.time = v;
		}else{
			alert("コンポを選択してください。")
		}
	}
}
///////////////////////////////////////////////////////////////////////////////
function timeJump(me)
{
	var dlg = new timeJumpDlg(me);
	var jt = new jTime();
	var dt = new jTime();
	jt.setDuration(0);
	jt.setFrameRate(24);
	jt.setPage(144);
	dlg.tbInput.text = jt.getValueStr();
	dlg.setMode(jt.getMode());
	var dt = new jTime();
	dt.setDuration(0);
	dt.setFrameRate(24);
	dt.setPage(144);
	dt.setMode(jt.getMode());
	var m0 = new jTime();
	m0.setDuration(0);
	m0.setFrameRate(24);
	m0.setPage(144);
	m0.setMode(jt.getMode());

	//*****************************************
	function getFpsPage()
	{
		var fps = 24;
		var page = 144;
		var s = dlg.tbFps.text;
		if ( s == "" ) { fps = 24;}
		else{
			try
			{
				fps = eval(s);
			}catch(e){
				fps = 24;
			}
		}
		jt.setFrameRate(fps);
		dlg.tbFps.text = fps +"";
		var s = dlg.tbPage.text;
		if ( s == "" ) { page = 144;}
		else{
			try
			{
				page = Math.round(eval(s));
			}catch(e){
				page = 144;
			}
		}
		jt.setPage(page);
		dlg.tbPage.text = page +"";
		
		dt.setFrameRate(fps);
		dt.setPage(page);
		m0.setFrameRate(fps);
		m0.setPage(page);
	}
	getFpsPage();
	//*****************************************
	function clear()
	{
		jt.clear();
		dlg.tbInput.text = "";
	}
	//*****************************************
	function backSpace()
	{
		if ( dlg.tbInput.text == "") return;
		var l = dlg.tbInput.text.length;
		if ( l==1) {
			dlg.tbInput.text = "";
		}else{
			dlg.tbInput.text = dlg.tbInput.text.substr(0,l - 1);
		}
	}
	//*****************************************
	function pageAdd()
	{
		if ( (dlg.tbInput.text.indexOf("p")<0)&&(dlg.tbInput.text.indexOf("+")<0)&&(dlg.tbInput.text.indexOf(".")<0) ){
			var mode = jt.getMode();
			switch(mode)
			{
			case 3: 
			case 4: 
				dlg.tbInput.text += "p";
				break;
			}
		}
	}
	//*****************************************
	function secAdd()
	{
		if ( (dlg.tbInput.text.indexOf("+")<0)&&(dlg.tbInput.text.indexOf(".")<0) ){
			var mode = jt.getMode();
			switch(mode)
			{
			case 0: 
				if (dlg.tbInput.text == "") dlg.tbInput.text = "0";
				dlg.tbInput.text += ".";
				break;
			case 2: 
			case 4: 
				if (dlg.tbInput.text == "") dlg.tbInput.text = "0";
				dlg.tbInput.text += "+";
				break;
			}
		}
	}
	
	//*****************************************
	function inputBtn()
	{
		var cmd = this.cmd;
		if (( cmd>="0")&&(cmd<="9")){
			dlg.tbInput.text += cmd;
		}else{
			switch (cmd)
			{
			case "bs" : backSpace();break;
			case "clear" : clear();break;
			case "page": pageAdd();break;
			case "sec" : secAdd();break;
			case "get" :
				jt.getTime();
				dt.getTime();
				dlg.tbInput.text = jt.getValueStr();
				dlg.lbInput.text = dt.getValueStr();
				break;
			case "set" :
				jt.setValueStr(dlg.tbInput.text);
				jt.setTime();
				dt.getTime();
				dlg.lbInput.text = dt.getValueStr();
				break;
			case "pluss" :
				jt.setValueStr(dlg.tbInput.text);
				jt.setTimePluss();
				dt.getTime();
				dlg.lbInput.text = dt.getValueStr();
				break;
			case "minus" :
				jt.setValueStr(dlg.tbInput.text);
				jt.setTimeMinus();
				dt.getTime();
				dlg.lbInput.text = dt.getValueStr();
				break;
			case "m0" :
				m0.getTime();
				dlg.btnM1.text = m0.getValueStr();
				break;
			case "m1" :
				m0.setTime();
				dt.getTime();
				dlg.lbInput.text = dt.getValueStr();
				break;
			}
		}
		
	}
	//*****************************************
	function changeMode()
	{
		var dMode = dlg.getMode();
		var jMode = jt.getMode();
		if ( jMode != dMode){
			if (jMode == 0) {
				if ( (dlg.tbInput.text.indexOf(".")<0)&&(dlg.tbInput.text.indexOf("+")<0)){
					dlg.tbInput.text += ".0";
				}
			}
			jt.setValueStr(dlg.tbInput.text);
			jt.setMode(dMode);
			dt.setMode(dMode);
			m0.setMode(dMode);
			dlg.tbInput.text = jt.getValueStr();
			dlg.lbInput.text = dt.getValueStr();
			dlg.btnM1.text = m0.getValueStr();
		}
	}
	//*****************************************
	for ( var i=0; i<dlg.btnArray.length; i++){ dlg.btnArray[i].onClick = inputBtn;}
	dlg.cmbDisp.onChange = changeMode;
	//*****************************************
	
}

var tm_ = new timeJump(this);

