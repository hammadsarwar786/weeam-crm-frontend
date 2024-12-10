export const constant = {

    baseUrl: (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') ? "http://localhost:5000/" : "https://server.idxdubai.com/",
    server2: "https://testing.idxdubai.com/"
    //  baseUrl: (!process.env.NODE_ENV || process.env.NODE_ENV === 'https://crm-stage.weeam.info/') ? "http://localhost:5000/" : "https://server.idxdubai.com/",
    // server2: "https://testing.idxdubai.com/"
}
