import apiRequest, { HTTPError } from "./apirequest.js";
import App from "./app.js";

const testApp = async () => {
    let res = await apiRequest("GET", "/");
    console.log(res.message);
};
window.testApp = testApp;

const main = () => {
    new App();
};
main();