(function () {
    'use strict';

    angular
        .module('myapp')
        .controller('HomeController', HomeController);

    HomeController.$inject = ['$log'];

    function HomeController($log) {
        var vm = this;
        vm.title = 'Hello from Home Controller';

        activate();

        ////////////////

        function activate() {}
    }
})();