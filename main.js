let title = document.getElementById("title");
let price = document.getElementById("price");
let taxes = document.getElementById("taxes");
let ads = document.getElementById("ads");
let discount = document.getElementById("discount");
let total = document.getElementById("total");
let count = document.getElementById("count");
let category = document.getElementById("category");
let createButton = document.getElementById("submit");
let btnDeleteAll = document.getElementById("deleteAll");
let search = document.getElementById("search");

let mood = "create";
let temp; //    متغير وهمي بساويه باي متغير تاني علشان لو عايز استخدم المتغيير ده بره الفانكشن اللي هو متعرف فيها

// Get Total Price
function calculateTotalPrice() {
  let result = +price.value + +taxes.value + +ads.value - +discount.value;
  return result;
}

function updateTotalPriceDisplay(totalPrice) {
  total.innerHTML = totalPrice;
}

function checkAndCalculatePrice() {
  if (price.value != "") {
    let total = calculateTotalPrice();
    updateTotalPriceDisplay(total);
  } else {
    updateTotalPriceDisplay("");
  }
}

function getTotalPrice() {
  checkAndCalculatePrice();
}

// Create Product
let productData;
if (localStorage.product != null) {
  productData = JSON.parse(localStorage.product);
} else {
  productData = [];
}

createButton.onclick = function () {
  let newProduct = {
    title: title.value.toLowerCase(),
    price: price.value,
    taxes: taxes.value,
    ads: ads.value,
    discount: discount.value,
    total: total.innerHTML,
    count: count.value,
    category: category.value.toLowerCase(),
  };

  if (
    title.value != "" &&
    price.value != "" &&
    category.value != "" &&
    newProduct.count < 100
  ) {
    if (mood === "create") {
      if (newProduct.count > 1) {
        for (let i = 0; i < newProduct.count; i++) {
          productData.push(newProduct);
        }
      } else {
        productData.push(newProduct);
      }
    } else {
      productData[temp] = newProduct;
      mood = "create";
      createButton.innerHTML = "Create";
      count.style.display = "block";
    }
    clearData();
  }

  localStorage.setItem("product", JSON.stringify(productData));

  showData();
};

// Clear Inputs
function clearData() {
  title.value = "";
  price.value = "";
  taxes.value = "";
  ads.value = "";
  discount.value = "";
  total.innerHTML = "";
  count.value = "";
  category.value = "";
}

// Read Data
function showData() {
  let table = "";
  for (let i = 0; i < productData.length; i++) {
    table += `
    <tr>
        <td>${i+1}</td>
        <td>${productData[i].title}</td>
        <td>${productData[i].price}</td>
        <td>${productData[i].taxes}</td>
        <td>${productData[i].ads}</td>
        <td>${productData[i].discount}</td>
        <td>${productData[i].total}</td>
        <td>${productData[i].category}</td>
        <td class="edit-buttons">
          <button onclick="updateData(${i})" id="update">Update</button>
          <button onclick="deleteOneProduct(${i})" id="delete">Delete</button>
        </td>
    </tr>
    `;
  }

  document.getElementById("tbody").innerHTML = table;
  checkIfDataInArray();
}
showData();

// Delete All Products
function checkIfDataInArray() {
  if (productData.length > 0) {
    btnDeleteAll.innerHTML = `
    <button onclick="deleteAllProducts()">Delete All</button>
    `;
  } else {
    btnDeleteAll.innerHTML = "";
  }
}

function deleteAllProducts() {
  localStorage.clear();
  productData.splice(0);
  showData();
}

// Delete One Product
function deleteOneProduct(i) {
  productData.splice(i, 1);
  localStorage.product = JSON.stringify(productData);
  showData();
}

// Update Data
function updateData(i) {
  title.value = productData[i].title;
  price.value = productData[i].price;
  taxes.value = productData[i].taxes;
  ads.value = productData[i].ads;
  discount.value = productData[i].discount;
  total.innerHTML = productData[i].total;
  count.value = productData[i].count;
  category.value = productData[i].category;
  createButton.innerHTML = "Update";
  mood = "update";
  temp = i;
  count.style.display = "none";
  scroll({
    top: 0,
    behavior: "smooth",
  });
}

// Search
let searchMood = "title";

function getSearchMood(id) {
  if (id === "search-title") {
    searchMood = "title";
  } else {
    searchMood = "category";
  }
  search.placeholder = "Search By " + searchMood;
  search.focus();
  search.value = "";
  showData();
}

function searchProduct(value) {
  let table = "";
  value = value.toLowerCase();

  for (let i = 0; i < productData.length; i++) {
    let searchField =
      searchMood === "title" ? productData[i].title : productData[i].category;
    if (searchField.toLowerCase().includes(value)) {
      table += `
        <tr>
            <td>${i}</td>
            <td>${productData[i].title}</td>
            <td>${productData[i].price}</td>
            <td>${productData[i].taxes}</td>
            <td>${productData[i].ads}</td>
            <td>${productData[i].discount}</td>
            <td>${productData[i].total}</td>
            <td>${productData[i].category}</td>
            <td class="edit-buttons">
              <button onclick="updateData(${i})" id="update">Update</button>
              <button onclick="deleteOneProduct(${i})" id="delete">Delete</button>
            </td>
        </tr>
      `;
    }
  }

  document.getElementById("tbody").innerHTML = table;
}
