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

## Model
In this section we list MongoDB schema:

Dataset Collection:
~~~~
{
    id: ObjectId(),
    name: ,
    most_recent_time: ,
    type: ,
    train_result: [
        {time: ,
         score_name1: ,
         score_name2: ,},
    ]
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

1. URL `/dataset_name/`:

~~~~
response = {
    dataset_name: ,
    most_recent_time: ,
    train_result: [
        {score_name1: ,
         score_name2: ,
         train_time: ,
        },
    ]
}
~~~~


### Maintenance
superuser:
1. name: D3M-Website
1. email: d3m@brown.edu
1. password: D3M-Website
















