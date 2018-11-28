angular.module('sepmanager')
    .config(function ($stateProvider) {
        $stateProvider
            .state('root', {
                abstract: true,
                templateUrl: '/angular/root/root.html',
                resolve: {
                    user: ['$http', function ($http) {
                        return $http.get('/api/currentuser').then(function (response) {
                            return response.data;
                        });
                    }]
                },
                controller: ['user', function (user) {
                    var ctrl = this;
                    ctrl.user = user;
                }],
                controllerAs: 'ctrl'
            });
    });