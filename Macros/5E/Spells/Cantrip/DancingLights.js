if (args[0].tag === "OnUse") {
    const casterToken = await fromUuid(args[0].tokenUuid);
    const caster = casterToken.actor;
    let hasPlayedAnimation = false;

    const summons = [];
    for (let i = 0; i < 4; i ++) {
        const summon = await warpgate.spawn("Dancing Light", {}, {

            pre: async (location, updates) => {
                // When the user has clicked where they want it
    
                if (!hasPlayedAnimation) {
                    hasPlayedAnimation = true;
                    new Sequence()
                        .effect()
                            .file("jb2a.extras.tmfx.runes.circle.outpulse.evocation")
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
                }
            },
            post: async (location, spawnedToken, updates, iteration) => {
                // When the token has been spawned
    
                new Sequence()
                .effect()
                    .file("jb2a.toll_the_dead.blue.shockwave")
                    .atLocation(location)
                    .fadeOut(500)
                    .randomRotation()
                    .scale(0.5)
                .play();
            }
    
    
        });
        summons.push(summon[0]);
    }

    const change = { key: 'flags.dae.deleteUuid', mode: 5, priority: '30' };

    await caster.createEmbeddedDocuments("ActiveEffect", [{
        changes: summons.map(s => ({ ...change, value: `Scene.${canvas.scene.id}.Token.${s}`})),
        label: "Dancing Lights Summons",
        duration: {seconds: 60, rounds: 10},
        origin: args[0].itemUuid,
        icon: "icons/magic/light/explosion-star-glow-yellow.webp",
    }]);
}