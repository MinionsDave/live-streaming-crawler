$(function () {
    $("#menu-toggle").click(function(e) {
        e.preventDefault();
        $("#wrapper").toggleClass("toggled");
    });

    (function () {
        var pathname = window.location.pathname.substring(1);
        $('#sidebar-wrapper a[href="' + pathname + '"]').addClass('active');
    })();
});
