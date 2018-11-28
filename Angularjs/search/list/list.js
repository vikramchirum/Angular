angular.module('sepmanager')
    .config(function ($stateProvider) {
        $stateProvider
            .state('root.search.list', {
                url: '/Search',
                templateUrl: '/angular/search/list/list.html',
                resolve: {
                    enrollments: ['ServiceBase', 'sepmanagerService', function (service, sep_service) {
                        return service.search('enrollments/pagedsearch', sep_service.Filters.Enrollments.formatted()).then(
                            function (result) {
                                return result;
                            },
                            function (error) {
                                if (error.status == 400 && error.data.Message == 'You must supply at least one search criteria')
                                    return null;
                            });
                    }],
                    status_list: ['ServiceBase', function (service) {
                        return service.search('enums/enrollmentStatusTypes');
                    }],
                    channels: ['ServiceBase', function (service) {
                        return service.search('channels');
                    }]
                },
                controller: ['enrollments', 'status_list', 'channels', 'ServiceBase', 'sepmanagerService', '$httpParamSerializer', function (enrollments, status_list, channels, service, sep_service, $httpParamSerializer) {
                    status_list = _.map(status_list, function (item) {
                        return { Id: item, Name: item };
                    });
                    var ctrl = this;

                    ctrl.boolToStr = function (arg) {
                        if (arg == null)
                            return 'Any'
                        return arg ? 'True' : 'False'
                    };

                    ctrl.param_serializer = $httpParamSerializer;
                    ctrl.status_list = status_list;
                    ctrl.channels = channels;

                    ctrl.enrollments = enrollments;

                    ctrl.option = sep_service.Filters.Enrollments;



                    ctrl.filter = function () {
                        service.search('enrollments/pagedsearch', ctrl.option.formatted()).then(
                            function (result) {
                                ctrl.enrollments = result;
                            },
                            function (error) {
                                if (error.status == 400 && error.data.Message == 'You must supply at least one search criteria')
                                    ctrl.enrollments = null;
                            });
                    };

                    ctrl.clear = function () {
                        ctrl.option = {
                            PageSize: 20,
                            PageIndex: 1
                        };
                        ctrl.enrollments = null;
                    };

                }],
                controllerAs: 'ctrl'
            });
    });