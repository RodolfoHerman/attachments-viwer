const MAX_CHARACTER = 10;

export const readFileData = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (event) => {
            resolve(event.target.result);
        }

        reader.onerror = (error) => {
            reject(error);
        }

        reader.readAsDataURL(file);
    });
};

export const nameReducer = (fileName) => {
    const split = fileName.split(".");
    if(split[0].length > MAX_CHARACTER) {
        split[0] = split[0].substring(0, MAX_CHARACTER);
    }

    return split.join(".");
}

export const fileListToArray = (fileList) => {
    return [].slice.call(fileList);
}

export const isFileImageType = (file) => {
    return file.type.includes("image");
}
