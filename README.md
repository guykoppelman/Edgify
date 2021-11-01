# Edgify
EUR2USD Home task
# General concepts and asamptions
   # Perormance
    1.The 3prt currency exchange rate service could be slow, thus the API could not be able to  manage
    A big csv input
    2. A perferable way will probably by another API such as Ws or any masaging channel
   # security
   The security that is used in this task is only for demonstrating the the common tooling used for securing Web API for exapmle password hashing and Jwt.

   In areal production API server we should be using best practice and industrial tools. such as AWS cognito, real Databasees, etc...
    
   # working flow
    1. perform login => POST: http://localhost:8080/login

    ****************************************************** 
         user: 'guy'
         password: '123456'
    ******************************************************

   # curl example:
      curl -X POST \
      http://localhost:8080/api/login \
      -H 'cache-control: no-cache' \
      -H 'content-type: application/x-www-form-urlencoded' \
      -H 'postman-token: 81b1c810-c282-9176-ee39-b40c635762ad' \
      -d 'user=guy&password=123456'
    
    The login API returns a token. this token should be used in the folowing steps. the token returns from the login sould be placed in the request (authorization HTTP Header) for step1 and step2 => POST: http://localhost:8080/api/step12
    The request accept csv file upload via POST request.

   # !!! Plese add the "Bearer" string in front of the heaver value
    
   # curl example:
      curl -X POST \
      http://localhost:8080/api/step12 \
      -H 'authorization: Bearer <the token recieived form the login>' \
      -H 'cache-control: no-cache' \
      -H 'content-type: multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW' \
      -H 'postman-token: aa1adec9-2766-974e-3053-a27221e86e0e' \
      -F file=@file-20-Market.csv
 
   # input data
      There are two csv sample files in the repo, one with market inserts for step2 and anotherone without market inputs, for step1
 
   # Docker
     The docker file created for this task is placed in the github repo
      
      To pull the docker image use:
         docker pull guykoppelman/eur2usd-web-app

