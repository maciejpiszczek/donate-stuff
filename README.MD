# Donate Stuff

Donate Stuff is a Django app that allows you to donate goods to the charity organisations.

## Tech Stack

Django, PostgreSQL, Docker

## Requirements

Donate Stuff requires the following to run:
* Python 3.11
* latest version of Docker
* latest version of docker-compose

## How to run?

1. Clone this GitHub repository (use one of the following commands, depending on what method you use)  
**HTTPS:**  
`git clone https://github.com/maciejpiszczek/donate-stuff.git`  
**SSH:**  
`git clone git@github.com:maciejpiszczek/donate-stuff.git`
2. Go to the project directory:  
`cd donate-stuff`
3. Provide .env file with necessary environmental variables (see env/.env-default for reference).
4. Start the server:  
`docker compose up --build`

## Usage

Once authenticated, the user can make a donation - in order to do that, one must fill in the multistep donation form.
If donation has been taken from the donor it can be archived.
