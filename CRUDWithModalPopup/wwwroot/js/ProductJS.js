
//document.addEventListener('DOMContentLoaded', function () {
//    //GetProducts();
//});

///* Read Data */
////function GetProducts() {
////    document.getElementById('searchInput').value = '';
////    fetch('/product/GetProducts')
////        .then(response => {
////            if (!response.ok) {
////                throw new Error('Network response was not ok');
////            }
////            return response.json();
////        })
////        .then(data => {
////            let tableBody = document.getElementById('tblBody');
////            tableBody.innerHTML = '';

////            if (!data || data.length === 0) {
////                let row = document.createElement('tr');
////                let cell = document.createElement('td');
////                cell.colSpan = 5;
////                cell.textContent = 'Products not available';
////                row.appendChild(cell);
////                tableBody.appendChild(row);
////            } else {
////                let serialNumber = 0;
////                data.sort((a, b) => ascending ? a.price - b.price : b.price - a.price);

////                data.forEach(item => {
////                    let row = document.createElement('tr');
////                    serialNumber++;
////                    row.innerHTML = `
////                        <td>${serialNumber}</td>
////                        <td>${item.productName}</td>
////                        <td>${item.price}</td>
////                        <td>
////                            <button class="btn btn-primary btn-sm" onclick="Edit(${item.id})">Edit</button>
////                            <button class="btn btn-danger btn-sm" onclick="Delete(${item.id})">Delete</button>
////                            <button class="btn btn-info btn-sm" onclick="ShowDetails(${item.id})">Details</button>
////                        </td>
////                    `;

////                    tableBody.appendChild(row);
////                });
////            }
////        })
////        .catch(error => {
////            alert('Unable to read the data: ' + error.message);
////        });
////}

document.getElementById('btnAdd').addEventListener('click', function () {
    document.getElementById('Id').value = '0';
    document.getElementById('ProductName').value = '';
    document.getElementById('Price').value = '';
    document.getElementById('modalTitle').textContent = 'Add Product';
    document.getElementById('Save').style.display = 'inline';
    document.getElementById('Update').style.display = 'none';
    document.getElementById('Search').value = "";
    new bootstrap.Modal(document.getElementById('ProductModal')).show();
});
/* Insert Data */
function Insert() {
    if (!Validate()) return;

    let formData = new FormData();
    formData.append('Id', document.getElementById('Id').value);
    formData.append('ProductName', document.getElementById('ProductName').value);
    formData.append('Price', document.getElementById('Price').value);
    fetch('/product/Insert', {
        method: 'POST',
        body: formData
    })
        .then(response => response.json())
        .then(data => {
            if (!data) {
                alert('Unable to save the data.');
            } else {
                HideModal();
                location.reload();
                alert(data);
            }
        })
        .catch(error => {
            alert('Unable to save the data: ' + error.message);
        });
}


/* Hide Modal */
function HideModal() {
    let modalElement = document.getElementById('ProductModal');
    let modal = bootstrap.Modal.getInstance(modalElement);
    modal.hide();
    ClearData();
}

function ClearData() {
    document.getElementById('Id').value = '0';
    document.getElementById('ProductName').value = '';
    document.getElementById('Price').value = '';
    document.getElementById('ProductName').style.borderColor = 'lightgrey';
    document.getElementById('Price').style.borderColor = 'lightgrey';
}
function Validate() {
    return new Promise((resolve, reject) => {
        let isValid = true;
        let productName = document.getElementById('ProductName');
        let price = document.getElementById('Price');

        if (productName.value.trim() === "") {
            productName.style.borderColor = 'Red';
            isValid = false;
        } else {
            productName.style.borderColor = 'lightgrey';
        }

        if (price.value.trim() === "") {
            price.style.borderColor = 'Red';
            isValid = false;
        } else {
            price.style.borderColor = 'lightgrey';
        }

        if (isValid) {
            resolve("Validation passed");
        } else {
            reject("Validation failed");
        }
    });
}


document.getElementById('ProductName').addEventListener('change', Validate);
document.getElementById('Price').addEventListener('change', Validate);

/* Edit */
function Edit(id) {
    fetch('/product/Edit?id=' + id)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (!data) {
                alert('Data not available with this id ' + id);
            } else {
                document.getElementById('modalTitle').textContent = 'Update Product';
                document.getElementById('Save').style.display = 'none';
                document.getElementById('Update').style.display = 'inline';
                document.getElementById('Id').value = data.id;
                document.getElementById('ProductName').value = data.productName;
                document.getElementById('Price').value = data.price;
                new bootstrap.Modal(document.getElementById('ProductModal')).show();
            }
        })
        .catch(error => {
            alert('Unable to read the data: ' + error.message);
        });
}

/* Update Data */
function Update() {
    if (!Validate()) return;

    let formData = new FormData();
    formData.append('Id', document.getElementById('Id').value);
    formData.append('ProductName', document.getElementById('ProductName').value);
    formData.append('Price', document.getElementById('Price').value);

    fetch('/product/Update', {
        method: 'POST',
        body: formData
    })
        .then(response => response.json())
        .then(data => {
            if (!data) {
                alert('Unable to save the data.');
            } else {
                alert(data);
                HideModal();
                location.reload();
            }
        })
        .catch(error => {
            alert('Unable to save the data: ' + error.message);
        });
}
/* Details of Product */
function ShowDetails(id) {
    fetch('/product/Details?id=' + id)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (!data) {
                alert('Data not available for this product.');
            } else {
                // Populate the modal with the product details
                document.getElementById('modalTitle').textContent = 'Product Details';
                document.getElementById('Id').value = data.id;
                document.getElementById('ProductName').value = data.productName;
                document.getElementById('Price').value = data.price;

                // Disable fields since this is just a details view
                document.getElementById('ProductName').disabled = true;
                document.getElementById('Price').disabled = true;
                document.getElementById('Save').style.display = 'none';
                document.getElementById('Update').style.display = 'none';

                new bootstrap.Modal(document.getElementById('ProductModal')).show();

                document.getElementById('ProductModal').addEventListener('hidden.bs.modal', function () {
                    document.getElementById('ProductName').disabled = false;
                    document.getElementById('Price').disabled = false;
                    document.getElementById('Save').style.display = 'inline';
                    document.getElementById('Update').style.display = 'none';
                });

                
            }
        })
        .catch(error => {
            alert('Unable to fetch product details: ' + error.message);
        });
}

/*Search product by Name or Price */
//function SearchProducts() {
//    const query = document.getElementById('searchInput').value.trim();

//    if (query === "") {
//        GetProducts();
//        return;
//    }

//    fetch(`/product/Search?query=${encodeURIComponent(query)}`)
//        .then(response => {
//            if (!response.ok) {
//                throw new Error('Network response was not ok');
//            }
//            return response.json();
//        })
//        .then(data => {
//            let tableBody = document.getElementById('tblBody');
//            tableBody.innerHTML = '';

//            if (!data || data.length === 0) {
//                let row = document.createElement('tr');
//                let cell = document.createElement('td');
//                cell.colSpan = 4;
//                cell.textContent = 'No products found';
//                row.appendChild(cell);
//                tableBody.appendChild(row);
//            } else {
//                data.forEach((item, index) => {
//                    let row = document.createElement('tr');
//                    row.innerHTML = `
//                        <td>${index + 1}</td>
//                        <td>${item.productName}</td>
//                        <td>${item.price}</td>
//                        <td>
//                            <button class="btn btn-primary btn-sm" onclick="Edit(${item.id})">Edit</button>
//                            <button class="btn btn-danger btn-sm" onclick="Delete(${item.id})">Delete</button>
//                            <button class="btn btn-info btn-sm" onclick="ShowDetails(${item.id})">Details</button>
//                        </td>
//                    `;
//                    tableBody.appendChild(row);
//                });
//            }
//        })
//        .catch(error => {
//            alert('Unable to search the data: ' + error.message);
//        });
//}

/* Delete Data */
function Delete(id) {
    if (confirm('Are you sure you want to delete this product?')) {
        fetch('/product/Delete?id=' + id, {
            method: 'POST', // In your controller, the Delete method uses [HttpPost]
        })
            .then(response => response.json())
            .then(data => {
                if (!data) {
                    alert('Unable to delete the data.');
                } else {
                    location.reload(); // Refresh the table after deletion
                    alert(data);
                }
            })
            .catch(error => {
                alert('Unable to delete the data: ' + error.message);
            });
    }
}

