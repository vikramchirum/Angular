angular.module('price-updater').directive('uniqueName', ['$q', '$timeout', 'ServiceBase', function ($q, $timeout, ServiceBase) {
    return {
        restrict: "A",
        require: "ngModel",
        scope: { uniqueoptions: '=' },
        link: function (scope, element, attrs, ctrl) {
            ctrl.$asyncValidators.unique = function (modelValue, viewValue) {

                var deferred = $q.defer();

                var currentName = modelValue || viewValue;
                var uniqueKey = scope.uniqueoptions.UniqueKey;
                var type = scope.uniqueoptions.Type;

                if (currentName) {

                    var searchOption = {};
                    searchOption[uniqueKey] = currentName;

                    if (scope.uniqueoptions.ignoreValues) {

                        var matchItem = scope.uniqueoptions.ignoreValues.filter(function (item) {
                            return item.toLowerCase() == currentName.toLowerCase();
                        });

                        if (matchItem.length > 0)
                            deferred.resolve();
                    }

                    ServiceBase.search(type, searchOption).then(function (response) {

                        if (response.Items) {
                            response = response.Items;
                        }

                        if (response.length > 0) {
                            var matches = response.filter(function (item) {
                                if (item[scope.uniqueoptions.UniqueKey])
                                    return item[scope.uniqueoptions.UniqueKey].toLowerCase() == currentName.toLowerCase();
                                return true;
                            });

                            if (matches.length && matches.length > 0)
                                deferred.reject();
                            else
                                deferred.resolve();
                        }
                        else {
                            deferred.resolve();
                        }
                    });
                }
                else {

                    deferred.resolve();
                }

                return deferred.promise;
            };
        }
    };
}]);