import apiRequest from "./apirequest.js";

/* A data model that represents a user. As of now mainly to handle hashed IP as user ID */
export default class User {
    constructor(){
        this.id = null;
    }

    /* Call to submit a hash of the user's IP address as the user ID */
    async logIn(){
        let ipAddress;
        try {
            ipAddress = await this.getIpAddress();
        } catch (error) {
            throw new Error(error);
        }
        let ipAddressHashed = await this.getHash(ipAddress);
        this.id = ipAddressHashed;
        await apiRequest("POST", "/users", {id: ipAddressHashed});
    }

    async getIpAddress() {
        try {
            // Make an AJAX request to a server-side endpoint that returns the IP address
            let response = await fetch('https://api.ipify.org/?format=json');
            let data = await response.json();
            let ipAddress = data.ip;
            return ipAddress;
        } catch (error) {
            throw new Error('Error retrieving IP address: ' + error.message);
        }
    }

    /* Helper function that creates a hash of the given string. Code is from an external source */
    async getHash(str){
        const encoder = new TextEncoder();
        const data = encoder.encode(str);

        // Generate the hash using the SHA-256 algorithm
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);

        // Convert the hash buffer to a hexadecimal string
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');

        return hashHex;
    }
}