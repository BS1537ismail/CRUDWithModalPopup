$(document).ready(function () {
    var $IdOfProductId = $('#Id');
    var $IdOfProductName = $('#ProductName');
    var $IdOfPrice = $('#Price');
    var $IdOfAddButton = $('#btnAdd');
    var $IdOfModelTitle = $('#modalTitle');
    var $IdOfSaveButton = $('#Save');
    var $IdOfUpdateButton = $('#Update');
    var $IdOfProductModel = $('#ProductModal');

    /*Show Product Modal*/
    function ShowProductModal() {
        new bootstrap.Modal($IdOfProductModel[0]).show();
    }

    /*Set Empty data*/
    function SetEmpty() {
        $IdOfProductId.val('0');
        $IdOfProductName.val('');
        $IdOfPrice.val('');
    }

    /*Add Product Button */
    $IdOfAddButton.on('click', function () {
        SetEmpty();
        $IdOfModelTitle.text('Add Product');
        $IdOfSaveButton.show();
        $IdOfUpdateButton.hide();
        ShowProductModal();
    });

    /* Hide Modal */
    function HideModal() {
        bootstrap.Modal.getInstance($IdOfProductModel[0]).hide();
    }

    /*Clear data*/
    function ClearData() {
        SetEmpty();
        $IdOfProductName.css('border-color', 'lightgrey');
        $IdOfPrice.css('border-color', 'lightgrey');
    }

    /* validate Model */
    function Validate() {
        return new Promise((resolve, reject) => {
            let isValid = true;

            if ($IdOfProductName.val().trim() === "") {
                $IdOfProductName.css('border-color', 'Red');
                isValid = false;
            } else {
                $IdOfProductName.css('border-color', 'lightgrey');
            }

            if ($IdOfPrice.val().trim() === "") {
                $IdOfPrice.css('border-color', 'Red');
                isValid = false;
            } else {
                $IdOfPrice.css('border-color', 'lightgrey');
            }

            if (isValid) {
                resolve("Validation passed");
            } else {
                reject("Validation failed");
            }
        });
    }

    /*Append FormData*/
    function AppendFormData() {
        let formData = new FormData();
        formData.append('Id', $IdOfProductId.val());
        formData.append('ProductName', $IdOfProductName.val());
        formData.append('Price', $IdOfPrice.val());
        return formData;
    }

    /* Insert Data */
    function Insert() {
        if (!Validate()) return;

        let formData = AppendFormData();

        $.ajax({
            url: '/product/Insert',
            type: 'POST',
            data: formData,
            processData: false,
            contentType: false,
            success: function (data) {
                if (!data) {
                    alert('Unable to save the data.');
                } else {
                    HideModal();
                    ClearData();
                    alert(data);
                    window.location.href = '/product';
                }
            },
            error: function (xhr, status, error) {
                alert('Unable to save the data: ' + error);
            }
        });
    }

    $IdOfProductName.on('change', Validate);
    $IdOfPrice.on('change', Validate);

    /* Edit */
    function Edit(id) {
        $.ajax({
            url: '/product/Edit',
            type: 'GET',
            data: { id: id },
            success: function (data) {
                if (!data) {
                    alert('Data not available with this id ' + id);
                } else {
                    $IdOfModelTitle.text('Update Product');
                    $IdOfSaveButton.hide();
                    $IdOfUpdateButton.show();
                    $IdOfProductId.val(data.id);
                    $IdOfProductName.val(data.productName);
                    $IdOfPrice.val(data.price);
                    ShowProductModal();
                }
            },
            error: function (xhr, status, error) {
                alert('Unable to read the data: ' + error);
            }
        });
    }

    /* Update Data */
    function Update() {
        if (!Validate()) return;

        let formData = AppendFormData();

        $.ajax({
            url: '/product/Update',
            type: 'POST',
            data: formData,
            processData: false,
            contentType: false,
            success: function (data) {
                if (!data) {
                    alert('Unable to save the data.');
                } else {
                    alert(data);
                    HideModal();
                    ClearData();
                    location.reload();
                }
            },
            error: function (xhr, status, error) {
                alert('Unable to save the data: ' + error);
            }
        });
    }

    /* Details of Product */
    function ShowDetails(id) {
        $.ajax({
            url: '/product/Details',
            type: 'GET',
            data: { id: id },
            success: function (data) {
                if (!data) {
                    alert('Data not available for this product.');
                } else {
                    $IdOfModelTitle.text('Product Details');

                    $IdOfProductId.val(data.id);
                    $IdOfProductName.val(data.productName);
                    $IdOfPrice.val(data.price);

                    // Disable fields since this is just a details view
                    $IdOfProductName.prop('disabled', true);
                    $IdOfPrice.prop('disabled', true);
                    $IdOfSaveButton.hide();
                    $IdOfUpdateButton.hide();

                    ShowProductModal();

                    $IdOfProductModel.on('hidden.bs.modal', function () {
                        $IdOfProductName.prop('disabled', false);
                        $IdOfPrice.prop('disabled', false);
                        $IdOfSaveButton.show();
                        $IdOfUpdateButton.hide();
                    });
                }
            },
            error: function (xhr, status, error) {
                alert('Unable to fetch product details: ' + error);
            }
        });
    }

    /* Delete Data */
    function Delete(id) {
        if (confirm('Are you sure you want to delete this product?')) {
            $.ajax({
                url: '/product/Delete',
                type: 'POST',
                data: { id: id },
                success: function (data) {
                    if (!data) {
                        alert('Unable to delete the data.');
                    } else {
                        location.reload();
                        alert(data);
                    }
                },
                error: function (xhr, status, error) {
                    alert('Unable to delete the data: ' + error);
                }
            });
        }
    }

    // Expose functions to the global scope if needed
    window.Insert = Insert;
    window.Edit = Edit;
    window.Update = Update;
    window.ShowDetails = ShowDetails;
    window.Delete = Delete;
});
