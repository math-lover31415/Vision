// checks which radio button is on and sends a message to background accordingly

function checkButton(){
  normalButton = document.getElementById("normalButton")
  if (normalButton != null){
    if (normalButton.checked){
      localStorage.setItem("inputText", "normal");
      let params = {
        active: true
        
      }
      chrome.tabs.query(params, gotTabs);
      function gotTabs(tabs) {
        let msg = {
          mode: "normal"
        }
        chrome.tabs.sendMessage(tabs[0].id, msg);
      }
      
    }
    if (proButton.checked){
      localStorage.setItem("inputText", "pro");
      let params = {
        active: true
        
      }
      chrome.tabs.query(params, gotTabs);
      function gotTabs(tabs) {
        let msg = {
          mode: "pro"
        }
        chrome.tabs.sendMessage(tabs[0].id, msg);
      }
      
    }
    if (deuButton.checked){
      localStorage.setItem("inputText", "deu");
      let params = {
        active: true
        
      }
      chrome.tabs.query(params, gotTabs);
      function gotTabs(tabs) {
        let msg = {
          mode: "deu"
        }
        chrome.tabs.sendMessage(tabs[0].id, msg);
      }
      
    }
    if (triButton.checked){
      localStorage.setItem("inputText", "tri");
      let params = {
        active: true
        
      }
      chrome.tabs.query(params, gotTabs);
      function gotTabs(tabs) {
        let msg = {
          mode: "tri"
        }
        chrome.tabs.sendMessage(tabs[0].id, msg);
      }
    }
  }
}

// sends a message to the background to refresh the page

function sendRefresh() {
  let params = {
    active: true
    
  }
  chrome.tabs.query(params, gotTabs);
  function gotTabs(tabs) {
    let message = "hi";
    let ref = {
      yes: "refresh"
    }
    chrome.tabs.sendMessage(tabs[0].id, ref);
  }
  localStorage.setItem("sliderValue", 100);

}

// saves last radio input for later use

function setItem(){
  if (normalButton != null){
    if (normalButton.checked){
      localStorage.setItem("inputText", "normal");
    }
    if (proButton.checked){
      localStorage.setItem("inputText", "pro");
    }
    if (deuButton.checked){
      localStorage.setItem("inputText", "deu");
    }
    if (triButton.checked){
      localStorage.setItem("inputText", "tri");
    }
  }
}


addEventListener('click', setItem);

// send a background refresh on any click of radio 

window.addEventListener("load", function() {
  var normalButton = document.getElementById("normalButton");
  normalButton.addEventListener('click', sendRefresh);
});
window.addEventListener("load", function() {
  var proButton = document.getElementById("proButton");
  proButton.addEventListener('click', sendRefresh);
});
window.addEventListener("load", function() {
  var deuButton = document.getElementById("deuButton");
  deuButton.addEventListener('click', sendRefresh);
});
window.addEventListener("load", function() {
  var triButton = document.getElementById("triButton");
  triButton.addEventListener('click', sendRefresh);
});



// instant colorize 

addEventListener('click', function() {
  setTimeout(checkButton, 400);
});

addEventListener('click', function() {
  setTimeout(checkButton, 500);
});

addEventListener('click', function() {
  setTimeout(checkButton, 600);
});

addEventListener('click', function() {
  setTimeout(checkButton, 700);
});

addEventListener('click', function() {
  setTimeout(checkButton, 800);
});

addEventListener('click', function() {
  setTimeout(checkButton, 900);
});

addEventListener('click', function() {
  setTimeout(checkButton, 1000);
});

addEventListener('click', function() {
  setTimeout(checkButton, 1100);
});

addEventListener('click', function() {
  setTimeout(checkButton, 1200);
});

addEventListener('click', function() {
  setTimeout(checkButton, 1300);
});

addEventListener('click', function() {
  setTimeout(checkButton, 1400);
});

addEventListener('click', function() {
  setTimeout(checkButton, 1500);
});

addEventListener('click', function() {
  setTimeout(checkButton, 2000);
});

addEventListener('click', function() {
  setTimeout(checkButton, 5000);
});

// instant colorize ^^



// update radio button to last saved input


function updateRadio() {
  var title = document.getElementById('title');
  if (title != null){
    if (localStorage.getItem("inputText") == "normal"){
      document.getElementById("normalButton").checked = true;
    }
    else if (localStorage.getItem("inputText") == "pro") {
      document.getElementById("proButton").checked = true;
  
    }
    else if (localStorage.getItem("inputText") == "deu") {
      document.getElementById("deuButton").checked = true;
  
    }
    else if (localStorage.getItem("inputText") == "tri") {
      document.getElementById("triButton").checked = true;
  
    }
  }
}

setInterval(updateRadio, 100)


// update slider value on change

var slider = document.getElementById("satSlider");
var sliderText = document.getElementById("sliderText");
sliderText.innerHTML = 100;

slider.oninput = function() {
  
  var value = this.value;
  sliderText.innerHTML = this.value;
  localStorage.setItem("sliderValue", value);

  let params = {
    active: true
    
  }
  chrome.tabs.query(params, gotTabs);
  function gotTabs(tabs) {
    let sat = {
      saturation: value
    }
    chrome.tabs.sendMessage(tabs[0].id, sat);
  }

}

// update slider to last saved input

function updateSlider() {
  var title = document.getElementById('title');
  if (title != null){
    var value = localStorage.getItem("sliderValue");
    document.getElementById("satSlider").value = value;
    document.getElementById("sliderText").innerHTML = value;
    }
}

setInterval(updateSlider, 100)


// info button functionality 

// Add an event listener to the window's load event
window.addEventListener("load", function() {
  // Get a reference to the image element
  var infoButton = document.getElementById("info");

  // Add an event listener to the image
  infoButton.addEventListener("click", function() {
    // The image was clicked
    
    alert("Protanopia (red-blind) corrects for red-green color blindness.\n\n Deuteranopia (green-blind) corrects for red-green color blindness. \n \n Tritanopia corrects for blue-yellow color blindness. \n \n Created by Nicholas Lago")
  });
});
