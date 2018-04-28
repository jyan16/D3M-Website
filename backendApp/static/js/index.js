let i = 0;
let txt = 'DMhub changes the way you look at data ...';
let speed = 80;
$(document).ready(function a(){
    if (i < txt.length) {
        document.getElementById("demo").innerHTML += txt.charAt(i);
        i++;
        setTimeout(a,speed);
    }
});

$('#id_docfile').change(function() {
    let file = $('#id_docfile')[0].files[0].name;
    document.getElementById("filechoosen").innerHTML = file
});
