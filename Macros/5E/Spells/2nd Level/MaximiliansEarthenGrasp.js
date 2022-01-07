if (args[0].tag === "OnUse") {
    const casterToken = await fromUuid(args[0].tokenUuid);
    const caster = casterToken.actor;
    let hasPlayedAnimation = false;
  ;
    const summoned1 = await warpgate.spawn("Earthen Grasp", {}, {
        pre: async (location, updates) => {
            // When the user has clicked where they want it

            if (!hasPlayedAnimation) {
                hasPlayedAnimation = true;
                new Sequence()
                    .effect()
                        .file("jb2a.extras.tmfx.runes.circle.outpulse.transmutation")
                        .atLocation(casterToken)
                        .duration(2000)
                        .fadeIn(500)
                        .fadeOut(500)
                        .scale(0.35)
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
                .file("jb2a.impact.ground_crack.blue.02")
                .atLocation(location)
                .randomRotation()
                .scale(0.5)
            .play();


        }
    },);
 ;
    const summonedUuid1 = `Scene.${canvas.scene.id}.Token.${summoned1[0]}`;

    await caster.createEmbeddedDocuments("ActiveEffect", [{
        "changes":  [{"key":"flags.dae.deleteUuid","mode":5,"value": summonedUuid1,"priority":"30"},],
        "label": "Earthen Grasp Summon",
        "duration": {seconds: 60, rounds: 10},
        "origin": args[0].itemUuid,
        "icon": "icons/magic/earth/lava-explosion-orange.webp",
    }])
;
}