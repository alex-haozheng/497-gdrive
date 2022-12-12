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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = __importStar(require("react"));
var axios_1 = __importDefault(require("axios"));
var Profile = function (_a) {
    var uid = _a.uid, accessToken = _a.accessToken;
    var _b = (0, react_1.useState)('blank'), username = _b[0], setUsername = _b[1];
    var _c = (0, react_1.useState)('blank'), name = _c[0], setName = _c[1];
    var _d = (0, react_1.useState)('blank'), email = _d[0], setEmail = _d[1];
    var _e = (0, react_1.useState)('blank'), bio = _e[0], setBio = _e[1];
    var _f = (0, react_1.useState)('blank'), funFact = _f[0], setFunFact = _f[1];
    var _g = (0, react_1.useState)(false), onEdit = _g[0], setOnEdit = _g[1];
    var fetchProfile = function () { return __awaiter(void 0, void 0, void 0, function () {
        var res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, axios_1.default.get("http://localhost:4002/getProfile/".concat(uid, "/").concat(accessToken))];
                case 1:
                    res = _a.sent();
                    setUsername(res.data.uid);
                    setName(res.data.name);
                    setEmail(res.data.email);
                    setBio(res.data.bio);
                    setFunFact(res.data.funFact);
                    console.log(res.data);
                    return [2 /*return*/];
            }
        });
    }); };
    (0, react_1.useEffect)(function () {
        fetchProfile();
    }, []);
    var onSubmit = function (event) { return __awaiter(void 0, void 0, void 0, function () {
        var profile;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    event.preventDefault();
                    if (!(onEdit === true)) return [3 /*break*/, 2];
                    profile = {
                        uid: uid,
                        name: name,
                        email: email,
                        bio: bio,
                        funFact: funFact
                    };
                    if (profile.uid === "") {
                        profile.uid = "blank";
                        setUsername("blank");
                    }
                    if (profile.name === "") {
                        profile.name = "blank";
                        setName("blank");
                    }
                    if (profile.email === "") {
                        profile.email = "blank";
                        setEmail("blank");
                    }
                    if (profile.bio === "") {
                        profile.bio = "blank";
                        setBio("blank");
                    }
                    if (profile.funFact === "") {
                        profile.funFact = "blank";
                        setFunFact("blank");
                    }
                    return [4 /*yield*/, axios_1.default.put("http://localhost:4002/updateProfile/".concat(uid, "/").concat(name, "/").concat(email, "/").concat(bio, "/").concat(funFact, "/").concat(accessToken))];
                case 1:
                    _a.sent();
                    //setProfile(profile);
                    console.log(profile);
                    _a.label = 2;
                case 2:
                    setOnEdit(!onEdit);
                    return [2 /*return*/];
            }
        });
    }); };
    var renderedProfile = (onEdit ?
        react_1.default.createElement("div", null,
            react_1.default.createElement("form", { onSubmit: onSubmit },
                react_1.default.createElement("button", { className: "btn btn-primary" }, "Save")),
            react_1.default.createElement("h3", null, "Username:"),
            react_1.default.createElement("input", { value: username, onChange: function (e) { return setUsername(e.target.value); }, className: "form-control" }),
            react_1.default.createElement("h3", null, "Name:"),
            react_1.default.createElement("input", { value: name, onChange: function (e) { return setName(e.target.value); }, className: "form-control" }),
            react_1.default.createElement("h3", null, "Email:"),
            react_1.default.createElement("input", { value: email, onChange: function (e) { return setEmail(e.target.value); }, className: "form-control" }),
            react_1.default.createElement("h3", null, "Bio:"),
            react_1.default.createElement("input", { value: bio, onChange: function (e) { return setBio(e.target.value); }, className: "form-control" }),
            react_1.default.createElement("h3", null, "Fun fact:"),
            react_1.default.createElement("input", { value: funFact, onChange: function (e) { return setFunFact(e.target.value); }, className: "form-control" }))
        :
            react_1.default.createElement("div", null,
                react_1.default.createElement("form", { onSubmit: onSubmit },
                    react_1.default.createElement("button", { className: "btn btn-primary" }, "Edit")),
                react_1.default.createElement("h3", null,
                    "Username: ",
                    username),
                react_1.default.createElement("h3", null,
                    "Name: ",
                    name),
                react_1.default.createElement("h3", null,
                    "Email: ",
                    email),
                react_1.default.createElement("h3", null,
                    "Bio: ",
                    bio),
                react_1.default.createElement("h3", null,
                    "Fun fact: ",
                    funFact)));
    return (react_1.default.createElement("div", null,
        react_1.default.createElement("h1", null, "Profile"),
        react_1.default.createElement("div", { className: "card" },
            react_1.default.createElement("div", { className: "card-body", style: { backgroundColor: 'pink', margin: '5%', border: '1px solid black' } }, renderedProfile))));
};
exports.default = Profile;
