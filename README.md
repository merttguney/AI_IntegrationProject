# ecom-async

## local development environment

copy .env.example as .env
run docker compose -f docker-compose.dev.yml up -d and start docker
yarn dev # will start producer "send message to rabbit mq"
yarn consume # actual process will be done

### sample request for basic process

curl --location 'http://localhost:3000/process' \
--header 'x-api-key: apikey' \
--header 'x-api-secret: apisecret' \
--header 'Content-Type: application/json' \
--data '{
"data": "test",
"operationType": "create",
"queueName": "order",
"websiteId": "1234"
}'
