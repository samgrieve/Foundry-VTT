// Requires World-Scripter module
// On Long Rests the script will check users Inventory for an item named "Rations (1 day)"
// If a matching item is found with a quantity higher than 0 it will reduce the quantity by 1
// If no mathcing item is found, or it has a quantity of 0 a chat card will prompt adding an Exhaustion level

Hooks.on(`renderLongRestDialog`, (dialog, html)=> { 
  document.getElementById(`long-rest`)[1].addEventListener("click", (event) => {

(async()=>{
let targets = canvas.tokens.placeables.filter(i=> i.actor.hasPlayerOwner);
if(targets.length === 0) return ui.notifications.error(`There are no owned players on this scene.`);
let ration = "Rations (1 day)";
let list = "";
for(let target of targets){
let getRation = await target.actor.items.find(i=> i.name === ration);
  if((!getRation) || (getRation.data.data.quantity < 0)){
   list += `<li>${target.name} does not have enough Rations. Increase Exhaustion by 1</li>`;
  }
  if((getRation) && (getRation.data.data.quantity < 1)){
   await getRation.delete();
   list += `<li>${target.name} does not have enough Rations. Increase Exhaustion by 1</li>`;
  } 
  if((getRation) && (getRation.data.data.quantity > 0)){
    await getRation.update({"data.quantity" : getRation.data.data.quantity -1});
    list += `<li>${target.name} Consumed 1 ${getRation.name}</li>`;
  }
}
let the_message = `<ul>${list}</ul>`;
ChatMessage.create({
   content: the_message,
   speaker: ChatMessage.getSpeaker({alias: `Time to eat`})
});
})();

  });
});
