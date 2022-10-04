"use strict";
exports.__esModule = true;
var https = require('https');
var RequestClient = /** @class */ (function () {
    function RequestClient(publishable_key, secret_key, test_mode) {
        this.prod_base_url = 'payment.intasend.com';
        this.test_base_url = 'sandbox.intasend.com';
        this.publishable_key = publishable_key;
        this.secret_key = secret_key;
        this.test_mode = test_mode;
    }
    RequestClient.prototype.send = function (payload, service_path, req_method) {
        var _this = this;
        var method = req_method || 'POST';
        return new Promise(function (resolve, reject) {
            var base_url = _this.prod_base_url;
            if (_this.test_mode) {
                base_url = _this.test_base_url;
            }
            var headers = { 'Content-Type': 'application/json' };
            if (_this.secret_key) {
                headers['Authorization'] = "Bearer ".concat(_this.secret_key);
            }
            if (_this.publishable_key) {
                payload['public_key'] = _this.publishable_key;
            }
            var options = {
                hostname: base_url,
                port: 443,
                path: service_path,
                method: method,
                headers: headers
            };
            var req = https.request(options, function (res) {
                console.log("statusCode: ".concat(res.statusCode));
                if (res.statusCode !== 201 && res.statusCode !== 200) {
                    console.log("Resp Code: ".concat(res.statusCode));
                    res.resume();
                    res.on('data', function (data) {
                        reject(data);
                    });
                    return;
                }
                console.log("Resp Code: ".concat(res.statusCode));
                res.on('data', function (data) {
                    resolve(data);
                    return;
                });
            });
            req.on('error', function (err) {
                reject(err.message);
                return;
            });
            if (payload) {
                req.write(JSON.stringify(payload));
            }
            req.end();
        });
    };
    return RequestClient;
}());
exports["default"] = RequestClient;