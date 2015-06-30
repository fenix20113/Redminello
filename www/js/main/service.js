angular.module('mainService', ['base64', 'LocalStorageModule'])
    .factory('redmineApi', function (REDMINE_URL, $http, $log, $base64, localStorageService, $q) {
        var api_key = localStorageService.get('apiKey');

        return {
            login: function (credentials) {
                credentials = credentials.username + ':' + credentials.pwd;
                var _encoded = $base64.encode(credentials);
                $log.debug("Basic " + _encoded);
                $http.defaults.headers.common['Authorization'] = "Basic " + _encoded;

                return $http.get(REDMINE_URL + '/users/current.json ', {
                    responseType: 'json'
                })
            },

            updateIssue: function (id, issue) {
                var api_key = localStorageService.get('apiKey');

                return $http.put(REDMINE_URL + '/issues/' + id + '.json', {
                    issue: issue
                }, {
                    headers: {
                        'Content-Type': 'application/json',
                        'X-Redmine-API-Key': api_key
                    }
                })
            },

            getProjects: function () {
                var api_key = localStorageService.get('apiKey');

                return $http.get(REDMINE_URL + '/projects.json', {
                    responseType: 'json',
                    params: {
                        limit: 20
                    },
                    headers: {
                        'X-Redmine-API-Key': api_key
                    }
                })
            },
            getProjectIssues: function (project_id) {
                var api_key = localStorageService.get('apiKey');

                return $http.get(REDMINE_URL + '/projects/' + project_id + '/issues.json', {
                    responseType: 'json',
                    params: {
                        status_id: '*'
                    },
                    headers: {
                        'X-Redmine-API-Key': api_key
                    }
                })
            },

            getMemberships: function (project_id) {
                var api_key = localStorageService.get('apiKey');

                return $http.get(REDMINE_URL + '/projects/' + project_id + '/memberships.json ', {
                    responseType: 'json',
                    headers: {
                        'X-Redmine-API-Key': api_key
                    }
                })
            },

            getIssues: function () {
                var api_key = localStorageService.get('apiKey');

                var deferred = $q.defer(),
                    offset = 0,
                    i = 0,
                    issues = [],
                    n = 1;

                var loadMore = function () {
                    return $http.get(REDMINE_URL + '/issues.json', {
                        responseType: 'json',
                        params: {
                            limit: 100,
                            offset: offset,
                            status_id: '*'
                        },
                        headers: {
                            'X-Redmine-API-Key': api_key
                        }
                    }).then(function (resp) {
                        n = Math.floor(resp.data.total_count / 100) - 1;
                        issues = issues.concat(resp.data.issues);
                        i++;
                        offset += 100;

                        if (i <= n + 1) {
                            loadMore();

                        } else {
                            deferred.resolve(issues);
                        }
                    });
                };

                loadMore();

                return deferred.promise;
            },
            getStatuses: function () {
                var _api_key = localStorageService.get('apiKey');
                return $http.get(REDMINE_URL + '/issue_statuses.json ', {
                    responseType: 'json',
                    headers: {
                        'X-Redmine-API-Key': _api_key
                    }
                })
            }
        }
    })
    .factory('trelloUser', function ($log, redmineApi, localStorageService, $state) {
        return {
            login: function (credentilas) {
                $log.debug('do login', credentilas);

                redmineApi.login(credentilas).then(function (resp) {
                    $log.debug(resp);
                    if (200 == resp.status) {
                        localStorageService.set('apiKey', resp.data.user.api_key);
                        localStorageService.set('userId', resp.data.user.id);

                        setTimeout(function() {
                            $state.go('app.projects');
                        }, 500);

                    }

                })
            }
        }
    });
