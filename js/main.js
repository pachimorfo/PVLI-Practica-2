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
    // TODO: highlight current character
    // TODO: show battle actions form
});

battle.on('info', function (data) {
    console.log('INFO', data);

    // TODO: display turn info in the #battle-info panel
});

battle.on('end', function (data) {
    console.log('END', data);

    // TODO: re-render the parties so the death of the last character gets reflected
    // TODO: display 'end of battle' message, showing who won
});

window.onload = function () {
    //('.choices') es para que nos devuelva todo lo de una clase, en ese caso, la de choices
    //Si le pones un #, buscamos por ID, idealmente solo deberia devolver un elemento. (ID unicos).
    //Ej: battle info.
    //Añadir cosas a algo ".innerhtml"
    //.style.display = "none" para esconderlo, siempre va x.y.z = algo;
    // display = "block"; para mostrar;
    //.childNodes es cada hijo de una clase.
    //.childNodes.lenght tamaño
    //BUSCAR API DE NODE(de nodo, no del prog) ahi veremos el childnodes y demas
    //Clase node, y lo mas externo es clase document.
    //lista etiqueta ly
    //los "activos" se subrayan solos. Solo hay que ponerlos en campo "activo" obj.setActive();
    //lo que nos devuelve cualquier metodo de document es un nodo, asi que cuando nos devuelve algo
    // ya luego usamos metodos del nodo(api de node).
    actionForm = document.querySelector('form[name=select-action]');
    targetForm = document.querySelector('form[name=select-target]');
    spellForm = document.querySelector('form[name=select-spell]');
    infoPanel = document.querySelector('#battle-info');

    actionForm.addEventListener('submit', function (evt) {
        evt.preventDefault();

        // TODO: select the action chosen by the player
        // TODO: hide this menu
        // TODO: go to either select target menu, or to the select spell menu
    });

    targetForm.addEventListener('submit', function (evt) {
        evt.preventDefault();
        // TODO: select the target chosen by the player
        // TODO: hide this menu
    });

    targetForm.querySelector('.cancel')
    .addEventListener('click', function (evt) {
        evt.preventDefault();
        /* for cada monstruo
        characterlist.innerhtml

        */
        // TODO: cancel current battle options
        // TODO: hide this form
        // TODO: go to select action menu
    });

    spellForm.addEventListener('submit', function (evt) {
        evt.preventDefault();
        // TODO: select the spell chosen by the player
        // TODO: hide this menu
        // TODO: go to select target menu
    });

    spellForm.querySelector('.cancel')
    .addEventListener('click', function (evt) {
        evt.preventDefault();
        // TODO: cancel current battle options
        // TODO: hide this form
        // TODO: go to select action menu
    });

    battle.start();
};
