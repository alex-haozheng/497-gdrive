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
var material_1 = require("@mui/material");
function EditDocument(_a) {
    var _this = this;
    var fileId = _a.fileId;
    var _b = (0, react_1.useState)(), file = _b[0], setFile = _b[1];
    (0, react_1.useEffect)(function () {
        axios_1.default.get("http://localhost:4009/files/".concat(fileId))
            .then(function (res) {
            setFile(res.data);
        })
            .catch(function (err) {
            console.log(err);
        });
    }, [fileId]);
    var handleSave = function (text) { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, axios_1.default.put("http://localhost:4009/files/".concat(fileId), {
                        fileId: file.fileId,
                        name: file.name,
                        size: file.size,
                        tags: file.tags,
                        type: file.type,
                        date: file.date,
                        content: text,
                    })
                        .catch(function (err) {
                        console.log(err);
                    })];
                case 1:
                    _a.sent();
                    handleTextChange(text);
                    return [2 /*return*/];
            }
        });
    }); };
    var getFileContent = function () {
        if (file) {
            return file.content;
        }
        return '';
    };
    var theme = (0, material_1.createTheme)({
        typography: {
            fontFamily: [
                '-apple-system',
                'BlinkMacSystemFont',
                '"Segoe UI"',
                'Roboto',
                '"Helvetica Neue"',
                'Arial',
                'sans-serif',
                '"Apple Color Emoji"',
                '"Segoe UI Emoji"',
                '"Segoe UI Symbol"',
            ].join(','),
        },
    });
    var _c = (0, react_1.useState)(0), wordCount = _c[0], setWordCount = _c[1];
    var handleTextChange = function (text) {
        var wordCount = text.trim().split(/\s+/).length;
        setWordCount(wordCount);
    };
    return (react_1.default.createElement("div", null,
        react_1.default.createElement(material_1.ThemeProvider, { theme: theme },
            react_1.default.createElement(material_1.Box, { display: "flex", flexDirection: "row", justifyContent: "space-between", padding: 15, sx: { paddingBottom: "5px", paddingTop: "5px" } },
                react_1.default.createElement(material_1.Button, { variant: "outlined", color: "primary", sx: { marginBottom: "10px", textTransform: "none" }, onClick: function () { return window.location.href = "/landing"; }, startIcon: react_1.default.createElement("img", { src: "https://img.icons8.com/ios/50/000000/back--v1.png", alt: "back", width: "20px", height: "20px" }) }, "Back"),
                react_1.default.createElement(material_1.Typography, { variant: "h4", component: "div", fontWeight: "bold", sx: { fontFamily: "Helvetica Neue" }, fontSize: "30px", gutterBottom: true }, file === null || file === void 0 ? void 0 : file.name),
                react_1.default.createElement(material_1.Button, { variant: "contained", color: "secondary", sx: { marginBottom: "10px", textTransform: "none" }, onClick: function () { return alert("There are " + wordCount + " word(s) in this document."); } },
                    wordCount,
                    " words")),
            react_1.default.createElement(material_1.Box, { padding: 15, sx: { paddingTop: "0px", paddingBottom: "0px" } },
                react_1.default.createElement(material_1.TextField, { id: "outlined-multiline-static", multiline: true, rows: 30, fullWidth: true, defaultValue: getFileContent(), variant: "outlined", onChange: function (e) { return handleSave(e.target.value); }, sx: { fontFamily: "Helvetica Neue", boxShadow: "5" } })))));
}
exports.default = EditDocument;
