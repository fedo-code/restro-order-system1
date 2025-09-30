
$(function () {
  //  Nav link click: run JS + collapse after short delay
  $('#collapsable-nav').on('click touchend', 'a', function (e) {
    e.preventDefault();

    var $link = $(this);
    var isMenu = $link.is('[onclick*="loadMenuCategories"]');
    var isAbout = $link.is('[onclick*="loadAbout"]');
    var href = $link.attr('href');

    // Collapse menu after small delay
    setTimeout(function () {
      $('#collapsable-nav').collapse('hide');
    }, 30);

    // Load correct section after collapse
    $('#collapsable-nav').one('hidden.bs.collapse', function () {
      if (isMenu) {
        $dc.loadMenuCategories();
      } else if (isAbout) {
        $dc.loadAbout();
         }
           

       else if (href && href !== '#') {
        event.preventDefault();                 
    history.pushState({}, '', href);        
    const route = href.slice(1);           
    handleRoute(route);         
      }
    });
  });

  //  Tap outside of menu to auto-collapse
  $(document).on('click touchend', function (e) {
    
    if ($(e.target).closest('#collapsable-nav, #navbarToggle').length === 0) {
      $('#collapsable-nav').collapse('hide');
    }
  });
});




(function (global) {
  var dc = {};

  var homeHtml = "/snippets/home-snippet.html";
  var allCategoriesUrl =
    "https://coursera-jhu-default-rtdb.firebaseio.com/categories.json";
  var categoriesTitleHtml = "snippets/categories-title-snippet.html";
  var categoryHtml = "snippets/category-snippet.html";
  var menuItemsUrl =
    "https://coursera-jhu-default-rtdb.firebaseio.com/menu_items/";
  //var menuItemsTitleHtml = "snippets/menu-items-title.html";
  var menuItemHtml = "/snippets/menu-item.html";
    var menuItemsTitleHtml = "/snippets/menu-items-title.html";

   var snippet = "/snippets/paySnpt.html";
  // Convenience function for inserting innerHTML for 'select'
  var insertHtml = function (selector, html) {
    var targetElem = document.querySelector(selector);
    targetElem.innerHTML = html;
  };

  // Show loading icon inside element identified by 'selector'.
  var showLoading = function (selector) {
    var html = "<div class='text-center'>";
    //html += "<img src='images/ajax-loader.gif'></div>";
    html += "<img src='/images/ajax-loader.gif'></div>";
    insertHtml(selector, html);
  };

  // Return substitute of '{{propName}}'
  // with propValue in given 'string'
  var insertProperty = function (string, propName, propValue) {
    var propToReplace = "{{" + propName + "}}";
    string = string.replace(new RegExp(propToReplace, "g"), propValue);
    return string;
  };

  function setActive(navId) {
  // Pehle sab se 'active' hatao
  document.querySelectorAll("#navHomeButton, #navMenuButton, #navAboutButton")
    .forEach(btn => btn.classList.remove("active"));

  // Fir selected button pe 'active' lagao
  const target = document.querySelector(navId);
  if (target) {
    target.classList.add("active");
  }
}


  //var switchHomeToActive = function () {
  // Remove 'active' from menu button
  //var classes = document.querySelector("#navMenuButton").className;
  //classes = classes.replace(new RegExp("active", "g"), "");
 // document.querySelector("#navMenuButton").className = classes;

  // Add 'active' to home button if not already there
  //classes = document.querySelector("#navHomeButton").className;
 // if (classes.indexOf("active") === -1) {
  //  classes += " active";
  //  document.querySelector("#navHomeButton").className = classes;
  //}
//};


  // Remove the class 'active' from home and switch to Menu button
  //var switchMenuToActive = function () {
    // Remove 'active' from home button
    //var classes = document.querySelector("#navHomeButton").className;
    //classes = classes.replace(new RegExp("active", "g"), "");
   // document.querySelector("#navHomeButton").className = classes;

    // Add 'active' to menu button if not already there
    //classes = document.querySelector("#navMenuButton").className;
   // if (classes.indexOf("active") == -1) {
    //  classes += " active";
    //  document.querySelector("#navMenuButton").className = classes;
   // }
  //};

  dc.loadHome = function () {
      showLoading("#main-content");
    $ajaxUtils.sendGetRequest(
      homeHtml,
      function (responseText) {
        document.querySelector("#main-content").innerHTML = responseText;
       setActive("#navHomeButton");
    },
      false
    )};
  

  // Load the menu categories view
  dc.loadMenuCategories = function () { 
    setActive("#navMenuButton");
    showLoading("#main-content");

    $ajaxUtils.sendGetRequest(allCategoriesUrl, buildAndShowCategoriesHTML);
  };

  //Load the About of Restaurant view
  dc.loadAbout=function(){
   setActive("#navAboutButton");
   // showLoading("#main-content");
    fetch("/api/about")
    .then(res => res.json())
    .then(data => {
      document.getElementById("main-content").innerHTML = `
        <h2>About Us</h2>
        <div style="white-space: pre-wrap;">${data.description}</div>
        
        
      `;
       
    });
  };

  // Load the menu items view
  // 'categoryShort' is a short_name for a category
 dc.loadMenuItems = function (categoryShort) {
  console.log(" loadMenuItems started for:", categoryShort);
 setActive("#navMenuButton");
  showLoading("#main-content");
  setTimeout(function () {
    $ajaxUtils.sendGetRequest(
      menuItemsUrl + categoryShort + ".json",
      buildAndShowMenuItemsHTML
    );
  }, 200);
};
   //loadPay

  dc.loadPay = function(c_name, s_name, s_price, l_price) {
  console.log(" loadPay called with:", c_name, s_name, s_price, l_price); 

  showLoading("#main-content"); 

  var snippet = "/snippets/paySnpt.html";

  $ajaxUtils.sendGetRequest(snippet, function(snippet) {
    var PayView = buildPayHtml(snippet, c_name, s_name, s_price, l_price);

    insertHtml("#main-content", PayView);

    
   

  }, false);
};



  // Builds HTML for the categories page based on the data
  // from the server
function buildAndShowCategoriesHTML(categories) {
    // Load title snippet of categories page
    $ajaxUtils.sendGetRequest(
      categoriesTitleHtml,
      function (categoriesTitleHtml) {
        // Retrieve single category snippet
        $ajaxUtils.sendGetRequest(
          categoryHtml,
          function (categoryHtml) {
            // Switch CSS class active to menu button  
            //setActive("#navHomeButton");

            var categoriesViewHtml = buildCategoriesViewHtml(
              categories,
              categoriesTitleHtml,
              categoryHtml
            );
            insertHtml("#main-content", categoriesViewHtml);


          },
          false
        );
      },
      false
    );
  }

  // Using categories data and snippets html
  // build categories view HTML to be inserted into page
  function buildCategoriesViewHtml(
    categories,
    categoriesTitleHtml,
    categoryHtml
  ) {
    var finalHtml = categoriesTitleHtml;
    finalHtml += "<section class='row'>";

    // Loop over categories
    for (var i = 0; i < categories.length; i++) {
      // Insert category values
      var html = categoryHtml;
      var name = "" + categories[i].name;
      var short_name = categories[i].short_name;
      html = insertProperty(html, "name", name);
      html = insertProperty(html, "short_name", short_name);
      finalHtml += html;
    }

    finalHtml += "</section>";
    return finalHtml;
  }

  // Builds HTML for the single category page based on the data
  // from the server
  function buildAndShowMenuItemsHTML(categoryMenuItems) {
    // Load title snippet of menu items page
    $ajaxUtils.sendGetRequest(
      menuItemsTitleHtml,
      function (menuItemsTitleHtml) {
        // Retrieve single menu item snippet
        $ajaxUtils.sendGetRequest(
          menuItemHtml,
          function (menuItemHtml) {
            // Switch CSS class active to menu button
            //setActive("#navHomeButton");

            var menuItemsViewHtml = buildMenuItemsViewHtml(
              categoryMenuItems,
              menuItemsTitleHtml,
              menuItemHtml
            );
            insertHtml("#main-content", menuItemsViewHtml);
          },
          false
        );
      },
      false
    );
  }

  // Using category and menu items data and snippets html
  // build menu items view HTML to be inserted into page
  function buildMenuItemsViewHtml(
    categoryMenuItems,
    menuItemsTitleHtml,
    menuItemHtml
  ) {
    menuItemsTitleHtml = insertProperty(
      menuItemsTitleHtml,
      "name",
      categoryMenuItems.category.name
    );
    menuItemsTitleHtml = insertProperty(
      menuItemsTitleHtml,
      "special_instructions",
      categoryMenuItems.category.special_instructions
    );

    var finalHtml = menuItemsTitleHtml;
    finalHtml += "<section class='row'>";

    // Loop over menu items
    var menuItems = categoryMenuItems.menu_items;
    var catShortName = categoryMenuItems.category.short_name;
    for (var i = 0; i < menuItems.length; i++) {
      // Insert menu item values
      var html = menuItemHtml;
      html = insertProperty(html, "short_name", menuItems[i].short_name);
      html = insertProperty(html, "catShortName", catShortName);
      html = insertItemPrice(html, "price_small", menuItems[i].price_small);
      html = insertItemPortionName(
        html,
        "small_portion_name",
        menuItems[i].small_portion_name
      );
      html = insertItemPrice(html, "price_large", menuItems[i].price_large);
      html = insertItemPortionName(
        html,
        "large_portion_name",
        menuItems[i].large_portion_name
      );
      html = insertProperty(html, "name", menuItems[i].name);
      html = insertProperty(html, "description", menuItems[i].description);

      // Add clearfix after every second menu item
      if (i % 2 != 0) {
        html +=
          "<div class='clearfix visible-lg-block visible-md-block'></div>";
      }

      finalHtml += html;
    }

    finalHtml += "</section>";
    return finalHtml;
  }
  // Appends price with '$' if price exists

  // Appends price with '$' if price exists

function insertItemPrice(html, pricePropName, priceValue) {
  console.log(" Before insertProperty");
  console.log("pricePropName:", pricePropName);
  console.log("Original priceValue:", priceValue);
  console.log("Original snippet HTML:\n", html);

  // Agar price invalid hai to pura {{#if ...}} block hata do
  if (!priceValue || isNaN(parseFloat(priceValue))) {
    console.log(" Invalid priceValue detected:", priceValue);
    // Regex: {{#if price_small}} ... {{/if}} 
    let blockRegex = new RegExp("{{#if " + pricePropName + "}}[\\s\\S]*?{{/if}}", "g");
    html = html.replace(blockRegex, "");
    return insertProperty(html, pricePropName, "");
  }

  // Agar price valid hai -> value format karo
  priceValue = "$" + parseFloat(priceValue).toFixed(2);
  console.log(" Formatted priceValue:", priceValue);

  //  Block ke andar replace karo
  let blockRegex = new RegExp("{{#if " + pricePropName + "}}([\\s\\S]*?){{/if}}", "g");
  html = html.replace(blockRegex, "$1"); // sirf inner part rakho

  //  Ab normal {{price_small}} replace karo
  html = insertProperty(html, pricePropName, priceValue);

  console.log(" After insertProperty, updated HTML:\n", html);
  return html;
}



  // Appends portion name in parens if it exists
  function insertItemPortionName(html, portionPropName, portionValue) {
    // If not specified, return original string
    if (!portionValue) {
      return insertProperty(html, portionPropName, "");
    }

    portionValue = "(" + portionValue + ")";
    html = insertProperty(html, portionPropName, portionValue);
    return html;
  }


  //code for buy an item or pay

  
function buildPayHtml(snippet, c_name, s_name, s_price, l_price) {
  snippet = insertProperty(snippet, "name", c_name);
  snippet = insertProperty(snippet, "short_name", s_name);
   snippet = insertItemPrice(snippet, "price_small", parseFloat(s_price.toString().replace('$', '')));
snippet = insertItemPrice(snippet, "price_large", parseFloat(l_price.toString().replace('$', '')));

  return snippet;
}


//setPrice config to automatic value into input

 let selectedAmountInPaisa = 0;

  // Fix setPrice function
dc.setPrice = function(dollarValue) {
  console.log("Received price:", dollarValue);
  
  // Better value cleaning
  const cleanValue = String(dollarValue).replace(/[^0-9.]/g, '');
  const usd = parseFloat(cleanValue);
  
  if (isNaN(usd)) {
    console.error("Invalid price:", dollarValue);
    alert("Please select a valid size");
    return;
  }

  const conversionRate = 83.5;
  selectedAmountInPaisa = Math.round(usd * conversionRate * 100);
  
  const priceInput = document.getElementById("price");
  if (priceInput) {
    priceInput.value = (usd * conversionRate).toFixed(2);
    console.log("Amount set to:", priceInput.value);
  }
};

// Updated payNow function with better error handling
// Razorpay load 
function loadRazorpay() {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve();
    
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.setAttribute('data-no-block', 'true'); // Brave ke liye special
    script.onload = resolve;
    document.head.appendChild(script);
  });
}

// Updated payNow function
async function payNow() {
  const payBtn = document.getElementById('pay-btn');
  try {
    payBtn.disabled = true;
    payBtn.textContent = 'Processing...';

    await loadRazorpay();

    //  Use the correct cart total in paisa
    const amount = window.selectedAmountInPaisa;
    if(!amount || amount <= 0){
      alert("Cart is empty or invalid amount!");
      return;
    }

    const order = await fetch('/api/create-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount }) 
    }).then(r => r.json());

    const options = {
      key: 'rzp_test_1DP5mmOlF5G5ag',
      amount: order.amount,
      currency: 'INR',
      name: 'Global graceful Kitchen',
      description: 'Food Order',
      handler: function(response) {
        alert(`Payment successful! ID: ${response.razorpay_payment_id}`);
      },
      notes: {
        merchant_order_id: order.id
      }
    };

    const rzp = new Razorpay(options);
    rzp.open();

  } catch (error) {
    alert(`Error: ${error.message}`);
  } finally {
    payBtn.disabled = false;
    payBtn.textContent = 'Pay Now';
  }
}


  global.$dc = dc;

  global.payNow = payNow;
})(window);
//  SPA ROUTER ADDITION STARTS HERE 

//  GLOBAL CLICK HANDLER for navbar + content links
document.addEventListener("click", function (e) {
  const target = e.target.closest("a");

  if (
    target &&
    target.tagName === "A" &&
    target.getAttribute("href")?.startsWith("/") &&
    !target.hasAttribute("download") &&
    target.getAttribute("target") !== "_blank"
  ) {
    e.preventDefault();

    const route = target.getAttribute("href").slice(1); // "/menu" => "menu"
    history.pushState({}, "", `/${route}`);
    handleRoute(route);
  }
});

//  Route rendering logic
function handleRoute(route) {
  const parts = route.split("/");
  const base = parts[0];
  const catShort = parts[1];

  switch (base) {
    case "":
    case "home":
      $dc.loadHome();
      break;
    case "menu":
      if (catShort) {
        $dc.loadMenuItems(catShort);
      } else {
        $dc.loadMenuCategories();
      }
      break;
    case "about":
      $dc.loadAbout();
      break;
    case "pay":
      const cname = decodeURIComponent(parts[1] || "Unknown").replace(/%20/g, ' ');
      const sname = decodeURIComponent(parts[2] || "?").replace(/%20/g, ' ');
      const sprice = decodeURIComponent(parts[3] || 0);
      const lprice = decodeURIComponent(parts[4] || 0);
      $dc.loadPay(cname, sname, sprice, lprice);
      break;
    default:
      document.querySelector("#main-content").innerHTML =
        "<h2>404 - Page Not Found</h2>";
  }
}


//  Handle back/forward button (SPA navigation)
window.onpopstate = function () {
  const route = window.location.pathname.slice(1);
  handleRoute(route);
};
 
//  Load initial route on first load
window.addEventListener("DOMContentLoaded", function () {
  const initialRoute = window.location.pathname.slice(1) || "home";
  handleRoute(initialRoute);
});

//  SPA Trigger helper function for Pay page
function goToPay(name, short_name, price_small, price_large) {
  const sPriceEncoded = encodeURIComponent(price_small);
  const lPriceEncoded = encodeURIComponent(price_large);
  //const route = `pay/${name}/${short_name}/${sPriceEncoded}/${lPriceEncoded}`;
   const route = `pay/${encodeURIComponent(name)}/${encodeURIComponent(short_name)}/${sPriceEncoded}/${lPriceEncoded}`;

  history.pushState({}, "", "/" + route);
 
 //for removing unwanted form name
  
  handleRoute(route);

}

let cart = JSON.parse(localStorage.getItem("cart") || "[]");
const usdToInr = 83;

function showToast(message) {
  const toast = document.getElementById("cart-toast");
  toast.innerText = message;
  toast.style.display = "block";
  setTimeout(() => {
    toast.style.display = "none";
  }, 2000);
}

function updateCartCount(){ 
  document.getElementById("cart-count").innerText = cart.reduce((a,b)=>a+b.qty,0);
}
updateCartCount();

function openCart(e){ 
  if(e){
    e.preventDefault();     // ✅ Anchor ka default jump block karega
    e.stopPropagation();    // ✅ Bootstrap collapse close hone se rokega
  }
  document.getElementById("cart-overlay").style.display = "block"; 
  renderCart();
}

function closeCart(){ 
  document.getElementById("cart-overlay").style.display="none";
}
window.closeCart = closeCart;  // ✅ Close button ke liye global

document.addEventListener("click", function(e){
  // ✅ Add to cart button
  if(e.target.classList.contains("add-btn")){
    const shortName = e.target.dataset.short;
    const name = e.target.dataset.name;

    const selectedRadio = document.querySelector(`input[name='size-${shortName}']:checked`);
    if(!selectedRadio){
      alert("Please select a size before adding!");
      return;
    }
     
    const size = selectedRadio.value;
    const rawPrice = selectedRadio.dataset.price;

    let price = 0;
    if (rawPrice && !isNaN(parseFloat(rawPrice.replace(/[^0-9.]/g, "")))) {
      price = parseFloat(rawPrice.replace(/[^0-9.]/g, ""));
    } else {
      alert("Price not found! Please check data-price attribute in HTML.");
      return;
    }

    let existing = cart.find(i => i.shortName === shortName && i.size === size);
    if(existing){
      existing.qty++;
      if (!existing.price || isNaN(existing.price)) {
        existing.price = price;
      }
    } else {
      const newItem = { shortName, name, size, price, qty: 1 };
      cart.push(newItem);
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
    showToast(`${name} (${size}) added to cart!`);
  }

  // ✅ Quantity increase/decrease buttons
  if(e.target.classList.contains("inc-btn"))
    changeQty(e.target.dataset.short, e.target.dataset.size, 1);

  if(e.target.classList.contains("dec-btn"))
    changeQty(e.target.dataset.short, e.target.dataset.size, -1);
});

function changeQty(shortName,size,delta){
  let item = cart.find(i=>i.shortName===shortName && i.size===size);
  if(!item) return;
  item.qty += delta;
  if(item.qty<=0) cart = cart.filter(i=>!(i.shortName===shortName && i.size===size));
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
  renderCart();
}

function renderCart(){
  const cartList = document.getElementById("cart-items");
  cartList.innerHTML="";
  let totalUsd = 0;
  if(cart.length===0){ 
    cartList.innerHTML="<li>Your cart is empty</li>"; 
  }
  else{
    cart.forEach(item=>{
      const li=document.createElement("li");
      li.innerHTML=`${item.name} (${item.size}) x ${item.qty} = $${(item.price*item.qty).toFixed(2)}
        <button class="btn btn-danger btn-xs dec-btn" data-short="${item.shortName}" data-size="${item.size}">-</button>
        <button class="btn btn-primary btn-xs inc-btn" data-short="${item.shortName}" data-size="${item.size}">+</button>`;
      cartList.appendChild(li);
      totalUsd += item.price*item.qty;
    });
  }

  // ✅ Update totals
  document.getElementById("total-usd").innerText = totalUsd.toFixed(2);
  document.getElementById("total-inr").innerText = (totalUsd * usdToInr).toFixed(0);

  // ✅ Store paisa value globally for Razorpay
  window.selectedAmountInPaisa = Math.round(totalUsd * usdToInr * 100);

  // ✅ Pay button inject only if cart not empty
  const payDivContainer = document.getElementById("pay-btn-container");
  if(cart.length > 0){
    payDivContainer.innerHTML = `
      <button id="pay-btn" class="btn btn-primary mt-3" onclick="payNow()">Pay Now</button>
    `;
  } else {
    payDivContainer.innerHTML = "";
  }
}

document.addEventListener("DOMContentLoaded", function () {
  const cartBtn = document.getElementById("cartBtn");

  // ✅ Click + Touch dono add karo
  ["click", "touchstart"].forEach(evt => {
    cartBtn.addEventListener(evt, openCart, false);
  });
});
