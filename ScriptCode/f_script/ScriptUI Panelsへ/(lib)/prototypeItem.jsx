(function (){
    //-------------------------------------------------------------------------
	/*
	種類の識別用にFootageItem/CompItem/FolderItemに以下の関数を定義する
	isSound()	wav等のサウンドフッテージならtrue
	isSolid()	平面フッテージならtrue
	isStill()	静止画フッテージならtrue
	isSequence()	動画フッテージならtrue
	isComp()	コンポジションならtrue
	isFolder()	フォルダーアイテムならtrue
	isNotStill()	秒数を持たないアイテム(CompItem動画フッテージ以外)ならtrue
	*/
	FootageItem.prototype.isSound = function(){
		return ((this.hasAudio==true)&&(this.hasVideo==false));
	}
	FootageItem.prototype.isSolid = function(){
		return (this.mainSource.color !=undefined);
	}
	FootageItem.prototype.isStill = function(){
		return ((this.isSolid()==false)&&(this.mainSource.isStill==true));
	}
	FootageItem.prototype.isSequence = function(){
		return ((this.isSolid()==false)&&(this.mainSource.isStill==false));
	}
	FootageItem.prototype.isComp = function(){return false;}
	FootageItem.prototype.isFolder = function(){return false;}
	FootageItem.prototype.isNotStill = function(){
		return ((this.isSolid()==false)&&(this.mainSource.isStill==false));
	}
	
	CompItem.prototype.isSound = function(){return false;}
	CompItem.prototype.isSolid = function(){return false;}
	CompItem.prototype.isStill = function(){return false;}
	CompItem.prototype.isSequence = function(){return false;}
	CompItem.prototype.isComp = function(){return true;}
	CompItem.prototype.isFolder = function(){return false;}
	CompItem.prototype.isNotStill = function(){return true;}
	
	FolderItem.prototype.isSound = function(){return false;}
	FolderItem.prototype.isStill = function(){return false;}
	FolderItem.prototype.isSolid = function(){return false;}
	FolderItem.prototype.isSequence = function(){return false;}
	FolderItem.prototype.isComp = function(){return false;}
	FolderItem.prototype.isFolder = function(){return true;}
	FolderItem.prototype.isNotStill = function(){return false;}

	//コンポの長さをフレーム数で獲得
	CompItem.prototype.getFrame = function(){
		return this.duration*this.frameRate;
	}
	//コンポの長さをフレーム数で設定
	CompItem.prototype.setFrame = function(f){
		this.duration=f/this.frameRate;
	}
	//コンポ・フッテージと同じ大きさ長さのコンポを作成
	CompItem.prototype.createComp = 
	FootageItem.prototype.createComp = 
	function(){
		var r = this.parentFolder.items.addComp(
			this.name,
			this.width,
			this.height,
			this.pixelAspect,
			this.duration,
			this.frameRate);
		r.duration = this.duration;
		return r;
	}
    //フォルダを作成。指定した同じ名前のフォルダがあったらそれを返す。
	FolderItem.prototype.folder =
	Project.prototype.folder = function(s){
		if(this.numItems>0){
			for(var i=1;i<=this.numItems;i++)
				if(this.item(i).name==s)
					return this.item(i);
		}
		return this.items.addFolder(s);
	}
	//--
    //プロジェクト内のアイテムを名前で探す。結果は配列で返る。
	Project.prototype.findItemByName = function(n){
		var r=[];
		if (this.numItems>0)
			for(var i=1;i<=this.numItems;i++)
				if(this.items[i].name==n)
					r.push(this.items[i]);
		return r;
	}
	//フォルダ内のアイテムを名前で探す。結果は配列で返る。
	FolderItem.prototype.findItemByName = function(n){
		var r=[];
		function F(f){
			if(f.numItems>0)
				for(var i=1;i<=f.numItems;i++){
					 var t=f.item(i);
					if(t instanceof FolderItem)
						F(t)
					else if (t.name == n)
						r.push(t);
				}
		}
		F(this);
		return r;
	}
    //配列内からCompItemを抽出
	Array.prototype.getComp = function(){
		var ret = [];
		if ( this.length > 0)
			for(var i=0;i < this.length;i++)
				if ( this[i].isAEItems()==true)
					if( this[i].isComp()==true) ret.push(this[i]);
		return ret;
	}
	//配列内からFootageItemを抽出
	Array.prototype.getFootage = function(){
		var ret = [];
		if ( this.length > 0)
			for(var i=0;i < this.length;i++)
				if ( this[i].isAEItems()==true)
					if( this[i].isFootage()==true) ret.push(this[i]);
		return ret;
	}
	//配列内から平面フッテージを抽出
	Array.prototype.getSolid = function(){
		var ret = [];
		if ( this.length > 0)
			for(var i=0;i < this.length;i++)
				if ( this[i].isAEItems()==true)
					if( this[i].isSolid()==true) ret.push(this[i]);
		return ret;
	}
})();