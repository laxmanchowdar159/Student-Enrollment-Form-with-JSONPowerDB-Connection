
var jpdbBaseURL = 'http://api.login2explore.com:5577';
var jpdbIRL = '/api/irl';
var jpdbIML = '/api/iml';
var schoolDBName = 'SCHOOL-DB';
var studentRelationName = 'STUDENT-TABLE';
var connToken = '90932846|-31949281516063359|90948299';

$('#roll-no').focus();

function saveRecNo2LS(jsonObj) {
    var lvData = JSON.parse(jsonObj.data);
    localStorage.setItem('recno',lvData.rec_no);
}

function getRollNoAsJsonObj() {
    var rollNo = $('#roll-no').val();
    var jsonStr = {
        roll_no: rollNo
    };
    return JSON.stringify(jsonStr);
} 

function fillData(jsonObj) {
    saveRecNo2LS(jsonObj);
    var record = JSON.parse(jsonObj.data).record;
    $("#full-name").val(record.full_name) ;
    $('#class').val(record.class);
    $('#birth-date').val(record.birth_date);
    $("#address").val(record.address);
    $("#enrollment-date").val(record.enrollment_date);
  }
  
function resetForm() {
    $('#roll-no').val("");
    $('#full-name').val("");
    $('#class').val("");
    $('#birth-date').val("");
    $('#address').val("");
    $('#enrollment-date').val("");
    $('#roll-no').prop("disabled",false);
    $('#save').prop("disabled",true);
    $('#change').prop("disabled",true);
    $('#reset').prop("disabled",true);
    $('#roll-no').focus();
}
 
function validateData() {
    var rollNo, fullName, cls, birthDate, address, enrollmentDate;
    rollNo = $("#roll-no").val();
    fullName = $("#full-name").val();
    cls = $("#class").val();
    birthDate = $("#birth-date").val();
    address = $("#address").val();
    enrollmentDate = $("#enrollment-date").val();
     
    if(rollNo==''){
        alert("Roll No. missing");
        $("#roll-no").focus();
        return "";
    }
    if(fullName==''){
        alert("Full Name missing");
        $("#full-name").focus();
        return "";
    }
    if(cls==''){
        alert("Class missing");
        $("#class").focus();
        return "";
    }
    if(birthDate==''){
        alert("Birth Date missing");
        $("#birth-date").focus();
        return "";
    }
    if(address==''){
        alert("Address missing");
        $("#address").focus();
        return "";
    }
    if(enrollmentDate==''){
        alert("Enrollment Date missing");
        $("#enrollment-date").focus();
        return "";
    }
     
    var jsonStrObj = {
        roll_no: rollNo,
        full_name: fullName,
        class: cls,
        birth_date: birthDate,
        address: address,
        enrollment_date: enrollmentDate  
    };
    return JSON.stringify(jsonStrObj);
}

function getStudent() {
    var rollNoJsonObj = getRollNoAsJsonObj();
    var getRequest = createGET_BY_KEYRequest(connToken,schoolDBName,studentRelationName,rollNoJsonObj);
    jQuery.ajaxSetup({async:false});
    var resJsonObj = executeCommandAtGivenBaseUrl(getRequest, jpdbBaseURL, jpdbIRL);
    jQuery.ajaxSetup({async: true});
    if(resJsonObj.status == 400){
        $('#save').prop('disabled', false);
        $('#reset').prop('disabled', false);
         $('#full-name').focus();
         
     }else if(resJsonObj.status == 200){
         $('#roll-no').prop('disabled', true);
         fillData(resJsonObj);
         $('#change').prop('disabled', false);
         $('#reset').prop('disabled', false);
         $('#full-name').focus();
     }
 }
 
 function saveData() {
     var jsonStrObj = validateData();
     if(jsonStrObj == ''){
         return "";
     }
     var putRequest = createPUTRequest(connToken, jsonStrObj, schoolDBName, studentRelationName);
     jQuery.ajaxSetup({async: false});
     var resJsonObj = executeCommandAtGivenBaseUrl(putRequest, jpdbBaseURL, jpdbIML);
     jQuery.ajaxSetup({async: true});
     resetForm();
     $('#roll-no').focus();
 } 
 
  function changeData(){
     $('#change').prop("disabled", true);
     jsonChg = validateData();
     var updateRequest = createUPDATERecordRequest(connToken, jsonChg, schoolDBName, studentRelationName, localStorage.getItem("recno"));
     jQuery.ajaxSetup({async: false});
     var resJsonObj = executeCommandAtGivenBaseUrl(updateRequest, jpdbBaseURL, jpdbIML);
     jQuery.ajaxSetup({async: true});
     console.log(resJsonObj);
     resetForm();
     $('#roll-no').focus();
 }

