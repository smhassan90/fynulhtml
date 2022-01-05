const AllConstant = {
    //baseURL: "http://172.16.16.192:8080",
    baseURL: "http://192.168.1.107:8080",
  //  baseURL: "http://192.168.0.52:8080/fs",
    baseString: "encryptTest"
};

function setCookie(cname, cvalue) {
    localStorage.setItem(cname, cvalue);
}

function getCookie(cname) {

    return localStorage.getItem(cname);
}

function clearCookies() {

    localStorage.clear();
}
