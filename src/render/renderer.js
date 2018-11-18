const fs = require('fs');
const path = require('path');
const http = require('http');
const https = require('https');
const request = require('request');
const url = require('url');
const opn = require('opn');
const destroyer = require('server-destroy');
const querystring = require('querystring');

const {google} = require('googleapis');
const plus = google.plus('v1');

const BrowserWindow = require('electron').remote.BrowserWindow;

// var proxyUrl = "https://127.0.0.1:1080";
// process.env.HTTP_PROXY = proxyUrl;
// process.env.HTTPS_PROXY = proxyUrl;

var win = new BrowserWindow({
  width: 400, height: 500, show: false
}) 

/**
 * To use OAuth2 authentication, we need access to a a CLIENT_ID, CLIENT_SECRET, AND REDIRECT_URI.  To get these credentials for your application, visit https://console.cloud.google.com/apis/credentials.
 */
const keyPath = path.join(__dirname, 'oauth2.keys.json');
let keys = {redirect_uris: ['']};
if (fs.existsSync(keyPath)) {
  keys = require(keyPath).web;
}

/**
 * Create a new OAuth2 client with the configured keys.
 */
const oauth2Client = new google.auth.OAuth2(
  '113083120486-49ama1men1gf9s36k64k3oovmg1qju6u.apps.googleusercontent.com',
  '-uzINtDpuYD-kvWy-IC9XeXO',
  'http://localhost:4040/oauth2callback',
);

/**
 * This is one of the many ways you can configure googleapis to use authentication credentials.  In this method, we're setting a global reference for all APIs.  Any other API you use here, like google.drive('v3'), will now use this auth client. You can also override the auth client at the service and method call levels.
 */
google.options({auth: oauth2Client});

/**
 * Open an http server to accept the oauth callback. In this simple example, the only request to our webserver is to /callback?code=<code>
 */
async function authenticate(scopes) {
  return new Promise((resolve, reject) => {
    // grab the url that will be used for authorization
    const authorizeUrl = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: scopes.join(' '),
    });
    var code;
    const server = http
      .createServer(async (req, res) => {
        try {
          //if (req.url.indexOf('/oauth2callback') > -1) {
            //const qs = new url.URL(req.url).searchParams;
            const qs = querystring.parse(url.parse(req.url).query);
            console.log(req.url)
            console.log(qs.code)
            code = qs.code;
            res.end('Authentication successful! Please return to the console.');
            //window.close();
            // server.close()
            
            //console.log("Authentication successful")
            //server.destroy();
    //         var data = querystring.stringify({
    //             grant_type:'authorization_code',
    //             code: code,
    //             client_id:'113083120486-49ama1men1gf9s36k64k3oovmg1qju6u.apps.googleusercontent.com',
    //             client_secret:'-uzINtDpuYD-kvWy-IC9XeXO',
    //             redirect_uri:'http://localhost:4040/oauth2callback'
    // })

    // const options = {
                
    //             host:'accounts.google.com',
    //             path:'/o/oauth2/token',
    //             method:'POST',
    //             headers:{ 
    //             'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8'
    //           }
    // }

    //         const request = https.request(options, (response) => {
    //           console.log('statusCode:', response.statusCode);
    //           console.log('headers:', response.headers);
    //           response.on('data', (d) => {
    //             console.log(''+d);//将buffer转为字符串或者使用d.toString()
    //             let b = JSON.parse(''+d);//将buffer转成JSON
    //             console.log(b.image_id);
    //           });
    //         });
    //         request.on('error', (e) => {
    //           console.error('adjlsjlc:', e);
    //         });
    //         request.write(data);
    //         request.end();

            
            const {tokens} = await oauth2Client.getToken(qs.code);
            console.log(tokens, 'get token !!!!!')
            // console.log("get token")
            oauth2Client.credentials = tokens;
            resolve(oauth2Client);
            
           //  oauth2Client.getToken(qs.code, (err, token) => {
           //  	console.log('111')
           //  	if (err) console.error(err);
           //  	oauth2Client.setCredentials(token);
           //  	// Store the token to disk for later program executions
           //  	fs.writeFile('token.json', JSON.stringify(token), (err) => {
           //    		if (err) return console.error(err);
           //    		console.log('Token stored to token.json');
           //  	});
           //  	console.log('22')
          	// });
          
        } catch (e) {
          reject(e);
        }
        win.close();
      })
      .listen(4040, () => {
        // open the browser to the authorize url to start the workflow
        //opn(authorizeUrl, {wait: false}).then(cp => cp.unref());
        // window.open(authorizeUrl);
        win.loadURL(authorizeUrl);
        win.show();

      });
    destroyer(server);
  //   console.log('111')
  //   console.log(code);
    

   });
}

async function runSample() {
  // retrieve user profile
  const res = await plus.people.get({userId: 'me'});
  console.log(res.data);
}

const scopes = ['https://www.google.com/m8/feeds'];
authenticate(scopes)
  .then(client => runSample(client))
  .catch(console.error);