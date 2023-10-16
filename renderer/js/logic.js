const body = document.querySelector("body");
const sidebar = document.querySelector("nav");
const toggle = document.querySelector(".toggle");
const modeSwitch = document.querySelector(".toggle-switch");
const modeText = document.querySelector(".mode-text");


const fs = require('fs');
const { type } = require('os');
const path = require('path');
const { electron } = require('process');

const dictionaryPath = "./dictionaries/";

let dictionaryName = "";


toggle.addEventListener("click", () => {
  sidebar.classList.toggle("close");
});

modeSwitch.addEventListener("click", () => {
  body.classList.toggle("dark");

  modeText.innerText = body.classList.contains("dark")
    ? "Light Mode"
    : "Dark Mode";
});


document.querySelector(".popup-add-dict .popup-close-btn").addEventListener("click", function(){
  document.querySelector(".popup-add-dict").classList.remove("active")
})

document.querySelector(".popup-add-dict .popup-add-btn").addEventListener("click", function(){
  document.querySelector(".popup-add-dict").classList.remove("active")
})

document.querySelector(".popup-edit-dict .popup-close-btn").addEventListener("click", function(){
  document.querySelector(".popup-edit-dict").classList.remove("active")
})

function getDictionaryName(){
  document.querySelector(".popup-add-dict").classList.add("active");
}

function getEditForm(dictID){
  document.querySelector(".popup-edit-dict").classList.add("active");

  dictionaryName = document.getElementById(dictID).childNodes[0].nodeValue;

  document.getElementById("popup-edit-dict-h1").innerHTML = `Add a new word in ${dictionaryName}`;
  
  return dictionaryName;
} 

function getSortedDictionary(){
  directoryContent = fs.readdirSync(dictionaryPath);

  let files = directoryContent.filter((filename) => {
      return fs.statSync(`${dictionaryPath}/${filename}`).isFile();
  });

  let sorted = files.sort((a, b) => {
      let aStat = fs.statSync(`${dictionaryPath}/${a}`),
          bStat = fs.statSync(`${dictionaryPath}/${b}`);
      
      return new Date(bStat.birthtime).getTime() - new Date(aStat.birthtime).getTime();
  });

  return sorted;
}


function loadDictionary(){
  const files = getSortedDictionary();
  const box = document.getElementsByClassName("cards");

  for (file in files){
    const dictionaryItem = document.createElement("div");
    
    dictionaryItem.className = 'card';
    
    dictionaryItem.innerHTML = `
      <div class="card-name">
      <p id="dictID_${file}">${files[file]}</p>
      </div>
      <div class="card-btns">
      <button class="button" id="dictID_${file}" onclick="getEditForm(this.id)">Edit</button>
      <button class="button">Learn</button>
      </div>`;

    box[0].appendChild(dictionaryItem);
  }
}

loadDictionary();

function createDictionary()
{
  let dictName = document.querySelector("#dict-name").value;

  fs.writeFile(dictionaryPath + dictName + ".md", '', function (err) {
    if (err) throw err;
  });

  reloadDictionary();
}

function reloadDictionary(){
  const box = document.getElementsByClassName("card");

  while (box.length > 1) {
    box[1].remove();
  }

  loadDictionary();
}

function addInDictionary(){
  let dictInfo = getInputValuesByClassName("dict-info");

  fs.appendFile(dictionaryPath + dictionaryName, dictInfo.join("/") + "\n", function (err) {
    if (err) console.log(err);
    console.log('Updated!');
  }); 

  clearInput("dict-info");
}

function clearInput(className){
  const elements = document.getElementsByClassName(className);

  for (let element in elements){
    elements[element].value = "";
  }
}

function getInputValuesByClassName(className){
  let inputValues = document.getElementsByClassName(className);
  let values = [];

  for (let i = 0; i < inputValues.length; i++){
    values.push(inputValues[i].value);
  }
  return values
}

function isInputValuesEmpty(className){
  let inputValues = getInputValuesByClassName(className);
  let emptyArray = Array(inputValues.length).fill("");

  return (JSON.stringify(inputValues) === JSON.stringify(emptyArray)) ? true : false; 
}

function isDictionaryEmpty(){
  return (fs.statSync(dictionaryPath + dictionaryName).size == 0) ? true : false;
}

function previousBtn(){
  let inputValues = getInputValuesByClassName("dict-info");

  let dictContent = fs.readFileSync(dictionaryPath + dictionaryName).toString().split('\n');

  if (!isDictionaryEmpty()) {
    let dictLine = null;

    if (isInputValuesEmpty("dict-info"))
    {
      dictLine = Object.values(dictContent)[dictContent.length - 2];
    }
    else
    {
      dictLine = Object.values(dictContent)[getDictionaryWordIndex(dictContent, inputValues) - 1];
    }
    setInput(dictLine.split('/'));
  }
}

function getDictionaryWordIndex(dictContent, inputValues){
  return dictContent.indexOf(inputValues.join("/"));
}

function setInput(dictLine){
  let inputValues = document.getElementsByClassName('dict-info');
  for(line in dictLine){
    inputValues[line].value = dictLine[line];
  }
}

function nextBtn(){
  let inputValues = getInputValuesByClassName("dict-info");

  let dictContent = fs.readFileSync(dictionaryPath + dictionaryName).toString().split('\n');

  if ((!isDictionaryEmpty()) && (!isInputValuesEmpty("dict-info"))) {
    let dictLine = null;

    dictLine = Object.values(dictContent)[getDictionaryWordIndex(dictContent, inputValues) + 1];
    setInput(dictLine.split('/'));
  }
}
