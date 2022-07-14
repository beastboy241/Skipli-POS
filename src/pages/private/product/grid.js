import React, { useState, useEffect } from 'react';
// material-ui
import Fab from '@material-ui/core/Fab'
import AddIcon from '@material-ui/icons/Add'
import Grid from '@material-ui/core/Grid'
import Card from '@material-ui/core/Card'
import CardMedia from '@material-ui/core/CardMedia'
import CardContent from '@material-ui/core/CardContent'
import CardActions from '@material-ui/core/CardActions'
import Typography from '@material-ui/core/Typography'
import ImageIcon from '@material-ui/icons/Image'
import IconButton from '@material-ui/core/IconButton'
import EditIcon from '@material-ui/icons/Edit'
import DeleteIcon from '@material-ui/icons/Delete'

import useStyles from './styles/grid'
import AddDialog from './add';

import { useFirebase } from '../../../components/FirebaseProvider'
import AppLoading from '../../../components/AppPageLoading'
import { useCollection } from 'react-firebase-hooks/firestore'

import { Link } from 'react-router-dom'
import { currency } from '../../../utils/formatter'
import { useSnackbar } from 'notistack'


function GridProduct(){
    const classes = useStyles();
    const { firestore, storage, user} = useFirebase()
    const productRef = firestore.collection(`restaurant/${user.uid}/product`)
    const [snapshot, loading] = useCollection(productRef)
    const [productItems, setProductItems] = useState([])
    const [openAddDialog, setOpenAddDialog] = useState(false)
    const { enqueueSnackbar } = useSnackbar()

    useEffect(() => {
        if (snapshot) {
            setProductItems(snapshot.docs)
        }
    }, [snapshot])

    if (loading) {
        return <AppLoading/>
    }

    const handleDelete = (id) => async e => {
        if (window.confirm('Are you sure to remove this product?')) {
            productRef.doc(id)
            .delete()
            .catch(err => {
                enqueueSnackbar(err.message, {variant: 'error'})
            })
            const photoURL = id.data().photo
            if (photoURL) {
                await storage.refFromURL(photoURL).delete()
            }
            //await productDoc.ref.delete
            /* 
            var query = productRef.productDoc.id.get()
            .then(snapshot => {
                snapshot.forEach(doc => {
                   // let id = doc.id;
                   // let data = doc.data()
                    console.log(doc.id, '=>', doc.data());
                    var deleteDoc = productRef.doc(doc.id).delete();
                    enqueueSnackbar('Product data is deleted', {variant: 'success'})
                    setSomethingChange(false)
                })
            }) 
            */
        
            
            
            
        }
    }






    return(
        <>
        <h1> Menu Product</h1>
            <Typography
              variant="h5"
              component="h1"
              paragraph
            >
              Product List
            </Typography>
            {
              productItems.length <= 0 && <Typography>No Product Data Yet</Typography>
            }
            <Grid   container
                    spacing={5}>

            
            { productItems.map((productDoc) => {
                const productData = productDoc.data()
                return <Grid    key= { productDoc.id}
                                item= {true}
                                xs={12}
                                sm={12}
                                md={6}
                                lg={4}
                        >
                        <Card className={classes.card}>
                            {
                            productData.photo && <CardMedia src={productData.photo} className={classes.media} component="img" height="110" title={productData.name}/>
                            } 
                            {
                                !productData.photo && <div className={classes.photoPlaceholder}><ImageIcon size="large" color="disabled" /> </div>
                            }
                            <CardContent className={classes.productDetails}>
                                
                            <Typography variant="h5"
                                        noWrap>
                                {productData.name}
                            </Typography>
                            <Typography variant="subtitle1">
                                Price: {currency(productData.price)}
                            </Typography>
                            <Typography>
                                Stock: {productData.stock}
                            </Typography>
                            </CardContent>
                            <CardActions className={classes.productActions}>
                                <IconButton component={Link} to={`/product/edit/${productDoc.id}`}>
                                    <EditIcon/>
                                </IconButton>
                                <IconButton onClick={handleDelete(`${productDoc.id}`) }>
                                    <DeleteIcon/>
                                </IconButton>
                            </CardActions>



                        </Card>

                        </Grid>
            })
            }
        </Grid>
        <Fab className={classes.fab}
                color="primary"
                onClick={(e) => {
                    setOpenAddDialog(true)
                }}
        >
            <AddIcon/>
        </Fab>
        <AddDialog open={openAddDialog}
                    handleClose={() => {
                        setOpenAddDialog(false)
                    }}
        />

        </>
        
    );
}

export default GridProduct;