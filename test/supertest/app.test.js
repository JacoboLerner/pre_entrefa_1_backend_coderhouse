import config from "../../env.js"
import {expect} from "chai"
import supertest from "supertest"

const requester = supertest(`http://localhost:${config.port}/api`)
describe(
    "Testeando los recursos de Ecommerce",
    ()=>{
        describe("Testeando flujo de operaciones de Ecommerce",()=>{
            let id = null
            let uid = null;
            let pid = null;
            let cookie = null;
            it("Testeando que se registra un usuario", async () => {
                let data = {
                    first_name: "jacobo",
                    last_name: "Lerner",
                    email: "jacobolerner@coder.com",
                    password: "holamundo",
                    age: 29
                };
                let response = await requester.post("/sessions/register").send(data);
                let { _body, statusCode } = response;
                uid = _body.payload._id;
                expect(statusCode).to.be.equals(200);
              });
              it("Testeando que el usuario inicia sesión", async () => {
                let data = { email: "jacobolerner@coder.com", password: "holamundo" };
                let response = await requester.post("/sessions/login").send(data);
                let { headers } = response;
                cookie = {
                  name: headers["set-cookie"][0].split("=")[0],
                  value: headers["set-cookie"][0].split("=")[1],
                };
                //console.log(cookie);
                expect(cookie.name).to.be.equals("coderCookieToken");
                expect(cookie.value).to.be.ok;
              });
            it("Testeando que se crea un product y devuelve estatus 201",async()=>{
                let data={title:"PS5",description: "La consola del futuro", price:1000, thumbnail:"sony.com",code:"la beriso", stock:2, category:"electrodomesticos"}   
                const response =await requester.post("/products").send(data).set("cookie", [cookie.name + "=" + cookie.value]);
                const {statusCode}=response
                expect(statusCode).to.be.equals(201)                   
            })
            it("Testeando que se crea un product y devuelve propiedad _id",async()=>{
                let data={title:"PS5",description: "La consola del futuro", price:1000, thumbnail:"sony.com",code:"la beriso", stock:2, category:"electrodomesticos"}   
                const response =await requester.post("/products").send(data).set("cookie", [cookie.name + "=" + cookie.value]);
                const { _body}=response
                const chat =_body.payload
                pid=chat._id
                expect(_body.payload).to.have.property('_id')                 
            })
            it("Testeando que devuelva array de productos",async()=>{
                const response =await requester.get("/products/json").set("cookie", [cookie.name + "=" + cookie.value]);
                const {_body}=response        
                expect(Array.isArray(_body.payload)).to.be.equals(true);
            })
            it("Testeando que producto se actualize correctamente",async()=>{
                const data = {title:"ps4"}
                const response= await requester.put("/products/"+pid).send(data).set("cookie", [cookie.name + "=" + cookie.value]);
                const {statusCode}=response
                expect(statusCode).to.be.equals(200)   
            })
            it("Testeando que se borran los datos de prueba de producto",async()=>{
                let response =await requester.delete("/products/"+pid).set("cookie", [cookie.name + "=" + cookie.value]);
                let { statusCode } = response;
                expect(statusCode).to.be.equals(200);
                //devuelve id para asegurar que es borrado
            })
            it("Testeando que se borran los datos de prueba de usuario",async()=>{
                let result = await requester.delete("/users/"+uid)
                let { _body } = result;
                expect(_body.message).to.be.equals("User deleted");
                //devuelve id para asegurar que es borrado
            })
        })
        //describe("Testeando Cart",()=>{

       // })
        //describe("Testeando User",()=>{

       // })
    }
)