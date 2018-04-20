## Overview:
to understand how this project work, refer to:
https://github.com/mbrochh/django-reactjs-boilerplate/tree/master

bundle has already been generated by command `node_modules/.bin/webpack --config webpack.local.config.js
`, and all generated files are in ./djreact/static/bundles/local

### How to Run React:

1. `cd` to root directory
2. `npm install`
3. `pip install -r req.txt`
4. `node dev_server.js` to start webpack dev server
5. `python3 manage.py runserver` to start Django

### MongoDB Support
we use Djongo to connect with MongoDB, which can be found here:
https://github.com/nesdis/djongo.

## Collaberations
Jin Yan (jyan16)

## Model
In this section we list MongoDB schema:

Dataset Collection:
~~~~
{
    id: ,
    name: ,
    most_recent_time: ,
    type: ,
    metric: ,
}
~~~~

Result Collection:
~~~~
{
    id: ,
    time: ,
    RS_Score: ,
    HB_Score: ,
    BO_Score: ,
    AP_Score: ,
    Baseline_Score: ,
    RS_Duration: ,
    HB_Duration: ,
    BO_Duration: ,
    AP_Duration: ,
}
~~~~
Statistic Collection:
~~~~
{
    
}
~~~~


## View

## Control

### RESTful API
Our system uses AJAX to communicate between frontend and backend.

1. URL `upload/ POST['file_dir']`:
This url is used for post json file to server

1. URL `index`:

~~~~
response = {
    "TaskType": {
        datasets: [
            {name: ,
             our_score: ,
             base_score: ,
             time: ,},
        ],
        metric_name1: {
            score_name: {
                mean: ,
                high: ,
                min: ,
                average: ,
            },            
        },
        metric_name2: {
            score_name: {
                mean: ,
                max: ,
                min: ,
                avg: ,
            },            
        },
    },
}
~~~~

1. URL `dataset/ GET['data_name']`:
This API is used to get data of a specific dataset:

~~~~
response = {
    ok: ,
    data: DataSet,
    train: [
        Result1,
        Result2,
        ...
    ]
}
~~~~


### Maintenance

#### Superuser for Django

1. name: D3M-Website
1. email: d3m@brown.edu
1. password: D3M-Website

#### Add new field
If a user want to 

#### TODO

1. redesign schema to make the model flexible for changed standard (or just migrate?)
1. design statistic schema to store aggregate result (average score)
















