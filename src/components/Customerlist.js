import React, { useState, useEffect } from 'react';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import { BrowserRouter, Switch, Route, Link } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Addcustomer from './Addcustomer';
import Editcustomer from './Editcustomer';
import Traininglist from './Traininglist';

export default function Customerlist() {
    // -- Customer data related functionality --
    const [customers, setCustomers] = useState([]);
    useEffect(() => fetchData(), []);

    const fetchData = () => {
        fetch('https://customerrest.herokuapp.com/api/customers')
        .then(response => response.json())
        .then(data => setCustomers(data.content))
        .catch(err => console.error(err))
    }

    const deleteCustomer = (link) => {
        if (window.confirm('Delete selected row?')) {
            fetch(link, {method: 'DELETE'})
            .then(res => fetchData())
            .catch(err => console.error(err))
        }
    }

    const saveCustomer = (customer) => {
        fetch('https://customerrest.herokuapp.com/api/customers', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(customer)
        })
        .then(res => fetchData())
        .catch(err => console.error(err))
    }

    const updateCustomer = (customer, link) => {
        fetch(link, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(customer)
        })
        .then(res => fetchData())
        .catch(err => console.error(err))
    }

    // -- Column data related functionality --
    const columns = [
        {
            Header: 'First name',
            accessor: 'firstname'
        },
        {
            Header: 'Last name',
            accessor: 'lastname'
        },
        {
            Header: 'Email',
            accessor: 'email'
        },
        {
            Header: 'Phone',
            accessor: 'phone'
        },
        {
            Header: 'Address',
            accessor: 'streetaddress'
        },
        {
            Header: 'Postcode',
            accessor: 'postcode'
        },
    
        {
            Header: 'City',
            accessor: 'city'
        },
        
        {
            filterable: false,
            sortable: false,
            width: 100,
            accessor: 'content.self.href',
            Cell: row => <Editcustomer updateCustomer={updateCustomer} customer={row.original} />
        },
        {
            sortable: false,
            filterable: false,
            width: 100,
            accessor: 'content.self.href',
            Cell: ({value}) => <Button color="secondary" size="small" onClick={() => deleteCustomer(value)}>Delete</Button>
        }
    ]

    return (
        <div>
            <BrowserRouter>
                <div>
                <Button color="primary" variant="outlined" style={{margin: 10}} component={Link} to={'/trainings'}>Trainings</Button>
                    <Switch>
                        <Route exact path="/trainings" component={Traininglist} />
                    </Switch>
                </div>
            </BrowserRouter>
            <Addcustomer saveCustomer={saveCustomer} />
            <ReactTable filterable={true} data={customers} columns={columns} />
        </div>
    );
}