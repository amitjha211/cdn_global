/// <reference path="http://localhost/assets/global/bootstrap-admin2/vendor/jquery/jquery.min.js" />
/// <reference path="http://localhost/jsdemo/build/ngbll.js" />

myApp.controller("workflow_trigger_list", function ($scope, bll) {
    var _grd = new ngCRUD(bll, "sys:sysWorkflowTrigger", "sys:sysWorkflowTrigger\\save", "sys:sysWorkflowTrigger\\delete", "id");
    $scope.grd = _grd;
    _grd.load();
});

myApp.controller("workflow_trigger_entry", function ($scope, bll) {

    $("#htmlEditor1").summernote({ height: 300 });

    var _grd = new ngCRUD(bll, "sys:sysWorkflowTrigger", "sys:sysWorkflowTrigger\\save", "sys:sysWorkflowTrigger\\delete", "id");

    _grd.addBeforeSave(function () {
        _grd.row['email_body'] = $("#htmlEditor1").code();
        return true;
    });

    _grd.addAfterSave(function () {
        window.location = "../Developer/Workflow_Trigger";
    });

    //Fields
    var _grdFields = new ngCRUD(bll, "sys:fieldInfo", "", "", "id");
    $scope.grdFields = _grdFields;
    _grdFields.loadAll();
    /////////////////

    $scope.grd = _grd;

    if (qstr("id") != "0")
        _grd.selectById(qstr('id'), function () {
            $("#htmlEditor1").code(_grd.row["email_body"]);
        });
});
