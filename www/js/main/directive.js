angular.module('mainDirective', [])
    .directive('project', function ($log, redmineApi) {
        return {
            restrict: 'E',
            scope: '=',
            templateUrl: 'templates/ui/project.html',
            link: function (scope, elem, attr) {

                elem.on('click', function (e) {
                    angular.element(document.querySelectorAll('project')).removeClass('active');
                    this.classList.add("active");
                    console.log(e)
                })

            }
        };
    })

    .directive('issue', function ($log, redmineApi) {
        return {
            restrict: 'E',
            scope: '=',
            templateUrl: 'templates/ui/issue.html',
            link: function (scope, elem, attr) {

                //elem.on('click', function (e) {
                //    angular.element(document.querySelectorAll('project')).removeClass('active');
                //    this.classList.add("active");
                //    console.log(e)
                //})

            }
        };
    })


    .filter('projectStatus', function (localStorageService) {
        return function (input) {

            var status = angular.fromJson(localStorageService.get('status')).filter(function(o){
               return input == o.id;
            });

            return status[0].name;
        };
    })

;
