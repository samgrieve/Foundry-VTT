// Item Macro and MIDI-QOL required
// Set Item to Utility Action with no rolls or damage formula
// Requires a macro named Shove

    let pusher = canvas.tokens.get(args[0].tokenId);
    let target = Array.from(game.user.targets)[0];
    let tokenRoll = await pusher.actor.rollSkill("ath");
    let skill = target.actor.data.data.skills.ath.total < target.actor.data.data.skills.acr.total ? "acr" : "ath";
    let tactorRoll = await target.actor.rollSkill(skill);
    
    if (tokenRoll.total > tactorRoll.total) {
        if(await yesNoPrompt("title","content")){
            await game.macros.getName("Shove").execute(args[0].tokenId,Array.from(game.user.targets)[0].id);
        }
        else{
            await game.macros.getName("Shove").execute("Prone", Array.from(game.user.targets)[0].id);
        }
        
        }
    async function yesNoPrompt (dTitle,dContent){
        let dialog = new Promise((resolve, reject) => {
            new Dialog({
            // localize this text
            title: `${dTitle}`,
            content: `<p>${dContent}</p>`,
            buttons: {
                one: {
                    icon: '<i class="fas fa-check"></i>',
                    label: `Knockback`,
                    callback: () => {resolve(true)}
                },
                two: {
                    icon: '<i class="fas fa-times"></i>',
                    label: `Prone`,
                    callback: () => {resolve(false)}
                }
            },
            default: "two"
            }).render(true);
          });
          let result = await dialog;
          return result;
    
    }
