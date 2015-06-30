angular.module('mainController', [])

    .controller('appController', function ($scope, redmineApi, localStorageService, $rootScope) {
        //redmineApi.getStatuses().then(function (resp) {
        //    if (200 == resp.status) {
        //        var _statuses = angular.toJson(resp.data.issue_statuses);
        //        localStorageService.set('status', _statuses);
        //    }
        //});

        $rootScope.userId = localStorageService.get('userId');
    })


    .controller('projectController', function ($scope, redmineApi, $log, $state, $rootScope) {

        var updateIssue = function () {
            redmineApi.getProjectIssues($state.params.id).then(function (resp) {
                $scope.issues = resp.data.issues;

            });
        };

        updateIssue();

        $scope.$on('updateIssues', updateIssue);

        $scope.onDropComplete1 = function (data, event) {
            console.log(data);
            //data.status.id = 1;
            redmineApi.updateIssue(data.id, {
                status_id: 1
            }).then(function(resp) {
                $rootScope.$broadcast('updateIssues');
                $log.debug(resp)
            })


        };
        $scope.onDropComplete2 = function (data, event) {
            console.log(data);
            //data.status.id = 2;
            redmineApi.updateIssue( data.id, {
                status_id: 2
            }).then(function(resp) {
                $rootScope.$broadcast('updateIssues');
                $log.debug(resp)
            })
        };

        $scope.onDropComplete3 = function (data, event) {
            console.log(data);
            //data.status.id = 9;
            redmineApi.updateIssue( data.id, {
                status_id: 9
            }).then(function(resp) {
                $rootScope.$broadcast('updateIssues');
                $log.debug(resp)
            })
        }

    })

    .controller('projectsController', function ($scope, redmineApi, $log, $rootScope) {

        var loadProjects = function () {
            redmineApi.getProjects().then(function (resp) {
                $log.debug(resp);
                var projects = resp.data.projects;

                redmineApi.getIssues().then(function (issues) {
                    //$log.debug(issues);

                    projects.forEach(function (project) {
                        project.issues = {
                            new: 0,
                            inProgress: 0,
                            done: 0
                        };


                        redmineApi.getMemberships(project.id).then(function (resp) {
                            //resp.data.memberships.forEach(function (membership) {
                            project.memberships = resp.data.memberships.filter(function (o) {
                                return o.roles.filter(function (role) {

                                    return role.id == 9;
                                }).length
                            });
                        });


                        issues.forEach(function (val) {
                            if (project.id == val.project.id) {

                                if (val.assigned_to && (val.assigned_to.id ==  $rootScope.userId)) {
                                    if (val.status.id == 1) {
                                        project.issues.new++
                                    } else if (val.status.id == 2) {
                                        project.issues.inProgress++
                                    } else if (val.status.id == 9) {
                                        project.issues.done++
                                    }

                                }
                            }
                        });

                    })

                });

                $scope.projects = projects;

            });
        };

        $scope.$on('$stateChangeSuccess ', loadProjects);
        loadProjects();


    })

    .controller('loginController', function ($scope, $log, trelloUser) {
        $scope.credentials = {};
        $scope.login = function (form) {
            if (form.$invalid) {
                return false;
            }
            trelloUser.login($scope.credentials);

        }
    });

