export class Bulletin {
    constructor(level, title, message, duration) {
        this.elem = $(`
        <div class="bulletin" level="good">
            <i class="material-icons">thumb_up</i>
            <div class="bulletin_text">
                <h1>Test bericht.</h1>
                <p>Hallo mensen dit is een test bullutin.</p>
            </div>
            <button class="bulletin_close-button material-icons">close</button>
        </div>
        `);

        this.level = level;
        this.title = title;
        this.message = message;

        if (!duration) {
            var words = this.title.split(' ').length + this.message.split(' ').length;
            this.duration = words * 1000;
        } else {
            this.duration = duration;
        }        

        this.elem.hide();

        this.elem.find(".bulletin_close-button").click(()=>{
            this.close();
        });

        this.elem[0].__proto__.Bulletin = this;
    }

    get level() {
        return this.elem.attr("level");
    }

    set level(l) {
        switch (l) {
            case "good":
                this.elem.attr("level", l);
                this.icon = "thumb_up";
                break;

            case "warning":
                this.elem.attr("level", l);
                this.icon = "warning";
                break;

            case "error":
                this.elem.attr("level", l);
                this.icon = "error";
                break;

            case "info":
                this.elem.attr("level", l);
                this.icon = "info";
                break;

            default:
                throw "bulletin level does not exist"
        }
    }

    get icon() {
        return this.elem.find("i").text();
    }
    set icon(i) {
        this.elem.find("i").text(i);
    }

    get title() {
        return this.elem.find(".bulletin_text h1").text();
    }
    set title(t) {
        this.elem.find(".bulletin_text h1").text(t);
    }

    get message() {
        return this.elem.find(".bulletin_text p").text();
    }
    set message(m) {
        this.elem.find(".bulletin_text p").text(m);
    }

    show() {
        this.elem.show(300);

        setTimeout(() => {
            this.close();
        }, this.duration);

        delete this.show;
    }

    close() {
        this.elem.hide(300, () => {
            this.elem.remove();
            delete this;
        });
    }
}