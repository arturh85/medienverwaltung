package dummy.mvapp;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.Toast;
import dummy.mvapp.search.ResultsActivity;
import org.apache.commons.io.IOUtils;
import org.apache.http.HttpEntity;
import org.apache.http.HttpHost;
import org.apache.http.HttpResponse;
import org.apache.http.StatusLine;
import org.apache.http.auth.AuthScope;
import org.apache.http.auth.UsernamePasswordCredentials;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPut;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.DefaultHttpClient;
import org.json.JSONArray;
import org.json.JSONObject;

import java.io.IOException;
import java.net.URI;

public class MyActivity extends Activity
{
    private static final String TAG = "MyActivity";
    private static final String API_BASE_URL = "http://www.medienverwaltung.net"

    /** Called when the activity is first created. */
    @Override
    public void onCreate(Bundle savedInstanceState)
    {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.main);
    }

    public void Scan3442367263(View view) throws Exception  {
        Intent myIntent = new Intent(this, ResultsActivity.class);
        this.startActivity(myIntent);
    }

    public void JsonApi(View view) throws Exception  {

        DefaultHttpClient httpclient = new DefaultHttpClient();
        try {
            httpclient.getCredentialsProvider().setCredentials(
                    new AuthScope("192.168.120.24", 5000),
                    new UsernamePasswordCredentials("a", "a"));

            HttpGet httpget = new HttpGet("http://192.168.120.24:5000/JsonApi/isbn?q=3442367263");

            Log.d(TAG, "executing request" + httpget.getRequestLine());
            HttpResponse response = httpclient.execute(httpget);
            Log.d(TAG, "response.getStatusLine(): " + response.getStatusLine());

            HttpEntity entity = response.getEntity();
//            String theString = IOUtils.toString(new URI("http://192.168.120.24:5000/JsonApi/isbn?q=3442367263"));
            String theString = IOUtils.toString(entity.getContent());
            Log.d(TAG, "theString: " + theString);

            JSONObject result = new JSONObject(theString);
            Log.d(TAG, "isbn: " + result.getString("isbn"));
            JSONArray media = result.getJSONArray("media");
            for (int i=0; i< media.length(); i++) {
                JSONObject medium = media.getJSONObject(i);
                Log.d(TAG, medium.getString("title"));
            }
//            EntityUtils.consume(entity);
        } finally {
            // When HttpClient instance is no longer needed,
            // shut down the connection manager to ensure
            // immediate deallocation of all system resources
            httpclient.getConnectionManager().shutdown();
        }
    }

    private void toast(Exception ex) {
        Log.e(TAG, ex.toString());
        this.toast(ex.toString());
    }
    
    private void toast(String s) {
        Context context = getApplicationContext();
        CharSequence text = "Hello toast!";
        int duration = Toast.LENGTH_SHORT;

        Toast.makeText(context, s, duration).show();
    }
    
    public void scanBooks(View view) {
        Intent intent = new Intent("com.google.zxing.client.android.SCAN");
        intent.setPackage("com.google.zxing.client.android");
        //intent.putExtra("SCAN_MODE", "QR_CODE_MODE");
        startActivityForResult(intent, 0);
    }

    public void onActivityResult(int requestCode, int resultCode, Intent intent) {
        Log.d(TAG, "onActivityResult");

        if (requestCode == 0) {
            if (resultCode == RESULT_OK) {
                // Handle successful scan

                String contents = intent.getStringExtra("SCAN_RESULT");
                String format = intent.getStringExtra("SCAN_RESULT_FORMAT");

                Log.d(TAG, "result format: " + format);
                Log.d(TAG, "result contents: " + contents);
                Context context = getApplicationContext();
                int duration = Toast.LENGTH_SHORT;

                Toast.makeText(context, format, duration).show();
                Toast.makeText(context, contents, duration).show();


            } else if (resultCode == RESULT_CANCELED) {
                // Handle cancel

                Log.d(TAG, "onActivityResult");
            } else {
                Log.d(TAG, "unknown result code: " + resultCode);
            }
        } else {
            Log.d(TAG, "unknown request code: " + requestCode);
        }
    }

    public void addBookById(String id, String idFormat) {

        DefaultHttpClient httpclient = new DefaultHttpClient();
        try {
            String url = "/api/media";
            String postData = "{isbn: \"\" + id + \"\", isbn_format: \"\" + idFormat + \"\"}";

            Log.d(TAG, "PUT " + url + ": " + postData);

            HttpPut request = new HttpPut(API_BASE_URL + url);
            request.setEntity(new StringEntity(postData));

            HttpResponse response = httpclient.execute(request);
            StatusLine statusLine = response.getStatusLine();
            
            Log.d(TAG, "response code: " + statusLine.getStatusCode());

            HttpEntity entity = response.getEntity();
            String responseData = IOUtils.toString(entity.getContent());

            Log.d(TAG, "response data: " + responseData);
            
            if(statusLine.getStatusCode() == 200) {

            } else {

            }
            
        } catch(IOException e) {
            Log.d(TAG, "failed to add books", e);
        } finally {
            // When HttpClient instance is no longer needed,
            // shut down the connection manager to ensure
            // immediate deallocation of all system resources
            httpclient.getConnectionManager().shutdown();
        }


    }

}
