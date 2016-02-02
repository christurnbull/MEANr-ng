'use strict';

/**
 * @ngdoc function
 * @name ngApp.controller:AuditCtrl
 * @license MIT
 * @copyright 2016 Chris Turnbull <https://github.com/christurnbull>
 * @description Audit logs
 */
angular.module('ngApp')
  .controller('AuditCtrl', function($scope, $routeParams, c_api, c_chart, c_metaUpdate) {

    /**
     * Init
     */
    var api = c_api;
    $scope.api = api;
    var chart = c_chart;
    $scope.chart = chart;
    $scope.meta = c_metaUpdate();


    $scope.serverFilter = {
      loading: false,
      nores: false,
      data: {
        from: new Date(Date.now() + -1 * 24 * 3600 * 1000),
        to: new Date(),
        limit: 1000
      },
      update: function() {
        getData(this.data);
      },
      reset: function() {
        this.data = {
          from: new Date(Date.now() + -1 * 24 * 3600 * 1000),
          to: new Date(),
          limit: 1000
        };
        getData(this.data);
      },
    };

    setInterval(function() {
      if ($scope.autorefresh.enabled) {
        $scope.serverFilter.data.to = new Date();
        getData($scope.serverFilter.data);
      }
    }, 1000);


    /**
     * Private
     */
    function getData(criteria) {

      api.admin.audit(criteria, function(res) {
        $scope.audit = res;
        chart.setData(res);
      }, function(res) {
        api.message.set(res);
      });
    }

    getData($scope.serverFilter.data);


    /**
     * Public
     */
    $scope.autorefresh = {
      enabled: false,
      toggle: function() {
        this.enabled = !this.enabled;
      }
    };


    $scope.typeahead = function(key, val) {
      var req = {
        chart: 'audit'
      };
      req[key] = val;
      return api.admin.typeahead(req).$promise;
    };


    $scope.datepicker = {
      from: {
        opened: false
      },
      to: {
        opened: false
      },
      open: function(type) {
        $scope.datepicker[type].opened = true;
      },
      meridian: false
    };

  });
