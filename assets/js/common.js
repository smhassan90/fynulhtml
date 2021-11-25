const AllConstant = {
    baseURL: "http://172.16.16.192:8080",
    baseString: "encryptTest"
};

function setCookie(cname, cvalue) {
    localStorage.setItem(cname, cvalue);
}

function getCookie(cname) {

    return localStorage.getItem(cname);
}