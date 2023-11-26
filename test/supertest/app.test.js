import config from "../../env.js"
import {expect} from "chai"
import supertest from "supertest"

const requester = supertest(`http://localhost:${config.port}/api`)
describe(
    "Testeando los recursos de Ecommerce",
    ()=>{
        describe("Testeando flujo de operaciones de Ecommerce,productos y Usuario",()=>{
            let id = null
            let uid = null;
            let pid = null;
            let cookie = null;
            let user=null
            it("Testeando que se registra un usuario", async () => {
                let data = {
                    first_name: "jacobo",
                    last_name: "Lerner",
                    email: "jacobolerner@coder.com",
                    password: "holamundo",
                    age: 29,
                };

                let response = await requester.post("/sessions/register").send(data);
                let { _body, statusCode } = response;
                uid = _body.payload._id;
                user=_body.payload;
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
              it("Testeando que el usuario inicia sesión con admin", async () => {
                let data = { email: "adminCoder@coder.com", password: "adminCod3r123" };
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
            it("Testeando que se crea un product y devuelve propiedad _id",async()=>{
                let data={title:"PS5",description: "La consola del futuro", price:1000, thumbnail:"sony.com",code:"la beriso", stock:2, category:"electrodomesticos"}   
                const response =await requester.post("/products/test").send(data).set("cookie", [cookie.name + "=" + cookie.value]);
                const { _body}=response
                const chat =_body.payload
                pid=chat._id
                expect(_body.payload).to.have.property('_id')                 
            })
            it("Testeando que devuelva array de productos",async()=>{
                const response =await requester.get("/products/test").set("cookie", [cookie.name + "=" + cookie.value]);
                const {_body}=response        
                expect(Array.isArray(_body.payload)).to.be.equals(true);
            })
            it("Testeando que producto se actualize correctamente",async()=>{
                const data = {title:"ps4"}
                const response= await requester.put("/products/test/"+pid).send(data).set("cookie", [cookie.name + "=" + cookie.value]);
                const {statusCode}=response
                expect(statusCode).to.be.equals(200)   
            })
           / it("Testeando que se borran los datos de prueba de producto",async()=>{
                let response =await requester.delete("/products/test/"+pid).set("cookie", [cookie.name + "=" + cookie.value]);
                let { statusCode } = response;
                expect(statusCode).to.be.equals(200);
                //devuelve id para asegurar que es borrado
            })
            it("Testeando que se desloguee usuario",async()=>{
              let result = await requester.get("/sessions/logout").set("coderCookieToken", [cookie.name + "=" + cookie.value]);
              let { statusCode } = result;
              expect(statusCode).to.be.equals(200);;
              //devuelve id para asegurar que es borrado
          })
            it("Testeando que se borran los datos de prueba de usuario",async()=>{
                let result = await requester.delete("/sessions/"+uid)
                let { _body } = result;
                expect(_body.message).to.be.equals("User deleted");
                //devuelve id para asegurar que es borrado
            })
              
        })
        describe("Testeando flujo de operaciones de Ecommerce,carts",()=>{
          let id = null
          let uid = null;
          let pid = null;
          let cookie = null;
          let user=null
          it("Testeando que devuelva array de carts",async()=>{
            const response =await requester.get("/carts")
            const {_body}=response
       
            expect(Array.isArray(_body)).to.be.equals(true);
        })
        it("Testeando que se crea un cart y devuelve propiedad _id",async()=>{   
          const response =await requester.post("/carts/test");
          const { _body}=response
          const cart =_body
          pid=cart._id
          expect(_body).to.have.property('_id')                 
      })
      it("Testeando que devuelva array productos de cart",async()=>{
        const response =await requester.get("/carts/test/"+pid)
        const {_body}=response
        expect(_body._id).to.be.equals(pid) ;
    })
    it("Testeando que agregue prodcto a cart",async()=>{
      let data={title:"PS1",description: "La consola del futuro", price:1000, thumbnail:"sony.com",code:"la beriso", stock:2, category:"electrodomesticos"} ;
      const response =await requester.put("/carts/test/"+pid).send(data)
      const {_body,statusCode}=response
      expect(statusCode).to.be.equals(200);})

      it("Testeando que borre cart",async()=>{
        const response =await requester.delete("/carts/test/"+pid)
        const {_body,statusCode}=response
        expect(statusCode).to.be.equals(200);})
  
      })
      
        //describe("Testeando Cart",()=>{

       // })
        //describe("Testeando User",()=>{

       // })
    }
)