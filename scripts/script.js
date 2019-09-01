
angular.module('myModule', ['ngCookies']).controller("myController", ['$scope', '$http', '$cookies', 'handleCookies', 'handleArrays',
    ($scope, $http, $cookies, handleCookies, handleArrays) => {
        $http.get('https://api.github.com/users')
            .then((data) => {
                $scope.users_data_array = {
                    users_data: data.data,
                    usersLength: data.data.length
                }
            });
        // let changed_repos = [];
        let changed_repos = handleCookies.getCookieValue($cookies, 'changed_repos_cookie');

        console.log('Din cokie am primit -> ', changed_repos);
        $http.get('https://api.github.com/repositories')
            .then((response) => {
                $scope.repos_data_array = {
                    repos_data: response.data,
                    reposLength: response.data.length
                };

                if(changed_repos) {
                    for(let i = 0; i < changed_repos.length; ++i) {
                        const index = handleArrays.binarySearch($scope.repos_data_array.repos_data, changed_repos[i].ID);
                        if(index){
                            console.log('Am gasit index', index);
                            $scope.repos_data_array.repos_data[index].description = changed_repos[i].description;
                        }
                    }
                }
            });

        $scope.description = '';

        $scope.saveDescription = (repo_description, repo) => {
            console.log(1, repo_description, repo);

            let found = false;
            for (let i = 0; i < changed_repos.length; ++i) {
                if (repo.id === changed_repos[i].ID) {
                    changed_repos[i].description = repo_description;
                    found = true;
                    break;
                }
            }

            if (!found) {
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
}]).service('handleCookies', function () {
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
        console.log(5, objects_string);

        const expireDate = new Date();
        expireDate.setDate(expireDate.getDate() + 100);

        return cookieScope.put('changed_repos_cookie', objects_string, {'expires': expireDate});
    };

    this.getCookieValue = (cookieScope, key) => {
        const cookie = cookieScope.getObject(key);
        return cookie ? cookie : [];
    }
 }).service('handleArrays',function () {
    this.sortArrayAsc = (array) => {
        return array.sort();
    };

    this.binarySearch = (array, key) => {
        //console.log("Binary Search array:", array);
        let left = 0;
        let right = array.length - 1;

        let mid;
        while(left <= right) {
            mid = Math.round(( left + right ) / 2);
            //console.log('Mid setat:', mid);

            if(array[mid].id === key) return mid;

            if(array[mid].id < key) left = mid + 1;
            else right = mid - 1;
        }
        return -1;
    };
});