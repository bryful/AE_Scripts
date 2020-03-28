function showPropertyKind()
{

	function propertyKind(p)
	{
		var ret = "";
		try{
			ret += p.name + "("+ p.matchName +") kind:";
		}catch(e){
			ret += p.name + " kind:";
		}
		
		if ( p instanceof Application) { ret += " Application";}
		if ( p instanceof Project) { ret += " Project";}
		if ( p instanceof Settings) { ret += " Settings";}
		if ( p instanceof System) { ret += " System";}

		if ( p instanceof File) { ret += " File";}
		if ( p instanceof Folder) { ret += " Folder";}
		if ( p instanceof FolderItem) { ret += " FolderItem";}
		if ( p instanceof FileSource) { ret += " FileSource";}
		if ( p instanceof FootageItem) { ret += " FootageItem";}
		//if ( p instanceof FootageSource) { ret += " FootageSource";}
		if ( p instanceof PlaceholderSource) { ret += " PlaceholderSource";}
		if ( p instanceof SolidSource) { ret += " SolidSource";}


		//if ( p instanceof Item) { ret += " Item";}
		if ( p instanceof ItemCollection) { ret += " ItemCollection";}

		//if ( p instanceof AVItem) { ret += " AVItem";}

		if ( p instanceof AVLayer) { ret += " AVLayer";}
		if ( p instanceof Layer) { ret += " Layer";}
		if ( p instanceof CameraLayer) { ret += " CameraLayer";}
		if ( p instanceof LightLayer) { ret += " LightLayer";}
		if ( p instanceof LayerCollection) { ret += " LayerCollection";}
		if ( p instanceof ShapeLayer) { ret += " ShapeLayer";}
		if ( p instanceof TextLayer) { ret += " TextLayer";}

		if ( p instanceof CompItem) { ret += " CompItem";}


		if ( p instanceof KeyframeEase) { ret += " KeyframeEase";}
		if ( p instanceof MarkerValue) { ret += " MarkerValue";}

		if ( p instanceof RenderQueue) { ret += " RenderQueue";}
		if ( p instanceof RenderQueueItem) { ret += " RenderQueueItem";}
		if ( p instanceof RQItemCollection) { ret += " RQItemCollection";}
		if ( p instanceof OMCollection) { ret += " OMCollection";}
		if ( p instanceof OutputModule) { ret += " OutputModule";}


		if ( p instanceof Shape) { ret += " Shape";}

		if ( p instanceof Property) { ret += " Property";}
		
		
		if ( p instanceof PropertyBase) { ret += " PropertyBase";}
		if ( p instanceof PropertyGroup) { ret += " PropertyGroup";}
		if ( p instanceof MaskPropertyGroup) { ret += " MaskPropertyGroup";}
		if ( p instanceof TextDocument) { ret += " TextDocument";}
		
		if ( p instanceof Array) { ret += " Array";}
		if ( typeof(p)=="number") { ret += " Number";}
		if ( typeof(p)=="string") { ret += " String";}
		if ( typeof(p)=="boolean") { ret += " Boolaen";}
		
		return ret;
	}

	//作成したコードを収納する
	var codeList = "";
	//アクティブなアイテムを得る
	var ac = app.project.activeItem;
	
	
	if (ac != null){
		codeList += "activeItem\r\n";
		codeList += propertyKind(ac) + "\r\n";
		codeList += "\r\n";
		
		if ( ac instanceof CompItem)
		{
			var sel = ac.selectedLayers;
			var cnt = ac.selectedLayers.length
			if ( cnt>0){
				codeList += "SelectedLayers\r\n";
				for (var i = 0; i < cnt; i++)
				{
					codeList += propertyKind(sel[i]) + "\r\n";
				}
				codeList += "\r\n";
			}
			var prA = ac.selectedProperties;
			var cnt = ac.selectedProperties.length
			if ( cnt>0){
				codeList += "selectedProperties\r\n";
				for (var i = 0; i < cnt; i++)
				{
					codeList += propertyKind(prA[i]) + "\r\n";
				}
				codeList += "\r\n";
			}
		}
	}else{
		if ( app.project.selection.length>0){
			codeList += "project.selection\r\n";
			for (var i = 0; i < app.project.selection.length; i++)
			{
				codeList += propertyKind(app.project.selection[i]) + "\r\n";
			}
			codeList += "\r\n";
		}
	}
	if ( codeList == ""){
		codeList = "レイヤーのプロパティを何か選択してくださいまし。";
	}
	//---------------
	//ダイアログを作成して表示。
	//カット＆ペーストしやすいようにedittextに表示
	this.winObj = new Window("dialog", "Propertyへのアクセス", [154, 203, 154+1024, 203+400]);
	this.gb1 = this.winObj.add("panel", [10, 10, 10+1004, 10+350], "After Effects Properties" );
	this.tbProp = this.gb1.add("edittext", [10, 20, 10+984, 20+320], codeList,{multiline: true,readonly:true } );
	this.btnOK = this.winObj.add("button", [850, 365, 850+98, 365+23], "OK", {name:'ok'});
	//this.label1 = this.winObj.add("statictext", [26, 224, 26+300, 224+12], "item/layerのindexは、状況によって変化するから注意すること" );
	this.winObj.center();

	//フォントを大きく
	var fnt = this.tbProp.graphics.font;
	this.tbProp.graphics.font = ScriptUI.newFont (fnt.name, ScriptUI.FontStyle.BOLD, fnt.size * 1.5);

	//---------------
	this.show = function()
	{
		return this.winObj.show();
	}
	//---------------
}
var dlg = new showPropertyKind;
dlg.show();

