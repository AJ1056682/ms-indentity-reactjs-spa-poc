/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

export const callApiWithToken = async(accessToken, apiEndpoint, httpMethod = 'GET', body) => {
    const headers = new Headers();
    const bearer = `Bearer ${accessToken}`;

    headers.append("Authorization", bearer);
    headers.append("Content-Type", 'application/json');

    const options = {
        method: httpMethod,
        headers: headers,
        ...(['PUT', 'POST'].includes(httpMethod.toUpperCase()) && { body: JSON.stringify(body) })
    };
    
    return fetch(apiEndpoint, options)
        .then(response => response.json())
        .catch(error => console.log(error));
}