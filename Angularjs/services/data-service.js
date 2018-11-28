angular.module('price-updater')
    .factory('ServiceBase', ['$http', '$q', function ($http, $q) {

        let configuration = {
            baseUrl: 'http://localhost:3000/api/'
            //, subkey: 'abacdakjd04'
        };

        let usertoken = null;


        var loadConfig = function () {
            var deferred = $q.defer();
            if (!configuration.baseUrl || !configuration.subkey) {

                $q.all({
                    configuration: $http.get('/api/apiconfig'),
                    usertoken: $http.get('/api/Users/GetUserToken')
                }).then(function (results) {
                    configuration.baseUrl = results.configuration.data.url;
                    configuration.subkey = results.configuration.data.subkey;
                    configuration.usertoken = results.usertoken.data;
                    deferred.resolve(configuration);
                });
            }
            else
                deferred.resolve(configuration);
            return deferred.promise;
        }

        let configureRequest = function (path, method, data) {
            return loadConfig().then(function (config) {
                var req = {
                    url: configuration.baseUrl + path,
                    method: method,
                    cache: false
                };

                if (configuration.subkey) {
                    req.headers = {
                        "Ocp-Apim-Subscription-Key": configuration.subkey,
                        "Authorization": 'Bearer ' + configuration.usertoken
                    }
                }
                if (data) {
                    if (req.method == 'GET') {
                        req.url += '/?' + $.param(data);
                    }
                    else
                        req.data = data;
                }
                return req;
            });
        };

        var processRequest = function (req) {
            return $http(req)
                .then(function (response) {
                    return response.data;
                });
        };

        return {
            today: function () {
                var dt = new Date();
                return this.get_date_part(dt);
            },
            get_date_part: function (date) {
                date.setHours(0);
                date.setMinutes(0);
                date.setSeconds(0);
                date.setMilliseconds(0);
                return date;
            },
            get: function (type, id) {
                let req = configureRequest(type + '/' + id, 'GET').then(function (req) {
                    return processRequest(req);
                });
                return req;
            },
            search: function (type, data) {
                let req = configureRequest(type, 'GET', data).then(function (req) {
                    return processRequest(req);
                });
                return req;
            },
            post: function (type, data) {
                let req = configureRequest(type, 'POST', data).then(function (req) {
                    return processRequest(req);
                });
                return req;
            },
            add: function (type, item) {
                let req = configureRequest(type, 'POST', item).then(function (req) {
                    return processRequest(req);
                });
                return req;
            },
            update: function (type, item) {
                let req = configureRequest(type, 'PUT', item).then(function (req) {
                    return processRequest(req);
                });
                return req;
            },
            patch: function (type, id, data, relativepath) {
                let fullpath = type + '/' + id;
                if (relativepath)
                    fullpath += '/' + relativepath;
                let req = configureRequest(fullpath, 'PATCH', data).then(function (req) {
                    return processRequest(req);
                });
                return req;
            },
            remove: function (type, id) {
                let req = configureRequest(type + '/' + id, 'DELETE').then(function (req) {
                    return processRequest(req);
                });
                return req;
            }
        };
    }]);