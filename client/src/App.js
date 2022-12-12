"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = __importStar(require("react"));
var Login_1 = __importDefault(require("./Login"));
var Admin_1 = __importDefault(require("./Admin"));
var Questions_1 = __importDefault(require("./Questions"));
var ForgotQuestions_1 = __importDefault(require("./ForgotQuestions"));
var LandingPage_1 = __importDefault(require("./LandingPage"));
var Register_1 = __importDefault(require("./Register"));
var Profile_1 = __importDefault(require("./Profile"));
var EditDocument_1 = __importDefault(require("./EditDocument"));
var Analytics_1 = __importDefault(require("./Analytics"));
function App() {
    var _a = (0, react_1.useState)(''), uid = _a[0], setuid = _a[1];
    var _b = (0, react_1.useState)(''), accessToken = _b[0], setAccessToken = _b[1];
    var getUIDandToken = function (uid1, accessToken1) {
        setuid(uid1);
        setAccessToken(accessToken1);
    };
    (0, react_1.useEffect)(function () {
        console.log("app.tsx2 uid: ".concat(uid));
        console.log("app.tsx2 accessToken: ".concat(accessToken));
    }, [uid, accessToken]);
    console.log("app.tsx1 uid: ".concat(uid));
    console.log("app.tsx1 accessToken: ".concat(accessToken));
    return (react_1.default.createElement("div", { className: "App" },
        react_1.default.createElement(Login_1.default, { func: getUIDandToken }),
        react_1.default.createElement(Register_1.default, null),
        react_1.default.createElement(Questions_1.default, { uid: uid, accessToken: accessToken }),
        react_1.default.createElement(ForgotQuestions_1.default, { uid: uid, accessToken: accessToken }),
        react_1.default.createElement(Profile_1.default, { uid: uid, accessToken: accessToken }),
        react_1.default.createElement(Admin_1.default, { uid: uid, accessToken: accessToken }),
        react_1.default.createElement(Questions_1.default, { uid: uid, accessToken: accessToken }),
        react_1.default.createElement(ForgotQuestions_1.default, { uid: uid, accessToken: accessToken }),
        react_1.default.createElement(Profile_1.default, { uid: uid, accessToken: accessToken }),
        react_1.default.createElement(Admin_1.default, { uid: uid, accessToken: accessToken }),
        react_1.default.createElement(Analytics_1.default, { uid: uid, accessToken: accessToken }),
        react_1.default.createElement("h1", null, "Files"),
        react_1.default.createElement(LandingPage_1.default, null),
        react_1.default.createElement(EditDocument_1.default, { fileId: 'ab03b4c5' })));
}
exports.default = App;
