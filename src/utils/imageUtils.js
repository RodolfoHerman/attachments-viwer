import Resizer from 'react-image-file-resizer';

export const resize = (image) => new Promise(resolve => {
    Resizer.imageFileResizer(
        image, 
        800, 
        600, 
        'JPEG', 
        60, 
        0,
        uri => { resolve(uri); },
        'base64',
        800,
        600
    );
})