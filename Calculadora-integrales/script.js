// -----------------------------
// FUNCION PRINCIPAL
// -----------------------------

function calcular(){

let funcion = document.getElementById("funcion").value

if(!validarFuncion(funcion)){
alert("Función inválida")
return
}

let tipo = tipoIntegral(funcion)
let usarLimites = document.getElementById("usarLimites").checked

mostrarControlRectangulos(tipo, usarLimites)
mostrarEjemplosVolumen(tipo)

// -----------------------------
// SIN LIMITES
// -----------------------------

if(!usarLimites){

graficarFuncion(funcion)

document.getElementById("resultado").innerHTML =
"<b>Tipo:</b> " + tipo + "<br>Función graficada sin límites"

return
}

// -----------------------------
// INTEGRAL SIMPLE
// -----------------------------

if(tipo == "Integral simple"){

let a = parseFloat(document.getElementById("ax").value)
let b = parseFloat(document.getElementById("bx").value)

if(isNaN(a) || isNaN(b)){
alert("Ingresa límites válidos")
return
}

if(a >= b){
alert("El límite inferior debe ser menor que el superior")
return
}

let expr = math.compile(funcion)

let n = parseInt(document.getElementById("rectangulos").value)

let dx = (b-a)/n
let suma = 0

for(let i=0;i<n;i++){

let x = a + (i+0.5)*dx
let y = expr.evaluate({x:x})

suma += y*dx

}

mostrarIntegralSimple(funcion,a,b,suma,n)

graficar(expr,a,b)

return
}


// -----------------------------
// INTEGRAL DOBLE
// -----------------------------

if(tipo == "Integral doble"){

let ax = parseFloat(document.getElementById("ax").value)
let bx = parseFloat(document.getElementById("bx").value)

let ay = document.getElementById("ay").value
let by = document.getElementById("by").value

if(isNaN(ax) || isNaN(bx)){
alert("Límites de x inválidos")
return
}

let resultado = integralDoble(funcion,ax,bx,ay,by)

mostrarIntegralDoble(funcion,ax,bx,ay,by,resultado)

graficarSuperficie(funcion,ax,bx)

return
}

// -----------------------------
// INTEGRAL TRIPLE
// -----------------------------

if(tipo == "Integral triple"){

let ax = parseFloat(document.getElementById("ax").value)
let bx = parseFloat(document.getElementById("bx").value)

let ay = document.getElementById("ay").value
let by = document.getElementById("by").value

let az = document.getElementById("az").value
let bz = document.getElementById("bz").value

let resultado = integralTriple(funcion,ax,bx,ay,by,az,bz)

mostrarIntegralTriple(funcion,ax,bx,ay,by,az,bz,resultado)

graficarVolumen(funcion,ax,bx,ay,by,az,bz)

return

}

}

// -----------------------------
// VALIDAR FUNCION
// -----------------------------
function filtrarFuncion(){

let input = document.getElementById("funcion")

let valor = input.value

// solo caracteres matemáticos básicos
let permitido = /[^0-9xyz+\-*/^()., ]/gi

input.value = valor.replace(permitido,"")

}

function validarFuncion(funcion){

funcion = funcion.toLowerCase().trim()

if(funcion === ""){
return false
}

try{

math.parse(funcion)

}catch{

return false

}

return true

}

function validarNumero(valor){

let regex = /^-?\d+(\.\d+)?$/

return regex.test(valor)

}

// -----------------------------
// DETECTAR VARIABLES
// -----------------------------

function detectarVariables(funcion){

let node = math.parse(funcion)

let variables = new Set()

node.traverse(function(n){

if(n.isSymbolNode){

if(!math[n.name]){
variables.add(n.name)
}

}

})

return Array.from(variables)

}

// -----------------------------
// DETECTAR TIPO DE INTEGRAL
// -----------------------------

function tipoIntegral(funcion){

let vars = detectarVariables(funcion)

if(vars.length == 1) return "Integral simple"

if(vars.length == 2) return "Integral doble"

if(vars.length == 3) return "Integral triple"

return "Desconocido"

}

// -----------------------------
// GRAFICAR FUNCION CON LIMITES
// -----------------------------

function graficar(expr,a,b){

let x=[]
let y=[]

for(let i=a;i<=b;i+=0.05){

x.push(i)

try{
y.push(expr.evaluate({x:i}))
}catch{
y.push(null)
}

}

let curva={
x:x,
y:y,
type:"scatter",
mode:"lines",
name:"f(x)",
line:{color:"blue"}
}

let area={
x:x,
y:y,
type:"scatter",
fill:"tozeroy",
mode:"none",
name:"Área de la integral",
fillcolor:"rgba(0,150,255,0.3)"
}

let rectangulos=[]

let n = parseInt(document.getElementById("rectangulos").value)
let dx=(b-a)/n

for(let i=0;i<n;i++){

let xi=a+i*dx
let xm=xi+dx/2

let altura=expr.evaluate({x:xm})

rectangulos.push({

x:[xi,xi+dx,xi+dx,xi,xi],
y:[0,0,altura,altura,0],
type:"scatter",
fill:"toself",
opacity:0.35,
line:{color:"orange"},
name:"Rectángulo"

})

}

let data=[area,curva,...rectangulos]

let layout={

title:"Integral aproximada con rectángulos de Riemann",

xaxis:{title:"x"},
yaxis:{title:"f(x)"}

}

Plotly.newPlot("grafica",data,layout)

}

// -----------------------------
// GRAFICAR SIN LIMITES
// -----------------------------

function graficarFuncion(funcion){

let expr = math.compile(funcion)

let x=[]
let y=[]

for(let i=-10;i<=10;i+=0.1){

x.push(i)

try{
y.push(expr.evaluate({x:i}))
}catch{
y.push(null)
}

}

let data=[{

x:x,
y:y,
type:"scatter",
mode:"lines",
line:{color:"green"}

}]

let layout={

title:"Gráfica de la función",

xaxis:{title:"x"},
yaxis:{title:"f(x)"}

}

Plotly.newPlot("grafica",data,layout)

}

// -----------------------------
// GRAFICAR SUPERFICIE 3D
// -----------------------------

function graficarSuperficie(funcion,ax,bx){

let expr = math.compile(funcion)

let x=[]
let y=[]
let z=[]

let n=40

for(let i=0;i<n;i++){

x[i]=[]
y[i]=[]
z[i]=[]

let xi = ax + (bx-ax)*i/n

for(let j=0;j<n;j++){

let yj = ax + (bx-ax)*j/n

x[i][j]=xi
y[i][j]=yj

z[i][j]=expr.evaluate({x:xi,y:yj})

}

}

let data=[{

z:z,
type:"surface"

}]

Plotly.newPlot("grafica",data)

}

// -----------------------------
// GRAFICAR VOLUMEN 3D (Integral Triple)
// -----------------------------

function graficarVolumen(funcion, ax, bx, ay, by, az, bz){

let expr = math.compile(funcion)

let x=[]
let y=[]
let z=[]

let n = 15

for(let i=0;i<n;i++){

let xi = ax + (bx-ax)*i/n

let ymin = math.evaluate(ay,{x:xi})
let ymax = math.evaluate(by,{x:xi})

for(let j=0;j<n;j++){

let yj = ymin + (ymax-ymin)*j/n

let zmin = math.evaluate(az,{x:xi,y:yj})
let zmax = math.evaluate(bz,{x:xi,y:yj})

for(let k=0;k<n;k++){

let zk = zmin + (zmax-zmin)*k/n

let valor = expr.evaluate({x:xi,y:yj,z:zk})

if(!isNaN(valor)){

x.push(xi)
y.push(yj)
z.push(zk)

}

}

}

}

let data = [{

x:x,
y:y,
z:z,
mode:"markers",
type:"scatter3d",
marker:{
size:3,
opacity:0.6
}

}]

let layout = {

title:"Volumen aproximado (Integral Triple)",

scene:{
xaxis:{title:"x"},
yaxis:{title:"y"},
zaxis:{title:"z"}
}

}

Plotly.newPlot("grafica",data,layout)

}

// -----------------------------
// CALCULAR INTEGRAL DOBLE
// -----------------------------

function integralDoble(funcion, ax, bx, ay, by){

let expr = math.compile(funcion)

let nx=80
let ny=80

let dx=(bx-ax)/nx

let suma=0

for(let i=0;i<nx;i++){

let x = ax + (i+0.5)*dx

let ymin = math.evaluate(ay,{x:x})
let ymax = math.evaluate(by,{x:x})

let dy=(ymax-ymin)/ny

for(let j=0;j<ny;j++){

let y = ymin + (j+0.5)*dy

let valor = expr.evaluate({x:x,y:y})

suma += valor*dx*dy

}

}

return suma

}

// -----------------------------
// MOSTRAR / OCULTAR LIMITES
// -----------------------------

function toggleLimites(){

let check = document.getElementById("usarLimites").checked
let div = document.getElementById("camposLimites")

if(check){
div.style.display="block"
}else{
div.style.display="none"
}


let funcion = document.getElementById("funcion").value

if(validarFuncion(funcion)){

let tipo = tipoIntegral(funcion)

mostrarControlRectangulos(tipo, check)
mostrarEjemplosVolumen(tipo)

}

}

// -----------------------------
// MOSTRAR LIMITES SEGUN VARIABLES
// -----------------------------

function actualizarLimites(){

let funcion = document.getElementById("funcion").value
let input = document.getElementById("funcion")

if(!validarFuncion(funcion)){
input.classList.add("inputError")
return
}else{
input.classList.remove("inputError")
}

if(!validarFuncion(funcion)) return

let vars = detectarVariables(funcion)

document.getElementById("limitesY").style.display="none"
document.getElementById("limitesZ").style.display="none"

if(vars.length >= 2){
document.getElementById("limitesY").style.display="block"
}

if(vars.length >= 3){
document.getElementById("limitesZ").style.display="block"
}

let tipo = tipoIntegral(funcion)
let usarLimites = document.getElementById("usarLimites").checked

mostrarControlRectangulos(tipo, usarLimites)
mostrarEjemplosVolumen(tipo)

}

// -----------------------------
// MOSTRAR Integral
// -----------------------------

function mostrarIntegral(funcion,a,b){

let latex = "\\int_{" + a + "}^{" + b + "} " + funcion + "\\,dx"

document.getElementById("resultado").innerHTML +=
"<div style='font-size:22px;margin-top:10px'>$$" + latex + "$$</div>"

MathJax.typesetPromise()

}

function mostrarIntegralSimple(funcion,a,b,resultado,n){

let variable = detectarVariables(funcion)[0]

let latex =
"\\int_{" + a + "}^{" + b + "} " + funcion +
"\\, d" + variable + " = " + resultado.toFixed(6)

let partes = `
<b>Partes de la integral:</b><br>
Integrando: ${funcion}<br>
Variable de integración: ${variable}<br>
Límite inferior: ${a}<br>
Límite superior: ${b}
`

document.getElementById("resultado").innerHTML =
"<div style='font-size:22px'>$$"+latex+"$$</div><br>"+partes

MathJax.typesetPromise()

explicarMetodo(n)

}

// -----------------------------
// MOSTRAR Explicacion
// -----------------------------

function explicarMetodo(n){

let texto = `
<br><br>
<b>Método numérico utilizado:</b><br>
Suma de Riemann<br>
Número de subdivisiones: ${n}<br><br>

La integral se aproxima dividiendo el intervalo en muchos rectángulos pequeños.
Luego se suman las áreas de esos rectángulos para aproximar el área total bajo la curva.
`

document.getElementById("resultado").innerHTML += texto

}

// -----------------------------
// MOSTRAR Integral Doble Matema..
// -----------------------------

function mostrarIntegralDoble(funcion,ax,bx,ay,by,resultado){

let latex =
"\\int_{" + ax + "}^{" + bx + "} " +
"\\int_{" + ay + "}^{" + by + "} " +
funcion + "\\,dy\\,dx = " + resultado.toFixed(6)

let partes = `
<b>Partes de la integral doble:</b><br>
Integrando: ${funcion}<br>
Variables: x , y<br>
Límite x inferior: ${ax}<br>
Límite x superior: ${bx}<br>
Límite y inferior: ${ay}<br>
Límite y superior: ${by}
`

document.getElementById("resultado").innerHTML =
"<div style='font-size:22px'>$$"+latex+"$$</div><br>"+partes

MathJax.typesetPromise()

}

// -----------------------------
// MOSTRAR Integral Triple Matema..
// -----------------------------

function mostrarIntegralTriple(funcion,ax,bx,ay,by,az,bz,resultado){

let latex =
"\\int_{" + ax + "}^{" + bx + "} " +
"\\int_{" + ay + "}^{" + by + "} " +
"\\int_{" + az + "}^{" + bz + "} " +
funcion + "\\,dz\\,dy\\,dx = " + resultado.toFixed(6)

let partes = `
<b>Partes de la integral triple:</b><br>
Integrando: ${funcion}<br>
Variables: x , y , z<br>
Límites de x: ${ax} a ${bx}<br>
Límites de y: ${ay} a ${by}<br>
Límites de z: ${az} a ${bz}
`

document.getElementById("resultado").innerHTML =
"<div style='font-size:22px'>$$"+latex+"$$</div><br>"+partes

MathJax.typesetPromise()

}

// -----------------------------
// Cantidad de rectangulo 
// -----------------------------

function actualizarRectangulos(){

let valor = document.getElementById("rectangulos").value

document.getElementById("valorRect").innerText = valor

calcular()

}

// -----------------------------
// CALCULAR INTEGRAL TRIPLE
// -----------------------------

function integralTriple(funcion, ax, bx, ay, by, az, bz){

let expr = math.compile(funcion)

let nx = 30
let ny = 30
let nz = 30

let dx = (bx-ax)/nx

let suma = 0

for(let i=0;i<nx;i++){

let x = ax + (i+0.5)*dx

let ymin = math.evaluate(ay,{x:x})
let ymax = math.evaluate(by,{x:x})

let dy = (ymax-ymin)/ny

for(let j=0;j<ny;j++){

let y = ymin + (j+0.5)*dy

let zmin = math.evaluate(az,{x:x,y:y})
let zmax = math.evaluate(bz,{x:x,y:y})

let dz = (zmax-zmin)/nz

for(let k=0;k<nz;k++){

let z = zmin + (k+0.5)*dz

let valor = expr.evaluate({x:x,y:y,z:z})

suma += valor*dx*dy*dz

}

}

}

return suma

}

// -----------------------------
// EJEMPLO VOLUMEN DE CUBO
// -----------------------------

function ejemploCubo(){

document.getElementById("funcion").value = "1 + 0*x + 0*y + 0*z"

document.getElementById("usarLimites").checked = true
toggleLimites()

document.getElementById("ax").value = 0
document.getElementById("bx").value = 1

document.getElementById("ay").value = 0
document.getElementById("by").value = 1

document.getElementById("az").value = 0
document.getElementById("bz").value = 1

actualizarLimites()

calcular()

}

// -----------------------------
// EJEMPLO VOLUMEN DE ESFERA
// -----------------------------

function ejemploEsfera(){

document.getElementById("funcion").value = "sqrt(1-x^2-y^2)"

document.getElementById("usarLimites").checked = true
toggleLimites()

document.getElementById("ax").value = -1
document.getElementById("bx").value = 1

document.getElementById("ay").value = "-sqrt(1-x^2)"
document.getElementById("by").value = "sqrt(1-x^2)"

document.getElementById("az").value = 0
document.getElementById("bz").value = "sqrt(1-x^2-y^2)"

actualizarLimites()

calcular()

}

// -----------------------------
// MOSTRAR los rectangulos
// -----------------------------

function mostrarControlRectangulos(tipo, usarLimites){

let control = document.getElementById("controlRectangulos")

if(tipo == "Integral simple" && usarLimites){
control.style.display = "block"
}else{
control.style.display = "none"
}

}

function mostrarEjemplosVolumen(tipo){

let div = document.getElementById("ejemplosVolumen")
let usarLimites = document.getElementById("usarLimites").checked

if(tipo == "Integral triple" && usarLimites){
div.style.display = "block"
}else{
div.style.display = "none"
}

}

// -----------------------------
// Reset
// -----------------------------

function resetear(){

document.getElementById("funcion").value = ""

document.getElementById("usarLimites").checked = false
document.getElementById("camposLimites").style.display = "none"

document.getElementById("ax").value = ""
document.getElementById("bx").value = ""
document.getElementById("ay").value = ""
document.getElementById("by").value = ""
document.getElementById("az").value = ""
document.getElementById("bz").value = ""

document.getElementById("limitesY").style.display = "none"
document.getElementById("limitesZ").style.display = "none"

document.getElementById("controlRectangulos").style.display = "none"
document.getElementById("ejemplosVolumen").style.display = "none"

document.getElementById("resultado").innerHTML = ""

Plotly.purge("grafica")

}

// -----------------------------
// Simbolos de ayuda
// -----------------------------

function insertar(simbolo){

let input = document.getElementById("funcion")

let inicio = input.selectionStart
let fin = input.selectionEnd

let texto = input.value

input.value = texto.substring(0,inicio) + simbolo + texto.substring(fin)

input.focus()

input.selectionStart = input.selectionEnd = inicio + simbolo.length

}
