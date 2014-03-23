var classesApp = angular.module('classesApp', []);
 
classesApp.controller('ClassesListCtrl', function ($scope, $http) {
   $http.get('json/classes.json').success(function(data) {
       $scope.classes = data;
       console.log(data);
   });
});
