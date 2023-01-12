# Blog API
[The Odin Project: Node] - Project: Blog API 

## Intro

-   The repos associated with project:
    -   [User View](https://github.com/salvillalon45/theOdinProject-BlogClientUser)
    -   [Admin View](https://github.com/salvillalon45/theOdinProject-BlogClientAdmin)
-   This is the Admin View which is part of the Blog API Project. The overall project is to create an api and two clients: User View and Admin View that call the same api. The purpose is to teach us how to create apis that can serve many frontends. We had liberty of choosing how we want to do the frontend so I decided to use Gatsby and Tailwind!
-   You can find more on the project here: [The Odin Project - Blog API](https://www.theodinproject.com/paths/full-stack-javascript/courses/nodejs/lessons/blog-api)

## Overall

-   In this project I continued practicing the following:

    -   Using JWT (passport-jwt)
    -   Using ES6 features and functions
    -   Writing reusable JS logic and utility functions
    -   I learned how passport has different strategies! In the past project, I used passport-local. In this project, I used passport-jwt.
    -   Also learned how to the whole JWT token process works and how the strategies come into play
    -   When developing the API, I noticed that there were many areas to make reusable logic and utility functions such as checking for passwords, validation errors of fields (fields not empty), and checking the result of db. I created many util functions to cover these cases and more
    -   One error that I came across constantly was this `ERR_HTTP_HEADERS_SENT`. The reason I will get this error is because I will handle the case for an error and send a res.status(). The response will be send, **but the code will continue executing**. This means it will try to do the res.status(200)!
    -   To fix this error, instead of doing a res.status for errors, I will use a `throw` statement. Then the `catch` will handle the error. This allowed me to only send one response at a time depending if it was a successful or failure operation
    -   Or another way to fix it is to use a `return` statement.

    ```
    return res.status(400).json({
      status: 'error',
      error: 'req body cannot be empty',
    });
    ```

    -   This article taught me about it: [Understanding Node Error ERR_HTTP_HEADERS_SENT](https://www.codementor.io/@oparaprosper79/understanding-node-error-err_http_headers_sent-117mpk82z8)

    -   Some resources that helped me develop the API
        -   [Understanding Node Error ERR_HTTP_HEADERS_SENT](https://www.codementor.io/@oparaprosper79/understanding-node-error-err_http_headers_sent-117mpk82z8)
        -   [Node.js API Authentication With JWT](https://youtu.be/7nafaH9SddU)**_This was a great video!_**
        -   [Passport JWT Strategy Configuration (Node + Passport + Express)](https://youtu.be/Ne0tLHm1juE) **_This was a great video!_**

## Next Steps

-   **On the next project, here are some things I want to learn and continue practicing**
    -   I want to practice better error handling messages. If I get an error from doing an API call will I use the same message that comes from the backend or use a different UI error message based on the error that I get from the server? Should the API be sending the friendly error message to the client so that the frontend developer can use the same error message and just pass it to the component. This is what I need clarification on
    -   Practice using files to export constanst and variable that I will use a lot in my app. This can come in handy for error messaging
    -   I want to simplify my code by using JS built in functions (DO NOT RECREATE THE WHEEL)
    -   Continue using nullish coalescing and learn other patterns
-   **New Things To Try**
    -   Typescript

## Technologies:

-   Heroku
-   Express
-   Node
-   JWT
