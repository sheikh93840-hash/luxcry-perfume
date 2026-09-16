const API_URL='https://v2.jokeapi.dev/joke/Any?type=twopart,single&safe-mode';
let served=0;
const button=document.querySelector('#new-joke-button');
const content=document.querySelector('#joke-content');
const category=document.querySelector('#category');
const loader=document.querySelector('#loader');
const errorMessage=document.querySelector('#error-message');
const count=document.querySelector('#joke-count');
const copyButton=document.querySelector('#copy-button');
let currentJoke='';

function setLoading(isLoading){
  loader.hidden=!isLoading;
  button.disabled=isLoading;
  errorMessage.hidden=true;
}
function showJoke(data){
  currentJoke=data.type==='single'?data.joke:`${data.setup}\n\n${data.delivery}`;
  content.innerHTML=data.type==='single'
    ?`<div class="emoji">🤣</div><p class="joke-text">${escapeHtml(data.joke)}</p>`
    :`<div class="emoji">😄</div><p class="joke-text">${escapeHtml(data.setup)}</p><p class="delivery">${escapeHtml(data.delivery)}</p>`;
  category.textContent=`${data.category.toUpperCase()} · ${data.type==='single'?'ONE-LINER':'TWO-PART'}`;
  served+=1;
  count.textContent=`${served} joke${served===1?'':'s'} served`;
}
function escapeHtml(value){const div=document.createElement('div');div.textContent=value;return div.innerHTML}
async function getJoke(){
  setLoading(true);
  try{
    const response=await fetch(API_URL,{headers:{Accept:'application/json'}});
    if(!response.ok)throw new Error('Request failed');
    const data=await response.json();
    if(data.error)throw new Error(data.message||'API error');
    showJoke(data);
  }catch(error){
    errorMessage.hidden=false;
    category.textContent='TEMPORARILY OFFLINE';
  }finally{setLoading(false)}
}
button.addEventListener('click',getJoke);
copyButton.addEventListener('click',async()=>{
  if(!currentJoke)return;
  try{await navigator.clipboard.writeText(currentJoke);copyButton.textContent='✓';setTimeout(()=>copyButton.textContent='⧉',1400)}catch{copyButton.textContent='!'}
});
