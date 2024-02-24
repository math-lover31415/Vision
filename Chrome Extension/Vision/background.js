// Color Vision Deficiency Matrix used for daltonizing images 
var CVDMatrix = { 
	"Protanopia": [ 
		0.0, 2.02344, -2.52581,
		0.0, 1.0,      0.0,
		0.0, 0.0,      1.0
	],
	"Deuteranopia": [ 
		1.0,      0.0, 0.0,
		0.494207, 0.0, 1.24827,
		0.0,      0.0, 1.0
	],
	"Tritanopia": [ 
		1.0,       0.0,      0.0,
		0.0,       1.0,      0.0,
		-0.395913, 0.801109, 0.0
	]
};

// called when normal radio button is checked

function normalImgs() {
      // refreshes page and sets all images back to original source
}
      

// called when protanopia radio button is checked
// daltonizes images to corrected for protanopia color blindness using the CVD Matrix

function proImgs() {
    
    const imgs = document.getElementsByTagName("img");

    for (var i = 0; i < imgs.length; i++) {
      if (!imgs[i].alt.endsWith("Protanopia")) {
        if (imgs[i].width > 0 && imgs[i].height > 0) {
            imgs[i].crossOrigin = "Anonymous";
            var canvas = document.createElement('canvas');
            canvas.width = imgs[i].width;
            canvas.height = imgs[i].height;
            var ctx = canvas.getContext('2d');
            ctx.drawImage(imgs[i], 0, 0, canvas.width, canvas.height);
            var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            var data = imageData.data;
          
            var cvd = CVDMatrix["Protanopia"],
              cvd_a = cvd[0],
              cvd_b = cvd[1],
              cvd_c = cvd[2],
              cvd_d = cvd[3],
              cvd_e = cvd[4],
              cvd_f = cvd[5],
              cvd_g = cvd[6],
              cvd_h = cvd[7],
              cvd_i = cvd[8];
            var L, M, S, l, m, s, R, G, B, RR, GG, BB;

            if (!data.every(x => x === 0)) {
              for(var j = 0, length = data.length; j < length; j += 4) {
                var r = data[j],
                  g = data[j + 1],
                  b = data[j + 2];
                // RGB to LMS matrix conversion
                L = (17.8824 * r) + (43.5161 * g) + (4.11935 * b);
                M = (3.45565 * r) + (27.1554 * g) + (3.86714 * b);
                S = (0.0299566 * r) + (0.184309 * g) + (1.46709 * b);
                // Simulate color blindness
                l = (cvd_a * L) + (cvd_b * M) + (cvd_c * S);
                m = (cvd_d * L) + (cvd_e * M) + (cvd_f * S);
                s = (cvd_g * L) + (cvd_h * M) + (cvd_i * S);
                // LMS to RGB matrix conversion
                R = (0.0809444479 * l) + (-0.130504409 * m) + (0.116721066 * s);
                G = (-0.0102485335 * l) + (0.0540193266 * m) + (-0.113614708 * s);
                B = (-0.000365296938 * l) + (-0.00412161469 * m) + (0.693511405 * s);
                // Isolate invisible colors to color vision deficiency (calculate error matrix)
                R = r - R;
                G = g - G;
                B = b - B;
                // Shift colors towards visible spectrum (apply error modifications)
                RR = (0.0 * R) + (0.0 * G) + (0.0 * B);
                GG = (0.7 * R) + (1.0 * G) + (0.0 * B);
                BB = (0.7 * R) + (0.0 * G) + (1.0 * B);
                // Add compensation to original values
                R = RR + r;
                G = GG + g;
                B = BB + b;
                // Clamp values
                R = Math.max(0, Math.min(255, R))
                G = Math.max(0, Math.min(255, G))
                B = Math.max(0, Math.min(255, B))

                // Record color
                data[j] = R >> 0;
                data[j + 1] = G >> 0;
                data[j + 2] = B >> 0;
              }
              

              ctx.putImageData(imageData, 0, 0);
              var dataUrl = canvas.toDataURL();
              imgs[i].src = dataUrl;
              imgs[i].setAttribute("alt", imgs[i].alt + " - Corrected for Protanopia")
            
            }
          }         
        }
      }
          
}

// called when deuteranopia radio button is checked
// daltonizes images to corrected for deuteranopia color blindness using the CVD Matrix

function deuImgs(){
    const imgs = document.getElementsByTagName("img");

    for (var i = 0; i < imgs.length; i++) {
      if (!imgs[i].alt.endsWith("Deuteranopia")) {
        if (imgs[i].width > 0 && imgs[i].height > 0) {
          imgs[i].crossOrigin = "Anonymous";
          var canvas = document.createElement('canvas');
          canvas.width = imgs[i].width;
          canvas.height = imgs[i].height;
          var ctx = canvas.getContext('2d');
          ctx.drawImage(imgs[i], 0, 0, canvas.width, canvas.height);
          var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          var data = imageData.data;

          var cvd = CVDMatrix["Deuteranopia"],
            cvd_a = cvd[0],
            cvd_b = cvd[1],
            cvd_c = cvd[2],
            cvd_d = cvd[3],
            cvd_e = cvd[4],
            cvd_f = cvd[5],
            cvd_g = cvd[6],
            cvd_h = cvd[7],
            cvd_i = cvd[8];
          var L, M, S, l, m, s, R, G, B, RR, GG, BB;
        
          if (!data.every(x => x === 0)) {
            for(var j = 0, length = data.length; j < length; j += 4) {
              var r = data[j],
                g = data[j + 1],
                b = data[j + 2];
              // RGB to LMS matrix conversion
              L = (17.8824 * r) + (43.5161 * g) + (4.11935 * b);
              M = (3.45565 * r) + (27.1554 * g) + (3.86714 * b);
              S = (0.0299566 * r) + (0.184309 * g) + (1.46709 * b);
              // Simulate color blindness
              l = (cvd_a * L) + (cvd_b * M) + (cvd_c * S);
              m = (cvd_d * L) + (cvd_e * M) + (cvd_f * S);
              s = (cvd_g * L) + (cvd_h * M) + (cvd_i * S);
              // LMS to RGB matrix conversion
              R = (0.0809444479 * l) + (-0.130504409 * m) + (0.116721066 * s);
              G = (-0.0102485335 * l) + (0.0540193266 * m) + (-0.113614708 * s);
              B = (-0.000365296938 * l) + (-0.00412161469 * m) + (0.693511405 * s);
              // Isolate invisible colors to color vision deficiency (calculate error matrix)
              R = r - R;
              G = g - G;
              B = b - B;
              // Shift colors towards visible spectrum (apply error modifications)
              RR = (0.0 * R) + (0.0 * G) + (0.0 * B);
              GG = (0.7 * R) + (1.0 * G) + (0.0 * B);
              BB = (0.7 * R) + (0.0 * G) + (1.0 * B);
              // Add compensation to original values
              R = RR + r;
              G = GG + g;
              B = BB + b;
              // Clamp values
              R = Math.max(0, Math.min(255, R))
              G = Math.max(0, Math.min(255, G))
              B = Math.max(0, Math.min(255, B))

              // Record color
              data[j] = R >> 0;
              data[j + 1] = G >> 0;
              data[j + 2] = B >> 0;
            }
            // Record data
            
            ctx.putImageData(imageData, 0, 0);
            var dataUrl = canvas.toDataURL();
            imgs[i].src = dataUrl;
            imgs[i].setAttribute("alt", imgs[i].alt + " - Corrected for Deuteranopia")
          }
        }         
      }
    }
}

// called when tritanopia radio button is checked
// daltonizes images to corrected for tritanopia color blindness using the CVD Matrix

function triImgs(){
  const imgs = document.getElementsByTagName("img");

  for (var i = 0; i < imgs.length; i++) {
    if (!imgs[i].alt.endsWith("Tritanopia")) {
      if (imgs[i].width > 0 && imgs[i].height > 0) {
        imgs[i].crossOrigin = "Anonymous";
        var canvas = document.createElement('canvas');
        canvas.width = imgs[i].width;
        canvas.height = imgs[i].height;
        var ctx = canvas.getContext('2d');
        ctx.drawImage(imgs[i], 0, 0, canvas.width, canvas.height);
        var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        var data = imageData.data;

        var cvd = CVDMatrix["Tritanopia"],
            cvd_a = cvd[0],
            cvd_b = cvd[1],
            cvd_c = cvd[2],
            cvd_d = cvd[3],
            cvd_e = cvd[4],
            cvd_f = cvd[5],
            cvd_g = cvd[6],
            cvd_h = cvd[7],
            cvd_i = cvd[8];
          var L, M, S, l, m, s, R, G, B, RR, GG, BB;
      
        if (!data.every(x => x === 0)) {
          for(var j = 0, length = data.length; j < length; j += 4) {
            var r = data[j],
              g = data[j + 1],
              b = data[j + 2];
            // RGB to LMS matrix conversion
            L = (17.8824 * r) + (43.5161 * g) + (4.11935 * b);
            M = (3.45565 * r) + (27.1554 * g) + (3.86714 * b);
            S = (0.0299566 * r) + (0.184309 * g) + (1.46709 * b);
            // Simulate color blindness
            l = (cvd_a * L) + (cvd_b * M) + (cvd_c * S);
            m = (cvd_d * L) + (cvd_e * M) + (cvd_f * S);
            s = (cvd_g * L) + (cvd_h * M) + (cvd_i * S);
            // LMS to RGB matrix conversion
            R = (0.0809444479 * l) + (-0.130504409 * m) + (0.116721066 * s);
            G = (-0.0102485335 * l) + (0.0540193266 * m) + (-0.113614708 * s);
            B = (-0.000365296938 * l) + (-0.00412161469 * m) + (0.693511405 * s);
            // Isolate invisible colors to color vision deficiency (calculate error matrix)
            R = r - R;
            G = g - G;
            B = b - B;
            // Shift colors towards visible spectrum (apply error modifications)
            RR = (0.0 * R) + (0.0 * G) + (0.0 * B);
            GG = (0.7 * R) + (1.0 * G) + (0.0 * B);
            BB = (0.7 * R) + (0.0 * G) + (1.0 * B);
            // Add compensation to original values
            R = RR + r;
            G = GG + g;
            B = BB + b;
            // Clamp values
            R = Math.max(0, Math.min(255, R))
            G = Math.max(0, Math.min(255, G))
            B = Math.max(0, Math.min(255, B))

            // Record color
            data[j] = R >> 0;
            data[j + 1] = G >> 0;
            data[j + 2] = B >> 0;
          }
          ctx.putImageData(imageData, 0, 0);
          var dataUrl = canvas.toDataURL();
          imgs[i].src = dataUrl;
          imgs[i].setAttribute("alt", imgs[i].alt + " - Corrected for Tritanopia")
        
        }
      }         
    }
  }
}

function satImgs(satValue){
  const imgs = document.getElementsByTagName("img");
  for (var i = 0; i< imgs.length; i++){
    imgs[i].style.filter = "saturate(" + String(satValue) + "%)";
    }
}



chrome.runtime.onMessage.addListener(gotMessage);

chrome.runtime.onMessage.addListener(gotRefresh);

chrome.runtime.onMessage.addListener(gotSaturation);

var vision;

function gotMessage(message, sender, sendResponse) {
  vision = message.mode;
  if (vision == "normal"){
    normalImgs();
  }
  else if (vision == "pro") {
    proImgs();
  }
  else if (vision == "deu") {
    deuImgs();
  }
  else if (vision == "tri") {
    triImgs();    
  }
}

function gotRefresh(message, sender, sendResponse) {
  if (message.yes == "refresh") {
    location.reload();
  }
}

var saturation = 100;

function gotSaturation(message, sender, sendResponse) {
    if (message.saturation != undefined) {
      saturation = message.saturation;
    }
    satImgs(message.saturation);
}

function checkVision() {
  if (vision == "normal"){
    normalImgs();
  }
  else if (vision == "pro") {
    proImgs();
  }
  else if (vision == "deu") {
    deuImgs();
  }
  else if (vision == "tri") {
    triImgs();    
  }
}

function checkSaturation() {
  satImgs(saturation)
}




setInterval(checkVision, 100)

addEventListener('scroll', checkVision);
addEventListener('scroll', checkSaturation);

