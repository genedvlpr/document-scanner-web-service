var firebaseConfig = {
  apiKey: "AIzaSyDWO8L3dS2-rVcu5EBCPuFkLB6LJcXSkd8",
    authDomain: "document-scanner-e7e49.firebaseapp.com",
    databaseURL: "https://document-scanner-e7e49.firebaseio.com",
    projectId: "document-scanner-e7e49",
    storageBucket: "document-scanner-e7e49.appspot.com",
    messagingSenderId: "833771129307",
    appId: "1:833771129307:web:48ff963f3dc75302"
};
// Initialize Firebase  
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore(); 
//db.settings({timestampsInSnapshots: true});
var provider = new firebase.auth.GoogleAuthProvider();

angular.module('NewApp', ['ngMaterial', 'ngMessages'])
  .controller('AppCtrl', function ($scope, $mdSidenav, $mdDialog,$mdToast) {
    $scope.toggleLeft = buildToggler('left');
    $scope.toggleRight = buildToggler('right');
    $scope.toggleRight1 = buildToggler('right1');
    $scope.isOpenRight = function(){
      return $mdSidenav('right').isOpen();
    };
    /**
     * Supplies a function that will continue to operate until the
     * time is up.
     */
    function debounce(func, wait, context) {
      var timer;

      return function debounced() {
        var context = $scope,
            args = Array.prototype.slice.call(arguments);
        $timeout.cancel(timer);
        timer = $timeout(function() {
          timer = undefined;
          func.apply(context, args);
        }, wait || 10);
      };
    }

    /**
     * Build handler to open/close a SideNav; when animation finishes
     * report completion in console
     */
    function buildDelayedToggler(navID) {
      return debounce(function() {
        // Component lookup should always be available since we are not using `ng-if`
        $mdSidenav(navID)
          .toggle()
          .then(function () {
            //$log.debug("toggle " + navID + " is done");
          });
      }, 200);
    }

    
    this.userState = '';
    this.states = ('DIT TED DOM DAS').split(' ').map(function (state) { return { abbrev: state }; });

    $scope.departments = [{ DifficultyID: 1, Name: "DIT" }, { DifficultyID: 2, Name: "TED" },
    { DifficultyID: 3, Name: "DOM" }, { DifficultyID: 3, Name: "DAS" }];
 
    $scope.update = function (opt) {
      console.log(opt)
       
      
      var br_doc =  document.getElementsByClassName('ais-SearchBox-input'); 
      br_doc.value = opt;
    }

    $scope.status = '  ';
    $scope.customFullscreen = false;
    
    $scope.showAdvanced = function(ev) {
      $mdDialog.show({
        controller: DialogController,
        templateUrl: 'dialog1.tmpl.html',
        parent: angular.element(document.body),
        targetEvent: ev,
        clickOutsideToClose:true,
        fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
      })
      .then(function(answer) {
        $scope.status = 'You said the information was "' + answer + '".';
      }, function() {
        $scope.status = 'You cancelled the dialog.';
      });
    };

    function DialogController($scope, $mdDialog) {
      $scope.hide = function() {
        $mdDialog.hide();
      };
  
      $scope.cancel = function() {
        $mdDialog.cancel();
      };
  
      $scope.answer = function(answer) {
        $mdDialog.hide(answer);
      };
    }

     
    function buildToggler(componentId) {
      return function () {
        $mdSidenav(componentId).toggle();
      };
    } 
 
    let pdf = [];  
    var btn_download_pdf = document.getElementById('btn_download_pdf');

    $scope.clearPDF = function(event){
      pdf = []; 
      $('.added').remove();
    }

    $scope.viewPDF = function(data){
      //pdf = []; 
      var areaID = document.getElementById('areaID');
      var parameterID = document.getElementById('parameterID');
      var deptID = document.getElementById('deptID');
      var indicatorID = document.getElementById('indicatorID');

      var btn_view_pdf = document.getElementById('btn_view_pdf');
      //alert(areaID.innerText);
      var myLight = document.getElementById('myLight');

      console.log("View PDF: "+indicatorID.innerText);
      var doc = new jsPDF();  
      
      
      db.collection("indicators_list")
        .doc(deptID.innerText)
        .collection("indicators")
        .doc(indicatorID.innerText)
        .collection("pdf_files")
        .get()
        .then((querySnapshot) => { 
          querySnapshot.forEach((doc) => { 
          //pdf = []; 
          const pdf_files = doc.data();

          const pdf_url = pdf_files.pdf;
          pdf.push(pdf_url); 
            
        });


        var doc = new jsPDF('p', 'pt', 'a4');

        for(i = 0 ;i<pdf.length;i++){
           
          var pdf_img = document.getElementById('pdf_img');
          //pdf_img.src = pdf[i]; 
          
          btn_view_pdf.style.display = "none" ; 
          //btn_download_pdf.style.display = "block" ; 
        }  

        $(document).ready(function() {

          var getImageFromUrl = function(url, callback) {
            var img = new Image();
            img.crossOrigin = "https://document-scanner-e7e49.firebaseapp.com/";
            img.onError = function() {
            alert('Cannot load image: "'+url+'"');
            };
            img.onload = function() {
            callback(img);
            };
            img.src = url;
          }
          var createPDF = function(imgData) {
            var width = doc.internal.pageSize.width;    
            var height = doc.internal.pageSize.height;
            var options = {
                pagesplit: true
            };
            //doc.text(10, 20, 'Crazy Monkey');
            var h1=50;
            var aspectwidth1= (height-h1)*(9/16);
            if(imgData != null || imgData != ""){
              doc.addImage(imgData, 'JPEG', 40, 40, 520, 760);
              doc.addPage();
            }
            
            
          }
          for(i = 0 ;i<pdf.length;i++){
            getImageFromUrl(pdf[i], createPDF);
          }

          function viewPDFtoBrowser(){
            var pageCount = doc.internal.getNumberOfPages();
            doc.deletePage(pageCount);
            doc.setProperties({
              title: areaID.innerText+"_"+parameterID.innerText+"_"+indicatorID.innerText+".pdf",
              
            });
            window.open(doc.output('bloburl'), '_blank');
          }

          function savePDF(){
            var pageCount = doc.internal.getNumberOfPages();
            doc.deletePage(pageCount);
            doc.save(areaID.innerText+"_"+parameterID.innerText+"_"+indicatorID.innerText+".pdf");
          }
          setTimeout(viewPDFtoBrowser, 10000);

        
        });
      });
      
      
    }

    $scope.viewPDF1 = function(data){
      //pdf = []; 
      var areaID = document.getElementById('dd_selected_areaID');
      var parameterID = document.getElementById('dd_selected_paramID');
      var deptID = document.getElementById('dept_name');
      var indicatorID = document.getElementById('dd_selected_indicID');

      var btn_view_pdf = document.getElementById('btn_view_pdf');
      //alert(areaID.innerText);
      var myLight = document.getElementById('myLight');

      console.log("View PDF: "+indicatorID.innerText);
      var doc = new jsPDF();  
      
      
      db.collection("indicators_list")
        .doc(deptID.innerText)
        .collection("indicators")
        .doc(indicatorID.innerText)
        .collection("pdf_files")
        .get()
        .then((querySnapshot) => { 
          querySnapshot.forEach((doc) => { 
          //pdf = []; 
          const pdf_files = doc.data();

          const pdf_url = pdf_files.pdf;
          pdf.push(pdf_url); 
            
        });


        var doc = new jsPDF('p', 'pt', 'a4');

        for(i = 0 ;i<pdf.length;i++){
           
          var pdf_img = document.getElementById('pdf_img');
          //pdf_img.src = pdf[i]; 
          
          btn_view_pdf.style.display = "none" ; 
          //btn_download_pdf.style.display = "block" ; 
        }  

        $(document).ready(function() {

          var getImageFromUrl = function(url, callback) {
            var img = new Image();
            img.crossOrigin = "https://document-scanner-e7e49.firebaseapp.com/";
            img.onError = function() {
            alert('Cannot load image: "'+url+'"');
            };
            img.onload = function() {
            callback(img);
            };
            img.src = url;
          }
          var createPDF = function(imgData) {
            var width = doc.internal.pageSize.width;    
            var height = doc.internal.pageSize.height;
            var options = {
                pagesplit: true
            };
            //doc.text(10, 20, 'Crazy Monkey');
            var h1=50;
            var aspectwidth1= (height-h1)*(9/16);
            if(imgData != null || imgData != ""){
              doc.addImage(imgData, 'JPEG', 40, 40, 520, 760);
              doc.addPage();
            }
            
            
          }
          for(i = 0 ;i<pdf.length;i++){
            getImageFromUrl(pdf[i], createPDF);
          }

          function viewPDFtoBrowser(){
            var pageCount = doc.internal.getNumberOfPages();
            doc.deletePage(pageCount);
            doc.setProperties({
              title: areaID.innerText+"_"+parameterID.innerText+"_"+indicatorID.innerText+".pdf",
              
            });
            window.open(doc.output('bloburl'), '_blank');
          }

          function savePDF(){
            var pageCount = doc.internal.getNumberOfPages();
            doc.deletePage(pageCount);
            doc.save(areaID.innerText+"_"+parameterID.innerText+"_"+indicatorID.innerText+".pdf");
          }
          setTimeout(viewPDFtoBrowser, 10000);

        
        });
      });
      
      
    }
    var ctrl = this;
    var last = {
      bottom: false,
      top: true,
      left: false,
      right: true
    };

    ctrl.toastPosition = angular.extend({}, last);

    ctrl.getToastPosition = function() {
      sanitizePosition();

      return Object.keys(ctrl.toastPosition)
      .filter(function(pos) {
        return ctrl.toastPosition[pos];
      }).join(' ');
    };

    function sanitizePosition() {
      var current = ctrl.toastPosition;

      if (current.bottom && last.top) {
        current.top = false;
      }
      if (current.top && last.bottom) {
        current.bottom = false;
      }
      if (current.right && last.left) {
        current.left = false;
      }
      if (current.left && last.right) {
        current.right = false;
      }

      last = angular.extend({}, current);
    }

    ctrl.showSimpleToast = function() {
      var pinTo = ctrl.getToastPosition();

      $mdToast.show(
        $mdToast.simple()
        .textContent('Simple Toast!')
        .position(pinTo)
        .hideDelay(3000))
      .then(function() {
        $log.log('Toast dismissed.');
      }).catch(function() {
        $log.log('Toast failed or was forced to close early by another toast.');
      });
    };

    $scope.downloadPDF = function(data){
      ctrl.showSimpleToast();
      var areaID = document.getElementById('areaID');
      var parameterID = document.getElementById('parameterID');
      var deptID = document.getElementById('deptID');
      var indicatorID = document.getElementById('indicatorID');

      var btn_view_pdf = document.getElementById('btn_view_pdf');
      //alert(areaID.innerText);
      var myLight = document.getElementById('myLight');
      let pdf = [];  

      console.log("View PDF: "+indicatorID.innerText);
      var doc = new jsPDF();  
      //pdf = []; 
      db.collection("indicators_list")
        .doc(deptID.innerText)
        .collection("indicators")
        .doc(indicatorID.innerText)
        .collection("pdf_files")
        .get()
        .then((querySnapshot) => { 
          querySnapshot.forEach((doc) => { 
          //pdf = []; 
          const pdf_files = doc.data();

          const pdf_url = pdf_files.pdf;
          pdf.push(pdf_url); 
            
        });
        
        var doc = new jsPDF('p', 'pt', 'a4');

        
        $(document).ready(function() {

          var getImageFromUrl = function(url, callback) {
            var img = new Image();
            img.crossOrigin = "https://document-scanner-e7e49.firebaseapp.com/";
            img.onError = function() {
            alert('Cannot load image: "'+url+'"');
            };
            img.onload = function() {
            callback(img);
            };
            img.src = url;
          }
          var createPDF = function(imgData) {
            var width = doc.internal.pageSize.width;    
            var height = doc.internal.pageSize.height;
            var options = {
                pagesplit: true
            };
            //doc.text(10, 20, 'Crazy Monkey');
            var h1=50;
            var aspectwidth1= (height-h1)*(9/16);
            if(imgData != null || imgData != ""){
              doc.addImage(imgData, 'JPEG', 40, 40, 520, 760);
              doc.addPage();
            }
            
            
          }
          for(i = 0 ;i<pdf.length;i++){
            getImageFromUrl(pdf[i], createPDF);
          }

          function savePDF(){
            var pageCount = doc.internal.getNumberOfPages();
            doc.deletePage(pageCount);
            doc.save(areaID.innerText+"_"+parameterID.innerText+"_"+indicatorID.innerText+".pdf");
          }
          setTimeout(savePDF, 10000);

        
        });
      });
      
      
    }
     
    $scope.viewSpecificValidations = async function(data){
        
        var areaID = document.getElementById('areaID');
        var parameterID = document.getElementById('parameterID');
        var deptID = document.getElementById('deptID');
        var indicatorID = document.getElementById('indicatorID');
        //Retrieve all items 
        let areaName = []; 
        let areaDept = []; 
        let parameter = []; 
        let indicator = []; 
        let comments = []; 
        let date = [];  
        let time = []; 

        areaName = []; 
        areaDept = []; 
        parameter = []; 
        indicator = []; 
        comments = []; 
        date = [];  
        time = []; 
            
        db.collection("indicators_list")
          .doc(deptID.innerText)
          .collection("indicators")
          .doc(indicatorID.innerText)
          .collection("comments")
          .get()
          .then((querySnapshot) => { 
              querySnapshot.forEach((doc) => { 
                const validations = doc.data();   

                const c_area_name = validations.area_name; 
                areaName.push(c_area_name); 
 
                const c_area_dept = validations.area_dept; 
                areaDept.push(c_area_dept); 
                
                const c_parameter = validations.parameter_name; 
                parameter.push(c_parameter); 

                const c_indicator = validations.indicator_name; 
                indicator.push(c_indicator); 

                const c_comment = validations.comments; 
                comments.push(c_comment); 

                const c_date = validations.date; 
                date.push(c_date); 
                
                const c_time = validations.time; 
                time.push(c_time); 

                

                $scope.validations = [
                  { areaName: areaName[0],
                    areaDept: areaDept[0],
                    parameter: parameter[0], 
                    indicator: indicator[0], 
                    comments: comments[0], 
                    date: date[0], 
                    time: time[0], 
                  }, 
                  
                  { areaName: areaName[1],
                    areaDept: areaDept[1],
                    parameter: parameter[1], 
                    indicator: indicator[1], 
                    comments: comments[1], 
                    date: date[1], 
                    time: time[1], 
                  }, 
                  
                  { areaName: areaName[2],
                    areaDept: areaDept[2],
                    parameter: parameter[2], 
                    indicator: indicator[2], 
                    comments: comments[2], 
                    date: date[2], 
                    time: time[2], 
                  }, 
                  
                  { areaName: areaName[3],
                    areaDept: areaDept[3],
                    parameter: parameter[3], 
                    indicator: indicator[3], 
                    comments: comments[3], 
                    date: date[3], 
                    time: time[3], 
                  }, 
                  
                  { areaName: areaName[4],
                    areaDept: areaDept[4],
                    parameter: parameter[4], 
                    indicator: indicator[4], 
                    comments: comments[4], 
                    date: date[4], 
                    time: time[4], 
                  }, 
                  
                  { areaName: areaName[5],
                    areaDept: areaDept[5],
                    parameter: parameter[5], 
                    indicator: indicator[5], 
                    comments: comments[5], 
                    date: date[5], 
                    time: time[5], 
                  }, 
                  
                  { areaName: areaName[6],
                    areaDept: areaDept[6],
                    parameter: parameter[6], 
                    indicator: indicator[6], 
                    comments: comments[6], 
                    date: date[6], 
                    time: time[6], 
                  }, 
                  
                  { areaName: areaName[7],
                    areaDept: areaDept[7],
                    parameter: parameter[7], 
                    indicator: indicator[7], 
                    comments: comments[7], 
                    date: date[7], 
                    time: time[7], 
                  }, 
                  
                  { areaName: areaName[8],
                    areaDept: areaDept[8],
                    parameter: parameter[8], 
                    indicator: indicator[8], 
                    comments: comments[8], 
                    date: date[8], 
                    time: time[8], 
                  }, 
                  
                  { areaName: areaName[8],
                    areaDept: areaDept[8],
                    parameter: parameter[8], 
                    indicator: indicator[8], 
                    comments: comments[8], 
                    date: date[8], 
                    time: time[8], 
                  }, 
                  
                  { areaName: areaName[9],
                    areaDept: areaDept[9],
                    parameter: parameter[9], 
                    indicator: indicator[9], 
                    comments: comments[9], 
                    date: date[9], 
                    time: time[9], 
                  }, 

                ]; 

              });
            }).then(async function() {
              if(areaName.length == 0){
                var no_comments = document.getElementById("no_comments");
                no_comments.style.display = "block";
                var val_results = document.getElementById("val_results");
                val_results.style.display = "none";
              } else if(areaName.length >= 1) {
                var no_comments = document.getElementById("no_comments");
                no_comments.style.display = "none";
                var val_results = document.getElementById("val_results");
                val_results.style.display = "block";
              };
          }); 
            
             
    }
     
    $scope.viewSpecificValidations1 = async function(data) {
        
      var areaID = document.getElementById('dd_selected_areaID');
      var parameterID = document.getElementById('dd_selected_paramID');
      var deptID = document.getElementById('dept_name');
      var indicatorID = document.getElementById('dd_selected_indicID');

      var no_comments = document.getElementById("no_comments1");
                no_comments.style.display = "block";
      //Retrieve all items 
      let areaName = []; 
      let areaDept = []; 
      let parameter = []; 
      let indicator = []; 
      let comments = []; 
      let date = [];  
      let time = []; 

      areaName = []; 
      areaDept = []; 
      parameter = []; 
      indicator = []; 
      comments = []; 
      date = [];  
      time = []; 
          
      db.collection("indicators_list")
        .doc(deptID.innerText)
        .collection("indicators")
        .doc(indicatorID.innerText)
        .collection("comments")
        .get()
        .then((querySnapshot) => { 
            querySnapshot.forEach((doc) => { 
              const validations = doc.data();   

              const c_area_name = validations.area_name; 
              areaName.push(c_area_name); 

              const c_area_dept = validations.area_dept; 
              areaDept.push(c_area_dept); 
              
              const c_parameter = validations.parameter_name; 
              parameter.push(c_parameter); 

              const c_indicator = validations.indicator_name; 
              indicator.push(c_indicator); 

              const c_comment = validations.comments; 
              comments.push(c_comment); 

              const c_date = validations.date; 
              date.push(c_date); 
              
              const c_time = validations.time; 
              time.push(c_time); 

              

              $scope.validations = [
                { areaName: areaName[0],
                  areaDept: areaDept[0],
                  parameter: parameter[0], 
                  indicator: indicator[0], 
                  comments: comments[0], 
                  date: date[0], 
                  time: time[0], 
                }, 
                
                { areaName: areaName[1],
                  areaDept: areaDept[1],
                  parameter: parameter[1], 
                  indicator: indicator[1], 
                  comments: comments[1], 
                  date: date[1], 
                  time: time[1], 
                }, 
                
                { areaName: areaName[2],
                  areaDept: areaDept[2],
                  parameter: parameter[2], 
                  indicator: indicator[2], 
                  comments: comments[2], 
                  date: date[2], 
                  time: time[2], 
                }, 
                
                { areaName: areaName[3],
                  areaDept: areaDept[3],
                  parameter: parameter[3], 
                  indicator: indicator[3], 
                  comments: comments[3], 
                  date: date[3], 
                  time: time[3], 
                }, 
                
                { areaName: areaName[4],
                  areaDept: areaDept[4],
                  parameter: parameter[4], 
                  indicator: indicator[4], 
                  comments: comments[4], 
                  date: date[4], 
                  time: time[4], 
                }, 
                
                { areaName: areaName[5],
                  areaDept: areaDept[5],
                  parameter: parameter[5], 
                  indicator: indicator[5], 
                  comments: comments[5], 
                  date: date[5], 
                  time: time[5], 
                }, 
                
                { areaName: areaName[6],
                  areaDept: areaDept[6],
                  parameter: parameter[6], 
                  indicator: indicator[6], 
                  comments: comments[6], 
                  date: date[6], 
                  time: time[6], 
                }, 
                
                { areaName: areaName[7],
                  areaDept: areaDept[7],
                  parameter: parameter[7], 
                  indicator: indicator[7], 
                  comments: comments[7], 
                  date: date[7], 
                  time: time[7], 
                }, 
                
                { areaName: areaName[8],
                  areaDept: areaDept[8],
                  parameter: parameter[8], 
                  indicator: indicator[8], 
                  comments: comments[8], 
                  date: date[8], 
                  time: time[8], 
                }, 
                
                { areaName: areaName[8],
                  areaDept: areaDept[8],
                  parameter: parameter[8], 
                  indicator: indicator[8], 
                  comments: comments[8], 
                  date: date[8], 
                  time: time[8], 
                }, 
                
                { areaName: areaName[9],
                  areaDept: areaDept[9],
                  parameter: parameter[9], 
                  indicator: indicator[9], 
                  comments: comments[9], 
                  date: date[9], 
                  time: time[9], 
                }, 

              ]; 

            })
            }).then(async function() {
              if(areaName.length == 0){
                var no_comments = document.getElementById("no_comments1");
                no_comments.style.display = "block";
                var val_results = document.getElementById("val_results1");
                val_results.style.display = "none";
              } else if(areaName.length >= 1) {
                var no_comments = document.getElementById("no_comments1");
                no_comments.style.display = "none";
                var val_results = document.getElementById("val_results1");
                val_results.style.display = "block";
              };
          }); 
          
          
    }

          //Retrieve all items 
        let areaName = []; 
        let areaDept = []; 
        let parameter = []; 
        let indicator = []; 
        let comments = []; 
        let date = [];  
        let time = []; 
            
        db.collection("validation_list")
          .get()
          .then((querySnapshot) => { 
              querySnapshot.forEach((doc) => { 
                const validations = doc.data();   

                const c_area_name = validations.area_name; 
                areaName.push(c_area_name); 
 
                const c_area_dept = validations.area_dept; 
                areaDept.push(c_area_dept); 
                
                const c_parameter = validations.parameter_name; 
                parameter.push(c_parameter); 

                const c_indicator = validations.indicator_name; 
                indicator.push(c_indicator); 

                const c_comment = validations.comments; 
                comments.push(c_comment); 

                const c_date = validations.date; 
                date.push(c_date); 
                
                const c_time = validations.time; 
                time.push(c_time); 

                $scope.validations = [
                  { areaName: areaName[0],
                    areaDept: areaDept[0],
                    parameter: parameter[0], 
                    indicator: indicator[0], 
                    comments: comments[0], 
                    date: date[0], 
                    time: time[0], 
                  }, 
                  
                  { areaName: areaName[1],
                    areaDept: areaDept[1],
                    parameter: parameter[1], 
                    indicator: indicator[1], 
                    comments: comments[1], 
                    date: date[1], 
                    time: time[1], 
                  }, 
                  
                  { areaName: areaName[2],
                    areaDept: areaDept[2],
                    parameter: parameter[2], 
                    indicator: indicator[2], 
                    comments: comments[2], 
                    date: date[2], 
                    time: time[2], 
                  }, 
                  
                  { areaName: areaName[3],
                    areaDept: areaDept[3],
                    parameter: parameter[3], 
                    indicator: indicator[3], 
                    comments: comments[3], 
                    date: date[3], 
                    time: time[3], 
                  }, 
                  
                  { areaName: areaName[4],
                    areaDept: areaDept[4],
                    parameter: parameter[4], 
                    indicator: indicator[4], 
                    comments: comments[4], 
                    date: date[4], 
                    time: time[4], 
                  }, 
                  
                  { areaName: areaName[5],
                    areaDept: areaDept[5],
                    parameter: parameter[5], 
                    indicator: indicator[5], 
                    comments: comments[5], 
                    date: date[5], 
                    time: time[5], 
                  }, 
                  
                  { areaName: areaName[6],
                    areaDept: areaDept[6],
                    parameter: parameter[6], 
                    indicator: indicator[6], 
                    comments: comments[6], 
                    date: date[6], 
                    time: time[6], 
                  }, 
                  
                  { areaName: areaName[7],
                    areaDept: areaDept[7],
                    parameter: parameter[7], 
                    indicator: indicator[7], 
                    comments: comments[7], 
                    date: date[7], 
                    time: time[7], 
                  }, 
                  
                  { areaName: areaName[8],
                    areaDept: areaDept[8],
                    parameter: parameter[8], 
                    indicator: indicator[8], 
                    comments: comments[8], 
                    date: date[8], 
                    time: time[8], 
                  }, 
                  
                  { areaName: areaName[8],
                    areaDept: areaDept[8],
                    parameter: parameter[8], 
                    indicator: indicator[8], 
                    comments: comments[8], 
                    date: date[8], 
                    time: time[8], 
                  }, 
                  
                  { areaName: areaName[9],
                    areaDept: areaDept[9],
                    parameter: parameter[9], 
                    indicator: indicator[9], 
                    comments: comments[9], 
                    date: date[9], 
                    time: time[9], 
                  }, 

                ]; 

              });
            }); 
           
            
            function buildToggler(navID) {
              return function() {
                // Component lookup should always be available since we are not using `ng-if`
                $mdSidenav(navID)
                  .toggle()
                  .then(function () {
                    //$log.debug("toggle " + navID + " is done");
                  });
              };
            }
            }) 
            .controller('RightCtrl', function ($scope, $timeout, $mdSidenav, $log) {
              $scope.close = function () {
                // Component lookup should always be available since we are not using `ng-if`
                $mdSidenav('right').close()
                  .then(function () {
                    //$log.debug("close RIGHT is done");
                  });
              };
            
            }).controller('RightCtrl1', function ($scope, $timeout, $mdSidenav, $log) {
              $scope.close = function () {
                // Component lookup should always be available since we are not using `ng-if`
                $mdSidenav('right1').close()
                  .then(function () {
                    //$log.debug("close RIGHT is done");
                  });
              };
            
  }).config(function ($mdThemingProvider) {

    // Configure a dark theme with primary foreground yellow

    $mdThemingProvider.theme('docs-dark', 'default')
      .primaryPalette('teal');

  });

  var dd_selected_areaID = document.getElementById('dd_selected_areaID');
  var dd_selected_paramID = document.getElementById('dd_selected_paramID');
  var dd_selected_indicID = document.getElementById('dd_selected_indicID');

  var drop_param = document.getElementById('drop_param');
  var drop_indic = document.getElementById('drop_indic');

  drop_param.style.display = "none";
  drop_indic.style.display = "none";

  function showAreaList() {
    document.getElementById("dd_areas").classList.toggle("show");
    var dept_name = document.getElementById("dept_name").innerText;
    var area_names = document.getElementById("dd_areas");


    var areaRef = db.collection("area_list").doc(dept_name).collection("areas");

    var area_arr = [];
    area_arr = [];
    var areaID_arr = [];
    areaID_arr = [];
    var area_name;
    areaRef
    .get()
    .then((querySnapshot) => { 
        querySnapshot.forEach((doc) => { 
        if (doc.exists) {
            console.log("Area data:", doc.data());
           
            var areas = doc.data();  
            const c_area_name = areas.area_name; 
            area_arr.push(c_area_name);  
            
            const c_area_id = areas.area_id; 
            areaID_arr.push(c_area_id);
        } else {
            // doc.data() will be undefined in this case
            console.log("No areas!");
        }
      });
            $("#dd_areas").empty();
            var li;
            var dd_selected_area = document.getElementById('dd_selected_area'); 

            area_arr.forEach(function(item) {
              li = document.createElement("li");
              var text = document.createTextNode(item);
              li.appendChild(text);
              document.getElementById("dd_areas").appendChild(li);
            });
            $("#dd_areas li").click(function() {
                // gets innerHTML of clicked li 
                dd_selected_area.style.display = "block";  
                drop_param.style.display = "block";
                dd_selected_area.innerText = $(this).text();
                var pos = $(this).index();
                dd_selected_areaID.innerText = areaID_arr[pos];
                //alert(areaID_arr[pos]); // gets text contents of clicked li
          }); 
    })
  }

  function showParamList() {
    document.getElementById("dd_param").classList.toggle("show");
    var dept_name = document.getElementById("dept_name").innerText;
    var area_params = document.getElementById("dd_param");


    var parametersRef = db.collection("parameters_list").doc(dept_name).collection("parameters")
    .where("area_id", "==", dd_selected_areaID.innerText);

    var parameters_arr = [];
    parameters_arr = [];
    var parametersID_arr = [];
    parametersID_arr = [];
    var parameters_name;
    parametersRef
    .get()
    .then((querySnapshot) => { 
        querySnapshot.forEach((doc) => { 
        if (doc.exists) {
            console.log("parameters data:", doc.data());
           
            var parameters= doc.data();  
            const c_parameters_name = parameters.parameter_name; 
            parameters_arr.push(c_parameters_name);  
            const c_parameters_id = parameters.parameter_id; 
            parametersID_arr.push(c_parameters_id);  
        } else {
            // doc.data() will be undefined in this case
            console.log("No parameters!");
        }
      });
            $("#dd_param").empty();
            var li; 
            var dd_selected_param = document.getElementById('dd_selected_param'); 

            parameters_arr.forEach(function(item) {
              li = document.createElement("li");
              var text = document.createTextNode(item);
              li.appendChild(text);
              document.getElementById("dd_param").appendChild(li);
            });
            $("#dd_param li").click(function() {
                // gets innerHTML of clicked li  
                dd_selected_param.style.display = "block"; 
                drop_indic.style.display = "block";

                dd_selected_param.innerText = $(this).text();
                var pos = $(this).index();
                dd_selected_paramID.innerText = parametersID_arr[pos];
              //alert(parametersID_arr[pos]); // gets text contents of clicked li
          }); 
    })
  }

  function showIndicList() {
    document.getElementById("dd_indic").classList.toggle("show");
    var dept_name = document.getElementById("dept_name").innerText;
    var area_indics = document.getElementById("dd_indic");


    var indicRef = db.collection("indicators_list").doc(dept_name).collection("indicators")
    .where("parameter_id", "==", dd_selected_paramID.innerText);

    var indic_arr = [];
    indic_arr = [];
    var indicID_arr = [];
    indicID_arr = [];
    var indicArea_arr = [];
    indicArea_arr = [];
    var indicParam_arr = [];
    indicParam_arr = [];
    var indicContent_arr = [];
    indicContent_arr = [];
    var indic_name;
    indicRef
    .get()
    .then((querySnapshot) => { 
        querySnapshot.forEach((doc) => { 
        if (doc.exists) {
            console.log("indicators data:", doc.data());
           
            var indic= doc.data();  
            
            const c_indic_name = indic.indicator_name; 
            indic_arr.push(c_indic_name);  

            const c_indic_id = indic.indicator_id; 
            indicID_arr.push(c_indic_id);  
            
            const c_indic_area = indic.area_name; 
            indicArea_arr.push(c_indic_area);  

            const c_indic_param = indic.parameter_name; 
            indicParam_arr.push(c_indic_param);  

            const c_indic_content = indic.recognized_content; 
            indicContent_arr.push(c_indic_content);  
        } else {
            // doc.data() will be undefined in this case
            console.log("No indic!");
        }
      });
            $("#dd_indic").empty();
            var li;  
            var dd_selected_indic = document.getElementById('dd_selected_indic');

            indic_arr.forEach(function(item) {
              li = document.createElement("li");
              var text = document.createTextNode(item);
              li.appendChild(text);
              document.getElementById("dd_indic").appendChild(li);
            });
            $("#dd_indic li").click(function() {
                // gets innerHTML of clicked li  
                dd_selected_indic.style.display = "block";

                dd_selected_indic.innerText = $(this).text();
                var pos = $(this).index();
                dd_selected_indicID.innerText = indicID_arr[pos];

                var div_detailed1 = document.getElementById('div_detailed1');
                div_detailed1.style.display = "block";

                var detailed_area = document.getElementById('detailed_area1');
                var detailed_indicator = document.getElementById('detailed_indicator1');
                var detailed_parameter = document.getElementById('detailed_parameter1');
                var detailed_content = document.getElementById('detailed_content1');
                      
                var areaID = document.getElementById('dd_selected_areaID');
                var parameterID = document.getElementById('dd_selected_paramID');
                //var deptID = document.getElementById('deptID1');
                var indicatorID = document.getElementById('dd_selected_indicID'); 

                detailed_area.innerText = "";
                detailed_parameter.innerText = "";
                detailed_indicator.innerText = "";
                detailed_content.innerText = "";

                 

                detailed_area.innerText = indicArea_arr[pos];
                detailed_parameter.innerText = indicParam_arr[pos];
                detailed_indicator.innerText = "Indicator: "+indic_arr[pos];
                detailed_content.innerText = "Recognized Content: "+indicContent_arr[pos];

                  
                //alert(indicID_arr[pos]); // gets text contents of clicked li
          }); 
    })
  }
  
  // Close the dropdown if the user clicks outside of it
  window.onclick = function(event) {
    if (!event.target.matches('.droparea')) {
      var dropdowns = document.getElementsByClassName("dd-areas"); 
      var i;
      for (i = 0; i < dropdowns.length; i++) {
        var openDropdown = dropdowns[i];
        if (openDropdown.classList.contains('show')) {
          openDropdown.classList.remove('show');
        }
      }
    }
    if (!event.target.matches('.dropparam')) {
      var dropdowns = document.getElementsByClassName("dd-param");
      var i;
      for (i = 0; i < dropdowns.length; i++) {
        var openDropdown = dropdowns[i];
        if (openDropdown.classList.contains('show')) {
          openDropdown.classList.remove('show');
        }
      }
    }
    if (!event.target.matches('.dropindic')) {
      var dropdowns = document.getElementsByClassName("dd-indic");
      var i;
      for (i = 0; i < dropdowns.length; i++) {
        var openDropdown = dropdowns[i];
        if (openDropdown.classList.contains('show')) {
          openDropdown.classList.remove('show');
        }
      }
    }
  }
 

function loginAccount() {
  var email = document.getElementById("email").value;
  var password = document.getElementById("password").value;
  firebase.auth().signInWithEmailAndPassword(email, password).catch(function (error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;

    if (errorCode === 'auth/wrong-password') {
      document.getElementById("status").innerText = "Wrong Password";
    } else {
      document.getElementById("status").innerText = errorMessage;
    }
  });

  initApp();

}

function initApp() {
  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      // User is signed in.
      var displayName = user.displayName;
      var email = user.email;
      var emailVerified = user.emailVerified;
      var photoURL = user.photoURL;
      var isAnonymous = user.isAnonymous;
      var uid = user.uid;
      var providerData = user.providerData;

      document.getElementById("status").textContent = "Logged in as " + email;

      document.getElementById("btn_login").disabled = true;

      document.getElementById("btn_logout").disabled = false;
      // ...
    } else {
      // User is signed out.
      // ...
      document.getElementById("status").textContent = "Signed out";
    }
  });



}

window.onload = function () {
  initApp();

  document.getElementById("btn_logout").disabled = true;
};

function logoutAccount() {
  firebase.auth().signOut().then(function () {
    document.getElementById("status").textContent = "Signed out";
    document.getElementById("btn_logout").disabled = true;

    document.getElementById("btn_login").disabled = false;
  }).catch(function (error) {
    // An error happened.
  });
}