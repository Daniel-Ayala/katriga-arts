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
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
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
var createClient = require("@libsql/client").createClient;
var fs = require("fs/promises");
var path = require("path");
var ASTRO_DB_REMOTE_URL = "libsql://katrigaart-danielayala.aws-eu-west-1.turso.io";
var ASTRO_DB_APP_TOKEN = "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NDk0NzA1NjEsImlkIjoiNTc0MGY5NmQtYjVlNC00MWNiLThjYTgtMmNlNDNmYWI5ODA4IiwicmlkIjoiZGJlZGNiMTEtOGExNS00N2ZhLWIxNjgtMWVmYWJiOTM4ODZmIn0.6aSuUjCPSjEfPBwfq_GKQ904Nl5-zQoDaTvDLUs2CqFXxUWRPFQIuOgKQEtS3iJ_WLdPJjgcS2-9e4-HGLgrCw";
// Fix the client initialization - use the constants directly
var client = createClient({
    url: ASTRO_DB_REMOTE_URL,
    authToken: ASTRO_DB_APP_TOKEN,
});
// Rest of your code...
function migrateGalleryToTurso() {
    return __awaiter(this, void 0, void 0, function () {
        var jsonPath, data, pictures, processedCategories, i, _i, pictures_1, picture, imagePath, imageBuffer, pictureResult, pictureId, _a, _b, categoryName, categoryId, categoryCheck, categoryResult, error_1;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 16, , 17]);
                    console.log("Starting migration...");
                    jsonPath = path.join(process.cwd(), "src/data/gallery.json");
                    return [4 /*yield*/, fs.readFile(jsonPath, "utf-8")];
                case 1:
                    data = _c.sent();
                    pictures = JSON.parse(data);
                    processedCategories = new Map();
                    i = 0;
                    _i = 0, pictures_1 = pictures;
                    _c.label = 2;
                case 2:
                    if (!(_i < pictures_1.length)) return [3 /*break*/, 15];
                    picture = pictures_1[_i];
                    console.log("Processing picture: ".concat(picture.alt));
                    imagePath = path.join("./public", picture.src);
                    return [4 /*yield*/, fs.readFile(imagePath)];
                case 3:
                    imageBuffer = _c.sent();
                    return [4 /*yield*/, client.execute({
                            sql: "INSERT INTO Pictures (picture, alt, title, description, priority) VALUES (?, ?, ?, ?, ?) RETURNING id",
                            args: [
                                imageBuffer,
                                picture.alt,
                                picture.title || "",
                                picture.description || "",
                                i++,
                            ],
                        })];
                case 4:
                    pictureResult = _c.sent();
                    pictureId = pictureResult.rows[0].id;
                    _a = 0, _b = picture.category;
                    _c.label = 5;
                case 5:
                    if (!(_a < _b.length)) return [3 /*break*/, 14];
                    categoryName = _b[_a];
                    categoryId = void 0;
                    if (!processedCategories.has(categoryName)) return [3 /*break*/, 6];
                    categoryId = processedCategories.get(categoryName);
                    return [3 /*break*/, 11];
                case 6: return [4 /*yield*/, client.execute({
                        sql: "SELECT id FROM Categories WHERE name = ?",
                        args: [categoryName],
                    })];
                case 7:
                    categoryCheck = _c.sent();
                    if (!(categoryCheck.rows.length > 0)) return [3 /*break*/, 8];
                    categoryId = categoryCheck.rows[0].id;
                    return [3 /*break*/, 10];
                case 8: return [4 /*yield*/, client.execute({
                        sql: "INSERT INTO Categories (name) VALUES (?) RETURNING id",
                        args: [categoryName],
                    })];
                case 9:
                    categoryResult = _c.sent();
                    categoryId = categoryResult.rows[0].id;
                    _c.label = 10;
                case 10:
                    // Store category ID for future reference
                    processedCategories.set(categoryName, categoryId);
                    _c.label = 11;
                case 11: 
                // 3. Create relationship in junction table
                return [4 /*yield*/, client.execute({
                        sql: "INSERT INTO PicturesCategories (categoryId, pictureId) VALUES (?, ?)",
                        args: [categoryId, pictureId],
                    })];
                case 12:
                    // 3. Create relationship in junction table
                    _c.sent();
                    _c.label = 13;
                case 13:
                    _a++;
                    return [3 /*break*/, 5];
                case 14:
                    _i++;
                    return [3 /*break*/, 2];
                case 15:
                    console.log("Migration completed successfully!");
                    return [3 /*break*/, 17];
                case 16:
                    error_1 = _c.sent();
                    console.error("Error during migration:", error_1);
                    return [3 /*break*/, 17];
                case 17: return [2 /*return*/];
            }
        });
    });
}
// Run migration
migrateGalleryToTurso();
