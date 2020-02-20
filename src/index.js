import * as blockstack from 'blockstack'

const appConfig = new blockstack.AppConfig()
const userSession = new blockstack.UserSession({ appConfig: appConfig })

document.addEventListener("DOMContentLoaded", function () {
    document.getElementById('signin-button').addEventListener('click', function (event) {
      event.preventDefault()
      userSession.redirectToSignIn()
    })
    document.getElementById('signout-button').addEventListener('click', function (event) {
      event.preventDefault()
      userSession.signUserOut(window.location.href)
    })
    
    document.getElementById('button-preview').onclick = function() {
      var promise = navigator.mediaDevices.getUserMedia({audio:true,video:true});
      var video = document.querySelector("#videoElement");

if (navigator.mediaDevices.getUserMedia) {
  navigator.mediaDevices.getUserMedia({ video: true })
    .then(function (stream) {
      video.srcObject = stream;
    })
    .catch(function (err0r) {
      console.log("Something went wrong!");
    });
}
      
    };
    function showProfile(profile) {
     
      var person = new blockstack.Person(profile)
      document.getElementById('heading-name').textContent = person.name() ? person.name() : "Nameless Person"
      if (person.avatarUrl()) {
        document.getElementById('avatar-image').setAttribute('src', person.avatarUrl())
      }
      else {
        document.getElementById('avatar-image').setAttribute('src', './avatar-placeholder.png')
      }
      document.getElementById('section-1').style.display = 'none'
      document.getElementById('section-2').style.display = 'block'
      window.addEventListener('DOMContentLoaded', () => {
         
         
        
        const getMic = document.getElementById('mic');
        const recordButton = document.getElementById('record');
        const list = document.getElementById('recordings');
        const play=document.getElementById('play');
       
        if ('MediaRecorder' in window) {
          document.getElementById("play").addEventListener("click", myFunction);
          function myFunction() {
             
            alert("obtaining");
            blockstack.getFile("gallery.json",{decrypt:false})
            .then((fileContents) => {
              if (fileContents) {
              
                 var gal=JSON.parse(fileContents);
               
                alert(gal);
                var video = document.querySelector('#recvideo');
                video.src = gal;
             
              video.load();
              video.onloadeddata = function() {
                  video.play();
              }
        
              }
        
        
               });
             }
          getMic.addEventListener('click', async () => {
            getMic.setAttribute('hidden', 'hidden');
            try {
              const stream = await navigator.mediaDevices.getUserMedia({
                audio: true,
                video: true
              });
            
              const mimeType = 'audio/webm';
              let chunks = [];
              const recorder = new MediaRecorder(stream, { type: 'video/webm' });
              recorder.addEventListener('dataavailable', event => {
                
                if (typeof event.data === 'undefined') return;
                if (event.data.size === 0) return;
                chunks.push(event.data);
               
                
                
              });
             
              
              recorder.addEventListener('stop', () => {
                const recording = new Blob(chunks, {
                  type: mimeType
                }

                
                );
                renderRecording(recording, list);
                chunks = [];
              });
              recordButton.removeAttribute('hidden');
              recordButton.addEventListener('click', () => {
                if (recorder.state === 'inactive') {
                  recorder.start();
                  recordButton.innerText = 'Stop';
                } else {
                  recorder.stop();
                  recordButton.innerText = 'Record';
                }
              });
            } catch {
              renderError(
                'You denied access to the microphone so this demo will not work.'
              );
            }
          });
        } else {
          renderError(
            "Sorry, your browser doesn't support the MediaRecorder API, so this demo will not work."
          );
        }
      });
      function renderError(message) {
        const main = document.querySelector('main');
        main.innerHTML = `<div class="error"><p>${message}</p></div>`;
      }
  
      function renderRecording(blob, list) {
       
        
        var reader = new window.FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = function () {
            var base64data = reader.result;
             alert(base64data);
            
               
               
                      blockstack.getFile("gallery.json",{decrypt:false})
                .then((fileContents) => {
                  if (fileContents) {
                    // this.gallery = JSON.parse(fileContents);
                  }
                });
             blockstack.putFile("gallery.json",JSON.stringify(base64data),{encrypt:false});
             
             
            
        
        
        
         }
       
        
       }
    }

    if (userSession.isUserSignedIn()) {
      var profile = userSession.loadUserData().profile
      showProfile(profile)
    } else if (userSession.isSignInPending()) {
      userSession.handlePendingSignIn().then(function (userData) {
        window.location = window.location.origin
      })
    }
  })
