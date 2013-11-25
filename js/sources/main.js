/*

  This file is a simple Hello World display on client side

*/


$(function () {


    $.subscribe("welcome", function () {
        $("#main").empty().append(new Welcome());
    });

    $.subscribe("hello", function () {
        $("#main").empty().append(new HelloWorld());
    });


    $.publish("welcome");

});