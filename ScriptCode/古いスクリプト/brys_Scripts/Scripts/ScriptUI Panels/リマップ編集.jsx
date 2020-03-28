
(function (me)
{
	//各種変数
	var frameRate	= 24;		//フレームレート
	var pageCount	= 144;		//１ページのフレーム数
	
	var remapMode	= 0;		//リマップの空セルの処理を指定。現在は未使用。
	
	//セル番号の配列。総フレーム数はこの配列のlengthから獲得
	var cellNumber = new Array;
	var cellNumberBak = new Array;
	//コピー＆ペースト用の配列
	var copyBuf = new Array;

	//パレットサイズ
	var palWidth = 200;
	var palHeight =170;

	//選択範囲
	//選択範囲は範囲外を許可する
	var selectedStart = -1;
	var selectedLength = 0;


	var enterON	= false;
	var undoON	= false;
	var selectedStartBak = -1;
	var selectedLengthBak = 0;
	
	/////////////////////////////////////////////////////////////////////////
	//セル番号の配列を初期化
	function initCellNumber(v)
	{
		cellNumber = new Array;
		cellNumberBak = new Array;
		for ( var i=0; i<v; i++) { 
			cellNumber.push(0);
			cellNumberBak.push(0);
		}
	}
	//-------------------------------------------------------------------------
	initCellNumber(72);	//ここで初期状態のフレーム数を決定
	//-------------------------------------------------------------------------
	//フレーム数の変更
	function setFrameSize(v)
	{
		var cnt = cellNumber.length;
		if ( cnt == v) return;

		var ary = new Array;
		for ( var i=0; i<cnt; i++) ary.push(cellNumber[i]);
		cellNumber = new Array();
		if (v<cnt){
			for ( var i=0; i<v; i++) cellNumber.push(ary[i]);
		}else{
			for ( var i=0; i<cnt; i++) cellNumber.push(ary[i]);
			for ( var i=cnt; i<v; i++) cellNumber.push(0);
		}

	}
	/////////////////////////////////////////////////////////////////////////
	function saveCellNumber()
	{
		var fn = new File($.fileName.substring(0,$.fileName.lastIndexOf("."))+".bakup");
		var flag = fn.open("w");
		if (flag == false) return;
		try{
			var sv = new Object;
			sv.header		= "remapEdit";
			sv.cellNumber	= cellNumber;
			sv.frameRate	= frameRate;
			str = sv.toSource();
			fn.write(str);
		}catch(e){
		}finally{
			fn.close();
		}
	}
	/////////////////////////////////////////////////////////////////////////
	function loadCellNumber()
	{
		var fn = new File($.fileName.substring(0,$.fileName.lastIndexOf("."))+".bakup");
		if ( fn.exists == false) return;
		var flag = fn.open("r");
		if (flag == false) return;
		try{
			var str = fn.read();
			var ld = eval(str);
			if ( ( ld.header ==undefined)||(ld.header !="remapEdit")){
				initCellNumber(72);
				frameRate =24;
			}else{
				frameRate = ld.frameRate;
				cellNumber = new Array;
				for(var i=0; i<ld.cellNumber.length; i++) cellNumber.push(ld.cellNumber[i]);
			}
			cellNumberBak = new Array;
			for(var i=0; i<cellNumber.length; i++) cellNumberBak.push(cellNumber[i]);
		}catch(e){
		}finally{
			fn.close();
		}
	}
	/////////////////////////////////////////////////////////////////////////
	//フレーム情報の表示
	//listboxへ表示する文字列をcellNumber配列から作成する
	function dispItem(idx)
	{

		var ret = "";
		if ((idx<0)||(idx>=cellNumber.length)) return ret;
		var fr =Math.round(frameRate);
		var frs = 6;
		if ((fr==24)||(fr==12) ) { frs = 6;}
		else if ((fr==30)||(fr==15) ) { frs = 5;}
		
		var pp = Math.floor(idx / pageCount) ;
		var pc = (idx % pageCount) ;
		var sec = Math.floor(pc /fr);
		if ( ( pc % fr)==0){
			ret += (pp+1) + "p";
		}else{
			ret += "__";
		}
		var sep = "";
		if ( ( (pc+1) % fr)==0){
			sep = "  // "+ (sec+1) +"+0 //" ;
		}else if ( ( (pc+1) % frs)==0){
			sep = "  ___ " + ((pc % fr)+1);
		}
		pc++;
		ret += " ";
		if ( pc<10) ret += "00" + pc;
		else if ( pc<100) ret += "0" + pc;
		else ret += "" + pc;
		ret += "   ";
		var cc = cellNumber[idx];
		if ( cc <= 0){
			ret += "  X";
		}else{
			if ((idx>0)&&((cellNumber[idx-1] == cellNumber[idx]))){
				ret += "  |";
			}else{
				if ( cc<10) ret += "  "+ cc;
				else if ( cc<100) ret += " " + cc;
				else ret += "" + cc;
			}
		}
		ret += sep;
		return ret;
	}
	/////////////////////////////////////////////////////////////////////////
	function getTargetLayer(newFlag)
	{
		var ret = new Object;
		ret.enabled	= false;
		ret.comp	= null;	//親コンポ
		ret.layer	= null;	//ターゲットのレイヤ
		ret.slider	= null;	//スライダーエフェクトのプロパティ
		ret.opa		= null;	//不透明度プロパティ
		ret.blinds	= null;	//ブロックディゾルブのプロパティ
		ret.emptyNum= 9999;
		ret.emptyDuration= 9999;
		ret.remap	= null;
		if ( (app.project.activeItem instanceof CompItem)==true) {
			ret.comp = app.project.activeItem;
			if ( app.project.activeItem.selectedLayers.length==1){
				ret.layer = app.project.activeItem.selectedLayers[0];
			}
		}
		if ( ret.layer == null) {
			alert("レイヤを一つだけ選択してください。");
			return ret;
		}
		if ( ret.layer.canSetTimeRemapEnabled == false){
			alert("リマップを設定できません。");
			return ret;
		}
		ret.opa = ret.layer.property("ADBE Transform Group").property("ADBE Opacity");
		ret.remap = ret.layer.timeRemap;

		//"0セル番号（スライダ制御)",1"不透明度",2"ブラインドプラグイン",3"無理やり大きい数値を入れる"
		
		//セル番号（スライダ制御)を獲得
		var fx = ret.layer.property("ADBE Effect Parade").property("セル番号");
		if (fx!=null) {
			fx.enabled = false;
			ret.slider = fx.property("ADBE Slider Control-0001");
		}else if ((remapMode==0)&&( newFlag==true)) {
			fx = ret.layer.property("ADBE Effect Parade").addProperty("ADBE Slider Control");
			if ( fx != null) {
				fx.name = "セル番号";
				fx.enabled = false;
				ret.slider = fx.property("ADBE Slider Control-0001");
			}else{
				alert("スライダ制御を設定できません。");
				return ret;
			}
		}
		//ブラインドを獲得
		//ar p = app.project.item(1).layer("a_[0001-0022].tga").property("ADBE Effect Parade").property("ブラインド").property("ADBE Venetian Blinds-0001");
		var fx = ret.layer.property("ADBE Effect Parade").property("空セル");
		if ( fx ==null) fx = ret.layer.property("ADBE Effect Parade").property("ブラインド");
		if ( fx ==null) fx = ret.layer.property("ADBE Effect Parade").property("Venetian Blinds");
		if (fx!=null) {
			fx.enabled = false;
			ret.blinds = fx.property("ADBE Venetian Blinds-0001");
		}else if ((remapMode==2)&&( newFlag==true)) {
			fx = ret.layer.property("ADBE Effect Parade").addProperty("ADBE Venetian Blinds");
			if ( fx != null) {
				fx.name = "空セル";
				fx.enabled = true;
				ret.blinds = fx.property("ADBE Venetian Blinds-0001");
			}else{
				alert("ブラインド制御を設定できません。");
				return ret;
			}
		}
		ret.emptyNum = ret.layer.source.duration * ret.layer.source.frameRate;
		ret.emptyDuration = ret.layer.source.duration;
		
		ret.enabled = true;
		return ret;
	}
	/////////////////////////////////////////////////////////////////////////
	//選択したレイヤにリマップを設定
	function setRemapOpa()
	{
		app.beginUndoGroup("remap-セル番号");
		var target = getTargetLayer(false);
		if (target.enabled == false) {
			app.endUndoGroup();
			return;
		}
		//コンポの長さを設定
		target.comp.duration = cellNumber.length * target.comp.frameDuration;

		target.layer.timeRemapEnabled = true;
		//余計なキーフレームを削除
		if (target.remap.numKeys>=2) for (var i=target.remap.numKeys; i>=2; i--) target.remap.removeKey(i);
		if (target.opa.numKeys>0) for (var i=target.opa.numKeys; i>=1; i--) target.opa.removeKey(i);
		var ary = new Array;
		var c = -100;
		for ( var i=0; i<cellNumber.length; i++){
			if ( cellNumber[i] != c){
				var o = new Object;
				o.frm = i;
				o.num = cellNumber[i];
				c = o.num;
				ary.push(o);
			}
		}
		var bop = -100;
		for ( var i=0; i<ary.length; i++){
			var df = ary[i].frm / frameRate;
			var dv = target.emptyDuration;
			var op = 0;
			if (ary[i].num > 0){
				dv = (ary[i].num-1) / frameRate;
				op = 100;
			}
			target.remap.setValueAtTime(df,dv);
			if ( i==0) {
				target.opa.setValueAtTime(df,op);
				bop = op;
			}else{
				if ( bop != op) {
					target.opa.setValueAtTime(df,op);
					bop = op;
				}
			}
		}
		for (var i=1 ; i<=target.remap.numKeys; i++) target.remap.setInterpolationTypeAtKey(i,KeyframeInterpolationType.HOLD,KeyframeInterpolationType.HOLD);
		for (var i=1 ; i<=target.opa.numKeys; i++) target.opa.setInterpolationTypeAtKey(i,KeyframeInterpolationType.HOLD,KeyframeInterpolationType.HOLD);
		if(target.opa.numKeys>1){
			var tm = 0;
			for(var i=1 ; i<=target.opa.numKeys ; i++){
				if ( target.opa.keyValue(i)==100) {
					tm = target.opa.keyTime(i);
					break;
				}
			}
			target.layer.inPoint = tm;
			var tm = target.comp.duration;
			if ( target.opa.keyValue(target.opa.numKeys)!=100) {
				tm = target.opa.keyTime(target.opa.numKeys);
			}
			target.layer.outPoint = tm;
		}else if(target.opa.numKeys==1){
			target.layer.inPoint = 0;
			target.layer.outPoint = target.comp.duration;
		}
	}
	/////////////////////////////////////////////////////////////////////////
	//選択したレイヤにリマップを設定
	function setRemapBlinds()
	{
		app.beginUndoGroup("remap-セル番号");
		var target = getTargetLayer(true);
		if (target.enabled == false) {
			app.endUndoGroup();
			return;
		}
		//コンポの長さを設定
		target.comp.duration = cellNumber.length * target.comp.frameDuration;

		target.layer.timeRemapEnabled = true;
		target.remap.expressionEnabled = false;
		target.opa.expressionEnabled = false;

		//余計なキーフレームを削除
		if (target.remap.numKeys>=2) for (var i=target.remap.numKeys; i>=2; i--) target.remap.removeKey(i);
		if (target.blinds.numKeys>0) for (var i=target.blinds.numKeys; i>=1; i--) target.blinds.removeKey(i);
		var ary = new Array;
		var c = -100;
		for ( var i=0; i<cellNumber.length; i++){
			if ( cellNumber[i] != c){
				var o = new Object;
				o.frm = i;
				o.num = cellNumber[i];
				c = o.num;
				ary.push(o);
			}
		}
		var bbv = -100;
		for ( var i=0; i<ary.length; i++){
			var df = ary[i].frm / frameRate;
			var dv = target.emptyDuration;
			var bv = 100;
			if (ary[i].num > 0){
				dv = (ary[i].num-1) / frameRate;
				bv = 0;
			}
			target.remap.setValueAtTime(df,dv);
			if ( i==0) {
				target.blinds.setValueAtTime(df,bv);
				bbv = bv;
			}else{
				if ( bbv != bv) {
					target.blinds.setValueAtTime(df,bv);
					bbv = bv;
				}
			}
		}
		for (var i=1 ; i<=target.remap.numKeys; i++) target.remap.setInterpolationTypeAtKey(i,KeyframeInterpolationType.HOLD,KeyframeInterpolationType.HOLD);
		for (var i=1 ; i<=target.blinds.numKeys; i++) target.blinds.setInterpolationTypeAtKey(i,KeyframeInterpolationType.HOLD,KeyframeInterpolationType.HOLD);

		if(target.blinds.numKeys>1){
			var tm = 0;
			for(var i=1 ; i<=target.blinds.numKeys ; i++){
				if ( target.blinds.keyValue(i)==0) {
					tm = target.blinds.keyTime(i);
					break;
				}
			}
			target.layer.inPoint = tm;
			var tm = target.comp.duration;
			if ( target.blinds.keyValue(target.blinds.numKeys)!=0) {
				tm = target.blinds.keyTime(target.blinds.numKeys);
			}
			target.layer.outPoint = tm;
		}else if(target.blinds.numKeys==1){
			target.layer.inPoint = 0;
			target.layer.outPoint = target.comp.duration;
		}
	}
	/////////////////////////////////////////////////////////////////////////
	//選択したレイヤにリマップを設定
	function setRemapCellNumber()
	{
		app.beginUndoGroup("remap-セル番号");
		var target = getTargetLayer(true);
		if (target.enabled == false) {
			app.endUndoGroup();
			return;
		}
		//コンポの長さを設定
		try{
			var ss = cellNumber.length * target.comp.frameDuration;

			if ( target.comp.duration != ss){
				target.comp.duration = cellNumber.length * target.comp.frameDuration;
			}
		}catch(e){
			alert(e.toString());
			return;
		}
		if (target.slider.numKeys==0)
			target.slider.setValue(0);//スライダの初期値
		
		target.layer.timeRemapEnabled = true;
		
		//余計なキーフレームを削除
		if (target.remap.numKeys>=2) for (var i=target.remap.numKeys; i>=2; i--) target.remap.removeKey(i);
		//if (target.opa.numKeys>0) for (var i=target.opa.numKeys; i>=1; i--) target.opa.removeKey(i);
		//必要なエクスプレッションの定義
		target.remap.expression = "cn = Math.floor(effect(\"セル番号\")(\"ADBE Slider Control-0001\"));\n(cn-1) * thisComp.frameDuration;\n";
		target.opa.expression = "if (Math.floor(effect(\"セル番号\")(\"ADBE Slider Control-0001\"))<=0) {0;}else{transform.opacity;}\n";

		var ary = new Array;
		var c = -100;
		for ( var i=0; i<cellNumber.length; i++){
			if ( cellNumber[i] != c){
				var o = new Object;
				o.frm = i;
				o.num = cellNumber[i];
				c = o.num;
				ary.push(o);
			}
		}
		if (target.slider.numKeys>=2) for (var i=target.slider.numKeys; i>=2; i--) target.slider.removeKey(i);

		for ( var i=0; i<ary.length; i++) target.slider.setValueAtTime(ary[i].frm / frameRate, ary[i].num);

		for (var i=1 ; i<=target.slider.numKeys; i++) target.slider.setInterpolationTypeAtKey(i,KeyframeInterpolationType.HOLD,KeyframeInterpolationType.HOLD);

		//
		if(target.slider.numKeys>1){
			var tm = 0;
			for(var i=1 ; i<=target.slider.numKeys ; i++){
				if ( target.slider.keyValue(i)>0) {
					tm = target.slider.keyTime(i);
					break;
				}
			}
			target.layer.inPoint = tm;
			var tm = target.comp.duration;
			if ( target.slider.keyValue(target.slider.numKeys)==0) {
				tm = target.slider.keyTime(target.slider.numKeys);
			}
			target.layer.outPoint = tm;
		}else if(target.slider.numKeys==1){
			target.layer.inPoint = 0;
			target.layer.outPoint = target.comp.duration;
		}
		target.slider.selected = true;
		app.endUndoGroup();
		return true;
	}
	/////////////////////////////////////////////////////////////////////////
	function getRemapData()
	{
		var target = getTargetLayer(false);
		if (target.enabled == false) {
			return;
		}

		frameRate = target.comp.frameRate

		var frm = Math.floor(target.comp.duration * target.comp.frameRate);
		
		cellNumber = new Array;
		for ( var i=0; i<frm; i++) cellNumber.push(-1);
		cellNumber[0] = 0;
		if ( target.slider != null) {
			if (target.slider.numKeys>0){
				for( var i=1; i<=target.slider.numKeys; i++){
					var fm = Math.round(target.slider.keyTime(i) * frameRate);
					var num = Math.round(target.slider.keyValue(i));
					if ( num<0) num=0;
					if ( (fm>=0)&&(fm<frm)) {
						cellNumber[fm] = num;
					}
				}
			}
		}else{
			if (target.remap.numKeys>0){
				for( var i=1; i<=target.remap.numKeys; i++){
					var fm = Math.round(target.remap.keyTime(i) * frameRate);
					var num = Math.round(target.remap.keyValue(i)*frameRate) + 1;
					if ( (num<0)||(num>target.emptyNum)) num = 0;
					if ( (fm>=0)&&(fm<frm)) {
						cellNumber[fm] = num;
					}
				}
			}
			if ( target.blinds != null){
				if (target.blinds.numKeys>0){
					for( var i=1; i<=target.blinds.numKeys; i++){
						var fm = Math.round(target.blinds.keyTime(i) * frameRate);
						var emp = target.blinds.keyValue(i);
						if ( (fm>=0)&&(fm<frm)) {
							if ( emp == 100) cellNumber[fm] = 0;
						}
					}
				}
			}else {
				if (target.opa.numKeys>0){
					for( var i=1; i<=target.opa.numKeys; i++){
						var fm = Math.round(target.opa.keyTime(i) * frameRate);
						var emp = target.opa.keyValue(i);
						if ( (fm>=0)&&(fm<frm)) {
							if ( emp == 0) cellNumber[fm] = 0;
						}
					}
				}
			}
		}
		
		
		for ( var i=1; i<cellNumber.length; i++){
			if ( cellNumber[i]<0) {
				cellNumber[i] = cellNumber[i-1];
			}
		}
		
		return true;
	}
	/////////////////////////////////////////////////////////////////////////
	//メインパネルの作成
	//-------------------------------------------------------------------------

	var remapPal = ( me instanceof Panel) ? me : new Window("palette", "remapEdit", [ 198,  261,  198+ 201,  261+ 611],{resizeable:true });
	
	
	var btnGetRemap = remapPal.add("button", [  10,   10,   10+  50,   10+  24], "GET");
	var btnSetRemap = remapPal.add("button", [  60,   10,   60+  50,   10+  24], "SET");
	var btnPref = remapPal.add("button", [ 149,   10,  149+  50,   10+  24], "Pref");
	var btnCopy = remapPal.add("button", [  10,   40,   10+  40,   40+  20], "copy");
	var btnCut = remapPal.add("button", [  52,   40,   52+  40,   40+  20], "cut");
	var btnPaste = remapPal.add("button", [  94,   40,   94+  45,   40+  20], "paste");
	var btnNav = remapPal.add("button", [ 149,   40,  149+  50,   40+  20], "Nav");
	var btnAutoInput = remapPal.add("button", [ 149,   65,  149+  50,   65+  20], "Inp");
	var stInput = remapPal.add("edittext", [  12,   69,   12+ 127,   69+  18], "input cell number",{readonly:true});
	var lstSheet = remapPal.add("listbox", [   0,   90,    0+ 200,   90+ 520], [ ],{multiselect:true});
	var lstSheetBak = remapPal.add("listbox", [   0,   90,    0+ 200,   90+ 520], [ ]);


	/////////////////////////////////////////////////////////////////////////
	//メインパネルの初期状態を設定
	lstSheetBak.visible = false;
	//フォントを大きく
	var fnt = stInput.graphics.font;
	stInput.graphics.font = ScriptUI.newFont (fnt.name, ScriptUI.FontStyle.BOLD, fnt.size * 1.2);
	var fnt = lstSheet.graphics.font;
	lstSheet.graphics.font = ScriptUI.newFont (fnt.name, ScriptUI.FontStyle.BOLD, fnt.size* 1.2 );
	var gUI = lstSheet.graphics;
	gUI.backgroundColor = gUI.newBrush(gUI.BrushType.SOLID_COLOR, [ 230/255, 230/255, 230/255, 1]);
	var gUI = lstSheetBak.graphics;
	gUI.backgroundColor = gUI.newBrush(gUI.BrushType.SOLID_COLOR, [ 230/255, 230/255, 230/255, 1]);
	
	btnPaste.enabled = false;
	/////////////////////////////////////////////////////////////////////////
	//選択範囲を獲得する
	function getSelected()
	{
		selectedStart = -1;
		selectedLength = 0;
		var cnt = lstSheet.items.length;
		//頭から調べる
		for ( var i=0; i<cnt; i++){
			if (lstSheet.items[i].selected == true){
				selectedStart = i;
				break;
			}
		}
		//後ろから調べる
		if ( selectedStart>=0){
			var e = -1;
			for ( var i=cnt-1; i>=0; i--){
				if (lstSheet.items[i].selected == true){
					e = i;
					break;
				}
			}
			selectedLength = e - selectedStart + 1;
		}
	}
	/////////////////////////////////////////////////////////////////////////
	//選択範囲を下へ移動
	function downSelected()
	{
		getSelected();
		//選択範囲がない時の処理
		if (selectedLength<=0) {
			lstSheet.items[0].selected = true;
			selectedStart = 0;
			selectedLength = 1;
			return;
		}
		var cnt = cellNumber.length;
		if ( (selectedStart+selectedLength)>=cnt) return;
		
		//ちらつき対策
		lstSheetBak.bounds = lstSheet.bounds;
		lstSheetBak.visible = true;
		lstSheet.visible = false;
		if ( (selectedStart + selectedLength)<cnt){
		//選択範囲を消す
		for ( var i=0; i<selectedLength; i++){
			lstSheet.items[selectedStart+i].selected = false;
		}
			selectedStart += selectedLength;
			for ( var i=0; i<selectedLength; i++){
				var ii = selectedStart + i;
				if ( ii<cnt) lstSheet.items[ii].selected = true;
			}
		}
		//元に戻す
		lstSheet.visible = true;
		lstSheetBak.visible = false;
	}
	/////////////////////////////////////////////////////////////////////////
	//選択範囲を上へ移動
	function upSelected()
	{
		getSelected();
		if ( (selectedLength<=0)||(selectedStart<=0) ) return;

		lstSheetBak.bounds = lstSheet.bounds;
		lstSheetBak.visible = true;
		lstSheet.visible = false;
		
		for ( var i=0; i<selectedLength; i++){
			lstSheet.items[selectedStart+i].selected = false;
		}
		var cnt = cellNumber.length;
		selectedStart -= selectedLength;
		for ( var i=0; i<selectedLength; i++){
			var ii = selectedStart + i;
			if (ii>=0) lstSheet.items[ii].selected = true;
		}
		lstSheet.visible = true;
		lstSheetBak.visible = false;
	}
	/////////////////////////////////////////////////////////////////////////
	//選択範囲を後ろへ伸ばす
	function incSelected()
	{
		getSelected();
		if (selectedLength<=0) {
			lstSheet.items[0].selected = true;
			selectedStart = 0;
			selectedLength = 1;
			return;
		}
		var cnt = lstSheet.items.length;
		if ( (selectedStart + selectedLength)>=cnt) return;
		selectedLength++;
		var ii = selectedStart + selectedLength - 1;
		if ( ii < cnt)
			lstSheet.items[ii].selected = true;
	}
	//--------------------------------------------
	//選択範囲を短くする
	function decSelected()
	{
		getSelected();
		if (selectedLength<=1) return;
		selectedLength--;
		lstSheet.items[selectedStart+selectedLength].selected = false;
	}
	/////////////////////////////////////////////////////////////////////////
	//選択範囲をすべて選択
	function allSelected()
	{
		lstSheetBak.bounds = lstSheet.bounds;
		lstSheetBak.visible = true;
		lstSheet.visible = false;
		
		selectedStart = 0;
		selectedLength = cellNumber.length;
		
		for(var i=selectedLength-1; i>=0; i--) lstSheet.items[i].selected = true;
		
		lstSheet.visible = true;
		lstSheetBak.visible = false;
	}
	/////////////////////////////////////////////////////////////////////////
	//選択範囲をすべて選択
	function endSelected()
	{
		getSelected();
		if ( selectedLength<=0) {
			allSelected();
			return;
		}
		lstSheetBak.bounds = lstSheet.bounds;
		lstSheetBak.visible = true;
		lstSheet.visible = false;
		
		
		var cnt = cellNumber.length;
		selectedLength = cnt - selectedStart;
		
		for(var i=selectedStart; i<cnt; i++) lstSheet.items[i].selected = true;
		
		lstSheet.visible = true;
		lstSheetBak.visible = false;
	}
	function selectionBackup()
	{
		selectedStartBak = selectedStart;
		selectedLengthBak = selectedLength;
	}
	function selectionRestore()
	{
		if ( selectedLengthBak<=0) return;
		selectedStart = selectedStartBak;
		selectedLength = selectedLengthBak;
		if (selectedLength>0){
			for(var i=(selectedStart+selectedLength-1); i>=selectedStart; i--) {
				if ( (i>=0)&&(i<lstSheet.items.length))
					lstSheet.items[i].selected = true;
			}
		}
		selectedStartBak = -1;
		selectedLengthBak = 0;
	}
	/////////////////////////////////////////////////////////////////////////
	function autoInputDialog()
	{
		var result = false;
		var start = 0;
		var end = 0;
		var koma = 0;
		//---------------
		var autoInputDlg = new Window("dialog", "セルの自動入力", [ 176,  232,  176+ 249,  232+ 198]);
		
		var pnlAuto = autoInputDlg.add("panel", [  12,   12,   12+ 219,   12+ 133], "セルの自動入力");
		var edRepStart = pnlAuto.add("edittext", [  35,   27,   35+  81,   27+  19], "", {readonly:false, multiline:false});
		var stRepStart = pnlAuto.add("statictext", [ 122,   30,  122+  47,   30+  12], "枚目から");
		var edRepEnd = pnlAuto.add("edittext", [  35,   55,   35+  81,   55+  19], "", {readonly:false, multiline:false});
		var stRepEnd = pnlAuto.add("statictext", [ 122,   58,  122+  57,   58+  12], "枚目までを");
		var edRepKoma = pnlAuto.add("edittext", [  35,   85,   35+  81,   85+  19], "", {readonly:false, multiline:false});
		var stRepKoma = pnlAuto.add("statictext", [ 122,   88,  122+  74,   88+  12], "コマで繰り返す");
		var btnCancel = autoInputDlg.add("button", [  64,  163,   64+  75,  163+  23], "Cancel");
		var btnAutoInput = autoInputDlg.add("button", [ 156,  163,  156+  75,  163+  23], "適応");
		//---------------
		function chk()
		{
			start = 0;
			end = 0;
			koma = 0;
			result = false;
			if ( (isNaN(edRepStart.text)==true)||(isNaN(edRepEnd.text)==true)||(isNaN(edRepKoma.text)==true)){
				alert("入力値が不正です");
				return false;
			}
			start = Math.floor(edRepStart.text *1);
			end = Math.floor(edRepEnd.text *1);
			koma  = Math.floor(edRepKoma.text *1);
			if ( koma<1) koma=1;
			if ( start==end){
				alert("値が同じです");
				return false;
			}
			result = true;
			return true;
		}
		//---------------
		btnCancel.onClick = function(){ autoInputDlg.close();}
		btnAutoInput.onClick = function()
		{
			if (chk()==true)
				autoInputDlg.close();
		}
		//---------------
		this.show = function()
		{
			
			result = false;
			autoInputDlg.center();
			autoInputDlg.show();
			return result;
		}
		this.prm = function()
		{
			var ret = new Object;
			ret.start = start;
			ret.end = end;
			ret.koma = koma;
			return ret;
		}
		//---------------
	}
	/////////////////////////////////////////////////////////////////////////
	//listboxのサイズをparentから求める
	function getListBound()
	{
		var ret = new Array(0,0,0,0);
		var b = remapPal.bounds;
		ret[0] = 0;
		ret[1] = 90;
		ret[2] = ret[0] + (b[2]-b[0]);
		ret[3] = (b[3] - b[1]);
		return ret;
	}
	//---------------
	/////////////////////////////////////////////////////////////////////////
	//内部機能の実装部
	/////////////////////////////////////////////////////////////////////////
	function inputKey(s)
	{
		var ip = stInput.text;
		if ( (s>="0")&&(s<="9")){
			if ( (isNaN(ip)==true)||(ip=="0") ) ip = ""; 
			if ( enterON == true) {
				ip = "";
				enterON = false;
			}
			ip += s;
			stInput.text = ip;
		}
	}
	//---------------------------------------------------
	function backspace()
	{
		var ip = stInput.text;
		if ( (ip!="")&&(ip!="0")) {
			ip = ip.substring(0,ip.length-1);
			stInput.text = ip;
		}
	}
	//---------------------------------------------------
	function cellDelete()
	{
		var ip = stInput.text;
		if ( (ip!="")&&(ip!="0")) {
			stInput.text = "0";
		}
	}
	//---------------------------------------------------
	function cellPlus()
	{
		getSelected();
		if (selectedLength>0){
			var cnt = cellNumber.length;
			var v = 1;
			if ( selectedStart>0){
				v = cellNumber[selectedStart-1] + 1;
			}
			for ( var i=0; i<selectedLength; i++){
				var ii = selectedStart + i;
				if ( (ii>=0)&&(ii<cnt) ){
					cellNumberBak[ii] = cellNumber[ii];
					cellNumber[ii] = v;
					lstSheet.items[ii].text = dispItem(ii);
					if ( ii<cnt-1){
						lstSheet.items[ii+1].text = dispItem(ii+1);
					}
				}
			}
			selectionBackup();
			downSelected();
			undoON = true;
		}else{
			alert("挿入範囲を選択してください");
		}
	}
	//---------------------------------------------------
	function cellEnter()
	{
		getSelected();
		if (selectedLength>0){
			var cnt = cellNumber.length;
			var s = stInput.text;
			if (isNaN(s)==true) s = "0";
			var v = s * 1;
			for ( var i=0; i<selectedLength; i++){
				var ii = selectedStart + i;
				if ( (ii>=0)&&(ii<cnt) ){
					cellNumberBak[ii] = cellNumber[ii];
					cellNumber[ii] = v;
					lstSheet.items[ii].text = dispItem(ii);
					if ( ii<cnt-1){
						lstSheet.items[ii+1].text = dispItem(ii+1);
					}
				}
			}
			selectionBackup();
			downSelected();
			enterON = true;
			undoON = true;
		}else{
			alert("挿入範囲を選択してください");
		}
	}
	//---------------------------------------------------
	
	/////////////////////////////////////////////////////////////////////////
	function drawItemsAll()
	{
		selectedStrat = -1;
		selectedLength = 0;
		stInput.text = "0";
		var itms = new Array;
		lstSheetBak.bounds = lstSheet.bounds;
		lstSheetBak.visible = true;
		lstSheet.visible = false;
		lstSheet.removeAll();
		for ( var i=0; i<cellNumber.length;i++){
			lstSheet.add("item",dispItem(i));
		}
		lstSheet.visible = true;
		lstSheetBak.visible = false;
	}
	/////////////////////////////////////////////////////////////////////////
	function undo()
	{
		if ( undoON==false) return;
		undoON = false;
		
		cellNumber = new Array;
		for(var i=0; i<cellNumberBak.length; i++){
			cellNumber.push( cellNumberBak[i]);
		}
		drawItemsAll();
		selectionRestore();
	}
	//---------------------------------------------------
	function autoInput()
	{
		getSelected();
		if (selectedLength<=0) {
			alert("入力範囲を指定してください");
			return;
		}

		var dlg = new autoInputDialog;
		if (dlg.show()==false) return;
		var ret = dlg.prm();
		
		var rep = new Array;
		if ( ret.start<=ret.end) {
			for(var i=ret.start;i<=ret.end;i++)
				for(var j=0; j<ret.koma;j++)
					rep.push(i);
		}else{
			for(var i=ret.start;i>=ret.end;i--)
				for(var j=0; j<ret.koma;j++)
					rep.push(i);
		}
		for ( var i= 0; i<selectedLength; i++)
		{
			var ii= selectedStart + i;
			cellNumberBak[ii] = cellNumber[ii];
			cellNumber[ii] = rep[i % rep.length];
			lstSheet.items[ii].text = dispItem(ii);
		}
		var ii = selectedStart + selectedLength; 
		if ( ii<cellNumber.length){
			lstSheet.items[ii].text = dispItem(ii);
		}

		selectionBackup();
		undoON = true;
	}
	/////////////////////////////////////////////////////////////////////////
	function copyCell()
	{
		getSelected();
		if ( selectedLength<=0) return;
		copyBuf = new Array;
		var cnt = cellNumber.length;
		for(var i=0; i<selectedLength; i++){
			var ii = selectedStart + i;
			if ( (ii>=0)&&(ii<cnt) ){
				copyBuf.push(cellNumber[ii]);
			}
		}
		btnPaste.enabled = true;
	}
	/////////////////////////////////////////////////////////////////////////
	function cutCell()
	{
		getSelected();
		if ( selectedLength<=0) return;
		copyBuf = new Array;
		var cnt = cellNumber.length;
		for(var i=0; i<selectedLength; i++){
			var ii = selectedStart + i;
			if ( (ii>=0)&&(ii<cnt) ){
				copyBuf.push(cellNumber[ii]);
				cellNumberBak[ii] = cellNumber[ii];
				cellNumber[ii] = 0;
				lstSheet.items[ii].text = dispItem(ii);
			}
		}
		var idx = selectedStart + selectedLength;
		if ( idx<cnt){
			lstSheet.items[idx].text = dispItem(idx);
		}
		btnPaste.enabled = true;
		undoON = true;
		selectionBackup();
	}
	/////////////////////////////////////////////////////////////////////////
	function pasteCell()
	{
		var cl = copyBuf.length;
		if ( cl<=0) {
			btnPaste.enabled = false;
			return;
		}
		getSelected();
		if ( selectedLength<=0) return;
		
		if ( cl>selectedLength) cl = selectedLength;
		
		var cnt = cellNumber.length;
		for(var i=0; i<cl; i++){
			var ii = selectedStart + i;
			if ( (ii>=0)&&(ii<cnt) ){
				cellNumberBak[ii] = cellNumber[ii];
				cellNumber[ii] = copyBuf[i];
				lstSheet.items[ii].text = dispItem(ii);
			}
		}
		var idx = selectedStart + cl;
		if ( idx<cnt){
			lstSheet.items[idx].text = dispItem(idx);
		}
		undoON = true;
		selectionBackup();
	}
	/////////////////////////////////////////////////////////////////////////
	function frameInsert(idx,len,op)
	{
		if ( (idx<0)||(len<=0)) return;
		getSelected();
		selectionBackup();
		
		cellNumberBak = new Array;
		for ( var i=0; i<cellNumber.length; i++) cellNumberBak.push( cellNumber[i] );
		
		if ( op==true){
			setFrameSize(cellNumber.length + len);
		}
		var p = idx + len;
		for(var i= cellNumber.length-1; i>=p; i--){
			cellNumber[i] = cellNumber[i-len];
			cellNumber[i-len] = 0;
		}
		drawItemsAll();
		selectionRestore();
		undoON = true;
		
	}
	/////////////////////////////////////////////////////////////////////////
	function frameRemove(idx,len,op)
	{
		if ( (idx<0)||(len<=0)) return;
		getSelected();
		selectionBackup();
		
		cellNumberBak = new Array;
		for ( var i=0; i<cellNumber.length; i++) cellNumberBak.push( cellNumber[i] );
		
		var p = cellNumber.length - len;
		for(var i= idx; i<p; i++){
			cellNumber[i] = cellNumber[i+len];
			cellNumber[i+len] = 0;
		}

		if ( op==true){
			setFrameSize(cellNumber.length - len);
		}
		drawItemsAll();
		selectionRestore();
		undoON = true;
		
	}
	/////////////////////////////////////////////////////////////////////////
	function resize()
	{
		var b = remapPal.bounds;
		
		//if ( (b[2] - b[0])!=palWidth) b[2] = b[0] + palWidth;
		if ( (b[3] - b[1])<palHeight) b[3] = b[1] + palHeight;
		remapPal.location = new Array(b[0],b[1]);
		remapPal.bounds = b;
		lstSheet.bounds = getListBound();
		lstSheetBak.bounds = lstSheet.bounds;
	}
	/////////////////////////////////////////////////////////////////////////
	function setRemap()
	{
		//"セル番号（スライダ制御)","不透明度","ブラインドプラグイン","無理やり大きい数値を入れる"
		switch(remapMode)
		{
			case 0:
				if ( setRemapCellNumber()==false) return;
				break;
			case 1:
				if ( setRemapOpa()==false) return;
				break;
			case 2:
				if ( setRemapBlinds()==false) return;
				break;
			default:
				alert("未実装");
				break;
		}
	
		
		saveCellNumber();
	}
	/////////////////////////////////////////////////////////////////////////
	function getRemap()
	{
		cellNumberBak = new Array;
		for (var i=0; i<cellNumber.length; i++)cellNumberBak.push(cellNumber[i]);
		undoON = true;

		if ( getRemapData()==false) return;

		drawItemsAll();
		saveCellNumber();
	}
	/////////////////////////////////////////////////////////////////////////
	function keyExec(e,p)
	{
		var cnt = cellNumber.length;
		var k = e.keyName;
		if ( (k>="0")&&(k<="9")){
			inputKey(k);
		}else if (k == "A"){
			if ((e.metaKey)||(e.ctrlKey==true)) allSelected();
		}else if (k == "C"){
			if ((e.metaKey)||(e.ctrlKey==true)) copyCell();
		}else if (k == "X"){
			if ((e.metaKey)||(e.ctrlKey==true)) cutCell();
		}else if ( k == "V"){
			if ((e.metaKey)||(e.ctrlKey==true)) pasteCell();
		}else if ( k == "Z"){
			if ((e.metaKey)||(e.ctrlKey==true)) undo();
		}else if (k == "J"){
			if ((e.metaKey)||(e.ctrlKey==true)) autoInput();
		}else if ( k == "Backspace"){
			backspace();
		}else if ( k == "Delete"){
			cellDelete();
		}else if ( k == "Multiply"){
			incSelected();
		}else if ( k == "Divide"){
			decSelected();
		}else if ( k == "Plus"){
			cellPlus();
		}else if ( k == "Enter"){
			cellEnter();
		}else if ( k == "End"){
			if (e.shiftKey) endSelected();
		}else if ( k == "Up"){
			if (p != null) upSelected();
		}else if ( k == "Down"){
			if (p != null) downSelected();
		}else{
			//stInput.text = k;
		}
		e.stopPropagation();
		if ( p==null) lstSheet.active = true;

	}
	//*************************************************************************************
	/////////////////////////////////////////////////////////////////////////
	//ナビゲーションパレットの作成
	/////////////////////////////////////////////////////////////////////////
	var remapNav = null;
	function nav()
	{
		if ( remapNav != null) return;


		remapNav = new Window("palette", " Nav ", [  22,   29,   22+ 274,   29+ 234]);
		
		
		var pnlSel = remapNav.add("panel", [   6,    5,    6+  76,    5+ 225], "Selection");
		var btnSelDec = pnlSel.add("button", [   6,   18,    6+  60,   18+  24], "sel--");
		var btnSelInc = pnlSel.add("button", [   6,   46,    6+  60,   46+  24], "sel++");
		var btnSelEnd = pnlSel.add("button", [   7,   78,    7+  60,   78+  24], "selEnd");
		var btnSelUp = pnlSel.add("button", [   8,  142,    8+  60,  142+  32], "UP");
		var btnSelDown = pnlSel.add("button", [   8,  180,    8+  60,  180+  32], "Down");
		var pnlTen = remapNav.add("panel", [  88,    5,   88+ 178,    5+ 225], "TenKey");
		var btnBS = pnlTen.add("button", [  92,   11,   92+  78,   11+  30], "BS");
		var btnKey0 = pnlTen.add("button", [   8,  171,    8+  78,  171+  36], "0");
		var btnKey1 = pnlTen.add("button", [   8,  129,    8+  36,  129+  36], "1");
		var btnKey2 = pnlTen.add("button", [  50,  129,   50+  36,  129+  36], "2");
		var btnKey3 = pnlTen.add("button", [  92,  129,   92+  36,  129+  36], "3");
		var btnKey4 = pnlTen.add("button", [   8,   87,    8+  36,   87+  36], "4");
		var btnKey5 = pnlTen.add("button", [  50,   87,   50+  36,   87+  36], "5");
		var btnKey6 = pnlTen.add("button", [  92,   87,   92+  36,   87+  36], "6");
		var btnKey7 = pnlTen.add("button", [   8,   47,    8+  36,   47+  36], "7");
		var btnKey8 = pnlTen.add("button", [  50,   47,   50+  36,   47+  36], "8");
		var btnKey9 = pnlTen.add("button", [  92,   47,   92+  36,   47+  36], "9");
		var btnPlus = pnlTen.add("button", [ 134,   49,  134+  36,   49+  74], "Plus");
		var btnEnt = pnlTen.add("button", [ 134,  129,  134+  36,  129+  78], "Ent");
		var btnDummy = remapNav.add("button", [ 103,  246,  103+  71,  246+  24], "DMY");


		remapNav.onClose = function() { remapNav = null; }
		remapNav.center();
		

		btnSelInc.onClick = function(){incSelected();}
		btnSelDec.onClick = function(){decSelected();}
		btnSelEnd.onClick = function(){endSelected();}
		btnSelUp.onClick = function(){upSelected();}
		btnSelDown.onClick = function(){downSelected();}

		btnKey0.onClick = function(){inputKey("0");}
		btnKey1.onClick = function(){inputKey("1");}
		btnKey2.onClick = function(){inputKey("2");}
		btnKey3.onClick = function(){inputKey("3");}
		btnKey4.onClick = function(){inputKey("4");}
		btnKey5.onClick = function(){inputKey("5");}
		btnKey6.onClick = function(){inputKey("6");}
		btnKey7.onClick = function(){inputKey("7");}
		btnKey8.onClick = function(){inputKey("8");}
		btnKey9.onClick = function(){inputKey("9");}

		btnBS.onClick = function(){backspace();}
		btnPlus.onClick = function(){cellPlus();}
		btnEnt.onClick = function(){cellEnter();}

		function keyExecNav(e)
		{
			keyExec(e,true)
			remapNav.active = true;
			btnDummy.active = true;
			e.stopPropagation();
		}
		remapNav.addEventListener("keydown",keyExecNav);
		
	}
	//--------------------------
	function showNav()
	{
		if ( remapNav == null) {
			nav();
		}
		remapNav.show();
	}
	//*************************************************************************************
	/////////////////////////////////////////////////////////////////////////
	//設定ダイアログの作成
	/////////////////////////////////////////////////////////////////////////
	
	function prefDlg()
	{
		var result			= false;
		var mode			= 0;
		var targetFrame		= -1;
		var targetLength	= 0;
		var isChangeFrame	= false;
		var fps				= 0;
		var rmp				= 0;
		
		var remapPref = new Window("dialog", "設定", [ 132,  174,  132+ 371,  174+ 305]);
		
		
		var pnls = remapPref.add("panel", [  13,   12,   13+ 346,   12+ 243], "Settings");
		var rbFrameCount = pnls.add("radiobutton", [  21,   16,   21+  84,   16+  16], "総フレーム数");
		var edFrameCount = pnls.add("edittext", [ 124,   13,  124+ 100,   13+  19], "", {readonly:false, multiline:false});
		var rbSecKoma = pnls.add("radiobutton", [  21,   41,   21+  59,   41+  16], "総秒数");
		var gSecKoma = pnls.add("group", [ 121,   35,  121+ 135,   35+  25], "");
		var edSec = gSecKoma.add("edittext", [   3,    3,    3+  54,    3+  19], "", {readonly:false, multiline:false});
		var stSepa = gSecKoma.add("statictext", [  63,    6,   63+  18,    6+  14], "＋");
		var edKoma = gSecKoma.add("edittext", [  87,    3,   87+  40,    3+  19], "", {readonly:false, multiline:false});
		var stFrameRate = pnls.add("statictext", [ 119,   74,  119+  69,   74+  12], "フレームレート");
		var edFrameRate = pnls.add("edittext", [ 194,   71,  194+  52,   71+  19], "", {readonly:false, multiline:false});
		var rbFrameIncert = pnls.add("radiobutton", [  21,  112,   21+  94,  112+  16], "フレームの挿入");
		var gFrameIncert = pnls.add("group", [ 121,  103,  121+ 209,  103+  25], "");
		var edInsertFrame = gFrameIncert.add("edittext", [   3,    3,    3+  54,    3+  19], "", {readonly:false, multiline:false});
		var stI1 = gFrameIncert.add("statictext", [  63,    6,   63+  52,    6+  14], "コマ目から");
		var edIncertCount = gFrameIncert.add("edittext", [ 121,    3,  121+  54,    3+  19], "", {readonly:false, multiline:false});
		var stI2 = gFrameIncert.add("statictext", [ 181,    8,  181+  26,    8+  12], "コマ");
		var rbFrameRemove = pnls.add("radiobutton", [  21,  144,   21+  94,  144+  16], "フレームの削除");
		var gFrameRemove = pnls.add("group", [ 121,  138,  121+ 209,  138+  25], "");
		var edRemoveFrame = gFrameRemove.add("edittext", [   3,    3,    3+  54,    3+  19], "", {readonly:false, multiline:false});
		var srR1 = gFrameRemove.add("statictext", [  63,    6,   63+  52,    6+  14], "コマ目から");
		var edRemoveCount = gFrameRemove.add("edittext", [ 121,    4,  121+  54,    4+  19], "", {readonly:false, multiline:false});
		var stR2 = gFrameRemove.add("statictext", [ 181,    8,  181+  26,    8+  12], "コマ");
		var cbChangeFrame = pnls.add("checkbox", [ 124,  170,  124+ 206,  170+  16], "挿入削除時に総フレーム数も変更する");
		var stRemap = pnls.add("statictext", [  36,  201,   36+  79,  201+  17], "空セルの扱い");
		var lstRemap = pnls.add("dropdownlist", [ 121,  198,  121+ 146,  198+  20], ["セル番号（スライダ制御)","不透明度","ブラインドプラグイン","無理やり大きい数値を入れる" ]);
		var btnOK = remapPref.add("button", [ 266,  261,  266+  75,  261+  23], "OK");
		var btnCancel = remapPref.add("button", [ 185,  261,  185+  75,  261+  23], "Cancel");


		//-----------------------------------------------------------------------
		//値を獲得
		var cnt = cellNumber.length;
		fps = frameRate;
		edFrameCount.text	=  cnt + "";
		edFrameRate.text	= fps + "";
		edSec.text			= Math.floor(cnt / fps) + "";
		edKoma.text			= Math.floor(cnt % fps) + "";
		
		rmp = remapMode;
		lstRemap.items[rmp].selected = true;
		
		getSelected();
		var l = selectedLength;
		if ( l>0){
			var s0 = selectedStart;
			if ( s0<0) s0=0;
			if ( (selectedStart + l)>cnt ){
				l = cnt - s0;
			}
			edInsertFrame.text = edRemoveFrame.text = (s0+1) + "";
			edIncertCount.text = edRemoveCount.text = l + "";
		}
		//-----------------------------------------------------------------------
		//初期状態
		function modeset(v)
		{
			mode = v;
			if ( mode<0) mode=0;
			else if (mode>3) mode=3;
			rbFrameCount.value = false;
			edFrameCount.enabled = false;
			rbSecKoma.value = false;
			gSecKoma.enabled = false;
			edFrameRate.enabled = false;
			rbFrameIncert.value = false;
			gFrameIncert.enabled = false;
			rbFrameRemove.value = false;
			gFrameRemove.enabled = false;
			cbChangeFrame.enabled = false;
			switch (mode)
			{
				case 0:
					rbFrameCount.value = true;
					edFrameCount.enabled = true;
					edFrameRate.enabled = true;
					break;
				case 1:
					rbSecKoma.value = true;
					gSecKoma.enabled = true;
					edFrameRate.enabled = true;
					break;
				case 2:
					rbFrameIncert.value = true;
					gFrameIncert.enabled = true;
					cbChangeFrame.enabled = true;
					break;
				case 3:
					rbFrameRemove.value = true;
					gFrameRemove.enabled = true;
					cbChangeFrame.enabled = true;
					break;
				
			}
		}
		modeset(0);
		//-----------------------------------------------------------------------
		
		rbFrameCount.onClick = function(){modeset(0);}
		rbSecKoma.onClick = function(){modeset(1);}
		rbFrameIncert.onClick = function(){modeset(2);}
		rbFrameRemove.onClick = function(){modeset(3);}
		
		//-----------------------------------------------------------------------
		function wend()
		{
			remapPref.close();
			targetFrame		= -1;
			targetLength	= 0;
			fps				= 0;
			remapPref		= null;
			mode			= -1;
			result		= false;
		}
		//-----------------------------------------------------------------------
		btnCancel.onClick = function(){wend();}
		//-----------------------------------------------------------------------
		function getFrameRate()
		{
			fps = 0;
			if ( isNaN(edFrameRate.text)==true) return false;
			fps = edFrameRate.text * 1;
			return (fps>0);
		}
		//-----------------------------------------------------------------------
		function getFrameCount()
		{
			targetFrame = -1;
			targetLength = 0;
			if ( isNaN(edFrameCount.text)==true) return false;
			targetFrame = edFrameCount.text * 1;
			if (targetFrame<=0) return false;
			targetLength = targetFrame;
			return (targetFrame>0) 
		}
		//-----------------------------------------------------------------------
		function getSecKoma()
		{
			targetFrame = -1;
			targetLength = 0;
			if ( isNaN(edSec.text)==true) return false;
			var sec = edSec.text * 1;
			if ( isNaN(edKoma.text)==true) return false;
			var koma = edKoma.text * 1;
			if ( (koma<0)||(koma>=fps)) return false;
			targetFrame = Math.floor(sec * fps + koma);
			targetLength = targetFrame;
			return (targetFrame>0) 
		}
		//-----------------------------------------------------------------------
		function getFrameInsert()
		{
			targetFrame = -1;
			targetLength = 0;
			isChangeFrame = cbChangeFrame.value;
			if ( isNaN(edInsertFrame.text)==true) return false;
			targetFrame = edInsertFrame.text * 1;
			if ((targetFrame<0)||(targetFrame>=cellNumber.length))  return false;
			if ( isNaN(edIncertCount.text)==true) return false;
			targetLength = edIncertCount.text * 1;
			if (targetLength<=0)  return false;
			return true;
		}
		//-----------------------------------------------------------------------
		function getFrameRemove()
		{
			targetFrame = -1;
			targetLength = 0;
			isChangeFrame = cbChangeFrame.value;
			if ( isNaN(edRemoveFrame.text)==true) return false;
			targetFrame = edInsertFrame.text * 1;
			if ((targetFrame<0)||(targetFrame>=cellNumber.length))  return false;
			if ( isNaN(edRemoveCount.text)==true) return false;
			targetLength = edRemoveCount.text * 1;
			if (targetLength<=0)  return false;
			return true;
		}
		//-----------------------------------------------------------------------
		function chk()
		{
			switch(mode)
			{
				case 0:
					if ( getFrameRate()==true){
						if (getFrameCount()==true) {
							result = true;
							remapPref.close();
						}else{
							alert("フレーム数が不正です");
						}
					}else{
							alert("フレームレートが不正です");
					}
					break;
				case 1:
					if ( getFrameRate()==true){
						if (getSecKoma()==true) {
							result = true;
							remapPref.close();
						}else{
							alert("秒数・コマ数が不正です");
						}
					}else{
							alert("フレームレートが不正です");
					}
					break;
				case 2:
					if (getFrameInsert()==true) {
						result = true;
						remapPref.close();
					}else{
						alert("挿入フレーム数が不正です");
					}
					break;
				case 3:
					if (getFrameRemove()==true) {
						result = true;
						remapPref.close();
					}else{
						alert("削除フレーム数が不正です");
					}
					break;
				default :
					alert("chk err");
					break;
				
			}
		}
		//-----------------------------------------------------------------------
		btnOK.onClick = function(){chk();}
		//-----------------------------------------------------------------------
		lstRemap.onChange = function()
		{
			for (var i=0; i<lstRemap.items.length; i++){
				if (lstRemap.items[i].selected == true) {
					rmp = i;
					break;
				}
			}
		}
		//-----------------------------------------------------------------------
		this.show = function()
		{
			result = false;
			remapPref.center();
			remapPref.show();
			return result;
		}
		//-----------------------------------------------------------------------
		this.enabled = function(){ return result;}
		this.status = function()
		{
			var ret = new Object;
			ret.result		= result;
			ret.mode		= mode;
			ret.frame		= targetFrame-1;
			ret.length		= targetLength;
			ret.isChange	= isChangeFrame;
			ret.frameRate	= fps;
			ret.remapMode	= rmp;
			return ret;
			
		}
		//-----------------------------------------------------------------------
	}
	/////////////////////////////////////////////////////////////////////////
	function setFrameCount()
	{
		var cnt = cellNumber.length;
		
		var dlg = new prefDlg();
		if (dlg.show()==true)
		{
			var ret = dlg.status();
			
			switch(ret.mode)
			{
				case 0:
				case 1:
					var ref = false;
					if ( ret.frameRate != frameRate) { frameRate = ret.frameRate; ref = true;}
					if ( ret.length != cellNumber.length ) { setFrameSize(ret.length); ref = true;}
					if ( ref == true) {
						saveCellNumber();
						drawItemsAll();
					}
					break;
				case 2:
					frameInsert(ret.frame,ret.length,ret.isChange);
					break;
				case 3:
					frameRemove(ret.frame,ret.length,ret.isChange);
					break;
			}
			if ( remapMode != ret.remapMode) remapMode = ret.remapMode;
			if ( remapMode >2){
				alert("すみません。空セルは「SET」時は「セル番号形式」「不透明度」「ブラインドプラグイン」しか未実装です。\n\n「GET」はどの形式でも大丈夫なはずです。");
			}
			
		}
	}
	//*************************************************************************************
	/////////////////////////////////////////////////////////////////////////
	//イベントの割り当て
	/////////////////////////////////////////////////////////////////////////
	
	remapPal.addEventListener("keydown",keyExec);
	remapPal.addEventListener("resize",resize);
	remapPal.onResize = resize;
	remapPal.onClose = function() 
	{
		saveCellNumber();
		if (remapNav != null) remapNav.close();
	}
	btnPref.onClick = setFrameCount;
	btnNav.onClick = showNav;
	
	btnCut.onClick = cutCell;
	btnCopy.onClick = copyCell;
	btnPaste.onClick = pasteCell;
	
	btnGetRemap.onClick = getRemap;
	btnSetRemap.onClick = setRemap;
	btnAutoInput.onClick = autoInput;
	//---------------
	/////////////////////////////////////////////////////////////////////////
	//起動時の処理
	/////////////////////////////////////////////////////////////////////////
	loadCellNumber();
	
	drawItemsAll();
	resize();
	if ( ( me instanceof Panel) == false){
		remapPal.center(); 
		remapPal.show();
	}
	/////////////////////////////////////////////////////////////////////////

})(this);
