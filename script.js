//PASSO A PASSO
//1 - clona estrutura html
//2 - joga os dados
//3 - joga na tela

//INITIAL DATA
let cart = [];
let modalQt = 1;
let modalKey = 0;

const c = (el) => document.querySelector(el);
const cs = (el) => document.querySelectorAll(el);

//LISTAGEM DAS PIZZAS ABERTAS OU MODAL
pizzaJson.map((pizza, index) => {
  //clones dos modelos html
  let pizzaItem = c(".models .pizza-item").cloneNode(true);

  //armazenar chave em cada pizza
  pizzaItem.setAttribute("data-key", index);
  pizzaItem.querySelector(".pizza-item--img img").src = pizza.img;
  pizzaItem.querySelector(".pizza-item--name").innerHTML = pizza.name;
  pizzaItem.querySelector(
    ".pizza-item--price"
  ).innerHTML = `R$ ${pizza.price.toFixed(2)}`; //2 alg depois da virgula, caso nao tenha centavos
  pizzaItem.querySelector(".pizza-item--desc").innerHTML = pizza.description;

  //evento de pizza clicada
  pizzaItem.querySelector("a").addEventListener("click", (e) => {
    e.preventDefault();
    //sempre que abrir modal, zera qt
    modalQt = 1;
    //closest procura el mais proximo com essa class
    let key = e.target.closest(".pizza-item").getAttribute("data-key");
    modalKey = key;

    //INSERÇÃO HTML MODAL
    c(".pizzaBig img").src = pizzaJson[key].img;
    c(".pizzaInfo h1").innerHTML = pizzaJson[key].name;
    c(".pizzaInfo--desc").innerHTML = pizzaJson[key].description;
    c(".pizzaInfo--actualPrice").innerHTML = pizzaJson[key].price.toFixed(2);
    //SIZES
    //REMOVE PRE-SELECTED caso a pessoa clique em um tamanho e pule para outra pizza
    c(".pizzaInfo--size.selected").classList.remove("selected");
    cs(".pizzaInfo--size").forEach((size, sizeIndex) => {
      //sempre que abrir uma pizza, grande será o tamanho PRE-SELECTED
      if (sizeIndex == 2) {
        size.classList.add("selected");
      }
      //pizza clicada //medidas //cada medida jogada dentro de span conectando sizeIndex(n sizes), consequentemente jogando em n spans que estao dentro das sizes
      size.querySelector("span").innerHTML = pizzaJson[key].sizes[sizeIndex];
    });

    //quantidade pizza
    c(".pizzaInfo--qt").innerHTML = modalQt;

    //animação modal
    c(".pizzaWindowArea").style.opacity = 0;
    c(".pizzaWindowArea").style.display = "flex";
    setTimeout(() => {
      c(".pizzaWindowArea").style.opacity = 1;
    }, 200);
  });

  //append add models de pizza sem remover content de pizza-area
  c(".pizza-area").append(pizzaItem);
});

//EVENTOS DO MODAL
const closeModal = () => {
  c(".pizzaWindowArea").style.opacity = 0;
  setTimeout(() => {
    c(".pizzaWindowArea").style.display = "none";
  }, 500);
};

cs(".pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton").forEach(
  (button) => button.addEventListener("click", closeModal)
);
c(".pizzaInfo--qtmenos").addEventListener("click", () => {
  if (modalQt > 1) {
    modalQt--;
    c(".pizzaInfo--qt").innerHTML = modalQt;
  }
});
c(".pizzaInfo--qtmais").addEventListener("click", () => {
  modalQt++;
  c(".pizzaInfo--qt").innerHTML = modalQt;
});
cs(".pizzaInfo--size").forEach((size, sizeIndex) => {
  size.addEventListener("click", () => {
    c(".pizzaInfo--size.selected").classList.remove("selected");
    size.classList.add("selected");
  });
});

/////carrinho
c(".pizzaInfo--addButton").addEventListener("click", () => {
  //Qual a pizza? modalKey
  //Qual o tamanho? size
  //Quantas pizzas? modalQt
  let size = parseInt(c(".pizzaInfo--size.selected").getAttribute("data-key"));

  //caso id e size já estejam em cart, não deve 'criar outro objeto'
  let identifier = pizzaJson[modalKey].id + "@" + size;
  let key = cart.findIndex(
    (item) =>
      //verifica quais IDENTIFIERCART são iguais ao IDENTIFIERTARGET
      item.identifier == identifier
    //se achar, RETORNA O INDEX, caso contrário, RETORNA -1
  );
  //CLICOU PRA ADICIONAR : SALVA INFOS NO CART
  //SE IDENTIFIER = -1 (MESMA PIZZA E TAMANHO)
  if (key > -1) {
    //QUANTIDADE(Q) do ITEM ESPECÍFICO(KEY) no carrinho + quantidade atual
    cart[key].qt += modalQt;
  } else {
    cart.push({
      identifier,
      id: pizzaJson[modalKey].id,
      size,
      qt: modalQt,
    });
  }
  uptadeCart();
  closeModal();
  console.log(cart);
});

const uptadeCart = () => {
  //se TEM ITEM no CARRINHO
  if (cart.length > 0) {
    //MOSTRA O CARRINHO
    c("aside").classList.add("show");
    //ZERA O CARRINHO(memoria anterior de cart), só joga o CART ATUAL(memoria atual de cart)
    c(".cart").innerHTML = "";

    //
    let subtotal = 0;
    let desconto = 0;
    let total = 0;
    //CONEXAO PIZZAJSONID com CARTID
    for (let i in cart) {
      let pizzaItem = pizzaJson.find((item) => item.id == cart[i].id);
      //PIZZAITEM = TODA PIZZAJSON com IDJSON = IDEACHCART

      //
      subtotal += pizzaItem.price * cart[i].qt;

      //PADRAO HTML CART
      let cartItem = c(".models .cart--item").cloneNode(true);

      let pizzaSizeName;
      switch (cart[i].size) {
        case 0:
          pizzaSizeName = "P";
          break;
        case 1:
          pizzaSizeName = "M";
          break;
        case 2: {
          pizzaSizeName = "G";
          break;
        }
      }

      //JOGANDO MEMORIA no HTML
      cartItem.querySelector("img").src = pizzaItem.img;
      cartItem.querySelector(".cart--item-nome").innerHTML =
        pizzaItem.name + "" + pizzaSizeName;
      cartItem.querySelector(".cart--item--qt").innerHTML = cart[i].qt;
      cartItem
        .querySelector(".cart--item-qtmenos")
        .addEventListener("click", () => {
          //SE TIVER MAIS DE 1 DESSA PIZZA
          if (cart[i].qt > 1) {
            //DIMINUA
            cart[i].qt--;
          } else {
            //REMOVA SOMENTE ESTA PIZZA DO CARRINHO
            cart.splice(i, 1);
          }
          uptadeCart();
        });
      cartItem
        .querySelector(".cart--item-qtmais")
        .addEventListener("click", () => {
          cart[i].qt++;
          uptadeCart();
        });

      //JOGANDO CARTITEM EM SEU ELEMENTO PAI
      c(".cart").append(cartItem);
    }
    desconto = subtotal * 0.1;
    total = subtotal - desconto;

    c('.subtotal span:last-child').innerHTML = `R$ ${subtotal.toFixed(2)}`;
    c('.desconto span:last-child').innerHTML = `R$ ${desconto.toFixed(2)}`;
    c('.total span:last-child').innerHTML = `R$ ${total.toFixed(2)}`;
  } else {
    //REMOVA CARRINHO
    c("aside").classList.remove("show");
  }
};
