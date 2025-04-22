import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {useFetchProductByIdQuery, useUpdateProductMutation} from '../../../../redux/features/products/productsApi'
import { useSelector } from 'react-redux';
import TextInput from '../addProduct/TextInput';
import SelectInput from '../addProduct/SelectInput';
import UploadImage from '../addProduct/UploadImage';

const categories = [
    { label: 'أختر عنصر', value: '' },
    { label: 'بخور', value: 'بخور' },
    { label: 'عطور', value: 'عطور' },
    { label: 'مخمريات', value: 'مخمريات' },
    { label: 'لوشنات', value: 'لوشنات' },
    { label: 'معطرات', value: 'معطرات' },
    { label: 'دهن عود', value: 'دهن_عود' },
    { label: 'مسك', value: 'مسك' },
    { label: 'زيوت عطرية', value: 'زيوت_عطرية' },
    { label: 'كماليات', value: 'كماليات' }
];

// const colors = [
//     { label: 'Select Color', value: '' },
//     { label: 'Black', value: 'black' },
//     { label: 'Red', value: 'red' },
//     { label: 'Gold', value: 'gold' },
//     { label: 'Blue', value: 'blue' },
//     { label: 'Silver', value: 'silver' },
//     { label: 'Beige', value: 'beige' },
//     { label: 'Green', value: 'green' }
// ];


const UpdateProduct = () => {
    const {id} = useParams();
    const navigate =  useNavigate();
    const {user} = useSelector((state) => state.auth)
    const [product, setProduct] = useState({
        name: '',
        category: '',
        // color: '',
        price: '',
        description: '',
        image: ''
    })

    const {data: productData, isLoading: isProductLoading, error: fetchError, refetch} = useFetchProductByIdQuery(id);

    const [newImage, setNewImage] = useState(null)

    const {name, category,
        //  color, 
         description, image: imageURL, price } = productData?.product || {};

    const [updateProduct, {isLoading:isUpdating, error: updateError}] = useUpdateProductMutation();

    useEffect(()=> {
        if(productData){
            setProduct({
                name: name || '',
                category: category || '',
                // color: color || '',
                price: price || '',
                description: description || '',
                image: imageURL || ''
            })
        }
    }, [productData])

    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setProduct({
            ...product,
            [name]: value
        });


    };

    const handleImageChange= (image) => {
        setNewImage(image);
    }

    const handleSubmit =  async (e) => {
        e.preventDefault();

        const updatedProduct = {
            ...product,
            image: newImage ? newImage : product.image, 
            author: user?._id
        };

        try {
            await updateProduct({id: id, ...updatedProduct}).unwrap();
            alert('تم تحديث المنتج بنجاح');
            await refetch();
            navigate("/dashboard/manage-products")
        } catch (error) {
            console.error('Failed to update product:', error);
        }

    }

    if(isProductLoading) return <div>تحميل ...</div>
    if(fetchError) return <div>Error fetching product!...</div>
  return (
    <div className='container mx-auto mt-8'>
        <h2 className='text-2xl font-bold mb-6'>تحديث المنتج </h2>
        <form onSubmit={handleSubmit} className='space-y-4'>
                <TextInput
                label="أسم المنتج"
                name="name"
                placeholder="Ex: Diamond Earrings"
                value={product.name}
                onChange={handleChange}
                />
                <SelectInput
                    label="صنف المنتج"
                    name="category"
                    value={product.category}
                    onChange={handleChange}
                    options={categories}
                />
                {/* <SelectInput
                    label="Color"
                    name="color"
                    value={product.color}
                    onChange={handleChange}
                    options={colors}
                /> */}
                <TextInput
                    label="السعر"
                    name="price"
                    type="number"
                    placeholder="50"
                    value={product.price}
                    onChange={handleChange}
                />

                 <UploadImage
                name="image"
                id="image"
                value={newImage || product.image}
                placeholder='Image'
                setImage={handleImageChange}
                />
                <div>
                <label htmlFor="description" className='block text-sm font-medium text-gray-700'>الوصف</label>
                <textarea name="description" id="description"
                className='add-product-InputCSS'
                value={product.description}
                placeholder='Write a product description'
                onChange={handleChange}
                ></textarea>
                </div>

                <div>
                    <button type='submit'
                    className='add-product-btn'
                   
                    >{isUpdating ? 'Updating...' : 'Update Product'}</button>
                </div>

        </form>
    </div>
  )
}

export default UpdateProduct