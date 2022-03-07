const actorD = game.actors.get(args[0].actor._id);
const summonType = "Accursed Specter";
const casterToken = await fromUuid(args[0].tokenUuid);

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

await warpgate.spawn(summonType, updates, {}, {

    pre: async (location, updates) => {
        // When the user has clicked where they want it

            new Sequence()
                .effect()
                    .file("jb2a.extras.tmfx.runes.circle.outpulse.necromancy")
                    .atLocation(casterToken)
                    .duration(2000)
                    .fadeIn(500)
                    .fadeOut(500)
                    .scale(0.5)
                    .filter("Glow", { color: 0xffffbf })
                    .scaleIn(0, 500, {ease: "easeOutCubic", delay: 100})
                .effect()
                    .file("jb2a.moonbeam.01.intro.blue")
                    .atLocation(casterToken)
                    .fadeIn(100)
                    .fadeOut(200)
                    .duration(1200)
            .play();
        
    },
    post: async (location, spawnedToken, updates, iteration) => {
        // When the token has been spawned

        new Sequence()
        .effect()
            .file("jb2a.toll_the_dead.red.shockwave")
            .atLocation(location)
            .fadeOut(500)
            .randomRotation()
            .scale(0.5)
        .play();
    }


})