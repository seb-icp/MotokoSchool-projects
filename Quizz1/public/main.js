const form = document.querySelector(".quizz-form");
const toutesLesQuestions = document.querySelectorAll(".question-block");
const aide = document.querySelector(".help");
const note = document.querySelector (".note");
let tableauReponses = ["b","c","b","c","b","a","b","a","b","c"];
let tableauResultat= [];
let Note =0;




form.addEventListener("submit" , (e) => {
    e.preventDefault();

    for (i=1 ; i<11 ; i++) {
        tableauResultat.push(document.querySelector(`input[name="q${i}"]:checked`).value);
    }


    afficherResultats(tableauResultat);
    couleursFonction(tableauResultat);
    Note = 0;
    tableauResultat=[];
})
    

function afficherResultats(tableauResultat) {

     for (i=0; i<tableauResultat.length;i++) {

        if (tableauResultat[i]==tableauReponses[i]) {
                Note++;
            }

        else {
                console.log("Une faute");
            }
        }

        switch (Note) {
            case 0:
                aide.textContent = "🙄🚀 Admit it you are only here because the token will moon 🙄🚀 "
                note.innerText = Note + "/10";
                break;

                
            case 1:
                aide.textContent = "😭 This is really bad actually but you can retry  😭";
                note.innerText = Note + "/10";
                break;

            case 2: 
                aide.textContent = "😭 This is really bad actually but you can retry  😭";
                note.innerText = Note + "/10";
            ;
                break;
        
            case 3:
                aide.textContent = "😭 This is really bad actually but you can retry  😭";
                note.innerText = Note + "/10";
                break;

            case 4:
                aide.textContent = "🤔 You still need to take a look at the documentation ! Then retry ! 🤔";
                note.innerText = Note + "/10";
                break;

            case 5:
                aide.textContent = "🤔 You still need to take a look at the documentation ! Then retry ! 🤔";
                note.innerText = Note + "/10";
                break;

            case 6:
                aide.textContent = "🤔 You still need to take a look at the documentation ! Then retry ! 🤔";
                note.innerText = Note + "/10";
                break;

            case 7: 
                aide.textContent = "😄 You are almost there! Retry! 😄";
                note.innerText = Note + "/10";
                break;
            case 8:
                aide.textContent = "😄 You are almost there! Retry! 😄";
                note.innerText = Note + "/10";
                break;
            case 9:
                aide.textContent = "😄 You are almost there! Retry! 😄";
                note.innerText = Note + "/10";
                break;
            case 10:
                //Si l'utilisateur a trouvé la question secrête et y a répondu
                if (checkHidden())   {
                    Note++;
                    note.innerText = Note + "/10";
                    aide.textContent = "🥇 You are the choosen one ! Let me contact Dominic for you 🥇"
                    break;
                }               


                else {
                    aide.textContent = "✔️ Impressive ! You are ready to build amazing things on the IC ✔️";
                    note.innerText = Note + "/10";
                    break;
                }


            default: console.log("An error has occured");
    }

    }


   


function couleursFonction(tableauResultats) {

    for(let i = 0; i < tableauResultat.length; i++){

        if(tableauResultat[i] === tableauReponses[i]){
            toutesLesQuestions[i].style.background = 'lightgreen';
        } else {
            toutesLesQuestions[i].style.background = '#ffb8b8';
            toutesLesQuestions[i].classList.add('echec');

            setTimeout(() => {
                toutesLesQuestions[i].classList.remove('echec');
            }, 500)
        }
        
    }

}

toutesLesQuestions.forEach (item => {
    item.addEventListener('click' , () => {
    if (item.style.background != "lightgreen") {
        item.style.background = "white";
    }
    }
)})

// Fonction qui permet de vérifier si l'utilisateur a répondu à la question secrète.

function checkHidden () {

       let reponse = document.querySelector(`input[name="bonus"]:checked`).value;
       console.log(reponse);
       if (reponse === "b") {
           return true
       }

       else {
           return false
       }
}