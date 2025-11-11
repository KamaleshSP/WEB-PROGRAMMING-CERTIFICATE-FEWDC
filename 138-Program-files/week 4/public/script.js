let total=0;
let max=0.00;
let mname='';
document.getElementById('addMaterialBtn').addEventListener("click", function(){
    const mn=document.getElementById('materialName').value.trim();
    const c=document.getElementById('category').value.trim();
    const q=document.getElementById('quantity').value.trim();
    const sn=document.getElementById('supplierName').value.trim();
    const cpu=document.getElementById('costPerUnit').value.trim();
    if(!mn || !c || !q || !sn || !cpu){
        document.getElementById('error-message').textContent="Please fill out all fields!";
        return;
    }
    document.getElementById('error-message').textContent="";
    const tablerow=`
    <tr>
        <td>${mn}</td>
        <td>${c}</td>
        <td>${q}</td>
        <td>${sn}</td>
        <td>RS ${cpu}.00</td>
    </tr>`;
    document.querySelector('#materialTable tbody').innerHTML+=tablerow;
    total+=1;
    if(max<=cpu){
        max=cpu+'.00';
        mname=mn;
    }
    document.getElementById('totalProducts').textContent=`${total}`;
    document.getElementById('mostExpensive').textContent=`${mname} (RS ${max})`;
    document.getElementById('myform').reset();
});