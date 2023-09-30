export const generateProductErrorInfo = (user) => {
    return `
    Uno o más parámetros están incompletos o no son válidos
    Lista de propiedades obligatorias:
        -title: Must be a String. ( ${user.first_name} )
        -description: Must be a String. ( ${user.last_name} )
        -code: Must be a String. ( ${user.email} )
        -price: Must be a Number. ( ${user.age} )
    `
}