function saveCandiesToLocal(candies) {
  localStorage.setItem('candies', JSON.stringify(candies));
}

function getCandiesFromLocal() {
  const storedCandies = localStorage.getItem('candies');
  return storedCandies ? JSON.parse(storedCandies) : [];
}

function displayCandiesOnScreen(candies) {
  const parentElem = document.getElementById('listofitems');
  parentElem.innerHTML = '';

  for (const candy of candies) {
    showCandyOnScreen(candy);
  }
}

window.addEventListener("DOMContentLoaded", () => {
  const storedCandies = getCandiesFromLocal();

  if (storedCandies.length > 0) {
    displayCandiesOnScreen(storedCandies);
  } else {
    axios.get('https://crudcrud.com/api/a59a1885905d48fbb87a34a8eb8fd5a3/candy')
      .then((res) => {
        console.log(res);
        const candies = res.data.filter(candy => candy.quantity && candy.candyName && candy.description && candy.price);
        saveCandiesToLocal(candies);
        displayCandiesOnScreen(candies);
      })
      .catch((err) => {
        document.body.innerHTML = document.body.innerHTML + "<h4> ERROR!</h4>";
        console.log(err);
      });
  }
});

function updateCandiesInLocal(candies) {
  saveCandiesToLocal(candies);
}

function addToStock(event) {
  event.preventDefault();
  const candyName = event.target.candyName.value;
  const description = event.target.description.value;
  const price = event.target.price.value;
  const quantity = event.target.quantity.value;

  const candyObject = {
    candyName,
    description,
    price,
    quantity
  };

  axios.post('https://crudcrud.com/api/a59a1885905d48fbb87a34a8eb8fd5a3/candy', candyObject, {
    headers: {
      'Content-Type': 'application/json',
    }
  })
  .then((res) => {
    const candies = getCandiesFromLocal();
    candies.push(res.data);
    updateCandiesInLocal(candies);
    showCandyOnScreen(res.data);
    console.log(res);
  })
  .catch((err) => {
    document.body.innerHTML = document.body.innerHTML + "<h4> ERROR!</h4>";
    console.log(err);
  });

  event.target.reset();
}

function showCandyOnScreen(candy) {
  const parentElem = document.getElementById('listofitems');
  const childElem = document.createElement('li');
  childElem.className = 'list-group-item';

  const candyName = candy.candyName ? candy.candyName : "Undefined";
  const description = candy.description ? candy.description : "Undefined";
  const price = candy.price ? candy.price : "Undefined";
  const quantity = candy.quantity ? candy.quantity : "Undefined";

  childElem.textContent = `${candyName} - ${description} - ${price} - ${quantity}`;

  const buy1Button = createBuyButton(candy, 1);
  const buy2Button = createBuyButton(candy, 2);
  const buy3Button = createBuyButton(candy, 3);

  childElem.appendChild(buy1Button);
  childElem.appendChild(buy2Button);
  childElem.appendChild(buy3Button);

  parentElem.appendChild(childElem);
}

function createBuyButton(candy, quantity) {
  const buyButton = document.createElement('button');
  buyButton.textContent = `Buy ${quantity}`;
  buyButton.addEventListener('click', () => {
    handleBuy(candy, quantity);
  });
  return buyButton;
}

function handleBuy(candy, quantity) {
  if (candy.quantity >= quantity) {
    candy.quantity -= quantity;
    updateQuantityOnServer(candy._id, candy.quantity, candy.candyName, candy.description, candy.price);
    updateQuantityOnScreen(candy);
  } else {
    console.log("Error: Insufficient quantity!");
  }
}

function updateQuantityOnServer(candyId, newQuantity, candyName, description, price) {
  axios.put(`https://crudcrud.com/api/a59a1885905d48fbb87a34a8eb8fd5a3/candy/${candyId}`, {
    candyName: candyName,
    description: description,
    price: price,
    quantity: newQuantity
  })
  .then((res) => {
    console.log(res);
  })
  .catch((err) => {
    console.log(err);
  });
}

function updateQuantityOnScreen(candy) {
  const itemList = document.getElementById('listofitems');
  const candyElement = Array.from(itemList.children).find(elem => elem.textContent.includes(candy.candyName));
  candyElement.textContent = `${candy.candyName} - ${candy.description} - ${candy.price} - ${candy.quantity}`;

  const buy1Button = createBuyButton(candy, 1);
  const buy2Button = createBuyButton(candy, 2);
  const buy3Button = createBuyButton(candy, 3);

  candyElement.appendChild(buy1Button);
  candyElement.appendChild(buy2Button);
  candyElement.appendChild(buy3Button);
}