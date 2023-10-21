

const addEvents = () => {
    const addToCartButtons = document.querySelectorAll(".addToCart");
    addToCartButtons.forEach((button) => {
        button.addEventListener("click", addToCart);
    });
};


const addToCart = async (e) => {
    const productID = e.target.dataset.id;
    let cartID = localStorage.getItem("cartId");
    console.log("soy el guardado del ls", cartID, " y el id del producto es: ", productID);
    if (!cartID) {
        fetch("/api/carts", {
            method: "POST",
        })
            .then((response) => response.json())
            .then((data) => {
                cartID = data._id;
                localStorage.setItem("cartId", cartID);
            })
            .catch((error) => {
                console.error("Error al crear un nuevo carrito:", error);
                return;
            });
    }
    const response = await fetch(`/api/carts/${cartID}/product/${productID}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        // body: "quantity: quantity" ,
    });
    //manejo para que usuario no pueda agregar su propio producto en caso de premium
    const result = await response.json();
    console.log(result);
    if (result===true) {        
        alert("Se ha agregado producto de forma exitosa");
      } else {
        alert(result.message);
      }
};

$( function () {
    $(".carrrito").on("click",()=>{
        let cartID = localStorage.getItem("cartId")
        window.location.href = `/`,
        window.location.href = `/products/carts/${cartID}`
        
        
    })

});

window.addEventListener("load", addEvents);


