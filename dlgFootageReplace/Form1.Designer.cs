
namespace dlgFootageReplace
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
			this.ae_window1 = new bryful_due.Ae_window();
			this.edSaki = new bryful_due.Edittext_AE();
			this.edMoto = new bryful_due.Edittext_AE();
			this.btnExec = new bryful_due.Button_AE();
			this.button_AE1 = new bryful_due.Button_AE();
			this.btnSaki = new bryful_due.Button_AE();
			this.SuspendLayout();
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
			this.ae_window1.AE_size = new System.Drawing.Size(472, 245);
			this.ae_window1.AE_title = "Footage Replace";
			this.ae_window1.AE_windowType = bryful_due.windowType.floatingPalette;
			// 
			// edSaki
			// 
			this.edSaki.AE_borderless = false;
			this.edSaki.AE_bounds = new System.Drawing.Rectangle(15, 120, 444, 21);
			this.edSaki.AE_isLocal = true;
			this.edSaki.AE_multiline = false;
			this.edSaki.AE_noecho = false;
			this.edSaki.AE_objName = "edSaki";
			this.edSaki.AE_readonly = true;
			this.edSaki.AE_scrollable = false;
			this.edSaki.AE_text = new string[0];
			this.edSaki.AE_textObjName = "";
			this.edSaki.Font = new System.Drawing.Font("Tahoma", 8.25F);
			this.edSaki.Location = new System.Drawing.Point(15, 120);
			this.edSaki.Name = "edSaki";
			this.edSaki.ReadOnly = true;
			this.edSaki.Size = new System.Drawing.Size(444, 21);
			this.edSaki.TabIndex = 1;
			// 
			// edMoto
			// 
			this.edMoto.AE_borderless = false;
			this.edMoto.AE_bounds = new System.Drawing.Rectangle(15, 33, 444, 21);
			this.edMoto.AE_isLocal = true;
			this.edMoto.AE_multiline = false;
			this.edMoto.AE_noecho = false;
			this.edMoto.AE_objName = "edMoto";
			this.edMoto.AE_readonly = true;
			this.edMoto.AE_scrollable = false;
			this.edMoto.AE_text = new string[0];
			this.edMoto.AE_textObjName = "";
			this.edMoto.Font = new System.Drawing.Font("Tahoma", 8.25F);
			this.edMoto.Location = new System.Drawing.Point(15, 33);
			this.edMoto.Name = "edMoto";
			this.edMoto.ReadOnly = true;
			this.edMoto.Size = new System.Drawing.Size(444, 21);
			this.edMoto.TabIndex = 3;
			// 
			// btnExec
			// 
			this.btnExec.AE_bounds = new System.Drawing.Rectangle(16, 167, 444, 33);
			this.btnExec.AE_defaultElement = bryful_due.defaultElement.none;
			this.btnExec.AE_isLocal = true;
			this.btnExec.AE_objName = "btnExec";
			this.btnExec.AE_text = "実行";
			this.btnExec.AE_textObjName = "";
			this.btnExec.Font = new System.Drawing.Font("Tahoma", 8.25F);
			this.btnExec.Location = new System.Drawing.Point(16, 167);
			this.btnExec.Name = "btnExec";
			this.btnExec.Size = new System.Drawing.Size(444, 33);
			this.btnExec.TabIndex = 4;
			this.btnExec.Text = "実行";
			this.btnExec.UseVisualStyleBackColor = true;
			// 
			// button_AE1
			// 
			this.button_AE1.AE_bounds = new System.Drawing.Rectangle(16, 4, 131, 23);
			this.button_AE1.AE_defaultElement = bryful_due.defaultElement.none;
			this.button_AE1.AE_isLocal = true;
			this.button_AE1.AE_objName = "btnMoto";
			this.button_AE1.AE_text = "入れ替え元";
			this.button_AE1.AE_textObjName = "";
			this.button_AE1.Font = new System.Drawing.Font("Tahoma", 8.25F);
			this.button_AE1.Location = new System.Drawing.Point(16, 4);
			this.button_AE1.Name = "button_AE1";
			this.button_AE1.Size = new System.Drawing.Size(131, 23);
			this.button_AE1.TabIndex = 5;
			this.button_AE1.Text = "入れ替え元";
			this.button_AE1.UseVisualStyleBackColor = true;
			// 
			// btnSaki
			// 
			this.btnSaki.AE_bounds = new System.Drawing.Rectangle(16, 91, 131, 23);
			this.btnSaki.AE_defaultElement = bryful_due.defaultElement.none;
			this.btnSaki.AE_isLocal = true;
			this.btnSaki.AE_objName = "btnSaki";
			this.btnSaki.AE_text = "入れ替え先";
			this.btnSaki.AE_textObjName = "";
			this.btnSaki.Font = new System.Drawing.Font("Tahoma", 8.25F);
			this.btnSaki.Location = new System.Drawing.Point(16, 91);
			this.btnSaki.Name = "btnSaki";
			this.btnSaki.Size = new System.Drawing.Size(131, 23);
			this.btnSaki.TabIndex = 6;
			this.btnSaki.Text = "入れ替え先";
			this.btnSaki.UseVisualStyleBackColor = true;
			// 
			// Form1
			// 
			this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 12F);
			this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
			this.ClientSize = new System.Drawing.Size(472, 245);
			this.Controls.Add(this.btnSaki);
			this.Controls.Add(this.button_AE1);
			this.Controls.Add(this.btnExec);
			this.Controls.Add(this.edMoto);
			this.Controls.Add(this.edSaki);
			this.FormBorderStyle = System.Windows.Forms.FormBorderStyle.SizableToolWindow;
			this.Name = "Form1";
			this.StartPosition = System.Windows.Forms.FormStartPosition.CenterScreen;
			this.Text = "Footage Replace";
			this.ResumeLayout(false);
			this.PerformLayout();

		}

		#endregion

		private bryful_due.Ae_window ae_window1;
		private bryful_due.Button_AE btnSaki;
		private bryful_due.Button_AE button_AE1;
		private bryful_due.Button_AE btnExec;
		private bryful_due.Edittext_AE edMoto;
		private bryful_due.Edittext_AE edSaki;
	}
}

