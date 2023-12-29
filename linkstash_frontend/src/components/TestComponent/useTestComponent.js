export const getLogin=()=>{
    fetch("localhost:3030/login" ).then(
        console.log(Response.toString)
    )
}