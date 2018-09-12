var app = angular.module('shApp',['ngRoute']);
app.config(function($routeProvider){
    $routeProvider.when('/products',{templateUrl: '/views/products.html', controller:'productsController'});
    $routeProvider.when('/products/:id',{templateUrl: '/views/detail.html', controller:'detailController'});
});
