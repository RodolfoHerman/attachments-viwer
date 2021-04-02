import { Button, Chip, Grid, withStyles } from '@material-ui/core';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import DescriptionIcon from '@material-ui/icons/Description';
import ImageIcon from '@material-ui/icons/Image';
import React, { useEffect, useState } from 'react';
import * as fileUtils from '../utils/fileUtils';
import * as imageUtils from '../utils/imageUtils';
import * as pdfUtils from '../utils/pdfUtils';
import CustomDialog from './CustomDialog';
import ReactImageGallery from 'react-image-gallery';
import { ToastContainer, toast } from 'react-toastify';

const styles = (theme) => ({
    visualizacoAnexo: {
        [theme.breakpoints.between("xs", "sm")]: {
            width: "250px",
            height: "450px"
        },
        width: "450px",
        height: "650px",
        backgroundSize: "contain",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        backgroundColor: "#F5F6FA",
        border: "1rem solid #F5F6FA",
        borderRadius: 8
    },
    carousel: {
        '& .image-gallery-bullets-container button': {
            background: '#AAA !important',
            margin: 2
        },
        '& .image-gallery-bullets-container button.active': {
            backgroundColor: 'black !important'
        }
    },
    mt_2: {
        marginTop: 3
    },
    toast: {
        fontSize: 13,
        fontWeight: "bold"
    }
});

const DEFAULT_AMOUNT_OF_FILES = 100;

const ALLOWED_FILE_TYPES = [
    "application/pdf",
    "image/jpg",
    "image/jpeg",
    "image/png",
    "image/tiff"
];

const calculateAllowedAmountFiles = (amountOfFilesInCarousel, amountOfFiles) => {
    return amountOfFiles - amountOfFilesInCarousel;
}

const getFilesFromArrayToShow = (objectDTO) => {
    const {fileList, dataFiles, amountOfFiles, setInvalidTypes, setInvalidAmount} = objectDTO;
    
    const filesArray = getAllowedFileTypes(fileUtils.fileListToArray(fileList));
    const amountFiles = calculateAllowedAmountFiles(dataFiles.length, amountOfFiles);

    setInvalidTypes(filesArray.length !== fileList.length);

    if(amountFiles >= 0) {
        const filesToShowInCarousel = filesArray.splice(0, amountFiles);
        setInvalidAmount(!!filesArray.length);

        return filesToShowInCarousel;
    }

    return [];
};

const joinArrays = (dataFiles, newDataFiles) => ([...dataFiles, ...newDataFiles]);

const getAllowedFileTypes = (filesArray) => filesArray.filter(file => ALLOWED_FILE_TYPES.includes(file.type));

const buildCarouselImage = (image, classes) => {
    return {
        original: image,
        renderItem: () => (<div className={classes.visualizacoAnexo} style={{ backgroundImage: `url("${image}")` }} />)
    }
}

const buildImagesToShow = async (file, classes) => {
    const imagesToShow = [];

    if(fileUtils.isFileImageType(file)) {
        const image = await imageUtils.resize(file);
        imagesToShow.push(buildCarouselImage(image, classes));

    } else {
        const images = await pdfUtils.convertPdfToImage(file);
        imagesToShow.push(...images.map(image => buildCarouselImage(image, classes)));
    }

    return imagesToShow;
}

const getDataFilesToCarousel = (objectDTO) => {
    const fileArray = getFilesFromArrayToShow(objectDTO);

    if(!!fileArray.length) {
        objectDTO.setLoaded(true);
    }

    const dataFiles = Promise.all(fileArray.map(async (file) => {
        return {
            file: file,
            images: await buildImagesToShow(file, objectDTO.classes)
        }
    }));

    return dataFiles;
}

const getTypeIcon = (file) => {
    return fileUtils.isFileImageType(file)
        ? <ImageIcon />
        : <DescriptionIcon />;
}

const buildObject = (fileList, dataFiles, amountOfFiles, setInvalidTypes, setInvalidAmount, setLoaded, classes) => (
    {
        fileList: fileList,
        dataFiles: dataFiles,
        amountOfFiles: amountOfFiles,
        setInvalidTypes: setInvalidTypes,
        setInvalidAmount: setInvalidAmount,
        setLoaded: setLoaded,
        classes: classes
    }
);

const getAllowedFilesExtension = () => {
    return ALLOWED_FILE_TYPES.map(tipo => tipo.split("/")[1]).join(", ");
}

const AttachmentsViwer = ({
    classes,
    setFiles,
    setLoaded,
    amountOfFiles = DEFAULT_AMOUNT_OF_FILES
}) => {
    const [dataFiles, setDataFiles] = useState([]);
    const [showDialog, setShowDialog] = useState(false);
    const [imagesToShow, setImagesToShow] = useState([]);
    const [invalidTypes, setInvalidTypes] = useState(false);
    const [invalidAmount, setInvalidAmount] = useState(false);

    const fileUploadHandle = async (event) => {
        const objectDTO = buildObject(event.target.files, dataFiles, amountOfFiles, setInvalidTypes, setInvalidAmount, setLoaded, classes);
        const resp = await getDataFilesToCarousel(objectDTO);

        setDataFiles(joinArrays(dataFiles, resp));
        setLoaded(false);

        event.target.value = "";
    }

    const fileDeleteHandle = (index) => {
        dataFiles.splice(index, 1);
        setDataFiles([...dataFiles]);
    };

    const dialogClickHandle = (images) => {
        setShowDialog(true);
        setImagesToShow(images);
    };

    const dialogCloseHandle = () => {
        setShowDialog(false);
    }

    const callToast = (message) => {
        toast.warn(message, {
            position: "top-center",
            autoClose: 3500,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
            progress: undefined,
        });
    }

    useEffect(() => {
        setFiles(dataFiles.map(dataFile => dataFile.file));
    }, [dataFiles])

    useEffect(() => {
        if(invalidTypes) {
            callToast(`Permitido os tipos de arquivos "${getAllowedFilesExtension()}".`);
        }

        setInvalidTypes(false);
    }, [invalidTypes]);

    useEffect(() => {
        if(invalidAmount) {
            callToast(`Quantidade de arquivos permitidos: ${amountOfFiles}`);
        }

        setInvalidAmount(false);
    }, [invalidAmount]);

    return (
        <>
            <Grid
                container
                justify="center"
                direction="column"
                alignItems="center"
            >
                <Grid item>
                    <Button
                        component="label"
                        variant="contained"
                        color="default"
                        startIcon={<CloudUploadIcon />}
                    >
                        Upload
                        <input
                            type="file"
                            style={{ display: "none" }}
                            multiple={amountOfFiles > 1}
                            accept={ALLOWED_FILE_TYPES.join(",")}
                            onChange={fileUploadHandle}
                        />
                    </Button>
                </Grid>

                <Grid
                    container
                    justify="center"
                    direction="column"
                    alignItems="center"
                >
                    {
                        dataFiles.map((dataFile, index) =>
                            <Grid item className={classes.mt_2} key={`grid_${index}`}>
                                <Chip
                                    icon={getTypeIcon(dataFile.file)}
                                    label={fileUtils.nameReducer(dataFile.file.name)}
                                    onClick={() => dialogClickHandle(dataFile.images)}
                                    onDelete={() => fileDeleteHandle(index)}
                                />
                            </Grid>
                        )
                    }
                </Grid>
            </Grid>
            <CustomDialog
                onClose={ dialogCloseHandle }
                showDialog={showDialog}
            >
                <Grid
                    container
                    justify="center"
                    direction="column"
                    alignItems="center"
                    className={classes.carousel}
                >
                    <Grid item>
                        <ReactImageGallery 
                            items={imagesToShow}
                            showFullscreenButton={false}
                            showThumbnails={false}
                            showPlayButton={false}
                            showBullets={imagesToShow.length > 1}
                        />
                    </Grid>
                </Grid>
            </CustomDialog>
            <ToastContainer 
                position="top-center"
                autoClose={3500}
                hideProgressBar={true}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss={false}
                draggable
                pauseOnHover={false}
                className={classes.toast}
            />
        </>
    )
}

export default withStyles(styles)(AttachmentsViwer);
