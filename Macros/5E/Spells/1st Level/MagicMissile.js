// Item macro, Midi-qol On Use. This handles damage, so remove it from the spell card.

(async()=>{
async function wait(ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}
let level = 2 + Number(args[0].spellLevel);
if (args[0].targets.length === 1){
let target = canvas.tokens.get(args[0].targets[0]._id);
let damageRoll = new Roll(`(1d4[arcane] +1)*${level}`).roll();
game.dice3d.showForRoll(damageRoll);
new MidiQOL.DamageOnlyWorkflow(actor, token, damageRoll.total, "arcane", [target], damageRoll, {itemCardId: args[0].itemCardId})
let damage_target = `<div class="midi-qol-flex-container"><div>hits</div><div class="midi-qol-target-npc midi-qol-target-name" id="${target.id}"> ${target.name}</div><div><img src="${target.data.img}" width="30" height="30" style="border:0px"></div></div>`;
await wait(1000);
let damage_results = `<div><div class="midi-qol-nobox">${damage_target}</div></div>`;
const chatMessage = await game.messages.get(args[0].itemCardId);
let content = await duplicate(chatMessage.data.content);
const searchString =  '<div class="midi-qol-hits-display"><div class="end-midi-qol-hits-display"></div></div>';
const replaceString = `<div class="midi-qol-hits-display"><div class="end-midi-qol-hits-display">${damage_results}</div></div>`;
content = await content.replace(searchString, replaceString);
await chatMessage.update({content: content});
}
if (args[0].targets.length > 1){
let targetList = "";
let all_targets = args[0].targets;
for (let target of all_targets) {
   targetList += `<tr><td>${target.name}</td><td><input type="num" id="target" min="0" max="${level}" name="${target._id}"></td></tr>`;
}
let the_content = `<p>You have currently <b>${level}</b> total Magic Missle bolts.</p><form class="flexcol"><table width="100%"><tbody><tr><th>Target</th><th>Number Bolts</th></tr>${targetList}</tbody></table></form>`;
new Dialog({
		title: "Magic Missle Damage",
		content: the_content,
		buttons: {
		one: { label: "Damage", callback: async (html) => {
		let spentTotal = 0;
		let selected_targets = html.find('input#target');
		for(let get_total of selected_targets){
		spentTotal += Number(get_total.value);
		}
		if (spentTotal > level) return ui.notifications.error(`The spell fails, You assigned more bolts then you have.`);
		let damage_target = [];
		let attack_target = [];
		let damageRoll = new Roll(`1d4 +1`).roll();
		for(let selected_target of selected_targets){
		let damageNum = selected_target.value;
		if (damageNum != null){
		let target_id = selected_target.name;
		let get_target = canvas.tokens.get(target_id);
		if (!!game.modules.get("dice-so-nice")) game.dice3d.showForRoll(damageRoll);
        let totalDamage = damageNum * damageRoll.total;
		new MidiQOL.DamageOnlyWorkflow(actor, token, totalDamage, "arcane", [get_target], damageRoll, {itemCardId: args[0].itemCardId});
		damage_target.push(`<div class="midi-qol-flex-container"><div>hits</div><div class="midi-qol-target-npc midi-qol-target-name" id="${get_target.id}"> ${get_target.name}</div><div><img src="${get_target.data.img}" width="30" height="30" style="border:0px"></div></div>`);
		  }
		}
		let damage_list = damage_target.join('');
        await wait(2000);
        let damage_results = `<div><div class="midi-qol-nobox">${damage_list}</div></div>`;
        const chatMessage = await game.messages.get(args[0].itemCardId);
        let content = await duplicate(chatMessage.data.content);
		const searchString =  '<div class="midi-qol-hits-display"><div class="end-midi-qol-hits-display"></div></div>';
		const replaceString = `<div class="midi-qol-hits-display"><div class="end-midi-qol-hits-display">${damage_results}</div></div>`;
        content = await content.replace(searchString, replaceString);
        await chatMessage.update({content: content});
		}
	  }
    }
}).render(true);
}
})();
