//Midi-qol on use
if (args[0].failedSaves.length > 0){
    let target = canvas.tokens.get(args[0].failedSaves[0]._id);
    let classType = ["Warlock", "Wizard", "Cleric"];
    let level = args[0].actor.items.find(i=> classType.includes(i.name)).data.levels;
    let numDice = 1 + (Math.floor((level + 1) / 6));
    if (target.actor.data.data.attributes.hp.value != target.actor.data.data.attributes.hp.max){
        let damageRoll = new Roll(`${numDice}d12`).roll();
        if (!!game.modules.get("dice-so-nice")) game.dice3d.showForRoll(damageRoll);
        new MidiQOL.DamageOnlyWorkflow(actor, token, damageRoll.total, "necrotic", [target], damageRoll, {itemCardId: args[0].itemCardId});
    } else {
    let damageRoll = new Roll(`${numDice}d8`).roll();
    if (!!game.modules.get("dice-so-nice")) game.dice3d.showForRoll(damageRoll);
    new MidiQOL.DamageOnlyWorkflow(actor, token, damageRoll.total, "necrotic", [target], damageRoll, {itemCardId: args[0].itemCardId});
    }
}
