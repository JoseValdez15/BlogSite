const blogTitleField = document.querySelector('.title');
const articleField = document.querySelector('.article');


const bannerImage = document.querySelector('#banner-upload');
const banner = document.querySelector('.banner');
let bannerPath;

const publishBtn = document.querySelector('.publish-btn');
const uploadInput = document.querySelector('#image-upload');

bannerImage.addEventListener('change', () => {
    uploadImage(bannerImage, "banner");
})

uploadInput.addEventListener('change', () => {
    uploadImage(uploadInput, "image");
})

const uploadImage = (uploadFile, uploadType) => {
    const [file] = uploadFile.files;
    //makes sure the uploaded file is an image only
    if(file && file.type.includes("image")){
        const formdata = new FormData();
        formdata.append('image', file);

        fetch('/upload', {
            method: 'post',
            body: formdata
        }).then(res => res.json())
        .then(data => {
            if(uploadType == "image"){
                addImage(data, file.name);
            }else{
                bannerPath = `${location.origin}/${data}`;
                banner.style.backgroundImage = `url("${bannerPath}")`;
            }
        })
    }else{
        alert("upload image only");
    }
}

const addImage = (imagepath, alt) => {
    //gives cursor position to add image text to it
    let curPos = articleField.selectionStart;
    //image inside will be in this format
    let textToInsert = `\r![${alt}](${imagepath})\r`;
    articleField.value = articleField.value.slice(0, curPos) 
    + textToInsert + articleField.value.slice(curPos);
}

let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];


publishBtn.addEventListener('click', () => {
    if(articleField.value.length && blogTitleField.value.length){
        let docName; 
        if(blogID[0] == 'editor'){
            // generating id
            let letters = 'abcdefghijklmnopqrstuvwxyz';
            let blogTitle = blogTitleField.value.split(" ").join("-");
            let id = '';
            for(let i = 0; i < 4; i++){
                id += letters[Math.floor(Math.random() * letters.length)];
            }
            docName = `${blogTitle}-${id}`;
        } else{
            docName = decodeURI(blogID[0]);
        }
        

        // setting up docName
        
        let date = new Date(); // for published at info

        //access firstore with db variable;
        db.collection("blogs").doc(docName).set({
            title: blogTitleField.value,
            article: articleField.value,
            bannerImage: bannerPath,
            publishedAt: `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`,
            author: auth.currentUser.email.split("@")[0]
        })
        .then(() => {
            location.href = `/${docName}`;
        })
        .catch((err) => {
            console.error(err);
        })
    }
})

//checking for user logged in or not

auth.onAuthStateChanged((user) =>{
    if(!user){
        location.replace("/admin");//this will redirect to admin route if no one is logged on
    }
})

//checking for exisitng blog edits

let blogID = location.pathname.split('/');
blogID.shift();//removes first elements which is empty from the array
if(blogID[0] != "editor"){
    //means we are in existing blog edit route
    let docRef = db.collection("blogs").doc(decodeURI(blogID[0]));
    docRef.get().then((doc) => {
        if(doc.exists){
            let data = doc.data();
            bannerPath = data.bannerImage;
            banner.style.backgroundImage = `url(${bannerPath})`;
            blogTitleField.value = data.title;
            articleField.value = data.article;
        }else{
            location.replace('/');//home route
        }
    })
}