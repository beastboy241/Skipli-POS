import React from "react";
import {Link} from 'react-router-dom';

const Product = () => {
    
    return(
        <div>
            <nav>
                <Link to="edit/1">Edit</Link>
            </nav>
        </div>
    );
}

export default Product;