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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = __importStar(require("react"));
var axios_1 = __importDefault(require("axios"));
var material_1 = require("@mui/material");
var UploadFile = function () {
    var _a = (0, react_1.useState)(null), file = _a[0], setFile = _a[1];
    var _b = (0, react_1.useState)([]), fileList = _b[0], setFileList = _b[1];
    var handleFileChange = function (e) {
        setFile(e.target.files[0]);
    };
    var handleFileSubmit = function (e) { return __awaiter(void 0, void 0, void 0, function () {
        var fileContent, fileName;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    e.preventDefault();
                    return [4 /*yield*/, file.text()];
                case 1:
                    fileContent = _a.sent();
                    fileName = file.name.replace(/.txt$/, '');
                    return [4 /*yield*/, axios_1.default.post('http://localhost:4011/files/upload', {
                            name: fileName,
                            content: fileContent,
                        }).then(function (res) {
                            window.location.reload();
                        })];
                case 2:
                    _a.sent();
                    setFile(null);
                    setFileList(__spreadArray(__spreadArray([], fileList, true), [file], false));
                    return [2 /*return*/];
            }
        });
    }); };
    return (react_1.default.createElement(material_1.Box, { sx: { position: 'relative', marginBottom: 3 } },
        react_1.default.createElement("form", { onSubmit: handleFileSubmit, style: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' } },
            react_1.default.createElement("input", { type: "file", onChange: handleFileChange, style: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', marginLeft: 50 } }),
            react_1.default.createElement(material_1.Button, { variant: "outlined", color: "primary", type: "submit", sx: { width: 200, position: 'relative', alignItems: 'center', textTransform: "none", fontFamily: "Helvetica Neue" }, startIcon: react_1.default.createElement("img", { src: "https://img.icons8.com/ios/50/000000/upload.png", alt: "upload", width: "20", height: "20" }) }, "Upload"))));
};
var DownloadButton = function (_a) {
    var fileId = _a.fileId, fileName = _a.fileName;
    var handleDownload = function () { return __awaiter(void 0, void 0, void 0, function () {
        var res, url, link;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, axios_1.default.get("http://localhost:4011/files/".concat(fileId, "/download"))];
                case 1:
                    res = _a.sent();
                    url = window.URL.createObjectURL(new Blob([JSON.stringify(res.data.content)]));
                    link = document.createElement('a');
                    link.href = url;
                    link.setAttribute('download', "".concat(fileName));
                    document.body.appendChild(link);
                    link.click();
                    return [2 /*return*/];
            }
        });
    }); };
    return (react_1.default.createElement(material_1.Button, { variant: "outlined", color: "primary", onClick: handleDownload, sx: { width: 200, position: 'relative', textTransform: "none", fontFamily: "Helvetica Neue", top: 72 }, startIcon: react_1.default.createElement("img", { src: "https://img.icons8.com/ios/50/000000/download.png", alt: "download", width: "20", height: "20" }) }, "Download"));
};
var handleDelete = function (fileId) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, axios_1.default.delete("http://localhost:4009/files/".concat(fileId)).then(function (res) {
                    window.location.reload();
                })];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
var ListFiles = function () {
    var _a = (0, react_1.useState)([]), fileList = _a[0], setFileList = _a[1];
    (0, react_1.useEffect)(function () {
        axios_1.default.get('http://localhost:4009/files').then(function (res) {
            setFileList(res.data.files);
        });
    }, []);
    return (react_1.default.createElement(material_1.Grid, { container: true, spacing: 2, direction: "row", justifyContent: "center", alignItems: "center" }, fileList.map(function (file) {
        return (react_1.default.createElement(material_1.Box, { key: file.fileId, sx: { width: 200, height: 300, bgcolor: 'white', borderRadius: 2, boxShadow: 2, p: 2, m: 2 } },
            react_1.default.createElement(material_1.Typography, { variant: "h6", component: "div", gutterBottom: true, sx: { fontFamily: "Helvetica Neue" } }, file.name.slice(0, file.name.length - 4)),
            react_1.default.createElement(material_1.Typography, { variant: "body2", gutterBottom: true, sx: { fontFamily: "Helvetica Neue" } },
                file.content.slice(0, 25),
                "..."),
            react_1.default.createElement(material_1.Typography, { variant: "body2", gutterBottom: true, sx: { position: 'relative', top: 70, fontFamily: "Helvetica Neue", color: "grey" } },
                "Last Modified ",
                file.date.toLocaleString().slice(0, 10)),
            react_1.default.createElement(material_1.Button, { variant: "contained", color: "success", sx: { width: 200, textTransform: "none", position: 'relative', top: 77, marginBottom: 2 } }, "Edit"),
            react_1.default.createElement(material_1.Button, { variant: "outlined", color: "error", sx: { width: 200, textTransform: "none", position: 'relative', top: 73, marginBottom: 2 }, onClick: function () { handleDelete(file.fileId); } }, "Delete"),
            react_1.default.createElement(DownloadButton, { fileId: file.fileId, fileName: file.name })));
    })));
};
var LandingPage = function () {
    return (react_1.default.createElement("div", null,
        react_1.default.createElement(UploadFile, null),
        react_1.default.createElement(ListFiles, null)));
};
exports.default = LandingPage;
