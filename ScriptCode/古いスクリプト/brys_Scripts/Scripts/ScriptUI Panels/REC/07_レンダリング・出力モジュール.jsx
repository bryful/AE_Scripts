//--------------------------------------------------------
// レンダーキューの設定を一括指定
// 
//--------------------------------------------------------

function renderAndOutputSetting()
{
	var dialog			= null;
	var title			= "レンダリング・出力モジュール";
	var prefName			= title + ".pref";

	var renderIndex			= -1;
	var omIndex		= -1;

	var r_templates		= new Array;
	var om_templates	= new Array;

	//----------------------------------------------------
	var interHeight		= 1;
	var rbHeight		= 20;
	//----------------------------------------------------
	
	this.errMes	="";
	
	//----------------------------------------------------
	function prefSave()
	{
		var text_file = new File(prefName);
		text_file.open("w","TEXT","????"); 
		text_file.encoding = "UTF-8";
		text_file.writeln(prefName);
		text_file.writeln(renderIndex);
		text_file.writeln(omIndex);
		text_file.close();
	}
	//----------------------------------------------------
	function prefLoad()
	{
		
		var text_file = new File(prefName);
		if (text_file.exists ==true){
			text_file.open("r","TEXT","????"); 
			text_file.encoding = "UTF-8";
			var s = text_file.readln();
			if (s != prefName){
				return;
			}
			var s = text_file.readln();
			if ( (s!="")&&(s!="undefined") ){
				renderIndex = parseInt(s);
				if ((renderIndex>=r_templates.length) ){ renderIndex=-1;}
			}
			var s = text_file.readln();
			if ( (s!="")&&(s!="undefined") ){
				omIndex = parseInt(s);
				if ( (omIndex>=om_templates.length) ){ omIndex=-1;}
			}

			text_file.close();
		}

	}
	//----------------------------------------------------
	function templatesChk()
	{
		r_templates = app.project.renderQueue.item(1).templates;
		om_templates= app.project.renderQueue.item(1).outputModule(1).templates;

		if (r_templates.length>0){
			var list = [];
			for (var i=0 ; i< r_templates.length;i++){
				if (r_templates[i].indexOf("_HIDDEN")<0 ){
					list.push(r_templates[i]);
				}
			}
			r_templates=list;
		}
		if (om_templates.length>0){
			var list = [];
			for (var i=0 ; i< om_templates.length;i++){
				if (om_templates[i].indexOf("_HIDDEN")<0 ){
					list.push(om_templates[i]);
				}
			}
			om_templates=list;
		}
	}
	//----------------------------------------------------
	function calcPanelHeight()
	{
		var cnt = r_templates.length
		if (cnt< om_templates.length) { cnt = om_templates.length; }
		if (cnt<0) {cnt=0;}
		cnt++;
		return (interHeight + rbHeight) * cnt +20;
	}
	//----------------------------------------------------
	function buildAndShowDialog()
	{
		var pLeft	= 15;
		var pTop	= 15;
		var pWidth	= 250;
		
		var btnW	= 100;
		var btnH	= 24;
		
		var dWidth = (pWidth + pLeft) * 2 + 5;
		var pH = calcPanelHeight();
		var dHeight = pH + (pTop *2) + 5 + btnH;
		
		dialog = new Window("dialog",title);
		dialog.bounds = [0, 0, dWidth, dHeight];
		dialog.center();

		var x0,y0,x1,y1;
		x0 = pLeft;
		x1 = x0 + pWidth;
		y0 = pTop;
		y1 = y0 + pH;
		var pl1	= dialog.add("panel", [ x0, y0, x1, y1], "レンダリング設定");
		x0 = x1 + 5;
		x1 = x0 + pWidth;
		var pl2	= dialog.add("panel", [ x0, y0, x1, y1], "出力モジュール設定");

	
		if (r_templates.length>0){
			x0 = 5;
			x1 = pWidth - 10;
			y0 = 5;
			y1 = y0 + rbHeight;
			var rb = pl1.add("radiobutton", [x0,y0,x1,y1],"設定しない");
			if ( renderIndex<0 ) { rb.value= true;}
			rb.onClick = function(){ renderIndex = -1; }
			rb.id = -1;
			for (var i=0 ; i < r_templates.length ; i++){
				y0 += rbHeight + interHeight;
				y1 = y0 + rbHeight;
				var rb = pl1.add("radiobutton", [x0,y0,x1,y1],r_templates[i]);
				if ( i==renderIndex ) { rb.value= true;}
				rb.id = i;
				rb.onClick =  function(){ renderIndex = this.id; }
			}
		}
		if (om_templates.length>0){
			x0 = 5;
			x1 = pWidth - 10;
			y0 = 5;
			y1 = y0 + rbHeight;
			var rb = pl2.add("radiobutton", [x0,y0,x1,y1],"設定しない");
			if (omIndex<0) { rb.value= true;}
			rb.onClick = function(){ omIndex = -1; }
			rb.id = -1;
			for (var i=0 ; i < om_templates.length ; i++){
				y0 += rbHeight + interHeight;
				y1 = y0 + rbHeight;
				var rb = pl2.add("radiobutton", [x0,y0,x1,y1], om_templates[i]);
				if (i==omIndex) { rb.value= true;}
				rb.onClick =  function(){ omIndex = this.id; }
				rb.id = i;
			}
		}
		y0 = pTop + pH + 5;
		y1 = y0 + btnH;
		x0 = dWidth - ( btnW *2 + pLeft +15);
		x1 = x0 + btnW;
		var okBtn    	= dialog.add("button", [x0,y0,x1,y1], "実行",     {name:'ok'} );
		x0 += btnW +5;
		x1 = x0 + btnW;
		var cancelBtn	= dialog.add("button", [x0,y0,x1,y1], "やめる", {name:'cancel'});
		
		return dialog.show();
	}
	//----------------------------------------------------
	function settingTemplate()
	{
		if (app.project.renderQueue.numItems<=0){
			return false;
		}
		if ((renderIndex<0)&&(omIndex<0) ){
			return true;
		}
		for (var i = 1; i <= app.project.renderQueue.numItems; i++) {
			var curItem = app.project.renderQueue.item(i);
			if ( (curItem.status == RQItemStatus.QUEUED)||(curItem.status == RQItemStatus.NEEDS_OUTPUT) ) {
				if (renderIndex>=0) { curItem.applyTemplate(r_templates[renderIndex]); }
				for (var j = 1; j <= curItem.numOutputModules; j++) {
					if (omIndex>=0) { 
						curItem.outputModule(j).applyTemplate(om_templates[omIndex]);
					}
				}
			}
		}
		return true;
	}
	//----------------------------------------------------
	this.execute = function ()
	{
		var result =false;
		if (app.project.renderQueue.numItems<=0){
			this.errMes="レンダーキューに何も登録されていません！";
			return result;
		}

		templatesChk();
		prefLoad();
		var r = buildAndShowDialog();
		if (r==1){
			settingTemplate();
			result =true;
		}
		prefSave();
		return result;
	}
}

//----------------------------------------------------
// Main Script
var w =new renderAndOutputSetting;
if (w.execute()==true){
	//alert("設定完了！");
}else{
	if (w.errMes!="") alert(w.errMes);
}
//----------------------------------------------------
