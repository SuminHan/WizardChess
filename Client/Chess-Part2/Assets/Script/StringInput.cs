using UnityEngine;
using System.Collections;

public class StringInput : MonoBehaviour {

	public string textFieldString = "";
	private PlayerControl _PlayerControl;

	void Start(){
		_PlayerControl = gameObject.GetComponent<PlayerControl> ();
	}
		

	void Update (){
		if (Input.GetKeyDown ("return")) {
			_PlayerControl.TakeInput (textFieldString);
		}
	}
}