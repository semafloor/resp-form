var express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    cors = require('cors'),
    bodyParser = require('body-parser'),
    parseUrlencoded = bodyParser.urlencoded({
      extended: false
    })
//    stringify = require('json-stringify-safe');

// CORS-enabled for all origins!
app.use(cors());

// Firebase definition
var Firebase = require('firebase');
var semaphoreRef = new Firebase("https://polymer-semaphore.firebaseio.com/mockMessages");

// static content
app.use(express.static(__dirname));
// app.use(express.static('app'));

// return index.html for all non-static-content routes.
app.get('*', function(req, res) {
    // console.log(__dirname);
    //res.sendFile(__dirname + '/app/' + 'index.html');
    //console.log(__dirname + '/' + 'index.html' + i);
  
  // **ngin-x removed suffix port number
  // var reqHost = req.headers.host.slice(0, -5);
  // var reqHost = req.headers.host;
  var reqHost = req.hostname;
  if (reqHost === 'semafore.motss.koding.io' || reqHost === 'semafloor.com' || reqHost === 'www.semafloor.com'){
    res.sendFile(__dirname + '/app/' + 'index.html');
  }else {
    res.json('Error 404: Site(http://' + reqHost + '/) not found!');
  }
    //i++;
});

app.post('/search/results', parseUrlencoded, function(req, res) {
  // **ngin-x removed suffix port number
  // var reqHost = req.headers.host.slice(0, -5);
  // var reqHost = req.headers.host;
  var reqHost = req.hostname;
  console.log(reqHost);
  if (reqHost === 'semafore.motss.koding.io' || reqHost === 'semafloor.com' || reqHost === 'www.semafloor.com'){
        /* Variable Declaration */
    var year, month, day, floorCount, siteCount, setFloorCount, setSiteCount;
    var readySemaphore, queryHexTime, queryHexTypes, hexTime = [];
    var notTypes = false, notSite = false, notFloor = false, notSingleDay = false;
    // var time = [], capacity = [], types = [], site = [], floor = [], final = [];
    var multiDay = [], multiSite = [], multiFloor = [], multiRoom = [], multiCheck = [];
    var year_end, month_end, day_end;
    var startExecTime, stopExecTime;
    var matchMonth = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"];
    var matchTime = ['08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00', '22:30', '23:00', '23:30'];
    var fireTower = [
        ["01level", "02level", "03level", "04level", "05level", "06level",
            "07level", "08level", "09level", "10level", "11level", "12level"
        ],
        ["03level"],
        ["01level"]
    ];
    var fireSite = ["05tower", "2atower", "suite"];

    /* @@@#################### ROOMIFY API ################################## */
    /* check if req.body has any queryString */
    if (req.body) {
        /* ###################################################################*/
        /* @@@############### CALLBACK METHODS ############################## */
        /* ###################################################################*/
        /* slicing year, month, day from date input(s) 
            opt: 0 - year; 1 - month; 2 - day;
        */
        var dateChopper = function(date, opt) {
            if (opt === 0)
                return date.slice(0, 4);
            else if (opt === 1)
                return date.slice(6, 7) - 1;
            else
                return date.slice(8, 10);
        }

        /* Compute the week number from the date input(s) */
        var getWeek = function(year, month, day) {
            /* special method: getWeek() */
            var now = new Date(year, month, day);
            var onejan = new Date(now.getFullYear(), 0, 1);
            var week = Math.ceil((((now - onejan) / 86400000) + onejan.getDay() + 1) / 7);
            return week;
        }

        /* setting up fireChild(ren) to get room schedules from */
        var showRoom = function(week, year, month, day, callback) {
            setTimeout(function() {
                /* parameters before fireChild */
                /* <location_to_04may>/week<week_number> 
                orderByKey()
                snapshot.key() = week18
                snapshot.val() = '01': {}
                */
                var fireMonth = "0" + month + matchMonth[month];
                var fireDay = '/' + year + '/' + fireMonth + '/week' + week + '/' + day + '/site';
                
                /* setting new firebase location */
                console.log('\n--- Current Firebase Location: ');
                console.log('--- ' + semaphoreRef.child(fireDay).toString());

                /* validate FLOOR && SITE */
                if (notFloor) {
                    /* FLOOR === 1 && SITE === 1 */
                    setFloorCount = floorCount = 1;
                    setSiteCount = siteCount = 1;
                    if (notSite) {
                        var fireChild = fireDay + '/' + req.body.site + '/' + req.body.floor;
                        // console.log('FLOOR && SITE: ');
                        // console.log(semaphoreRef.child(fireChild).toString());
                        callback(fireChild, getTime);
                    }else {
                        /* FLOOR === 1 && SITE === 0 */
                        // placeholder for function...
                    }
                }else {
                    /* FLOOR === 0 && SITE === 1 */
                    setSiteCount = siteCount = 1;
                    if (notSite) {
                        setFloorCount = floorCount = 1;
                        if (req.body.site !== '05tower') {
                            var setFloor = '03level';
                            if (req.body.site === 'suite') setFloor = '01level';
                            var fireChild = fireDay + '/' + req.body.site + '/' + setFloor;
                            // console.log('!FLOOR && SITE - ' + setFloor + ': ');
                            // console.log(semaphoreRef.child(fireChild).toString());
                            callback(fireChild, getTime);
                        }else {
                            setFloorCount = floorCount = 12;
                            fireTower[0].forEach(function(elem, idx, arr) {
                                var fireChild = fireDay + '/' + req.body.site + '/' + elem;
                                console.log('!FLOOR && SITE - 05tower: ');
                                console.log(semaphoreRef.child(fireChild).toString());
                                callback(fireChild, getTime);
                            });
                        }
                    }else {
                        /* FLOOR === 0 && SITE === 0 */
                        setFloorCount = floorCount = 14;
                        setSiteCount = siteCount = 3;
                        for (var i = 0; i < fireSite.length; i++) {
                            if (fireTower[i].length > 1) {
                                fireTower[i].forEach(function(elem, idx, arr) {
                                    var fireChild = fireDay + '/' + fireSite[i] + '/' + elem;
                                    // console.log('!FLOOR && !SITE - 05tower: ')
                                    // console.log(semaphoreRef.child(fireChild).toString());
                                    callback(fireChild, getTime);
                                });
                            } else {
                                var fireChild = fireDay + '/' + fireSite[i] + '/' + fireTower[i];
                                // console.log('!FLOOR && !SITE - SUITE || 2A: ');
                                // console.log(semaphoreRef.child(fireChild).toString());
                                callback(fireChild, getTime);
                            }
                        }
                    }
                }
            }, 0);
        };

        /* set 1 if matches the QUERY TIME and is used when not full day */
        var parseTime = function(start_time, end_time, match_arr) {
            var startIdx, endIdx, computedTime_arr = [];
            match_arr.forEach(function(elem, idx, arr) {
                if (elem === start_time) startIdx = idx;
                if (elem === end_time) endIdx = idx;
            });
            for (var i = 0; i <= startIdx; i++) computedTime_arr[i] = 0;
            for (var j = startIdx; j <= endIdx; j++) computedTime_arr[j] = 1;
            for (var k = endIdx + 1; k < 32; k++) computedTime_arr[k] = 0;
            
            return computedTime_arr;
        };
        
        /* set 1 if matches the QUERY TYPES */
        var parseTypes = function(type0, type1, type2, type3, type4, type5, type6, type7, type8, type9, type10, type11){
            var temp = [];
            for (var i = 0; i < 12; i ++){
                if(arguments[i]) temp.push(1); else temp.push(0);
            }
            return temp;
        };

        /* convert array elements into BIN with callback for further conversion
            such as passing in parseHex() into the callback parameter.
        */
        var parseBinary = function(data, callback) {
            var str = '';
            data.forEach(function(elem, idx, arr) {
                str += elem;
            });
            if (callback) {
                return callback(str);
            } else {
                return str;
            }
        }

        /* convert BIN to HEX */
        var parseHex = function(data) {
            return '0x' + parseInt(data, 2).toString(16);
        }

        /* andyTime method callback with opt for andying arrays */
        var andyTime = function(generatedHex, oriHex, opt) {
            if (opt && opt > 0) {
                var len = generatedHex.length;
                var result = [];

                for (var i = 0; i < len; i++) {
                    result.push(generatedHex[i] & oriHex[i]);
                }
                generatedHex = oriHex = [];
                return result;
            } else {
                return generatedHex & oriHex;
            }
        };

        /* compare the current array elem with the subsequent array element */
        var compareMultiDays = function(compare_arr, callback) {
            var firstElem, nextElem;
            var firstElemPortions = [],
                nextElemPortions = [];

            if (typeof compare_arr[0] === 'object') {
                firstElem = parseBinary(compare_arr[0], parseHex);
                nextElem = parseBinary(compare_arr[1], parseHex);
                console.log('\nIf object found in compare_arr: ');
                console.log(firstElem);
                console.log(nextElem);
            } else {
                firstElem = compare_arr[0];
                nextElem = compare_arr[1];
                console.log('\nIf not object found in compare_arr: ');
                console.log(firstElem);
                console.log(nextElem);
            }

            var specialParse = function(data, output_arr) {
                output_arr.push(parseInt(data.slice(0, 4)));
                output_arr.push(parseInt('0x' + data.slice(4, 12)));
                output_arr.push(parseInt('0x' + data.slice(12, 20)));
                output_arr.push(parseInt('0x' + data.slice(20)));
            };

            /*specialParse(firstElem)*/
            specialParse(firstElem, firstElemPortions);
            firstElem = [];

            /*specialParse(nextElem)*/
            specialParse(nextElem, nextElemPortions);
            nextElem = [];

            /*AND two elements*/
            firstElem = callback(firstElemPortions, nextElemPortions, 1);
            nextElemPortions = [];

            if (compare_arr.length > 2) {
                console.log('Length: ' + compare_arr.length);
                for (var i = 2; i < compare_arr.length; i++) {
                    //            console.log('heere');
                    firstElemPortions = firstElem;
                    firstElem = [];
                    //            console.log('fep: ');
                    //            console.log(firstElemPortions);
                    if (typeof compare_arr[i] === 'object') {
                        nextElem = parseBinary(compare_arr[i], parseHex);
                        console.log(nextElem);
                    } else {
                        nextElem = compare_arr[i];
                        console.log(nextElem);
                    }
                    specialParse(nextElem, (nextElemPortions = []));
                    //            console.log('nep' + i + ': ' );
                    //            console.log(nextElemPortions);
                    firstElem = (callback(firstElemPortions, nextElemPortions, 1));
                }
            }
            return firstElem;
        };

        /* convert integer to HEX */
        var hexify = function(data, callback) {
            var hexify = [],
                hexult;
            data.forEach(function(data) {
                var dataLength = parseInt(data).toString(16).length;
                if (dataLength < 8 && callback) {
                    var trailingZeros = [];
                    for (var i = 0; i < (8 - dataLength); i++) {
                        trailingZeros.push(0);
                    }
                    trailingZeros.push(parseInt(data).toString(16));
                    hexify.push(callback(trailingZeros));
                } else {
                    hexify.push(parseInt(data).toString(16));
                }
            });
            hexult = '0x' + hexify[0].slice(5) + hexify[1] + hexify[2] + hexify[3];
            return hexult;
        };

        /* convert HEX to BIN */
        var binarify = function(data) {
            if (data[2] < 4) {
                return '0' + parseInt(data, 16).toString(2);
            }
            return parseInt(data, 16).toString(2);
        };

        /* compare ROOMS from multiple days and return the AVAILABLE_ROOMS... */
        var comparify = function(ary_notSingleDay_multiDay){
            var ctr_notSingleDay_multiDay_length = ary_notSingleDay_multiDay.length,
                ctr_cur_siteIdx,
                ctr_cur_floorIdx;
            var ctr_countNull = 0, ctr_roomCount = 0;
            var ary_room_temp = ary_notSingleDay_multiDay[0], 
                ary_cur_floor = [], 
                ary_cur_site = [], 
                ary_final_available = [];
            /* next day, day_n+1 */
            ary_notSingleDay_multiDay.forEach(function(elem, idx, arr){
                if (idx >= 1){
                    /* site */
                    elem.forEach(function(elem, idx, arr){
                        ctr_cur_siteIdx = idx;
                        // console.log(ctr_cur_siteIdx);
                        /* floor */
                        elem.forEach(function(elem, idx, arr){
                            ctr_cur_floorIdx = idx;
                            // console.log(ctr_cur_floorIdx);
                           /* room */
                           elem.forEach(function(elem, idx, arr){
                                ctr_roomCount = arr.length;
                                if (ctr_countNull < ctr_roomCount){
                                   /* first evaluation */
                                   if (ary_room_temp[ctr_cur_siteIdx][ctr_cur_floorIdx][idx] === null){
                                       ctr_countNull++;
                                   }
                                   if (ary_room_temp[ctr_cur_siteIdx][ctr_cur_floorIdx][idx] !== null && elem === null){
                                       ary_room_temp[ctr_cur_siteIdx][ctr_cur_floorIdx][idx] = null;
                                       ctr_countNull++;
                                   }
                                }else {
                                    ary_room_temp[ctr_cur_siteIdx][ctr_cur_floorIdx] = null;
                                    ctr_countNull = 0;
                                    return;
                                }
                           });
                           ctr_countNull = 0;
                        });
                    });
                }
            });
            ary_final_available = ary_room_temp;
            return ary_final_available;
        };
        
        /* check and compare multiDay array and listing all the names of selected ROOMs... */
        var roomify = function(multiDay_array){
            /* TODO:
                - notSingleDay - incomplete!
                - !notSingleDay - finished!
            */
            var day_len = multiDay_array.length;
            var selected_site = "", selected_floor = "";
            var ary_available_rooms = [], ary_available_floors = [], 
                ary_available_sites = [], obj_new_multiDay = {};
            
            /* replace notSingleDay to day_len > 1
                - problem exists when weekend is in the multiDay.
            */
            var temp_arr = notSingleDay? multiDay_array : multiDay_array[0];
            temp_arr.forEach(function(elem, idx, arr){
                var obj_cur_selected_site = {};
                elem.forEach(function(elem, idx, arr){
                    var obj_cur_selected_floor = {};
                    elem.forEach(function(elem, idx, arr){
                        var obj_cur_selected_room = {};
                        if (elem !== null){
                            if (!selected_site || !selected_floor){
                                selected_site = elem.site;
                                selected_floor = elem.floor;
                            }
                            obj_cur_selected_room.name = elem.name;
                            obj_cur_selected_room.address = elem.address;
                            ary_available_rooms.push(obj_cur_selected_room);
                        }    
                    });
                    if (selected_floor){
                        obj_cur_selected_floor.floor = selected_floor;
                        selected_floor = '';
                        obj_cur_selected_floor.available_rooms = ary_available_rooms;
                        ary_available_floors.push(obj_cur_selected_floor);
                        ary_available_rooms = [];
                    }
                });
                if (selected_site){
                    obj_cur_selected_site.site = selected_site;
                    selected_site = '';
                    obj_cur_selected_site.available_floors = ary_available_floors;
                    ary_available_sites.push(obj_cur_selected_site);
                    ary_available_floors = [];
                }
            });
            obj_new_multiDay.available_sites = ary_available_sites;
            return obj_new_multiDay;
        };

        /* return 1 if the QUERY matches TIME inside database */
        var matchTimeQuery = function(generatedHex, fireHex, callback, result_array, data_key) {
            var returnValue = false;
            if (callback(generatedHex, fireHex) === 0) returnValue = true;
            return returnValue;
        }
        
        /* return 1 if the QUERY matches CAPACITY inside database */
        var matchCapacityQuery = function(acquiredTime, fireTime, result_array, data_key){
            var returnValue = false;
            if (fireTime >= acquiredTime) returnValue = true;
            return returnValue;
        };
        
        /* return 1 if the QUERY matches TYPES inside database */
        var matchTypesQuery = function(generatedHex, fireHex, callback){
            var returnValue = false;
            if (callback(generatedHex, fireHex) === parseInt(generatedHex)) return true;
            return returnValue;
        };
        
        /* NOTHING TO DO WITH JSON! JUST CONSOLE LOGGING! */
        var resultify = function(multi_day, roomify_callback, comparify_callback, site, floor){
            /* Logging multiDay */
            var result_comparify;
            multi_day.forEach(function(elem, idx, arr){
                console.log('Final array' + idx + ': ' + elem);
            });
            if(site && floor){
                result_comparify = roomify_callback(comparify_callback(multi_day), organizedRoom, site, floor);
                console.log('Which Rooms meet QUERY: ');
                console.log(Object.keys(result_comparify).length <= 0);
                // if(Object.keys(result_comparify).length <= 0 || result_comparify[0] === undefined){
                if(Object.keys(result_comparify).length <= 0){
                    console.log('No room for your selection!');
                    result_comparify = 'No room found!';
                }else {
                    console.log('logging temporarily down!');
                }
            }else {
                result_comparify = roomify_callback(comparify_callback(multi_day), room);
                console.log('Which Rooms meet QUERY: ');
                console.log(Object.keys(result_comparify).length <= 0);
                // if(Object.keys(result_comparify).length <= 0 || result_comparify[0] === undefined){
                if(Object.keys(result_comparify).length <= 0){
                    console.log('No room found!');
                    result_comparify = 'No room for your selection!';
                }else {
                    console.log('logging temporarily down!');
                }    
            }
            
            return result_comparify;
        };
        
        /* consolidating room_name && room_info into an object */
        var roomNameify = function(data_key, data_val, fire_child) {
            var roomName = {}, room_info = {};
            room_info.site = data_val.site;
            room_info.floor = data_val.floor;
            room_info.name = data_key;
            room_info.address = fire_child;
            roomName = room_info;
            
            return roomName;
        }
        
        /* return the TIME from the ROOM */
        var getTime = function(fireChild) {
            /* date && time retrieve method callback */
            semaphoreRef.child(fireChild).orderByKey().on("value", function(snapshot) {
                /* extract time on that particular day */
                if (snapshot.val() === null) {
                    if (notSingleDay){
                        floorCount--;
                        if (!floorCount) {
                            readySemaphore--;
                            multiDay.push(null);
                            floorCount = setFloorCount;
                        }
                    }else {
                        floorCount--;
                        if (!floorCount) readySemaphore--;
                    }
                    
                    if (!readySemaphore) {
                        console.log('readySemaphore reaches ' + readySemaphore + '...');
                        /* Say there are holidays in the weekdays... */
                        if (notSingleDay){
                            console.log('last day is null');
                            /* Say all the selected weekdays were holidays... */
                            if (multiDay[0] === undefined) {
                                console.log('multiDay is empty!');
                                res.setHeader('Content-Type', 'application/json');
                                res.send(JSON.stringify('Today is either weekend or holiday!'));
                            }else {
                                /* Say there were days in the selected days weren't holidays regardless of last day was a holiday... */
                                // res.setHeader('Content-Type', 'application/json');
                                // res.send(JSON.stringify(finalRoomList, null, 4));
                                res.json(multiDay);
                                multiDay = [];
                            }
                        }else {
                            /* when the selected weekday is a holiday... */
                            res.json('Today is either weekend or holiday!');
                        }
                        /* Output TAT of the execution... */
                        captureEndExec();
                    }
                } else {
                    var len = 0;
                    if(notSite || notFloor || !notSite && !notFloor){
                        snapshot.forEach(function(data){
                            if(data.key()) len++;
                        });
                    }
                    snapshot.forEach(function(data) {
                        /* evaluate ROOM_INFO by passing in data.key(), data.val(), fireChild
                            && push the CURRENT_ROOM_INFO into ROOMLIST_ARRAY 
                        */
                        var current_room_info;
                        var checkFinal = true;
                        // after generating a new HEX for TIME from QUERY...
                        if (queryHexTime)
                            checkFinal &= matchTimeQuery(queryHexTime, data.val().time, andyTime);
                        
                        // after obtaining an INTEGER value from CAPACITY in QUERY...
                        if (req.body.capacity)
                            checkFinal &= matchCapacityQuery(req.body.capacity, data.val().capacity, andyTime);
                            
                        // if there is some values set on TYPES...   
                        if (notTypes && queryHexTypes)
                            checkFinal &= matchTypesQuery(queryHexTypes, data.val().types, andyTime);
                            
                        len--;  /* decrease room count at this floor */
                        
                        /* ONLY push this ROOM when this ROOM has a checkFinal equates TRUE... */
                        /*
                        len | checkFinal
                         0  |  0
                         0  |  1
                         1  |  0
                         1  |  1
                         
                         len 0
                         checkFinal 0
                         -----------------------------
                         - checkif multiRoom[0] is null/ empty, push NULL into multiFloor, else push multiRoom into multiFloor;
                         
                         len 0
                         checkFinal 1
                         -----------------------------
                         - push this current checkFinal/ current_room_info into multiRoom;
                         - checkif multiRoom[0] is null/ empty,
                         push NULL into multiFloor, else push multiRoom into multiFloor;
                         
                         len 1
                         checkFinal 0
                         -----------------------------
                         - not yet finish checking current floor;
                         - do nothing and continue checking current floor;
                         
                         len 1
                         checkFinal 1
                         -----------------------------
                         - not yet finish checking current floor;
                         - push checkFinal/ current_room_info into multiRoom and continue checking current floor;
                        */
                        // if (len) {
                        //     if (checkFinal) multiRoom.push(current_room_info);
                        // }else {
                        //     if (checkFinal) multiRoom.push(current_room_info);
                        //     if (multiRoom[0] === undefined) {
                        //         multiFloor.push(null);
                        //     }else {
                        //         multiFloor.push(multiRoom);
                        //     }
                        // }
                        // console.log('checkFinal: ' + checkFinal);
                        if (checkFinal) {
                            current_room_info = roomNameify(data.key(), data.val(), fireChild);
                            multiRoom.push(current_room_info);
                            // console.log('pushed 1 room into multiRoom');
                        }else multiRoom.push(null);
                        // console.log(multiRoom);
                        /* if len reaches 0, all rooms at this floor has been checking... */
                        if (!len) {
                            if (multiRoom[0] === undefined) multiFloor.push(null); 
                            else multiFloor.push(multiRoom);
                            console.log('*** multiFloor: ');
                            // console.log(multiFloor);
                            floorCount--;
                            multiRoom = [];
                            if (!notSite && !notFloor) {
                                if (floorCount <= 2 && floorCount > 0) {
                                    multiSite.push(multiFloor);
                                    siteCount--;
                                    multiFloor = [];
                                }
                            }
                            if (!floorCount) {
                                floorCount = setFloorCount;
                                multiSite.push(multiFloor);
                                siteCount--;
                                multiFloor = [];
                                console.log('siteCount: ' + siteCount);
                                console.log('*** multiSite: ');
                                // console.log(multiSite);
                                if (!siteCount) {
                                    siteCount = setSiteCount;
                                    multiDay.push(multiSite);
                                    readySemaphore--;
                                    multiSite = [];
                                    console.log('readySemaphore: ' + readySemaphore);
                                    console.log('*** multiDay: ');
                                    console.log(multiDay);
                                }
                            }
                        }
                    });

                    /* when readySemaphore reaches 0, it marks the end of a day... */
                    if (readySemaphore <= 0) {
                        var ary_multiDay_temp = [];
                        /* Logging multiDay */
                        console.log('multiDay size: ' + multiDay.length);
                        if (notSingleDay){
                            ary_multiDay_temp = comparify(multiDay);
                            console.log(ary_multiDay_temp);
                            captureEndExec();
                            res.setHeader('Content-Type', 'application/json');
                            res.send(JSON.stringify(roomify(ary_multiDay_temp), null, 4));
                            ary_multiDay_temp = [];
                        }else {
                            captureEndExec();
                            res.setHeader('Content-Type', 'application/json');
                            res.send(JSON.stringify(roomify(multiDay), null, 4));
                            multiDay = [];
                        }
                    }
                }
            });
        };

        /* ***IMPROVEMENTS NEEDED*** 
        Async function for getting data from each ROOM */
        var getFromSite = function(fireChild, callback) {
            setTimeout(function() {
                callback(fireChild);
            }, 0);
        };

        /* Output the TAT of the complete execution */
        var captureEndExec = function(){
            stopExecTime = +new Date() - startExecTime;
            console.log('\n@@@#################### END OF ROOMIFICATION #######################\n');
            console.log('     Sent at: ' + new Date().toJSON());
            console.log('     Response sent successfully!' + '\n');
            console.log('     Time used: ' + stopExecTime + 'ms' + '\n');
            console.log('@@@########################## END ##################################\n');
        };
        /* ###################################################################*/
        /* @@@################## END OF CALLBACK METHODS #################### */
        /* ###################################################################*/
        
        /* @@@################# PARAMETERIZATION ############################ */
        /* if not full day (08:00 - 23:30)... */
        if (req.body.tStart && req.body.tEnd) {
            var trim_tStart = req.body.tStart, trim_tEnd = req.body.tEnd;
            if (req.body.tStart.length > 5 || req.body.tEnd.length > 5) {
                trim_tStart = req.body.tStart.slice(0, 5);
                trim_tEnd = req.body.tEnd.slice(0, 5);
            }
            hexTime = parseTime(trim_tStart, trim_tEnd, matchTime);
            queryHexTime = parseBinary(hexTime, parseHex);
            console.log('--- Time Range: ' + queryHexTime);
        }
        
        /* if TYPES found inside the QUERY... */
        if (req.body.adjoin || req.body.pana || req.body.cs100 || req.body.cx5000 ||
            req.body.proj || req.body.faulty_cable || req.body.faulty_proj ||
            req.body.faulty_screen || req.body.smart || req.body.tele || req.body.tv || req.body.glass){
            notTypes = true;
            queryHexTypes = parseTypes(req.body.adjoin, req.body.pana, req.body.cs100, req.body.cx5000, req.body.proj, req.body.faulty_cable, req.body.faulty_proj, req.body.faulty_screen, req.body.smart, req.body.tele, req.body.tv, req.body.glass);
            queryHexTypes = parseBinary(queryHexTypes, parseHex);
            console.log('TYPES: ' + queryHexTypes);
        }

        /* if SITE and FLOOR are specified... */
        if (req.body.site || req.body.floor){
            /* If SITE was selected && FLOOR was not selected...
                - all FLOORs must be checked for '05tower';
                - for '2atower' && 'suite', only ONE FLOOR would be selected!
            */
            notSite = (req.body.site)? true : false;
            /* if FLOOR was selected && SITE was not selected...
                - FLOOR must be automagically return the SITE associated with the FLOOR.
            */
            notFloor = (req.body.floor)? true : false;
        }else notSite = notFloor = (req.body.site && req.body.floor)? true : false;
        
        /* Output queryStrings... */
        console.log('\n--- ' + 'queryString contains values:- ');
        console.log(req);
        // for (var key in req.body) {
        //     console.log(key + ': ' + req.body[key]);
        // }

        /* total floor = 14 
            notSite: req.body.site === '05tower' => 12; notFloor || !notFloor && req.body.site === '2atower' || req.body.site === 'suite' => 1;
            !notSite : notFloor? always 1; !notFloor? always 14 (total floor);
        */
        // if (notSite) readySemaphore = req.body.site === '05tower'? 12 : 1; else readySemaphore = notFloor? 1 : 14;
        readySemaphore = 1;
        
        /* startDate */
        year = dateChopper(req.body.startDate, 0);
        month = dateChopper(req.body.startDate, 1);
        day = dateChopper(req.body.startDate, 2);

        /* more than 1 day from the startDate */
        if (req.body.endDate > req.body.startDate) {
            notSingleDay = true;
            year_end = dateChopper(req.body.endDate, 0);
            month_end = dateChopper(req.body.endDate, 1);
            day_end = dateChopper(req.body.endDate, 2);

            /* Calculating many dates */
            var moreDate = [];
            var totalDay = (new Date(year_end, month_end, day_end) - new Date(year, month, day)) / 86400000 + 1;
            for (var i = 0; i < totalDay; i++) {
                var new_day = parseInt(day) + i;
                var new_date = new Date(year, month, new_day);
                if (new_date.getDay() > 0 && new_date.getDay() < 6){
                   new_date = new_date.toJSON().slice(0, 10);
                   moreDate.push(new_date);
                }
            }
            readySemaphore *= moreDate.length;
            // console.log('ReadySemaphore: ' + readySemaphore);
            // console.log('moreDate array: ');
            // console.log(moreDate);

            /* assign many dates to many working threads */
            startExecTime = +new Date();
            if (moreDate[0] === undefined){
                console.log('\n--- multipleDay-Sasu/ Holiday: ' + req.body.startDate + '\n');
                res.json('The selected day is either weekend or holiday!');
                captureEndExec();
            }else {
                console.log('\n' + '--- mon to fri...');
                console.log('--- multipleDay - showRoom: ');
                for (var j = 0; j < moreDate.length; j++) {
                    var subYear = dateChopper(moreDate[j], 0);
                    var subMonth = dateChopper(moreDate[j], 1);
                    var subDay = dateChopper(moreDate[j], 2);
                    var subWeek = getWeek(subYear, subMonth, subDay);
                    console.log(moreDate[j]);
                    showRoom(subWeek, subYear, subMonth, subDay, getFromSite);    
                }
            }
        } else {
            /* only single day */
            var checkSingleDay = new Date(year, month, day).getDay();
            startExecTime = +new Date();
            if (checkSingleDay > 0 && checkSingleDay < 6){
                console.log('\n' + '--- mon to fri...');
                console.log('--- singleDay - showRoom: ');
                showRoom(getWeek(year, month, day), year, month, day, getFromSite);   
            }else {
                console.log('\n--- singleDay-SaSu/ Holiday: ' + checkSingleDay + '@' + req.body.startDate + '\n');
                res.json('The selected day is either a weekend or holiday!');
                captureEndExec();
            }
        }
    }
    /* #######################################################################*/
    /* @@@#################### END OF ROOMIFY API ########################### */
    /* #######################################################################*/
  }
});

var port = process.env.PORT || 9000;
server.listen(port, function() {
    console.log('server running on port ' + port + "\n");
});
