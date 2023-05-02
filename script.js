
const label= document.querySelector('#content');//prende l'elemento scritto
const xeno_endpoint= 'https://xeno-canto.org/api/2/recordings';
const info_endpoint='https://en.wikipedia.org/api/rest_v1/page/related/';
const img_url='https://api.imgur.com/3/account/irene2001/images/0';

const client_id='afdf5df9136b739';
const client_secret='06943ed7b8caec2c6373006e9172454af617282e';
const refresh_token= '2517b4cb2b7def3e4ca15c320f77e6bb84f3b869';


let token;

const form= document.querySelector('form');
form.addEventListener('submit', search);


function search(event){
    event.preventDefault();
    const select= document.querySelector('#tipo');
    document.querySelector('#contenuto article').classList.remove('hidden');
    if(select.value=='audio'){
        const xeno_url= xeno_endpoint+'?query='+encodeURIComponent(label.value);
        console.log(xeno_url);
        fetch(xeno_url).then(onResponse).then(onAjson);
    }
    if(select.value=='galleria'){
        const formdata = new FormData();

        formdata.append('refresh_token', refresh_token);
        formdata.append('client_id', client_id);
        formdata.append('client_secret', client_secret);
        formdata.append('grant_type', 'refresh_token');

        fetch('https://api.imgur.com/oauth2/token', {
            method: 'POST',
            body: formdata
        }).then(onResponse).then(onGjson);
    }

}

function onResponse(response){
    return  response.json();
}

function onAjson(json){
    console.log(json);
    const sezione=document.querySelector('#contenuto');
    document.querySelector('#contenuto article').classList.add('hidden');
    for(let i=0; i<10; i++){
        const div= document.createElement('div');
        sezione.appendChild(div);
        div.classList.add('risultato');
        div.textContent='Paese= '+json.recordings[i].cnt+'  Data registrazione= '+json.recordings[i].date+'.  Autore= '+
        json.recordings[i].rec+".  Ascolta e scarica l'audio ";
        const a=document.createElement('a');
        div.appendChild(a);
        a.href= json.recordings[i].file;
        a.textContent='QUI.';
        const img= document.createElement('img');
        div.appendChild(img);
        img.src='http:'+json.recordings[i].osci.large;
        img.classList.add('img_risultato');
        
    }
    form.addEventListener('submit', rimuovi);
       
}

function onGjson(json){
    console.log(json);
    token=json.access_token;
    const header = {
            method: 'GET',
            headers: {
            'Authorization': ' Bearer '+token,
            }
        }
        fetch(img_url, header).then(onResponse).then(onIMGJson);

}

function onIMGJson(json){
    console.log(json);
    document.querySelector('#contenuto article').classList.add('hidden');
    const label=document.querySelector('#content');
    const value= label.value.toLowerCase();
    for(let i=0; i<json.data.length; i++){
        if(value===json.data[i].name){
            const sezione=document.querySelector('#contenuto');
            const div= document.createElement('div');
            sezione.appendChild(div);
            div.classList.add('risultato');
            div.textContent='Specie= '+json.data[i].name;
            const img= document.createElement('img');
            div.appendChild(img);
            img.src=json.data[i].link;
            img.classList.add('img_risultato');
            break;
        }
    }
    form.addEventListener('submit', rimuovi);
}

function rimuovi(event){
    for(let i=0; i<10; i++){
        const container=document.querySelector('#contenuto div');
        container.remove();
    }

}



