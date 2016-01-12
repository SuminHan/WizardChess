using UnityEngine;
using System.Collections;

public class CameraChange : MonoBehaviour {

	void Start(){
		DontDestroyOnLoad (transform.gameObject);
		GameObject go = GameObject.Find("SocketIO");
		Client client = go.GetComponent<Client>();
		if (client.selectColor == 0) {
			transform.position = new Vector3 (3.5f, 10.5f, -8.5f);
			transform.rotation = Quaternion.Euler (45.0f, 0.0f, 0.0f);
		} else {
			transform.position = new Vector3 (3.5f, 10.5f, 15.5f);
			transform.rotation = Quaternion.Euler (45.0f, 180.0f, 0.0f);
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

	public void OnGUI(){
		if (GUI.Button (rr(25, 460, 100, 30), "White")) {
			//transform.position = new Vector3 (3.5f, 12.0f, -7.0f);
			//transform.rotation = Quaternion.Euler (45.0f, 0.0f, 0.0f);
			transform.position = new Vector3 (3.5f, 10.5f, -8.5f);
			transform.rotation = Quaternion.Euler (45.0f, 0.0f, 0.0f);
		}
		if (GUI.Button (rr(321-125, 460, 100, 30), "Black")) {
			//transform.position = new Vector3 (3.5f, 12.0f, 14.0f);
			//transform.rotation = Quaternion.Euler (45.0f, 180.0f, 0.0f);
			transform.position = new Vector3 (3.5f, 10.5f, 15.5f);
			transform.rotation = Quaternion.Euler (45.0f, 180.0f, 0.0f);
		}
	}

}
