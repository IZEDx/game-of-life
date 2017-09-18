

export function nop() {}

export function get(url : string){
    return new Promise((resolve : (str) => void) =>{
        let xmlHttp = new XMLHttpRequest();
        xmlHttp.onreadystatechange = function() {
            if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
                resolve(xmlHttp.responseText);
        };
        xmlHttp.open("GET", url, true);
        xmlHttp.send(null);
    });
}

export function getByClass(str : string){

}