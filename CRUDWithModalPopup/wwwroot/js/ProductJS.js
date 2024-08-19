$(document).ready(function () {
    GetProducts();
});

/* Read Data */
function GetProducts() {
    $.getJSON('/product/GetProducts', function (response) {
        var object = '';
        if (!response || response.length === 0) {
            object += '<tr>';
            object += '<td colspan="4">Products not available</td>';
            object += '</tr>';
        } else {
            $.each(response, function (index, item) {
                object += '<tr>';
                object += '<td>' + item.id + '</td>';
                object += '<td>' + item.productName + '</td>';
                object += '<td>' + item.price + '</td>';
                object += '<td><a href="#" class="btn btn-primary btn-sm" onclick="Edit(' + item.id + ')">Edit</a> ';
                object += '<a href="#" class="btn btn-danger btn-sm" onclick="Delete(' + item.id + ')">Delete</a></td>';
                object += '</tr>';
            });
        }
        $('#tblBody').html(object);
    }).fail(function () {
        alert('Unable to read the data.');
    });
}

$('#btnAdd').click(function () {
    $('#Id').val('0');
    $('#ProductName').val('');
    $('#Price').val('');
    $('#modalTitle').text('Add Product');
    $('#Save').show();
    $('#Update').hide();
    $('#ProductModal').modal('show');
});

/* Insert Data */
function Insert() {
    if (!Validate()) {
        return;
    }

    var formData = {
        id: $('#Id').val(),
        ProductName: $('#ProductName').val(),
        Price: $('#Price').val()
    };

    $.post('/product/Insert', formData, function (response) {
        if (!response) {
            alert('Unable to save the data..');
        } else {
            HideModal();
            GetProducts();
            alert(response);
        }
    }).fail(function () {
        alert('Unable to save the data..');
    });
}

/* Hide Modal */
function HideModal() {
    $('#ProductModal').modal('hide');
    ClearData();
}

function ClearData() {
    $('#Id').val('0');
    $('#ProductName').val('');
    $('#Price').val('');
    $('#ProductName').css('border-color', 'lightgrey');
    $('#Price').css('border-color', 'lightgrey');
}

function Validate() {
    var isValid = true;
    if ($('#ProductName').val().trim() === "") {
        $('#ProductName').css('border-color', 'Red');
        isValid = false;
    } else {
        $('#ProductName').css('border-color', 'lightgrey');
    }
    if ($('#Price').val().trim() === "") {
        $('#Price').css('border-color', 'Red');
        isValid = false;
    } else {
        $('#Price').css('border-color', 'lightgrey');
    }
    return isValid;
}

$('#ProductName').change(Validate);
$('#Price').change(Validate);

/* Edit */
function Edit(id) {
    $.get('/product/Edit', { id: id }, function (response) {
        if (!response) {
            alert('Unable to read the data..');
        } else {
            $('#ProductModal').modal('show');
            $('#modalTitle').text('Update Product');
            $('#Save').hide();
            $('#Update').show();
            $('#Id').val(response.id);
            $('#ProductName').val(response.productName);
            $('#Price').val(response.price);
        }
    }).fail(function () {
        alert('Unable to read the data..');
    });
}

/* Update Data */
function Update() {
    if (!Validate()) {
        return;
    }

    var formData = {
        Id: $('#Id').val(),
        ProductName: $('#ProductName').val(),
        Price: $('#Price').val()
    };

    $.post('/product/Update', formData, function (response) {
        if (!response) {
            alert('Unable to save the data.');
        } else {
            alert(response);
            HideModal();
            GetProducts();
        }
    }).fail(function () {
        alert('Unable to save the data.');
    });
}

function Delete(id) {
    if (confirm('Are you sure to delete this data?')) {
        $.post('/product/Delete', { id: id }, function (response) {
            if (!response) {
                alert('Unable to delete the data..');
            } else {
                GetProducts();
                alert(response);
            }
        }).fail(function () {
            alert('Unable to delete the data..');
        });
    }
}
