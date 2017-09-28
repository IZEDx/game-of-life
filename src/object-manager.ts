import * as $ from 'jquery';
import LifeObject, {dot} from 'lifeobject';
import {Position} from 'field';
import Game from 'game';
import {get} from 'utils';

export default class ObjectManager{
    private canvas : HTMLCanvasElement;
    private game : Game;
    private listElement;
    private selectedObject : LifeObject = dot;

    constructor(canvas : HTMLCanvasElement, game : Game, listElementSelector : string){
        this.canvas = canvas;
        this.game = game;
        this.listElement = $(listElementSelector);
        this.canvas.addEventListener('click', this.canvasClick.bind(this), false);
        this.canvas.addEventListener('mousemove', this.canvasMouseMove.bind(this), false);
        this.reloadButtons();
        this.importObject("Dot", dot);
    }

    private reloadButtons(){
        LifeObject.allSavedObjects()
            .filter(name => this.listElement.children(`[ref="${name}"]`).length == 0)
            .forEach(name => this.listElement.append(`<button class="btn object" ref="${name}">${name}</button>`));

        let mgr = this;
        this.listElement.children().on("click", function() { mgr.switchTo($(this).attr('ref')) });
    }

    private canvasClick(event : MouseEvent){
        let pos = this.game.field.mouseEventToPosition(event);
        this.game.field.toggleLifeObject(this.selectedObject, this.selectedObject.centerPos(pos));
        this.game.render();
    }

    private canvasMouseMove(event : MouseEvent){
        let pos = this.game.ghostField.mouseEventToPosition(event);
        this.game.ghostField.resetField();
        this.game.ghostField.setLifeObjectAlive(this.selectedObject, this.selectedObject.centerPos(pos));
        if(this.game.speed < 75 || !this.game.running)
            this.game.render();
    }

    switchTo(name : string){
        this.selectedObject = LifeObject.load(name);
        this.game.ghostField.resetField();
        this.game.render();
    }

    importObject(name : string, obj : LifeObject){
        obj.save(name);
        this.reloadButtons();
    }

    async importFile(name : string, file : string){ this.importObject(name, LifeObject.parseLife(await get(file))) }
    importString(name : string, data : string){ this.importObject(name, LifeObject.parseLife(data)) }
    importArray(name : string, data : Position[]){ this.importObject(name, new LifeObject(data)) }


}