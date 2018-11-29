
/// <reference path="http://localhost/assets/global/bootstrap-admin2/vendor/jquery/jquery.min.js" />
/// <reference path="http://localhost/jsdemo/build/ngbll.js" />

myApp.controller("OrgList", function ($scope, bll) {

    //var oCRUDInfo = { get: "sys:sysOrg", save: "sys:sysOrg\\save", del: "sys:sysOrg\\delete", primaryKeyField: "id" };
    var _grd = new ngCRUD(bll, "sys:sysOrg", "sys:sysOrg\\save", "sys:sysOrg\\delete", "id");

    var oFilter = new clsFilterField(_grd);

    oFilter.add("organizationName", "Organization Name", "text");
    oFilter.add("code", "Code", "text");
    oFilter.add("Address", "Address", "text");
    oFilter.add("Email", "Email", "text");
    oFilter.add("Phone", "Phone", "text");
    oFilter.add("Fax", "Fax", "text");
    oFilter.add("ContactPerson", "Contact Person", "text");
    oFilter.add("Mobile", "Mobile", "text");
    oFilter.add("Remarks", "Remarks", "text");

    $scope.grd = _grd;

    _grd.load();



});

myApp.controller("OrgEntry", function ($scope, bll) {
    var _grd = new ngCRUD(bll, "sys:sysOrg", "sys:sysOrg\\save", "sys:sysOrg\\delete", "id");

    if (qstr("id") != "0")
        _grd.selectById(qstr("id"));
});


myApp.controller("UserList", function ($scope, bll) {

    var oCRUDInfo = { get: "sys:sysUser", save: "sys:sysUser\\save", del: "sys:sysUser\\delete", primaryKeyField: "id" };

    var _grd = new clsCRUD_PopUp(bll, oCRUDInfo);

    var oFilter = new clsFilterField(_grd);

    oFilter.add("name", "User Name", "text");
    oFilter.add("userid", "User ID", "text");
    oFilter.add("Email", "Email", "text");
    oFilter.add("Mobile", "Mobile", "text");
    oFilter.add("Remarks", "Remarks", "text");

    $scope.grd = _grd;
    _grd.load();

});

myApp.controller("myController_RoleList", function myController_RoleList($scope, bll) {

    //alert("done");


    var _grd = new ngCRUD(bll, "sys:sysRole", "sys:sysRole\\save", "sys:sysRole\\delete", "id");
    var _grdModules = new ngCRUD(bll, "sys:modules", "", "", "id");
    var _grdModuleOperations = new ngCRUD(bll, "sys:sysModuleOperations\\selected", "", "", "", "id");

    _grdModuleOperations.addPostJson(function (d) {
        d['sysRoleID'] = _grd.row['id'];
    });

    _grd.edit1 = function (r) {
        _grd.loadAll();
        _grd.edit(r);
        $("#divEntry").modal("show");
    };

    _grd.select = function (r) {
        _grd.edit(r);
        _grdModules.loadAll();
        _grdModuleOperations.loadAll();
    };
    _grd.addNew = function () {
        _grd.row = { id: 0 };
        $("#divEntry").modal("show");
    };

    _grd.addBeforeSave(function () {
        _grd.row['sysRoleID'] = _grd.row['id'];

        return true;
    });

    _grd.addAfterSave(function () {

        _grd.load();
        alert("Record saved successfully.");
        $("#divEntry").modal("hide");
    });

    _grd.save_rights = function (e) {
        var jnPost = { roleid: 0, data: "" };
        jnPost.roleid = _grd.row['id'];
        jnPost.data = JSON.stringify(_grdModuleOperations.rows);
        _grd.exec(jnPost, "sys:sysRoleModuleOperation\\save", e, function () {
            alert("Record save successfully.");
        });
    };

    $scope.grd = _grd;
    $scope.grdModules = _grdModules;
    $scope.grdModuleOperations = _grdModuleOperations;

    $scope.filter1 = function (r) {
        return function (item) {
            return item.sysModulesID === r.id;
        };
    }

    _grd.loadAll(null, function () {
        if(_grd.rows.length > 0) _grd.select(_grd.rows[0]);
    });

    _grdModules.load();
    _grdModuleOperations.loadAll();

});


myApp.controller("admin_login", controller_login("../Master/EmployeeList", "admin_login"));
//myApp.controller("candidate_login",controller_login("../Master/EmployeeList","candidate_login"));

myApp.controller("candidate_login", function ($scope, bll) {

    $scope.row = { userid: "", pwd: "" };

    $scope.login2 = function (e) {
        if (e.which == 13) $scope.login(e);

    }

    $scope.login = function (e) {
        bll.UpdateModule("candidate_login", $scope.row, function (status, result) {
            debugger;
            console.log(result);

            if (status == "success")
                window.location = "../Master/EmployeeForm2?id=" + result;
        }, e);
    };
});


myApp.controller("layout", function ($scope, bll) {

    var _grdUser = new ngCRUD(bll, "current_user", "", "", "id");
    $scope.grdUser = _grdUser;

    _grdUser.load(function () {
        if (_grdUser.rows.length > 0) {
            _grdUser.edit(_grdUser.rows[0]);
        }
    });


});


myApp.controller("layout_employee", function ($scope, bll) {

    var _grdUser = new ngCRUD(bll, "current_user_emp", "", "", "id");
    $scope.grdUser = _grdUser;

    _grdUser.load(function () {
        if (_grdUser.rows.length > 0) {
            _grdUser.edit(_grdUser.rows[0]);
        }
    });
    //alert("hi");
});

