import { topBar } from "./navigation/top-bar.mjs";
import { BulletinManager } from "./bulletin/bulletinManager.mjs";

export var ui = {}

var components = [{
        "class": ".top-bar",
        "key": "TopBar",
        "constructor": topBar
    },
    {
        "class": ".bulletin_list",
        "key": "BulletinManager",
        "constructor": BulletinManager
    }
]

ui.init = () => {
    components.forEach(component => {
        //console.log($(component.class));

        $(component.class).each(function() {
            //console.log(this);

            this.__proto__[component.key] = new component.constructor($(this));
        });
    });
}