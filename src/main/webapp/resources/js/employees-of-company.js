$(function() {
    console.log("employees!");
    $("#departmentNav").hide();
    $("#employeeNav").addClass("active");

    bindBtnAddemployee();
    bindBtnUpdateEmployee();
    bindBtnDeleteEmployee();
    bindBtnDeleteEmployeeConfirm();
    bindBtnConfirm();

    getEmployees();
});

var getEmployees = function() {
    $.get(url.employees, function(data) {
        if(data.employees.content.length) {
            renderTemplate($("#employeeTable").find("tbody"), "#employeeTemplate", data.employees.content, true);
            $("#employeeTable").find("tfoot").hide();
        } else {
            $("#employeeTable").find("tbody").empty();
            $("#employeeTable").find("tfoot").show();
        }
    });
};

var bindBtnAddemployee = function() {
    $(document).on("click", ".btn-add-employee", function() {
        employeeModal("post");
        $("#employeeModal").modal("show");
    });
};

var employeeModal = function (method, employeeId) {
    var methodLabel = "";
    if (method === "post") {
        methodLabel = labels.add;
    } else if (method === "put") {
        methodLabel = labels.modify;
    }
    $("#modalTypeLabel").text(methodLabel);
    $("#modalButtonLabel").text(methodLabel);

    $("#employeeModal").data("method", method);
    $("#employeeModal").data("id", employeeId);
    $("input.form-control").val("");
    $("#employeeModal").modal("show");
};

var bindBtnConfirm = function() {
    $(document).on("click", ".btn-confirm", function() {
        var method = $("#employeeModal").data("method");
        if(method === "post") {
            saveEmployee();
        } else if(method === "put") {
            updateEmployee();
        }
    });
};

var saveEmployee = function() {
    var form = {
        name: $("#name").val(),
        email: $("#email").val(),
        nickName: $("#nickName").val()
    };

    $.ajax({
        url: url.employees,
        method: "post",
        type: "json",
        contentType: "application/json",
        data: JSON.stringify(form),
        success: function(data) {
            getEmployees();
            $("#employeeModal").modal("hide");
        }
    });
};

var updateEmployee = function() {
    var employeeId = $("#employeeModal").data("id");

    var form = {
        name: $("#name").val(),
        email: $("#email").val(),
        nickName: $("#nickName").val()
    };

    $.ajax({
        url: url.employees + "/" + employeeId,
        method: "put",
        type: "json",
        contentType: "application/json",
        data: JSON.stringify(form),
        success: function(data) {
            getEmployees();
            $("#employeeModal").modal("hide");
        }
    });
};

var bindBtnUpdateEmployee = function() {
    $(document).on("click", ".btn-update-employee", function(event) {
        $target = $(event.target);
        employeeModal("put", $target.data("id"));
        $("#name").val($target.data("name"));
        $("#email").val($target.data("email"));
        $("#nickName").val($target.data("nickName"));
        $("#employeeModal").modal("show");
    });
};

var bindBtnDeleteEmployee = function() {
    $(document).on("click", ".btn-delete-employee", function(event) {
        $("#deleteEmployeeModal").data("id", $(event.target).data("id"));
        $("#deleteEmployeeModal").modal("show");
    });
};

var bindBtnDeleteEmployeeConfirm = function() {
    $(document).on("click", ".btn-delete-employee-confirm", function() {
        var employeeId = $("#deleteEmployeeModal").data("id");

        $.ajax({
            url: url.employees + "/" + employeeId,
            method: "delete",
            type: "json",
            success: function() {
                getEmployees();
                $("#deleteEmployeeModal").modal("hide");
            }
        });
    });
};