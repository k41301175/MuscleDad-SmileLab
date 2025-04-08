// Hide Sidebar
function hide_sidebar() {
    objs = document.getElementsByClassName("sidebar");
    for (obj of objs){
        obj.style.display="none";
    }
}

hide_sidebar();