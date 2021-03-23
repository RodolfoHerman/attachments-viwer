import { Typography } from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import IconButton from "@material-ui/core/IconButton";
import { withStyles } from "@material-ui/core/styles";
import CloseIcon from '@material-ui/icons/Close';
import React from "react";

const styles = () => ({
    closeButton: {
        position: 'absolute',
        right: '1px',
        top: '1px',
        color: 'gray',
    },
    dialogContent: {
        overflow: 'hidden'
    }
});

const DialogTitle = (props => {
    return (
        <MuiDialogTitle disableTypography>
            <Typography variant="h6">
                { props.children }
            </Typography>
            {
                props.onClose 
                    ? (<IconButton aria-label="close" className={props.classes.closeButton} onClick={props.onClose}>
                            <CloseIcon />
                        </IconButton>) 
                    : null
            }
        </MuiDialogTitle>
    );
});

const CustomDialog = ({
    classes,
    onClose,
    showDialog,
    title,
    children
}) => {
    return (
        <Dialog 
            onClose={onClose}
            open={showDialog}
        >
            <DialogTitle
                id="dialog-title"
                classes={classes}
                children={title}
                onClose={onClose}
            />
            <DialogContent 
                dividers
                className={classes.dialogContent}
            >
                {children}
            </DialogContent>
        </Dialog>
    ) 
} 

export default withStyles(styles)(CustomDialog);
