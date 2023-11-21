const socket = io();

const addProductForm = document.getElementById('addProduct');
const deleteProductForm = document.getElementById('deleteProduct');
const modProductForm = document.getElementById('modProduct');

$( function () {
    $("#toTheChat").on("click",()=>{
        const input= document.querySelector(".titulo").textContent;
        localStorage.setItem("username", input)
        console.log(input)

    })

});

socket.on("connected", (data) => {
    console.log('connected with server')
})

socket.on("products", async (data) => {
    let lista = document.getElementById("listaProductos");
    let productos = ''

    data.forEach((producto) => {
        productos = productos + `<tr>
        <td> ${producto._id}            </td>
        <td> ${producto.title}         </td>
        <td> ${producto.description}   </td>
        <td> ${producto.code}          </td>
        <td> ${producto.price} ARS     </td>
        <td> ${producto.stock}         </td>
        <td> ${producto.category}      </td>
        <td> ${producto.owner}      </td>
    </tr>`
    })

    lista.innerHTML = productos;
});


addProductForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;
    const code = document.getElementById('code').value;
    const price = document.getElementById('price').value;
    const stock = document.getElementById('stock').value;
    const category = document.getElementById('category').value;
    const thumbnail = document.getElementById('thumbnail').value;
    const createBtn = document.getElementById('createBtn')
    const userEmail = createBtn.getAttribute('data-email');
    const userRole = createBtn.getAttribute('data-role');

    socket.emit('new_prod', {title, description, code, price, stock, category, thumbnail,owner:userEmail})

    document.getElementById('title').value = '';
    document.getElementById('description').value = '';
    document.getElementById('code').value = '';
    document.getElementById('price').value = '';
    document.getElementById('stock').value = '';
    document.getElementById('category').value = '';
    document.getElementById('thumbnail').value = '';

    return false;
})

deleteProductForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const pid = document.getElementById('pid').value;
    const deletebtn = document.getElementById('deletebtn')
    const userEmail = deletebtn.getAttribute('data-email');
    const userRole = deletebtn.getAttribute('data-role');
    socket.emit('delete_prod', {pid,userEmail,userRole})

    document.getElementById('pid').value = '';
    return false;
});

modProductForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const title = document.getElementById('body').value;
    const description = document.getElementById('description2').value;
    const code = document.getElementById('code2').value;
    const price = document.getElementById('price2').value;
    const stock = document.getElementById('stock2').value;
    const category = document.getElementById('category2').value;
    const thumbnail = document.getElementById('thumbnail2').value;
    const id=document.getElementById('pid2').value;
    const modbtn = document.getElementById('modbtn')
    const userEmail = modbtn.getAttribute('data-email');
    const userRole = modbtn.getAttribute('data-role');
    socket.emit('mod_prod', {title,description, code, price, stock, category, thumbnail,id,userEmail,userRole})

    document.getElementById('body').value = '';
    return false;
});