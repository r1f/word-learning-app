const body = document.querySelector("body");
const sidebar = document.querySelector("nav");
const toggle = document.querySelector(".toggle");
const modeSwitch = document.querySelector(".toggle-switch");
const modeText = document.querySelector(".mode-text");

toggle.addEventListener("click", () => {
  sidebar.classList.toggle("close");
});

modeSwitch.addEventListener("click", () => {
  body.classList.toggle("dark");

  modeText.innerText = body.classList.contains("dark")
    ? "Light Mode"
    : "Dark Mode";
});

//let dictName = document.querySelector(".dictionary-name");
//dictName.innerText = files[0];

const fs = require('fs');
const files = fs.readdirSync('./dictionaries');

function addDictionary(files){
  const box = document.getElementsByClassName("box-items");

  for (file in files)
  {
    const dictionaryItem = document.createElement("div");
    dictionaryItem.className = 'box-item';
    dictionaryItem.innerHTML = `
      <div class="box-item">
      <h1 class='dictionary-name'>${files[file]}</h1>
      <p><button>Add</button></p>
      </div>`;
    box[0].appendChild(dictionaryItem);
  }
}

addDictionary(files);