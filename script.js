import Select from "./select.js"

const selectelements=document.querySelectorAll("[data-custom]")
selectelements.forEach((selectelement)=>{
  new Select(selectelement);
})
