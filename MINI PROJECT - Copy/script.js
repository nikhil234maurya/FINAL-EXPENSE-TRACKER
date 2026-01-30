

function deleteTransaction(id) {
  transactions = transactions.filter(tx => tx.id !== id);
  saveToLocalStorage();
  recalculate();
}





let transactions=[];

function createTransaction({amount , category , type , note}){            // curly bracket jruri h 

   return {
      id: Date.now(),
      amount: Number(amount),
      category,
      type,
      note,
      date:new Date().toISOString()
   }

}
     // yaha par data me poora object hi type krna hoga naaki sirf values and strings


function saveToLocalStorage() {
  localStorage.setItem("transactions", JSON.stringify(transactions));

  
}

function loadFromLocalStorage() {
  const data = localStorage.getItem("transactions");
  transactions = data ? JSON.parse(data) : [];
}



function addTransactions(data){
   const tx= createTransaction(data);                       // tx ek single object h 
   transactions.push(tx);
   saveToLocalStorage();
  recalculate();

}

// addTransactions(
//    {
//       amount:Number(1000),
//       category:"food",
//       type:"outflow",
//       note:"hi"
       
//    }
// );

// console.log(transactions);

function getTotalinflow(){
    return transactions
   .filter(n=>n.type==="inflow")
   .reduce((sum,n)=>sum+n.amount,0);                          // n me aur numbers bhi ho skte h to clarification ke liye
}

function getTotaloutflow(){
    return transactions
   .filter(n=>n.type==="outflow")
   .reduce((sum,n)=>sum+n.amount,0);    
}

function getTotalbalance(){
   return getTotalinflow() - getTotaloutflow();
}


const totalamount = document.querySelector(".total-amount");
const inflowvalue = document.querySelector(".inflow");
const outflowvalue = document.querySelector(".outflow");



function recalculate(){

   const inflowE = getTotalinflow();
   const outflowE= getTotaloutflow();
   const totalbalance=getTotalbalance();
                                                         // this part took me more than 1.5 hours
   
totalamount.innerText=`₹${totalbalance}`;
inflowvalue.innerText=`₹${inflowE}`;
outflowvalue.innerText=`₹${outflowE}`;

    renderLedgerPreview();
    renderHistory();


}

 


const plusbtn = document.querySelector(".plusbtn");
const modal = document.querySelector(".form");

plusbtn.addEventListener("click", () => {
  
   historyModal.classList.remove("open"); 
  
  modal.classList.add("open");
});


let save=document.querySelector(".save");
save.addEventListener("click" , ()=>
{

   const amount=Number(document.querySelector(".amount-input").value);
   const category=document.querySelector(".category").value;
   const type=document.querySelector(".type").value;
   const note=document.querySelector(".note").value;

if (!amount || amount <= 0) return;


   addTransactions({
   amount:amount,
   category:category,
   type:type,
   note:note

   
}
   )



  

 document.querySelector(".amount-input").value = "";
  document.querySelector(".category").value = "";
  document.querySelector(".type").value = "outflow";
  document.querySelector(".note").value = "";


     modal.classList.remove("open");

  
     





});




const ledgerList = document.querySelector(".ledgerList");




function renderLedgerPreview() {                 // ye sirf ui aur tracsaction se data print krne ke liye h 
  if (!ledgerList) return;                        // agar ledgerList me kuch nhi (null) to function stop (kuch nhi hoga)

  // remove old rendered items (but keep header)
  const oldItems = ledgerList.querySelectorAll(".transactionitem");   // div create jiska class transactionitem h 
                                                                      //  kiya h ledger list div ke anadar hi
  oldItems.forEach(item => item.remove());  //Remove old UI before re-render                          // ledgerlist ke andar transeaction item ke child ko 
     // yha innerHtml =" bhi kr skte the but we want to be header static"                                                                                                // find krta h 
                       
  transactions                           // single source of truth
    .slice(-4)        // last 4 only
    .reverse() //bcz latest valae dkhane h 




    .forEach(tx => 
                                   // poore tx ke liye ye ek variable h jisme transaction array se har ek object jisme saari detail h vo h 

{

      const div = document.createElement("div");
      div.className = "transactionitem";
 let icon = "📦";
        if (tx.category.includes("Food")) icon = "🍴";
        if (tx.category.includes("Salary")) icon = "💰";
        if (tx.category.includes("Transport")) icon = "🚗";
        if (tx.category.includes("Shoping")) icon = "🛍️";
        if (tx.category.includes("Bills")) icon = "🧾";
        if (tx.category.includes("Health")) icon = "💊";
        if (tx.category.includes("Education")) icon = "📚";
        if (tx.category.includes("Entertainment")) icon = "🍿";
        if (tx.category.includes("Others")) icon = "💸";
      
      div.innerHTML = `
        
         <div class="icon">${icon}</div>
        <div class="tx-details">
          <p class="txcategory">${tx.category}</p>
          <p class="txdate">${new Date(tx.date).toLocaleDateString()}</p>
        </div>

        <div class="tx-amount ${tx.type === "inflow" ? "positive" : "negative"}">
          ${tx.type === "inflow" ? "+" : "-"}₹${tx.amount}
        </div>

        <button class="delete" data-id="${tx.id}">×</button>
        
      `

      
    ledgerList.appendChild(div);


    
   
  
  })

}

  
  
ledgerList.addEventListener("click", (e) => {
  if (!e.target.classList.contains("delete")) return;

  const id = Number(e.target.dataset.id);
   if (!confirm("Delete this transaction?")) return;
   deleteTransaction(id);
 

 



 

});

// Variable select karein
const historyModal = document.querySelector(".history");
const historyBtn = document.querySelector(".historybtn");
const historyClose = document.querySelector(".history-close");
const historyList = document.querySelector(".transaction-list");

// Open History
historyBtn.addEventListener("click", () => {
    const modalH = document.querySelector(".history");
    console.log("Vault opening now...");
    
    // Sabse pehle display force karo
    modalH.style.display = "block"; 
    modalH.classList.add("open");
    
    renderHistory();
});

// Render Function
function renderHistory() {
    const historyList = document.querySelector(".transaction-list");
    if (!historyList) return;

    // Inital check: Agar koi transaction nahi hai
    if (transactions.length === 0) {
        historyList.innerHTML = `
            <div class="empty-vault">
                <h2 style="font-weight:300; letter-spacing:2px;">VAULT EMPTY</h2>
                <p style="font-size:10px; color:#222; margin-top:10px;">HISTORICAL LOGS WILL APPEAR HERE</p>
            </div>`;
        return;
    }

    historyList.innerHTML = ""; // Purana data clear karein

    transactions.slice().reverse().forEach(tx => {
        const div = document.createElement("div");
        div.className = "card";
        
        // Dynamic icons based on category
        let icon = "📦";
        if (tx.category.includes("Food")) icon = "🍴";
        if (tx.category.includes("Salary")) icon = "💰";
        if (tx.category.includes("Transport")) icon = "🚗";
        if (tx.category.includes("Shoping")) icon = "🛍️";
        if (tx.category.includes("Bills")) icon = "🧾";
        if (tx.category.includes("Health")) icon = "💊";
        if (tx.category.includes("Education")) icon = "📚";
        if (tx.category.includes("Entertainment")) icon = "🍿";
        if (tx.category.includes("Others")) icon = "💸";

        div.innerHTML = `
            <div class="icon-box">${icon}</div>
            <div class="details">
                <span class="name">${tx.category || "Untitled Entry"}</span>
                <span class="category">${tx.category}</span>
            </div>
            <div class="amount ${tx.type === 'inflow' ? 'positive' : 'negative'}">
                ${tx.type === 'inflow' ? '+' : '-'}₹${tx.amount}
            </div>

            <button class="delete" data-id="${tx.id}">×</button>
        `;
        historyList.appendChild(div);
    });
}

historyList.addEventListener("click", (e) => {
  if (!e.target.classList.contains("delete")) return;

  const id = Number(e.target.dataset.id);
   if (!confirm("Delete this transaction?")) return;
   deleteTransaction(id);
});

historyClose.addEventListener("click", () => {
    console.log("Closing Vault...");
    
    // 1. Class remove karein
    historyModal.classList.remove("open");
    
    // 2. Forcefully display none karein (kyunki humne style.display manually change kiya tha)
    historyModal.style.display = "none";
    
    // 3. (Optional) Agar modal kholne par scroll lock kiya tha, toh use unlock karein
    document.body.style.overflow = "auto";
});



loadFromLocalStorage();

recalculate();



 





