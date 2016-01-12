package com.LearningGeekBlog.Chess;
import java.io.BufferedReader;
import java.io.File;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.UnsupportedEncodingException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;

import static android.widget.Toast.makeText;
import static edu.cmu.pocketsphinx.SpeechRecognizerSetup.defaultSetup;


import org.apache.http.HttpResponse;
import org.apache.http.NameValuePair;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.HttpClient;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.message.BasicNameValuePair;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.json.JSONTokener;

import com.unity3d.player.*;

import android.content.Context;
import android.media.AudioManager;
import android.media.SoundPool;
import android.os.AsyncTask;
import android.os.Bundle;
import android.os.Vibrator;
import android.speech.tts.TextToSpeech;
import android.view.KeyEvent;
import android.widget.Toast;
import edu.cmu.pocketsphinx.Assets;
import edu.cmu.pocketsphinx.Hypothesis;
import edu.cmu.pocketsphinx.RecognitionListener;
import edu.cmu.pocketsphinx.SpeechRecognizer;

public class TestJava extends UnityPlayerActivity implements
		RecognitionListener, TextToSpeech.OnInitListener{
    private static final String IP_ADDRESS = "143.248.36.232:8080";

    private TextToSpeech myTTS;
    
    /* Named searches allow to quickly reconfigure the decoder */
    private static final String KWS_SEARCH = "wakeup";
    private static final String CHESS_SEARCH = "chess";

    /* Keyword we are looking for to activate menu */
    private static final String KEYPHRASE = "oh mighty wizard";
    private static String SOCKETID;

    private SpeechRecognizer recognizer;
    private HashMap<String, Integer> captions;
    
    private SoundPool pool;
    int ddok;
    
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        myTTS = new TextToSpeech(this, this);
        pool = new SoundPool(1, AudioManager.STREAM_MUSIC, 0);
        ddok = pool.load(this, R.raw.facebook_ringtone_pop, 1);
        
        
    }

    public void onInit(int status) {
        if (status == TextToSpeech.SUCCESS)
        {
            myTTS.setLanguage(new Locale("en", "IN"));
            myTTS.setPitch((float) 100);
            
            new AsyncTask<Void, Void, Exception>() {
                @Override
                protected Exception doInBackground(Void... params) {
                    try {
                        Assets assets = new Assets(TestJava.this);
                        File assetDir = assets.syncAssets();
                        setupRecognizer(assetDir);
                    } catch (IOException e) {
                        return e;
                    }
                    return null;
                }

                @Override
                protected void onPostExecute(Exception result) {
                }
            }.execute();

        } else
        {
            //failed
        }
    }
    
    private void setupRecognizer(File assetsDir) throws IOException {
        // The recognizer can be configured to perform multiple searches
        // of different kind and switch between them

        recognizer = defaultSetup()
                .setAcousticModel(new File(assetsDir, "en-us-ptm"))
                .setDictionary(new File(assetsDir, "cmudict-en-us.dict"))
                
                // To disable logging of raw audio comment out this call (takes a lot of space on the device)
                .setRawLogDir(assetsDir)
                
                // Threshold to tune for keyphrase to balance between false alarms and misses
                .setKeywordThreshold(1e-45f)
                
                // Use context-independent phonetic search, context-dependent is too slow for mobile
                .setBoolean("-allphone_ci", true)
                
                .getRecognizer();

        recognizer.addListener(this);
        
        myTTS.speak("Say, oh mighty wizard to command.", TextToSpeech.QUEUE_FLUSH, null);

        /** In your application you might not need to add all those searches.
         * They are added here for demonstration. You can leave just one.
         */

        // Create keyword-activation search.
        recognizer.addKeyphraseSearch(KWS_SEARCH, KEYPHRASE);

        // Create grammar-based search for digit recognition
        File chessGrammar = new File(assetsDir, "chess.gram");
        recognizer.addGrammarSearch(CHESS_SEARCH, chessGrammar);
        
        switchSearch(KWS_SEARCH);
        
    }
    
    @Override
    public void onDestroy() {
        super.onDestroy();
        recognizer.stop();
        recognizer.cancel();
        recognizer.shutdown();
        myTTS.stop();
        
    }
    
    /**
     * In partial result we get quick updates about current hypothesis. In
     * keyword spotting mode we can react here, in other modes we need to wait
     * for final result in onResult.
     */
    @Override
    public void onPartialResult(Hypothesis hypothesis) {
        if (hypothesis == null)
    	    return;

        String text = hypothesis.getHypstr();
        if (text.equals(KEYPHRASE))
            switchSearch(CHESS_SEARCH);
        else {
            return;
        }

    }

    /**
     * This callback is called when we stop the recognizer.
     */
    @Override
    public void onResult(Hypothesis hypothesis) {
        if (hypothesis != null) {
            String text = hypothesis.getHypstr();
            makeText(getApplicationContext(), text, Toast.LENGTH_SHORT).show();
            if(!text.equals(KEYPHRASE)){
	            //String myText = "You said: " + text;
	            //myTTS.speak(myText, TextToSpeech.QUEUE_FLUSH, null);
                new PostData().execute(text);
            }
            else{
            	pool.play(ddok, 1, 1, 0, 0, 1);
            }
        }
    }

    @Override
    public void onBeginningOfSpeech() {
    }

    /**
     * We stop recognizer here to get a final result
     */
    @Override
    public void onEndOfSpeech() {
        if (!recognizer.getSearchName().equals(KWS_SEARCH))
            switchSearch(KWS_SEARCH);
    }

    private void switchSearch(String searchName) {
        recognizer.stop();
        
        // If we are not spotting, start listening with timeout (10000 ms or 10 seconds).
        if (searchName.equals(KWS_SEARCH))
            recognizer.startListening(searchName);
        else
            recognizer.startListening(searchName, 10000);

    }
    
    @Override
    public void onError(Exception error) {
        myTTS.speak("ERROR", TextToSpeech.QUEUE_FLUSH, null);
    }

    @Override
    public void onTimeout() {
        String myText = "Waiting input";
        myTTS.speak(myText, TextToSpeech.QUEUE_FLUSH, null);
        switchSearch(KWS_SEARCH);
    }
    

    public void initActivity(final String messageFromUnity)
    {
        runOnUiThread(new Runnable() {
            public void run() 
            {
            	UnityPlayer.UnitySendMessage("TEST", "AndroidLog", messageFromUnity);
                //String myText1 = messageFromUnity;
                
                
                
                SOCKETID = messageFromUnity;
                myTTS.speak("Successfully entered the game.", TextToSpeech.QUEUE_FLUSH, null);
                //makeText(getApplicationContext(), SOCKETID, Toast.LENGTH_SHORT).show();
                //new PostData().execute(messageFromUnity);
                
            }
          });
    }
    
    private class PostData extends AsyncTask<String, String, String> {
    	HttpClient httpClient;
    	HttpPost httpPost;
    	@Override
    	protected void onPreExecute() {
    		// TODO Auto-generated method stub
    		super.onPreExecute();
    		
    		//1. Create an object of HttpClient

            httpClient = new DefaultHttpClient();
           //2. Create an object of HttpPost

            httpPost = new HttpPost("http://"+IP_ADDRESS+"/abc");
           
    	}

		@Override
		protected String doInBackground(String... params) {
			//3. Add POST parameters
			List<NameValuePair> nameValuePair = new ArrayList<NameValuePair>();
			
			nameValuePair.add(new BasicNameValuePair("msg", params[0]));
			nameValuePair.add(new BasicNameValuePair("sid", SOCKETID));
			
			String rtn = "";
			JSONObject obj;
			try {
				httpPost.setEntity(new UrlEncodedFormEntity(nameValuePair));
			    HttpResponse response = httpClient.execute(httpPost);
			    
			    BufferedReader reader = new BufferedReader(new InputStreamReader(response.getEntity().getContent(), "UTF-8"));
				String json = reader.readLine();
				
				
				obj = new JSONObject(json);
				rtn = obj.getString("msg");
				
				Vibrator vibe = (Vibrator) getSystemService(Context.VIBRATOR_SERVICE);
				if(rtn.equalsIgnoreCase("checkmate")){
					vibe.vibrate(2000);
				} else if(obj.has("kill")){
					vibe.vibrate(200);
				}
				
			
			// write response to log
			//Log.d("Http Post Response:", response.toString());
			} catch (ClientProtocolException e) {
			    // Log exception
			    e.printStackTrace();
			} catch (IOException e) {
			    // Log exception
			    e.printStackTrace();
			} catch (JSONException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
			
			return rtn;
		}
		
        @Override
        protected void onPostExecute(String result) {
        	if(result  != null && result.length() == 0)
        		result = "Server responded nothing.";
			myTTS.speak(result, TextToSpeech.QUEUE_FLUSH, null);
        }
    }
    

	// Pass any events not handled by (unfocused) views straight to UnityPlayer
	@Override public boolean onKeyUp(int keyCode, KeyEvent event)     {
		if(keyCode == KeyEvent.KEYCODE_BACK){
			onDestroy();
			System.exit(0);
			return false;
		}
			
		return mUnityPlayer.injectEvent(event); }

}