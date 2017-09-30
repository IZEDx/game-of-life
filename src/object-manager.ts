import * as $ from 'jquery';
import LifeObject, {dot} from 'lifeobject';
import Game from 'game';
import {get, Vector} from 'utils';
import Field from 'field';
import Mouse = JQuery.Mouse;

/**
 * Handles Object importing, saving, browser display and spawning.
 */
export default class ObjectManager{
    private game : Game;
    private listElement;
    private selectedObject : LifeObject = dot;
    private drawMode = false;

    /**
     * Creates the ObjectManager
     * @param {Game} game Game to interact with.
     * @param {string} listElementSelector JQuery-Selector for Object Browser list.
     */
    constructor(game : Game, listElementSelector : string){
        this.game = game;
        this.listElement = $(listElementSelector);
        this.reloadEntries();
        this.importObject("Dot", dot);
    }

    /**
     * (Re-)loads the entries in the Object Browser
     */
    private reloadEntries(){
        ObjectManager.allStoredObjects()
            .filter(name => this.listElement.children(`[ref="${name}"]`).length == 0)
            .forEach(name => {
                this.listElement.append(`<button class="btn object" ref="${name}"><!--<canvas class="preview"></canvas>-->${name}</button>`)
            });

        let mgr = this;
        this.listElement.children().on("click", function() { mgr.switchTo($(this).attr('ref')) });
        /*this.listElement.children().each(function(){
            let btn = $(this);
            let obj = ObjectManager.loadFromStorage(btn.attr("ref"));
            let canvas : HTMLCanvasElement = btn.children(".preview").get(0) as HTMLCanvasElement;
            console.log(obj.width, obj.height);
            let field = new Field(canvas, obj.width, obj.height);
            field.toggleLifeObject(obj, obj.start);
            field.renderBackground = false;
            field.render();
        });*/
    }

    /**
     * When the canvas gets clicked
     * @see main.ts
     * @param {MouseEvent} event
     */
    canvasClick(event : MouseEvent){
    }

    /**
     * When the left mouse button gets clicked down on the canvas.
     * @see main.ts
     * @param {MouseEvent} event
     */
    canvasMouseDown(event : MouseEvent){
        if(this.selectedObject == dot || true){
            this.drawMode = true;
        }
        let pos = this.game.field.mouseEventToPosition(event);
        this.game.field.toggleLifeObject(this.selectedObject, this.selectedObject.centerPos(pos));
        this.game.ghostField.resetField();
        this.game.render();
    }

    /**
     * When the left mouse button gets released on the canvas.
     * @see main.ts
     * @param {MouseEvent} event
     */
    canvasMouseUp(event : MouseEvent){
        this.drawMode = false;
    }

    /**
     * When the left mouse button gets released in general.
     * @see main.ts
     * @param {MouseEvent} event
     */
    windowMouseUp(event : MouseEvent){
        this.canvasMouseUp(event);
    }

    /**
     * When the mouse is moved on the canvas.
     * @param {MouseEvent} event
     */
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

    /**
     * Switches the current selected object to the give one.
     * @param {string|LifeObject} lifeobject LifeObject or name of a LifeObject stored in storage.
     */
    switchTo(lifeobject : string|LifeObject){
        this.selectedObject = lifeobject instanceof LifeObject ? lifeobject : ObjectManager.loadFromStorage(lifeobject);
        this.game.ghostField.resetField();
        this.game.render();
    }

    /**
     * Returns a list of all objects stored in storage.
     * @returns {string[]}
     */
    static allStoredObjects() : string[]{
        let os : string[] = [];
        for(let i = 0; i < window.localStorage.length; i++)
            os.push(window.localStorage.key(i));
        return os;
    }

    /**
     * Saves obj under name into storage.
     * @param {string} name Name of object.
     * @param {LifeObject} obj Object to store.
     */
    static saveToStorage(name : string, obj : LifeObject){
        window.localStorage.setItem(name, JSON.stringify(obj.serialize()));
    }

    /**
     * Loads the LifeObject with the given name from storage, if found.
     * @throws Throws an error if the object is not found in storage.
     * @param {string} name Name of the object in storage.
     * @returns {LifeObject}
     */
    static loadFromStorage(name : string) : LifeObject{
        let ps = JSON.parse(window.localStorage.getItem(name));
        if(ps == null) throw new Error(`LifeObject "${name}" not found in storage.`);
        return new LifeObject(ps.map(p => new Vector(p.x, p.y)));
    }


    /**
     * Imports the given LifeObject into the browser
     * @param {string} name Name in storage and browser.
     * @param {LifeObject} obj
     */
    importObject(name : string, obj : LifeObject){
        ObjectManager.saveToStorage(name, obj);
        this.reloadEntries();
    }

    /**
     * Imports a file via HTTP-GET into the browser.
     * @param {string} name Name to store it as.
     * @param {string} file URL to the file.
     * @returns {Promise<void>}
     */
    async importFile(name : string, file : string){ this.importObject(name, LifeObject.parseLife(await get(file))) }

    /**
     * Imports a Life1.0[5/6] file into the browser.
     * @param {string} name Name to store it as.
     * @param {string} data Life string.
     */
    importString(name : string, data : string){ this.importObject(name, LifeObject.parseLife(data)) }

    /**
     * Imports a Vector array of alive cells into the browser.
     * @param {string} name Name to store it as.
     * @param {Vector[]} data Vector array or alive cells.
     */
    importArray(name : string, data : Vector[]){ this.importObject(name, new LifeObject(data)) }


}