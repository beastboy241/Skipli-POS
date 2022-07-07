import React from "react";
import {Switch, Route} from 'react-router-dom';
import EditProduct from './edit';
import GridProduct from './grid';



function Product() {


    return(
        <Switch>
            <Route path="/product/edit/:productId" component={EditProduct} />
            <Route component={GridProduct} />
        </Switch>
    );
}

export default Product;