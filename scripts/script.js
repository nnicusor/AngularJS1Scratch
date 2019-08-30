
angular.module('myModule', ['ngCookies']).controller("myController", ['$scope', '$http', '$cookies', 'handleCookies',
    ($scope, $http, $cookies, handleCookies) => {
    $http.get('https://api.github.com/users')
        .then((data) => {
        $scope.users_data_array = {
            users_data: data.data,
            usersLength: data.data.length
        }
    });
    $http.get('https://api.github.com/repositories')
        .then((response) => {
        $scope.repos_data_array = {
            repos_data: response.data,
            reposLength: response.data.length
        }
    });

    $scope.description = '';

    const changed_repos = handleCookies.getCookieValue($cookies, 'changed_repos_cookie');

    $scope.saveDescription = (repo_description, repo) => {
        console.log(1, repo_description, repo);

        let found = false;
        for(let i = 0; i < changed_repos.length; ++i) {
            if (repo.id === changed_repos[i].ID) {
                changed_repos[i].description = repo_description;
                found = true;
                break;
            }
        }

        if(!found){
            console.log('Object to push:', {
                ID: repo.id,
                description: repo_description,
            });

            changed_repos.push({
                ID: repo.id,
                description: repo_description,
            });
        }

        console.log(3, changed_repos);
        handleCookies.addCookie($cookies, changed_repos);
    };

    $scope.rowLimit = 25;
}]).service('handleCookies', function() {
    this.addCookie = (cookieScope, cookie_objects) => {
        // console.log(4, cookie_objects);
        cookieScope.remove('changed_repos_cookie');

        let objects_string = '[';
        // console.log('Cookie objects to transform:', cookie_objects.length);
        for(let i = 0; i < cookie_objects.length; ++i){
            if(i === cookie_objects.length - 1)
                objects_string += `${JSON.stringify(cookie_objects[i])}`;
            else
                objects_string += `${JSON.stringify(cookie_objects[i])},`;
        }
        objects_string += ']';
        // console.log(5, objects_string);

        const expireDate = new Date();
        expireDate.setDate(expireDate.getDate() + 100);

        return cookieScope.put('changed_repos_cookie', objects_string, {'expires': expireDate});
    };

    this.getCookieValue = (cookieScope, key) => {
        return cookieScope.getObject(key);
    }
});





