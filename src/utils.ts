import Game from 'game';
import LifeObject from 'lifeobject';

export function nop() {}

export function get(url : string){
    return new Promise((resolve : (str) => void) =>{
        let xmlHttp = new XMLHttpRequest();
        xmlHttp.onreadystatechange = function() {
            if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
                resolve(xmlHttp.responseText);
        };
        xmlHttp.open("GET", url, true);
        xmlHttp.send(null);
    });
}

export function spawnStartscreen(game : Game){
    get("./dist/objects/startscreen.life").then(str => {
        let obj = LifeObject.parseLife(str);
        game.ghostField .resetField();
        game.ghostField .setLifeObjectAlive(obj, obj.centerPos(game.ghostField.getCenter()));
        game.field      .setLifeObjectAlive(obj, obj.centerPos(game.ghostField.getCenter()));
        game.render();
    });
}

export function checkForModals(){
    $(".modal").each(function(){
        let modal = $(this);
        modal.children(".content").children(".header").children(".modal-close").on("click", () => modal.hide());
    });
    $(".modal-toggle").each(function(){
        let btn = $(this);
        btn.on("click", () => {
            let hidden = $(btn.attr("ref")).css('display') == "none";
            $(".modal").each(function(){
                $(this).hide();
            });
            if(hidden){
                $(btn.attr("ref")).show();
            }else{
                $(btn.attr("ref")).hide();
            }
        });
    });
}