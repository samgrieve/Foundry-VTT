// Want your monsters to pick random targets to go after? The attack order as follows Melee > Ranged > Find someone to attack based on movement and line of sight.
// Used in combat.

(async()=>{
if(!game.combat.started) return ui.notifications.warn(`Start a combat to use Monster Targeting.`);
canvas.activeLayer.targetObjects({}, {releaseOthers: true});
canvas.activeLayer.selectObjects({}, {releaseOthers: true});
let find_npc = await canvas.tokens.get(game.combat.current.tokenId);
let keys = Object.keys([find_npc.actor.data.data.attributes.movement]);
let values = Object.values([find_npc.actor.data.data.attributes.movement]);
let movement = values.map((item, i) => Object.assign({}, item, keys[i]))[0];
let find_range = movement.walk !== 0 ? movement.walk : movement.fly !== 0 ? movement.fly : movement.burrow !== 0 ? movement.burrow : movement.swim;
let short_range = ["mwak", "msak"];
let long_range = ["rwak", "rsak", "save", "util"];
let melee_weapon = find_npc.actor.items.filter(i=> short_range.includes(i.data.data.actionType)).sort((a,b) => a.data.data.range.value < b.data.data.range.value ? 1 : -1);
let ranged_weapon = find_npc.actor.items.filter(i=> long_range.includes(i.data.data.actionType)).sort((a,b) => a.data.data.range.long < b.data.data.range.long ? 1 : -1);
console.log(melee_weapon);
let melee_range = melee_weapon.length != 0 ? melee_weapon[0].data.data.range.long != null ? melee_weapon[0].data.data.range.long : melee_weapon[0].data.data.range.value: 0;
let ranged_range = ranged_weapon.length != 0 ? ranged_weapon[0].data.data.range.long != null ? ranged_weapon[0].data.data.range.long : ranged_weapon[0].data.data.range.value : 0;
let melee_distance = 5 + Number(melee_range);
let ranged_distance = 5 + Number(ranged_range);
let find_target = "";
let melee = canvas.tokens.placeables.filter(target => canvas.grid.measureDistance(find_npc, target)
< melee_distance && target.id != find_npc.id && target.data.disposition != find_npc.data.disposition);
console.log("List of Melee targets");
console.log(melee);
let ranged = canvas.tokens.placeables.filter(target => canvas.grid.measureDistance(find_npc, target)
< ranged_distance && target.id != find_npc.id && target.data.disposition != find_npc.data.disposition && !wall_check(find_npc, target));
console.log("List of Ranged targets");
console.log(ranged);
let no_melee = canvas.tokens.placeables.filter(target => canvas.grid.measureDistance(find_npc, target)
< find_range && target.id != find_npc.id && target.data.disposition != find_npc.data.disposition && !wall_check(find_npc, target));
console.log("List of Other targets");
console.log(no_melee);
function wall_check(find_npc, target){
let r = new Ray(find_npc.center, target.center);
return canvas.walls.checkCollision(r);
}
if(melee.length > 0){
let roll = new Roll(`1d${melee.length} -1`).roll();
find_target = melee[roll.total];
}
if((melee.length < 1) && (ranged.length > 0)){
let roll = new Roll(`1d${ranged.length} -1`).roll();
find_target = ranged[roll.total];
}
if ((melee.length < 1) && (ranged.length < 1)) {
let roll = new Roll(`1d${no_melee.length} -1`).roll();
find_target = no_melee[roll.total];
}
new Dialog({
	title: "Combat Targeting Manager",
	content: `<h2 style="text-align:center;">Targeting</h2><div style="position:relative;width:378px;height:80px;"><div style="position:relative;left:0;top:0;width:50%;"><img src="${find_npc.data.img}" height="50px;" style="display: block;margin-left: auto;margin-right: auto;"><h4 style="text-align:center">${find_npc.name}</h4></div><div style="margin: auto;position: absolute;top: 0;left: 0;bottom: 0;right: 0;"><h3 style="color:red;text-align:center;font-size: 2em;font-style: italic;z-index:2;position: absolute;top: 0;left: 0;right: 0;">Versus</h3><div style="text-align:center;color: white;font-size: 2.5rem;z-index: 1;"><i class="fas fa-fist-raised"></i></div></div><div style="position:absolute;right:0;top:0;width:50%;"><img src="${find_target.data.img}" height="50px;" style="display: block;margin-left: auto;margin-right: auto;"><h4 style="text-align:center">${find_target.name}</h4></div></div>`,
	buttons: {
        attack: {
            icon: `<i class="fas fa-skull"></i>`,
            label: "Attack!", callback: () => {
// Edit the list below to include your own lines
let adj = [
`savagely roars at`,
`scowls in anger at`,
`fumes with furious hatred at`,
`growls with rage at`,
`savagely growls at`,
`viciously grunts at`,
`howls in the air and attacks`,
`fiercely yells at`,
`guttural yells at`,
`stares menacingly at`,
`readies their attack against`,
`loathes the presence of`,
`brings malice upon`
];
                let random = Math.floor(Math.random() * (adj.length));
                find_target.setTarget(true, {releaseOthers: true});
                ChatMessage.create({
                    user: game.user._id,
                    speaker: ChatMessage.getSpeaker({token: find_npc}),
                    content: `<p><em>${find_npc.name} ${adj[random]} ${find_target.name}</em></p>`,
                    type: CONST.CHAT_MESSAGE_TYPES.EMOTE
                }, {chatBubble : true });
            }}       
    }
}).render(true);
})();
