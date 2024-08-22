//PASSO A PASSO
//1 - clona estrutura html
//2 - joga os dados
//3 - joga na tela

//INITIAL DATA
const c = (el) => document.querySelector(el);
const cs = (el) => document.querySelector(el);

pizzaJson.map((pizza, index) => {
  //clones dos modelos html
  let pizzaItem = c(".models .pizza-item").cloneNode(true);

  //armazenar chave em cada pizza
  pizzaItem.setAttribute('data-key', index);  
  pizzaItem.querySelector(".pizza-item--img img").src = pizza.img;
  pizzaItem.querySelector(".pizza-item--name").innerHTML = pizza.name;
  pizzaItem.querySelector(
    ".pizza-item--price"
  ).innerHTML = `R$ ${pizza.price.toFixed(2)}`; //2 alg depois da virgula, caso nao tenha centavos
  pizzaItem.querySelector(".pizza-item--desc").innerHTML = pizza.description;
  //evento de pizza clicada
  pizzaItem.querySelector("a").addEventListener("click", (e) => {
    e.preventDefault();
    //closest procura el mais proximo com essa class
    let key = e.target.closest('.pizza-item').getAttribute('data-key');

    c('.pizzaBig img').src = pizzaJson[key].img;
    c('.pizzaInfo h1').innerHTML = pizzaJson[key].name;
    c('.pizzaInfo--desc').innerHTML = pizzaJson[key].description;

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
