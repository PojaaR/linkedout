/*
 * Copyright 2010-2016 Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * You may not use this file except in compliance with the License.
 * A copy of the License is located at
 *
 *  http://aws.amazon.com/apache2.0
 *
 * or in the "license" file accompanying this file. This file is distributed
 * on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
 * express or implied. See the License for the specific language governing
 * permissions and limitations under the License.
 */

var apigClientFactory = {};
apigClientFactory.newClient = function (config) {
    var apigClient = { };
    if(config === undefined) {
        config = {
            accessKey: '',
            secretKey: '',
            sessionToken: '',
            region: '',
            apiKey: undefined,
            defaultContentType: 'application/json',
            defaultAcceptType: 'application/json'
        };
    }
    if(config.accessKey === undefined) {
        config.accessKey = '';
    }
    if(config.secretKey === undefined) {
        config.secretKey = '';
    }
    if(config.apiKey === undefined) {
        config.apiKey = '';
    }
    if(config.sessionToken === undefined) {
        config.sessionToken = '';
    }
    if(config.region === undefined) {
        config.region = 'us-east-1';
    }
    //If defaultContentType is not defined then default to application/json
    if(config.defaultContentType === undefined) {
        config.defaultContentType = 'application/json';
    }
    //If defaultAcceptType is not defined then default to application/json
    if(config.defaultAcceptType === undefined) {
        config.defaultAcceptType = 'application/json';
    }

    
    // extract endpoint and path from url
    var invokeUrl = 'https://wm3gw0cdg4.execute-api.us-east-1.amazonaws.com/prod';
    var endpoint = /(^https?:\/\/[^\/]+)/g.exec(invokeUrl)[1];
    var pathComponent = invokeUrl.substring(endpoint.length);

    var sigV4ClientConfig = {
        accessKey: config.accessKey,
        secretKey: config.secretKey,
        sessionToken: config.sessionToken,
        serviceName: 'execute-api',
        region: config.region,
        endpoint: endpoint,
        defaultContentType: config.defaultContentType,
        defaultAcceptType: config.defaultAcceptType
    };

    var authType = 'NONE';
    if (sigV4ClientConfig.accessKey !== undefined && sigV4ClientConfig.accessKey !== '' && sigV4ClientConfig.secretKey !== undefined && sigV4ClientConfig.secretKey !== '') {
        authType = 'AWS_IAM';
    }

    var simpleHttpClientConfig = {
        endpoint: endpoint,
        defaultContentType: config.defaultContentType,
        defaultAcceptType: config.defaultAcceptType
    };

    var apiGatewayClient = apiGateway.core.apiGatewayClientFactory.newClient(simpleHttpClientConfig, sigV4ClientConfig);
    
    
    
    apigClient.getcollaborativerecosGet = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }
        
        apiGateway.core.utils.assertParametersDefined(params, ['userid'], ['body']);
        
        var getcollaborativerecosGetRequest = {
            verb: 'get'.toUpperCase(),
            path: pathComponent + uritemplate('/getcollaborativerecos').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, ['userid']),
            body: body
        };
        
        
        return apiGatewayClient.makeRequest(getcollaborativerecosGetRequest, authType, additionalParams, config.apiKey);
    };
    
    
    apigClient.getcollaborativerecosOptions = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }
        
        apiGateway.core.utils.assertParametersDefined(params, [], ['body']);
        
        var getcollaborativerecosOptionsRequest = {
            verb: 'options'.toUpperCase(),
            path: pathComponent + uritemplate('/getcollaborativerecos').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };
        
        
        return apiGatewayClient.makeRequest(getcollaborativerecosOptionsRequest, authType, additionalParams, config.apiKey);
    };
    
    
    apigClient.getcontentbasedrecosGet = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }
        
        apiGateway.core.utils.assertParametersDefined(params, ['userid'], ['body']);
        
        var getcontentbasedrecosGetRequest = {
            verb: 'get'.toUpperCase(),
            path: pathComponent + uritemplate('/getcontentbasedrecos').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, ['userid']),
            body: body
        };
        
        
        return apiGatewayClient.makeRequest(getcontentbasedrecosGetRequest, authType, additionalParams, config.apiKey);
    };
    
    
    apigClient.getcontentbasedrecosOptions = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }
        
        apiGateway.core.utils.assertParametersDefined(params, [], ['body']);
        
        var getcontentbasedrecosOptionsRequest = {
            verb: 'options'.toUpperCase(),
            path: pathComponent + uritemplate('/getcontentbasedrecos').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };
        
        
        return apiGatewayClient.makeRequest(getcontentbasedrecosOptionsRequest, authType, additionalParams, config.apiKey);
    };
    
    
    apigClient.getjobbatchPost = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }
        
        apiGateway.core.utils.assertParametersDefined(params, ['body'], ['body']);
        
        var getjobbatchPostRequest = {
            verb: 'post'.toUpperCase(),
            path: pathComponent + uritemplate('/getjobbatch').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };
        
        
        return apiGatewayClient.makeRequest(getjobbatchPostRequest, authType, additionalParams, config.apiKey);
    };
    
    
    apigClient.getjobbatchOptions = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }
        
        apiGateway.core.utils.assertParametersDefined(params, [], ['body']);
        
        var getjobbatchOptionsRequest = {
            verb: 'options'.toUpperCase(),
            path: pathComponent + uritemplate('/getjobbatch').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };
        
        
        return apiGatewayClient.makeRequest(getjobbatchOptionsRequest, authType, additionalParams, config.apiKey);
    };
    
    
    apigClient.likejobPut = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }
        
        apiGateway.core.utils.assertParametersDefined(params, ['userid', 'jobid'], ['body']);
        
        var likejobPutRequest = {
            verb: 'put'.toUpperCase(),
            path: pathComponent + uritemplate('/likejob').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, ['userid', 'jobid']),
            body: body
        };
        
        
        return apiGatewayClient.makeRequest(likejobPutRequest, authType, additionalParams, config.apiKey);
    };
    
    
    apigClient.likejobOptions = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }
        
        apiGateway.core.utils.assertParametersDefined(params, [], ['body']);
        
        var likejobOptionsRequest = {
            verb: 'options'.toUpperCase(),
            path: pathComponent + uritemplate('/likejob').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };
        
        
        return apiGatewayClient.makeRequest(likejobOptionsRequest, authType, additionalParams, config.apiKey);
    };
    
    
    apigClient.putdetailsPut = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }
        
        apiGateway.core.utils.assertParametersDefined(params, [], ['body']);
        
        var putdetailsPutRequest = {
            verb: 'put'.toUpperCase(),
            path: pathComponent + uritemplate('/putdetails').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };
        
        
        return apiGatewayClient.makeRequest(putdetailsPutRequest, authType, additionalParams, config.apiKey);
    };
    
    
    apigClient.putdetailsOptions = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }
        
        apiGateway.core.utils.assertParametersDefined(params, [], ['body']);
        
        var putdetailsOptionsRequest = {
            verb: 'options'.toUpperCase(),
            path: pathComponent + uritemplate('/putdetails').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };
        
        
        return apiGatewayClient.makeRequest(putdetailsOptionsRequest, authType, additionalParams, config.apiKey);
    };
    
    
    apigClient.putuserdetailsPut = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }
        
        apiGateway.core.utils.assertParametersDefined(params, [], ['body']);
        
        var putuserdetailsPutRequest = {
            verb: 'put'.toUpperCase(),
            path: pathComponent + uritemplate('/putuserdetails').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };
        
        
        return apiGatewayClient.makeRequest(putuserdetailsPutRequest, authType, additionalParams, config.apiKey);
    };
    
    
    apigClient.putuserdetailsOptions = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }
        
        apiGateway.core.utils.assertParametersDefined(params, [], ['body']);
        
        var putuserdetailsOptionsRequest = {
            verb: 'options'.toUpperCase(),
            path: pathComponent + uritemplate('/putuserdetails').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };
        
        
        return apiGatewayClient.makeRequest(putuserdetailsOptionsRequest, authType, additionalParams, config.apiKey);
    };
    
    
    apigClient.searchjobbytagGet = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }
        
        apiGateway.core.utils.assertParametersDefined(params, ['tag'], ['body']);
        
        var searchjobbytagGetRequest = {
            verb: 'get'.toUpperCase(),
            path: pathComponent + uritemplate('/searchjobbytag').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, ['tag']),
            body: body
        };
        
        
        return apiGatewayClient.makeRequest(searchjobbytagGetRequest, authType, additionalParams, config.apiKey);
    };
    
    
    apigClient.searchjobbytagOptions = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }
        
        apiGateway.core.utils.assertParametersDefined(params, [], ['body']);
        
        var searchjobbytagOptionsRequest = {
            verb: 'options'.toUpperCase(),
            path: pathComponent + uritemplate('/searchjobbytag').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };
        
        
        return apiGatewayClient.makeRequest(searchjobbytagOptionsRequest, authType, additionalParams, config.apiKey);
    };
    
    
    apigClient.sendemailPut = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }
        
        apiGateway.core.utils.assertParametersDefined(params, ['user_id', 'email_id', 'job_id'], ['body']);
        
        var sendemailPutRequest = {
            verb: 'put'.toUpperCase(),
            path: pathComponent + uritemplate('/sendemail').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, ['user_id', 'email_id', 'job_id']),
            body: body
        };
        
        
        return apiGatewayClient.makeRequest(sendemailPutRequest, authType, additionalParams, config.apiKey);
    };
    
    
    apigClient.sendemailOptions = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }
        
        apiGateway.core.utils.assertParametersDefined(params, [], ['body']);
        
        var sendemailOptionsRequest = {
            verb: 'options'.toUpperCase(),
            path: pathComponent + uritemplate('/sendemail').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };
        
        
        return apiGatewayClient.makeRequest(sendemailOptionsRequest, authType, additionalParams, config.apiKey);
    };
    
    
    apigClient.unlikejobPut = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }
        
        apiGateway.core.utils.assertParametersDefined(params, ['userid', 'jobid'], ['body']);
        
        var unlikejobPutRequest = {
            verb: 'put'.toUpperCase(),
            path: pathComponent + uritemplate('/unlikejob').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, ['userid', 'jobid']),
            body: body
        };
        
        
        return apiGatewayClient.makeRequest(unlikejobPutRequest, authType, additionalParams, config.apiKey);
    };
    
    
    apigClient.unlikejobOptions = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }
        
        apiGateway.core.utils.assertParametersDefined(params, [], ['body']);
        
        var unlikejobOptionsRequest = {
            verb: 'options'.toUpperCase(),
            path: pathComponent + uritemplate('/unlikejob').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };
        
        
        return apiGatewayClient.makeRequest(unlikejobOptionsRequest, authType, additionalParams, config.apiKey);
    };
    
    
    apigClient.uploadresumeFolderObjectPut = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }
        
        apiGateway.core.utils.assertParametersDefined(params, ['object', 'folder', 'Content-Type', 'x-amz-meta-customLabels'], ['body']);
        
        var uploadresumeFolderObjectPutRequest = {
            verb: 'put'.toUpperCase(),
            path: pathComponent + uritemplate('/uploadresume/{folder}/{object}').expand(apiGateway.core.utils.parseParametersToObject(params, ['object', 'folder', ])),
            headers: apiGateway.core.utils.parseParametersToObject(params, ['Content-Type', 'x-amz-meta-customLabels']),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };
        
        
        return apiGatewayClient.makeRequest(uploadresumeFolderObjectPutRequest, authType, additionalParams, config.apiKey);
    };
    
    
    apigClient.uploadresumeFolderObjectOptions = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }
        
        apiGateway.core.utils.assertParametersDefined(params, ['Content-Type', 'x-amz-meta-customLabels'], ['body']);
        
        var uploadresumeFolderObjectOptionsRequest = {
            verb: 'options'.toUpperCase(),
            path: pathComponent + uritemplate('/uploadresume/{folder}/{object}').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, ['Content-Type', 'x-amz-meta-customLabels']),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };
        
        
        return apiGatewayClient.makeRequest(uploadresumeFolderObjectOptionsRequest, authType, additionalParams, config.apiKey);
    };
    
    
    apigClient.viewjobGet = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }
        
        apiGateway.core.utils.assertParametersDefined(params, ['id'], ['body']);
        
        var viewjobGetRequest = {
            verb: 'get'.toUpperCase(),
            path: pathComponent + uritemplate('/viewjob').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, ['id']),
            body: body
        };
        
        
        return apiGatewayClient.makeRequest(viewjobGetRequest, authType, additionalParams, config.apiKey);
    };
    
    
    apigClient.viewjobOptions = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }
        
        apiGateway.core.utils.assertParametersDefined(params, [], ['body']);
        
        var viewjobOptionsRequest = {
            verb: 'options'.toUpperCase(),
            path: pathComponent + uritemplate('/viewjob').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };
        
        
        return apiGatewayClient.makeRequest(viewjobOptionsRequest, authType, additionalParams, config.apiKey);
    };
    
    
    apigClient.viewuserdetailsGet = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }
        
        apiGateway.core.utils.assertParametersDefined(params, ['userid'], ['body']);
        
        var viewuserdetailsGetRequest = {
            verb: 'get'.toUpperCase(),
            path: pathComponent + uritemplate('/viewuserdetails').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, ['userid']),
            body: body
        };
        
        
        return apiGatewayClient.makeRequest(viewuserdetailsGetRequest, authType, additionalParams, config.apiKey);
    };
    
    
    apigClient.viewuserdetailsOptions = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }
        
        apiGateway.core.utils.assertParametersDefined(params, [], ['body']);
        
        var viewuserdetailsOptionsRequest = {
            verb: 'options'.toUpperCase(),
            path: pathComponent + uritemplate('/viewuserdetails').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };
        
        
        return apiGatewayClient.makeRequest(viewuserdetailsOptionsRequest, authType, additionalParams, config.apiKey);
    };
    

    return apigClient;
};
