document.addEventListener('DOMContentLoaded', () => {
    const purchaseBtn = document.getElementById('purchaseBtn');
    const purchaseResults = document.getElementById('purchaseResults');
    const purchasedProductsList = document.getElementById('purchasedProducts');
    const notPurchasedProductsList = document.getElementById('notPurchasedProducts');
    const Total = document.getElementById('total');

    if (purchaseBtn) {
        const cartId = purchaseBtn.getAttribute('data-cart-id');

        purchaseBtn.addEventListener('click', async () => {
            try {
                const response = await fetch(`/api/carts/${cartId}/purchase`, {
                    method: 'GET'
                });

                if (response.ok) {
                    const responseData = await response.json();
                    Total.innerHTML= `$ ${responseData.ticket.amount} pesos Argentinos`;
                    purchasedProductsList.innerHTML = '';
                    notPurchasedProductsList.innerHTML = '';
                    
                    responseData.purchasedProducts.forEach(product => {
                        const listItem = document.createElement('li');
                        listItem.textContent = `ID: ${product.product._id} - Titulo: ${product.product.title} - Cantidad: ${product.quantity} - Precio: ${product.product.price}`;
                        purchasedProductsList.appendChild(listItem);
                    }
                    
                    );

                    responseData.unprocessedProducts.forEach(product => {
                        const listItem = document.createElement('li');
                        listItem.textContent = `ID: ${product.product._id} - Titulo: ${product.product.title} - Cantidad: ${product.quantity} - Precio: ${product.product.price}`;
                        notPurchasedProductsList.appendChild(listItem);
                    });
                    console.log(responseData.unprocessedProducts)
                    purchaseResults.style.display = 'block';
                    
                    const productosComprados = responseData.purchasedProducts

                    // Después de mostrar los resultados, enviar el correo electrónico
                    const mailUser = purchaseBtn.getAttribute('data-mail-user');
                    const sendMailResponse = await fetch("/sendMailPurchase/send", {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            pd:productosComprados,
                         total:responseData.ticket.amount }),
                    });

                    if (sendMailResponse.ok) {
                        console.log('Correo electrónico enviado con éxito.');
                    } else {
                        console.error('Error al enviar el correo electrónico:', sendMailResponse.statusText);
                    }
                } else {
                    console.error('Error al finalizar la compra:', response.statusText);
                }
            } catch (error) {
                console.error('Error al finalizar la compra:', error);
            }
        });
    }
});