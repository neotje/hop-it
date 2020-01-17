export class topBar {
    constructor(elem) {
        this._elem = elem;

        this._anim = anime({
            targets: elem[0],
            borderColor: ['#ffffff00', '#1a237e'],
            backgroundColor: ['rgba(255, 255, 255, 0)', 'rgba(255, 255, 255, 1)'],
            boxShadow: [
                {value: ['0 1px 3px rgba(0,0,0,0)', '0 1px 3px rgba(0,0,0,0.12)']},
                {value: ['0 1px 2px rgba(0,0,0,0)', '0 1px 2px rgba(0,0,0,0.24)']}
            ],
            duration: 1000,
            autoplay: false,
            easing: 'linear'
        });

        document.onscroll = () => {
            var scrollTop = $('html')[0].scrollTop;

            if (scrollTop < window.innerHeight) {
                var scrollPercent = scrollTop / (window.innerHeight/2);
                console.log(scrollPercent * this._anim.duration);
                
                
                this._anim.seek(scrollPercent * this._anim.duration);
            }
        };
    }
}