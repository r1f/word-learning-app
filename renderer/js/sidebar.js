const body = document.querySelector("body");
const sidebar = document.querySelector("nav");
const toggle = document.querySelector(".toggle");
const modeSwitch = document.querySelector(".toggle-switch");
const modeText = document.querySelector(".mode-text");


const fs = require('fs');
const path = require('path');

const dictionaryPath = "./dictionaries/";


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

function getDictionaryName(){
  document.querySelector(".popup-add-dict").classList.add("active");
}


function getSorted(){
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
  const files = getSorted();
  const box = document.getElementsByClassName("cards");

  for (file in files){
    const dictionaryItem = document.createElement("div");
    
    dictionaryItem.className = 'card';
    
    dictionaryItem.innerHTML = `
      <div class="card-name">
      <p>${files[file]}</p>
      </div>
      <div class="card-btns">
      <button class="button">Edit</button>
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
