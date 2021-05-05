// Midi-qol on use
// gets Weapon history and also prevents you from rolling if last attack was at Disadvantage
(async()=>{
  let me = args[0].actor;
  let itemD = args[0].item;
  let msgHistory = await game.messages.entities.map(i=> ({_id : i.data._id, user : i.data.user, flavor : i.data.flavor, actorId : i.data.flags["midi-qol"]?.actor, itemId : i.data.flags["midi-qol"]?.itemId})).filter(i=> i.actorId === me._id && i.flavor != itemD.name);
  if(msgHistory.length === 0) return ui.notifications.warn(`You need to successfully attack first.`);
  let lastAttack = msgHistory[msgHistory.length - 1];
  let attackHistory = MidiQOL.Workflow.getWorkflow(lastAttack.itemId);
  let target = attackHistory.hitTargets;
  if(attackHistory.disadvantage) return ui.notifications.error(`You currently have disadvantage against this target`);
  let damageType = attackHistory.defaultDamageType;
  let level = me.items.find(i=> i.name===`Rogue`).data.levels;
  let numDice = (Math.ceil(level /2));
  let damageRoll = attackHistory.isCritical ? new Roll(`${numDice *2}d6`).roll() : new Roll(`${numDice}d6`).roll();
  if(game.modules.get("dice-so-nice").active) game.dice3d.showForRoll(damageRoll);
  new MidiQOL.DamageOnlyWorkflow(actor, token, damageRoll.total, damageType, target, damageRoll, {flavor: `(${damageType})`, itemCardId: args[0].itemCardId});
  })();
