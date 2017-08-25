/**
 * Created by Jimmy on 2017/8/24.
 *
 * global require
 */
const angular = require('angular');
require('angular-ui-router');
require('oclazyload');
require('./sass/main.scss');
const app = angular.module('myApp',['ui.router','oc.lazyLoad']);
require('./module/app').default(app);
app.config(['$stateProvider', '$locationProvider', '$urlRouterProvider',function ($stateProvider,$locationProvider,$urlRouterProvider) {
    $locationProvider.html5Mode(true);
    // $locationProvider.hashPrefix('!');
    //home
    $stateProvider.state('home', {
        url: '/home',
        templateProvider: ['$q', function ($q) {
            let deferred = $q.defer();
            require.ensure(['./template/home/index.html'], function () {
                let template = require('./template/home/index.html');
                deferred.resolve(template);
            },'home');
            return deferred.promise;
        }],
        controller: 'homeController',
        controllerAs: 'home',
        resolve: {
            deps: ['$q', '$ocLazyLoad', function ($q, $ocLazyLoad) {
                let deferred = $q.defer();
                require.ensure([], function () {
                    let module = require('./module/home.js').default(angular);
                    $ocLazyLoad.load({
                        name: 'homeApp'
                    });
                    deferred.resolve(module);
                },'home');

                return deferred.promise;
            }]
        }
    });

    //business
    $stateProvider.state('business', {
        url: '/business',
        templateProvider: ['$q', function ($q) {
            let deferred = $q.defer();
            require.ensure(['./template/business/index.html'], function () {
                let template = require('./template/business/index.html');
                deferred.resolve(template);
            },'business');
            return deferred.promise;
        }],
        controller: 'businessController',
        controllerAs: 'business',
        resolve: {
            deps: ['$q', '$ocLazyLoad', function ($q, $ocLazyLoad) {
                let deferred = $q.defer();
                require.ensure([], function () {
                    let module = require('./module/business.js').default(angular);
                    $ocLazyLoad.load({
                        name: 'businessApp'
                    });
                    deferred.resolve(module);
                },'business');

                return deferred.promise;
            }]
        }
    });
}])