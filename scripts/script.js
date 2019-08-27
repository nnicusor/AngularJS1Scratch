
angular.module('myModule', []).controller("myController", ($scope, $http) => {
    $http.get('https://api.github.com/users')
        .then((data) => {
            console.log(data.data);
        $scope.data = {
            users_data: data.data,
            usersLength: data.length
        }
    });

    $scope.rowLimit = 25;
});

