namespace dlg_shapeExpression
{
	partial class Form1
	{
		/// <summary>
		/// 必要なデザイナー変数です。
		/// </summary>
		private System.ComponentModel.IContainer components = null;

		/// <summary>
		/// 使用中のリソースをすべてクリーンアップします。
		/// </summary>
		/// <param name="disposing">マネージド リソースを破棄する場合は true を指定し、その他の場合は false を指定します。</param>
		protected override void Dispose(bool disposing)
		{
			if (disposing && (components != null))
			{
				components.Dispose();
			}
			base.Dispose(disposing);
		}

		#region Windows フォーム デザイナーで生成されたコード

		/// <summary>
		/// デザイナー サポートに必要なメソッドです。このメソッドの内容を
		/// コード エディターで変更しないでください。
		/// </summary>
		private void InitializeComponent()
		{
			this.components = new System.ComponentModel.Container();
			this.btnGetBase = new bryful_due.Button_AE();
			this.lstBase = new bryful_due.Dropdownlist_AE();
			this.edBaseUrl = new bryful_due.Edittext_AE();
			this.ae_window1 = new bryful_due.Ae_window();
			this.edTargetUrl = new bryful_due.Edittext_AE();
			this.lstTarget = new bryful_due.Dropdownlist_AE();
			this.btnGetTarget = new bryful_due.Button_AE();
			this.edResult = new bryful_due.Edittext_AE();
			this.lbResult = new bryful_due.Statictext_AE();
			this.btnSet = new bryful_due.Button_AE();
			this.btnAdd = new bryful_due.Button_AE();
			this.SuspendLayout();
			// 
			// btnGetBase
			// 
			this.btnGetBase.AE_bounds = new System.Drawing.Rectangle(12, 12, 75, 23);
			this.btnGetBase.AE_defaultElement = bryful_due.defaultElement.none;
			this.btnGetBase.AE_isLocal = true;
			this.btnGetBase.AE_objName = "btnGetBase";
			this.btnGetBase.AE_text = "get Base";
			this.btnGetBase.AE_textObjName = "";
			this.btnGetBase.Font = new System.Drawing.Font("Tahoma", 8.25F);
			this.btnGetBase.Location = new System.Drawing.Point(12, 12);
			this.btnGetBase.Name = "btnGetBase";
			this.btnGetBase.Size = new System.Drawing.Size(75, 23);
			this.btnGetBase.TabIndex = 0;
			this.btnGetBase.Text = "get Base";
			this.btnGetBase.UseVisualStyleBackColor = true;
			// 
			// lstBase
			// 
			this.lstBase.AE_bounds = new System.Drawing.Rectangle(93, 14, 407, 21);
			this.lstBase.AE_index = -1;
			this.lstBase.AE_isLocal = true;
			this.lstBase.AE_itemsName = "";
			this.lstBase.AE_objName = "lstBase";
			this.lstBase.DropDownStyle = System.Windows.Forms.ComboBoxStyle.DropDownList;
			this.lstBase.Font = new System.Drawing.Font("Tahoma", 8.25F);
			this.lstBase.FormattingEnabled = true;
			this.lstBase.Location = new System.Drawing.Point(93, 14);
			this.lstBase.Name = "lstBase";
			this.lstBase.Size = new System.Drawing.Size(407, 21);
			this.lstBase.TabIndex = 1;
			// 
			// edBaseUrl
			// 
			this.edBaseUrl.AE_borderless = false;
			this.edBaseUrl.AE_bounds = new System.Drawing.Rectangle(12, 41, 488, 44);
			this.edBaseUrl.AE_isLocal = true;
			this.edBaseUrl.AE_multiline = true;
			this.edBaseUrl.AE_noecho = false;
			this.edBaseUrl.AE_objName = "edBaseUrl";
			this.edBaseUrl.AE_readonly = true;
			this.edBaseUrl.AE_scrollable = false;
			this.edBaseUrl.AE_text = new string[0];
			this.edBaseUrl.AE_textObjName = "";
			this.edBaseUrl.Font = new System.Drawing.Font("Tahoma", 8.25F);
			this.edBaseUrl.Location = new System.Drawing.Point(12, 41);
			this.edBaseUrl.Multiline = true;
			this.edBaseUrl.Name = "edBaseUrl";
			this.edBaseUrl.ReadOnly = true;
			this.edBaseUrl.Size = new System.Drawing.Size(488, 44);
			this.edBaseUrl.TabIndex = 2;
			// 
			// ae_window1
			// 
			this.ae_window1.AE_Form = this;
			this.ae_window1.AE_funcName = "myDialog";
			this.ae_window1.AE_isCenter = true;
			this.ae_window1.AE_isExportPict = true;
			this.ae_window1.AE_isInFunc = true;
			this.ae_window1.AE_isLocal = true;
			this.ae_window1.AE_maximizeButton = true;
			this.ae_window1.AE_minimizeButton = true;
			this.ae_window1.AE_objName = "winObj";
			this.ae_window1.AE_resizeable = true;
			this.ae_window1.AE_size = new System.Drawing.Size(527, 362);
			this.ae_window1.AE_title = "Form1";
			this.ae_window1.AE_windowType = bryful_due.windowType.floatingPalette;
			// 
			// edTargetUrl
			// 
			this.edTargetUrl.AE_borderless = false;
			this.edTargetUrl.AE_bounds = new System.Drawing.Rectangle(12, 129, 488, 44);
			this.edTargetUrl.AE_isLocal = true;
			this.edTargetUrl.AE_multiline = true;
			this.edTargetUrl.AE_noecho = false;
			this.edTargetUrl.AE_objName = "edTargetUrl";
			this.edTargetUrl.AE_readonly = true;
			this.edTargetUrl.AE_scrollable = false;
			this.edTargetUrl.AE_text = new string[0];
			this.edTargetUrl.AE_textObjName = "";
			this.edTargetUrl.Font = new System.Drawing.Font("Tahoma", 8.25F);
			this.edTargetUrl.Location = new System.Drawing.Point(12, 129);
			this.edTargetUrl.Multiline = true;
			this.edTargetUrl.Name = "edTargetUrl";
			this.edTargetUrl.ReadOnly = true;
			this.edTargetUrl.Size = new System.Drawing.Size(488, 44);
			this.edTargetUrl.TabIndex = 5;
			// 
			// lstTarget
			// 
			this.lstTarget.AE_bounds = new System.Drawing.Rectangle(93, 102, 407, 21);
			this.lstTarget.AE_index = -1;
			this.lstTarget.AE_isLocal = true;
			this.lstTarget.AE_itemsName = "";
			this.lstTarget.AE_objName = "lstTarget";
			this.lstTarget.DropDownStyle = System.Windows.Forms.ComboBoxStyle.DropDownList;
			this.lstTarget.Font = new System.Drawing.Font("Tahoma", 8.25F);
			this.lstTarget.FormattingEnabled = true;
			this.lstTarget.Location = new System.Drawing.Point(93, 102);
			this.lstTarget.Name = "lstTarget";
			this.lstTarget.Size = new System.Drawing.Size(407, 21);
			this.lstTarget.TabIndex = 4;
			// 
			// btnGetTarget
			// 
			this.btnGetTarget.AE_bounds = new System.Drawing.Rectangle(12, 100, 75, 23);
			this.btnGetTarget.AE_defaultElement = bryful_due.defaultElement.none;
			this.btnGetTarget.AE_isLocal = true;
			this.btnGetTarget.AE_objName = "btnGetTarget";
			this.btnGetTarget.AE_text = "get Target";
			this.btnGetTarget.AE_textObjName = "";
			this.btnGetTarget.Font = new System.Drawing.Font("Tahoma", 8.25F);
			this.btnGetTarget.Location = new System.Drawing.Point(12, 100);
			this.btnGetTarget.Name = "btnGetTarget";
			this.btnGetTarget.Size = new System.Drawing.Size(75, 23);
			this.btnGetTarget.TabIndex = 3;
			this.btnGetTarget.Text = "get Target";
			this.btnGetTarget.UseVisualStyleBackColor = true;
			// 
			// edResult
			// 
			this.edResult.AE_borderless = false;
			this.edResult.AE_bounds = new System.Drawing.Rectangle(12, 217, 488, 48);
			this.edResult.AE_isLocal = true;
			this.edResult.AE_multiline = true;
			this.edResult.AE_noecho = false;
			this.edResult.AE_objName = "edResult";
			this.edResult.AE_readonly = true;
			this.edResult.AE_scrollable = false;
			this.edResult.AE_text = new string[0];
			this.edResult.AE_textObjName = "";
			this.edResult.Font = new System.Drawing.Font("Tahoma", 8.25F);
			this.edResult.Location = new System.Drawing.Point(12, 217);
			this.edResult.Multiline = true;
			this.edResult.Name = "edResult";
			this.edResult.ReadOnly = true;
			this.edResult.Size = new System.Drawing.Size(488, 48);
			this.edResult.TabIndex = 7;
			// 
			// lbResult
			// 
			this.lbResult.AE_bounds = new System.Drawing.Rectangle(13, 191, 112, 23);
			this.lbResult.AE_isLocal = false;
			this.lbResult.AE_multiline = false;
			this.lbResult.AE_objName = "lbResult";
			this.lbResult.AE_scrolling = false;
			this.lbResult.AE_text = "Result";
			this.lbResult.AE_textObjName = "";
			this.lbResult.Font = new System.Drawing.Font("Tahoma", 8.25F);
			this.lbResult.Location = new System.Drawing.Point(13, 191);
			this.lbResult.Name = "lbResult";
			this.lbResult.Size = new System.Drawing.Size(112, 23);
			this.lbResult.TabIndex = 6;
			this.lbResult.Text = "Result";
			// 
			// btnSet
			// 
			this.btnSet.AE_bounds = new System.Drawing.Rectangle(12, 287, 113, 23);
			this.btnSet.AE_defaultElement = bryful_due.defaultElement.none;
			this.btnSet.AE_isLocal = true;
			this.btnSet.AE_objName = "btnSet";
			this.btnSet.AE_text = "set Expression";
			this.btnSet.AE_textObjName = "";
			this.btnSet.Font = new System.Drawing.Font("Tahoma", 8.25F);
			this.btnSet.Location = new System.Drawing.Point(12, 287);
			this.btnSet.Name = "btnSet";
			this.btnSet.Size = new System.Drawing.Size(113, 23);
			this.btnSet.TabIndex = 8;
			this.btnSet.Text = "set Expression";
			this.btnSet.UseVisualStyleBackColor = true;
			// 
			// btnAdd
			// 
			this.btnAdd.AE_bounds = new System.Drawing.Rectangle(131, 287, 113, 23);
			this.btnAdd.AE_defaultElement = bryful_due.defaultElement.none;
			this.btnAdd.AE_isLocal = true;
			this.btnAdd.AE_objName = "btnAdd";
			this.btnAdd.AE_text = "add Expression";
			this.btnAdd.AE_textObjName = "";
			this.btnAdd.Font = new System.Drawing.Font("Tahoma", 8.25F);
			this.btnAdd.Location = new System.Drawing.Point(131, 287);
			this.btnAdd.Name = "btnAdd";
			this.btnAdd.Size = new System.Drawing.Size(113, 23);
			this.btnAdd.TabIndex = 9;
			this.btnAdd.Text = "add Expression";
			this.btnAdd.UseVisualStyleBackColor = true;
			// 
			// Form1
			// 
			this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 12F);
			this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
			this.ClientSize = new System.Drawing.Size(527, 362);
			this.Controls.Add(this.btnAdd);
			this.Controls.Add(this.btnSet);
			this.Controls.Add(this.lbResult);
			this.Controls.Add(this.edResult);
			this.Controls.Add(this.edTargetUrl);
			this.Controls.Add(this.lstTarget);
			this.Controls.Add(this.btnGetTarget);
			this.Controls.Add(this.edBaseUrl);
			this.Controls.Add(this.lstBase);
			this.Controls.Add(this.btnGetBase);
			this.FormBorderStyle = System.Windows.Forms.FormBorderStyle.SizableToolWindow;
			this.Name = "Form1";
			this.StartPosition = System.Windows.Forms.FormStartPosition.CenterScreen;
			this.Text = "Form1";
			this.ResumeLayout(false);
			this.PerformLayout();

		}

		#endregion

		private bryful_due.Button_AE btnGetBase;
		private bryful_due.Dropdownlist_AE lstBase;
		private bryful_due.Edittext_AE edBaseUrl;
		private bryful_due.Ae_window ae_window1;
		private bryful_due.Button_AE btnAdd;
		private bryful_due.Button_AE btnSet;
		private bryful_due.Statictext_AE lbResult;
		private bryful_due.Edittext_AE edResult;
		private bryful_due.Edittext_AE edTargetUrl;
		private bryful_due.Dropdownlist_AE lstTarget;
		private bryful_due.Button_AE btnGetTarget;
	}
}

