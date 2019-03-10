"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = require("axios");
let mockingEnabled = false;
const mocks = {};
function addMock(url, data) {
    mocks[url] = data;
}
exports.addMock = addMock;
function enableMocking(state) {
    mockingEnabled = state;
}
exports.enableMocking = enableMocking;
const isUrlMocked = url => url in mocks;
const getMockError = config => {
    const mockError = new Error();
    // @ts-ignore
    mockError.mockData = mocks[config.url];
    // @ts-ignore
    mockError.config = config;
    return Promise.reject(mockError);
};
const isMockError = error => Boolean(error.mockData);
const getMockResponse = mockError => {
    const { mockData, config } = mockError;
    // Handle mocked error (any non-2xx status code)
    if (mockData.status && String(mockData.status)[0] !== '2') {
        const err = new Error(mockData.message || 'mock error');
        // @ts-ignore
        err.code = mockData.status;
        return Promise.reject(err);
    }
    // Handle mocked success
    return Promise.resolve(Object.assign({
        data: {},
        status: 200,
        statusText: 'OK',
        headers: {},
        config,
        isMock: true
    }, mockData));
};
// Add a request interceptor
axios_1.default.interceptors.request.use(config => {
    if (mockingEnabled && isUrlMocked(config.url)) {
        console.log('axios mocking ' + config.url);
        return getMockError(config);
    }
    return config;
}, error => Promise.reject(error));
// Add a response interceptor
axios_1.default.interceptors.response.use(response => response, error => {
    if (isMockError(error)) {
        return getMockResponse(error);
    }
    return Promise.reject(error);
});
