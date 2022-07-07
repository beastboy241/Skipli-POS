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
import AppPageLoading from '../../../components/AppPageLoading'
import { useCollection } from 'react-firebase-hooks/firestore'

import { Link } from 'react-router-dom'
import { currency } from '../../../utils/formatter'



function GridProduct(){
    const classes = useStyles();
    const { firestore, storage, user} = useFirebase()
    const productRef = firestore.collection(`restaurant/${user.uid}/product`)
    const [snapshot, loading] = useCollection(productRef)
    const [productItems, setProductItems] = useState([])
    const [openAddDialog, setOpenAddDialog] = useState(false)

    useEffect(() => {
        if (snapshot) {
            setProductItems(snapshot.docs)
        }
    }, [snapshot])

    if (loading) {
        return <AppPageLoading/>
    }

    const handleDelete = productDoc => async e => {
        if (window.confirm('Are you sure to remove this product?')) {
            await productDoc.ref.delete()
            const photoURL = productDoc.data().photo
            if (photoURL) {
                await storage.refFromURL(photoURL).delete()
            }
        }
    }






    return(
        <>
        <h1> Grid Product</h1>
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
                            productData.photo && <CardMedia className={classes.photo} image={productData.photo} title={productData.name}/>
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
                                <IconButton onClick={handleDelete(productDoc)}>
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