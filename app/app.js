var formApp = angular.module('formApp', []);

formApp.constant("Modernizr", Modernizr);

formApp.controller('FormController', ['$scope', 'Modernizr', function($scope, Modernizr){
    $scope.browser = {
      supportDate: Modernizr.inputtypes.date,
      supportTime: Modernizr.inputtypes.time
    };
    $scope.startDate = new Date().toJSON().slice(0, 10);
    $scope.endDate = new Date().toJSON().slice(0, 10);
    $scope.capacity = 3;
    $scope.runningBrowser = is.firefox()? 'Firefox': is.safari()? 'Safari': is.opera()? 'Opera': is.chrome()? 'Chrome': 'IE';
    // $scope.$watch('browser.supportDate', function(newValue, oldValue){
    //   var startDatepicker = $('#startDatepicker');
    //   console.log(oldValue);
    //   console.log(newValue);
    //   console.log(startDatepicker);
    //   if (newValue === false){
    //     startDatepicker.datepicker();
    //   }
    //   console.log(startDatepicker);
    // });
    $("#startDatepicker").datepicker({
      showOn: "button"
    });
    $("#endDatepicker").datepicker();
    $('#startTimepicker').timepicker({
      minuteStep: 30,
      secondStep: 1,
      template: 'modal',
      appendWidgetTo: 'body',
      showSeconds: true,
      defaultTime: false,
      showMeridian: false
    });
    $('#endTimepicker').timepicker({
      minuteStep: 30,
      secondStep: 1,
      template: 'modal',
      appendWidgetTo: 'body',
      showSeconds: true,
      defaultTime: false,
      showMeridian: false
    });
    // $('#startTimepicker').timepicker().on('changeTime.timepicker', function(e) {
    //   console.log('changing time');
    //   console.log('The time is ' + e.time.value);
    //   console.log('The hour is ' + e.time.hours);
    //   console.log('The minute is ' + e.time.minutes);
    //   console.log('The meridian is ' + e.time.meridian);
    // });
    // $scope.sites = [
    //     {site: 'KLB - Tower 5', select: true},
    //     {site: 'KLB - Tower 2A'},
    //     {site: 'SUITE'}
    // ];
    // $scope.floors0 = [
    //     {floor: 'Level 1'},
    //     {floor: 'Level 2'},
    //     {floor: 'Level 3'},
    //     {floor: 'Level 3A'},
    //     {floor: 'Level 5'},
    //     {floor: 'Level 6'},
    //     {floor: 'Level 7'},
    //     {floor: 'Level 8'},
    //     {floor: 'Level 9'},
    //     {floor: 'Level 10'},
    //     {floor: 'Level 11'},
    //     {floor: 'Level 12'},
    // ];
    // $scope.floors1 = [{floor: 'Level 3'}];
    // $scope.floors2 = [{floor: 'Level 1'}];
    // $scope.siteFirst = [{first: 'Choose Site First!'}];
    $scope.$watch('mySite', function(newvalue, oldValue){
        var elem = document.querySelector('#floor');
        /* if 05tower is selected */
        if ($scope.mySite == ''){
            elem.options[0].selected = true;
            for (var h = 1; h < 13; h++){
                if (!elem.options[h].disabled)
                    elem.options[h].disabled = true;
            }
        }
        
        if ($scope.mySite == '05tower'){
            elem.options[0].selected = true;
            for (var i = 1; i < 13; i++){
                /* all must be enabled... */
                if (elem.options[i].disabled) 
                    elem.options[i].disabled = false;
            }
        }
        if ($scope.mySite == '2atower'){
            elem.options[3].selected = true;
            for (var j = 1; j < 13; j++){
                /* all disabled except [3] must be enabled... */
                if (!elem.options[j].disabled){
                    if (j== 3);
                    else elem.options[j].disabled = true;
                }else
                    elem.options[3].disabled = false;
            }
        }
        if ($scope.mySite == 'suite'){
            elem.options[1].selected = true;
            for (var k = 1; k < 13; k++){
                /* all disabled except [1] must be enabled... */
                if (!elem.options[k].disabled)
                    if (k == 1) ;// do nothing
                    else elem.options[k].disabled = true;
                else
                    elem.options[1].disabled = false;
            }
        }
    });
}]);