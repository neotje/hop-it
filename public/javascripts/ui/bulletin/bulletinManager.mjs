import { Bulletin } from "./bulletin.mjs";

export class BulletinManager {
    constructor(elem) {
        this.elem = elem;   
    }

    get list(){
        return this.elem.children();
    }

    add(level, title, message, duration) {
        var bulletin = new Bulletin(level, title, message, duration);
        
        this.elem.append(bulletin.elem);

        bulletin.show();
    }
}