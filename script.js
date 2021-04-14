const cartItem = '.cart__items';

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

function cartItemClickListener(event) {
  const cartList = document.querySelector(cartItem);
  cartList.removeChild(event.target);
  const array = event.target.innerText.split(' | ');
  localStorage.removeItem(array[0]);
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  localStorage.setItem(`SKU: ${sku}`, `${li.innerText}`);
  return li;
}

async function fetchML() {
  const response = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador',
    { method: 'GET' });
  const json = await response.json();
  const father = document.querySelector('.list');
  const li = document.createElement('li');
  li.className = 'loading';
  li.innerText = 'loading...';
  father.appendChild(li);
  return json.results;
}

async function fetchItem(id) {
  const response = await fetch(`https://api.mercadolibre.com/items/${id}`,
    { method: 'GET' });
  const json = await response.json();
  return json;
}

const addToCart = () => {
  document.querySelectorAll('.item__add').forEach((elem) => {
    elem.addEventListener('click', (event) => {
      const firstSibling = event.target.parentNode.firstChild;
      fetchItem(firstSibling.innerText).then((result2) => {
        const father = document.querySelector(cartItem);
        const child = createCartItemElement({
          sku: result2.id,
          name: result2.title,
          salePrice: result2.price,
        });
        father.appendChild(child);
      });
    });
  });
};

const loadStorage = () => {
  console.log(localStorage);
  const items = Object.values(localStorage);
  return items;  
};

// REVER A IMPLEMENTAÇÃO - no carregamento a ordem está diferente
const populateFromStorage = (array) => {
  const father = document.querySelector(cartItem);
  array.forEach((element) => {
    console.log(element);
    const li = document.createElement('li');
    li.className = 'cart__item';
    li.innerText = `${element}`;
    li.addEventListener('click', cartItemClickListener);
    father.appendChild(li);
  });
};

const clearCart = () => {
  document.querySelector(cartItem).innerHTML = '';
  localStorage.clear();
};

const populateList = (param) => {
  const father = document.querySelector('.items');
  param.forEach((element) => {
    const child = createProductItemElement({
      sku: element.id,
      name: element.title,
      image: element.thumbnail,
    });
    father.appendChild(child);
  });
};

window.onload = function onload() {
  fetchML()
    .then((result) => {
      populateList(result);
      addToCart();
    });
  const father = document.querySelector('.list');
  father.classList = 'hide';
  const child = document.querySelector('.loading');
  father.removeChild(child);
  if (localStorage) {
    populateFromStorage(loadStorage());
  }
  document.querySelector('.empty-cart').addEventListener('click', clearCart);
};
