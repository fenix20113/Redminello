angular.module('app', [
    'ui.router',
    'mainController',
    'mainDirective',
    'ngDraggable',
    'ngLoadingSpinner',
    'mainService'
])

    .constant('REDMINE_URL', 'https://redmine.ekreative.com')

    .config(function ($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise("/login");
        //
        // Now set up the states
        $stateProvider
            .state('login', {
                url: "/login",
                templateUrl: "templates/login.html",
                controller: 'loginController'
            })

            .state('app', {
                url: "/app",
                abstract: true,
                templateUrl: "templates/main.html",
                controller: 'appController'
            })

            .state('app.projects', {
                url: "/projects",
                views: {
                    'contentView@app': {
                        templateUrl: "templates/projects.html",
                        controller: 'projectsController'
                    }
                }

            })

            .state('app.project', {
                url: "/project/:id",
                views: {
                    'contentView@app': {
                        templateUrl: "templates/project.html",
                        controller: 'projectController'
                    }
                }

            })

        ;
    });
