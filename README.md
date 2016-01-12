# Urban CO2

## About

This is an interactive web app to communicate the importance of cities as sources of CO2 emissions. In this web experience, we explain what we can do to monitor and reduce the impact of our carbon footprint. The project will highlight the potential and innovative use of mobile CO2 sensors to monitor CO2 in the city and also allow people to access the data that describes the CO2 emissions for the city of Vancouver, BC.

As part of a Mozilla Science Fellowship Sprint, we are working to help communicate scientific research and to show the process of creating such visualizations.


## Setup

This page is built on [Node.js]() and a handful of other handy technologies. Please follow the following steps to get setup.

I took the setup documentation from:

* [Setup nodejs with homebrew on osx](https://changelog.com/install-node-js-with-homebrew-on-os-x/)
* [setup mongodb with homebrew on osx](https://docs.mongodb.org/manual/tutorial/install-mongodb-on-os-x/)

### On OSX:

#### If you don't have Node.js Installed:
#### Homebrew

Fire up your terminal:

```
ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
```

Make sure your system is up to date by running:

```
brew update
```

As a safe measure, run brew doctor to make sure your system is ready to brew. Follow any recommendations from brew doctor.

```
brew doctor
```

you will have to then add homebrew to your computer's system path by pasting this into your terminal:

```
export PATH="/usr/local/bin:$PATH"
```

#### Install Node

You can now install node:

```
brew install node
```
Now you're ready to build the project.

#### Install Mongodb

We will use mongodb as our project database. You can install it using homebrew as well. Again, in your terminal run:

```
brew update
brew install mongodb
```

Now you will have a mongodb database setup on your computer. 

## Dependencies

#### Install project dependencies
Install the dependencies listed in the ```package.json```. You will use the ```npm install``` command in your terminal in the project directory. 

Fire up your terminal and:

```
cd urbanco2
npm install
```


## Run 

We will have to do 2 things:

1. Start our mongodb
2. Run our node server.

In the terminal. Run:

```
mongod
```

This will start our mongodb database running on our computer. We can then access the running mongodb database we create for the project from our node.js server.

Next in another terminal window, ```cd urbanco2``` and run:

```
nodemon server.js
```

*** 
more soon!
