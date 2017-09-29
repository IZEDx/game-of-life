import * as $ from 'jquery';
import LifeObject, {dot} from 'lifeobject';
import Game from 'game';
import {get, Vector} from 'utils';
import Field from 'field';
import Mouse = JQuery.Mouse;

export default class ObjectManager{
    private canvas : HTMLCanvasElement;
    private game : Game;
    private listElement;
    private selectedObject : LifeObject = dot;
    private drawMode = false;

    constructor(canvas : HTMLCanvasElement, game : Game, listElementSelector : string){
        this.canvas = canvas;
        this.game = game;
        this.listElement = $(listElementSelector);
        this.reloadButtons();
        this.importObject("Dot", dot);
    }

    private reloadButtons(){
        ObjectManager.allSavedObjects()
            .filter(name => this.listElement.children(`[ref="${name}"]`).length == 0)
            .forEach(name => {
                this.listElement.append(`<button class="btn object" ref="${name}"><canvas class="preview"></canvas>${name}</button>`)
            });

        let mgr = this;
        this.listElement.children().on("click", function() { mgr.switchTo($(this).attr('ref')) });
        this.listElement.children().each(function(){
            let btn = $(this);
            let obj = ObjectManager.loadFromStorage(btn.attr("ref"));
            let canvas : HTMLCanvasElement = btn.children(".preview").get(0) as HTMLCanvasElement;
            console.log(obj.width, obj.height);
            let field = new Field(canvas, obj.width, obj.height);
            field.toggleLifeObject(obj, obj.start);
            field.renderBackground = false;
            field.render();
        });
    }

    canvasClick(event : MouseEvent){
    }

    canvasMouseDown(event : MouseEvent){
        if(this.selectedObject == dot || true){
            this.drawMode = true;
        }
        let pos = this.game.field.mouseEventToPosition(event);
        this.game.field.toggleLifeObject(this.selectedObject, this.selectedObject.centerPos(pos));
        this.game.ghostField.resetField();
        this.game.render();
    }

    canvasMouseUp(event : MouseEvent){
        this.drawMode = false;
    }

    windowMouseUp(event : MouseEvent){
        this.canvasMouseUp(event);
    }

    canvasMouseMove(event : MouseEvent){
        if(this.drawMode){
            let pos = this.game.field.mouseEventToPosition(event);
            this.game.field.setLifeObjectAlive(this.selectedObject, this.selectedObject.centerPos(pos));
            this.game.render();
        }else{
            let pos = this.game.ghostField.mouseEventToPosition(event);
            this.game.ghostField.resetField();
            this.game.ghostField.setLifeObjectAlive(this.selectedObject, this.selectedObject.centerPos(pos));
            if(this.game.speed < 75 || !this.game.running)
                this.game.render();
        }
    }


    switchTo(lifeobject : string|LifeObject){
        this.selectedObject = lifeobject instanceof LifeObject ? lifeobject : ObjectManager.loadFromStorage(lifeobject);
        this.game.ghostField.resetField();
        this.game.render();
    }

    static allSavedObjects() : string[]{
        let os : string[] = [];
        for(let i = 0; i < window.localStorage.length; i++)
            os.push(window.localStorage.key(i));
        return os;
    }

    static saveToStorage(name : string, obj : LifeObject){
        window.localStorage.setItem(name, JSON.stringify(obj.serialize()));
    }

    static loadFromStorage(name : string) : LifeObject{
        let ps = JSON.parse(window.localStorage.getItem(name));
        if(ps == null) throw new Error(`LifeObject "${name}" not found in storage.`);
        return new LifeObject(ps.map(p => new Vector(p.x, p.y)));
    }


    importObject(name : string, obj : LifeObject){
        ObjectManager.saveToStorage(name, obj);
        this.reloadButtons();
    }

    async importFile(name : string, file : string){ this.importObject(name, LifeObject.parseLife(await get(file))) }
    importString(name : string, data : string){ this.importObject(name, LifeObject.parseLife(data)) }
    importArray(name : string, data : Vector[]){ this.importObject(name, new LifeObject(data)) }


}