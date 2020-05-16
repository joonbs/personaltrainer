import React, { useState, useEffect } from 'react';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import Button from '@material-ui/core/Button';
import Addtraining from './Addtraining';
import Edittraining from './Edittraining';

export default function Traininglist() {
    // -- Trainings data related functionality --
    const [trainings, setTrainings] = useState([]);
    useEffect(() => fetchData(), []);

    const fetchData = () => {
        fetch('https://customerrest.herokuapp.com/gettrainings/')
        .then(response => response.json())
        .then(data => setTrainings(data))
        .catch(err => console.error(err))
    }

    const deleteTraining = (link) => {
        if (window.confirm('Delete selected row?')) {
            fetch(link, {method: 'DELETE'})
            .then(res => fetchData())
            .catch(err => console.error(err))
        }
    }

    const saveTraining = (training) => {
        fetch('https://customerrest.herokuapp.com/gettrainings/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(training)
        })
        .then(res => fetchData())
        .catch(err => console.error(err))
    }

    const updateTraining = (training, link) => {
        fetch(link, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(training)
        })
        .then(res => fetchData())
        .catch(err => console.error(err))
    }

    // -- Column data related functionality --
    const columns = [
        {
            Header: 'Date',
            accessor: 'date'
        },
        {
            Header: 'Duration',
            accessor: 'duration'
        },
        {
            Header: 'Activity',
            accessor: 'activity'
        },
        {
            Header: 'Customer',
            accessor: 'firstname'
        },
        {
            filterable: false,
            sortable: false,
            width: 100,
            accessor: 'id',
            Cell: row => <Edittraining updateTraining={updateTraining} training={row.value} />
        },
        {
            sortable: false,
            filterable: false,
            width: 100,
            accessor: 'id',
            Cell: ({value}) => <Button color="secondary" size="small" onClick={() => deleteTraining(value)}>Delete</Button>
        }
    ]

    return (
        <div>
            <Addtraining saveTraining={saveTraining} />
            <ReactTable filterable={true} data={trainings} columns={columns} />
        </div>
    );
}