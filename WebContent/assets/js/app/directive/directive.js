'use strict';

define(['app', 'jquery', 'underscore'], function(app, $, _) {
	
	app.directive('messenger', ["$http", "AppConfig", "$state", "$location", "Socket", '$sce', '$compile', function($http, AppConfig, $state, $location, Socket, $sce, $compile) {
		return {
			restrict: "E",
			replace: true,
			templateUrl: window.contextPath + "partials/templates/messenger.html",
			link : function(scope, element, attrs, controller) {
				element.find('.create-group-btn').on('click', function(){
					element.find('[name=group]').removeClass('d-none');
				});
				
				scope.createGroupName = '';
				element.find('[ng-model="createGroupName"]').bind("keydown keypress", function (event) {
		            if(event.which === 13) {
		                scope.$apply(function (){
							scope.createGroupName = scope.createGroupName.trim();
							if(scope.createGroupName != '')
							{
								Socket.emit('group:insert', {name:scope.createGroupName});
								element.find('[name=group]').addClass('d-none');
							}
		                });
		                event.preventDefault();
		            }
		        });
				
				scope.getRoomMessages = function(roomHash){
					return scope.rooms[roomHash]['messages'];
				}
				
				scope.openConversation = function(roomHash){
					if($(element).find('[data-room-hash="'+roomHash+'"]').length)
					{
					//	$(element).find('[data-room-id="'+roomHash+'"]').style.display="show";
					}
					else
					{
						//  data-ng-bind="roomHash=\''+roomHash+'\'"
						$(element).find('#group-boxes').prepend($compile('<messenger-box data-room-hash="'+roomHash+'"></messenger-box>')( scope ));
					}
				};
				
				element.on('keydown keypress', '[data-room-hash] [name="message"]', function (event) {
		            if(event.which === 13) {
		            	if(event.currentTarget.value != '')
		            	{
		            		Socket.emit('message:send', {
		            			groupHash:$(event.currentTarget).closest('[data-room-hash]').data('room-hash'), 
		            			text:event.currentTarget.value
		            		});
		            		event.currentTarget.value = '';
		            	}
		                event.preventDefault();
		            }
		        });
			}
		};
	}]);
	

	app.directive("messengerBox", ['$rootScope', '$parse', function($rootScope, $parse) {
		return {
			templateUrl: window.contextPath+'partials/templates/messenger.box.tpl.html',
			scope: true,
			restrict: 'E',
			replace:true,
			controller: function($scope, $element, $attrs, $controller) {
				
			},
			link: function($scope, $element, $attrs)
			{
				$scope.roomHash = $attrs.roomHash;
			}
		};
	}]);
});
