let data

fetch('https://finalspaceapi.com/api/v0/character/')
.then(res => res.json())
.then(res => data = res)
.catch(err => console.log(err));

