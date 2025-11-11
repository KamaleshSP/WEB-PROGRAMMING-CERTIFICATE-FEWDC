document.addEventListener("DOMContentLoaded", function(){
    const text = document.getElementById('textPara');
    document.getElementById('highlightBtn').addEventListener("click", function(){
        text.classList.toggle("highlight");
    });
});