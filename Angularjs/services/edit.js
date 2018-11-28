angular.module('sepmanager')
    .config(function ($stateProvider) {
        $stateProvider
            .state('root.frozen.edit', {
                url: '/frozen/edit/:id',
                templateUrl: '/angular/frozen/edit/edit.html',
                resolve: {
                    customerenrollmentrecords: ['ServiceBase', '$stateParams', function (service, $stateParams) {
                        return service.search('enrollments/Customer_Enrollment_Record', { Customer_Check_Record_Id: $stateParams.id, Status: 'Frozen' });
                    }]
                    ,
                    last_4: ['$http', 'customerenrollmentrecords', function ($http,
                        customerenrollmentrecords) {
                        if (customerenrollmentrecords[0].Customer_Check_Record &&
                            customerenrollmentrecords[0].Customer_Check_Record.Request &&
                            customerenrollmentrecords[0].Customer_Check_Record.Request.Social_Security_Number) {
                            var ssn_escaped = encodeURIComponent(customerenrollmentrecords[0].Customer_Check_Record.Request.Social_Security_Number);
                            return $http.get('api/last_four?key=' + ssn_escaped).then(function (response) {
                                    return response.data;
                                });
                        }
                        return "";
                    }]
                },
                controller: ['customerenrollmentrecords', 'user', 'ServiceBase', 'last_4', '$state', '$q', function (customerenrollmentrecords, user, service, last_4, $state, $q) {
                    var ctrl = this;
                    var ssn;
                    if (customerenrollmentrecords[0].Customer_Check_Record && customerenrollmentrecords[0].Customer_Check_Record.Request && customerenrollmentrecords[0].Customer_Check_Record.Request.Social_Security_Number) {
                        ctrl.ssn = last_4;
                    }
                    ctrl.user = user;    
                    if (customerenrollmentrecords && customerenrollmentrecords.length > 0) {
                        ctrl.customerenrollmentrecord = customerenrollmentrecords[0];
                    }

                    ctrl.saveAsCreditReview = function(status) {
                        if (ctrl.note) { 
                            var note = { Entered_By: ctrl.user, Content: ctrl.note, Date_Created: new Date() };
                            service.update('Customer_checks/Process/FrozenToCreditReview/' + ctrl.customerenrollmentrecord.Customer_Check_Record.Id, note).then(function (response) {
                                $state.go('root.frozen.list', null, { reload: true });
                            });
                        }
                    }
                    ctrl.save = function (status) {

                        if (ctrl.note) {
                            var note = { Entered_By: ctrl.user, Content: ctrl.note, Date_Created: new Date() };
                            service.update('Customer_checks/Process/Retry_Credit/' + ctrl.customerenrollmentrecord.Customer_Check_Record.Id, note).then(function (response) {
                                $state.go('root.frozen.list', null, { reload: true });
                            });
                        }
                    }

                    ctrl.cancel = function () {

                        if (ctrl.note) {

                            ctrl.customerenrollmentrecord.Enrollments.forEach(function (enrollment) {
                                enrollment.Notes.push({ Entered_By: ctrl.user, Content: ctrl.note, Date_Entered: new Date() });
                                enrollment.Status = "Canceled";
                            });

                            var promises = [];
                            ctrl.customerenrollmentrecord.Enrollments.forEach(function (enrollment) {
                                promises.push(service.update('enrollments', enrollment));
                            });

                            $q.all(promises).then(function (results) {
                                $state.go('root.frozen.list', null, { reload: true });
                            });
                        }
                    }

                    ctrl.add_note_and_update = function () {
                        if (ctrl.newnotetext) {
                            var newnote = { Entered_By: ctrl.user, Content: ctrl.newnotetext, Date_Entered: new Date() };
                            ctrl.customerenrollmentrecord.Customer_Check_Record.Notes.push(newnote);
                            service.update('Customer_checks', ctrl.customerenrollmentrecord.Customer_Check_Record).then(function (response) {
                                $state.go('root.frozen.list', null, { reload: true });
                            });
                        }
                    }


                }],
                controllerAs: 'ctrl'
            });
    });