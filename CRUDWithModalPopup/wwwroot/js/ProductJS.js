$(document).ready(function () {
    GetProduct();
});

/* Read Date*/
function GetProduct() {
    $.ajax({
        url: '/product/GetProducts',
        type: 'get',
        datatype: 'json',
        contentType: 'application/json;charset=utf-8',
        success: function (response) {
            if (response == null || response == undefined || response.length == 0) {
                var object = '';
                object += 'tr';
                object += '<td colspan="5" >' + 'Products not available' + '</td>';
                object += '</tr>';
                $('#tblBody').html(object);
            } else {
                var object = '';
                $.each(response, function (index, item) {
                    object += '<tr>';
                    object += '<td>' + item.id + '</td>';
                    object += '<td>' + item.ProductName + '</td>';
                    object += '<td>' + item.Price + '</td>';
                    object += '<td> <a href="#" class = "btn btn-primary btn-sm" onclick = "Edit(' + item.id + ')" > Edit</a> <a href="#" class="btn btn-danger btn-sm" onclick="Delete(' + item.id + ')"> Delete</a> </td > ';
                });
                $('#tblBody').html(object);
            }
        },
        error: function () {
            alert('Unable to read the data');
        }
    });
}

$('#btnAdd').click(function () {
    $('#ProductModal').modal('show');
    $('#modalTitle').text('Add Product');
})
/* Insert Date*/
function Insert() {
    var data = Validate();
    if (result == false) {
        return false;
    }

    var formData = new Object();
    formData.id = $('#Id').val();
    formData.ProductName = $('#ProductName').val();
    formData.Price = $('#Price').val();

    $.ajax({
        url: '/product/Insert',
        data: formData,
        type: 'post',
        success: function (response) {
            if (response == null || response == undefined || response.length == 0) {
                alert('Unable to save the data..');
            }
            else {
                alear(response);
            }
        },
        error: function () {
            alert('Unable to save the data..');
        }
    });
}

/* Hide Date*/
function HideModal() {
    $('#ProductModal').modal('hide');
}
function ClearData() {
    $('#ProductName').val('');
    $('#Price').val('');
    $('#Price').css('border-color', 'lightgrey');
    $('#Price').css('border-color', 'lightgrey');
}
function Validate() {
    var isValid = true;
    if ($('#ProductName').val().trim() == "") {
        $('#ProductName').css('border-color', 'Red');
        isValid = false;
    }
    else {
        $('#Price').css('border-color', 'lightgrey');
    }
    if ($('#Price').val().trim() == "") {
        $('#Price').css('border-color', 'Red');
        isValid = false;
    }
    else {
        $('#Price').css('border-color', 'lightgrey');
    }
    return isValid;
}
$('#ProductName').change(function () {
    Validate();
})
$('#Price').change(function () {
    Validate();
})
/*Edit*/
function Edit(id) {
    $.ajax({
        url: 'product/Edit?id=' + id,
        type: 'get',
        contentType: "application/json; charset=utf-8",
        datatype: 'json',
        success: function (response) {
            if (response == null || response == undefined) {
                alear('Unable to read the data..');
            }
            else if (response.length == 0) {
                alert('Data not availabe with this id ' + id);
            }
            else {
                $('#ProductModal').modal('show');
                $('#modalTitle').text('Update Product');
                $('#Save').css('display', 'none');
                $('#Update').css('display', 'block');
                $('#Id').val(response.id);
                $('#Id').val(response.ProductName);
                $('#Id').val(response.Price);
            }
        },
        error: function () {
            alert('Unable to read the data..');
        }
    })
}
/*Update Data*/
function Update() {
    var result = Validate();
    if (result = false) {
        return false;
    }
    var formData = new Object();
    formData.id = $('#Id').val();
    formData.ProductName = $('#ProductName').val();
    formData.Price = $('#Price').val();

    $.ajax({
        url: '/product/Update',
        data: formData,
        type: 'post',
        success: function (response) {
            if (response == null || response == undefined || response.length == 0) {
                alert('Unable to save the data..');
            }
            else {
                HideModal();
                GetProduct();
                alert(response);
            }
        },
        error: function () {
            alert('Unable to save the data..');
        }
    });
}
function Delete(id) {
    if (confirm('Are you sure to delete this data?')) {
        $.ajax({
            url: 'product/Delete?id=' + id,
            type: 'post',
            success: function (response) {
                if (response == null || response == undefined) {
                    alear('Unable to delete the data..');
                }
                else {
                    GetProduct();
                    alert(response);
                }
            },
            error: function () {
                alert('Unable to read the data..');
            }
        });
    }
    
}