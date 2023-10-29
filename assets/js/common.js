const AllConstant = {
    baseURL: "http://172.16.16.169:8080",
    //baseURL: "http://192.168.100.167:8080",
    //baseURL: "http://192.168.0.52:8080/fs",
   // baseURL: "http://203.101.163.58:8080/fs",
    baseString: "encryptTest",
    timeout: "999999"
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
