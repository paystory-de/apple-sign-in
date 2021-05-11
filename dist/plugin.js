var SignInWithApple = (function (exports, core, $script) {
    'use strict';

    const SignInWithApple = core.registerPlugin('SignInWithApple', {
        web: () => Promise.resolve().then(function () { return web; }).then(m => new m.SignInWithAppleWeb()),
    });

    class SignInWithAppleWeb extends core.WebPlugin {
        constructor() {
            super({
                name: 'SignInWithApple',
                platforms: ['web'],
            });
            this.appleScriptUrl = 'https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js';
            this.isAppleScriptLoaded = false;
        }
        async authorize(options) {
            return new Promise((resolve, reject) => {
                if (options) {
                    this.loadSignInWithAppleJS().then(loaded => {
                        var _a, _b, _c;
                        this.isAppleScriptLoaded = loaded;
                        if (this.isAppleScriptLoaded) {
                            AppleID.auth.init({
                                clientId: options.clientId,
                                redirectURI: options.redirectURI,
                                scope: (_a = options.scopes) !== null && _a !== void 0 ? _a : undefined,
                                state: (_b = options.state) !== null && _b !== void 0 ? _b : undefined,
                                nonce: (_c = options.nonce) !== null && _c !== void 0 ? _c : undefined,
                                usePopup: true,
                            });
                            AppleID.auth
                                .signIn()
                                .then((res) => {
                                var _a, _b, _c;
                                const response = {
                                    response: {
                                        user: null,
                                        email: (_a = res.user) === null || _a === void 0 ? void 0 : _a.email,
                                        givenName: (_b = res.user) === null || _b === void 0 ? void 0 : _b.name.firstName,
                                        familyName: (_c = res.user) === null || _c === void 0 ? void 0 : _c.name.lastName,
                                        identityToken: res.authorization.id_token,
                                        authorizationCode: res.authorization.code,
                                    },
                                };
                                resolve(response);
                            })
                                .catch((err) => {
                                reject(err);
                            });
                        }
                        else {
                            reject('Unable to load Sign in with Apple JS framework.');
                        }
                    });
                }
                else {
                    reject('No options were provided.');
                }
            });
        }
        loadSignInWithAppleJS() {
            return new Promise(resolve => {
                if (!this.isAppleScriptLoaded) {
                    if (typeof window !== undefined) {
                        $script.get(this.appleScriptUrl, () => resolve(true));
                    }
                    else {
                        resolve(false);
                    }
                }
                else {
                    resolve(true);
                }
            });
        }
    }

    var web = /*#__PURE__*/Object.freeze({
        __proto__: null,
        SignInWithAppleWeb: SignInWithAppleWeb
    });

    exports.SignInWithApple = SignInWithApple;

    Object.defineProperty(exports, '__esModule', { value: true });

    return exports;

}({}, capacitorExports, scriptjs));
//# sourceMappingURL=plugin.js.map
