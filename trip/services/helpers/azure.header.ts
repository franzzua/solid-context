export function azureHeader(key){
    return {
        ['Ocp-Apim-Subscription-Key']: key
    };
}