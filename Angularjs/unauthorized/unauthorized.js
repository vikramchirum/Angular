angular.module('sepmanager')
    .config(function ($stateProvider) {
        $stateProvider
            .state('root.unauthorized', {
                url: '/Unauthorized',
                templateUrl: '/angular/unauthorized/unauthorized.html'
            });
    });