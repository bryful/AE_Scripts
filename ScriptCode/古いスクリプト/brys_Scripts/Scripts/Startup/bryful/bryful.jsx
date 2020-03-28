#target aftereffects
#includepath "./;/c/Program Files/Adobe/Adobe After Effects CS4/Support Files/Scripts/Startup/bryful;../"
/*
	個人用のライブラリの根底オブジェクトの定義
*/
clearOutput();
bryful = new function()
{
		this.errMes = "";

		//署名
		//ライブラリの識別を行う為に定義
		this.Author = "bry-ful";
		this.Campany = "Alefgard";

		this.libFolder = Folder.current;
		
}();
bryful.ItemType = function()
{
	this.movie		= 1;	//00000001
	this.sequence	= 2;	//00000010
	this.footage	= 3;	//00000011
	this.still		= 4;	//00000100
	this.solid		= 8;	//00001000
	this.sound		= 16;	//00010000
	this.footageAll	= 31;	//00011111
	this.comp		= 32;	//00100000
	this.folder		= 64;	//01000001
	this.all		= 255;	//10000001
	this.unknown	= 256;	//100000000
}


//定数の定義
var ItemType = new bryful.ItemType;

if ( ItemType_movie == undefined)
	const ItemType_movie		= 1;	//00000001
if ( ItemType_sequence == undefined)
	const ItemType_sequence	= 2;		//00000010
if ( ItemType_footage == undefined)
	const ItemType_footage		= 3;	//00000011
if ( ItemType_still == undefined)
	const ItemType_still		= 4;	//00000100
if ( ItemType_solid == undefined)
	const ItemType_solid		= 8;	//00001000
if ( ItemType_sound == undefined)
	const ItemType_sound		= 16;	//00010000
if ( ItemType_footageAll == undefined)
	const ItemType_footageAll	= 31;	//00011111
if ( ItemType_comp == undefined)
	const ItemType_comp		= 32;		//00100000
if ( ItemType_folder == undefined)
	const ItemType_folder		= 64;	//01000000
if ( ItemType_all == undefined)
	const ItemType_all			= 255;	//10000000
if ( ItemType_unknown == undefined)
	const ItemType_unknown		= 256;	//100000000


writeLn("bryful's Lib installed. ");
//その他のライブラリの読み込み
#include "bryful.args.jsxinc"
#include "bryful.items.jsxinc"

#include "bryful.comp.jsxinc"
#include "bryful.file.jsxinc"
#include "bryful.fld.jsxinc"
#include "bryful.interate.jsxinc"
#include "bryful.layer.jsxinc"
#include "bryful.path.jsxinc"
#include "bryful.pref.jsxinc"
#include "bryful.string.jsxinc"
#include "bryful.stringList.jsxinc"
