import React, { useState, useEffect } from 'react';
import { InputLabel, Select, MenuItem, Button, Grid, Typography } from '@material-ui/core';
import { useForm, FormProvider } from 'react-hook-form';
import FormInput from './CustomTextField';
import { Link } from 'react-router-dom';

import { commerce } from '../../lib/commerce';

const AddressForm = ({ checkoutToken, next }) => {

    const[shippingCountries, setShippingCountries] = useState([])
    const[shippingCountry, setShippingCountry] = useState('')
    const[shippingSubdivisions, setShippingSubdivisions] = useState([])
    const[shippingSubdivision, setShippingSubdivision] = useState('')
    const[shippingOptions, setShippingOptions] = useState([])
    const[shippingOption, setShippingOption] = useState('')

    const methods = useForm();
    //Object.entries(shippingCountries): mean covert object into 2D array
    const countries = Object.entries(shippingCountries).map(([code, name]) => ({id: code, label: name}))
    //console.log(Object.entries(shippingCountries))
    console.log('countries: ', countries);

    const subdivisions = Object.entries(shippingSubdivisions).map(([code, name]) => ({id: code, label: name}))
    const options = shippingOptions.map((item) =>
        (
            { id:item.id, label: `${item.description} - (${item.price.formatted_with_symbol})` }
        )
    )
   // ({id: item.id, label: `${item.description} - (${item.price.formatted_with_symbol})`}))

    const fetchShippingCountries = async (checkoutTokenId) => {
        const { countries } = await commerce.services.localeListShippingCountries(checkoutTokenId);
        //console.log(countries)
        setShippingCountries(countries)
        setShippingCountry(Object.keys(countries)[0])

    }

    const fetchSubdivisions = async (countryCode) => {
        const { subdivisions } = await commerce.services.localeListSubdivisions(countryCode);
        setShippingSubdivisions(subdivisions)
        setShippingSubdivision(Object.keys(subdivisions)[0]);
    }

    const fetchShippingOptions = async (checkoutTokenId, country, region = null) => {
        const options = await commerce.checkout.getShippingOptions(checkoutTokenId, { country, region })
        setShippingOptions(options);
        setShippingOption(options[0].id)
    }

    useEffect(() => {
        fetchShippingCountries(checkoutToken.id)
    }, [])

    useEffect(()=>{
        if(shippingCountry) fetchSubdivisions(shippingCountry)
    },[shippingCountry])

    useEffect(()=>{
        if(shippingSubdivision) fetchShippingOptions(checkoutToken.id, shippingCountry, shippingSubdivision);
    },[shippingSubdivision])


    return(
        <>
        <Typography variant="h6" gutterBottom>Shipping Address</Typography>

        <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit((data) => next({ ...data, shippingCountry, shippingSubdivision, shippingOption }) )}>
                <Grid container spacing={3}>
                    <FormInput required name='firstName' label='First Name' />
                    <FormInput required name='lastName' label='Last Name' />
                    <FormInput required name='address1' label='Address' />
                    <FormInput required name='email' label='Email' />
                    <FormInput required name='city' label='City' />
                    <FormInput required name='ZIP' label='ZIP / Postal code' />
                    <Grid item xs={12} sm={6}>
                       <InputLabel>Shipping Country</InputLabel>
                       <Select value={shippingCountry} fullWidth onChange={(e) => setShippingCountry(e.target.value)}>

                            {countries.map((item) => (
                                <MenuItem key={item.id} value={item.id}>
                                    {item.label}
                                </MenuItem>
                            ) )}

                       </Select>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                       <InputLabel>Shipping Subdivision</InputLabel>
                       <Select value={shippingSubdivision} fullWidth onChange={(e) => setShippingSubdivision(e.target.value)}>

                            {subdivisions.map((subdivision) => (
                                <MenuItem key={subdivision.id} value={subdivision.id}>
                                    {subdivision.label}
                                </MenuItem>
                            ) )}

                       </Select>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                       <InputLabel>Shipping Options</InputLabel>
                       <Select value={shippingOption} fullWidth onChange={
                        (e) => setShippingOption(e.target.value)
                       }>
                             {options.map((item) => (
                                <MenuItem key={item.id} value={item.id}>
                                    {item.label}
                                </MenuItem>
                            ) )}
                       </Select>
                    </Grid>




                </Grid><br />
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Button component={Link} to ='/cart' variant='outlined'>Back to Cart</Button>
                    <Button type='submit' color='primary' variant='contained'>Next</Button>

                </div>
            </form>

        </FormProvider>

        </>
    )
}

export default AddressForm