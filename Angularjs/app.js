angular.module('sepmanager', ['ngSanitize', 'ngMessages', 'ui.router', 'isteven-multi-select', 'angular.filter', 'ui.bootstrap', 'ngTagsInput', 'textAngular'])
    .config(function ($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise('/');
    })
    .filter('underscoreless', function () {
        return function (input) {
            return input.replace(/_/g, ' ');
        };
    })
    .run(['$rootScope', '$state', '$http', 'ServiceBase', function ($rootScope, $state, $http, service) {
        var self = this;
        $http.get('/api/groups').then(function (response) {
            self.groups = response.data;
        });

        $http.get('/api/currentuser').then(function (response) {
            self.currentuser = response.data;
        });

        service.get('AppPermissions', 'appname/SepManager').then(function (response) {
             self.permissions = response;
        });;

        $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {

            if (self.groups && toState.data && toState.data.groups && self.permissions) {

                var current_group = toState.data.groups[0];
                var groupExists = self.permissions.filter(function (x) {
                    return x.Group === current_group;
                });

                if (groupExists && groupExists.length > 0) {

                    var current_user_group = groupExists[0];
                    if (current_user_group.Users && current_user_group.Users.length > 0) {

                        var userresult = current_user_group.Users.filter(function (u) {
                            return (u === self.currentuser);
                        });

                        if (userresult && userresult.length > 0) {
                        }  
                        else { 
                            $state.go('root.unauthorized');
                        }
                    }
                }
                else {
                    $state.go('root.unauthorized');
                }
            }
        });
    }]);