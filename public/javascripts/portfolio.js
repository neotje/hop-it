$(document).ready(()=>{
    $('.button_next-section').click((e)=>{
        $(e.currentTarget).parents('section').next()[0].scrollIntoView();
    });
});