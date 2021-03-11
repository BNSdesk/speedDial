//          search section, Google/DuckDuckGo

let duckGo = document.getElementById("duckgo")
let inputDg = document.getElementById("input-dg")

let ggle = document.getElementById("ggle")
let inputGo = document.getElementById("input-go")

ggle.addEventListener("submit", (t) => {
    t.preventDefault();
    window.open("https://www.google.com/search?q=" + inputGo.value, target="_parent");

    document.getElementById("input-go").value = "";
    document.getElementById("input-dg").value = "";
})

duckGo.addEventListener("submit", (t) => {
    t.preventDefault()
    window.open("https://duckduckgo.com/?q=" + inputDg.value, target="_parent");

    document.getElementById("input-dg").value = "";
    document.getElementById("input-go").value = "";
})


//                  CENTER SPEED DIAL  

var container = document.querySelector('.container');
var addDialBtn = document.querySelector('#add-dial-btn');
var centralModal = document.querySelector('#central-modal');
var hideModalBtn = document.querySelector("#close-btn-modal");
var transparentBG = document.querySelector('#transparent-bg');

function showAddModal (){

document.querySelector('#name-input').value = "";
document.querySelector('#link-input').value = "";

  centralModal.style.display = "block";
  container.style.filter = "blur(2px)";
  transparentBG.style.display = "block";
}

function hideModal(){
  centralModal.style.display = "none";
  container.style.filter = "none";
  transparentBG.style.display = "none";

  document.querySelector(".input-warning").style.display = "none";
  document.querySelector('#name-input').value = "";
  document.querySelector('#link-input').value = "";
}

addDialBtn.addEventListener('click', showAddModal);
hideModalBtn.addEventListener('click', hideModal);


// INIT

var speedDialLive = JSON.parse(localStorage.getItem("speeddial"));
  if (speedDialLive === null) {
      speedDialLive = [];
  } else {
    for (let i = 0; i < speedDialLive.length; i++) {
      const dial = speedDialLive[i];
      renderDialOnScreen(dial);
    }
};

var speedDialCounter = localStorage.getItem("speedDialCounter");
if (speedDialCounter === null) {
    speedDialCounter = 0;
};


// save new dial from input

function saveNewDial () {

  let nameInput = document.querySelector('#name-input');
  let linkInput = document.querySelector('#link-input');
  let alertModal = document.querySelector(".input-warning");

  if (nameInput.value === "" || linkInput.value === "") {
    alertModal.style.display = "block";
    return;
  }

  var linkIn = linkInput.value;
  if(linkInput.value.includes('http://') === true){
    var linkIn = linkInput.value.replace('http://', "");
  }
  if(linkInput.value.includes('https://') === true){
    var linkIn = linkInput.value.replace('https://', "");
  }

  let newItem = {
    name: nameInput.value,
    link: linkIn,
    id: speedDialCounter,
  };

  nameInput.value = "";
  linkInput.value = "";

  alertModal.style.display = "none";
  centralModal.style.display = "none";

  speedDialLive.push(newItem);
  speedDialCounter++;

  localStorage.setItem("speedDialCounter",parseInt(speedDialCounter));
  localStorage.setItem("speeddial", JSON.stringify(speedDialLive));

  container.style.filter = "none";

  renderDialOnScreen(newItem);
}

let saveDial = document.querySelector('#place-btn-modal');
saveDial.addEventListener("click", saveNewDial);

centralModal.addEventListener('keypress', function (e) {
  if (e.key === 'Enter') {
    saveNewDial();
  }
});


// Create and save new dial

function renderDialOnScreen(dial) {

  // Create dial element

  var dialElement = document.createElement('div');
  dialElement.id = "speed-card-item-" + dial.id;
  dialElement.className = "speed-card-item";
  
  var a = document.createElement('a');
  a.className = "speed-card-link";
  a.href = 'http://' + dial.link;
  dialElement.appendChild(a);
  
  var bigLetterDiv = document.createElement('div');
  bigLetterDiv.className = "big-letter";
  var bigLetterP = document.createElement('p');
  var textLetter = document.createTextNode(dial.name.slice(0, 1));
  
  bigLetterP.appendChild(textLetter);
  bigLetterDiv.appendChild(bigLetterP);
  a.appendChild(bigLetterDiv);
  
  var cardInfo = document.createElement('div');
  cardInfo.className = "card-info";
  var cardNameP = document.createElement('p');
  var textName = document.createTextNode(dial.name);
  cardNameP.appendChild(textName);
  cardInfo.appendChild(cardNameP);
  
  var nameH6 = document.createElement('h5');
  var textH6 = document.createTextNode(dial.link);
  nameH6.appendChild(textH6);
  cardInfo.appendChild(nameH6);
  a.appendChild(cardInfo);

  // menu buttons in showndial divElement

  var cardMenuBtn = document.createElement('button');
  cardMenuBtn.className = "item-short-menu";
  cardMenuBtn.id = "item-short-menu-" + dial.id;
  cardMenuBtn.addEventListener('click', toggleShortMenu, false);
  cardMenuBtn.addEventListener('mouseout', toggleShortMenuOut, false);
  dialElement.appendChild(cardMenuBtn);

  var cardEditBtn = document.createElement('button');
  cardEditBtn.className = "speed-card-edit";
  cardEditBtn.id = "speed-card-edit-" + dial.id;
  cardEditBtn.addEventListener('click', editDialItem, false);
  // cardEditBtn.addEventListener('mouseout', toggleShortMenuOut, false);
  dialElement.appendChild(cardEditBtn);

  var cardDeleteBtn = document.createElement('button');
  cardDeleteBtn.className = "speed-card-delete";
  cardDeleteBtn.id = "speed-card-delete-" + dial.id;
  cardDeleteBtn.setAttribute = ("speed-card-delete", dial.delete);
  cardDeleteBtn.addEventListener('click', deleteDialItem, false);
  dialElement.appendChild(cardDeleteBtn);

  let speedCard = document.querySelector('#speed-card');

  speedCard.appendChild(dialElement);
};


// speed dial item menu trigger

function toggleShortMenu(e){

  let aa = e.target.id.slice(16, Infinity);
  let editBtn = document.querySelector("#speed-card-edit-"+aa);
  let deleteBtn = document.querySelector("#speed-card-delete-"+aa);

  editBtn.style.display = "block";
  deleteBtn.style.display = "block";
};
function toggleShortMenuOut(e){
  let aa = e.target.id.slice(16, Infinity);
  let editBtn = document.querySelector("#speed-card-edit-"+aa);
  let deleteBtn = document.querySelector("#speed-card-delete-"+aa);

  setTimeout(function(){
    editBtn.style.display = 'none';
    deleteBtn.style.display = "none";
  }, 4000)
};


// dial edit functions

var replaceBtnModal = document.querySelector('#replace-btn-modal');
var placeBtnModal = document.querySelector('#place-btn-modal');
var nameInput = document.querySelector('#name-input');
var linkInput = document.querySelector('#link-input');
var indexOf;

function editDialItem(e){
  function setEditModal(trg){
    var indexOfItemToEdit = 0;
    centralModal.style.display = "block";
    placeBtnModal.style.display = "none";
    replaceBtnModal.style.display = "inline-block";

    var targetNumber = trg.target.id.slice(16, Infinity);

    for (var i = 0; i < speedDialLive.length; i++) {
      const ee = speedDialLive[i];
      if (targetNumber == ee.id) {
        var indexOfItemToEdit = speedDialLive.indexOf(ee);
        nameInput.value = speedDialLive[indexOfItemToEdit].name;
        linkInput.value = speedDialLive[indexOfItemToEdit].link;
        indexOf = indexOfItemToEdit;
      };
    };
  };
setEditModal(e);
};

replaceBtnModal.addEventListener('click', function(){

  let newNameInput = document.querySelector('#name-input');
  let newLinkInput = document.querySelector('#link-input');

  speedDialLive[indexOf].name = newNameInput.value;
  speedDialLive[indexOf].link = newLinkInput.value;

  localStorage.setItem("speeddial", JSON.stringify(speedDialLive));

  let speedCard = document.querySelector('#speed-card');
  let childNodeInSpeedCard = speedCard.children[indexOf];
  let bigLetter = newNameInput.value.slice(0,1);

  childNodeInSpeedCard.childNodes[0].innerHTML =
      `<div class=\"big-letter\"><p>${bigLetter}</p></div>
      <div class=\"card-info\"><p>${newNameInput.value}</p>
      <h6>${newLinkInput.value}</h6></div>`;

  childNodeInSpeedCard.childNodes[0].href =`${newLinkInput.value}`;

  centralModal.style.display = "none";
  placeBtnModal.style.display = "inline-block";
  replaceBtnModal.style.display = "none";
  targetNumber = '';
  indexOf = '';
});

// dial delete functions

function deleteDialItem(dial){

  if (confirm('Delete this link?')) {
    let aa = dial.target.id.slice(18, Infinity);
    for (var i = 0; i < speedDialLive.length; i++) {
      const e = speedDialLive[i];
      if (aa == e.id) {
      let indexOfItemToDel = speedDialLive.indexOf(e);
      speedDialLive.splice(indexOfItemToDel, 1);
      localStorage.setItem("speeddial", JSON.stringify(speedDialLive));
      }
    }
    dial.target.parentElement.remove();
  }
};


// BURGER menu

var burgerMenu = document.querySelector('#burger-menu');
var burgerItems = document.querySelector('#burger-items');
var speedDialData = document.querySelector('#speeddial-data');
var speedDialLinks = document.querySelector('#speeddial-links');
var speeddialImport = document.querySelector('#speeddial-import');
var importBtn = document.querySelector("#speeddial-import-btn");
var about = document.querySelector('#about');
var aboutClass = document.querySelector('.about');

burgerMenu.addEventListener('click', () => {
    burgerItems.style.display = "block";
    transparentBG.style.display = "block";
})
transparentBG.addEventListener('click', () => {
    burgerItems.style.display = "none";
    transparentBG.style.display = "none";
    aboutClass.style.display = "none";

    centralModal.style.display = "none";
    container.style.filter = "none";
})
about.addEventListener('click', () => {
  aboutClass.style.display = "block";
  transparentBG.style.display = "block";
  burgerItems.style.display = "none";
})
importBtn.addEventListener('click', () => {
  speeddialImport.click();
})


// Export speed dial as .txt file, download #1

function downloadasTextFile(filename, text) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + text);
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click(); 
    document.body.removeChild(element);
}
speedDialData.addEventListener("click", function(){
  var text = localStorage.getItem("speeddial");
  var saveText = "b_launcher_data"+text;
  var filename = "b_launcher_data.txt";
  
  downloadasTextFile(filename, saveText);
  burgerItems.style.display = "none";
}, false);


// Export links only as .txt file, download #2

speedDialLinks.addEventListener("click", function(){

  let lsElement = JSON.parse(localStorage.getItem("speeddial"));
  let myArry = [];
    for (let i = 0; i < lsElement.length; i++) {
      var items = lsElement[i];
      var eachLink = `${items.link}\n`;
      myArry.push(eachLink);
    }
  let expText = myArry.toString().replace(/,/g,'');
  let textFIleContent = `B-launcher links: \n \n${expText}`;
  let filename = "B-dial_links.txt";

  burgerItems.style.display = "none";
  transparentBG.style.display = "none";    
  downloadasTextFile(filename, textFIleContent);
}, false);


// IMport speed dial file

speeddialImport.addEventListener('change', () => {
  let files = speeddialImport.files;
  if(files.lenght == 0) return;

  const file = files[0];
  let reader = new FileReader();
  reader.onload = (e) => {
    const file = e.target.result;
    var checkFile = file.slice(0, 15);

    if(checkFile === "b_launcher_data"){
      var workFile = file.slice(15, Infinity);
    }
    let dial = JSON.parse(workFile);

    for (let i = 0; i < dial.length; i++) {
      const Rdial = dial[i];
      importDials(Rdial)
    }
    burgerItems.style.display = "none";
    transparentBG.style.display = "none";
  }
  // reader.onerror = (e) => alert(e.target.error.name);
  reader.readAsText(file);
});

function importDials(dial) {
  let name = dial.name;
  let link = dial.link;

  let importedItem = {
    name: name,
    link: link,
    id: speedDialCounter,
  };
  speedDialLive.push(importedItem);
  speedDialCounter++;

  localStorage.setItem("speedDialCounter",parseInt(speedDialCounter));
  localStorage.setItem("speeddial", JSON.stringify(speedDialLive));

  renderDialOnScreen(importedItem);
};


/*     DIGITAL CLOCK    */

function displayTime() {
  var dateObject = new Date();
  var dayArray = new Array("Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"); 
  var monthArray = new Array("January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"); 
  var day = dateObject.getDay();
  var month = dateObject.getMonth();
  var dateDiv = document.getElementById("the-date");
  dateDiv.innerText =   " " + dateObject.getFullYear() + " " + monthArray[month] + " " + dateObject.getDate() + ", "+ dayArray[day] + " ";
  
  var currentTime = new Date();
  var hours = currentTime.getHours();
  var minutes = currentTime.getMinutes();
  if (hours === 0) 
  { hours = 12;}
  if(hours < 10) 
  { hours = "0" + hours;}
  if(minutes < 10) 
  {minutes = "0" + minutes;}
  var clockDiv = document.getElementById("clock"); 
      clockDiv.innerText = hours + ":" + minutes;
}
displayTime()
setInterval(displayTime, 1000); 

function displayTimeSec() {
  var currentTime = new Date();
  var seconds = currentTime.getSeconds();
  if(seconds < 10)
  { seconds = "0" + seconds;}
  var secondsDiv = document.getElementById("seconds-s");
      secondsDiv.innerText = seconds; 
}
displayTimeSec()
setInterval(displayTimeSec, 1000); 












