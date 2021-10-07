using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using System.IO;

using Codeplex.Data;

namespace AEAlert
{
	public class AlertHtml
	{
		private string m_headcss = "";
		public string headcss
		{
			get { return m_headcss; }
			set { m_headcss = value; }
		}
		private string m_body = "";
		public string body
		{
			get { return m_body; }
			set { m_body = value.Replace("\r\n","<br>\r\n"); }
		}

		private bool m_isCenter = true;
		private int m_left = 0;
		private int m_top = 0;
		private int m_width = 0;
		private int m_height = 0;

		private string m_title = "";
		public string title
		{
			get { return m_title; }
		}

		public string Html
		{
			get
			{
				return HTML_BASE.Replace("{$CSS}", m_headcss).Replace("{$BODY}", m_body);
			}
		}

		private readonly string HTML_BASE =
			"!DOCTYPE html>\r\n" +
			"<html>\r\n" +
			"<head>\r\n" +
			"<style type=\"text/css\">\r\n" +
			"<!--\r\n" +
			"{$CSS}\r\n" +
			"-->\r\n" +
			"</style>\r\n" +
			"</head>\r\n" +
			"<body>\r\n" +
			"{$BODY}"+
			"</body>\r\n" +
			"</html>\r\n";
		public AlertHtml()
		{

		}
		public bool LoadJson(string p)
		{
			bool ret = false;

			try
			{
				if (File.Exists(p) == true)
				{
					string str = File.ReadAllText(p, Encoding.GetEncoding("utf-8"));
					if (str != "")
					{
						dynamic json = DynamicJson.Parse(str);

						ret = true;
					}
				}
			}
			catch
			{
				dynamic json = new DynamicJson();

				string key = "body";
				if ( ((DynamicJson)json[key]).IsDefined(key)==true)
				{
					m_body = (string)json[key];
					m_body = m_body.Replace("\r\n", "<br>\r\n").Trim();
				}
				key = "headcss";
				if (((DynamicJson)json[key]).IsDefined(key) == true)
				{
					m_headcss = (string)json[key];
				}
				key = "isCenter";
				if (((DynamicJson)json[key]).IsDefined(key) == true)
				{
					m_isCenter = (bool)json[key];
				}
				key = "left";
				if (((DynamicJson)json[key]).IsDefined(key) == true)
				{
					m_left = (int)json[key];
				}
				key = "top";
				if (((DynamicJson)json[key]).IsDefined(key) == true)
				{
					m_left = (int)json[key];
				}

				key = "title";
				if (((DynamicJson)json[key]).IsDefined(key) == true)
				{
					m_title = (string)json[key];
				}

				ret = false;
			}
			return ret;
		}

	}
}
