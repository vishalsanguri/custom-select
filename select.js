export default class Select{
    constructor(element){

        this.element=element
        this.options=getFormattedOptions(element.querySelectorAll("option"))
        this.customElement=document.createElement("div")
        this.labelElement=document.createElement("span")
        this.optionsCustomElement=document.createElement("ul")
        setupCustomElement(this)
        this.element.style.display="none"
        this.element.after(this.customElement)
    }
    get selectedOption(){
        return this.options.find(o=>(o.selected==true))
    }
   
    selectedValue(value){
        const newselectvalue=this.options.find((option)=>{return option.value===value})
        const previousselected=this.options.find((option)=>option.selected==true)
        previousselected.selected=false
        previousselected.element.selected=false
        newselectvalue.selected=true
        newselectvalue.element.selected=true
        this.labelElement.innerText=newselectvalue.label
        
        this.optionsCustomElement.querySelector(`[data-value="${previousselected.value}"]`).classList.remove("selected")
        
        this.optionsCustomElement.querySelector(`[data-value="${newselectvalue.value}"]`).classList.add("selected")

    }
    get selectedOptionIndex(){
        return this.options.indexOf(this.selectedOption)
    }
}
function setupCustomElement(select){
    select.customElement.classList.add("custom-select-container")
    select.customElement.tabIndex=0
    // we can't focus div so to make it focus we do tabindex
    select.labelElement.classList.add("custom-select-value")

    select.customElement.append(select.labelElement)

    select.optionsCustomElement.classList.add("custom-select-options")
    
    select.labelElement.innerText=select.selectedOption.label

    select.customElement.append(select.optionsCustomElement)
    select.options.forEach((option)=>{
        const optionElement=document.createElement("li")
        optionElement.classList.add("custom-select-option")
        optionElement.innerText=option.label
        optionElement.dataset.value=option.value
        optionElement.addEventListener("click",()=>{

            select.selectedValue(option.value)
        })
        select.optionsCustomElement.append(optionElement)
    })

    select.customElement.addEventListener("click",()=>{
        select.optionsCustomElement.classList.toggle("show")
    })
    select.customElement.addEventListener("blur",()=>{
        select.optionsCustomElement.classList.remove("show")
    })
    // blur event listener removes the focus from the element.
    
    let searchTerm="";
    let debounceTimeout;
    
    
    select.customElement.addEventListener("keydown",e=>{
        switch(e.code)   {
            case "Space":{
                console.log("space")
                select.optionsCustomElement.classList.toggle("show")
                break}
            case "ArrowUp":{
                const preOption=select.options[select.selectedOptionIndex - 1]
                if(preOption){
                    select.selectedValue(preOption.value)
                }
                break}
            case "ArrowDown":{
                const nextOption=select.options[select.selectedOptionIndex + 1]
                if(nextOption){
                    select.selectedValue(nextOption.value)
                }
                break}
            default:{
                clearTimeout(debounceTimeout)
                searchTerm += e.key
                debounceTimeout=setTimeout(()=>{
                    searchTerm=""
                },500)
                console.log(searchTerm)
                const searchoption=select.options.find(option=>
                    {return option.label.toLowerCase().startsWith(searchTerm)})
                if(searchoption) select.selectedValue(searchoption.value)
            }
        } 
    })
}
function getFormattedOptions(optionElements){
    console.log(optionElements)
    var output= [...optionElements].map((optionElement)=>{
        return {
            value:optionElement.value,
            label:optionElement.label,
            selected:optionElement.selected,
            element:optionElement
        }
    })
    return output
}