angular.module('sepmanager')
    .config(function ($stateProvider) {
        $stateProvider
            .state('root.search.details', {
                url: '/Search/:id',
                templateUrl: '/angular/search/details/details.html',
                resolve: {
                    enrollment: ['ServiceBase', '$stateParams', function (service, $stateParams) {
                        return service.get('enrollments', $stateParams.id);
                    }],
                    last_4: ['$http', 'enrollment', function ($http, enrollment) {
                        if (enrollment.Customer_Check_Record && enrollment.Customer_Check_Record.Request && enrollment.Customer_Check_Record.Request.Social_Security_Number) {
                            var ssn_escaped = encodeURIComponent(enrollment.Customer_Check_Record.Request.Social_Security_Number);
                            return $http.get('/api/last_four?key=' + ssn_escaped).then(function (response) {
                                return response.data;
                            });
                        }
                        return "";
                    }]
                },
                controller: ['enrollment', 'last_4', function (enrollment, last_4) {
                   
                    var ctrl = this;
                    if (enrollment.Customer_Check_Record && enrollment.Customer_Check_Record.Request && enrollment.Customer_Check_Record.Request.Social_Security_Number) {
                        enrollment.Customer_Check_Record.Request.Social_Security_Number = last_4;
                    }
                    ctrl.enrollment = enrollment;

                }],
                controllerAs: 'ctrl'
            });
    });