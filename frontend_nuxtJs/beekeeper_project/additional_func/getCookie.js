export default function getCookie(c_name, cookie) {
    if (cookie){
        if (cookie.length > 0) {
            let c_start = cookie.indexOf(c_name + "=");
            if (c_start != -1) {
                c_start = c_start + c_name.length + 1;
                let c_end = cookie.indexOf(";", c_start);
                if (c_end == -1) {
                    c_end = cookie.length;
                }
                console.log(c_start, c_end)
                return unescape(cookie.substring(c_start, c_end));
            }
        }
    }
    
    return "";
}