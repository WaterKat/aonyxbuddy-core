//const scriptURI = 'https://aonyxlimited.com/api/apps/browser-client';
//const token = 'this-is-a-code';

declare const uri: string;
declare const token: string;

async function GetScript() : Promise<string> {
    const scriptRequest = fetch(uri, {
        method: "GET",
        cache: "no-cache",
        redirect: "follow",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });

    return await (await scriptRequest).text();
}

GetScript().then(content => eval(content));