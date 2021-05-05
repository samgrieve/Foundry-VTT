// Item Macro
// Requires Token Magic FX
// Requires a macro named WildShape Effect Macro

let selectBeasts = '<form><div class="form-group"><label>Choose your new form: </label><select id="wildShapeBeasts">';
game.folders.getName("Beasts").content.forEach(function(beast){
    let optBeast = '<option value="' + beast.data._id + '">' + beast.data.name + '</option>';
    selectBeasts += optBeast;
});
selectBeasts += '</select></div></form>'

let d = new Dialog({
          title: "Choose Form",
          content: selectBeasts,
          buttons: {
            yes: {
              icon: '<i class="fas fa-check"></i>',
              label: "Roar!",
              callback: () => {
				// ID of your New Form Actor
				let actorNewFormId = $('#wildShapeBeasts').find(":selected").val();
				wildShape (actorNewFormId);
                console.log('selected beast: ' + $('#wildShapeBeasts').find(":selected").val() + ' - ' + $('#wildShapeBeasts').find(":selected").text());
              }
            }
          }
        }).render(true);

let wildShape = function(actorNewFormId){
	//ChatMessage.create({content: args[0].actor._id});
	//console.log( args[0] );

	// Name of your WildShape Effect
	let wildShapeEffectName = "WildShape Effect"

	// ID of your Original Form Actor
	let actorOriginalFormId = args[0].actor._id

	// Get the Original Form Actor
	let actorOriginalForm = game.actors.get(actorOriginalFormId)
	// Get the Original Form Actor Name
	let actorOriginalFormName = actorOriginalForm.data.name
	// Image's Token associated with the original actor form
	let actorOriginalFormImagePath = actorOriginalForm.data.token.img

	// Get the New Form Actor
	let actorNewForm = game.actors.get(actorNewFormId)
	// Get the New Form Actor Name
	let actorNewFormName = actorNewForm.data.name
	// Image's Token associated with the new actor form
	let actorNewFormImagePath = actorNewForm.data.token.img

	// Get the New Shape Actor Name
	let actorNewShapeName = actorOriginalForm.data.name + ' (' + actorNewForm.data.name + ')'

	// Declare the target
	let target = canvas.tokens.controlled[0]

	// Declare the delay variable to adjust with animation
	const delay = ms => new Promise(resolve => setTimeout(resolve, ms))

	// Declare the polymorph function
	let actorPolymorphism = async function () {
		// For actorNewForm, the ratio's Token scale should be the same of the original form
		actor.transformInto(actorNewForm, {
			keepMental: true,
			mergeSaves: true,
			mergeSkills: true,
			keepBio: true,
			keepClass: true,
		})
	}

	// Declare the WildShape Effect
	let applyWildShapeEffect = {
		label: wildShapeEffectName,
		icon: "systems/dnd5e/icons/skills/green_13.jpg",
		changes: [{
			"key": "macro.execute",
			"mode": 1,
			"value": `"WildShape Effect Macro"` + `"${actorOriginalFormId}"` + `"${actorOriginalFormImagePath}"` + `"${actorNewFormId}"` + `"${actorNewShapeName}"`,
			"priority": "20"
		}],
		duration: {
			"seconds": 7200,
                        "startTime" : game.time.worldTime
		}
	}

	// Declare the Transfer DAE Effects function
	let transferDAEEffects =  async function () {
		if (!actor.data.flags.dnd5e?.isPolymorphed) {
			let actorNewShape = game.actors.getName(actorNewShapeName)
			let actorOriginalFormEffectsData = actorOriginalForm.effects.map(ef => ef.data)
			await actorNewShape.createEmbeddedEntity("ActiveEffect", actorOriginalFormEffectsData)
		} else if (actor.data.flags.dnd5e?.isPolymorphed) {
			let actorNewShape = game.actors.getName(actorNewShapeName)
			let actorNewShapeEffectsData = actorNewShape.effects.map(ef => ef.data)
			await actorOriginalForm.createEmbeddedEntity("ActiveEffect", actorNewShapeEffectsData)
		}
	}

	// Declare the Remove DAE Effects function
	let removeDAEEffects = async function () {
		try {
			let mapOriginalActorEffects = actorOriginalForm.effects.map(i => i.data.label)
			for (let effect in mapOriginalActorEffects) {
				let actorOriginalFormEffects = actorOriginalForm.effects.find(i => i.data.label === mapOriginalActorEffects[effect])
				actorOriginalFormEffects.delete()
			}
		}
		catch (error) {
			console.log('No more effects to remove')
		}

	}

	// If not already polymorphed, launch startAnimation function
	if (!actor.data.flags.dnd5e?.isPolymorphed) {
		token.TMFXhasFilterId("polymorphToNewForm")
		let paramsStart = [{
			filterType: "polymorph",
			filterId: "polymorphToNewForm",
			type: 6,
			padding: 70,
			magnify: 1,
			imagePath: actorNewFormImagePath,
			animated:
			{
				progress:
				{
					active: true,
					animType: "halfCosOscillation",
					val1: 0,
					val2: 100,
					loops: 1,
					loopDuration: 1000
				}
			},
			autoDisable: false,
			autoDestroy: false
		}]
		async function startAnimation() {
			TokenMagic.addUpdateFilters(target, paramsStart)
			await delay(1100)
			actorPolymorphism()
			await delay(500)
			token.TMFXdeleteFilters("polymorphToNewForm")
			let actorNewShape = game.actors.getName(actorNewShapeName, actorOriginalFormId)
			actorNewShape.createEmbeddedEntity("ActiveEffect", applyWildShapeEffect)
			transferDAEEffects()
			removeDAEEffects().catch(err => console.error(err))
		}
		startAnimation()
		target.update({
			"width": actorNewForm.data.token.width,
			"height": actorNewForm.data.token.height
		})
		// If actor is polymorphed, launch backAnimation function
	} else if (actor.data.flags.dnd5e?.isPolymorphed) {
		token.TMFXhasFilterId("polymorphToOriginalForm")
		let paramsBack =
			[{
				filterType: "polymorph",
				filterId: "polymorphToOriginalForm",
				type: 6,
				padding: 70,
				magnify: 1,
				imagePath: actorOriginalFormImagePath,
				animated:
				{
					progress:
					{
						active: true,
						animType: "halfCosOscillation",
						val1: 0,
						val2: 100,
						loops: 1,
						loopDuration: 1000
					}
				}
			}]
		async function backAnimation() {
			token.TMFXaddUpdateFilters(paramsBack)
			await delay(1100)
			transferDAEEffects()
			await delay(100)
			actor.revertOriginalForm()
			await delay(100)
			token.TMFXdeleteFilters("polymorphToOriginalForm")
			game.actors.getName(actorOriginalFormName).effects.find(i => i.data.label === wildShapeEffectName).delete()
		}
		backAnimation()
		target.update({
			"width": actorOriginalForm.data.token.width,
			"height": actorOriginalForm.data.token.height
		})
	}
}
