angular.module('sepmanager')
    .config(function ($stateProvider) {
        $stateProvider
            .state('root.search', {
                template: '<div ui-view></div>',
                abstract: true
            });
    });