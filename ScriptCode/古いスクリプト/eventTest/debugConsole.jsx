function debugConsoleObj()
{
	var count = 0;
	var con	= new Window("palette","debugConsole",[0,0,600,600],{ resizeable:true });
	var btnCls		= con.add("button",[0,0,150,30],"CLS");
	var ed			= con.add("edittext",[0,30,600,600],"",{multiline:true});
	
	this.cls = function () { 
		count = 0;
		ed.text = "";
	}
	this.getText = function(s){ return ed.text;}
	this.addText = function(s){ ed.text = ed.text +"\n" + s;}
	this.insertText = function(s){ ed.text = s + "\n" +ed.text;}
	this.disp = function(s){ ed.text = "\n---  "+ count + "---\n"  + s +  ed.text;count++;}
	
	btnCls.onClick = function() {
		count = 0;
		ed.text = "";
	}
	con.onResize = function() {
		var b1 = ed.bounds;
		var b = con.bounds;
		b1[0] = 0;
		b1[1] =30;
		b1[2] = b[2]-b[0];
		b1[3] = b[3]-b[1];
		ed.bounds = b1;
	}

	this.show = function()
	{
		con.center();
		con.show();
	}
}
debugConsole = new debugConsoleObj;
debugConsole.show();

