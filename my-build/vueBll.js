///amit jha
function clsAjaxProcessing(e) {

    var btn = undefined;

    if (e != undefined)
        if (e.type == "click")
            btn = e.target;

    var elAjaxLoader;

    this.start = function () {

        if (btn != undefined) {
            elAjaxLoader = $('<span class="ajax_in_process" >  &nbsp;&nbsp;&nbsp;&nbsp;</span>');
            $(btn).after(elAjaxLoader);
            $(btn).hide();
        }

    }


    this.end = function () {
        if (btn != undefined) {
            $(btn).show();
            $(elAjaxLoader).remove();
        }
    }
}

var g = {
    alert: function (sMsg, sTitle) {
        alert(sMsg)
    }
};


(function ($) {
    $.fn.serializeAny = function () {
        var ret = [];
        $.each($(this).find(':input'), function () {

            if (this.name != "") {
                var jnData = { name: "", value: "" };
                jnData.name = this.name;
                jnData.value = $(this).val()
                ret.push(jnData);
            }
        });

        return ret;
    }
})(jQuery);


function postJn(sender) {
    var jn = [];

    var f = { name: ""
        , value: ""
    };

    f.name = $(sender).prop("name");
    f.value = $(sender).val();

    jn.push(f);
    
    return jn;

}


function clone(obj1) {
    var mObj = JSON.parse(JSON.stringify(obj1))
    return mObj;
}




function qstr(name) {
    name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}



//"http://localhost/web_test/test/test_post"

function clsMyAjax(sUrl) {

    var xhr = new XMLHttpRequest();
    
    var self = this;

    xhr.upload.addEventListener("progress", function(evt){
      if (evt.lengthComputable) {
        //console.log("add upload event-listener" + evt.loaded + "/" + evt.total);
        var iPer = (evt.loaded * 100 ) / evt.total;
        self.onProgress(iPer);
      }
    }, false);
    
    
    /*
    xhr.onprogress = function (e) {
        debugger;
        if (e.lengthComputable) {
            console.log(e.loaded+  " / " + e.total)
        }
    }
    */
    this.onProgress = function(per){
        console.log(per);
    }
    xhr.onloadstart = function (e) {
        console.log("start")
    }
    xhr.onloadend = function (e) {
        debugger;
        console.log("end")
    } 
    
    
    var file = document.getElementById("txtFile");
    //var fileData = ;
    
    this.send = function(sType,data){
        xhr.open(sType, sUrl);
        xhr.send(data);
    }

    
    this.post = function(oData,callBack){
        self.send("POST",oData);
    }
    
}

"use strict"
function clsPDFViewer(ssLink) {
    /*
    data
    currentPage = 1;
    totalPages = 0
    error = false;
    busy = false
    
    -----Functions-------------------
    
    setCanvas(oCanvas);
    onFileLoad();
    viewPage();
    viewPageByIndex(iIndex);
    loadPDF();
    setPDFLink(sLink);
    reset();
    next();
    previous();

    */

    var sLink = ssLink;

    var _pdf = null;

    var _canvas = null;
    
    this.currentPage = 1;
    this.totalPages = 0
    this.error = false;
    this.pages = [];
    this.busy = false;
    this.progressPer = 0;
    
    this.setCanvas = function(oCanvas) {
        _canvas = oCanvas;
    };
    
    this.onFileLoad = function(){
        
    };
    
    var self = this;
    
    var _fillPagesInfo = function() {
        for(var i = 0; i < self.totalPages; i++) {
            
            var jn = { pageNumber : i+1 };
            
            self.pages.push(jn);
            
        }
    }

    this.viewPage = function () {
        self.busy = true;
        _pdf.getPage(self.currentPage).then(function (page) {
            // you can now use *page* here
            var scale = 1.5;
            
            var viewport = page.getViewport(scale);

            //var canvas = document.getElementById('the-canvas');
            var context = _canvas.getContext('2d');
            _canvas.height = viewport.height;
            _canvas.width = viewport.width;

            var renderContext = {
                canvasContext: context,
                viewport: viewport
            };
            
            page.render(renderContext);
            
            self.busy=false;
        });
    }
    
    this.viewPageByIndex = function(iIndex)    {
        self.currentPage = iIndex;
        self.viewPage();
    }


    

    this.loadPDF = function () {
        
        var _progress = function(objProgress){
            self.progressPer = (objProgress.loaded / objProgress.total) * 100;
            
            if(self.onFileLoad) 
                self.onFileLoad();
            
            console.log(self.progressPer);
        }
        
        PDFJS.getDocument( { url : sLink }, false, null, _progress ).then(function(pdf) {
            _pdf = pdf;
            self.totalPages = _pdf.numPages;
            _fillPagesInfo();
            self.viewPage();
            //$scope.$apply();
            if($.isFunction(self.onFileLoad)) self.onFileLoad();
            
        }).catch(function(error) {
            alert(error);
        });
        
        /*
        PDFJS.getDocument(sLink).then(function (pdf) {
            // you can now use *pdf* here
            
            _pdf = pdf;
            self.totalPages = _pdf.numPages;
            
            _fillPagesInfo();
            self.viewPage();
            
            //$scope.$apply();
            
            if(angular.isFunction(self.onFileLoad)) self.onFileLoad();
        });
        */
    }
    
    this.setPDFLink = function (_Link) {
        sLink = _Link;
        self.loadPDF()
    }

    this.reset = function () {
        this.currentPage = 1;
        self.viewPage();
    }

    this.next = function () {
        if (self.currentPage >= (self.totalPages)) {
            alert("You are on the last page !")
            return;
        }
        
        this.currentPage += 1;
        self.viewPage();
    }
    
    this.previous = function () {
        if (self.currentPage == 1) {
            alert("You are on the first page !")
            return;
        }

        self.currentPage -= 1;
        self.viewPage();
    }    
}

var appConfig = new clsAppConfig();



var arrVueControls = [];

function getControlViewHtml(sUrl,callBack){
    
    _link = appConfig.viewLink + sUrl;
    
    $.get(_link,function(response,status){
        callBack(response,status);
    })
}



function clsVueControl(sName,sVirtualUrl,fn){
    
    this.name = sName
    this.viewUrl = sVirtualUrl;
    this.fn = fn;
    this.register = function(){
        self = this;
        Vue.component(this.name,function(resolve){
            var jn = self.fn();
            jn.template = "";
            getControlViewHtml(self.viewUrl,function(sHtml){
                jn.template = sHtml;
                resolve(jn);
            });
        });
    }
}

function addVueControl(sName,sUrl,fn){
    var control = new clsVueControl(sName,sUrl,fn);
    arrVueControls.push(control);
}

function registerVueControls() {
        for(var i =0; i < arrVueControls.length;i++){
        arrVueControls[i].register();
    }
}


function clsAppConfig() {
    
    this.appName = "";
    this.controllerLink = "";
    this.assetsLink = "";
    this.viewLink = "";
    this.appResourceLink  = "";
    
    
    this.getDataLink = function (sPath) {
        return this.controllerLink + "getdataAll?appName=" + this.appName + "&path=" + sPath;
    }
    
    this.getDataPagingLink = function (sPath
        , pageSize
        , length
        , start) {

        var sLink = this.controllerLink + "getdataPaging?appName=" + this.appName + "&path=" + sPath;
        sLink += "&draw=" + pageSize;
        sLink += "&length=" + length;
        sLink += "&start=" + start;
        return sLink;
    }

    this.getUpdateLink = function (sPath) {
        return this.controllerLink + "UpdateModule?appName=" + this.appName + "&path=" + sPath;
    }
    
    this.getReportLink = function (sPath) {
        return this.controllerLink + "setReport?appName=" + this.appName + "&path=" + sPath;        
    }    

    this.getReportDownloadLink = function () {
        return this.controllerLink + "downloadSQLReport";
    }
    
    this.getFileLink = function (sPath) {
        return this.controllerLink + "setFileForDownload?appName=" + this.appName + "&path=" + sPath;
    }
    
    this.getFileDownloadLink = function (sPath) {
        return this.controllerLink + "downloadFile";
    }
    
};


function clsRequest($http,appConfig) {

    this.getData = function (sPath, callBack) {
        var sPathFull = appConfig.getDataLink(sPath);

        if($http)
        {
            $http.get(sPathFull).success(function (data, status) {
                callBack(data.Obj)
            }).error(function (data, status) {

            });
        }
    };    
    
    this.submitForm =  function ( fields, uploadUrl, callback) {

        var fd = new FormData();
        
        for (var f in fields) {
            if (fields[f] != null && fields[f] != undefined)
                fd.append(f, fields[f]);
        }
        
        ///////////////////////////////////
        
        if($http)
        {
            
            var _fnSuccess = function(res){
                if (callback != undefined) callback(res.data,"success");
            };
            
            var _fnError = function(){
                if (callback != undefined) callback(null,"error");
            };
        
            $http.post(uploadUrl, fd, {
                transformRequest: angular.identity,
                headers: { 'Content-Type': undefined }
            }).then(_fnSuccess,_fnError);
        }
        else    
        {
            /*
            $.post(uploadUrl,fields,function(data,status){
                if(status == "success") 
                    callback(data,"success");
                else 
                    callback(null,"error");
            });
            */
            
            request  = $.ajax({
                url: uploadUrl,
                contentType: false,
                data: fd,
                processData : false,
                type: 'POST'
            });

            request.done(function(data){
                callback(data,"success");
            });

            request.fail(function(error){
                callback(null,"error");
            });
        }
    };
    
    
    this.execJson = function (sPath, jnData, func,e) {
        var oAjaxProcess = new clsAjaxProcessing(e);
        oAjaxProcess.start();

        var _url = appConfig.getDataLink(sPath);

        this.submitForm(jnData,_url,function (data){
            func(data)
            oAjaxProcess.end();
        });
    }
    
    this.execGrid = function (sPath, pageSize, start, length, jnData, func, e) {
        
        
        var oAjaxProcess = new clsAjaxProcessing(e);
        oAjaxProcess.start();

        var _url = appConfig.getDataPagingLink(sPath, pageSize, length, start);

        this.submitForm(jnData,_url,function (data){
            func(data);
            oAjaxProcess.end();
        });
    }

     this.setSQLReport = function (sPath, jnData, func, e) {
         var url = appConfig.getReportLink(sPath);
         var oAjaxProcess = new clsAjaxProcessing(e);
         
         oAjaxProcess.start();
         this.submitForm(jnData, url, function (data) {
             var response = data['msg'];
             var data1 = data['data'];
             
             if (response != "") {
                 alert(response);
                 if ($.isFunction(func)) func("error");
             }
             else {
                 //ShowMessage("success!", response);
                 if ($.isFunction(func)) func("success", data1);
             }
             
             oAjaxProcess.end();
         });
     }
    
     this.downloadSQLReport = function(sPath,sFileType,jnData,e){
         this.setSQLReport( sPath, jnData, function (status) {
            if(status=="success")
                window.location = appConfig.getReportDownloadLink() + "?filetype=" + sFileType;
        }, e);    
     }
     
     
     this.setFileForDownload = function (sPath, jnData, func, e) {
         
         var url = appConfig.getFileLink(sPath);
         var oAjaxProcess = new clsAjaxProcessing(e);
         
         oAjaxProcess.start();
         this.submitForm(jnData, url, function (data) {
             var response = data['msg'];
             var data1 = data['data'];
             
             if (response != "") {
                 alert(response);
                 if ($.isFunction(func)) func("error");
             }
             else {
                 //ShowMessage("success!", response);
                 if ($.isFunction(func)) func("success", data1);
             }
             
             oAjaxProcess.end();
         });
     }
     
     this.downloadFile = function(sPath,jnData,e){
         
         this.setFileForDownload(sPath, jnData, function (status) {
            if(status=="success")
                window.location = appConfig.getFileDownloadLink();
        }, e);    
     }
     
     this.UpdateModule =  function ( sPath, jnData, func, e) {
            
        var url = appConfig.getUpdateLink(sPath);
        var oAjaxProcess = new clsAjaxProcessing(e);

        oAjaxProcess.start();

        this.submitForm( jnData, url, function (data) {
            var response = data['msg'];
            var data1 = data['data'];

            if (response != "") {
                alert("Opps! "+ response);
                if ($.isFunction(func)) func("error");
            }
            else {
                //ShowMessage("success!", response);
                if ($.isFunction(func)) func("success", data1);
            }
            oAjaxProcess.end();
        });
    }
     
    this.UpdateModule2 =  function ( sPath, jnData, func, e) {
            
        var url = appConfig.getUpdateLink(sPath);
        var oAjaxProcess = new clsAjaxProcessing(e);

        oAjaxProcess.start();

        this.submitForm( jnData, url, function (data) {
            var response = data['msg'];
            var data1 = data['data'];

            if (response != "") {
                //alert("Opps! "+ response);
                if ($.isFunction(func)) func("error",response);
            }
            else {
                //ShowMessage("success!", response);
                if ($.isFunction(func)) func("success", data1);
            }
            oAjaxProcess.end();
        });
    }


}
"use strict"
function clsPDFViewer(ssLink) {
    /*
    data
    currentPage = 1;
    totalPages = 0
    error = false;
    busy = false
    
    -----Functions-------------------
    
    setCanvas(oCanvas);
    onFileLoad();
    viewPage();
    viewPageByIndex(iIndex);
    loadPDF();
    setPDFLink(sLink);
    reset();
    next();
    previous();

    */

    var sLink = ssLink;

    var _pdf = null;

    var _canvas = null;
    
    this.currentPage = 1;
    this.totalPages = 0
    this.error = false;
    this.pages = [];
    this.busy = false;
    this.progressPer = 0;
    
    this.setCanvas = function(oCanvas) {
        _canvas = oCanvas;
    };
    
    this.onFileLoad = function(){
        
    };
    
    var self = this;
    
    var _fillPagesInfo = function() {
        for(var i = 0; i < self.totalPages; i++) {
            
            var jn = { pageNumber : i+1 };
            
            self.pages.push(jn);
            
        }
    }

    this.viewPage = function () {
        self.busy = true;
        _pdf.getPage(self.currentPage).then(function (page) {
            // you can now use *page* here
            var scale = 1.5;
            
            var viewport = page.getViewport(scale);

            //var canvas = document.getElementById('the-canvas');
            var context = _canvas.getContext('2d');
            _canvas.height = viewport.height;
            _canvas.width = viewport.width;

            var renderContext = {
                canvasContext: context,
                viewport: viewport
            };
            
            page.render(renderContext);
            
            self.busy=false;
        });
    }
    
    this.viewPageByIndex = function(iIndex)    {
        self.currentPage = iIndex;
        self.viewPage();
    }


    

    this.loadPDF = function () {
        
        var _progress = function(objProgress){
            self.progressPer = (objProgress.loaded / objProgress.total) * 100;
            
            if(self.onFileLoad) 
                self.onFileLoad();
            
            console.log(self.progressPer);
        }
        
        PDFJS.getDocument( { url : sLink }, false, null, _progress ).then(function(pdf) {
            _pdf = pdf;
            self.totalPages = _pdf.numPages;
            _fillPagesInfo();
            self.viewPage();
            //$scope.$apply();
            if($.isFunction(self.onFileLoad)) self.onFileLoad();
            
        }).catch(function(error) {
            alert(error);
        });
        
        /*
        PDFJS.getDocument(sLink).then(function (pdf) {
            // you can now use *pdf* here
            
            _pdf = pdf;
            self.totalPages = _pdf.numPages;
            
            _fillPagesInfo();
            self.viewPage();
            
            //$scope.$apply();
            
            if(angular.isFunction(self.onFileLoad)) self.onFileLoad();
        });
        */
    }
    
    this.setPDFLink = function (_Link) {
        sLink = _Link;
        self.loadPDF()
    }

    this.reset = function () {
        this.currentPage = 1;
        self.viewPage();
    }

    this.next = function () {
        if (self.currentPage >= (self.totalPages)) {
            alert("You are on the last page !")
            return;
        }
        
        this.currentPage += 1;
        self.viewPage();
    }
    
    this.previous = function () {
        if (self.currentPage == 1) {
            alert("You are on the first page !")
            return;
        }

        self.currentPage -= 1;
        self.viewPage();
    }    
}



function ngGrid(bll, sGetPath) {

    var grid = this;

    grid.getPath = sGetPath;

    //Ajax loader
    grid.beforeLoad = [];
    grid.afterLoad = [];
    grid.postJson = [];
    grid.busy = false;
    grid.selectAll = false;
    
    grid.isError = false;
    grid.errorMessage = "";
    
    grid.setSubModule = function (val) {
        subModuleName = val;
    }

    grid.addBeforeLoad = function (fn) {
        grid.beforeLoad.push(fn);
    }

    grid.addAfterLoad = function (fn) {
        grid.afterLoad.push(fn);
    }
    

    grid.addPostJson = function (fn) {
        grid.postJson.push(fn);
    }

    var _beforeLoad = function () {
        $.each(grid.beforeLoad, function () {
            if ($.isFunction(this)) this();
        });
    }

    var _afterLoad = function () {
        $.each(grid.afterLoad, function () {
            if ($.isFunction(this)) this();
        });
    }

    var fnPostJson = function (d) {
        $.each(grid.postJson, function () {
            if ($.isFunction(this)) this(d);
        });
    };


    this.row = {};


    this.edit = function (r) {
        this.row = clone(r);
    }


    this.onError = function (sMsg) {
        alert(sMsg);
    }

    this.loadOnEnter = function (e) {
        if (e.which == 13)
            this.load();
    }


    this.getCheckedValues = function (Field_value, checkField, seprator) {

        var seprator1 = seprator == undefined ? "," : seprator;
        var lst = [];

        for (var i = 0; i < this.rows.length; i++)
            if (this.rows[i][   checkField])
                lst.push(this.rows[i][Field_value]);

        return lst.join(seprator1);
    }



    this.rows = [];
    this.count = 0;
    this.pageIndex = 0;
    this.pageSize = "20";
    this.pageButtons = [0, 1, 2, 3];



    this.searchOnEnter = function (e) {

        if (e.which == 13) {
            this.pageIndex = 0;
            this.load();
        }

    }

    this.search = function (e) {
        this.pageIndex = 0;
        this.load();
    }


    this.ActiveClass = function (r) {
        return r == this.pageIndex ? 'active1' : '';
    }

    this.getSortClass = function (sField) {

        if (sField == this.sort_field) {
            switch (this.sort_type) {
                case "asc":
                    return "fa-sort-alpha-asc";
                case "desc":
                    return "fa-sort-alpha-desc";
                default:
                    return "fa-sort"
            }
        }
        else {
            return "fa-sort"
        }
    }


    //Sorting setting 
    this.sort_type = ""
    this.sort_field = ""

    this.sort = function (sField, e) {
        this.sort_field = sField;
        this.sort_type = this.sort_type == "asc" ? "desc" : "asc";
        this.load(null, e);
    }
    /////////////////


    this.getPageCount = function () {
        return Math.ceil(this.count / this.pageSize);
    }

    this.changePage = function (iPageIndex, e) {
        this.pageIndex = iPageIndex;
        this.load(null, e);
    }

    this.MoveToFirstPage = function () {
        this.pageButtons[0] = 0
        this.pageButtons[1] = 1
        this.pageButtons[2] = 2
        this.pageButtons[3] = 3


        this.pageIndex = this.pageButtons[0];
        this.load();


    }

    this.MoveToLastPage = function () {

        while (this.pageButtons[3] <= this.getPageCount() - 1) {
            this.pageButtons[0] += 4
            this.pageButtons[1] += 4
            this.pageButtons[2] += 4
            this.pageButtons[3] += 4
        }

        this.pageIndex = this.pageButtons[0];
        this.load();
    }




    this.MoveNext = function () {

        if (this.pageButtons[3] >= this.getPageCount()) {
            //alert(this.pageButtons[3] + ": " + this.getPageCount());
            return;
        }

        this.pageButtons[0] += 4
        this.pageButtons[1] += 4
        this.pageButtons[2] += 4
        this.pageButtons[3] += 4

        this.pageIndex = this.pageButtons[0];
        this.load();

    }




    this.MovePrevious = function () {
        if (this.pageButtons[0] <= 0) return;

        this.pageButtons[0] -= 4
        this.pageButtons[1] -= 4
        this.pageButtons[2] -= 4
        this.pageButtons[3] -= 4
        this.pageIndex = this.pageButtons[0];
        this.load();
    }

    this.setButtons = function () {
    }


    this.load = function (callBack, e) {


        var jnPost = {};


        if (this.sort_type != "" && this.sort_field != "") {
            jnPost["$sort"] = this.sort_field + " " + this.sort_type;
        }


        if (fnPostJson != undefined) fnPostJson(jnPost);

        _beforeLoad();
        grid.busy = true;

        bll.execGrid(sGetPath, this.pageIndex, this.pageIndex * this.pageSize, this.pageSize, jnPost, function (data) {
            
            if(data.error == true)
            {
                grid.isError = true;
                grid.errorMessage = data.error_msg;
            }
            else
            {
                grid.isError = false;
                grid.errorMessage = "";

                grid.rows = data.data;
                grid.count = data.recordsTotal;
            }
            
            
            if ($.isFunction(callBack)) callBack();

            _afterLoad();
            grid.busy = false;
            //this.setButtons();

        }, e);
    }


    this.loadAll = function (dPostData, callBack, e) {


        var jnPost = null;


        if ($.isPlainObject(dPostData))
            jnPost = dPostData;
        else
            if ($.isFunction(fnPostJson)) {
                var jnPost = {};
                fnPostJson(jnPost);
            }


        _beforeLoad();

		grid.busy = true;
        bll.execJson(sGetPath, jnPost, function (data) {
            if ($.isArray(data)) {
                grid.rows = data;
                grid.count = data.length;

                if ($.isFunction(callBack)) callBack();

                _afterLoad();
				grid.busy=false;
            }
        }, e);
    }

    this.selectById = function (iId, callback, e) {


        if ($.isNumeric(iId) == false || parseInt(iId) == 0) {
            this.row = {};
            return;
        }

        var jnPost = {};
        jnPost[this.PrimaryKeyField] = iId;

        _beforeLoad();
        bll.execJson(sGetPath, jnPost, function (data) {
            if (data.length > 0) {
                grid.row = data[0];
                if ($.isFunction(callback)) callback();
            }
            _afterLoad();
        }, e);
    }


    this.selectByFilter = function (filterData, callback, e) {
        _beforeLoad();
        grid.busy = true;
        bll.execJson(sGetPath, filterData, function (data) {
            if (data.length > 0) {
                grid.row = data[0];
                if ($.isFunction(callback)) callback();
            }
            _afterLoad();
            grid.busy = false;
        }, e);
    }

    //Alter
    
    this.downloadSQLReport = function(sReportName,sType,e){
        var jnPost = {};
        fnPostJson(jnPost);
        bll.downloadSQLReport(sReportName, sType, jnPost, e);    
        
        //bll.downloadSQLReport("ap_mlm:customer_list", "Excel", $scope.row_filter, e);
    }
    
    ///designed for VUE
    
    this.fill = function() {
        self = this;
        self.busy = true;
        
        bll.execGrid(this.getPath, this.pageIndex, this.pageIndex * this.pageSize, this.pageSize, this.filterData, function (res) {
            
            if (res.error == true)
            {
                self.isError = true;
                self.errorMessage = res.error_msg;
            }
            else
            {
                self.isError = false;
                self.errorMessage = "";

                self.rows = res.data;
                self.count = res.recordsTotal;
            }
        });
        
        /*
        bll.getDataPaging(this.getPath,this.filterData,this.pageIndex,this.pageSize,function(res){

            if(res.error == true)
            {
                self.isError = true;
                self.errorMessage = res.error_msg;
            }
            else
            {
                self.isError = false;
                self.errorMessage = "";

                self.rows = res.data;
                self.count = res.recordsTotal;
            }

            self.busy = false;

        });
        */
    }
    
    this.setPage = function(iPageIndex) {
        debugger;

        //Control start 
        if( (iPageIndex < 0) )
        {
           alert("You are on the first page !");
            return ;
        }
        
        if(iPageIndex >= this.getPageCount()){
            alert("You are on the last page !");
            return ;
        }
        
        //Control end

        this.pageIndex = iPageIndex;
        this.fill();
    }
    
    this.setPageSize = function(){
        this.pageIndex = 0;
        this.fill();
    }
    
}


function ngCRUD(bll, sGetPath, sSavePath, sDeletePath, PrimaryKeyField) {

    var grd = new ngGrid(bll, sGetPath);

    grd.PrimaryKeyField = PrimaryKeyField;

    grd.row_copy = null;

    grd.formClear = function () {
        grd.row = { id: 0 };
    }

    grd.downloadFile = function (r, sField) {

        /*
        var iID = 0;
        iID = r[grd.PrimaryKeyField];
        var sPath = ng.getlinkDownloadFile(grd.ModuleName, sField, iID);
        document.location.href = sPath;
        */
    }

    grd.exec = function (row, sPath, e, callback) {

        if (grd.beforeSave != undefined) {
            if (!grd.beforeSave()) return false;
        }

        r = row == undefined || row == null ? grd.row : row;

        bll.UpdateModule( sPath, r, function (status, data) {
            if (status == "success") {

                //grd.formClear();

                if (grd.afterSave != undefined && $.isFunction(grd.afterSave)) {
                    //grd.afterSave(data);
                }

                if ($.isFunction(callback)) callback();
            }
        }, e);
    }

    grd.beforeSave = null;

    grd.addBeforeSave = function (fn) {
        grd.beforeSave = fn;
    }

    grd.afterSave = null;

    grd.addAfterSave = function (fn) {
        grd.afterSave = fn;
    }

    grd.save = function (callback, e) {

        if (grd.beforeSave != undefined) {
            if (!grd.beforeSave()) return false;
        }

        bll.UpdateModule(sSavePath, grd.row, function (status, data, info) {

            if (status == "success") {

                grd.formClear();

                if (grd.afterSave != undefined && $.isFunction(grd.afterSave)) {
                    grd.afterSave(data, info);
                }

                if ($.isFunction(callback)) callback(data, info);

            }
            else if (status == "error") {
                //grd.onError(data);
            }
        }, e, false);
    }


    //grd.save_others = function (callback, e) {
    //    grd.exec(ActionName, e, callback);
    //}

    grd.edit = function (r) {
        grd.row = clone(r);
    }

    grd.copy = function (r) {
        grd.row_copy = r == undefined ? clone(grd.row) : clone(r);
    }

    grd.paste = function () {
        grd.row = clone(grd.row_copy);
        grd.row.id = 0;
    }

    
    grd.del = function (r, callBack, e) {
        if (!confirm("Are you sure want to delete selected record ?")) return;
        bll.UpdateModule(sDeletePath, { id: r[PrimaryKeyField] }, function (status) {

            if (status == "success") {
                //if (callBack != undefined) grid.load();
                grd.formClear();

                if ($.isFunction(callBack)) {
                    callBack();
                }
                else if (callBack == undefined) {
                    grd.load();
                }
            }
        }, e);
    }


    return grd;
}


function clsCRUD_PopUp(bll,oCRUDInfo,sModalDivName){
    
    var _sModalDivName = "#" + (sModalDivName || "divEntry");
    
    var _grd = new ngCRUD(bll,oCRUDInfo['get'],oCRUDInfo['save'],oCRUDInfo['del'],oCRUDInfo['primaryKeyField']);

    _grd.addNew = function(){
        _grd.row = {};
        $(_sModalDivName).modal("show");
    }
    
    _grd.edit1 = function (r) {
        _grd.edit(r);
        $(_sModalDivName).modal("show");
    }

    _grd.addAfterSave(function () {
        $(_sModalDivName).modal("hide");
        _grd.load();
    });
    
    return _grd;
}
//Before starting coding uncomment this code 
//var oRequest = new clsRequest();

function clsFileUploader(oRequest){
    
    this.rows = [];
    
    this.path_upload = "";
    
    this.process = {
        runing : false 
        ,totalCount : 0
        ,doneCount : 0
        ,errorCount : 0
        ,currentFileName : ""
    }
    
    this.addFiles = function(oFiles){
        
        this.rows = [];
        for(var i =0; i < oFiles.length;i++){
            var jn = {fileName : "",fileSize : 0 ,fileData : null }
            
            jn.fileName = oFiles[i].name;
            jn.fileSize = Math.round(oFiles[i].size / 1024,-2);
            jn.fileData = oFiles[i];
            this.rows.push(jn);
        }
        
        
        this.process.totalCount = this.rows.length;
        
    }
    
    this.getPer = function()
    {
        return  Math.round(((this.process.doneCount + this.process.errorCount) / this.process.totalCount) * 100);
    }

    
    this.addBeforePost = function(d){
        
    }
    
    
    
    this.uploadFile = function(r,e,callBack){
        
        debugger;
        var this1 = this;
        
        var jnPost =  { "fileData" :  r['fileData']} ;
        r.busy = true;
        
        this.process.currentFileName  = r.fileName;
        if($.isFunction(this.addBeforePost)) this.addBeforePost(jnPost);
        
        oRequest.UpdateModule2(this1.path_upload,jnPost,function(status,error){
            
            if(status == "success") {
                r.busy = false;
                r.status = "Done"
                r.done = true;
                r.err = false;
                
                this1.process.doneCount++;
            }
            else
            {
                r.busy = false;
                r.status = error;
                r.done = false;
                r.err = true;
                
                this1.process.errorCount++;
            }
            
            if($.isFunction(callBack) == true){
                callBack();
            }
        });
        
    }
                         
    
    this.uploadFiles = function() {
        var self = this;
            
        //var busy = false;
        var stopInterval = undefined;
        
        var iRow = -1;
        var busy  = false;
        this.process.runing = true;

        var _stopInterval = function(){
            
            clearInterval(stopInterval)
            self.process.runing = false;
            //alert("Operation done kinly check the log !");
        }
            
        stopInterval = setInterval(function(){
            
            
            if(iRow >= (self.rows.length -1)){
                _stopInterval();     
                busy = false;
                return;
            }
                                 
            if(busy == true) return;

            if(iRow < self.rows.length){
                iRow++;
                busy = true;
                self.uploadFile(self.rows[iRow],null,function(){
                    busy = false;        
                });
            }
            
        },100);
    }
    
}
Vue.component("pager",function(resolve) {
    getControlViewHtml("pager.html",function(sHtml,status){
        if(status="success")
        resolve({
            template : sHtml

            ,data : function(){
                return { abc : "amit"};
            }
            ,props :{
                grd : { type : Object   }
            }

        });
    });
});


Vue.component("gridFilter",function(resolve) {
    getControlViewHtml("grid-filter.html",function(sHtml,status){
        debugger;
        if(status = "success")
        resolve({
            template : sHtml
            , props : {
                grd : { type : Object , required : true }
            }
            ,data : function (){
                return { };
            }
            
        });
    });
});

Vue.component("grdFilter",function(resolve) {
    getControlViewHtml("grid-filter.html",function(sHtml,status){
        debugger;
        if(status = "success")
        resolve({
            template : sHtml
            , props : {
                grd : { type : Object , required : true }
            }
            ,data : function (){
                return { };
            }
            
        });
    });
});



Vue.component("grdSort",{
    props : { grd : [Object], col : [String]  }
    ,template : '<a class="pull-right" style="cursor:pointer" v-on:click="grd.sort(col, $event)"><i v-bind:class="[\'fa\',grd.getSortClass(col)]"></i> </a>'
});


Vue.component("busyBox",{
    props : { busy : [Boolean] }
    ,template : "<div v-show='busy' tyle='width:100%'><center><div class='busy-lg'></div></center></div>"
});

Vue.component("busy",{
    props : { grd : [Object] }
    ,template : "<div v-show='grd.busy' tyle='width:100%'><center><div class='busy-lg'></div></center></div>"
});




Vue.component("item1",function(resolve) {
    getControlViewHtml("tree1.html",function(sHtml,status){
        if(status="success")
        resolve({
            template : sHtml
            ,  data: function () {
                return {
                  open: false
                }
            }
            , props : {
                model: Object
            }
            , computed: {
                isFolder: function () {
                  return this.model.children &&
                    this.model.children.length
                }
            } 
            , methods : {
                toggle: function () {
                  if (this.isFolder) {
                    this.open = !this.open
                  }
                }
                ,
                changeType: function () {
                  if (!this.isFolder) {
                    Vue.set(this.model, 'children', [])
                    this.addChild()
                    this.open = true
                  }
                }
                ,
                addChild: function () {
                  this.model.children.push({
                    name: 'new stuff'
                  })
                }
            }

        });
    });
});

Vue.component("bulkUploader", function (resolve) {
    getControlViewHtml("bulk-uploader.html",function(resultHtml, status) { 
        
        resolve({
            template: resultHtml
            , props: {
                uploadPath : String
            }
            , data: function () {
                //debugger;
                var oFiles = new clsFileUploader(oRequest)
                oFiles.path_upload = this.uploadPath;
                
                return {
                    oFiles : oFiles
                }
            }
            , methods: {
                fillFiles : function (e) {
                    this.oFiles.addFiles(e.currentTarget.files);
                }
            }
            , created: function () {
                var self = this;
                this.oFiles.addBeforePost = function (r) {
                    self.$emit("onpost", r);
                }
            }
        });
    });
});
Vue.component("drp",{
    template:'<select class="form-control"  v-model="model1" >\n <option v-for="r in grd.rows" v-bind:value="r[valueMember]">{{r[displayMember]}}</option> \n </select>'
    , props :  {
        source : [String,Number]
        , valueMember : [String,Number]
        , displayMember : [String,Number] 
        , value : [String,Number]
    }
    , data : function(){
        var _grd = new ngCRUD(oRequest,this.source,"","","id");
        return { grd : _grd , model1 : this.value };
    }
    , created : function(){
        this.grd.loadAll();
    }
    , watch : {
      model1:function(newValue){
        this.$emit("input",newValue);
      }  
        
      ,value : function(newValue){
        this.model1 = newValue;
      }
    }
});

Vue.component("fld",{
    template :  '<div class="form-group"><label>{{fieldTitle}}&nbsp;<span style="color:red" v-show="fieldRequired">*</span></label> <input type="text" v-model="model1" class="form-control" /> </div>'
    , props : {
         fieldTitle : String
        , fieldRequired :  { type : Boolean , default : false }
        , value : [String,Number]
    }
    , data : function(){
        return { model1 : this.value  }
    }
    , watch : {
      model1 : function(newValue){
        this.$emit("input",newValue);
      }  
      ,value : function(newValue){
          this.model1 = newValue
      }
    }
});




Vue.component("pdfTopmenu",function(resolve) {
    getControlViewHtml("pdfTopmenu.html",function(sHtml,status){
        if(status = "success")
        resolve({
            template : sHtml
            , props : {
                viewer : { type : Object , required : true }
            }
            ,data : function (){
                return { };
            }
        });
    });
});


Vue.component("pdfContainer",function(resolve) {
    getControlViewHtml("pdfContainer.html",function(sHtml,status){
        if(status = "success")
        resolve({
            template : sHtml
            , props : {
                viewer : { type : Object , required : true }
            }
            ,data : function (){
                return { };
            }
            ,mounted : function(){
                debugger;
                var elem2 = $("#the-canvas",this.$el)[0];
                this.viewer.setCanvas(elem2);
            }
        });
    });
});

/*
appBll.directive("pdfTopmenu", function (appConfig) {
    return {
        restrict: "E"
        , scope : {  viewer : "=" }
        , replace : false
        , templateUrl : appConfig.viewLink + 'pdfTopmenu.html' //appConfig.appResourceLink + "/dms/controls/pdfViewer/pdfviewer.html"
        , link : function (scope,element) {
            
            //var elem2 = $("#the-canvas",element)[0];
            //scope.viewer.setCanvas(elem2);
            
            scope.viewer.onFileLoad = function(){
                scope.$apply();
            }
        }
    }
});

appBll.directive("pdfContainer", function (appConfig) {
    return {
        restrict: "E"
        , scope : {  viewer : "=" }
        , replace : false
        , templateUrl :  appConfig.viewLink + 'pdfContainer.html' //appConfig.appResourceLink + "/dms/controls/pdfViewer/pdfviewer.html"
        
        , link : function (scope,element) {
            
            
            var elem2 = $("#the-canvas",element)[0];

            scope.viewer.setCanvas(elem2);

            scope.viewer.onFileLoad = function(){
                
                scope.$apply();
            }
        }
    }
});
*/function clsFilterField(_grd){
    
    this.fields = [];
    this.rows = [];
    
    var this1 = this;

    this.add = function (sField
        ,sTitle
        ,sFieldType){

        var field = { name : "",title: "",fieldType :"" };

        field.fieldType = (sFieldType || "text");
        field.name = sField;
        field.title = (sTitle || sField || 'Unknown');
        field.operator = "Like";
        this1.fields.push(field);
    }

    this.addRow = function(){

        var jn = { name : "", operator : "LIKE", val : "" };
        if(this1.fields.length > 0 )  jn.name = this1.fields[0].name;
        this1.rows.push(jn);
    }

    this.del = function(iIndex) {
        if(this1.rows.length == 1 ) return;
        this1.rows.splice(iIndex,1);
    }

    this.clear = function(){
        this1.fields=[];
    }

    /*
    _grd.addPostJson(function(d){
        if(this1.fields.length > 0)
    });
    */
    
    _grd.addPostJson(function(d){
        debugger;
        if(this1.fields.length > 0)
            d["_filter"] = JSON.stringify(this1.rows);
    });

    if(this.rows.length == 0) this.addRow();

    this.fill = function(){
        debugger;
        _grd.filterData["_filter"] = JSON.stringify(this.rows);
        _grd.fill();
    }
    
    _grd['filter']  = this;

}

