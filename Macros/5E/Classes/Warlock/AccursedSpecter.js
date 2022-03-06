const actorD = game.actors.get(args[0].actor._id);
const tokenD = canvas.tokens.get(args[0].tokenId);
const summonType = "Accursed Specter";

let updates = {
    token : {
        'name':`${summonType} of ${actorD.name}`
    },
    actor: {
        'name' : `${summonType} of ${actorD.name}`,
        'data.attributes.hp': {temp: actorD.data.data.classes.warlock.levels/2}
    },
    embedded: { Item: {
        "Life Drain":{
            'data.attackBonus': `${actorD.data.data.abilities.cha.mod}`,
        },
    }}
    
}

warpgate.spawn(summonType, updates);