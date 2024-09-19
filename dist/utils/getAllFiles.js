"use strict";
// get all files in a directory and return an array of their paths
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path")); // Get the path library.
const fs_1 = __importDefault(require("fs")); // Get the file system library.
exports.default = (directory, foldersOnly = false) => {
    //export the function
    let fileNames = []; // define fileNames as an array
    const files = fs_1.default.readdirSync(directory, { withFileTypes: true }); // get all files/folders in directory
    for (const file of files) {
        // loop through all files/folders
        const filePath = path_1.default.join(directory, file.name); // get file/folder path
        if (foldersOnly) {
            // if foldersOnly is true, only push folders to fileNames
            if (file.isDirectory()) {
                fileNames.push(filePath); // push folders to fileNames
            }
        }
        else {
            // if foldersOnly is false, push both files and folders to fileNames
            if (file.isFile()) {
                fileNames.push(filePath);
            }
        }
    }
    return fileNames; // return the array of file/folder paths
};
