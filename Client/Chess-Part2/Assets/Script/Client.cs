using UnityEngine;
using System.Collections;
using System.Collections.Generic;
using SocketIO;

public class Client : MonoBehaviour {
	private SocketIOComponent socket;
	private PlayerControl _PlayerControl;
	private Dictionary<string, string> data;
	GameObject go;
	GameObject playercontrolobject;
	private string User = " ";
	public int selectColor = 0;
	private string[] OptionColor = new string[]{"white","black"};
	string LoginFail = " ";
	private bool login = true;

	void Awake(){
		DontDestroyOnLoad (transform.gameObject);
	}

	void Start () {
		DontDestroyOnLoad (transform.gameObject);
		go = GameObject.Find("SocketIO");
		socket = go.GetComponent<SocketIOComponent>();


		Debug.Log (socket);
		if (socket == null) {
			Debug.Log("fuck you!");
		}

		socket.On("connection", Connection);
		socket.On("loginconfirm", LoginConfirm);
		socket.On("toclient", ToClient);
	}
		

	public void ToClient(SocketIOEvent e){
		Debug.Log(string.Format("[name: {0}, data: {1}]", e.name, e.data));
		Debug.Log (e.data ["msg"].ToString().Trim());
		playercontrolobject = GameObject.Find ("__GameManager");
		_PlayerControl = playercontrolobject.GetComponent<PlayerControl> ();
		_PlayerControl.TakeInput (e.data ["msg"].ToString().Trim('"'));

		/*
		using (AndroidJavaClass jc = new AndroidJavaClass("com.unity3d.player.UnityPlayer"))
		{
			using (AndroidJavaObject jo = jc.GetStatic<AndroidJavaObject>("currentActivity"))
			{
				jo.Call("initActivity", e.data.ToString().Trim());
			}
		}
		*/
	}

	public void Update(){
		if (Input.GetKeyDown(KeyCode.Escape)) { Application.Quit(); }
		if (Input.GetKey ("space")) {
			data = new Dictionary<string, string> ();
			data ["msg"] = "noen";
			socket.Emit("fromclient",new JSONObject(data));
			login = false;
		}
	}

	private float w(float i){
		return i * Screen.width / 321;
	}

	private float h(float j){
		return j * Screen.height / 535;
	}

	private Rect rr(float w1, float h1, float w2, float h2){
		return new Rect(w(w1), h(h1), w(w2), h(h2));
	}

	void OnGUI(){
		if (login) {
			int fsize = (int) w(18);
			GUIStyle lStyle = GUI.skin.label;
			lStyle.fontSize = fsize;
			GUIStyle tStyle = GUI.skin.textField;
			tStyle.fontSize = fsize;
			GUIStyle bStyle = GUI.skin.box;
			bStyle.fontSize = fsize;
			GUIStyle nStyle = GUI.skin.button;
			nStyle.fontSize = fsize;

			GUI.Label (rr (80, 170, 150, 30), "<<<  Login  >>>", lStyle);
			GUI.Label (rr(20, 200, 110, 30), "Name", lStyle);
			User = GUI.TextField (rr(90, 200, 200, 30), User, tStyle);
			GUI.Label (rr(20, 240, 110, 30), "Color", lStyle);
			GUIStyle tmpStyle = GUI.skin.toggle;
			tmpStyle.fontSize = fsize;
			selectColor = GUI.SelectionGrid (rr(90, 240, 200, 40), selectColor, OptionColor, OptionColor.Length, tmpStyle);
			GUI.Label (rr(140, 310, 110, 30), LoginFail, lStyle);
			/*
			tmpStyle.border.right = 0;
			tmpStyle.border.left = 0;
			tmpStyle.border.top = 0;
			tmpStyle.border.bottom = 0;
			*/
			/*
			tmpStyle.overflow.right = 0;
			tmpStyle.overflow.left = 0;
			tmpStyle.overflow.top = 0;
			tmpStyle.overflow.bottom = 0;
			*/
			//tmpStyle.padding.right = 0;
			//tmpStyle.padding.left = fsize;
			//tmpStyle.padding.top = fsize;
			//tmpStyle.padding.bottom = 0;

			//- set all four "border" values to zero
			//- set all four "overflow" values to zero
			//- set "image position" to "image only", and render the label as a separate GUI element instead
			//- set "padding.right" and "padding.bottom" to zero
			//- set "padding.left" and "padding.top" to the minimum width and height you want the background scaled to




			if (GUI.Button (rr(150, 300, 110, 30), "Login", nStyle)) {
				data = new Dictionary<string, string> ();
				data ["user"] = User;
				switch (selectColor) {
				case 0:
					data ["color"] = "white";
					break;
				case 1:
					data ["color"] = "black";
					break;
				}
				socket.Emit ("login", new JSONObject (data));
			}
		}
	}

	public void Connection(SocketIOEvent e){
		Debug.Log (e.data ["msg"]);
	}

	public void LoginConfirm(SocketIOEvent e){
		Debug.Log(string.Format("[name: {0}, data: {1}]", e.name, e.data));
		Debug.Log (e.data ["user"].ToString().Trim('"'));
		Debug.Log (e.data ["msg"].ToString().Trim('"'));
		if (e.data ["msg"].ToString ().Trim ('"').Equals ("Success")) {

			Application.LoadLevel (1);
			Debug.Log("Yeah!");
			login = false;



			using (AndroidJavaClass jc = new AndroidJavaClass("com.unity3d.player.UnityPlayer"))
			{
				using (AndroidJavaObject jo = jc.GetStatic<AndroidJavaObject>("currentActivity"))
				{
					jo.Call("initActivity", e.data["socketid"].ToString().Trim('"'));
				}
			}



		} else if (e.data ["msg"].ToString ().Trim ('"').Equals ("Fail")) {
			Debug.Log("Fuck login failed");
			LoginFail = e.data ["msg"].ToString ().Trim ('"');
		} else {
			Debug.Log("none of my biz");
		}
	}
}
