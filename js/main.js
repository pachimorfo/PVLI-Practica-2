var battle = new RPG.Battle();
var actionForm, spellForm, targetForm;
var infoPanel;

function prettifyEffect(obj) {
    return Object.keys(obj).map(function (key) {
        var sign = obj[key] > 0 ? '+' : ''; // show + sign for positive effects
        return `${sign}${obj[key]} ${key}`;
    }).join(', ');
}


battle.setup({
    heroes: {
        members: [
            RPG.entities.characters.heroTank,
            RPG.entities.characters.heroWizard
        ],
        grimoire: [
            RPG.entities.scrolls.health,
            RPG.entities.scrolls.fireball
        ]
    },
    monsters: {
        members: [
            RPG.entities.characters.monsterSlime,
            RPG.entities.characters.monsterBat,
            RPG.entities.characters.monsterSkeleton,
            RPG.entities.characters.monsterBat
        ]
    }
});

battle.on('start', function (data) {
    console.log('START', data);
});

battle.on('turn', function (data) {
    console.log('TURN', data);

    // TODO: render the characters
    //Para sacar los nombres de los personajes para usarlos como ID.
    var characterIDlist = Object.keys(this._charactersById);
    var list = document.querySelectorAll('.character-list');
    var heroesList = list[0];
    var monstersList = list[1];
    var render = " ";
    var charct;
    heroesList.innerHTML = " ";
    monstersList.innerHTML = " ";
	for (var i = 0; i < characterIDlist.length; i++){
 	 	charct = this._charactersById[characterIDlist[i]];
 	 	render = '<li data-chara-id="'+characterIDlist[i]+'">'+charct.name+
 	 	'(HP: <strong>'+charct.hp+'</strong>/'+charct.maxHp+
 	 	',MP: <strong>'+charct.mp+'</strong>/'+charct.maxMp+') </li>';
 	 	if(charct.party === 'heroes')
 	 		heroesList.innerHTML += render;
 	 	else
 	 		monstersList.innerHTML += render;
 	 	if(charct.hp <= 0){//Si la vida es 0, lo buscamos en la lista con su ID, y le añadimos el dead.
  			var characterDead = document.querySelector('[data-chara-id="'+characterIDlist[i]+'"]');
  			characterDead.classList.add('dead');
  		}
 	}
  	// TODO: highlight current character
  	var charActive = document.querySelector('[data-chara-id="' + data.activeCharacterId + '"]');
  	charActive.classList.add('active');
  	
    // TODO: show battle actions form
    actionForm.style.display = 'inline';
    var choices = actionForm.getElementsByClassName("choices");//Busca la clase con el nombre indicado dentro 
    //de actionForm.
    var options = battle.options.list();
    var renderOpt;
    choices[0].innerHTML = " ";
   	for(var i = 0; i < options.length; i++){
    	renderOpt = '<li><label><input type="radio" name="option" value="' +options[i]+
    	'"> ' + options[i] + '</label></li>';
    	choices[0].innerHTML += renderOpt;
 	}
});

battle.on('info', function (data) {
    console.log('INFO', data);

    // TODO: display turn info in the #battle-info panel
    var activeChar = data.activeCharacterId;
    var objective = data.targetId;
   
    infoPanel.innerHTML = "FIGHT! Good Luck";
    if (data.action ==='attack'){
    	var effectsTxt = prettifyEffect(data.effect || {});
    	infoPanel.innerHTML =`<strong>${activeChar}</strong> attacked <strong> ${objective}</strong>${data.success ? '. Dealing ' : '. But failed.'} ${data.success ? effectsTxt : ''}`;
	}
	else if(data.action === 'defend'){//Hubieramos usado la sintaxis con las comillas normales, '', y con los + para
		//concaternar strings, pero no sabemos por que, no nos iba correctamente, asi que al final, un compañero nos recomendo usar las de ` y el 
		//y de esta forma todo va correctamente.
		infoPanel.innerHTML =`<strong>${activeChar}</strong> defended <strong>
		${data.success ? 'successfully.' : 'and failed. ' }</strong> Defense = ${data.newDefense} . Shields ACTIVATED`;
		
	}
	else{
		 var effectsTxt = prettifyEffect(data.effect || {});
		 var spell = data.scrollName;
		 infoPanel.innerHTML = `<strong>${activeChar}</strong> casted ${spell} on <strong>${objective}</strong>${data.success ? ' and caused ' : '. But failed.'} ${data.success ? effectsTxt : ''}`;
   	}




});

battle.on('end', function (data) {
    console.log('END', data);

    // TODO: re-render the parties so the death of the last character gets reflected
 	var characterIDlist = Object.keys(this._charactersById);
    var list = document.querySelectorAll('.character-list');
    var heroesList = list[0];
    var monstersList = list[1];
    var render = " ";
    var charct;
    heroesList.innerHTML = " ";
    monstersList.innerHTML = " ";
	for (var i = 0; i < characterIDlist.length; i++){
 	 	charct = this._charactersById[characterIDlist[i]];
 	 	render = '<li data-chara-id="'+characterIDlist[i]+'">'+charct.name+
 	 	'(HP: <strong>'+charct.hp+'</strong>/'+charct.maxHp+
 	 	',MP: <strong>'+charct.mp+'</strong>/'+charct.maxMp+') </li>';
 	 	if(charct.party === 'heroes')
 	 		heroesList.innerHTML += render;
 	 	else
 	 		monstersList.innerHTML += render;
 	 	if(charct.hp <= 0){//Si la vida es 0, lo buscamos en la lista con su ID, y le añadimos el dead.
  			var characterDead = document.querySelector('[data-chara-id="'+characterIDlist[i]+'"]');
  			characterDead.classList.add('dead');
  		}
 	}
    // TODO: display 'end of battle' message, showing who won
    infoPanel.innerHTML = 'The <strong> battle </strong> has ENDED. <strong>' +data.winner + ' </strong> won. CONGRATS'
    actionForm.style.display = 'none';
    //Recargar la pagina para empezar otra batalla.
    //Crear botton para reinicio.
    //Creamos un form en el html, con un boton. accedemos al boton y si pulsamos,
    //recargamos la ventana y se empieza de nuevo.    
    var theEnd = document.querySelector('form[name = again]');
    theEnd.style.display = 'inline';
    var end = theEnd.elements['option'].value;
    battle.options.select(j);
    if(end === 'again')
    	 window.location.reload();



});

window.onload = function () {
   	actionForm = document.querySelector('form[name=select-action]');
    targetForm = document.querySelector('form[name=select-target]');
    spellForm = document.querySelector('form[name=select-spell]');
    infoPanel = document.querySelector('#battle-info');

    actionForm.addEventListener('submit', function (evt) {
        evt.preventDefault();

        // TODO: select the action chosen by the player
        var action = actionForm.elements['option'].value;
        //action.innerhtml += '<input type="radio" name="option" value="' + action + '" required>'
        battle.options.select(action);
        // TODO: hide this menu
        actionForm.style.display = 'none';
        // TODO: go to either select target menu, or to the select spell menu
        if (action === 'defend'){
          actionForm.style.display = 'inline';
        }
        else if(action === 'attack'){
        	var targets = targetForm.getElementsByClassName("choices");//Busca la clase con el nombre 
        	//indicado dentro de actionForm.
    		var options = battle.options.list();
    		var renderT;
    		targets[0].innerHTML = " ";
   			for(var i = 0; i < options.length; i++){
   				var party = battle._charactersById[options[i]].party;
   				if(party === 'heroes'){
	    			renderT = '<li><label class = heroes><input type="radio" name="option" value="' +options[i]+
    				'"> ' + options[i] + '</label></li>';
    				targets[0].innerHTML += renderT;
   				}
   				else{
   					renderT = '<li><label class = monsters><input type="radio" name="option" value="' +options[i]+
    				'"> ' + options[i] + '</label></li>';
    				targets[0].innerHTML += renderT;
   				}
 			}
        	targetForm.style.display = 'inline';        	
        }
        else{
        	var scrolls = spellForm.getElementsByClassName("choices");//Busca la clase con el nombre 
        	//indicado dentro de actionForm.
        	var player = battle._activeCharacter;
        	var activeParty = battle._activeCharacter.party;
    		var options = battle._grimoires[activeParty];
    		var button = spellForm.lastElementChild;
    		button = button.firstChild;
    		var renderS;
    		spellForm.style.display = 'inline';
    		if(options.hasOwnProperty('health') ){//Buscamos si el personaje activo tiene la 
    			//propiedad de ese hechizo, en caso contrario, no le dejamos lanzar hechizos. 
    			if(player._mp > 0){//Si el personaje actual tiene mana
    				button.disabled = false;
    				scrolls[0].innerHTML = " ";
   					for(var i in options){
    					renderS = '<li><label><input type="radio" name="option" value="' +options[i].name+
    					'"> ' + options[i].name+ '</label></li>';
    					scrolls[0].innerHTML += renderS;
 					}		
 				}
 				else{//Si no tiene mana, no le dejamos lanzar ningun hechizo
 					scrolls[0].innerHTML = "";
        			button.disabled = true;
 				}
        	}
        	else{
        		scrolls[0].innerHTML = "";
        		button.disabled = true;
        	}
        	
        }

    });

    targetForm.addEventListener('submit', function (evt) {
        evt.preventDefault();
        // TODO: select the target chosen by the player
        var target = targetForm.elements['option'].value;
        battle.options.select(target);
        // TODO: hide this menu
        targetForm.style.display = 'none';
        actionForm.style.display = 'block';      

    });

    targetForm.querySelector('.cancel')
    .addEventListener('click', function (evt) {
        evt.preventDefault();
        // TODO: cancel current battle options
        battle.options.cancel();
        // TODO: hide this form
        targetForm.style.display = 'none';
        // TODO: go to select action menu
        actionForm.style.display = 'block';
    });

    spellForm.addEventListener('submit', function (evt) {
        evt.preventDefault();
        // TODO: select the spell chosen by the player
        var spell =  spellForm.elements['option'].value;
        battle.options.select(spell);
        // TODO: hide this menu
        spellForm.style.display = 'none';
        // TODO: go to select target menu
		//Rellenar los targets, por que si intentas castear antes de haber ataco, que es 
		//cuando realmente rellenas los targets, no te muestra ninguno, asi que por si acaso
		//lo hacemos aqui tambien.       
      	var targets = targetForm.getElementsByClassName("choices");//Busca la clase con el nombre 
        //indicado dentro de actionForm.
    	var options = battle.options.list();
    	var renderT;
    	targets[0].innerHTML = " ";
   		for(var i = 0; i < options.length; i++){
   			var party = battle._charactersById[options[i]].party;
   			if(party === 'monsters'){
	    		renderT = '<li><label class = monsters><input type="radio" name="option" value="' +options[i]+
    			'"> ' + options[i] + '</label></li>';
    			targets[0].innerHTML += renderT;
   			}
   			else{   				
	    		renderT = '<li><label class = heroes><input type="radio" name="option" value="' +options[i]+
    			'"> ' + options[i] + '</label></li>';
    			targets[0].innerHTML += renderT;   				
   			}
 		}
        targetForm.style.display = 'inline';  
    });

    spellForm.querySelector('.cancel')
    .addEventListener('click', function (evt) {
        evt.preventDefault();
        // TODO: cancel current battle options
        battle.options.cancel();
        // TODO: hide this form
        spellForm.style.display = 'none';
        // TODO: go to select action menu
        actionForm.style.display = 'block';
    });

    battle.start();
};
