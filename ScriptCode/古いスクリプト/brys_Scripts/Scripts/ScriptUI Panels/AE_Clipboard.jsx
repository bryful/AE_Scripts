//*****************************************************************************
//-----------------------------------------------------------------------------
function AE_Clipboard(t)
{
	this.palette	= t;
	this.btnExec	= null;
	this.current	= Folder.current;
	this.CMD		= "AE_Clipboard.exe";
	//-------------------------------------------------
	//メニューパレットの作成
	this.buildPalette = function()
	{
		this.btnGet = this.palette.add("button",     [5,  5,5+120, 30],"クリップボード実行");
		this.btnGet.current = this.current;
		this.btnGet.CMD = this.CMD;
		this.btnGet.onClick = function()
		{
			var prevCurrentFolder = Folder.current;
			Folder.current = this.current;
			
			var f = new File(this.CMD);
			if ( f.exists == false) {
				alert(this.CMD+"が有りません。");
				Folder.current = prevCurrentFolder;
				return;
			}
			var lines = system.callSystem(this.CMD);
			Folder.current = prevCurrentFolder;
			
			//先頭が//JavaScriptなら、スクリプトとして実行する。
			if (lines.indexOf("//JavaScript") == 0) {
				eval(lines);
			}else{
				alert("クリップボードに有効なJavaScriptコードが有りません！");
			}

		}
		

	}
	//-----------------------------
	this.exec = function()
	{
		this.buildPalette();
	}
}
///----------------------------------------------------------------------------

var acp = new AE_Clipboard(this);
acp.exec();

