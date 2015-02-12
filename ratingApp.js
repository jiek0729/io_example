var ratingApp = angular.module('ratingApp', ["ui.router"]);

function compareRating(rating1, rating2) {
	return rating1.rating - rating2.rating;
};

function compareUserRatingsByIdA(ur1, ur2) {
	return ur1.userId - ur2.userId;
};

function compareUserRatingsBynRatingsA(ur1, ur2) {
	return ur1.ratings.length - ur2.ratings.length;
};

function compareUserRatingsByIdD(ur1, ur2) {
	return ur2.userId - ur1.userId;
};

function compareUserRatingsBynRatingsD(ur1, ur2) {
	return ur2.ratings.length - ur1.ratings.length;
};

function UserStats(userRating) {
	this.nRatings = userRating.ratings.length;
	
	sum = 0;
	for(i = 0; i < userRating.ratings.length; i++) {
		sum += parseInt(userRating.ratings[i].rating); 
	}
	
	this.avgRating = sum / this.nRatings;
	
	userRating.ratings.sort(compareRating);
	
	medianRating = userRating.ratings[parseInt(this.nRatings / 2)];
	
	this.median = medianRating.rating;
	
	temp = 0;
	for(i = 0; i < userRating.ratings.length; i++) {
		temp += Math.pow(parseInt(userRating.ratings[i].rating) - this.avgRating, 2); 
	}
	
	this.stdDeviation = Math.sqrt(temp);
};

ratingApp.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state('home', {
        url: '/',
        templateUrl: 'templates/home.html'
    })
    .state('users', {
        url: '/users',
        templateUrl: 'templates/users.html',
        controller: 'RatingController'
    })
	.state('users.user', {
		url: '/:userId/stats',
		templateUrl: 'templates/users.user.stats.html',
		controller: function getUserStats($scope, $stateParams) {
			$scope.selectedUserId = $stateParams.userId;
			$scope.userStats = new UserStats($scope.userMap.ratingsByUser[$scope.selectedUserId]);
		}
	})
	
  $urlRouterProvider.otherwise('/');
});

ratingApp.controller(
'RatingController', RatingController);

function RatingController($scope, $window) {
	$scope.sortBy = [
	"User ASC", "User DESC", "Rating ASC", "Rating DESC"
	];
	
	$scope.comparators = [
	compareUserRatingsByIdA, compareUserRatingsByIdD, compareUserRatingsBynRatingsA, compareUserRatingsBynRatingsD
	];
	
	$scope.order = "User ASC";
	
	$scope.userMap = $window.ml4data;
	$scope.ratingsByUser = Object.keys($scope.userMap.ratingsByUser).map(function(key) {
	return $scope.userMap.ratingsByUser[key];
	});
	
	$scope.displayRatings = $scope.ratingsByUser;
	
	$scope.nRating = function nRating(userRating) {
		return userRating.ratings.length;
	};
	
	$scope.sort = function sort() {
		sortByOrder = $scope.comparators[$scope.sortBy.indexOf($scope.order)];
		
		$scope.displayRatings = $scope.ratingsByUser.sort(sortByOrder);
		$scope.userIdFilter = "";
	};
	
	$scope.filterUser = function filterUser() {
		$scope.displayRatings = new Array();
		for(i = 0; i < $scope.ratingsByUser.length; i++) {
			if($scope.ratingsByUser[i].userId.indexOf($scope.userIdFilter) > -1) {
					$scope.displayRatings.push($scope.ratingsByUser[i]);
			}
		}
	};
};