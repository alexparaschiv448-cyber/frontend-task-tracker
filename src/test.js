console.log(eval("3 + 5"));
function test(a,b){
    a[b]=2;
}
let a=2;
a=5;
console.log(a);
if(a==5){
    let m=2;
    console.log(m);
}
console.log("377"-77);
console.log("test"+24);
let k="101.2";
k=parseFloat(k);
console.log(k);
const fish = [, "home", , "school", ,];
test(fish,0);
test(fish,2);
test(fish,4);
for(const k of fish){
    console.log(k);
}
try{
    console.log("test");
}catch(e){
    console.log(e.name);
    console.log(e.message);
}finally{
    console.log("aa");
}
function square(number) {
    return number * number;
}
console.log(square(5));
const d = ["Hydrogen", "Helium", "Lithium", "Beryllium"];

const a2 = d.map(function (s) {
    return s.length;
});
console.log(a2);
const user = {
    name: "Alice",
    address: {
        city: "Paris"
    }
};
const { address: { city:testtt } } = user;
console.log(testtt); // Paris
async function myFunction1() {
    return 42;
}
myFunction1().then(result=>console.log(result)).catch(()=>console.log("Nu merge")); // 42
function myFunction(input) {
    return new Promise((resolve, reject) => {
        if (input==1) {reject("Eroareee")}
        resolve(input*2); // or reject(error)
    });
}
function add1(x){return x+3;}
myFunction(1).then(result => add1(result)).then(result=>result+5).then(result=>console.log(result)).catch(err => console.log(err)).finally(()=>console.log("runs"));
