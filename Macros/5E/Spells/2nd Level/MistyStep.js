//DAE Macro Execute, Effect Value = "Macro Name" @target 
const lastArg = args[args.length - 1];
let tactor;
if (lastArg.tokenId) tactor = canvas.tokens.get(lastArg.tokenId).actor;
else tactor = game.actors.get(lastArg.actorId);
const target = canvas.tokens.get(lastArg.tokenId) || token;
const folder01 = "modules/jb2a_patreon/Library/2nd_Level/Misty_Step/";
//anFile is the name of the file used fRedhe animation


let anFile1 = `${folder01}MistyStep_01_Regular_Purple_400x400.webm`;
let anFile2 = `${folder01}MistyStep_02_Regular_Purple_400x400.webm`;

let anDeg;
let ray;
let tok;
let myScale=canvas.grid.size/100*.6;
const wait = (delay) => new Promise((resolve) => setTimeout(resolve, delay))


if (args[0] === "on") {
	let range = MeasuredTemplate.create({
		t: "circle",
		user: game.user._id,
		x: target.x + canvas.grid.size / 2,
		y: target.y + canvas.grid.size / 2,
		direction: 0,
		distance: 30,

		borderColor: "#FF0000",
		flags: {
			DAESRD: {
				MistyStep: {
					ActorId: tactor.id
				}
			}
		}
		
	});

	range.then(result => {
		let templateData = {
			t: "rect",
			user: game.user._id,
			distance: 7.5,
			direction: 45,
			x: 0,
			y: 0,
			fillColor: game.user.color,
			flags: {
				DAESRD: {
					MistyStep: {
						ActorId: tactor.id
					}
				}
			}
		};



		Hooks.once("createMeasuredTemplate", deleteTemplatesAndMove);

		let template = new game.dnd5e.canvas.AbilityTemplate(templateData);
		template.actorSheet = tactor.sheet;
		template.drawPreview();

		async function deleteTemplatesAndMove(scene, template) {

			let removeTemplates = canvas.templates.placeables.filter(i => i.data.flags.DAESRD?.MistyStep?.ActorId === tactor.id);


			tok = target
			if (tok != undefined) {

				ray = new Ray(tok.center, { x: template.x + canvas.grid.size / 2, y: template.y + canvas.grid.size / 2 });
				// Determines the angle
				anDeg = -(ray.angle * 57.3) - 90;
				
				const data = {
					file: anFile1,
					position: tok.center,
					anchor: {
						x: .5,
						y: .5
					},
					angle: anDeg,
					speed: 0,
					scale: {
						x: myScale,
						y: myScale
					}
				}
				await canvas.templates.deleteMany([removeTemplates[0].id, removeTemplates[1].id]);
				await tactor.deleteEmbeddedEntity("ActiveEffect", lastArg.effectId);
				await wait(200);
				canvas.fxmaster.playVideo(data);
				game.socket.emit('module.fxmaster', data);

			}





			tok.update({ "hidden": !tok.data.hidden })
			await target.update({ x: template.x, y: template.y })
			await wait(1500);

			if (tok != undefined) {

				anDeg = -(ray.angle * 57.3) - 90;
				


				const data2 = {
					file: anFile2,
					position: {
						x: template.x + canvas.grid.size / 2,
						y: template.y + canvas.grid.size / 2
					},
					anchor: {
						x: .5,
						y: .5
					},
					angle: anDeg,
					speed: 0,
					scale: {
						x: -myScale,
						y: -myScale
					}
				}
				
				canvas.fxmaster.playVideo(data2);
				game.socket.emit('module.fxmaster', data2);

			}
			
		
			await wait(1200);
			tok.update({ "hidden": !tok.data.hidden })

		};
	});

}
