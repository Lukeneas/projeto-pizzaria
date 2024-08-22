//PASSO A PASSO
//1 - clona estrutura html
//2 - joga os dados
//3 - joga na tela

//INITIAL DATA
let modalQt = 1;
const c = (el) => document.querySelector(el);
const cs = (el) => document.querySelectorAll(el);

//LISTAGEM DAS PIZZAS ABERTAS OU CLICADAS
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

    //INSERÇÃO HTML
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
  setTimeout(()=>{
    c(".pizzaWindowArea").style.display = 'none';
  },500)
};
cs('.pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton').forEach((button)=>button.addEventListener('click',closeModal))
