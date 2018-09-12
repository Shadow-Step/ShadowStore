app.controller('productsController',function($scope,$http){
    $http.get('/products').
    then(function success(response) {
            $scope.products=response.data;
    }, function error(response){
            
    }
    );
});